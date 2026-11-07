import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export function createDatabase(databaseUrl: string) {
  const client = postgres(databaseUrl, { max: 10, prepare: false, connect_timeout: 5 });
  return {
    client,
    db: drizzle(client, { schema }),
  };
}

export * from "./schema";
