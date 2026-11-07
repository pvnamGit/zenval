import { Controller, Get } from "@nestjs/common";
import type { DashboardSnapshot } from "@zenval/contracts";
// biome-ignore lint/style/useImportType: Nest reflects this constructor type for dependency injection.
import { DemoDashboardService } from "./demo-dashboard.service";

@Controller("demo/dashboard")
export class DemoDashboardController {
  private readonly dashboard: DemoDashboardService;

  constructor(dashboard: DemoDashboardService) {
    this.dashboard = dashboard;
  }

  @Get()
  getDashboard(): DashboardSnapshot {
    return this.dashboard.getSnapshot();
  }
}
