import { resolve } from "node:path";
import postgres from "postgres";
import { migrate, readMigrations } from "./migrations";

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  const migrations = await readMigrations(resolve(__dirname, "../../../migrations"));
  const client = postgres(process.env.DATABASE_URL, { max: 1, prepare: false, connect_timeout: 5 });
  try {
    const count = await migrate(client, migrations);
    console.log(`Applied ${count} migration(s).`);
  } finally {
    await client.end({ timeout: 5 });
  }
}

main().catch(() => {
  // Connection and server errors can contain sensitive connection details.
  console.error("Migration failed; check database access and migration history.");
  process.exitCode = 1;
});
