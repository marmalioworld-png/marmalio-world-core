'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const YAML = require('yaml');

const { buildBrief } = require('./brief-idea.js');
const { evaluateIdea, derivePolicy, isKebabCase } = require('./validate-idea.js');

const CLI_PATH = path.join(__dirname, 'brief-idea.js');
const SAMPLE_IDEA_PATH = path.join(__dirname, 'examples', 'sample-idea.json');
const NEEDS_WORK_IDEA_PATH = path.join(__dirname, 'examples', 'sample-idea-needs-work.json');
const REAL_ECOSYSTEM_PATH = path.join(__dirname, '..', '..', 'config', 'ecosystem.yaml');

function loadRealEcosystemDoc() {
  return YAML.parse(fs.readFileSync(REAL_ECOSYSTEM_PATH, 'utf8'));
}

function loadRealPolicy() {
  return derivePolicy(loadRealEcosystemDoc());
}

function loadIdea(filePath) {
  return YAML.parse(fs.readFileSync(filePath, 'utf8'));
}

test('the complete sample idea produces evidence-verification tasks, not an empty plan', () => {
  const idea = loadIdea(SAMPLE_IDEA_PATH);
  const policy = loadRealPolicy();
  const brief = buildBrief(idea, policy);

  assert.equal(brief.valid, true);
  assert.equal(brief.based_on.readiness, 'ready-for-research');
  assert.ok(brief.action_plan.length > 0, 'action_plan must not be empty for a fully-documented idea');
  assert.deepEqual(
    brief.action_plan.map((t) => t.category),
    ['evidence-verification', 'evidence-verification']
  );
  assert.deepEqual(
    brief.action_plan.map((t) => t.id),
    ['evidence-verification-survey-2026-pricing', 'evidence-verification-support-ticket-analysis']
  );
  for (const task of brief.action_plan) {
    assert.equal(task.priority, 'medium');
    assert.ok(task.evidence_id);
    assert.equal(task.assumption_id, undefined);
    assert.equal(task.field, undefined);
    assert.equal(task.suggested_source_types, undefined);
  }
});

test('the needs-work example produces the full expected set of tasks in deterministic order', () => {
  const idea = loadIdea(NEEDS_WORK_IDEA_PATH);
  const policy = loadRealPolicy();
  const brief = buildBrief(idea, policy);

  assert.equal(brief.valid, true);
  assert.equal(brief.based_on.readiness, 'revise-input');

  const expectedIdsInOrder = [
    'evidence-gathering-loyalty-increases-repeat-purchases',
    'evidence-verification-no-code-interviews-2026',
    'definition-gap-problem-current-alternative',
    'definition-gap-problem-desired-outcome',
    'definition-gap-target-audience-context',
    'strengthening-alternatives',
    'strengthening-channel-alignment',
  ];
  assert.deepEqual(
    brief.action_plan.map((t) => t.id),
    expectedIdsInOrder
  );

  const byId = Object.fromEntries(brief.action_plan.map((t) => [t.id, t]));
  assert.equal(byId['evidence-gathering-loyalty-increases-repeat-purchases'].priority, 'high');
  assert.equal(byId['evidence-gathering-loyalty-increases-repeat-purchases'].assumption_id, 'loyalty-increases-repeat-purchases');
  assert.deepEqual(byId['evidence-gathering-loyalty-increases-repeat-purchases'].suggested_source_types, [
    'user-interview',
    'survey',
    'analytics-export',
    'expert-review',
  ]);

  assert.equal(byId['evidence-verification-no-code-interviews-2026'].priority, 'medium');
  assert.equal(byId['evidence-verification-no-code-interviews-2026'].evidence_id, 'no-code-interviews-2026');

  assert.equal(byId['definition-gap-problem-current-alternative'].field, 'problem.current_alternative');
  assert.equal(byId['definition-gap-problem-desired-outcome'].field, 'problem.desired_outcome');
  assert.equal(byId['definition-gap-target-audience-context'].field, 'target_audience.context');

  assert.equal(byId['strengthening-alternatives'].priority, 'low'); // exactly 1 alternative declared
  assert.equal(byId['strengthening-channel-alignment'].priority, 'low');

  assert.deepEqual(brief.summary, {
    total: 7,
    by_category: { 'evidence-gathering': 1, 'evidence-verification': 1, 'definition-gap': 3, strengthening: 2 },
    by_priority: { high: 1, medium: 4, low: 2 },
  });
});

test('every task id is unique and kebab-case', () => {
  for (const ideaPath of [SAMPLE_IDEA_PATH, NEEDS_WORK_IDEA_PATH]) {
    const brief = buildBrief(loadIdea(ideaPath), loadRealPolicy());
    const ids = brief.action_plan.map((t) => t.id);
    assert.equal(new Set(ids).size, ids.length, `duplicate task id in ${ideaPath}`);
    for (const id of ids) assert.equal(isKebabCase(id), true, `"${id}" is not kebab-case`);
  }
});

test('assumption_id and evidence_id references point to existing input entries', () => {
  const idea = loadIdea(NEEDS_WORK_IDEA_PATH);
  const brief = buildBrief(idea, loadRealPolicy());
  const assumptionIds = new Set(idea.assumptions.map((a) => a.id));
  const evidenceIds = new Set(idea.evidence.map((e) => e.id));
  for (const task of brief.action_plan) {
    if (task.assumption_id !== undefined) assert.ok(assumptionIds.has(task.assumption_id));
    if (task.evidence_id !== undefined) assert.ok(evidenceIds.has(task.evidence_id));
  }
});

test('no irrelevant optional keys are present with null/undefined values', () => {
  const brief = buildBrief(loadIdea(NEEDS_WORK_IDEA_PATH), loadRealPolicy());
  for (const task of brief.action_plan) {
    for (const [key, value] of Object.entries(task)) {
      assert.notEqual(value, null, `${task.id}.${key} must not be present as null`);
    }
  }
  const serialized = JSON.stringify(brief.action_plan);
  assert.ok(!serialized.includes(':null'), 'no key should serialize to a null value');
});

test('repeated runs on the same input are deeply equal (deterministic)', () => {
  const idea = loadIdea(NEEDS_WORK_IDEA_PATH);
  const policy = loadRealPolicy();
  const first = buildBrief(idea, policy);
  const second = buildBrief(idea, policy);
  assert.deepEqual(first, second);
});

test('every task has non-empty completion_criteria', () => {
  for (const ideaPath of [SAMPLE_IDEA_PATH, NEEDS_WORK_IDEA_PATH]) {
    const brief = buildBrief(loadIdea(ideaPath), loadRealPolicy());
    for (const task of brief.action_plan) {
      assert.ok(Array.isArray(task.completion_criteria));
      assert.ok(task.completion_criteria.length > 0, `${task.id} has empty completion_criteria`);
      for (const c of task.completion_criteria) assert.equal(typeof c, 'string');
    }
  }
});

test('the output never claims that evidence has been verified', () => {
  for (const ideaPath of [SAMPLE_IDEA_PATH, NEEDS_WORK_IDEA_PATH]) {
    const brief = buildBrief(loadIdea(ideaPath), loadRealPolicy());
    const serialized = JSON.stringify(brief).toLowerCase();
    assert.ok(!serialized.includes('"verified":true'));
    assert.ok(!serialized.includes('evidence has been verified'));
    assert.ok(!serialized.includes('evidence is verified'));
  }
});

test('invalid input is delegated to evaluateIdea unchanged', () => {
  const idea = loadIdea(SAMPLE_IDEA_PATH);
  const policy = loadRealPolicy();
  const badIdea = { ...idea, target_channel: 'not-a-real-channel' };
  const brief = buildBrief(badIdea, policy);
  const direct = evaluateIdea(badIdea, policy);
  assert.deepEqual(brief, direct);
  assert.equal(brief.valid, false);
});

test('policy is read from the live ecosystem config, not hard-coded', () => {
  const doc = loadRealEcosystemDoc();
  const brief = buildBrief(loadIdea(SAMPLE_IDEA_PATH), derivePolicy(doc));
  assert.equal(brief.policy.qa_min_score, doc.qa.min_score);
  assert.equal(brief.policy.qa_scale, doc.qa.scale);
  assert.deepEqual(brief.policy.approval_required, doc.approval_required);
});

test('limitations include the base disclaimers plus the brief-specific one', () => {
  const brief = buildBrief(loadIdea(SAMPLE_IDEA_PATH), loadRealPolicy());
  assert.equal(brief.limitations.length, 4);
  assert.ok(
    brief.limitations.some((l) => l.includes('does not gather, verify, or assess any evidence itself'))
  );
});

test('CLI runs on both examples and exits 0', () => {
  for (const ideaPath of [SAMPLE_IDEA_PATH, NEEDS_WORK_IDEA_PATH]) {
    const output = execFileSync('node', [CLI_PATH, ideaPath], { encoding: 'utf8' });
    const brief = JSON.parse(output);
    assert.equal(brief.valid, true);
    assert.equal(brief.artifact, 'research-brief');
  }
});

test('CLI with no argument exits non-zero with a usage message', () => {
  assert.throws(() => {
    execFileSync('node', [CLI_PATH], { encoding: 'utf8', stdio: 'pipe' });
  }, (err) => {
    assert.notEqual(err.status, 0);
    assert.match(err.stderr, /Usage: node brief-idea\.js/);
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
