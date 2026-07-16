-- 00004_service_catalog.down.sql
-- No-op: the service catalog seeded by the up migration is intentionally retained on
-- rollback. Deleting these shared rows would strip services (and dependent access requests)
-- from environments that already have them. golang-migrate only requires this file to exist.
SELECT 1;
