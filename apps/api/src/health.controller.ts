import { Controller, Get } from "@nestjs/common";
import { type HealthResponse, healthResponseSchema } from "@zenval/contracts";

@Controller("health")
export class HealthController {
  @Get()
  health(): HealthResponse {
    return healthResponseSchema.parse({
      status: "ok",
      service: "zenval.api",
      timestamp: new Date().toISOString(),
    });
  }
}
