'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const YAML = require('yaml');

const { validateDoc, isKebabCase } = require('./validate-ecosystem.js');

const CLI_PATH = path.join(__dirname, 'validate-ecosystem.js');
const REAL_CONFIG_PATH = path.join(__dirname, '..', 'config', 'ecosystem.yaml');

function loadRealDoc() {
  const text = fs.readFileSync(REAL_CONFIG_PATH, 'utf8');
  return YAML.parse(text);
}

function clone(doc) {
  return structuredClone(doc);
}

function hasErrorMatching(errors, substring) {
  return errors.some((e) => e.includes(substring));
}

test('isKebabCase accepts kebab-case and rejects other cases', () => {
  assert.equal(isKebabCase('claude-code'), true);
  assert.equal(isKebabCase('a'), true);
  assert.equal(isKebabCase('a1-b2'), true);
  assert.equal(isKebabCase('Claude_Code'), false);
  assert.equal(isKebabCase('claude_code'), false);
  assert.equal(isKebabCase('claude--code'), false);
  assert.equal(isKebabCase('-claude'), false);
  assert.equal(isKebabCase(''), false);
});

test('accepts the real config/ecosystem.yaml with zero errors', () => {
  const doc = loadRealDoc();
  const errors = validateDoc(doc);
  assert.deepEqual(errors, []);
});

test('rejects a non-object root without throwing', () => {
  for (const bad of [null, undefined, 42, 'nope', [1, 2, 3]]) {
    const errors = validateDoc(bad);
    assert.ok(errors.length > 0);
    assert.ok(hasErrorMatching(errors, 'root:'));
  }
});

test('rejects a missing required top-level section', () => {
  const doc = clone(loadRealDoc());
  delete doc.qa;
  const errors = validateDoc(doc);
  assert.ok(hasErrorMatching(errors, 'qa: missing required field'));
});

test('rejects a wrong-type required section instead of throwing', () => {
  const doc = clone(loadRealDoc());
  doc.modules = 'not-a-list';
  const errors = validateDoc(doc);
  assert.ok(hasErrorMatching(errors, 'modules: expected array'));
});

test('rejects an unsupported version', () => {
  const doc = clone(loadRealDoc());
  doc.version = 2;
  const errors = validateDoc(doc);
  assert.ok(hasErrorMatching(errors, 'version: expected 1'));
});

test('detects duplicate modules[].id', () => {
  const doc = clone(loadRealDoc());
  doc.modules[1].id = doc.modules[0].id;
  const errors = validateDoc(doc);
  assert.ok(hasErrorMatching(errors, 'modules[].id: duplicate value'));
});

test('detects duplicate agent_roles[].id', () => {
  const doc = clone(loadRealDoc());
  doc.agent_roles[1].id = doc.agent_roles[0].id;
  const errors = validateDoc(doc);
  assert.ok(hasErrorMatching(errors, 'agent_roles[].id: duplicate value'));
});

test('detects duplicate tools.claude_ecosystem[].id', () => {
  const doc = clone(loadRealDoc());
  doc.tools.claude_ecosystem[1].id = doc.tools.claude_ecosystem[0].id;
  const errors = validateDoc(doc);
  assert.ok(hasErrorMatching(errors, 'tools.claude_ecosystem[].id: duplicate value'));
});

test('detects duplicate approval_required entries', () => {
  const doc = clone(loadRealDoc());
  doc.approval_required.push(doc.approval_required[0]);
  const errors = validateDoc(doc);
  assert.ok(hasErrorMatching(errors, 'approval_required: duplicate value'));
});

test('detects duplicate channels.expansion entries', () => {
  const doc = clone(loadRealDoc());
  doc.channels.expansion.push(doc.channels.expansion[0]);
  const errors = validateDoc(doc);
  assert.ok(hasErrorMatching(errors, 'channels.expansion: duplicate value'));
});

test('detects duplicate principles entries', () => {
  const doc = clone(loadRealDoc());
  doc.principles.push(doc.principles[0]);
  const errors = validateDoc(doc);
  assert.ok(hasErrorMatching(errors, 'principles: duplicate value'));
});

test('rejects a non-kebab-case id', () => {
  const doc = clone(loadRealDoc());
  doc.modules[0].id = 'Product_Factory';
  const errors = validateDoc(doc);
  assert.ok(hasErrorMatching(errors, 'must be kebab-case'));
});

test('rejects qa.min_score above qa.scale without hard-coding a threshold', () => {
  const doc = clone(loadRealDoc());
  doc.qa.min_score = doc.qa.scale + 1;
  const errors = validateDoc(doc);
  assert.ok(hasErrorMatching(errors, 'qa.min_score: must be between 0 and qa.scale'));
});

test('rejects qa.scale that is not positive', () => {
  const doc = clone(loadRealDoc());
  doc.qa.scale = 0;
  const errors = validateDoc(doc);
  assert.ok(hasErrorMatching(errors, 'qa.scale: must be greater than 0'));
});

test('rejects a chain actor with no matching responsibilities key', () => {
  const doc = clone(loadRealDoc());
  delete doc.operating_model.responsibilities.chatgpt;
  const errors = validateDoc(doc);
  assert.ok(hasErrorMatching(errors, 'actor "chatgpt" has no matching operating_model.responsibilities.chatgpt'));
});

test('rejects an orphan responsibilities key not present in the chain', () => {
  const doc = clone(loadRealDoc());
  doc.operating_model.responsibilities.compliance = 'Should not be here';
  const errors = validateDoc(doc);
  assert.ok(hasErrorMatching(errors, 'operating_model.responsibilities.compliance: does not correspond'));
});

test('allows human-approval as the final chain entry only', () => {
  const doc = clone(loadRealDoc());
  const errors = validateDoc(doc);
  assert.deepEqual(errors, []);
});

test('rejects human-approval when it is not the final chain entry', () => {
  const doc = clone(loadRealDoc());
  doc.operating_model.chain = ['human', 'human-approval', 'chatgpt', 'claude-code', 'specialist-agents', 'qa'];
  const errors = validateDoc(doc);
  assert.ok(hasErrorMatching(errors, 'human-approval" must be the final entry'));
});

test('rejects human-approval appearing more than once', () => {
  const doc = clone(loadRealDoc());
  doc.operating_model.chain.push('human-approval');
  const errors = validateDoc(doc);
  assert.ok(hasErrorMatching(errors, 'human-approval" must occur only once'));
});

test('rejects a chain missing the human actor', () => {
  const doc = clone(loadRealDoc());
  doc.operating_model.chain = doc.operating_model.chain.filter((entry) => entry !== 'human');
  const errors = validateDoc(doc);
  assert.ok(hasErrorMatching(errors, '"human" must appear as an actor entry'));
});

test('CLI accepts the real config file and exits 0', () => {
  const output = execFileSync('node', [CLI_PATH, REAL_CONFIG_PATH], { encoding: 'utf8' });
  assert.match(output, /is valid/);
});

test('CLI rejects malformed YAML syntax and exits non-zero', () => {
  const tmpFile = path.join(os.tmpdir(), `ecosystem-invalid-${process.pid}.yaml`);
  fs.writeFileSync(tmpFile, 'version: 1\nbroken: [1, 2\n');
  try {
    assert.throws(() => {
      execFileSync('node', [CLI_PATH, tmpFile], { encoding: 'utf8', stdio: 'pipe' });
    });
  } finally {
    fs.rmSync(tmpFile, { force: true });
  }
});
