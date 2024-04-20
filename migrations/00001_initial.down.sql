--
-- Initial Database Schema
--

SET search_path = public, pg_catalog;

--
-- account_awarechannel
--

DROP TABLE IF EXISTS public.account_awarechannel;
DROP SEQUENCE IF EXISTS public.account_awarechannel_id_seq;

--
-- account_country
--

DROP TABLE IF EXISTS public.account_country;
DROP SEQUENCE IF EXISTS public.account_country_id_seq;

--
-- account_emailaddress
--

DROP TABLE IF EXISTS public.account_emailaddress;
DROP SEQUENCE IF EXISTS public.account_emailaddress_id_seq;

--
-- account_ethnicity
--

DROP TABLE IF EXISTS public.account_ethnicity;
DROP SEQUENCE IF EXISTS public.account_ethnicity_id_seq;

--
-- account_fundingagency
--

DROP TABLE IF EXISTS public.account_fundingagency;
DROP SEQUENCE IF EXISTS public.account_fundingagency_id_seq;

--
-- account_gender
--

DROP TABLE IF EXISTS public.account_gender;
DROP SEQUENCE IF EXISTS public.account_gender_id_seq;

--
-- account_institution
--

DROP TABLE IF EXISTS public.account_institution;
DROP SEQUENCE IF EXISTS public.account_institution_id_seq;

--
-- account_institution_grid
--

DROP TABLE IF EXISTS public.account_institution_grid;
DROP SEQUENCE IF EXISTS public.account_institution_grid_id_seq;

--
-- account_occupation
--

DROP TABLE IF EXISTS public.account_occupation;
DROP SEQUENCE IF EXISTS public.account_occupation_id_seq;

--
-- account_passwordreset
--

DROP TABLE IF EXISTS public.account_passwordreset;
DROP SEQUENCE IF EXISTS public.account_passwordreset_id_seq;

--
-- account_passwordresetrequest
--

DROP TABLE IF EXISTS public.account_passwordresetrequest;
DROP SEQUENCE IF EXISTS public.account_passwordresetrequest_id_seq;

--
-- account_region
--

DROP TABLE IF EXISTS public.account_region;
DROP SEQUENCE IF EXISTS public.account_region_id_seq;

--
-- account_researcharea
--

DROP TABLE IF EXISTS public.account_researcharea;
DROP SEQUENCE IF EXISTS public.account_researcharea_id_seq;

--
-- account_restrictedusername
--

DROP TABLE IF EXISTS public.account_restrictedusername;
DROP SEQUENCE IF EXISTS public.account_restrictedusername_id_seq;

--
-- account_user_sanitized
--

DROP VIEW IF EXISTS public.account_user_sanitized;

--
-- account_user
--

DROP TABLE IF EXISTS public.account_user;
DROP SEQUENCE IF EXISTS public.account_user_id_seq;
--
-- account_user_groups
--

DROP TABLE IF EXISTS public.account_user_groups;
DROP SEQUENCE IF EXISTS public.account_user_groups_id_seq;

--
-- account_user_user_permissions
--

DROP TABLE IF EXISTS public.account_user_user_permissions;
DROP SEQUENCE IF EXISTS public.account_user_user_permissions_id_seq;

--
-- account_userinstitution
--

DROP TABLE IF EXISTS public.account_userinstitution;
DROP SEQUENCE IF EXISTS public.account_userinstitution_id_seq;

--
-- api_accessrequest
--

DROP TABLE IF EXISTS public.api_accessrequest;
DROP SEQUENCE IF EXISTS public.api_accessrequest_id_seq;

--
-- api_accessrequestanswer
--

DROP TABLE IF EXISTS public.api_accessrequestanswer;
DROP SEQUENCE IF EXISTS public.api_accessrequestanswer_id_seq;

--
-- api_accessrequestconversation
--

DROP TABLE IF EXISTS public.api_accessrequestconversation;
DROP SEQUENCE IF EXISTS public.api_accessrequestconversation_id_seq;

--
-- api_accessrequestlog
--

DROP TABLE IF EXISTS public.api_accessrequestlog;
DROP SEQUENCE IF EXISTS public.api_accessrequestlog_id_seq;

--
-- api_accessrequestquestion
--

DROP TABLE IF EXISTS public.api_accessrequestquestion;
DROP SEQUENCE IF EXISTS public.api_accessrequestquestion_id_seq;

--
-- api_contact
--

DROP TABLE IF EXISTS public.api_contact;
DROP SEQUENCE IF EXISTS public.api_contact_id_seq;

--
-- api_cyverseservice
--

DROP TABLE IF EXISTS public.api_cyverseservice;

--
-- api_emailaddressmailinglist
--

DROP TABLE IF EXISTS public.api_emailaddressmailinglist;
DROP SEQUENCE IF EXISTS public.api_emailaddressmailinglist_id_seq;

--
-- api_form
--

DROP TABLE IF EXISTS public.api_form;
DROP SEQUENCE IF EXISTS public.api_form_id_seq;

--
-- api_formfield
--

DROP TABLE IF EXISTS public.api_formfield;
DROP SEQUENCE IF EXISTS public.api_formfield_id_seq;

--
-- api_formfieldoption
--

DROP TABLE IF EXISTS public.api_formfieldoption;
DROP SEQUENCE IF EXISTS public.api_formfieldoption_id_seq;

--
-- api_formfieldsubmission
--

DROP TABLE IF EXISTS public.api_formfieldsubmission;
DROP SEQUENCE IF EXISTS public.api_formfieldsubmission_id_seq;

--
-- api_formgroup
--

DROP TABLE IF EXISTS public.api_formgroup;
DROP SEQUENCE IF EXISTS public.api_formgroup_id_seq;

--
-- api_formgroupform
--

DROP TABLE IF EXISTS public.api_formgroupform;
DROP SEQUENCE IF EXISTS public.api_formgroupform_id_seq;

--
-- api_formintercomteam
--

DROP TABLE IF EXISTS public.api_formintercomteam;
DROP SEQUENCE IF EXISTS public.api_formintercomteam_id_seq;

--
-- api_formsection
--

DROP TABLE IF EXISTS public.api_formsection;
DROP SEQUENCE IF EXISTS public.api_formsection_id_seq;

--
-- api_formsubmission
--

DROP TABLE IF EXISTS public.api_formsubmission;
DROP SEQUENCE IF EXISTS public.api_formsubmission_id_seq;

--
-- api_formsubmissionconversation
--

DROP TABLE IF EXISTS public.api_formsubmissionconversation;
DROP SEQUENCE IF EXISTS public.api_formsubmissionconversation_id_seq;

--
-- api_helpservice
--

DROP TABLE IF EXISTS public.api_helpservice;

--
-- api_intercomteam
--

DROP TABLE IF EXISTS public.api_intercomteam;
DROP SEQUENCE IF EXISTS public.api_intercomteam_id_seq;

--
-- api_mailinglist
--

DROP TABLE IF EXISTS public.api_mailinglist;
DROP SEQUENCE IF EXISTS public.api_mailinglist_id_seq;

--
-- api_poweredbyoption
--

DROP TABLE IF EXISTS public.api_poweredbyoption;
DROP SEQUENCE IF EXISTS public.api_poweredbyoption_id_seq;

--
-- api_poweredservice
--

DROP TABLE IF EXISTS public.api_poweredservice;

--
-- api_poweredservicecyverseservice
--

DROP TABLE IF EXISTS public.api_poweredservicecyverseservice;
DROP SEQUENCE IF EXISTS public.api_poweredservicecyverseservice_id_seq;

--
-- api_poweredservicepoweredbyoption
--

DROP TABLE IF EXISTS public.api_poweredservicepoweredbyoption;
DROP SEQUENCE IF EXISTS public.api_poweredservicepoweredbyoption_id_seq;

--
-- api_service
--

DROP TABLE IF EXISTS public.api_service;
DROP SEQUENCE IF EXISTS public.api_service_id_seq;

--
-- api_serviceform
--

DROP TABLE IF EXISTS public.api_serviceform;
DROP SEQUENCE IF EXISTS public.api_serviceform_id_seq;

--
-- api_servicemaintainer
--

DROP TABLE IF EXISTS public.api_servicemaintainer;
DROP SEQUENCE IF EXISTS public.api_servicemaintainer_id_seq;

--
-- api_serviceresource
--

DROP TABLE IF EXISTS public.api_serviceresource;
DROP SEQUENCE IF EXISTS public.api_serviceresource_id_seq;

--
-- api_servicestatus
--

DROP TABLE IF EXISTS public.api_servicestatus;
DROP SEQUENCE IF EXISTS public.api_servicestatus_id_seq;

--
-- api_userservice
--

DROP TABLE IF EXISTS public.api_userservice;
DROP SEQUENCE IF EXISTS public.api_userservice_id_seq;

--
-- api_userworkshop
--

DROP TABLE IF EXISTS public.api_userworkshop;
DROP SEQUENCE IF EXISTS public.api_userworkshop_id_seq;

--
-- api_userworkshopcode
--

DROP TABLE IF EXISTS public.api_userworkshopcode;
DROP SEQUENCE IF EXISTS public.api_userworkshopcode_id_seq;

--
-- api_workshop
--

DROP TABLE IF EXISTS public.api_workshop;
DROP SEQUENCE IF EXISTS public.api_workshop_id_seq;

--
-- api_workshopcode
--

DROP TABLE IF EXISTS public.api_workshopcode;
DROP SEQUENCE IF EXISTS public.api_workshopcode_id_seq;

--
-- api_workshopcontact
--

DROP TABLE IF EXISTS public.api_workshopcontact;
DROP SEQUENCE IF EXISTS public.api_workshopcontact_id_seq;

--
-- api_workshopenrollmentrequest
--

DROP TABLE IF EXISTS public.api_workshopenrollmentrequest;
DROP SEQUENCE IF EXISTS public.api_workshopenrollmentrequest_id_seq;

--
-- api_workshopenrollmentrequestlog
--

DROP TABLE IF EXISTS public.api_workshopenrollmentrequestlog;
DROP SEQUENCE IF EXISTS public.api_workshopenrollmentrequestlog_id_seq;

--
-- api_workshopform
--

DROP TABLE IF EXISTS public.api_workshopform;
DROP SEQUENCE IF EXISTS public.api_workshopform_id_seq;

--
-- api_workshopformsubmission
--

DROP TABLE IF EXISTS public.api_workshopformsubmission;
DROP SEQUENCE IF EXISTS public.api_workshopformsubmission_id_seq;

--
-- api_workshoporganizer
--

DROP TABLE IF EXISTS public.api_workshoporganizer;
DROP SEQUENCE IF EXISTS public.api_workshoporganizer_id_seq;

--
-- api_workshopservice
--

DROP TABLE IF EXISTS public.api_workshopservice;
DROP SEQUENCE IF EXISTS public.api_workshopservice_id_seq;

--
-- api_workshopuseremail
--

DROP TABLE IF EXISTS public.api_workshopuseremail;
DROP SEQUENCE IF EXISTS public.api_workshopuseremail_id_seq;

--
-- auth_group
--

DROP TABLE IF EXISTS public.auth_group;
DROP SEQUENCE IF EXISTS public.auth_group_id_seq;

--
-- auth_group_permissions
--

DROP TABLE IF EXISTS public.auth_group_permissions;
DROP SEQUENCE IF EXISTS public.auth_group_permissions_id_seq;

--
-- auth_permission
--

DROP TABLE IF EXISTS public.auth_permission;
DROP SEQUENCE IF EXISTS public.auth_permission_id_seq;

--
-- django_admin_log
--

DROP TABLE IF EXISTS public.django_admin_log;
DROP SEQUENCE IF EXISTS public.django_admin_log_id_seq;

--
-- django_celery_results_taskresult
--

DROP TABLE IF EXISTS public.django_celery_results_taskresult;
DROP SEQUENCE IF EXISTS public.django_celery_results_taskresult_id_seq;

--
-- django_content_type
--

DROP TABLE IF EXISTS public.django_content_type;
DROP SEQUENCE IF EXISTS public.django_content_type_id_seq;

--
-- django_auth_accesstoken
--

DROP TABLE IF EXISTS public.django_cyverse_auth_accesstoken;

--
-- django_cyvers_auth_token
--

DROP TABLE IF EXISTS public.django_cyverse_auth_token;

--
-- django_cyverse_auth_userproxy
--

DROP TABLE IF EXISTS public.django_cyverse_auth_userproxy;
DROP SEQUENCE IF EXISTS public.django_cyverse_auth_userproxy_id_seq;

--
-- django_migrations
--

DROP TABLE IF EXISTS public.django_migrations;
DROP SEQUENCE IF EXISTS public.django_migrations_id_seq;

--
-- django_session
--

DROP TABLE IF EXISTS public.django_session;

--
-- session
--

DROP TABLE IF EXISTS public.session;

--
-- warden_atmosphereinternationalrequest
--

DROP TABLE IF EXISTS public.warden_atmosphereinternationalrequest;
DROP SEQUENCE IF EXISTS public.warden_atmosphereinternationalrequest_id_seq;

--
-- warden_atmospherestudentrequest
--

DROP TABLE IF EXISTS public.warden_atmospherestudentrequest;
DROP SEQUENCE IF EXISTS public.warden_atmospherestudentrequest_id_seq;
