'use strict';

const fs = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');

const KEBAB_CASE_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

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

// Checks that parent[key] exists and matches `kind`. Returns true only when
// it is safe for callers to go on and read/iterate that field.
function checkField(parent, key, kind, fieldPath, errors) {
  if (!(key in parent)) {
    errors.push(`${fieldPath}: missing required field`);
    return false;
  }
  const value = parent[key];
  const ok =
    kind === 'array' ? Array.isArray(value) :
    kind === 'object' ? isPlainObject(value) :
    kind === 'number' ? typeof value === 'number' :
    kind === 'boolean' ? typeof value === 'boolean' :
    kind === 'string' ? typeof value === 'string' :
    false;
  if (!ok) {
    errors.push(`${fieldPath}: expected ${kind}, got ${describeType(value)}`);
  }
  return ok;
}

function checkUnique(entries, label, errors) {
  const seen = new Map();
  for (const { id, index } of entries) {
    if (seen.has(id)) {
      errors.push(`${label}: duplicate value "${id}" at indices ${seen.get(id)} and ${index}`);
    } else {
      seen.set(id, index);
    }
  }
}

// Validates a list of plain kebab-case string entries (e.g. approval_required).
function validateStringList(list, listPath, errors, { unique = false } = {}) {
  const seen = new Map();
  list.forEach((item, i) => {
    const itemPath = `${listPath}[${i}]`;
    if (typeof item !== 'string') {
      errors.push(`${itemPath}: expected string, got ${describeType(item)}`);
      return;
    }
    if (!isKebabCase(item)) {
      errors.push(`${itemPath}: "${item}" must be kebab-case`);
    }
    if (unique) {
      if (seen.has(item)) {
        errors.push(`${listPath}: duplicate value "${item}" at indices ${seen.get(item)} and ${i}`);
      } else {
        seen.set(item, i);
      }
    }
  });
}

function validateModuleItem(item, itemPath, errors) {
  if (!isPlainObject(item)) {
    errors.push(`${itemPath}: expected object, got ${describeType(item)}`);
    return null;
  }
  const idOk = checkField(item, 'id', 'string', `${itemPath}.id`, errors);
  checkField(item, 'name', 'string', `${itemPath}.name`, errors);
  const statusOk = checkField(item, 'status', 'string', `${itemPath}.status`, errors);
  if (idOk && !isKebabCase(item.id)) {
    errors.push(`${itemPath}.id: "${item.id}" must be kebab-case`);
  }
  if (statusOk && !isKebabCase(item.status)) {
    errors.push(`${itemPath}.status: "${item.status}" must be kebab-case`);
  }
  return idOk ? item.id : null;
}

function validateAgentRoleItem(item, itemPath, errors) {
  if (!isPlainObject(item)) {
    errors.push(`${itemPath}: expected object, got ${describeType(item)}`);
    return null;
  }
  const idOk = checkField(item, 'id', 'string', `${itemPath}.id`, errors);
  checkField(item, 'purpose', 'string', `${itemPath}.purpose`, errors);
  if (idOk && !isKebabCase(item.id)) {
    errors.push(`${itemPath}.id: "${item.id}" must be kebab-case`);
  }
  return idOk ? item.id : null;
}

function validateToolItem(item, itemPath, errors) {
  if (!isPlainObject(item)) {
    errors.push(`${itemPath}: expected object, got ${describeType(item)}`);
    return null;
  }
  const idOk = checkField(item, 'id', 'string', `${itemPath}.id`, errors);
  const statusOk = checkField(item, 'status', 'string', `${itemPath}.status`, errors);
  if (idOk && !isKebabCase(item.id)) {
    errors.push(`${itemPath}.id: "${item.id}" must be kebab-case`);
  }
  if (statusOk && !isKebabCase(item.status)) {
    errors.push(`${itemPath}.status: "${item.status}" must be kebab-case`);
  }
  return idOk ? item.id : null;
}

/**
 * Validates an already-parsed ecosystem.yaml document.
 * Returns an array of concise, actionable error strings (empty = valid).
 * Never throws on malformed input — every read is guarded by a prior
 * structural/type check.
 */
function validateDoc(doc) {
  const errors = [];

  if (!isPlainObject(doc)) {
    errors.push(`root: expected a YAML mapping (object), got ${describeType(doc)}`);
    return errors;
  }

  // ---- Phase 1: structural shape of every required section, before any
  // field-specific rule reads into it. ----
  const REQUIRED_TOP_LEVEL = {
    version: 'number',
    operating_model: 'object',
    modules: 'array',
    agent_roles: 'array',
    qa: 'object',
    approval_required: 'array',
    channels: 'object',
    tools: 'object',
    principles: 'array',
  };

  const ok = {};
  for (const [key, kind] of Object.entries(REQUIRED_TOP_LEVEL)) {
    ok[key] = checkField(doc, key, kind, key, errors);
  }

  ok.chain = ok.operating_model && checkField(doc.operating_model, 'chain', 'array', 'operating_model.chain', errors);
  ok.responsibilities = ok.operating_model && checkField(doc.operating_model, 'responsibilities', 'object', 'operating_model.responsibilities', errors);

  ok.qa_min_score = ok.qa && checkField(doc.qa, 'min_score', 'number', 'qa.min_score', errors);
  ok.qa_scale = ok.qa && checkField(doc.qa, 'scale', 'number', 'qa.scale', errors);
  ok.qa_mandatory = ok.qa && checkField(doc.qa, 'mandatory_before_publish', 'boolean', 'qa.mandatory_before_publish', errors);

  ok.channels_primary = ok.channels && checkField(doc.channels, 'primary', 'string', 'channels.primary', errors);
  ok.channels_expansion = ok.channels && checkField(doc.channels, 'expansion', 'array', 'channels.expansion', errors);

  ok.tools_claude_ecosystem = ok.tools && checkField(doc.tools, 'claude_ecosystem', 'array', 'tools.claude_ecosystem', errors);
  ok.tools_external_review_required = ok.tools && checkField(doc.tools, 'external_review_required', 'array', 'tools.external_review_required', errors);
  ok.tools_preference = ok.tools && checkField(doc.tools, 'preference', 'string', 'tools.preference', errors);

  // ---- Phase 2: field-specific rules, each gated on its own structural check. ----

  if (ok.version && doc.version !== 1) {
    errors.push(`version: expected 1, got ${JSON.stringify(doc.version)}`);
  }

  if (ok.modules) {
    const ids = [];
    doc.modules.forEach((item, i) => {
      const id = validateModuleItem(item, `modules[${i}]`, errors);
      if (id !== null) ids.push({ id, index: i });
    });
    checkUnique(ids, 'modules[].id', errors);
  }

  if (ok.agent_roles) {
    const ids = [];
    doc.agent_roles.forEach((item, i) => {
      const id = validateAgentRoleItem(item, `agent_roles[${i}]`, errors);
      if (id !== null) ids.push({ id, index: i });
    });
    checkUnique(ids, 'agent_roles[].id', errors);
  }

  if (ok.qa_min_score && ok.qa_scale) {
    if (doc.qa.scale <= 0) {
      errors.push(`qa.scale: must be greater than 0, got ${doc.qa.scale}`);
    }
    if (doc.qa.min_score < 0 || doc.qa.min_score > doc.qa.scale) {
      errors.push(`qa.min_score: must be between 0 and qa.scale (${doc.qa.scale}), got ${doc.qa.min_score}`);
    }
  }

  if (ok.approval_required) {
    validateStringList(doc.approval_required, 'approval_required', errors, { unique: true });
    if (doc.approval_required.length === 0) {
      errors.push('approval_required: must contain at least one entry');
    }
  }

  if (ok.channels_primary && !isKebabCase(doc.channels.primary)) {
    errors.push(`channels.primary: "${doc.channels.primary}" must be kebab-case`);
  }
  if (ok.channels_expansion) {
    validateStringList(doc.channels.expansion, 'channels.expansion', errors, { unique: true });
  }

  if (ok.tools_claude_ecosystem) {
    const ids = [];
    doc.tools.claude_ecosystem.forEach((item, i) => {
      const id = validateToolItem(item, `tools.claude_ecosystem[${i}]`, errors);
      if (id !== null) ids.push({ id, index: i });
    });
    checkUnique(ids, 'tools.claude_ecosystem[].id', errors);
  }
  if (ok.tools_external_review_required) {
    validateStringList(doc.tools.external_review_required, 'tools.external_review_required', errors);
  }
  if (ok.tools_preference && !isKebabCase(doc.tools.preference)) {
    errors.push(`tools.preference: "${doc.tools.preference}" must be kebab-case`);
  }

  if (ok.principles) {
    validateStringList(doc.principles, 'principles', errors, { unique: true });
  }

  if (ok.responsibilities) {
    for (const [key, value] of Object.entries(doc.operating_model.responsibilities)) {
      if (typeof value !== 'string' || value.trim() === '') {
        errors.push(`operating_model.responsibilities.${key}: expected non-empty string, got ${describeType(value)}`);
      }
    }
  }

  if (ok.chain) {
    validateStringList(doc.operating_model.chain, 'operating_model.chain', errors);
  }

  if (ok.chain && ok.responsibilities) {
    const chain = doc.operating_model.chain;
    const responsibilities = doc.operating_model.responsibilities;

    const approvalIndices = [];
    chain.forEach((entry, i) => {
      if (entry === 'human-approval') approvalIndices.push(i);
    });
    if (approvalIndices.length > 1) {
      errors.push(`operating_model.chain: "human-approval" must occur only once, found at indices ${approvalIndices.join(', ')}`);
    } else if (approvalIndices.length === 1 && approvalIndices[0] !== chain.length - 1) {
      errors.push(`operating_model.chain: "human-approval" must be the final entry, found at index ${approvalIndices[0]} of ${chain.length - 1}`);
    }

    const actorEntries = chain.filter((entry) => typeof entry === 'string' && entry !== 'human-approval');

    for (const entry of actorEntries) {
      const snakeKey = entry.replace(/-/g, '_');
      if (!(snakeKey in responsibilities)) {
        errors.push(`operating_model.chain: actor "${entry}" has no matching operating_model.responsibilities.${snakeKey}`);
      }
    }

    if (!actorEntries.includes('human')) {
      errors.push('operating_model.chain: "human" must appear as an actor entry');
    }
    if (!('human' in responsibilities)) {
      errors.push('operating_model.responsibilities: missing required "human" entry');
    }

    const actorSnakeKeys = new Set(actorEntries.map((entry) => entry.replace(/-/g, '_')));
    for (const key of Object.keys(responsibilities)) {
      if (!actorSnakeKeys.has(key)) {
        errors.push(`operating_model.responsibilities.${key}: does not correspond to any operating_model.chain entry`);
      }
    }
  }

  return errors;
}

function main(argv) {
  const filePath = argv[2]
    ? path.resolve(process.cwd(), argv[2])
    : path.join(__dirname, '..', 'config', 'ecosystem.yaml');

  let text;
  try {
    text = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(`✖ Could not read ${filePath}: ${err.message}`);
    process.exit(1);
  }

  let doc;
  try {
    doc = YAML.parse(text);
  } catch (err) {
    console.error(`✖ YAML parse error in ${filePath}:`);
    console.error(`  ${err.message}`);
    process.exit(1);
  }

  const errors = validateDoc(doc);
  if (errors.length > 0) {
    console.error(`✖ ${filePath} failed validation (${errors.length} issue${errors.length === 1 ? '' : 's'}):`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  console.log(`✔ ${filePath} is valid`);
}

if (require.main === module) {
  main(process.argv);
}

module.exports = { validateDoc, isKebabCase };
