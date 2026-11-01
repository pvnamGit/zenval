CREATE SCHEMA IF NOT EXISTS ledger;

CREATE TABLE ledger.business_event (
  id uuid PRIMARY KEY,
  workspace_id uuid NOT NULL,
  event_type text NOT NULL,
  occurred_at timestamptz NOT NULL,
  posted_at timestamptz NOT NULL
);

CREATE INDEX business_event_workspace_posted_idx
  ON ledger.business_event (workspace_id, posted_at);

CREATE TABLE ledger.ledger_entry (
  id uuid PRIMARY KEY,
  business_event_id uuid NOT NULL REFERENCES ledger.business_event (id),
  workspace_id uuid NOT NULL,
  account_id uuid NOT NULL,
  amount numeric(38, 12) NOT NULL,
  currency text NOT NULL CHECK (currency ~ '^[A-Z]{3}$')
);

CREATE INDEX ledger_entry_workspace_event_idx
  ON ledger.ledger_entry (workspace_id, business_event_id);
