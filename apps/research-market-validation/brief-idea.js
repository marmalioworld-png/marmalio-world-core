'use strict';

const fs = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');

const { evaluateIdea, derivePolicy } = require('./validate-idea.js');

const SCHEMA_VERSION = 1;

const SUGGESTED_SOURCE_TYPES = ['user-interview', 'survey', 'analytics-export', 'expert-review'];

const EXTRA_LIMITATION =
  'This brief does not gather, verify, or assess any evidence itself; it only plans what to check next.';

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };
const CATEGORY_RANK = {
  'evidence-gathering': 0,
  'evidence-verification': 1,
  'definition-gap': 2,
  strengthening: 3,
};

const DEFINITION_FIELD_PATHS = [
  'problem.statement',
  'problem.current_alternative',
  'problem.desired_outcome',
  'target_audience.segment',
  'target_audience.context',
];

function fieldToTaskId(field) {
  return `definition-gap-${field.replace(/\./g, '-').replace(/_/g, '-')}`;
}

function readFieldValue(idea, field) {
  const [container, key] = field.split('.');
  const obj = idea[container];
  return obj && typeof obj === 'object' ? obj[key] : undefined;
}

/**
 * Turns a valid evaluateIdea() result into a deterministic, prioritized action plan.
 * Never gathers, fetches, or verifies evidence itself — it only identifies what a human
 * or agent should go check next, and how completion of that check would be recognized.
 * Invalid input is delegated to evaluateIdea unchanged: { valid: false, errors }.
 */
function buildBrief(idea, policy) {
  const result = evaluateIdea(idea, policy);
  if (!result.valid) {
    return result;
  }

  const entries = [];
  let order = 0;

  // evidence-gathering: one per assumption with no supporting evidence at all.
  for (const missing of result.missing_evidence) {
    entries.push({
      order: order++,
      task: {
        id: `evidence-gathering-${missing.assumption_id}`,
        category: 'evidence-gathering',
        priority: 'high',
        assumption_id: missing.assumption_id,
        action: `Gather evidence supporting assumption "${missing.assumption_id}".`,
        suggested_source_types: SUGGESTED_SOURCE_TYPES,
        completion_criteria: [
          'At least one credible source has been identified for this assumption.',
          'The source type and reference are recorded.',
          'A new evidence entry links back to this assumption via supports_assumption_ids.',
        ],
      },
    });
  }

  // evidence-verification: one per declared evidence entry, regardless of what it supports.
  // The module only confirms evidence was declared; it never confirms the evidence is real,
  // current, or actually supports the claim — that review is what this task asks for.
  for (const evidence of idea.evidence || []) {
    entries.push({
      order: order++,
      task: {
        id: `evidence-verification-${evidence.id}`,
        category: 'evidence-verification',
        priority: 'medium',
        evidence_id: evidence.id,
        action: `Verify evidence "${evidence.id}" before relying on it.`,
        completion_criteria: [
          "The source's accessibility and identity/publisher have been checked.",
          "The source's publication date or relevant time context has been noted.",
          'The source has been confirmed to directly support the declared claim, not just a related topic.',
          'Any contradiction, caveat, or limitation found during review has been recorded.',
        ],
      },
    });
  }

  // definition-gap: fixed field order, one per missing problem/audience field.
  for (const field of DEFINITION_FIELD_PATHS) {
    const value = readFieldValue(idea, field);
    if (typeof value === 'string' && value.trim() !== '') continue;
    entries.push({
      order: order++,
      task: {
        id: fieldToTaskId(field),
        category: 'definition-gap',
        priority: 'medium',
        field,
        action: `Complete the "${field}" field.`,
        completion_criteria: [`The "${field}" field contains a specific, non-empty value.`],
      },
    });
  }

  // strengthening: optional improvement opportunities, lowest urgency.
  const alternatives = Array.isArray(idea.alternatives) ? idea.alternatives : [];
  if (alternatives.length < 2) {
    entries.push({
      order: order++,
      task: {
        id: 'strengthening-alternatives',
        category: 'strengthening',
        priority: alternatives.length === 0 ? 'medium' : 'low',
        action:
          alternatives.length === 0
            ? 'Declare at least one alternative and how this idea differs from it.'
            : 'Name one more alternative to strengthen differentiation.',
        completion_criteria: [
          'At least two alternatives are declared.',
          'Each alternative states concretely how this idea differs from it.',
        ],
      },
    });
  }
  if (idea.target_channel !== policy.channels.primary) {
    entries.push({
      order: order++,
      task: {
        id: 'strengthening-channel-alignment',
        category: 'strengthening',
        priority: 'low',
        action: "Confirm the target_channel choice against the ecosystem's primary channel.",
        completion_criteria: [
          'The choice between the primary channel and this expansion channel has been reconsidered.',
          'If the expansion channel remains the choice, the reasoning is documented.',
        ],
      },
    });
  }

  entries.sort((a, b) => {
    const priorityDiff = PRIORITY_RANK[a.task.priority] - PRIORITY_RANK[b.task.priority];
    if (priorityDiff !== 0) return priorityDiff;
    const categoryDiff = CATEGORY_RANK[a.task.category] - CATEGORY_RANK[b.task.category];
    if (categoryDiff !== 0) return categoryDiff;
    if (a.order !== b.order) return a.order - b.order;
    return a.task.id < b.task.id ? -1 : a.task.id > b.task.id ? 1 : 0;
  });

  const actionPlan = entries.map((entry) => entry.task);

  const byCategory = Object.fromEntries(Object.keys(CATEGORY_RANK).map((c) => [c, 0]));
  const byPriority = Object.fromEntries(Object.keys(PRIORITY_RANK).map((p) => [p, 0]));
  for (const task of actionPlan) {
    byCategory[task.category] += 1;
    byPriority[task.priority] += 1;
  }

  return {
    valid: true,
    idea_id: idea.id,
    module: 'research-market-validation',
    artifact: 'research-brief',
    schema_version: SCHEMA_VERSION,
    based_on: {
      readiness: result.readiness,
      score_total: result.research_readiness_score.total,
      scale: result.research_readiness_score.scale,
    },
    action_plan: actionPlan,
    summary: { total: actionPlan.length, by_category: byCategory, by_priority: byPriority },
    limitations: [...result.limitations, EXTRA_LIMITATION],
    policy: result.policy,
  };
}

function main(argv) {
  const ideaPathArg = argv[2];
  if (!ideaPathArg) {
    console.error('Usage: node brief-idea.js <path-to-idea.json|yaml>');
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

  const brief = buildBrief(idea, policy);

  if (!brief.valid) {
    console.error(`✖ ${ideaPath} failed structural validation (${brief.errors.length} issue${brief.errors.length === 1 ? '' : 's'}):`);
    for (const e of brief.errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  console.log(JSON.stringify(brief, null, 2));
}

if (require.main === module) {
  main(process.argv);
}

module.exports = { buildBrief };
