import { randomBytes } from "node:crypto";
import postgres from "postgres";
import { describe, expect, it } from "vitest";
import { migrate } from "./migrations";

describe.skipIf(process.env.ZENVAL_DATABASE_INTEGRATION !== "1")("PostgreSQL migrations", () => {
  it("applies once, rejects changed history, and rolls back a failing migration", async () => {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
    const client = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });
    const observer = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });
    const suffix = randomBytes(8).toString("hex");
    const metadata = `test_meta_${suffix}`;
    const target = `test_data_${suffix}`;
    const rollback = new Error("intentional test rollback");
    try {
      await expect(
        client.begin(async (outer) => {
          // Nest each runner transaction in a savepoint, then roll back this entire test.
          const isolated = {
            begin: (fn: (sql: postgres.TransactionSql) => Promise<unknown>) => outer.savepoint(fn),
          } as unknown as postgres.Sql;
          const first = {
            name: "0001_test.sql",
            sql: `create schema ${target}; create table ${target}.entry (id int);`,
            checksum: "one",
          };
          expect(await migrate(isolated, [first], metadata)).toBe(1);
          const locked = await observer`select pg_try_advisory_xact_lock(204574287, 1) as acquired`;
          expect(locked[0]?.acquired).toBe(false);
          expect(await migrate(isolated, [first], metadata)).toBe(0);
          await expect(
            migrate(isolated, [{ ...first, checksum: "different" }], metadata),
          ).rejects.toThrow();
          await expect(
            migrate(
              isolated,
              [
                first,
                {
                  name: "0002_failure.sql",
                  sql: `create table ${target}.failed (id int); select 1 / 0;`,
                  checksum: "two",
                },
              ],
              metadata,
            ),
          ).rejects.toThrow();
          const rows = await outer`select to_regclass(${`${target}.failed`}) as relation`;
          expect(rows[0]?.relation).toBeNull();
          await expect(migrate(isolated, [{ ...first, sql: "commit;" }], metadata)).rejects.toThrow(
            "Transaction control",
          );
          throw rollback;
        }),
      ).rejects.toBe(rollback);
      const released = await observer`select pg_try_advisory_xact_lock(204574287, 1) as acquired`;
      expect(released[0]?.acquired).toBe(true);
      const cleaned = await observer`select to_regclass(${`${target}.entry`}) as relation`;
      expect(cleaned[0]?.relation).toBeNull();
    } finally {
      await client.end({ timeout: 5 });
      await observer.end({ timeout: 5 });
    }
  });
});
