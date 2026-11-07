import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Post,
  ServiceUnavailableException,
} from "@nestjs/common";
import {
  type CreateDemoTransactionResponse,
  createDemoTransactionRequestSchema,
  type DemoFinanceSnapshot,
} from "@zenval/contracts";
import { DemoCaptureCapacityError, DemoFinanceService } from "./demo-finance.service";

@Controller("demo")
export class DemoFinanceController {
  constructor(@Inject(DemoFinanceService) private readonly finance: DemoFinanceService) {}

  @Get("finance")
  getFinance(): DemoFinanceSnapshot {
    return this.finance.getSnapshot();
  }

  @Post("transactions")
  createTransaction(
    @Body() body: unknown,
    @Headers("x-idempotency-key") idempotencyKey: string | undefined,
    @Headers("x-demo-session-id") demoSessionId: string | undefined,
  ): CreateDemoTransactionResponse {
    const normalizedIdempotencyKey = idempotencyKey?.trim();
    if (!normalizedIdempotencyKey || normalizedIdempotencyKey.length > 128) {
      throw new BadRequestException("X-Idempotency-Key must contain 1 to 128 characters");
    }
    const normalizedDemoSessionId = demoSessionId?.trim();
    if (!normalizedDemoSessionId || normalizedDemoSessionId.length > 128) {
      throw new BadRequestException("X-Demo-Session-Id must contain 1 to 128 characters");
    }

    const request = createDemoTransactionRequestSchema.safeParse(body);
    if (!request.success) {
      throw new BadRequestException(request.error.flatten());
    }

    try {
      return this.finance.createTransaction(
        request.data,
        normalizedIdempotencyKey,
        normalizedDemoSessionId,
      );
    } catch (error) {
      if (error instanceof DemoCaptureCapacityError) {
        throw new ServiceUnavailableException(error.message);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : "Invalid demo capture",
      );
    }
  }
}
