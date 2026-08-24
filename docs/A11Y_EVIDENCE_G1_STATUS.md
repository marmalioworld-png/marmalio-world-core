# A11y Evidence — G1 Status / Hold

Date: 2026-08-24
Source basis: uploaded `A11y-Evidence-G1-Raport-Wykonawczy-dla-ChatGPT.pdf`
Status: TECHNICALLY ADVANCED, PUBLIC LAUNCH/OUTREACH ON HOLD

## Verified from the supplied G1 report

- G1 reports 11/11 directive tasks completed.
- Reported QA: 86 unit tests + 29 static fixture validations = 115 checks, 0 reported failures.
- No push, deployment, outreach, spend or scanning of third-party domains occurred during G1; testing used local `file://` fixtures only.
- Coverage model is explicitly conservative: 5/50 WCAG 2.1 A/AA criteria automated, 15 require human review, 30 are unavailable to the automated engine.
- The forbidden-claims gate exists to block overstatements such as guaranteed/full compliance, certification, legal safety or fine avoidance.

## Unresolved empirical test

The report states the browser-engine fixture test was not run in Claude's environment because Playwright/Chromium was unavailable there.

Required local verification commands from the report:

```bash
npm install && npx playwright install chromium
npm run test:fixtures
```

Do not represent this test as empirically completed until run successfully on an appropriate machine.

## Mandatory holds preserved from the source report

- Lead-generation scanning of third-party domains: HOLD.
- First German outreach letter: HOLD pending legal consultation + approved wording + technical conditions.
- German phone outreach: HOLD pending per-contact assessment + approved script + human decision; no automatic trigger.
- German cold email: NOT an approved standard channel in the current model.
- US outreach: HOLD pending CAN-SPAM checklist and sender-address decision.
- Austria: outside the assessed scope.
- Public deploy / landing / sale: HOLD pending a separate operational decision.

## Required before G2 / external operation

1. Run browser fixture test and document result.
2. Implement the written data policy in code, especially planned automatic deletion/retention logic.
3. Resolve the four open data-policy items identified in the report:
   - business/legal form;
   - commercial correspondence address;
   - Article 14 GDPR information wording;
   - documented legitimate-interest balancing test.
4. Obtain legal review before reopening G2/public outreach.
5. Perform manual QA on real sites only after the data-policy/legal conditions are satisfied and the exact scanning basis has been reviewed.

## Communication rule

Never market A11y Evidence as:

- a certificate;
- proof of full WCAG/BFSG/EAA/ADA compliance;
- legal advice;
- a guarantee of avoiding fines/lawsuits;
- a fully automated accessibility audit.

Permitted direction: describe technical findings, clearly state coverage limits, distinguish automated findings from human-review/not-testable criteria, and preserve conservative wording.
