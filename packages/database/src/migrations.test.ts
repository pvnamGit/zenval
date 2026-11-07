import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { pendingMigrations, readMigrations } from "./migrations";

describe("migration history", () => {
  it("loads ordered, checksummed migrations and detects changed or missing history", async () => {
    const dir = await mkdtemp(join(tmpdir(), "zenval-migrations-"));
    try {
      await writeFile(join(dir, "0002_second.sql"), "select 2;");
      await writeFile(join(dir, "0001_first.sql"), "select 1;");
      const files = await readMigrations(dir);
      expect(files.map((file) => file.name)).toEqual(["0001_first.sql", "0002_second.sql"]);
      const [first, second] = files;
      if (!first || !second) throw new Error("Expected two migrations");
      expect(pendingMigrations(files, [first])).toEqual([second]);
      expect(() => pendingMigrations(files, [{ ...first, checksum: "changed" }])).toThrow();
      expect(() => pendingMigrations(files, [second])).toThrow();
      expect(() => pendingMigrations([], [first])).toThrow();
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("rejects duplicate versions and invalid filenames", async () => {
    const dir = await mkdtemp(join(tmpdir(), "zenval-migrations-"));
    try {
      await writeFile(join(dir, "0001_a.sql"), "select 1;");
      await writeFile(join(dir, "0001_b.sql"), "select 1;");
      await expect(readMigrations(dir)).rejects.toThrow("Duplicate migration version");
      await rm(join(dir, "0001_b.sql"));
      await writeFile(join(dir, "bad-name.sql"), "select 1;");
      await expect(readMigrations(dir)).rejects.toThrow("Invalid migration filename");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("rejects transaction control even when comments split its keywords", async () => {
    const dir = await mkdtemp(join(tmpdir(), "zenval-migrations-"));
    try {
      await writeFile(join(dir, "0001_bad.sql"), "PREPARE/* comment */TRANSACTION 'x';");
      await expect(readMigrations(dir)).rejects.toThrow("Transaction control");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
