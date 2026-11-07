ALTER TABLE ledger.business_event
  ADD CONSTRAINT business_event_id_workspace_unique UNIQUE (id, workspace_id);

ALTER TABLE ledger.ledger_entry
  ADD CONSTRAINT ledger_entry_event_workspace_fk
  FOREIGN KEY (business_event_id, workspace_id)
  REFERENCES ledger.business_event (id, workspace_id);
