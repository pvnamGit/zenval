import { Module } from "@nestjs/common";
import { DatabaseService } from "./database.service";
import { DemoDashboardController } from "./demo-dashboard.controller";
import { DemoDashboardService } from "./demo-dashboard.service";
import { DemoFinanceController } from "./demo-finance.controller";
import { DemoFinanceService } from "./demo-finance.service";
import { HealthController } from "./health.controller";

@Module({
  controllers: [HealthController, DemoDashboardController, DemoFinanceController],
  providers: [DemoDashboardService, DemoFinanceService, DatabaseService],
})
export class AppModule {}
