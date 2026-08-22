'use strict';

const fs = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');

const SCHEMA_VERSION = 1;
const READY_THRESHOLD = 70;
const REVISE_THRESHOLD = 40;
const KEBAB_CASE_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const LIMITATIONS = [
  'This tool does not verify that any evidence[].source_reference is real, accurate, or reachable.',
  'This tool does not assess market demand, commercial viability, or whether any claim in the idea is true.',
  'research_readiness_score reflects structural documentation completeness only, not idea quality or likelihood of success.',
];

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function describeType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function isKebabCase(value) {
  return typeof value === 'string' && KEBAB_CASE_RE.test(value);
}

function requireString(obj, key, errors, pathPrefix) {
  const fieldPath = pathPrefix ? `${pathPrefix}.${key}` : key;
  if (!(key in obj)) {
    errors.push(`${fieldPath}: missing required field`);
    return false;
  }
  const value = obj[key];
  if (typeof value !== 'string' || value.trim() === '') {
    errors.push(`${fieldPath}: expected non-empty string, got ${describeType(value)}`);
    return false;
  }
  return true;
}

function requireKebabCase(value, fieldPath, errors) {
  if (!isKebabCase(value)) {
    errors.push(`${fieldPath}: "${value}" must be kebab-case`);
    return false;
  }
  return true;
}

// Optional container: absent is fine (returns null, no error); present-but-wrong-type is an error.
function optionalObject(parent, key, errors) {
  if (!(key in parent)) return null;
  if (!isPlainObject(parent[key])) {
    errors.push(`${key}: expected object, got ${describeType(parent[key])}`);
    return null;
  }
  return parent[key];
}

// A field within an optional container is itself optional (absence just means "not yet
// documented" and is scored, not rejected); if present it must be a valid non-empty string.
function isNonEmptyStringField(obj, key, containerPath, errors) {
  if (!(key in obj)) return false;
  const value = obj[key];
  if (typeof value !== 'string' || value.trim() === '') {
    errors.push(`${containerPath}.${key}: expected non-empty string, got ${describeType(value)}`);
    return false;
  }
  return true;
}

/**
 * Reads the subset of config/ecosystem.yaml this module needs, and verifies its shape.
 * Throws (does not return errors) because a malformed ecosystem.yaml is a tool-level
 * configuration failure, not something the idea input can cause.
 */
function derivePolicy(ecosystemDoc) {
  if (!isPlainObject(ecosystemDoc)) {
    throw new Error('config/ecosystem.yaml: expected a YAML mapping (object) at the root');
  }
  const { version, qa, approval_required: approvalRequired, channels } = ecosystemDoc;

  if (typeof version !== 'number') {
    throw new Error('config/ecosystem.yaml: version must be a number');
  }
  if (
    !isPlainObject(qa) ||
    typeof qa.min_score !== 'number' ||
    typeof qa.scale !== 'number' ||
    typeof qa.mandatory_before_publish !== 'boolean'
  ) {
    throw new Error('config/ecosystem.yaml: qa section is missing or malformed');
  }
  if (!Array.isArray(approvalRequired)) {
    throw new Error('config/ecosystem.yaml: approval_required must be an array');
  }
  if (!isPlainObject(channels) || typeof channels.primary !== 'string' || !Array.isArray(channels.expansion)) {
    throw new Error('config/ecosystem.yaml: channels section is missing or malformed');
  }

  return {
    ecosystem_version: version,
    qa_min_score: qa.min_score,
    qa_scale: qa.scale,
    qa_mandatory_before_publish: qa.mandatory_before_publish,
    approval_required: approvalRequired.slice(),
    channels: { primary: channels.primary, expansion: channels.expansion.slice() },
  };
}

/**
 * Evaluates one idea document against `policy` (the shape returned by derivePolicy).
 * Never throws on malformed input: returns { valid: false, errors } instead.
 * This is a deterministic research-readiness *preflight* — it measures documentation
 * completeness and referential integrity only. It does not judge whether any claim is
 * true, whether evidence is real, or whether the idea has market potential.
 */
function evaluateIdea(idea, policy) {
  const errors = [];

  if (!isPlainObject(idea)) {
    return { valid: false, errors: [`root: expected an object, got ${describeType(idea)}`] };
  }

  requireString(idea, 'id', errors) && requireKebabCase(idea.id, 'id', errors);

  const kindOk = requireString(idea, 'kind', errors);
  if (kindOk && idea.kind !== 'product' && idea.kind !== 'content') {
    errors.push(`kind: expected "product" or "content", got ${JSON.stringify(idea.kind)}`);
  }

  requireString(idea, 'title', errors);

  const channelOk = requireString(idea, 'target_channel', errors);
  let channelAlignment = null;
  if (channelOk) {
    if (idea.target_channel === policy.channels.primary) {
      channelAlignment = 'primary';
    } else if (policy.channels.expansion.includes(idea.target_channel)) {
      channelAlignment = 'expansion';
    } else {
      errors.push(
        `target_channel: "${idea.target_channel}" is not configured in config/ecosystem.yaml ` +
          `(expected "${policy.channels.primary}" or one of: ${policy.channels.expansion.join(', ')})`
      );
    }
  }

  const problem = optionalObject(idea, 'problem', errors);
  const problemFieldsPresent = problem
    ? ['statement', 'current_alternative', 'desired_outcome'].filter((key) =>
        isNonEmptyStringField(problem, key, 'problem', errors)
      )
    : [];

  const audience = optionalObject(idea, 'target_audience', errors);
  const audienceFieldsPresent = audience
    ? ['segment', 'context'].filter((key) => isNonEmptyStringField(audience, key, 'target_audience', errors))
    : [];

  const assumptions = [];
  if ('assumptions' in idea) {
    if (!Array.isArray(idea.assumptions)) {
      errors.push(`assumptions: expected array, got ${describeType(idea.assumptions)}`);
    } else {
      const seenIds = new Map();
      idea.assumptions.forEach((item, i) => {
        const itemPath = `assumptions[${i}]`;
        if (!isPlainObject(item)) {
          errors.push(`${itemPath}: expected object, got ${describeType(item)}`);
          return;
        }
        const idOk = requireString(item, 'id', errors, itemPath) && requireKebabCase(item.id, `${itemPath}.id`, errors);
        const claimOk = requireString(item, 'claim', errors, itemPath);
        if (idOk) {
          if (seenIds.has(item.id)) {
            errors.push(`assumptions[].id: duplicate value "${item.id}" at indices ${seenIds.get(item.id)} and ${i}`);
          } else {
            seenIds.set(item.id, i);
          }
        }
        if (idOk && claimOk) assumptions.push({ id: item.id, claim: item.claim });
      });
    }
  }
  const assumptionIdSet = new Set(assumptions.map((a) => a.id));

  const evidence = [];
  if ('evidence' in idea) {
    if (!Array.isArray(idea.evidence)) {
      errors.push(`evidence: expected array, got ${describeType(idea.evidence)}`);
    } else {
      const seenIds = new Map();
      idea.evidence.forEach((item, i) => {
        const itemPath = `evidence[${i}]`;
        if (!isPlainObject(item)) {
          errors.push(`${itemPath}: expected object, got ${describeType(item)}`);
          return;
        }
        const idOk = requireString(item, 'id', errors, itemPath) && requireKebabCase(item.id, `${itemPath}.id`, errors);
        const claimOk = requireString(item, 'claim', errors, itemPath);
        const sourceTypeOk =
          requireString(item, 'source_type', errors, itemPath) &&
          requireKebabCase(item.source_type, `${itemPath}.source_type`, errors);
        const sourceRefOk = requireString(item, 'source_reference', errors, itemPath);

        if (idOk) {
          if (seenIds.has(item.id)) {
            errors.push(`evidence[].id: duplicate value "${item.id}" at indices ${seenIds.get(item.id)} and ${i}`);
          } else {
            seenIds.set(item.id, i);
          }
        }

        const supportsIds = [];
        if (!Array.isArray(item.supports_assumption_ids)) {
          errors.push(
            `${itemPath}.supports_assumption_ids: expected array, got ${describeType(item.supports_assumption_ids)}`
          );
        } else {
          const seenRefs = new Set();
          item.supports_assumption_ids.forEach((ref, j) => {
            const refPath = `${itemPath}.supports_assumption_ids[${j}]`;
            if (typeof ref !== 'string' || ref.trim() === '') {
              errors.push(`${refPath}: expected non-empty string, got ${describeType(ref)}`);
              return;
            }
            if (seenRefs.has(ref)) {
              errors.push(`${itemPath}.supports_assumption_ids: duplicate reference "${ref}"`);
              return;
            }
            seenRefs.add(ref);
            if (!assumptionIdSet.has(ref)) {
              errors.push(`${refPath}: references unknown assumption id "${ref}"`);
              return;
            }
            supportsIds.push(ref);
          });
        }

        if (idOk && claimOk && sourceTypeOk && sourceRefOk) {
          evidence.push({ id: item.id, claim: item.claim, supports_assumption_ids: supportsIds });
        }
      });
    }
  }

  const alternatives = [];
  if ('alternatives' in idea) {
    if (!Array.isArray(idea.alternatives)) {
      errors.push(`alternatives: expected array, got ${describeType(idea.alternatives)}`);
    } else {
      idea.alternatives.forEach((item, i) => {
        const itemPath = `alternatives[${i}]`;
        if (!isPlainObject(item)) {
          errors.push(`${itemPath}: expected object, got ${describeType(item)}`);
          return;
        }
        const nameOk = requireString(item, 'name', errors, itemPath);
        const diffOk = requireString(item, 'difference', errors, itemPath);
        if (nameOk && diffOk) alternatives.push({ name: item.name, difference: item.difference });
      });
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // ---- scoring: reached only once the input is structurally and referentially sound ----

  const problemScore = Math.round((20 * problemFieldsPresent.length) / 3);
  const audienceScore = Math.round((20 * audienceFieldsPresent.length) / 2);

  const supportedAssumptionIds = new Set();
  for (const e of evidence) for (const ref of e.supports_assumption_ids) supportedAssumptionIds.add(ref);
  const evidenceScore =
    assumptions.length === 0 ? 0 : Math.round((20 * supportedAssumptionIds.size) / assumptions.length);

  const channelScore = channelAlignment === 'primary' ? 20 : 12;

  // Full credit at 2 named alternatives; partial credit at 1; matches "depth over breadth
  // of comparison" rather than rewarding an arbitrarily long list.
  const alternativesScore = Math.min(20, alternatives.length * 10);

  const breakdown = {
    problem_definition: problemScore,
    audience_definition: audienceScore,
    evidence_coverage: evidenceScore,
    channel_alignment: channelScore,
    alternatives_coverage: alternativesScore,
  };
  const total = Object.values(breakdown).reduce((sum, value) => sum + value, 0);

  const readiness =
    total >= READY_THRESHOLD ? 'ready-for-research' : total >= REVISE_THRESHOLD ? 'revise-input' : 'insufficient-input';

  const missingEvidence = assumptions
    .filter((a) => !supportedAssumptionIds.has(a.id))
    .map((a) => ({ assumption_id: a.id, claim: a.claim }));

  const risks = [];
  if (problemFieldsPresent.length < 3) {
    risks.push({
      severity: 'medium',
      message: `problem definition incomplete: ${3 - problemFieldsPresent.length} of 3 fields missing`,
    });
  }
  if (audienceFieldsPresent.length < 2) {
    risks.push({
      severity: 'medium',
      message: `audience definition incomplete: ${2 - audienceFieldsPresent.length} of 2 fields missing`,
    });
  }
  if (assumptions.length === 0) {
    risks.push({ severity: 'high', message: 'no assumptions declared' });
  } else if (missingEvidence.length > 0) {
    risks.push({
      severity: 'high',
      message: `${missingEvidence.length} of ${assumptions.length} assumptions have no supporting evidence`,
    });
  }
  if (channelAlignment === 'expansion') {
    risks.push({
      severity: 'low',
      message: `target_channel is an expansion channel; "${policy.channels.primary}" is the ecosystem's primary channel`,
    });
  }
  if (alternatives.length === 0) {
    risks.push({ severity: 'medium', message: 'no alternatives declared' });
  }

  const nextActions = [];
  if (problemFieldsPresent.length < 3) {
    nextActions.push('Complete the missing problem.* fields (statement, current_alternative, desired_outcome).');
  }
  if (audienceFieldsPresent.length < 2) {
    nextActions.push('Complete target_audience.segment and target_audience.context.');
  }
  if (assumptions.length === 0) {
    nextActions.push('Declare at least one assumption this idea depends on.');
  }
  for (const m of missingEvidence) {
    nextActions.push(`Add evidence supporting assumption "${m.assumption_id}".`);
  }
  if (alternatives.length < 2) {
    nextActions.push('Name at least one more alternative and state how this idea differs from it.');
  }

  return {
    valid: true,
    idea_id: idea.id,
    module: 'research-market-validation',
    schema_version: SCHEMA_VERSION,
    readiness,
    research_readiness_score: { total, scale: 100, breakdown },
    assumptions,
    missing_evidence: missingEvidence,
    risks,
    next_actions: nextActions,
    limitations: LIMITATIONS,
    policy: {
      ecosystem_version: policy.ecosystem_version,
      qa_min_score: policy.qa_min_score,
      qa_scale: policy.qa_scale,
      qa_mandatory_before_publish: policy.qa_mandatory_before_publish,
      approval_required: policy.approval_required,
      note:
        'This result is a research-readiness preflight only. It is not QA, not market validation, and does not ' +
        'grant approval for publishing, production deployment, spending, destructive actions, or major architectural change.',
    },
  };
}

function main(argv) {
  const ideaPathArg = argv[2];
  if (!ideaPathArg) {
    console.error('Usage: node validate-idea.js <path-to-idea.json|yaml>');
    process.exit(1);
  }
  const ideaPath = path.resolve(process.cwd(), ideaPathArg);
  const ecosystemPath = path.join(__dirname, '..', '..', 'config', 'ecosystem.yaml');

  let ideaText;
  try {
    ideaText = fs.readFileSync(ideaPath, 'utf8');
  } catch (err) {
    console.error(`✖ Could not read idea file ${ideaPath}: ${err.message}`);
    process.exit(1);
  }

  let idea;
  try {
    idea = YAML.parse(ideaText);
  } catch (err) {
    console.error(`✖ Parse error in ${ideaPath}:`);
    console.error(`  ${err.message}`);
    process.exit(1);
  }

  let ecosystemText;
  try {
    ecosystemText = fs.readFileSync(ecosystemPath, 'utf8');
  } catch (err) {
    console.error(`✖ Could not read ${ecosystemPath}: ${err.message}`);
    process.exit(1);
  }

  let ecosystemDoc;
  try {
    ecosystemDoc = YAML.parse(ecosystemText);
  } catch (err) {
    console.error(`✖ YAML parse error in ${ecosystemPath}:`);
    console.error(`  ${err.message}`);
    process.exit(1);
  }

  let policy;
  try {
    policy = derivePolicy(ecosystemDoc);
  } catch (err) {
    console.error(`✖ ${err.message}`);
    process.exit(1);
  }

  const result = evaluateIdea(idea, policy);

  if (!result.valid) {
    console.error(`✖ ${ideaPath} failed structural validation (${result.errors.length} issue${result.errors.length === 1 ? '' : 's'}):`);
    for (const e of result.errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) {
  main(process.argv);
}

module.exports = { evaluateIdea, derivePolicy, isKebabCase };
