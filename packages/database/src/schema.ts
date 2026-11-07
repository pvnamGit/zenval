import {
  foreignKey,
  index,
  numeric,
  pgSchema,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const ledgerSchema = pgSchema("ledger");

export const businessEvents = ledgerSchema.table(
  "business_event",
  {
    id: uuid("id").primaryKey(),
    workspaceId: uuid("workspace_id").notNull(),
    eventType: text("event_type").notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
    postedAt: timestamp("posted_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    index("business_event_workspace_posted_idx").on(table.workspaceId, table.postedAt),
    unique("business_event_id_workspace_unique").on(table.id, table.workspaceId),
  ],
);

export const ledgerEntries = ledgerSchema.table(
  "ledger_entry",
  {
    id: uuid("id").primaryKey(),
    businessEventId: uuid("business_event_id")
      .notNull()
      .references(() => businessEvents.id),
    workspaceId: uuid("workspace_id").notNull(),
    accountId: uuid("account_id").notNull(),
    amount: numeric("amount", { precision: 38, scale: 12 }).notNull(),
    currency: text("currency").notNull(),
  },
  (table) => [
    index("ledger_entry_workspace_event_idx").on(table.workspaceId, table.businessEventId),
    foreignKey({
      name: "ledger_entry_event_workspace_fk",
      columns: [table.businessEventId, table.workspaceId],
      foreignColumns: [businessEvents.id, businessEvents.workspaceId],
    }),
  ],
);
