-- 00005_form_groups.down.sql
-- No-op: the form group seeded by the up migration is intentionally retained on rollback.
-- Deleting these shared rows would strip the Resources group (and its form links) from
-- environments that already have them. golang-migrate only requires this file to exist.
SELECT 1;
