import type {
  CreateDemoTransactionRequest,
  CreateDemoTransactionResponse,
  DashboardSnapshot,
  DemoFinanceSnapshot,
} from "@zenval/contracts";
import type {
  DebtsSnapshot,
  InvestmentsSnapshot,
  PlanningSnapshot,
  ReportsSnapshot,
  ReviewAction,
  ReviewResolution,
} from "./draft-schemas";
import type { MutationOptions, RequestOptions } from "./http-client";

export type ApiSource = "http" | "mock";

/**
 * The application port every screen depends on. Adapters (`createHttpApi`, `createMockApi`)
 * implement it; screens never call `fetch` directly.
 */
export type ZenvalApi = {
  dashboard: {
    get(options?: RequestOptions): Promise<DashboardSnapshot>;
  };
  finance: {
    /** Accounts, recent transactions, and review items for the active workspace. */
    get(options?: RequestOptions): Promise<DemoFinanceSnapshot>;
  };
  transactions: {
    /** Creates a draft capture; it is not a posted ledger fact. */
    create(
      request: CreateDemoTransactionRequest,
      options: MutationOptions,
    ): Promise<CreateDemoTransactionResponse>;
  };
  review: {
    resolve(
      itemId: string,
      action: ReviewAction,
      options: MutationOptions,
    ): Promise<ReviewResolution>;
  };
  planning: {
    get(options?: RequestOptions): Promise<PlanningSnapshot>;
  };
  debts: {
    get(options?: RequestOptions): Promise<DebtsSnapshot>;
  };
  investments: {
    get(options?: RequestOptions): Promise<InvestmentsSnapshot>;
  };
  reports: {
    get(options?: RequestOptions): Promise<ReportsSnapshot>;
  };
};

export type ApiModule = keyof ZenvalApi;

export type ZenvalApiClient = ZenvalApi & {
  /** Which adapter serves each module, so the UI can label sample data honestly. */
  readonly sources: Readonly<Record<ApiModule, ApiSource>>;
};
