# Marmalio World — Finance Control Tower 2026

Date: 2026-08-25
Status: APPROVED FOR DESIGN / PILOT — final accounting platform choice requires HUMAN + PROFESSIONAL_CHECK

## Decision

Marmalio World should have one finance control layer so the owner does not need to open every sales, banking, advertising and marketplace application separately.

The finance system must support two separate needs:

1. **Accounting / tax source of truth** for Germany.
2. **Management dashboard / AI finance view** for daily business decisions.

These must not be confused. A management dashboard may aggregate and estimate metrics, but statutory bookkeeping/tax records remain in the approved accounting system and professional accounting workflow.

## Target experience

The owner should be able to open one Finance Control Tower and see at minimum:

- cash position;
- gross sales;
- net revenue;
- platform fees;
- refunds;
- payouts received and pending;
- ad spend;
- software/subscription spend;
- cost of goods / variable costs where relevant;
- contribution margin / operating profit estimate;
- revenue by product;
- revenue by channel;
- revenue by language/market where data exists;
- Amazon/KDP/Merch revenue;
- Lemon Squeezy/store revenue;
- affiliate revenue;
- creator/platform monetization revenue;
- tax/VAT reserve estimate clearly marked as estimate;
- R10 portfolio gate status;
- bookkeeping exceptions/missing documents;
- unusual spending or revenue drops;
- cash runway / recurring-cost overview.

The owner should not need to inspect each platform individually except for exceptions, account security, platform-specific disputes or actions that require direct HUMAN approval.

## Architecture

### Layer A — German accounting source of truth

Choose ONE primary German bookkeeping platform after technical review and Steuerberater compatibility check.

Current leading candidates:

### Candidate 1 — Lexware Office

Strengths verified 2026-08-25 from official Lexware documentation:

- German bookkeeping platform with many bank/payment integrations.
- DATEV connectivity for tax-adviser workflows.
- Public REST API supports data exchange and webhooks/events.
- API keys can be created with **individual/granular permissions**, multiple keys are supported, and keys expire after at most 24 months.
- Public API currently requires Lexware Office XL.
- Connected bank accounts can provide balances/transactions in the Lexware UI; some banking operations still require PSD2/TAN authorization.
- Increasing automation of bookkeeping/bank matching is available in the product.

Why it is currently the preferred technical candidate for Marmalio:

- granular API permissions are compatible with least-privilege agent access;
- multiple keys allow separate read-only/read-limited integrations;
- key expiry is safer than permanent all-powerful tokens;
- strong German/DAT​​EV context.

Do not select automatically. Confirm plan cost, required API endpoints, bank compatibility and Steuerberater preference before purchase.

### Candidate 2 — sevdesk

Strengths verified 2026-08-25 from official sevdesk documentation:

- German bookkeeping platform;
- bank accounts can be connected via finAPI;
- DATEV/ADDISON export/integration options;
- REST API can retrieve and modify sevdesk data/functions;
- API can support substantial automation.

Main technical caution:

- sevdesk API authentication uses an administrator API token and official docs describe that token as effectively long-lived while the user exists, so Marmalio must treat it as a high-value secret and avoid exposing it to generic agent prompts, repository files or logs.

### Selection rule

Do not run Lexware Office and sevdesk in parallel as two accounting sources of truth.

Decision should be based on:

1. Steuerberater compatibility;
2. German tax/bookkeeping requirements;
3. bank/payment integrations;
4. API coverage needed by Marmalio;
5. least-privilege/security controls;
6. cost;
7. ease of invoice/document handling;
8. DATEV workflow.

Working technical preference: **Lexware Office first candidate, sevdesk fallback**.

Final selection status: `PROFESSIONAL_CHECK + HUMAN_APPROVAL`.

## Layer B — Marmalio Finance Hub

Build a separate management/analytics layer that reads data from approved sources and presents one consolidated business view.

This layer is NOT the statutory ledger.

Expected sources over time:

- accounting platform;
- approved bank/account balances through accounting/banking connection;
- Lemon Squeezy;
- Amazon KDP / Merch;
- Shopify later;
- affiliate networks;
- YouTube/platform monetization;
- Meta/TikTok advertising spend if activated;
- other approved marketplaces/payment systems.

Prefer direct official APIs/webhooks and existing native integrations where practical.

Do not add a new SaaS simply to duplicate a report already available from the chosen accounting platform or commerce platform.

## Layer C — AI Finance Assistant

ChatGPT / Codex / Claude / Kimi may consume a **sanitized read-only finance view** to support analysis and decisions.

Default AI access:

- READ ONLY;
- aggregate metrics and non-PII operational identifiers where possible;
- no banking credentials;
- no API secrets in prompts/repo;
- no customer PII in GitHub, Notion, generic logs or generic AI prompts;
- no authority to move money.

AI should be able to answer questions such as:

- What did we earn today/week/month?
- Which product/channel has the best margin?
- Which subscriptions are increasing costs?
- Which platform has pending payouts?
- Are refunds rising?
- Which product should we scale?
- What is estimated operating profit before tax?
- Which bookkeeping items are missing documents?
- Has R10 been reached?

Tax/VAT numbers produced by the AI layer must be labeled `ESTIMATE` unless derived directly from an approved accounting/tax workflow and confirmed where professional judgment is required.

## ChatGPT finance-app candidate

The ChatGPT plugin directory currently includes finance/accounting tools, including a read-only business-finance assistant (`Nella Finance AI`) that can query supported accounting platforms and surface cash/KPI/anomaly/tax-estimate insights without posting transactions.

Status for Marmalio: `PILOT-CANDIDATE ONLY`.

Do not install/select it until we confirm that it supports the chosen German accounting platform and adds value beyond the native Marmalio Finance Hub.

Other discovered finance plugins are not automatically approved; avoid tool sprawl.

## Finance Autopilot permissions

### Level F0 — current design

- no integrations live;
- architecture/spec only.

### Level F1 — read-only dashboard

Allowed after HUMAN approval:

- fetch balances/aggregated sales/cost metrics;
- calculate management KPIs;
- detect anomalies;
- generate daily/weekly reports;
- flag missing documents;
- recommend actions.

No writes to banking/accounting ledgers.

### Level F2 — assisted bookkeeping

Only after accounting platform is selected and tested:

- prepare categorization suggestions;
- match documents/transactions where supported;
- prepare reconciliation queues;
- create draft finance tasks;
- prepare draft invoices if explicitly approved by the workflow.

Sensitive write actions still require explicit approval or narrowly approved automation.

### Level F3 — bounded low-risk automation

Only after repeated successful operation and professional review:

- approved repetitive bookkeeping workflows;
- automatic document routing;
- scheduled management reports;
- exception alerts.

### Never autonomous without explicit HUMAN approval

- bank transfers;
- payouts to external recipients;
- adding beneficiaries;
- credit/loan actions;
- investment actions;
- changing tax elections;
- filing tax returns/declarations;
- VAT/Kleinunternehmer decisions;
- paying tax authorities;
- refunds above an approved threshold;
- changing accounting periods or closing books;
- accepting financial/legal contracts.

## Finance data security

Secrets:

- keep API keys/tokens in approved secret storage/environment variables;
- never commit them to GitHub;
- never paste them into generic AI prompts;
- use separate integration credentials per purpose where supported;
- prefer scoped read-only credentials;
- rotate/expire credentials where supported.

PII:

- customer PII stays in approved commerce/accounting/correspondence systems;
- analytics layer should use aggregate or pseudonymous IDs where possible;
- repository stores schemas/tests/mock fixtures only, never production financial/customer records.

## Finance Control Tower QA

Finance outputs require cross-checking before they are treated as decision-grade.

Creator/collector must not be the only reviewer.

Required controls:

1. source timestamp/freshness;
2. source reconciliation status;
3. gross vs net revenue distinction;
4. fee/refund treatment;
5. currency normalization;
6. duplicate transaction detection;
7. payout timing vs sale timing;
8. tax estimate clearly separated from accounting/tax liability;
9. anomaly detection;
10. monthly reconciliation against accounting source of truth.

Critical financial inconsistencies => `FINANCE_QA_FAIL`.

## Recommended initial implementation order

1. Codex reviews this proposal against Architecture v2.2, Compliance Gates and Germany Business Setup.
2. HUMAN/PROFESSIONAL_CHECK selects Lexware Office vs sevdesk after cost/API/Steuerberater compatibility review.
3. Claude creates a read-only Finance Hub technical spec; no credentials and no live connections yet.
4. Define normalized finance KPI schema and mock/test fixtures.
5. Connect the accounting source first.
6. Connect Lemon Squeezy and first live revenue channel.
7. Add Amazon/content monetization/affiliate sources only as they become active.
8. Add automated daily/weekly management reporting.
9. Add anomaly alerts and AI recommendations.
10. Expand write automation only after repeated successful read-only/reconciliation operation.

## Revenue-first rule

Finance Hub must not delay first sales.

Initial objective is visibility, not a large financial data warehouse.

Start with the minimum dashboard needed to answer:

- revenue;
- costs;
- net margin estimate;
- cash/payouts;
- channel/product performance;
- bookkeeping exceptions.

Scale analytics only when transaction/channel complexity justifies it.

## Codex decision required

Codex should decide:

- whether Finance Hub belongs as a new `finance-control-tower` module or as an analytics submodule;
- Lexware Office vs sevdesk technical fit;
- exact data ownership boundaries;
- first read-only integrations;
- permissions for Claude/Kimi/ChatGPT;
- dashboard technology without unnecessary tool duplication;
- what can be automated before and after R10;
- test/reconciliation requirements.

No finance SaaS purchase, accounting-platform signup, bank connection, API-key creation or external financial write is authorized by this document.
