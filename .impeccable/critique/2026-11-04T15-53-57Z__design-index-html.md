---

target: design/index.html
total_score: 26
max_score: 40
na_heuristics:
p0_count: 3
p1_count: 3
target_identity: "file:/Users/nampv/Documents/repository/zenval/design/index.html"
target_fingerprint: "sha256:f278ca370b958b163ad9792a02dcdf3157a05d9a88efa1b269ccb6525b688392"
target_path: /Users/nampv/Documents/repository/zenval/design/index.html
timestamp: 2026-11-04T15-53-57Z
slug: design-index-html
---

Method: dual-agent (A: 2d0c330f-9bb8-4fa2-829f-92de85bcbcb0 · B: e07d18ee-2a11-44ee-b495-866ea040f03b)

### Design Health Score (Nielsen's 10 Heuristics)

| #         | Heuristic                       | Score     | Key Issue                                                                                                                                                       |
| --------- | ------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1         | Visibility of System Status     | 3         | Ledger filter pills (`demo-filter`) never update active state; mobile nav badge `3` sits on `#transactions` instead of `#review`                                |
| 2         | Match System / Real World       | 4         | Exemplary Vietnamese personal finance domain language (VND, vàng 9999 theo chỉ, ERV, non-P&L transfer/principal rails)                                          |
| 3         | User Control and Freedom        | 2         | Dialog input `change` triggers full `render()` and yanks focus back to Close button; session-added transactions/commitments/holdings cannot be undone or edited |
| 4         | Consistency and Standards       | 2         | Duplicate primary CTAs stacked within 60px on `#investments` and `#transactions -> commitments`; `data-demo` no-op buttons styled identically to live actions   |
| 5         | Error Prevention                | 3         | Commitment modal silently defaults an empty amount input to `1.500.000` (`app.js:2661`) instead of validating required input                                    |
| 6         | Recognition Rather Than Recall  | 3         | Explain drawer (`app.js:1856`) dumps raw code slugs (`account-balances · portfolio-holdings`) for 4 of 6 metrics instead of financial line items                |
| 7         | Flexibility and Efficiency      | 2         | `⌘K` focuses a dead search input (`app.js:553`); dialogs lack `<form>` submit on `Enter` and break keyboard Tab flow on `change`                                |
| 8         | Aesthetic and Minimalist Design | 2         | Secondary views recycle the identical 4-box `.today-kpi-grid` + `.review-list` template and stack up to 3 pills + 5 tinted icon boxes per view                  |
| 9         | Error Recovery                  | 2         | Commitment validation uses a transient toast (`app.js:2669`) that wipes focus; `.form-error` lacks `tabindex="-1"` and fields lack `aria-invalid`               |
| 10        | Help and Documentation          | 3         | Strong inline accounting explanations, but raw `source_ids` slugs leak into Suggestions (`app.js:1478`) and Explain drawers (`app.js:1856`)                     |
| **Total** |                                 | **26/40** | **Acceptable (Significant improvements needed)**                                                                                                                |

### Audit Health Score (Impeccable 5-Dimension Technical Audit)

| #         | Dimension                | Score    | Key Finding                                                                                                                                               |
| --------- | ------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1         | Accessibility            | 1        | Dark-mode primary CTA contrast is 2.1:1 (`#ffffff` on `#58c49c`); dialog input `change` resets focus to Close button; 6–14 text elements per screen <11px |
| 2         | Performance              | 2        | Full `root.innerHTML = shell()` rebuild on every click/change/toast; un-cleared toast timers trigger overlapping DOM wipes; ~400 lines of dead CSS        |
| 3         | Theming                  | 2        | Hard-coded `color: white` on dark-mode pastel `--accent` (`#58c49c`) and `--amber` (`#f1b65d`); hard-coded light hex swatches in `#system`                |
| 4         | Responsive Design        | 1        | P0 navigation blackout at `761px–1019px` (tablet portrait) where both `.sidebar` and `.mobile-nav` are `display: none`; touch targets 36–40px             |
| 5         | Implementation Integrity | 2        | Broken ledger filters (`demo-filter`), missing CSS for `.section-actions`/`.row-actions`/`.field-help`, repeated tinted icon chips & decorative gradients |
| **Total** |                          | **8/20** | **Poor (Major overhaul needed on technical/responsive rails)**                                                                                            |

### Design Specificity Verdict

- **LLM Assessment (Assessment A)**: Deeply authentic in domain math (`BigInt` VND, TCBS brokerage cash deduplication, ERV receivables, principal vs. interest split) and calm on `#home`, but visually trapped in a repetitive SaaS kit on every secondary route (`.subnav-bar` + 4-card `.today-kpi-grid` + `.review-list`), while orphaned chart CSS (`.line-chart`, `.worth-bar`) goes unused on `#plan` (Forecast) and `#reports` (Net-Worth Bridge).
- **Deterministic Scan (Assessment B)**:
  - `impeccable detect --json design`: 3 warnings (`2x overused-font` for `Inter`, `1x dark-glow` for colored shadow `#13795b` on dark background).
  - `lint.mjs --app design`: 5 FAIL (`4x [gradient]` in `styles.css:324, 491, 915, 1261`; `1x [placeholder-data]` `example.com` in `app.js:1746`), 14 WARN (`3x [eyebrow]`, `1x [numbering]`, `3x [glass]`, `6x [shadow]`, `1x [em-dash]`).
  - `inspect.mjs --app`:
    - `#home` (`.taste-skill/before`): 4 FAIL (`[button-fx]`, `[contrast]` 2.1:1 on "Ghi giao dịch", `[icon-chips]` 5 tinted icon squares, `[tiny-text]` 7 blocks under 11px), 1 WARN (`[micro-label]`).
    - `#transactions` (`.taste-skill/before-transactions`): 3 FAIL (`[button-fx]`, `[contrast]` 2.1:1, `[tiny-text]` 6 blocks), 1 WARN (`[icon-chips]` 7 identical green arrow squares across income, grocery, transfer, and loan rows).
    - `#investments` (`.taste-skill/before-investments`): 3 FAIL (`[button-fx]`, `[contrast]` 2.1:1 on both primary CTAs, `[tiny-text]` 14 blocks under 11px).
    - `#plan` (`.taste-skill/before-plan`): 4 FAIL (`[button-fx]`, `[palette-purple]` `#b7a7ef`, `[contrast]` 2.1:1, `[tiny-text]` 6 blocks), 1 WARN (`[panel-void]` 94px blank band inside stretched "Có thể chi an toàn" card).

### Priority Issues

1. **[P0] Tablet Navigation Dead Zone (`761px–1019px`)**: At `768px` (confirmed in `.taste-skill/before/tablet-fold.jpg`), `.mobile-nav` and `.mobile-brand` hide at `min-width: 761px` (`styles.css:2025, 2074`) while `.sidebar` stays `display: none` until `min-width: 1020px` (`styles.css:133, 2153`), leaving zero navigation on tablet portrait.
2. **[P0] Dark-Mode Primary Button & Badge Contrast Failure (2.1:1)**: `.primary-button` (`styles.css:212`), `.brand-mark` (`styles.css:171`), `.mobile-add` (`styles.css:1625`), and `.mobile-icon-wrap > i` (`styles.css:1615`) hard-code `color: white` over dark-mode `--accent: #58c49c` (2.1:1) and `--amber: #f1b65d` (1.82:1).
3. **[P0] Dialog Input `change` Yanks Focus to Close Button & Toast Timer Wipes DOM**: `change` events on `#inv-*` and `#debt-*` inputs (`app.js:2312-2326`) call `render()` (`app.js:2241-2243`), which replaces `root.innerHTML` and focuses `[data-initial-focus]` (the Close `X` button). Un-cleared `setTimeout` in `toast()` (`app.js:2268-2277`) triggers another full DOM wipe 2.6s later.
4. **[P1] Sub-11px Micro-Typography & Light-Mode `--ink-faint` Contrast (3.11:1)**: 6 to 14 elements per screen render at `8px–10px` (`styles.css:367, 526, 934, 1593, 1615, 1866`), and light-mode `--ink-faint: #7c8e88` (`styles.css:10`) fails WCAG AA (3.11:1 on `--surface-subtle`).
5. **[P1] Repetitive Template Skeleton, Tinted Icon Chips, Duplicate CTAs & Card Void**: Every secondary module repeats `.today-kpi-grid` + `.review-list`; `#transactions` repeats the same tinted green arrow box on every row (`[icon-chips]`); `#investments` and `#transactions -> commitments` render duplicate CTAs within 60px; `.plan-grid` stretches the left Safe-to-Spend card over a `94px` void (`[panel-void]`); resting cards/buttons carry decorative gradients (`[gradient]`) and glow shadows (`[button-fx]`, `dark-glow`).
6. **[P1] Broken Interactive Controls & Raw Slugs in Explain Drawer**: Ledger filter pills (`data-action="demo-filter"`, `app.js:798`) and `.search-box input` (`app.js:553`) do nothing; `commitment-add` (`app.js:2661`) silently defaults an empty amount to `1.500.000`; mobile bottom nav puts badge `3` on `#transactions` (`app.js:561`) instead of `#review`; `explanationDialog()` (`app.js:1856`) prints raw code slugs (`account-balances · portfolio-holdings`) for 4 of 6 metrics; `.section-actions`, `.row-actions`, and `.field-help` have no CSS rules.
