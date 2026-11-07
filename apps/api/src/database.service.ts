import { Injectable, type OnModuleDestroy } from "@nestjs/common";
import { createDatabase } from "@zenval/database";

/** Owns the API's PostgreSQL connection; no financial data is exposed here. */
@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly connection: ReturnType<typeof createDatabase> | undefined;

  constructor() {
    try {
      this.connection = process.env.DATABASE_URL
        ? createDatabase(process.env.DATABASE_URL)
        : undefined;
    } catch {
      // A malformed URL must not leak connection details into startup logs.
      this.connection = undefined;
    }
  }

  async isReady(): Promise<boolean> {
    if (!this.connection) return false;
    try {
      await this.connection.client`select 1`;
      return true;
    } catch {
      // Database errors can contain credentials or connection details.
      return false;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.connection?.client.end({ timeout: 5 });
  }
}
