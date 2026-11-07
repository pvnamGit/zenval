import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type postgres from "postgres";

export interface Migration {
  readonly name: string;
  readonly sql: string;
  readonly checksum: string;
}

export interface AppliedMigration {
  readonly name: string;
  readonly checksum: string;
}

// Migration files are trusted repository code. Keep transaction control exclusively in the
// runner; conservatively reject these words even in strings or comments.
const transactionControl =
  /\b(?:begin|start|commit|end|rollback|abort|savepoint|release|prepare)\b/i;

export async function readMigrations(directory: string): Promise<Migration[]> {
  const names = (await readdir(directory)).filter((name) => name.endsWith(".sql")).sort();
  if (names.some((name) => !/^\d{4}_[a-z0-9_]+\.sql$/.test(name))) {
    throw new Error("Invalid migration filename");
  }
  const versions = names.map((name) => name.slice(0, 4));
  if (new Set(versions).size !== versions.length) throw new Error("Duplicate migration version");
  return Promise.all(
    names.map(async (name) => {
      const sql = await readFile(join(directory, name), "utf8");
      if (transactionControl.test(sql))
        throw new Error("Transaction control is not allowed in migrations");
      return { name, sql, checksum: createHash("sha256").update(sql).digest("hex") };
    }),
  );
}

/** Existing history must be an unchanged prefix, including ordering. */
export function pendingMigrations(
  available: readonly Migration[],
  applied: readonly AppliedMigration[],
): readonly Migration[] {
  for (const [index, existing] of applied.entries()) {
    const migration = available[index];
    if (
      !migration ||
      migration.name !== existing.name ||
      migration.checksum !== existing.checksum
    ) {
      throw new Error("Migration history does not match available files");
    }
  }
  return available.slice(applied.length);
}

export async function migrate(
  client: postgres.Sql,
  migrations: readonly Migration[],
  metadataSchema = "zenval_meta",
): Promise<number> {
  if (migrations.some((migration) => transactionControl.test(migration.sql))) {
    throw new Error("Transaction control is not allowed in migrations");
  }
  return client.begin(async (sql) => {
    await sql`select pg_advisory_xact_lock(204574287, 1)`;
    await sql`create schema if not exists ${sql(metadataSchema)}`;
    await sql`create table if not exists ${sql(metadataSchema)}.schema_migrations (
      name text primary key,
      checksum text not null,
      applied_at timestamptz not null default now()
    )`;
    const applied = await sql<AppliedMigration[]>`
      select name, checksum from ${sql(metadataSchema)}.schema_migrations order by name
    `;
    const pending = pendingMigrations(migrations, applied);
    for (const migration of pending) {
      await sql.unsafe(migration.sql).simple();
      await sql`insert into ${sql(metadataSchema)}.schema_migrations (name, checksum)
        values (${migration.name}, ${migration.checksum})`;
    }
    return pending.length;
  });
}
