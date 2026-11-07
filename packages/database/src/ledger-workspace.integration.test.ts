import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import postgres from "postgres";
import { describe, expect, it } from "vitest";

describe.skipIf(process.env.ZENVAL_DATABASE_INTEGRATION !== "1")(
  "ledger workspace constraint",
  () => {
    it("accepts the event workspace and rejects an entry from another workspace", async () => {
      if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
      const client = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });
      const rollback = new Error("intentional test rollback");
      const event = randomUUID();
      const workspace = randomUUID();
      try {
        await expect(
          client.begin(async (sql) => {
            const applied =
              await sql`select 1 from zenval_meta.schema_migrations where name = '0002_ledger_workspace_integrity.sql'`;
            if (applied.length === 0) {
              const migration = await readFile(
                resolve(process.cwd(), "../../migrations/0002_ledger_workspace_integrity.sql"),
                "utf8",
              );
              await sql.unsafe(migration).simple();
            }
            await sql`insert into ledger.business_event (id, workspace_id, event_type, occurred_at, posted_at)
          values (${event}, ${workspace}, 'test', now(), now())`;
            await sql`insert into ledger.ledger_entry (id, business_event_id, workspace_id, account_id, amount, currency)
          values (${randomUUID()}, ${event}, ${workspace}, ${randomUUID()}, '1', 'VND')`;
            await expect(
              sql.savepoint(async (tx) => {
                await tx`insert into ledger.ledger_entry (id, business_event_id, workspace_id, account_id, amount, currency)
            values (${randomUUID()}, ${event}, ${randomUUID()}, ${randomUUID()}, '1', 'VND')`;
              }),
            ).rejects.toMatchObject({ code: "23503" });
            throw rollback;
          }),
        ).rejects.toBe(rollback);
      } finally {
        await client.end({ timeout: 5 });
      }
    });
  },
);
