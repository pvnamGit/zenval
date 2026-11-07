import { createDatabase } from "@zenval/database";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DatabaseService } from "./database.service";

vi.mock("@zenval/database", () => ({ createDatabase: vi.fn() }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetAllMocks();
});

describe("database readiness", () => {
  it("is unavailable when the URL is missing or invalid", async () => {
    vi.stubEnv("DATABASE_URL", "");
    expect(await new DatabaseService().isReady()).toBe(false);
    vi.stubEnv("DATABASE_URL", "invalid");
    vi.mocked(createDatabase).mockImplementationOnce(() => {
      throw new Error("sensitive");
    });
    expect(await new DatabaseService().isReady()).toBe(false);
  });

  it("checks PostgreSQL, handles errors and closes its client", async () => {
    vi.stubEnv("DATABASE_URL", "postgres://example.invalid/database");
    const client = Object.assign(
      vi.fn().mockResolvedValueOnce([]).mockRejectedValueOnce(new Error("sensitive")),
      {
        end: vi.fn().mockResolvedValue(undefined),
      },
    );
    vi.mocked(createDatabase).mockReturnValueOnce({ client } as unknown as ReturnType<
      typeof createDatabase
    >);
    const service = new DatabaseService();
    expect(await service.isReady()).toBe(true);
    expect(client.mock.calls[0]?.[0]).toEqual(["select 1"]);
    expect(await service.isReady()).toBe(false);
    await service.onModuleDestroy();
    expect(client.end).toHaveBeenCalledOnce();
  });
});
