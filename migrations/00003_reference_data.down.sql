-- 00003_reference_data.down.sql
-- No-op: the reference/lookup data seeded by the up migration is intentionally retained
-- on rollback. Deleting these rows would violate account_user foreign keys for any
-- existing users. golang-migrate only requires this file to exist.
SELECT 1;
