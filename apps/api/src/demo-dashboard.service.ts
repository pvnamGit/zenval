import { Injectable } from "@nestjs/common";
import { type DashboardSnapshot, demoWorkspaceFixtureSchema } from "@zenval/contracts";
import demoWorkspaceFixture from "./fixtures/demo-workspace.json";

/**
 * A read-only synthetic snapshot used while the MVP has no identity, ledger,
 * or persistence slice. It is deliberately labelled `demo` in the contract so
 * a client cannot present it as a user's financial record.
 */
@Injectable()
export class DemoDashboardService {
  getSnapshot(): DashboardSnapshot {
    return demoWorkspaceFixtureSchema.parse(demoWorkspaceFixture).dashboard;
  }
}
