import { Controller, Get } from "@nestjs/common";
import { type HealthResponse, healthResponseSchema } from "@zenval/contracts";

@Controller("health")
export class WorkerHealthController {
  @Get()
  health(): HealthResponse {
    return healthResponseSchema.parse({
      status: "ok",
      service: "zenval.worker",
      timestamp: new Date().toISOString(),
    });
  }
}
