'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const YAML = require('yaml');

const { evaluateIdea, derivePolicy, isKebabCase } = require('./validate-idea.js');

const CLI_PATH = path.join(__dirname, 'validate-idea.js');
const SAMPLE_IDEA_PATH = path.join(__dirname, 'examples', 'sample-idea.json');
const REAL_ECOSYSTEM_PATH = path.join(__dirname, '..', '..', 'config', 'ecosystem.yaml');

const TEST_POLICY = {
  ecosystem_version: 1,
  qa_min_score: 85,
  qa_scale: 100,
  qa_mandatory_before_publish: true,
  approval_required: ['publishing', 'production-deployment'],
  channels: { primary: 'shopify', expansion: ['etsy', 'amazon-kdp'] },
};

function loadRealEcosystemDoc() {
  return YAML.parse(fs.readFileSync(REAL_ECOSYSTEM_PATH, 'utf8'));
}

function baseIdea(overrides = {}) {
  return {
    id: 'base-idea',
    kind: 'product',
    title: 'Base idea',
    target_channel: TEST_POLICY.channels.primary,
    ...overrides,
  };
}

function hasErrorMatching(errors, substring) {
  return errors.some((e) => e.includes(substring));
}

test('isKebabCase accepts kebab-case and rejects other cases', () => {
  assert.equal(isKebabCase('research-market-validation'), true);
  assert.equal(isKebabCase('Research_Market'), false);
  assert.equal(isKebabCase(''), false);
});

test('derivePolicy reads live values from the real config/ecosystem.yaml (not hard-coded)', () => {
  const doc = loadRealEcosystemDoc();
  const policy = derivePolicy(doc);
  assert.equal(policy.ecosystem_version, doc.version);
  assert.equal(policy.qa_min_score, doc.qa.min_score);
  assert.equal(policy.qa_scale, doc.qa.scale);
  assert.equal(policy.qa_mandatory_before_publish, doc.qa.mandatory_before_publish);
  assert.deepEqual(policy.approval_required, doc.approval_required);
  assert.equal(policy.channels.primary, doc.channels.primary);
  assert.deepEqual(policy.channels.expansion, doc.channels.expansion);
});

test('derivePolicy throws on a malformed ecosystem document', () => {
  assert.throws(() => derivePolicy({ version: 1 }), /qa section is missing or malformed/);
  assert.throws(() => derivePolicy(null), /expected a YAML mapping/);
});

test('a fully-documented idea scores 100 and reaches ready-for-research', () => {
  const idea = baseIdea({
    problem: {
      statement: 'Sellers struggle to track inventory costs.',
      current_alternative: 'Manual spreadsheets.',
      desired_outcome: 'Real-time cost and margin data.',
    },
    target_audience: { segment: 'Small Shopify sellers.', context: 'No dedicated ops role.' },
    assumptions: [
      { id: 'a1', claim: 'Users are price sensitive.' },
      { id: 'a2', claim: 'The manual process is painful.' },
    ],
    evidence: [
      { id: 'e1', claim: 'Survey shows price sensitivity.', source_type: 'survey', source_reference: 'survey.pdf', supports_assumption_ids: ['a1'] },
      { id: 'e2', claim: 'Tickets show pain.', source_type: 'support-tickets', source_reference: 'tickets.csv', supports_assumption_ids: ['a2'] },
    ],
    alternatives: [
      { name: 'Spreadsheets', difference: 'No automation.' },
      { name: 'Competitor tool', difference: 'More expensive.' },
    ],
  });
  const result = evaluateIdea(idea, TEST_POLICY);
  assert.equal(result.valid, true);
  assert.equal(result.readiness, 'ready-for-research');
  assert.equal(result.research_readiness_score.total, 100);
  assert.deepEqual(result.research_readiness_score.breakdown, {
    problem_definition: 20,
    audience_definition: 20,
    evidence_coverage: 20,
    channel_alignment: 20,
    alternatives_coverage: 20,
  });
  assert.deepEqual(result.missing_evidence, []);
  assert.deepEqual(result.risks, []);
  assert.deepEqual(result.next_actions, []);
});

test('a minimal idea (only required fields) is valid but scores low', () => {
  const idea = baseIdea();
  const result = evaluateIdea(idea, TEST_POLICY);
  assert.equal(result.valid, true);
  assert.equal(result.readiness, 'insufficient-input');
  assert.equal(result.research_readiness_score.total, 20); // channel_alignment: primary = 20, everything else 0
  assert.ok(result.risks.some((r) => r.message === 'no assumptions declared'));
  assert.ok(result.risks.some((r) => r.message === 'no alternatives declared'));
});

test('output never claims proceed/reject/validated/viable wording', () => {
  const idea = baseIdea();
  const result = evaluateIdea(idea, TEST_POLICY);
  const serialized = JSON.stringify(result).toLowerCase();
  for (const forbidden of ['"proceed"', '"reject"', '"validated"', '"viable"']) {
    assert.ok(!serialized.includes(forbidden), `output must not contain ${forbidden}`);
  }
});

test('an assumption without supporting evidence is listed in missing_evidence', () => {
  const idea = baseIdea({
    assumptions: [{ id: 'unsupported-claim', claim: 'This has no evidence.' }],
  });
  const result = evaluateIdea(idea, TEST_POLICY);
  assert.equal(result.valid, true);
  assert.deepEqual(result.missing_evidence, [{ assumption_id: 'unsupported-claim', claim: 'This has no evidence.' }]);
});

test('primary channel scores higher than an expansion channel', () => {
  const primary = evaluateIdea(baseIdea({ target_channel: TEST_POLICY.channels.primary }), TEST_POLICY);
  const expansion = evaluateIdea(baseIdea({ target_channel: TEST_POLICY.channels.expansion[0] }), TEST_POLICY);
  assert.equal(primary.research_readiness_score.breakdown.channel_alignment, 20);
  assert.equal(expansion.research_readiness_score.breakdown.channel_alignment, 12);
  assert.ok(expansion.risks.some((r) => r.message.includes('expansion channel')));
});

test('an unknown target_channel is a structural input error, not a scoring deduction', () => {
  const idea = baseIdea({ target_channel: 'myspace' });
  const result = evaluateIdea(idea, TEST_POLICY);
  assert.equal(result.valid, false);
  assert.ok(hasErrorMatching(result.errors, 'target_channel: "myspace" is not configured'));
  assert.equal(result.research_readiness_score, undefined);
});

test('duplicate assumption ids are rejected', () => {
  const idea = baseIdea({
    assumptions: [
      { id: 'dup', claim: 'First.' },
      { id: 'dup', claim: 'Second.' },
    ],
  });
  const result = evaluateIdea(idea, TEST_POLICY);
  assert.equal(result.valid, false);
  assert.ok(hasErrorMatching(result.errors, 'assumptions[].id: duplicate value "dup"'));
});

test('duplicate evidence ids are rejected', () => {
  const idea = baseIdea({
    assumptions: [{ id: 'a1', claim: 'Claim.' }],
    evidence: [
      { id: 'dup', claim: 'First.', source_type: 'survey', source_reference: 'ref-1', supports_assumption_ids: ['a1'] },
      { id: 'dup', claim: 'Second.', source_type: 'survey', source_reference: 'ref-2', supports_assumption_ids: ['a1'] },
    ],
  });
  const result = evaluateIdea(idea, TEST_POLICY);
  assert.equal(result.valid, false);
  assert.ok(hasErrorMatching(result.errors, 'evidence[].id: duplicate value "dup"'));
});

test('evidence referencing an unknown assumption id is rejected', () => {
  const idea = baseIdea({
    assumptions: [{ id: 'a1', claim: 'Claim.' }],
    evidence: [
      { id: 'e1', claim: 'Claim.', source_type: 'survey', source_reference: 'ref', supports_assumption_ids: ['ghost'] },
    ],
  });
  const result = evaluateIdea(idea, TEST_POLICY);
  assert.equal(result.valid, false);
  assert.ok(hasErrorMatching(result.errors, 'references unknown assumption id "ghost"'));
});

test('duplicate assumption references within one evidence entry are rejected', () => {
  const idea = baseIdea({
    assumptions: [{ id: 'a1', claim: 'Claim.' }],
    evidence: [
      { id: 'e1', claim: 'Claim.', source_type: 'survey', source_reference: 'ref', supports_assumption_ids: ['a1', 'a1'] },
    ],
  });
  const result = evaluateIdea(idea, TEST_POLICY);
  assert.equal(result.valid, false);
  assert.ok(hasErrorMatching(result.errors, 'duplicate reference "a1"'));
});

test('readiness bucket boundary: total 70 is ready-for-research', () => {
  // problem 3/3=20, audience 2/2=20, 0 assumptions=>evidence 0, primary channel=20, 1 alternative=10 => 70
  const idea = baseIdea({
    problem: { statement: 's', current_alternative: 'c', desired_outcome: 'd' },
    target_audience: { segment: 's', context: 'c' },
    alternatives: [{ name: 'Alt', difference: 'Diff' }],
  });
  const result = evaluateIdea(idea, TEST_POLICY);
  assert.equal(result.research_readiness_score.total, 70);
  assert.equal(result.readiness, 'ready-for-research');
});

test('readiness bucket boundary: total 69 is revise-input', () => {
  // problem 2/3=13, audience 2/2=20, 5 assumptions/4 supported=>evidence 16, primary channel=20, 0 alternatives=0 => 69
  const idea = baseIdea({
    problem: { statement: 's', current_alternative: 'c' },
    target_audience: { segment: 's', context: 'c' },
    assumptions: [
      { id: 'a1', claim: 'c1' },
      { id: 'a2', claim: 'c2' },
      { id: 'a3', claim: 'c3' },
      { id: 'a4', claim: 'c4' },
      { id: 'a5', claim: 'c5' },
    ],
    evidence: [
      { id: 'e1', claim: 'c', source_type: 'survey', source_reference: 'r', supports_assumption_ids: ['a1'] },
      { id: 'e2', claim: 'c', source_type: 'survey', source_reference: 'r', supports_assumption_ids: ['a2'] },
      { id: 'e3', claim: 'c', source_type: 'survey', source_reference: 'r', supports_assumption_ids: ['a3'] },
      { id: 'e4', claim: 'c', source_type: 'survey', source_reference: 'r', supports_assumption_ids: ['a4'] },
    ],
  });
  const result = evaluateIdea(idea, TEST_POLICY);
  assert.equal(result.research_readiness_score.total, 69);
  assert.equal(result.readiness, 'revise-input');
});

test('readiness bucket boundary: total 40 is revise-input', () => {
  // no problem, no audience, 1/1 assumption supported=>evidence 20, primary channel=20, 0 alternatives=0 => 40
  const idea = baseIdea({
    assumptions: [{ id: 'a1', claim: 'c1' }],
    evidence: [{ id: 'e1', claim: 'c', source_type: 'survey', source_reference: 'r', supports_assumption_ids: ['a1'] }],
  });
  const result = evaluateIdea(idea, TEST_POLICY);
  assert.equal(result.research_readiness_score.total, 40);
  assert.equal(result.readiness, 'revise-input');
});

test('readiness bucket boundary: total 39 is insufficient-input', () => {
  // problem 1/3=7, no audience, 1/1 assumption supported=>evidence 20, expansion channel=12, 0 alternatives=0 => 39
  const idea = baseIdea({
    target_channel: TEST_POLICY.channels.expansion[0],
    problem: { statement: 's' },
    assumptions: [{ id: 'a1', claim: 'c1' }],
    evidence: [{ id: 'e1', claim: 'c', source_type: 'survey', source_reference: 'r', supports_assumption_ids: ['a1'] }],
  });
  const result = evaluateIdea(idea, TEST_POLICY);
  assert.equal(result.research_readiness_score.total, 39);
  assert.equal(result.readiness, 'insufficient-input');
});

test('CLI accepts the sample idea, exits 0, and echoes live policy values', () => {
  const output = execFileSync('node', [CLI_PATH, SAMPLE_IDEA_PATH], { encoding: 'utf8' });
  const result = JSON.parse(output);
  const realDoc = loadRealEcosystemDoc();
  assert.equal(result.valid, true);
  assert.equal(result.readiness, 'ready-for-research');
  assert.equal(result.policy.qa_min_score, realDoc.qa.min_score);
  assert.equal(result.policy.qa_scale, realDoc.qa.scale);
  assert.deepEqual(result.policy.approval_required, realDoc.approval_required);
});

test('CLI with no argument exits non-zero with a usage message', () => {
  assert.throws(() => {
    execFileSync('node', [CLI_PATH], { encoding: 'utf8', stdio: 'pipe' });
  }, (err) => {
    assert.notEqual(err.status, 0);
    assert.match(err.stderr, /Usage: node validate-idea\.js/);
    return true;
  });
});

test('CLI with a nonexistent idea path exits non-zero', () => {
  assert.throws(() => {
    execFileSync('node', [CLI_PATH, path.join(__dirname, 'examples', 'does-not-exist.json')], {
      encoding: 'utf8',
      stdio: 'pipe',
    });
  }, (err) => {
    assert.notEqual(err.status, 0);
    assert.match(err.stderr, /Could not read idea file/);
    return true;
  });
});

test('CLI with malformed idea input (invalid target_channel) exits non-zero without a stack trace', () => {
  const tmpFile = path.join(__dirname, 'examples', `tmp-invalid-${process.pid}.json`);
  fs.writeFileSync(tmpFile, JSON.stringify(baseIdea({ target_channel: 'not-a-real-channel' })));
  try {
    assert.throws(() => {
      execFileSync('node', [CLI_PATH, tmpFile], { encoding: 'utf8', stdio: 'pipe' });
    }, (err) => {
      assert.notEqual(err.status, 0);
      assert.match(err.stderr, /failed structural validation/);
      assert.doesNotMatch(err.stderr, /at Object\.|node:internal/);
      return true;
    });
  } finally {
    fs.rmSync(tmpFile, { force: true });
  }
});
