import { Controller, Get, Inject, ServiceUnavailableException } from "@nestjs/common";
import { type HealthResponse, healthResponseSchema } from "@zenval/contracts";
import { DatabaseService } from "./database.service";

@Controller("health")
export class HealthController {
  constructor(@Inject(DatabaseService) private readonly database: DatabaseService) {}

  @Get()
  health(): HealthResponse {
    return healthResponseSchema.parse({
      status: "ok",
      service: "zenval.api",
      timestamp: new Date().toISOString(),
    });
  }

  @Get("ready")
  async ready(): Promise<{ status: "ok" }> {
    if (!(await this.database.isReady())) {
      throw new ServiceUnavailableException("Database unavailable");
    }
    return { status: "ok" };
  }
}
