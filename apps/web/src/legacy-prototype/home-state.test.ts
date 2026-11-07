import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PrototypeApp } from "./prototype-app";
import type { PrototypeViewOrMore } from "./prototype-model";
import type { PrototypeState } from "./prototype-ui";

const HomePage = () => React.createElement(PrototypeApp);

function render(view: PrototypeViewOrMore = "home", state: Partial<PrototypeState> = {}) {
  vi.stubGlobal("React", React);
  return renderToStaticMarkup(
    React.createElement(PrototypeApp, { initialView: view, initialState: state }),
  );
}

describe("prototype UI in apps/web", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("renders the focused home with today's spending, financial health, and attention cards", () => {
    vi.stubGlobal("React", React);
    const html = renderToStaticMarkup(React.createElement(HomePage));
    expect(html).toContain('class="home-minimal"');
    expect(html).toContain("home-spending-card");
    expect(html).toContain("financial-health-card");
    expect(html).toContain("home-attention");
    expect(html).toContain("636.000 ₫");
    expect(html).toContain('id="top-quick-add"');
    expect(html).not.toContain('id="home-quick-add"');
  });

  it("keeps derived home values explainable with source, freshness, version, and horizon", () => {
    const html = render();
    for (const key of ["todayCashflow", "safeToSpend", "cashFlow", "netWorth"]) {
      expect(html).toContain(`data-derived-value="${key}"`);
    }
    expect(html).toContain('data-version="sts-v1.0"');
    expect(html).toContain('data-horizon-end="2026-11-15"');
    expect(html).toContain('data-as-of="2026-11-01T08:30:00+07:00"');
    expect(html).toContain('id="explain-today"');
  });

  it("excludes internal transfers from today's spending", () => {
    const html = render();
    expect(html).toMatch(/<span data-pnl-impact="false"><small>Chuyển khoản nội bộ<\/small>/);
  });

  it("renders every PRD §5.1 top-level view and its section navigation", () => {
    const markers: Record<string, string> = {
      review: 'data-record-kind="transfer"',
      transactions: 'class="subnav-bar"',
      accounts: "211.600.000 ₫",
      investments: 'id="investment-holdings-list"',
      debts: 'data-obligation-direction="payable"',
      plan: 'data-action="save-allocation"',
      reports: 'data-pnl-impact="false"',
      settings: 'id="base-currency-input"',
      system: "state-matrix",
      auth: 'data-action="google-sign-in"',
      more: "more-link",
    };
    for (const [view, marker] of Object.entries(markers)) {
      expect(render(view as PrototypeViewOrMore)).toContain(marker);
    }
  });

  it("protects brokerage cash from double counting and keeps principal out of P&L", () => {
    expect(render("investments")).toContain('data-double-count-protected="true"');
    const commitments = render("transactions", { txSub: "commitments" });
    expect(commitments).toContain('id="fixed-commitments-screen"');
    expect(commitments).toContain('data-commitment-kind="debt-installment"');
    expect(commitments).toContain('data-pnl-impact="interest-only"');
    expect(render("debts", { debtSub: "receivables" })).toContain("6.500.000 ₫");
  });

  it("renders dialogs with an inert background and explanation provenance", () => {
    const html = render("home", { dialog: "explain", derivedKey: "netWorth" });
    expect(html).toContain('role="dialog"');
    expect(html).toContain('class="app-main" inert=""');
    expect(html).toContain("networth-v1.0");
    expect(html).toContain("292.600.000 ₫");
    expect(render("home", { dialog: "quick-add" })).toContain('id="quick-amount-input"');
    expect(render("investments", { dialog: "investment-add" })).toContain('id="inv-symbol-input"');
    expect(render("debts", { dialog: "debt-add", debtDirection: "receivable" })).toContain(
      'id="debt-erv-preview"',
    );
  });

  it("never repeats a literal plus glyph in action labels", () => {
    for (const view of ["transactions", "accounts", "investments", "debts", "plan"] as const) {
      expect(render(view)).not.toMatch(/>\+ (Tạo|Thêm|Ghi|Create|Add|Log)/);
    }
  });
});
