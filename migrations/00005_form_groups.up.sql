-- 00005_form_groups.up.sql
-- Seeds the "Resources" form group and its links to the two data-store request forms
-- seeded by 00004 (form 2 = Data Store Shared Folder Request, form 7 = Community Released
-- Data Folder). Form groups are Django-era data the migrations otherwise never seed; without
-- at least one group the Requests page and the service editor's "Add Request" picker are
-- empty. Only the in-scope group/links are carried over (the other QA form groups reference
-- forms for features not deployed here). Guarded with ON CONFLICT DO NOTHING so it no-ops
-- where the rows already exist (QA/prod) and populates fresh DBs.

SET search_path = public, pg_catalog;

BEGIN;

-- api_formgroup (Resources)
INSERT INTO public.api_formgroup (id, name, description, created_at, updated_at, index) VALUES ('2', 'Resources', 'Fill out these forms to expand the default resource limits for your account', '2017-03-30 12:01:28.796-07', '2017-03-30 13:05:56.201-07', '0') ON CONFLICT (id) DO NOTHING;

-- api_formgroupform (Resources -> form 2, form 7)
INSERT INTO public.api_formgroupform (id, created_at, updated_at, form_id, form_group_id) VALUES ('2', '2017-03-30 12:01:28.796-07', '2017-03-30 13:05:56.201-07', '2', '2') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.api_formgroupform (id, created_at, updated_at, form_id, form_group_id) VALUES ('7', '2017-03-30 12:01:28.796-07', '2017-03-30 13:05:56.201-07', '7', '2') ON CONFLICT (id) DO NOTHING;

-- Advance sequences past the seeded ids.
SELECT pg_catalog.setval('public.api_formgroup_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.api_formgroup), true);
SELECT pg_catalog.setval('public.api_formgroupform_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.api_formgroupform), true);

COMMIT;
