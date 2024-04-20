--
-- Initial Constratins
--

SET search_path = public, pg_catalog;

BEGIN;

--
-- drop foreign keys
--

ALTER TABLE ONLY public.api_poweredservicepoweredbyoption
    DROP CONSTRAINT IF EXISTS "D45cebc13548a0e108f3ef0440eec694";

ALTER TABLE ONLY public.api_accessrequestanswer
    DROP CONSTRAINT IF EXISTS "D91b67e45fb3af160e434ce8b5965134";

ALTER TABLE ONLY public.account_user
    DROP CONSTRAINT IF EXISTS account__funding_agency_id_48dc69d4_fk_account_fundingagency_id;

ALTER TABLE ONLY public.account_emailaddress
    DROP CONSTRAINT IF EXISTS account_emailaddress_user_id_2c513194_fk_account_user_id;

ALTER TABLE ONLY public.account_passwordresetrequest
    DROP CONSTRAINT IF EXISTS account_passwordrese_email_address_id_1a2cd918_fk_account_e;

ALTER TABLE ONLY public.account_passwordresetrequest
    DROP CONSTRAINT IF EXISTS account_passwordrese_user_id_28b4624d_fk_account_u;

ALTER TABLE ONLY public.account_passwordreset
    DROP CONSTRAINT IF EXISTS account_passwordreset_user_id_8d2f98f2_fk_account_user_id;

ALTER TABLE ONLY public.account_region
    DROP CONSTRAINT IF EXISTS account_region_country_id_b25a520c_fk_account_country_id;

ALTER TABLE ONLY public.account_user
    DROP CONSTRAINT IF EXISTS account_us_aware_channel_id_d6dfa82b_fk_account_awarechannel_id;

ALTER TABLE ONLY public.account_user
    DROP CONSTRAINT IF EXISTS account_us_research_area_id_9f530d2b_fk_account_researcharea_id;

ALTER TABLE ONLY public.account_user
    DROP CONSTRAINT IF EXISTS account_user_ethnicity_id_3e03590f_fk_account_ethnicity_id;

ALTER TABLE ONLY public.account_user
    DROP CONSTRAINT IF EXISTS account_user_gender_id_dd2adcaa_fk_account_gender_id;

ALTER TABLE ONLY public.account_user_groups
    DROP CONSTRAINT IF EXISTS account_user_groups_group_id_6c71f749_fk_auth_group_id;

ALTER TABLE ONLY public.account_user_groups
    DROP CONSTRAINT IF EXISTS account_user_groups_user_id_14345e7b_fk_account_user_id;

ALTER TABLE ONLY public.account_user
    DROP CONSTRAINT IF EXISTS account_user_occupation_id_05073ebb_fk_account_occupation_id;

ALTER TABLE ONLY public.account_user
    DROP CONSTRAINT IF EXISTS account_user_region_id_4138ba34_fk_account_region_id;

ALTER TABLE ONLY public.account_user_user_permissions
    DROP CONSTRAINT IF EXISTS account_user_user__permission_id_66c44191_fk_auth_permission_id;

ALTER TABLE ONLY public.account_user
    DROP CONSTRAINT IF EXISTS account_user_user_institution_id_fb1c5582_fk_account_i;

ALTER TABLE ONLY public.account_user_user_permissions
    DROP CONSTRAINT IF EXISTS account_user_user_permissio_user_id_cc42d270_fk_account_user_id;

ALTER TABLE ONLY public.account_userinstitution
    DROP CONSTRAINT IF EXISTS account_userinstitut_institution_id_18e3dba5_fk_account_i;

ALTER TABLE ONLY public.account_userinstitution
    DROP CONSTRAINT IF EXISTS account_userinstitution_user_id_0b76a0cb_fk_account_user_id;

ALTER TABLE ONLY public.api_service
    DROP CONSTRAINT IF EXISTS api__service_maintainer_id_0ae12004_fk_api_servicemaintainer_id;

ALTER TABLE ONLY public.api_accessrequestlog
    DROP CONSTRAINT IF EXISTS api_accessre_access_request_id_d021dd12_fk_api_accessrequest_id;

ALTER TABLE ONLY public.api_accessrequest
    DROP CONSTRAINT IF EXISTS api_accessrequest_service_id_8a5d1451_fk_api_service_id;

ALTER TABLE ONLY public.api_accessrequest
    DROP CONSTRAINT IF EXISTS api_accessrequest_user_id_478b1081_fk_account_user_id;

ALTER TABLE ONLY public.api_accessrequestanswer
    DROP CONSTRAINT IF EXISTS api_accessrequestanswer_user_id_816cb9f9_fk_account_user_id;

ALTER TABLE ONLY public.api_accessrequestconversation
    DROP CONSTRAINT IF EXISTS api_accessrequestcon_access_request_id_a8515c28_fk_api_acces;

ALTER TABLE ONLY public.api_accessrequestquestion
    DROP CONSTRAINT IF EXISTS api_accessrequestquestion_service_id_008bdd01_fk_api_service_id;

ALTER TABLE ONLY public.api_contact
    DROP CONSTRAINT IF EXISTS api_contact_service_id_6acbc419_fk_api_service_id;

ALTER TABLE ONLY public.api_cyverseservice
    DROP CONSTRAINT IF EXISTS api_cyverseservice_service_ptr_id_c7823d13_fk_api_service_id;

ALTER TABLE ONLY public.api_emailaddressmailinglist
    DROP CONSTRAINT IF EXISTS api_emailaddressmail_email_address_id_2d07d4e7_fk_account_e;

ALTER TABLE ONLY public.api_emailaddressmailinglist
    DROP CONSTRAINT IF EXISTS api_emailaddressmail_mailing_list_id_65920a16_fk_api_maili;

ALTER TABLE ONLY public.api_formfield
    DROP CONSTRAINT IF EXISTS api_formfield_form_section_id_6f306a91_fk_api_formsection_id;

ALTER TABLE ONLY public.api_formfieldoption
    DROP CONSTRAINT IF EXISTS api_formfieldoption_form_field_id_62aa3e83_fk_api_formfield_id;

ALTER TABLE ONLY public.api_formfieldsubmission
    DROP CONSTRAINT IF EXISTS api_formfieldsubmiss_form_field_id_9e3a6547_fk_api_formf;

ALTER TABLE ONLY public.api_formfieldsubmission
    DROP CONSTRAINT IF EXISTS api_formfieldsubmiss_form_submission_id_51d1f53b_fk_api_forms;

ALTER TABLE ONLY public.api_formfieldsubmission
    DROP CONSTRAINT IF EXISTS api_formfieldsubmiss_value_select_id_fabaa8f4_fk_api_formf;

ALTER TABLE ONLY public.api_formgroupform
    DROP CONSTRAINT IF EXISTS api_formgroupform_form_group_id_a4cc3d7e_fk_api_formgroup_id;

ALTER TABLE ONLY public.api_formgroupform
    DROP CONSTRAINT IF EXISTS api_formgroupform_form_id_073cbd92_fk_api_form_id;

ALTER TABLE ONLY public.api_formintercomteam
    DROP CONSTRAINT IF EXISTS api_formintercomteam_form_id_d2e3c75b_fk_api_form_id;

ALTER TABLE ONLY public.api_formintercomteam
    DROP CONSTRAINT IF EXISTS api_formintercomteam_intercom_team_id_b813a8e6_fk_api_inter;

ALTER TABLE ONLY public.api_formsection
    DROP CONSTRAINT IF EXISTS api_formsection_form_id_5c611d28_fk_api_form_id;

ALTER TABLE ONLY public.api_formsubmission
    DROP CONSTRAINT IF EXISTS api_formsubmission_form_id_1c863302_fk_api_form_id;

ALTER TABLE ONLY public.api_formsubmission
    DROP CONSTRAINT IF EXISTS api_formsubmission_user_id_7e9d6537_fk_account_user_id;

ALTER TABLE ONLY public.api_formsubmissionconversation
    DROP CONSTRAINT IF EXISTS api_formsubmissionco_form_submission_id_9d42c29b_fk_api_forms;

ALTER TABLE ONLY public.api_helpservice
    DROP CONSTRAINT IF EXISTS api_helpservice_service_ptr_id_9dcd90ca_fk_api_service_id;

ALTER TABLE ONLY public.api_mailinglist
    DROP CONSTRAINT IF EXISTS api_mailinglist_service_id_83ffaeff_fk_api_cyver;

ALTER TABLE ONLY public.api_poweredservicepoweredbyoption
    DROP CONSTRAINT IF EXISTS api_pow_powered_by_option_id_78bae803_fk_api_poweredbyoption_id;

ALTER TABLE ONLY public.api_poweredservice
    DROP CONSTRAINT IF EXISTS api_poweredservice_service_ptr_id_2b59ce79_fk_api_service_id;

ALTER TABLE ONLY public.api_serviceform
    DROP CONSTRAINT IF EXISTS api_serviceform_form_id_38a26656_fk_api_form_id;

ALTER TABLE ONLY public.api_serviceform
    DROP CONSTRAINT IF EXISTS api_serviceform_service_id_ba400062_fk_api_service_id;

ALTER TABLE ONLY public.api_serviceresource
    DROP CONSTRAINT IF EXISTS api_serviceresource_service_id_0d506d54_fk_api_service_id;

ALTER TABLE ONLY public.api_servicestatus
    DROP CONSTRAINT IF EXISTS api_servicestatus_service_id_d43acab5_fk_api_service_id;

ALTER TABLE ONLY public.api_userservice
    DROP CONSTRAINT IF EXISTS api_userserv_access_request_id_1745bd33_fk_api_accessrequest_id;

ALTER TABLE ONLY public.api_userservice
    DROP CONSTRAINT IF EXISTS api_userservice_service_id_4ed3a1e1_fk_api_service_id;

ALTER TABLE ONLY public.api_userservice
    DROP CONSTRAINT IF EXISTS api_userservice_user_id_ae6e486d_fk_account_user_id;

ALTER TABLE ONLY public.api_userworkshop
    DROP CONSTRAINT IF EXISTS api_userworkshop_user_id_3dc8dd6f_fk_account_user_id;

ALTER TABLE ONLY public.api_userworkshop
    DROP CONSTRAINT IF EXISTS api_userworkshop_workshop_enrollment__8a6c05a2_fk_api_works;

ALTER TABLE ONLY public.api_userworkshop
    DROP CONSTRAINT IF EXISTS api_userworkshop_workshop_id_ab1b8028_fk_api_workshop_id;

ALTER TABLE ONLY public.api_userworkshopcode
    DROP CONSTRAINT IF EXISTS api_userworkshopcode_user_id_e8825285_fk_account_user_id;

ALTER TABLE ONLY public.api_userworkshopcode
    DROP CONSTRAINT IF EXISTS api_userworkshopcode_workshop_code_id_41e7efb0_fk_api_works;

ALTER TABLE ONLY public.api_workshop
    DROP CONSTRAINT IF EXISTS api_workshop_creator_id_af8fa8dd_fk_account_user_id;

ALTER TABLE ONLY public.api_workshopcode
    DROP CONSTRAINT IF EXISTS api_workshopcode_workshop_id_fddfd219_fk_api_workshop_id;

ALTER TABLE ONLY public.api_workshopcontact
    DROP CONSTRAINT IF EXISTS api_workshopcontact_workshop_id_2e4ffc40_fk_api_workshop_id;

ALTER TABLE ONLY public.api_workshopenrollmentrequest
    DROP CONSTRAINT IF EXISTS api_workshopenrollme_user_id_d36f55b9_fk_account_u;

ALTER TABLE ONLY public.api_workshopenrollmentrequestlog
    DROP CONSTRAINT IF EXISTS api_workshopenrollme_workshop_enrollment__e62392ac_fk_api_works;

ALTER TABLE ONLY public.api_workshopenrollmentrequest
    DROP CONSTRAINT IF EXISTS api_workshopenrollme_workshop_id_4bb40b68_fk_api_works;

ALTER TABLE ONLY public.api_workshopform
    DROP CONSTRAINT IF EXISTS api_workshopform_form_id_3eb3338d_fk_api_form_id;

ALTER TABLE ONLY public.api_workshopformsubmission
    DROP CONSTRAINT IF EXISTS api_workshopformsubm_form_submission_id_18c05abc_fk_api_forms;

ALTER TABLE ONLY public.api_workshopformsubmission
    DROP CONSTRAINT IF EXISTS api_workshopformsubmission_user_id_1c2047eb_fk_account_user_id;

ALTER TABLE ONLY public.api_workshoporganizer
    DROP CONSTRAINT IF EXISTS api_workshoporganizer_organizer_id_273ccc45_fk_account_user_id;

ALTER TABLE ONLY public.api_workshoporganizer
    DROP CONSTRAINT IF EXISTS api_workshoporganizer_workshop_id_8450d9df_fk_api_workshop_id;

ALTER TABLE ONLY public.api_workshopservice
    DROP CONSTRAINT IF EXISTS api_workshopservice_service_id_9d6bbf61_fk_api_service_id;

ALTER TABLE ONLY public.api_workshopservice
    DROP CONSTRAINT IF EXISTS api_workshopservice_workshop_id_e33ba697_fk_api_workshop_id;

ALTER TABLE ONLY public.api_workshopuseremail
    DROP CONSTRAINT IF EXISTS api_workshopuseremail_workshop_id_be8ddd55_fk_api_workshop_id;

ALTER TABLE ONLY public.auth_group_permissions
    DROP CONSTRAINT IF EXISTS auth_group_permiss_permission_id_84c5c92e_fk_auth_permission_id;

ALTER TABLE ONLY public.auth_group_permissions
    DROP CONSTRAINT IF EXISTS auth_group_permissions_group_id_b120cbf9_fk_auth_group_id;

ALTER TABLE ONLY public.auth_permission
    DROP CONSTRAINT IF EXISTS auth_permiss_content_type_id_2f476e4b_fk_django_content_type_id;

ALTER TABLE ONLY public.api_poweredservicecyverseservice
    DROP CONSTRAINT IF EXISTS c8feb1fb9d48559470242ca3262133fa;

ALTER TABLE ONLY public.django_admin_log
    DROP CONSTRAINT IF EXISTS django_admin_content_type_id_c4bce8eb_fk_django_content_type_id;

ALTER TABLE ONLY public.django_admin_log
    DROP CONSTRAINT IF EXISTS django_admin_log_user_id_c564eba6_fk_account_user_id;

ALTER TABLE ONLY public.django_cyverse_auth_token
    DROP CONSTRAINT IF EXISTS django_cyverse_auth_token_user_id_f5d59af8_fk_account_user_id;

ALTER TABLE ONLY public.api_poweredservicecyverseservice
    DROP CONSTRAINT IF EXISTS e699c7c9ef4ec81580faef4428c3306e;

ALTER TABLE ONLY public.account_user
    DROP CONSTRAINT IF EXISTS user_grid_fk_c;

ALTER TABLE ONLY public.warden_atmosphereinternationalrequest
    DROP CONSTRAINT IF EXISTS warden_a_funding_source_id_fd25e5f5_fk_account_fundingagency_id;

ALTER TABLE ONLY public.warden_atmosphereinternationalrequest
    DROP CONSTRAINT IF EXISTS warden_atmosphereinternatio_user_id_acc52e7f_fk_account_user_id;

ALTER TABLE ONLY public.warden_atmospherestudentrequest
    DROP CONSTRAINT IF EXISTS warden_atmospherestudentreq_user_id_6b2ceaa9_fk_account_user_id;

--
-- drop indexes
--

DROP INDEX IF EXISTS "IDX_session_expire";

DROP INDEX IF EXISTS account_emailaddress_e8701ad4;

DROP INDEX IF EXISTS account_emailaddress_email_03be32b2_like;

DROP INDEX IF EXISTS account_passwordreset_user_id_8d2f98f2;

DROP INDEX IF EXISTS account_passwordresetrequest_email_address_id_1a2cd918;

DROP INDEX IF EXISTS account_passwordresetrequest_user_id_28b4624d;

DROP INDEX IF EXISTS account_region_93bfec8a;

DROP INDEX IF EXISTS account_user_0f442f96;

DROP INDEX IF EXISTS account_user_1574219a;

DROP INDEX IF EXISTS account_user_31999bd7;

DROP INDEX IF EXISTS account_user_623af7fd;

DROP INDEX IF EXISTS account_user_8a5c8bdd;

DROP INDEX IF EXISTS account_user_b3a8f282;

DROP INDEX IF EXISTS account_user_e353a8c6;

DROP INDEX IF EXISTS account_user_email_0bd7c421_like;

DROP INDEX IF EXISTS account_user_groups_0e939a4f;

DROP INDEX IF EXISTS account_user_groups_e8701ad4;

DROP INDEX IF EXISTS account_user_user_institution_id_fb1c5582;

DROP INDEX IF EXISTS account_user_user_permissions_8373b171;

DROP INDEX IF EXISTS account_user_user_permissions_e8701ad4;

DROP INDEX IF EXISTS account_user_username_d393f583_like;

DROP INDEX IF EXISTS account_userinstitution_institution_id_18e3dba5;

DROP INDEX IF EXISTS account_userinstitution_user_id_0b76a0cb;

DROP INDEX IF EXISTS api_accessrequest_b0dc1e29;

DROP INDEX IF EXISTS api_accessrequest_e8701ad4;

DROP INDEX IF EXISTS api_accessrequestanswer_13c3dc40;

DROP INDEX IF EXISTS api_accessrequestanswer_e8701ad4;

DROP INDEX IF EXISTS api_accessrequestconversation_access_request_id_a8515c28;

DROP INDEX IF EXISTS api_accessrequestlog_c94ebcdd;

DROP INDEX IF EXISTS api_accessrequestquestion_b0dc1e29;

DROP INDEX IF EXISTS api_contact_b0dc1e29;

DROP INDEX IF EXISTS api_emailaddressmailinglist_email_address_id_2d07d4e7;

DROP INDEX IF EXISTS api_emailaddressmailinglist_mailing_address_id_051dae9e;

DROP INDEX IF EXISTS api_formfield_form_section_id_6f306a91;

DROP INDEX IF EXISTS api_formfieldoption_form_field_id_62aa3e83;

DROP INDEX IF EXISTS api_formfieldsubmission_form_field_id_9e3a6547;

DROP INDEX IF EXISTS api_formfieldsubmission_form_submission_id_51d1f53b;

DROP INDEX IF EXISTS api_formfieldsubmission_value_select_id_fabaa8f4;

DROP INDEX IF EXISTS api_formgroupform_form_group_id_a4cc3d7e;

DROP INDEX IF EXISTS api_formgroupform_form_id_073cbd92;

DROP INDEX IF EXISTS api_formintercomteam_form_id_d2e3c75b;

DROP INDEX IF EXISTS api_formintercomteam_intercom_team_id_b813a8e6;

DROP INDEX IF EXISTS api_formsection_form_id_5c611d28;

DROP INDEX IF EXISTS api_formsubmission_form_id_1c863302;

DROP INDEX IF EXISTS api_formsubmission_user_id_7e9d6537;

DROP INDEX IF EXISTS api_formsubmissionconversation_form_submission_id_9d42c29b;

DROP INDEX IF EXISTS api_mailinglist_list_name_d595132f_like;

DROP INDEX IF EXISTS api_mailinglist_service_id_83ffaeff;

DROP INDEX IF EXISTS api_poweredservicecyverseservice_38803362;

DROP INDEX IF EXISTS api_poweredservicecyverseservice_8ba1970c;

DROP INDEX IF EXISTS api_poweredservicepoweredbyoption_38803362;

DROP INDEX IF EXISTS api_poweredservicepoweredbyoption_4ff4714f;

DROP INDEX IF EXISTS api_service_24fc69df;

DROP INDEX IF EXISTS api_serviceform_form_id_38a26656;

DROP INDEX IF EXISTS api_serviceform_service_id_ba400062;

DROP INDEX IF EXISTS api_serviceresource_b0dc1e29;

DROP INDEX IF EXISTS api_servicestatus_b0dc1e29;

DROP INDEX IF EXISTS api_userservice_b0dc1e29;

DROP INDEX IF EXISTS api_userservice_c94ebcdd;

DROP INDEX IF EXISTS api_userservice_e8701ad4;

DROP INDEX IF EXISTS api_userworkshop_user_id_3dc8dd6f;

DROP INDEX IF EXISTS api_userworkshop_workshop_enrollment_request_id_8a6c05a2;

DROP INDEX IF EXISTS api_userworkshop_workshop_id_ab1b8028;

DROP INDEX IF EXISTS api_userworkshopcode_user_id_e8825285;

DROP INDEX IF EXISTS api_userworkshopcode_workshop_code_id_41e7efb0;

DROP INDEX IF EXISTS api_workshop_creator_id_af8fa8dd;

DROP INDEX IF EXISTS api_workshopcode_workshop_id_fddfd219;

DROP INDEX IF EXISTS api_workshopcontact_workshop_id_2e4ffc40;

DROP INDEX IF EXISTS api_workshopenrollmentrequ_workshop_enrollment_reques_e62392ac;

DROP INDEX IF EXISTS api_workshopenrollmentrequest_user_id_d36f55b9;

DROP INDEX IF EXISTS api_workshopenrollmentrequest_workshop_id_4bb40b68;

DROP INDEX IF EXISTS api_workshopformsubmission_user_id_1c2047eb;

DROP INDEX IF EXISTS api_workshoporganizer_organizer_id_273ccc45;

DROP INDEX IF EXISTS api_workshoporganizer_workshop_id_8450d9df;

DROP INDEX IF EXISTS api_workshopservice_service_id_9d6bbf61;

DROP INDEX IF EXISTS api_workshopservice_workshop_id_e33ba697;

DROP INDEX IF EXISTS api_workshopuseremail_workshop_id_be8ddd55;

DROP INDEX IF EXISTS auth_group_name_a6ea08ec_like;

DROP INDEX IF EXISTS auth_group_permissions_0e939a4f;

DROP INDEX IF EXISTS auth_group_permissions_8373b171;

DROP INDEX IF EXISTS auth_permission_417f1b1c;

DROP INDEX IF EXISTS django_admin_log_417f1b1c;

DROP INDEX IF EXISTS django_admin_log_e8701ad4;

DROP INDEX IF EXISTS django_celery_results_taskresult_hidden_cd77412f;

DROP INDEX IF EXISTS django_celery_results_taskresult_task_id_de0d95bf_like;

DROP INDEX IF EXISTS django_cyverse_auth_accesstoken_key_848d4959_like;

DROP INDEX IF EXISTS django_cyverse_auth_token_e8701ad4;

DROP INDEX IF EXISTS django_cyverse_auth_token_key_a7f8d021_like;

DROP INDEX IF EXISTS django_session_de54fa62;

DROP INDEX IF EXISTS django_session_session_key_c0390e0f_like;

DROP INDEX IF EXISTS warden_atmosphereinternationalrequest_60f75a15;

--
-- drop primary keys and other constraints
--

ALTER TABLE ONLY public.account_awarechannel
    DROP CONSTRAINT IF EXISTS account_awarechannel_pkey;

ALTER TABLE ONLY public.account_country
    DROP CONSTRAINT IF EXISTS account_country_pkey;

ALTER TABLE ONLY public.account_emailaddress
    DROP CONSTRAINT IF EXISTS account_emailaddress_email_key;

ALTER TABLE ONLY public.account_emailaddress
    DROP CONSTRAINT IF EXISTS account_emailaddress_pkey;

ALTER TABLE ONLY public.account_ethnicity
    DROP CONSTRAINT IF EXISTS account_ethnicity_pkey;

ALTER TABLE ONLY public.account_fundingagency
    DROP CONSTRAINT IF EXISTS account_fundingagency_pkey;

ALTER TABLE ONLY public.account_gender
    DROP CONSTRAINT IF EXISTS account_gender_pkey;

ALTER TABLE ONLY public.account_institution_grid
    DROP CONSTRAINT IF EXISTS account_institution_grid_grid_id_key;

ALTER TABLE ONLY public.account_institution_grid
    DROP CONSTRAINT IF EXISTS account_institution_grid_pkey;

ALTER TABLE ONLY public.account_institution
    DROP CONSTRAINT IF EXISTS account_institution_pkey;

ALTER TABLE ONLY public.account_occupation
    DROP CONSTRAINT IF EXISTS account_occupation_pkey;

ALTER TABLE ONLY public.account_passwordreset
    DROP CONSTRAINT IF EXISTS account_passwordreset_pkey;

ALTER TABLE ONLY public.account_passwordresetrequest
    DROP CONSTRAINT IF EXISTS account_passwordresetrequest_pkey;

ALTER TABLE ONLY public.account_region
    DROP CONSTRAINT IF EXISTS account_region_pkey;

ALTER TABLE ONLY public.account_researcharea
    DROP CONSTRAINT IF EXISTS account_researcharea_pkey;

ALTER TABLE ONLY public.account_restrictedusername
    DROP CONSTRAINT IF EXISTS account_restrictedusername_pkey;

ALTER TABLE ONLY public.account_user
    DROP CONSTRAINT IF EXISTS account_user_email_key;

ALTER TABLE ONLY public.account_user_groups
    DROP CONSTRAINT IF EXISTS account_user_groups_pkey;

ALTER TABLE ONLY public.account_user_groups
    DROP CONSTRAINT IF EXISTS account_user_groups_user_id_4d09af3e_uniq;

ALTER TABLE ONLY public.account_user
    DROP CONSTRAINT IF EXISTS account_user_pkey;

ALTER TABLE ONLY public.account_user_user_permissions
    DROP CONSTRAINT IF EXISTS account_user_user_permissions_pkey;

ALTER TABLE ONLY public.account_user_user_permissions
    DROP CONSTRAINT IF EXISTS account_user_user_permissions_user_id_48bdd28b_uniq;

ALTER TABLE ONLY public.account_user
    DROP CONSTRAINT IF EXISTS account_user_username_key;

ALTER TABLE ONLY public.account_userinstitution
    DROP CONSTRAINT IF EXISTS account_userinstitution_pkey;

ALTER TABLE ONLY public.account_userinstitution
    DROP CONSTRAINT IF EXISTS account_userinstitution_user_id_institution_id_f2260979_uniq;

ALTER TABLE ONLY public.api_accessrequest
    DROP CONSTRAINT IF EXISTS api_accessrequest_pkey;

ALTER TABLE ONLY public.api_accessrequest
    DROP CONSTRAINT IF EXISTS api_accessrequest_user_id_cea86630_uniq;

ALTER TABLE ONLY public.api_accessrequestanswer
    DROP CONSTRAINT IF EXISTS api_accessrequestanswer_pkey;

ALTER TABLE ONLY public.api_accessrequestanswer
    DROP CONSTRAINT IF EXISTS api_accessrequestanswer_user_id_7a78e616_uniq;

ALTER TABLE ONLY public.api_accessrequestconversation
    DROP CONSTRAINT IF EXISTS api_accessrequestconversation_pkey;

ALTER TABLE ONLY public.api_accessrequestlog
    DROP CONSTRAINT IF EXISTS api_accessrequestlog_pkey;

ALTER TABLE ONLY public.api_accessrequestquestion
    DROP CONSTRAINT IF EXISTS api_accessrequestquestion_pkey;

ALTER TABLE ONLY public.api_contact
    DROP CONSTRAINT IF EXISTS api_contact_pkey;

ALTER TABLE ONLY public.api_cyverseservice
    DROP CONSTRAINT IF EXISTS api_cyverseservice_pkey;

ALTER TABLE ONLY public.api_emailaddressmailinglist
    DROP CONSTRAINT IF EXISTS api_emailaddressmailingl_email_address_id_mailing_5bf847b4_uniq;

ALTER TABLE ONLY public.api_emailaddressmailinglist
    DROP CONSTRAINT IF EXISTS api_emailaddressmailinglist_pkey;

ALTER TABLE ONLY public.api_form
    DROP CONSTRAINT IF EXISTS api_form_pkey;

ALTER TABLE ONLY public.api_formfield
    DROP CONSTRAINT IF EXISTS api_formfield_pkey;

ALTER TABLE ONLY public.api_formfieldoption
    DROP CONSTRAINT IF EXISTS api_formfieldoption_pkey;

ALTER TABLE ONLY public.api_formfieldsubmission
    DROP CONSTRAINT IF EXISTS api_formfieldsubmission_pkey;

ALTER TABLE ONLY public.api_formgroup
    DROP CONSTRAINT IF EXISTS api_formgroup_pkey;

ALTER TABLE ONLY public.api_formgroupform
    DROP CONSTRAINT IF EXISTS api_formgroupform_pkey;

ALTER TABLE ONLY public.api_formintercomteam
    DROP CONSTRAINT IF EXISTS api_formintercomteam_pkey;

ALTER TABLE ONLY public.api_formsection
    DROP CONSTRAINT IF EXISTS api_formsection_pkey;

ALTER TABLE ONLY public.api_formsubmission
    DROP CONSTRAINT IF EXISTS api_formsubmission_pkey;

ALTER TABLE ONLY public.api_formsubmissionconversation
    DROP CONSTRAINT IF EXISTS api_formsubmissionconversation_pkey;

ALTER TABLE ONLY public.api_helpservice
    DROP CONSTRAINT IF EXISTS api_helpservice_pkey;

ALTER TABLE ONLY public.api_intercomteam
    DROP CONSTRAINT IF EXISTS api_intercomteam_pkey;

ALTER TABLE ONLY public.api_mailinglist
    DROP CONSTRAINT IF EXISTS api_mailinglist_list_name_d595132f_uniq;

ALTER TABLE ONLY public.api_mailinglist
    DROP CONSTRAINT IF EXISTS api_mailinglist_pkey;

ALTER TABLE ONLY public.api_poweredbyoption
    DROP CONSTRAINT IF EXISTS api_poweredbyoption_pkey;

ALTER TABLE ONLY public.api_poweredservice
    DROP CONSTRAINT IF EXISTS api_poweredservice_pkey;

ALTER TABLE ONLY public.api_poweredservicecyverseservice
    DROP CONSTRAINT IF EXISTS api_poweredservicecyverseservi_powered_service_id_264ce172_uniq;

ALTER TABLE ONLY public.api_poweredservicecyverseservice
    DROP CONSTRAINT IF EXISTS api_poweredservicecyverseservice_pkey;

ALTER TABLE ONLY public.api_poweredservicepoweredbyoption
    DROP CONSTRAINT IF EXISTS api_poweredservicepoweredbyopt_powered_service_id_56822772_uniq;

ALTER TABLE ONLY public.api_poweredservicepoweredbyoption
    DROP CONSTRAINT IF EXISTS api_poweredservicepoweredbyoption_pkey;

ALTER TABLE ONLY public.api_service
    DROP CONSTRAINT IF EXISTS api_service_pkey;

ALTER TABLE ONLY public.api_serviceform
    DROP CONSTRAINT IF EXISTS api_serviceform_pkey;

ALTER TABLE ONLY public.api_servicemaintainer
    DROP CONSTRAINT IF EXISTS api_servicemaintainer_pkey;

ALTER TABLE ONLY public.api_serviceresource
    DROP CONSTRAINT IF EXISTS api_serviceresource_pkey;

ALTER TABLE ONLY public.api_servicestatus
    DROP CONSTRAINT IF EXISTS api_servicestatus_pkey;

ALTER TABLE ONLY public.api_userservice
    DROP CONSTRAINT IF EXISTS api_userservice_pkey;

ALTER TABLE ONLY public.api_userservice
    DROP CONSTRAINT IF EXISTS api_userservice_user_id_service_id_2776fa73_uniq;

ALTER TABLE ONLY public.api_userworkshop
    DROP CONSTRAINT IF EXISTS api_userworkshop_pkey;

ALTER TABLE ONLY public.api_userworkshop
    DROP CONSTRAINT IF EXISTS api_userworkshop_user_id_workshop_id_ae118775_uniq;

ALTER TABLE ONLY public.api_userworkshopcode
    DROP CONSTRAINT IF EXISTS api_userworkshopcode_pkey;

ALTER TABLE ONLY public.api_userworkshopcode
    DROP CONSTRAINT IF EXISTS api_userworkshopcode_user_id_workshop_code_id_fb6325ac_uniq;

ALTER TABLE ONLY public.api_workshop
    DROP CONSTRAINT IF EXISTS api_workshop_pkey;

ALTER TABLE ONLY public.api_workshopcode
    DROP CONSTRAINT IF EXISTS api_workshopcode_pkey;

ALTER TABLE ONLY public.api_workshopcode
    DROP CONSTRAINT IF EXISTS api_workshopcode_workshop_id_code_afadf662_uniq;

ALTER TABLE ONLY public.api_workshopcontact
    DROP CONSTRAINT IF EXISTS api_workshopcontact_pkey;

ALTER TABLE ONLY public.api_workshopenrollmentrequest
    DROP CONSTRAINT IF EXISTS api_workshopenrollmentrequest_pkey;

ALTER TABLE ONLY public.api_workshopenrollmentrequest
    DROP CONSTRAINT IF EXISTS api_workshopenrollmentrequest_user_id_workshop_id_e10a3b96_uniq;

ALTER TABLE ONLY public.api_workshopenrollmentrequestlog
    DROP CONSTRAINT IF EXISTS api_workshopenrollmentrequestlog_pkey;

ALTER TABLE ONLY public.api_workshopform
    DROP CONSTRAINT IF EXISTS api_workshopform_form_id_key;

ALTER TABLE ONLY public.api_workshopform
    DROP CONSTRAINT IF EXISTS api_workshopform_pkey;

ALTER TABLE ONLY public.api_workshopformsubmission
    DROP CONSTRAINT IF EXISTS api_workshopformsubmission_form_submission_id_key;

ALTER TABLE ONLY public.api_workshopformsubmission
    DROP CONSTRAINT IF EXISTS api_workshopformsubmission_pkey;

ALTER TABLE ONLY public.api_workshoporganizer
    DROP CONSTRAINT IF EXISTS api_workshoporganizer_pkey;

ALTER TABLE ONLY public.api_workshoporganizer
    DROP CONSTRAINT IF EXISTS api_workshoporganizer_workshop_id_organizer_id_50107c22_uniq;

ALTER TABLE ONLY public.api_workshopservice
    DROP CONSTRAINT IF EXISTS api_workshopservice_pkey;

ALTER TABLE ONLY public.api_workshopservice
    DROP CONSTRAINT IF EXISTS api_workshopservice_workshop_id_service_id_19eefb53_uniq;

ALTER TABLE ONLY public.api_workshopuseremail
    DROP CONSTRAINT IF EXISTS api_workshopuseremail_pkey;

ALTER TABLE ONLY public.api_workshopuseremail
    DROP CONSTRAINT IF EXISTS api_workshopuseremail_workshop_id_email_aa182774_uniq;

ALTER TABLE ONLY public.auth_group
    DROP CONSTRAINT IF EXISTS auth_group_name_key;

ALTER TABLE ONLY public.auth_group_permissions
    DROP CONSTRAINT IF EXISTS auth_group_permissions_group_id_0cd325b0_uniq;

ALTER TABLE ONLY public.auth_group_permissions
    DROP CONSTRAINT IF EXISTS auth_group_permissions_pkey;

ALTER TABLE ONLY public.auth_group
    DROP CONSTRAINT IF EXISTS auth_group_pkey;

ALTER TABLE ONLY public.auth_permission
    DROP CONSTRAINT IF EXISTS auth_permission_content_type_id_01ab375a_uniq;

ALTER TABLE ONLY public.auth_permission
    DROP CONSTRAINT IF EXISTS auth_permission_pkey;

ALTER TABLE ONLY public.django_admin_log
    DROP CONSTRAINT IF EXISTS django_admin_log_pkey;

ALTER TABLE ONLY public.django_celery_results_taskresult
    DROP CONSTRAINT IF EXISTS django_celery_results_taskresult_pkey;

ALTER TABLE ONLY public.django_celery_results_taskresult
    DROP CONSTRAINT IF EXISTS django_celery_results_taskresult_task_id_key;

ALTER TABLE ONLY public.django_content_type
    DROP CONSTRAINT IF EXISTS django_content_type_app_label_76bd3d3b_uniq;

ALTER TABLE ONLY public.django_content_type
    DROP CONSTRAINT IF EXISTS django_content_type_pkey;

ALTER TABLE ONLY public.django_cyverse_auth_accesstoken
    DROP CONSTRAINT IF EXISTS django_cyverse_auth_accesstoken_pkey;

ALTER TABLE ONLY public.django_cyverse_auth_token
    DROP CONSTRAINT IF EXISTS django_cyverse_auth_token_pkey;

ALTER TABLE ONLY public.django_cyverse_auth_userproxy
    DROP CONSTRAINT IF EXISTS django_cyverse_auth_userproxy_pkey;

ALTER TABLE ONLY public.django_migrations
    DROP CONSTRAINT IF EXISTS django_migrations_pkey;

ALTER TABLE ONLY public.django_session
    DROP CONSTRAINT IF EXISTS django_session_pkey;

ALTER TABLE ONLY public.session
    DROP CONSTRAINT IF EXISTS session_pkey;

ALTER TABLE ONLY public.warden_atmosphereinternationalrequest
    DROP CONSTRAINT IF EXISTS warden_atmosphereinternationalrequest_pkey;

ALTER TABLE ONLY public.warden_atmosphereinternationalrequest
    DROP CONSTRAINT IF EXISTS warden_atmosphereinternationalrequest_user_id_key;

ALTER TABLE ONLY public.warden_atmospherestudentrequest
    DROP CONSTRAINT IF EXISTS warden_atmospherestudentrequest_pkey;

ALTER TABLE ONLY public.warden_atmospherestudentrequest
    DROP CONSTRAINT IF EXISTS warden_atmospherestudentrequest_user_id_key;

--
-- create primary keys and other constraints
--

ALTER TABLE ONLY public.account_awarechannel
    ADD CONSTRAINT account_awarechannel_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.account_country
    ADD CONSTRAINT account_country_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.account_emailaddress
    ADD CONSTRAINT account_emailaddress_email_key UNIQUE (email);

ALTER TABLE ONLY public.account_emailaddress
    ADD CONSTRAINT account_emailaddress_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.account_ethnicity
    ADD CONSTRAINT account_ethnicity_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.account_fundingagency
    ADD CONSTRAINT account_fundingagency_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.account_gender
    ADD CONSTRAINT account_gender_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.account_institution_grid
    ADD CONSTRAINT account_institution_grid_grid_id_key UNIQUE (grid_id);

ALTER TABLE ONLY public.account_institution_grid
    ADD CONSTRAINT account_institution_grid_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.account_institution
    ADD CONSTRAINT account_institution_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.account_occupation
    ADD CONSTRAINT account_occupation_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.account_passwordreset
    ADD CONSTRAINT account_passwordreset_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.account_passwordresetrequest
    ADD CONSTRAINT account_passwordresetrequest_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.account_region
    ADD CONSTRAINT account_region_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.account_researcharea
    ADD CONSTRAINT account_researcharea_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.account_restrictedusername
    ADD CONSTRAINT account_restrictedusername_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.account_user
    ADD CONSTRAINT account_user_email_key UNIQUE (email);

ALTER TABLE ONLY public.account_user_groups
    ADD CONSTRAINT account_user_groups_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.account_user_groups
    ADD CONSTRAINT account_user_groups_user_id_4d09af3e_uniq UNIQUE (user_id, group_id);

ALTER TABLE ONLY public.account_user
    ADD CONSTRAINT account_user_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.account_user_user_permissions
    ADD CONSTRAINT account_user_user_permissions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.account_user_user_permissions
    ADD CONSTRAINT account_user_user_permissions_user_id_48bdd28b_uniq UNIQUE (user_id, permission_id);

ALTER TABLE ONLY public.account_user
    ADD CONSTRAINT account_user_username_key UNIQUE (username);

ALTER TABLE ONLY public.account_userinstitution
    ADD CONSTRAINT account_userinstitution_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.account_userinstitution
    ADD CONSTRAINT account_userinstitution_user_id_institution_id_f2260979_uniq UNIQUE (user_id, institution_id);

ALTER TABLE ONLY public.api_accessrequest
    ADD CONSTRAINT api_accessrequest_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_accessrequest
    ADD CONSTRAINT api_accessrequest_user_id_cea86630_uniq UNIQUE (user_id, service_id);

ALTER TABLE ONLY public.api_accessrequestanswer
    ADD CONSTRAINT api_accessrequestanswer_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_accessrequestanswer
    ADD CONSTRAINT api_accessrequestanswer_user_id_7a78e616_uniq UNIQUE (user_id, access_request_question_id);

ALTER TABLE ONLY public.api_accessrequestconversation
    ADD CONSTRAINT api_accessrequestconversation_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_accessrequestlog
    ADD CONSTRAINT api_accessrequestlog_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_accessrequestquestion
    ADD CONSTRAINT api_accessrequestquestion_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_contact
    ADD CONSTRAINT api_contact_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_cyverseservice
    ADD CONSTRAINT api_cyverseservice_pkey PRIMARY KEY (service_ptr_id);

ALTER TABLE ONLY public.api_emailaddressmailinglist
    ADD CONSTRAINT api_emailaddressmailingl_email_address_id_mailing_5bf847b4_uniq
    UNIQUE (email_address_id, mailing_list_id);

ALTER TABLE ONLY public.api_emailaddressmailinglist
    ADD CONSTRAINT api_emailaddressmailinglist_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_form
    ADD CONSTRAINT api_form_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_formfield
    ADD CONSTRAINT api_formfield_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_formfieldoption
    ADD CONSTRAINT api_formfieldoption_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_formfieldsubmission
    ADD CONSTRAINT api_formfieldsubmission_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_formgroup
    ADD CONSTRAINT api_formgroup_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_formgroupform
    ADD CONSTRAINT api_formgroupform_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_formintercomteam
    ADD CONSTRAINT api_formintercomteam_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_formsection
    ADD CONSTRAINT api_formsection_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_formsubmission
    ADD CONSTRAINT api_formsubmission_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_formsubmissionconversation
    ADD CONSTRAINT api_formsubmissionconversation_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_helpservice
    ADD CONSTRAINT api_helpservice_pkey PRIMARY KEY (service_ptr_id);

ALTER TABLE ONLY public.api_intercomteam
    ADD CONSTRAINT api_intercomteam_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_mailinglist
    ADD CONSTRAINT api_mailinglist_list_name_d595132f_uniq UNIQUE (list_name);

ALTER TABLE ONLY public.api_mailinglist
    ADD CONSTRAINT api_mailinglist_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_poweredbyoption
    ADD CONSTRAINT api_poweredbyoption_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_poweredservice
    ADD CONSTRAINT api_poweredservice_pkey PRIMARY KEY (service_ptr_id);

ALTER TABLE ONLY public.api_poweredservicecyverseservice
    ADD CONSTRAINT api_poweredservicecyverseservi_powered_service_id_264ce172_uniq
    UNIQUE (powered_service_id, cyverse_service_id);

ALTER TABLE ONLY public.api_poweredservicecyverseservice
    ADD CONSTRAINT api_poweredservicecyverseservice_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_poweredservicepoweredbyoption
    ADD CONSTRAINT api_poweredservicepoweredbyopt_powered_service_id_56822772_uniq
    UNIQUE (powered_service_id, powered_by_option_id);

ALTER TABLE ONLY public.api_poweredservicepoweredbyoption
    ADD CONSTRAINT api_poweredservicepoweredbyoption_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_service
    ADD CONSTRAINT api_service_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_serviceform
    ADD CONSTRAINT api_serviceform_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_servicemaintainer
    ADD CONSTRAINT api_servicemaintainer_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_serviceresource
    ADD CONSTRAINT api_serviceresource_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_servicestatus
    ADD CONSTRAINT api_servicestatus_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_userservice
    ADD CONSTRAINT api_userservice_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_userservice
    ADD CONSTRAINT api_userservice_user_id_service_id_2776fa73_uniq UNIQUE (user_id, service_id);

ALTER TABLE ONLY public.api_userworkshop
    ADD CONSTRAINT api_userworkshop_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_userworkshop
    ADD CONSTRAINT api_userworkshop_user_id_workshop_id_ae118775_uniq UNIQUE (user_id, workshop_id);

ALTER TABLE ONLY public.api_userworkshopcode
    ADD CONSTRAINT api_userworkshopcode_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_userworkshopcode
    ADD CONSTRAINT api_userworkshopcode_user_id_workshop_code_id_fb6325ac_uniq UNIQUE (user_id, workshop_code_id);

ALTER TABLE ONLY public.api_workshop
    ADD CONSTRAINT api_workshop_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_workshopcode
    ADD CONSTRAINT api_workshopcode_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_workshopcode
    ADD CONSTRAINT api_workshopcode_workshop_id_code_afadf662_uniq UNIQUE (workshop_id, code);

ALTER TABLE ONLY public.api_workshopcontact
    ADD CONSTRAINT api_workshopcontact_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_workshopenrollmentrequest
    ADD CONSTRAINT api_workshopenrollmentrequest_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_workshopenrollmentrequest
    ADD CONSTRAINT api_workshopenrollmentrequest_user_id_workshop_id_e10a3b96_uniq UNIQUE (user_id, workshop_id);

ALTER TABLE ONLY public.api_workshopenrollmentrequestlog
    ADD CONSTRAINT api_workshopenrollmentrequestlog_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_workshopform
    ADD CONSTRAINT api_workshopform_form_id_key UNIQUE (form_id);

ALTER TABLE ONLY public.api_workshopform
    ADD CONSTRAINT api_workshopform_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_workshopformsubmission
    ADD CONSTRAINT api_workshopformsubmission_form_submission_id_key UNIQUE (form_submission_id);

ALTER TABLE ONLY public.api_workshopformsubmission
    ADD CONSTRAINT api_workshopformsubmission_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_workshoporganizer
    ADD CONSTRAINT api_workshoporganizer_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_workshoporganizer
    ADD CONSTRAINT api_workshoporganizer_workshop_id_organizer_id_50107c22_uniq UNIQUE (workshop_id, organizer_id);

ALTER TABLE ONLY public.api_workshopservice
    ADD CONSTRAINT api_workshopservice_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_workshopservice
    ADD CONSTRAINT api_workshopservice_workshop_id_service_id_19eefb53_uniq UNIQUE (workshop_id, service_id);

ALTER TABLE ONLY public.api_workshopuseremail
    ADD CONSTRAINT api_workshopuseremail_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.api_workshopuseremail
    ADD CONSTRAINT api_workshopuseremail_workshop_id_email_aa182774_uniq UNIQUE (workshop_id, email);

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_0cd325b0_uniq UNIQUE (group_id, permission_id);

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_01ab375a_uniq UNIQUE (content_type_id, codename);

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.django_celery_results_taskresult
    ADD CONSTRAINT django_celery_results_taskresult_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.django_celery_results_taskresult
    ADD CONSTRAINT django_celery_results_taskresult_task_id_key UNIQUE (task_id);

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_76bd3d3b_uniq UNIQUE (app_label, model);

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.django_cyverse_auth_accesstoken
    ADD CONSTRAINT django_cyverse_auth_accesstoken_pkey PRIMARY KEY (key);

ALTER TABLE ONLY public.django_cyverse_auth_token
    ADD CONSTRAINT django_cyverse_auth_token_pkey PRIMARY KEY (key);

ALTER TABLE ONLY public.django_cyverse_auth_userproxy
    ADD CONSTRAINT django_cyverse_auth_userproxy_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);

ALTER TABLE ONLY public.warden_atmosphereinternationalrequest
    ADD CONSTRAINT warden_atmosphereinternationalrequest_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.warden_atmosphereinternationalrequest
    ADD CONSTRAINT warden_atmosphereinternationalrequest_user_id_key UNIQUE (user_id);

ALTER TABLE ONLY public.warden_atmospherestudentrequest
    ADD CONSTRAINT warden_atmospherestudentrequest_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.warden_atmospherestudentrequest
    ADD CONSTRAINT warden_atmospherestudentrequest_user_id_key UNIQUE (user_id);

--
-- create indexes
--

CREATE INDEX IF NOT EXISTS "IDX_session_expire"
    ON public.session
    USING btree (expire);

CREATE INDEX IF NOT EXISTS account_emailaddress_e8701ad4
    ON public.account_emailaddress
    USING btree (user_id);

CREATE INDEX IF NOT EXISTS account_emailaddress_email_03be32b2_like
    ON public.account_emailaddress
    USING btree (email varchar_pattern_ops);

CREATE INDEX IF NOT EXISTS account_passwordreset_user_id_8d2f98f2
    ON public.account_passwordreset
    USING btree (user_id);

CREATE INDEX IF NOT EXISTS account_passwordresetrequest_email_address_id_1a2cd918
    ON public.account_passwordresetrequest
    USING btree (email_address_id);

CREATE INDEX IF NOT EXISTS account_passwordresetrequest_user_id_28b4624d
    ON public.account_passwordresetrequest
    USING btree (user_id);

CREATE INDEX IF NOT EXISTS account_region_93bfec8a
    ON public.account_region
    USING btree (country_id);

CREATE INDEX IF NOT EXISTS account_user_0f442f96
    ON public.account_user
    USING btree (region_id);

CREATE INDEX IF NOT EXISTS account_user_1574219a
    ON public.account_user
    USING btree (research_area_id);

CREATE INDEX IF NOT EXISTS account_user_31999bd7
    ON public.account_user
    USING btree (ethnicity_id);

CREATE INDEX IF NOT EXISTS account_user_623af7fd
    ON public.account_user
    USING btree (gender_id);

CREATE INDEX IF NOT EXISTS account_user_8a5c8bdd
    ON public.account_user
    USING btree (aware_channel_id);

CREATE INDEX IF NOT EXISTS account_user_b3a8f282
    ON public.account_user
    USING btree (occupation_id);

CREATE INDEX IF NOT EXISTS account_user_e353a8c6
    ON public.account_user
    USING btree (funding_agency_id);

CREATE INDEX IF NOT EXISTS account_user_email_0bd7c421_like
    ON public.account_user
    USING btree (email varchar_pattern_ops);

CREATE INDEX IF NOT EXISTS account_user_groups_0e939a4f
    ON public.account_user_groups
    USING btree (group_id);

CREATE INDEX IF NOT EXISTS account_user_groups_e8701ad4
    ON public.account_user_groups
    USING btree (user_id);

CREATE INDEX IF NOT EXISTS account_user_user_institution_id_fb1c5582
    ON public.account_user
    USING btree (user_institution_id);

CREATE INDEX IF NOT EXISTS account_user_user_permissions_8373b171
    ON public.account_user_user_permissions
    USING btree (permission_id);

CREATE INDEX IF NOT EXISTS account_user_user_permissions_e8701ad4
    ON public.account_user_user_permissions
    USING btree (user_id);

CREATE INDEX IF NOT EXISTS account_user_username_d393f583_like
    ON public.account_user
    USING btree (username varchar_pattern_ops);

CREATE INDEX IF NOT EXISTS account_userinstitution_institution_id_18e3dba5
    ON public.account_userinstitution
    USING btree (institution_id);

CREATE INDEX IF NOT EXISTS account_userinstitution_user_id_0b76a0cb
    ON public.account_userinstitution
    USING btree (user_id);

CREATE INDEX IF NOT EXISTS api_accessrequest_b0dc1e29
    ON public.api_accessrequest
    USING btree (service_id);

CREATE INDEX IF NOT EXISTS api_accessrequest_e8701ad4
    ON public.api_accessrequest
    USING btree (user_id);

CREATE INDEX IF NOT EXISTS api_accessrequestanswer_13c3dc40
    ON public.api_accessrequestanswer
    USING btree (access_request_question_id);

CREATE INDEX IF NOT EXISTS api_accessrequestanswer_e8701ad4
    ON public.api_accessrequestanswer
    USING btree (user_id);

CREATE INDEX IF NOT EXISTS api_accessrequestconversation_access_request_id_a8515c28
    ON public.api_accessrequestconversation
    USING btree (access_request_id);

CREATE INDEX IF NOT EXISTS api_accessrequestlog_c94ebcdd
    ON public.api_accessrequestlog
    USING btree (access_request_id);

CREATE INDEX IF NOT EXISTS api_accessrequestquestion_b0dc1e29
    ON public.api_accessrequestquestion
    USING btree (service_id);

CREATE INDEX IF NOT EXISTS api_contact_b0dc1e29
    ON public.api_contact
    USING btree (service_id);

CREATE INDEX IF NOT EXISTS api_emailaddressmailinglist_email_address_id_2d07d4e7
    ON public.api_emailaddressmailinglist
    USING btree (email_address_id);

CREATE INDEX IF NOT EXISTS api_emailaddressmailinglist_mailing_address_id_051dae9e
    ON public.api_emailaddressmailinglist
    USING btree (mailing_list_id);

CREATE INDEX IF NOT EXISTS api_formfield_form_section_id_6f306a91
    ON public.api_formfield
    USING btree (form_section_id);

CREATE INDEX IF NOT EXISTS api_formfieldoption_form_field_id_62aa3e83
    ON public.api_formfieldoption
    USING btree (form_field_id);

CREATE INDEX IF NOT EXISTS api_formfieldsubmission_form_field_id_9e3a6547
    ON public.api_formfieldsubmission
    USING btree (form_field_id);

CREATE INDEX IF NOT EXISTS api_formfieldsubmission_form_submission_id_51d1f53b
    ON public.api_formfieldsubmission
    USING btree (form_submission_id);

CREATE INDEX IF NOT EXISTS api_formfieldsubmission_value_select_id_fabaa8f4
    ON public.api_formfieldsubmission
    USING btree (value_select_id);

CREATE INDEX IF NOT EXISTS api_formgroupform_form_group_id_a4cc3d7e
    ON public.api_formgroupform
    USING btree (form_group_id);

CREATE INDEX IF NOT EXISTS api_formgroupform_form_id_073cbd92
    ON public.api_formgroupform
    USING btree (form_id);

CREATE INDEX IF NOT EXISTS api_formintercomteam_form_id_d2e3c75b
    ON public.api_formintercomteam
    USING btree (form_id);

CREATE INDEX IF NOT EXISTS api_formintercomteam_intercom_team_id_b813a8e6
    ON public.api_formintercomteam
    USING btree (intercom_team_id);

CREATE INDEX IF NOT EXISTS api_formsection_form_id_5c611d28
    ON public.api_formsection
    USING btree (form_id);

CREATE INDEX IF NOT EXISTS api_formsubmission_form_id_1c863302
    ON public.api_formsubmission
    USING btree (form_id);

CREATE INDEX IF NOT EXISTS api_formsubmission_user_id_7e9d6537
    ON public.api_formsubmission
    USING btree (user_id);

CREATE INDEX IF NOT EXISTS api_formsubmissionconversation_form_submission_id_9d42c29b
    ON public.api_formsubmissionconversation
    USING btree (form_submission_id);

CREATE INDEX IF NOT EXISTS api_mailinglist_list_name_d595132f_like
    ON public.api_mailinglist
    USING btree (list_name varchar_pattern_ops);

CREATE INDEX IF NOT EXISTS api_mailinglist_service_id_83ffaeff
    ON public.api_mailinglist
    USING btree (service_id);

CREATE INDEX IF NOT EXISTS api_poweredservicecyverseservice_38803362
    ON public.api_poweredservicecyverseservice
    USING btree (powered_service_id);

CREATE INDEX IF NOT EXISTS api_poweredservicecyverseservice_8ba1970c
    ON public.api_poweredservicecyverseservice
    USING btree (cyverse_service_id);

CREATE INDEX IF NOT EXISTS api_poweredservicepoweredbyoption_38803362
    ON public.api_poweredservicepoweredbyoption
    USING btree (powered_service_id);

CREATE INDEX IF NOT EXISTS api_poweredservicepoweredbyoption_4ff4714f
    ON public.api_poweredservicepoweredbyoption
    USING btree (powered_by_option_id);

CREATE INDEX IF NOT EXISTS api_service_24fc69df
    ON public.api_service
    USING btree (service_maintainer_id);

CREATE INDEX IF NOT EXISTS api_serviceform_form_id_38a26656
    ON public.api_serviceform
    USING btree (form_id);

CREATE INDEX IF NOT EXISTS api_serviceform_service_id_ba400062
    ON public.api_serviceform
    USING btree (service_id);

CREATE INDEX IF NOT EXISTS api_serviceresource_b0dc1e29
    ON public.api_serviceresource
    USING btree (service_id);

CREATE INDEX IF NOT EXISTS api_servicestatus_b0dc1e29
    ON public.api_servicestatus
    USING btree (service_id);

CREATE INDEX IF NOT EXISTS api_userservice_b0dc1e29
    ON public.api_userservice
    USING btree (service_id);

CREATE INDEX IF NOT EXISTS api_userservice_c94ebcdd
    ON public.api_userservice
    USING btree (access_request_id);

CREATE INDEX IF NOT EXISTS api_userservice_e8701ad4
    ON public.api_userservice
    USING btree (user_id);

CREATE INDEX IF NOT EXISTS api_userworkshop_user_id_3dc8dd6f
    ON public.api_userworkshop
    USING btree (user_id);

CREATE INDEX IF NOT EXISTS api_userworkshop_workshop_enrollment_request_id_8a6c05a2
    ON public.api_userworkshop
    USING btree (workshop_enrollment_request_id);

CREATE INDEX IF NOT EXISTS api_userworkshop_workshop_id_ab1b8028
    ON public.api_userworkshop
    USING btree (workshop_id);

CREATE INDEX IF NOT EXISTS api_userworkshopcode_user_id_e8825285
    ON public.api_userworkshopcode
    USING btree (user_id);

CREATE INDEX IF NOT EXISTS api_userworkshopcode_workshop_code_id_41e7efb0
    ON public.api_userworkshopcode
    USING btree (workshop_code_id);

CREATE INDEX IF NOT EXISTS api_workshop_creator_id_af8fa8dd
    ON public.api_workshop
    USING btree (creator_id);

CREATE INDEX IF NOT EXISTS api_workshopcode_workshop_id_fddfd219
    ON public.api_workshopcode
    USING btree (workshop_id);

CREATE INDEX IF NOT EXISTS api_workshopcontact_workshop_id_2e4ffc40
    ON public.api_workshopcontact
    USING btree (workshop_id);

CREATE INDEX IF NOT EXISTS api_workshopenrollmentrequ_workshop_enrollment_reques_e62392ac
    ON public.api_workshopenrollmentrequestlog
    USING btree (workshop_enrollment_request_id);

CREATE INDEX IF NOT EXISTS api_workshopenrollmentrequest_user_id_d36f55b9
    ON public.api_workshopenrollmentrequest
    USING btree (user_id);

CREATE INDEX IF NOT EXISTS api_workshopenrollmentrequest_workshop_id_4bb40b68
    ON public.api_workshopenrollmentrequest
    USING btree (workshop_id);

CREATE INDEX IF NOT EXISTS api_workshopformsubmission_user_id_1c2047eb
    ON public.api_workshopformsubmission
    USING btree (user_id);

CREATE INDEX IF NOT EXISTS api_workshoporganizer_organizer_id_273ccc45
    ON public.api_workshoporganizer
    USING btree (organizer_id);

CREATE INDEX IF NOT EXISTS api_workshoporganizer_workshop_id_8450d9df
    ON public.api_workshoporganizer
    USING btree (workshop_id);

CREATE INDEX IF NOT EXISTS api_workshopservice_service_id_9d6bbf61
    ON public.api_workshopservice
    USING btree (service_id);

CREATE INDEX IF NOT EXISTS api_workshopservice_workshop_id_e33ba697
    ON public.api_workshopservice
    USING btree (workshop_id);

CREATE INDEX IF NOT EXISTS api_workshopuseremail_workshop_id_be8ddd55
    ON public.api_workshopuseremail
    USING btree (workshop_id);

CREATE INDEX IF NOT EXISTS auth_group_name_a6ea08ec_like
    ON public.auth_group
    USING btree (name varchar_pattern_ops);

CREATE INDEX IF NOT EXISTS auth_group_permissions_0e939a4f
    ON public.auth_group_permissions
    USING btree (group_id);

CREATE INDEX IF NOT EXISTS auth_group_permissions_8373b171
    ON public.auth_group_permissions
    USING btree (permission_id);

CREATE INDEX IF NOT EXISTS auth_permission_417f1b1c
    ON public.auth_permission
    USING btree (content_type_id);

CREATE INDEX IF NOT EXISTS django_admin_log_417f1b1c
    ON public.django_admin_log
    USING btree (content_type_id);

CREATE INDEX IF NOT EXISTS django_admin_log_e8701ad4
    ON public.django_admin_log
    USING btree (user_id);

CREATE INDEX IF NOT EXISTS django_celery_results_taskresult_hidden_cd77412f
    ON public.django_celery_results_taskresult
    USING btree (hidden);

CREATE INDEX IF NOT EXISTS django_celery_results_taskresult_task_id_de0d95bf_like
    ON public.django_celery_results_taskresult
    USING btree (task_id varchar_pattern_ops);

CREATE INDEX IF NOT EXISTS django_cyverse_auth_accesstoken_key_848d4959_like
    ON public.django_cyverse_auth_accesstoken
    USING btree (key varchar_pattern_ops);

CREATE INDEX IF NOT EXISTS django_cyverse_auth_token_e8701ad4
    ON public.django_cyverse_auth_token
    USING btree (user_id);

CREATE INDEX IF NOT EXISTS django_cyverse_auth_token_key_a7f8d021_like
    ON public.django_cyverse_auth_token
    USING btree (key varchar_pattern_ops);

CREATE INDEX IF NOT EXISTS django_session_de54fa62
    ON public.django_session
    USING btree (expire_date);

CREATE INDEX IF NOT EXISTS django_session_session_key_c0390e0f_like
    ON public.django_session
    USING btree (session_key varchar_pattern_ops);

CREATE INDEX IF NOT EXISTS warden_atmosphereinternationalrequest_60f75a15
    ON public.warden_atmosphereinternationalrequest
    USING btree (funding_source_id);

--
-- create foreign keys
--

ALTER TABLE ONLY public.api_poweredservicepoweredbyoption
    ADD CONSTRAINT "D45cebc13548a0e108f3ef0440eec694"
    FOREIGN KEY (powered_service_id)
    REFERENCES public.api_poweredservice(service_ptr_id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_accessrequestanswer
    ADD CONSTRAINT "D91b67e45fb3af160e434ce8b5965134"
    FOREIGN KEY (access_request_question_id)
    REFERENCES public.api_accessrequestquestion(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.account_user
    ADD CONSTRAINT account__funding_agency_id_48dc69d4_fk_account_fundingagency_id
    FOREIGN KEY (funding_agency_id)
    REFERENCES public.account_fundingagency(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.account_emailaddress
    ADD CONSTRAINT account_emailaddress_user_id_2c513194_fk_account_user_id
    FOREIGN KEY (user_id)
    REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.account_passwordresetrequest
    ADD CONSTRAINT account_passwordrese_email_address_id_1a2cd918_fk_account_e
    FOREIGN KEY (email_address_id)
    REFERENCES public.account_emailaddress(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.account_passwordresetrequest
    ADD CONSTRAINT account_passwordrese_user_id_28b4624d_fk_account_u
    FOREIGN KEY (user_id)
    REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.account_passwordreset
    ADD CONSTRAINT account_passwordreset_user_id_8d2f98f2_fk_account_user_id
    FOREIGN KEY (user_id)
    REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.account_region
    ADD CONSTRAINT account_region_country_id_b25a520c_fk_account_country_id
    FOREIGN KEY (country_id)
    REFERENCES public.account_country(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.account_user
    ADD CONSTRAINT account_us_aware_channel_id_d6dfa82b_fk_account_awarechannel_id
    FOREIGN KEY (aware_channel_id)
    REFERENCES public.account_awarechannel(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.account_user
    ADD CONSTRAINT account_us_research_area_id_9f530d2b_fk_account_researcharea_id
    FOREIGN KEY (research_area_id)
    REFERENCES public.account_researcharea(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.account_user
    ADD CONSTRAINT account_user_ethnicity_id_3e03590f_fk_account_ethnicity_id
    FOREIGN KEY (ethnicity_id)
    REFERENCES public.account_ethnicity(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.account_user
    ADD CONSTRAINT account_user_gender_id_dd2adcaa_fk_account_gender_id
    FOREIGN KEY (gender_id)
    REFERENCES public.account_gender(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.account_user_groups
    ADD CONSTRAINT account_user_groups_group_id_6c71f749_fk_auth_group_id
    FOREIGN KEY (group_id)
    REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.account_user_groups
    ADD CONSTRAINT account_user_groups_user_id_14345e7b_fk_account_user_id
    FOREIGN KEY (user_id)
    REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.account_user
    ADD CONSTRAINT account_user_occupation_id_05073ebb_fk_account_occupation_id
    FOREIGN KEY (occupation_id)
    REFERENCES public.account_occupation(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.account_user
    ADD CONSTRAINT account_user_region_id_4138ba34_fk_account_region_id
    FOREIGN KEY (region_id)
    REFERENCES public.account_region(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.account_user_user_permissions
    ADD CONSTRAINT account_user_user__permission_id_66c44191_fk_auth_permission_id
    FOREIGN KEY (permission_id)
    REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.account_user
    ADD CONSTRAINT account_user_user_institution_id_fb1c5582_fk_account_i
    FOREIGN KEY (user_institution_id)
    REFERENCES public.account_institution(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.account_user_user_permissions
    ADD CONSTRAINT account_user_user_permissio_user_id_cc42d270_fk_account_user_id
    FOREIGN KEY (user_id)
    REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.account_userinstitution
    ADD CONSTRAINT account_userinstitut_institution_id_18e3dba5_fk_account_i
    FOREIGN KEY (institution_id)
    REFERENCES public.account_institution(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.account_userinstitution
    ADD CONSTRAINT account_userinstitution_user_id_0b76a0cb_fk_account_user_id
    FOREIGN KEY (user_id)
    REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_service
    ADD CONSTRAINT api__service_maintainer_id_0ae12004_fk_api_servicemaintainer_id
    FOREIGN KEY (service_maintainer_id)
    REFERENCES public.api_servicemaintainer(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_accessrequestlog
    ADD CONSTRAINT api_accessre_access_request_id_d021dd12_fk_api_accessrequest_id
    FOREIGN KEY (access_request_id)
    REFERENCES public.api_accessrequest(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_accessrequest
    ADD CONSTRAINT api_accessrequest_service_id_8a5d1451_fk_api_service_id
    FOREIGN KEY (service_id)
    REFERENCES public.api_service(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_accessrequest
    ADD CONSTRAINT api_accessrequest_user_id_478b1081_fk_account_user_id
    FOREIGN KEY (user_id)
    REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_accessrequestanswer
    ADD CONSTRAINT api_accessrequestanswer_user_id_816cb9f9_fk_account_user_id
    FOREIGN KEY (user_id)
    REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_accessrequestconversation
    ADD CONSTRAINT api_accessrequestcon_access_request_id_a8515c28_fk_api_acces
    FOREIGN KEY (access_request_id)
    REFERENCES public.api_accessrequest(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_accessrequestquestion
    ADD CONSTRAINT api_accessrequestquestion_service_id_008bdd01_fk_api_service_id
    FOREIGN KEY (service_id)
    REFERENCES public.api_service(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_contact
    ADD CONSTRAINT api_contact_service_id_6acbc419_fk_api_service_id
    FOREIGN KEY (service_id)
    REFERENCES public.api_service(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_cyverseservice
    ADD CONSTRAINT api_cyverseservice_service_ptr_id_c7823d13_fk_api_service_id
    FOREIGN KEY (service_ptr_id)
    REFERENCES public.api_service(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_emailaddressmailinglist
    ADD CONSTRAINT api_emailaddressmail_email_address_id_2d07d4e7_fk_account_e
    FOREIGN KEY (email_address_id)
    REFERENCES public.account_emailaddress(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_emailaddressmailinglist
    ADD CONSTRAINT api_emailaddressmail_mailing_list_id_65920a16_fk_api_maili
    FOREIGN KEY (mailing_list_id)
    REFERENCES public.api_mailinglist(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_formfield
    ADD CONSTRAINT api_formfield_form_section_id_6f306a91_fk_api_formsection_id
    FOREIGN KEY (form_section_id)
    REFERENCES public.api_formsection(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_formfieldoption
    ADD CONSTRAINT api_formfieldoption_form_field_id_62aa3e83_fk_api_formfield_id
    FOREIGN KEY (form_field_id)
    REFERENCES public.api_formfield(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_formfieldsubmission
    ADD CONSTRAINT api_formfieldsubmiss_form_field_id_9e3a6547_fk_api_formf
    FOREIGN KEY (form_field_id)
    REFERENCES public.api_formfield(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_formfieldsubmission
    ADD CONSTRAINT api_formfieldsubmiss_form_submission_id_51d1f53b_fk_api_forms
    FOREIGN KEY (form_submission_id)
    REFERENCES public.api_formsubmission(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_formfieldsubmission
    ADD CONSTRAINT api_formfieldsubmiss_value_select_id_fabaa8f4_fk_api_formf
    FOREIGN KEY (value_select_id)
    REFERENCES public.api_formfieldoption(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_formgroupform
    ADD CONSTRAINT api_formgroupform_form_group_id_a4cc3d7e_fk_api_formgroup_id
    FOREIGN KEY (form_group_id)
    REFERENCES public.api_formgroup(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_formgroupform
    ADD CONSTRAINT api_formgroupform_form_id_073cbd92_fk_api_form_id
    FOREIGN KEY (form_id)
    REFERENCES public.api_form(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_formintercomteam
    ADD CONSTRAINT api_formintercomteam_form_id_d2e3c75b_fk_api_form_id
    FOREIGN KEY (form_id)
    REFERENCES public.api_form(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_formintercomteam
    ADD CONSTRAINT api_formintercomteam_intercom_team_id_b813a8e6_fk_api_inter
    FOREIGN KEY (intercom_team_id)
    REFERENCES public.api_intercomteam(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_formsection
    ADD CONSTRAINT api_formsection_form_id_5c611d28_fk_api_form_id
    FOREIGN KEY (form_id)
    REFERENCES public.api_form(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_formsubmission
    ADD CONSTRAINT api_formsubmission_form_id_1c863302_fk_api_form_id
    FOREIGN KEY (form_id)
    REFERENCES public.api_form(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_formsubmission
    ADD CONSTRAINT api_formsubmission_user_id_7e9d6537_fk_account_user_id
    FOREIGN KEY (user_id)
    REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_formsubmissionconversation
    ADD CONSTRAINT api_formsubmissionco_form_submission_id_9d42c29b_fk_api_forms
    FOREIGN KEY (form_submission_id)
    REFERENCES public.api_formsubmission(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_helpservice
    ADD CONSTRAINT api_helpservice_service_ptr_id_9dcd90ca_fk_api_service_id
    FOREIGN KEY (service_ptr_id)
    REFERENCES public.api_service(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_mailinglist
    ADD CONSTRAINT api_mailinglist_service_id_83ffaeff_fk_api_cyver
    FOREIGN KEY (service_id)
    REFERENCES public.api_cyverseservice(service_ptr_id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_poweredservicepoweredbyoption
    ADD CONSTRAINT api_pow_powered_by_option_id_78bae803_fk_api_poweredbyoption_id
    FOREIGN KEY (powered_by_option_id)
    REFERENCES public.api_poweredbyoption(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_poweredservice
    ADD CONSTRAINT api_poweredservice_service_ptr_id_2b59ce79_fk_api_service_id
    FOREIGN KEY (service_ptr_id)
    REFERENCES public.api_service(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_serviceform
    ADD CONSTRAINT api_serviceform_form_id_38a26656_fk_api_form_id
    FOREIGN KEY (form_id)
    REFERENCES public.api_form(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_serviceform
    ADD CONSTRAINT api_serviceform_service_id_ba400062_fk_api_service_id
    FOREIGN KEY (service_id)
    REFERENCES public.api_service(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_serviceresource
    ADD CONSTRAINT api_serviceresource_service_id_0d506d54_fk_api_service_id
    FOREIGN KEY (service_id)
    REFERENCES public.api_service(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_servicestatus
    ADD CONSTRAINT api_servicestatus_service_id_d43acab5_fk_api_service_id
    FOREIGN KEY (service_id)
    REFERENCES public.api_service(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_userservice
    ADD CONSTRAINT api_userserv_access_request_id_1745bd33_fk_api_accessrequest_id
    FOREIGN KEY (access_request_id)
    REFERENCES public.api_accessrequest(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_userservice
    ADD CONSTRAINT api_userservice_service_id_4ed3a1e1_fk_api_service_id
    FOREIGN KEY (service_id)
    REFERENCES public.api_service(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_userservice
    ADD CONSTRAINT api_userservice_user_id_ae6e486d_fk_account_user_id
    FOREIGN KEY (user_id)
    REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_userworkshop
    ADD CONSTRAINT api_userworkshop_user_id_3dc8dd6f_fk_account_user_id
    FOREIGN KEY (user_id)
    REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_userworkshop
    ADD CONSTRAINT api_userworkshop_workshop_enrollment__8a6c05a2_fk_api_works
    FOREIGN KEY (workshop_enrollment_request_id)
    REFERENCES public.api_workshopenrollmentrequest(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_userworkshop
    ADD CONSTRAINT api_userworkshop_workshop_id_ab1b8028_fk_api_workshop_id
    FOREIGN KEY (workshop_id)
    REFERENCES public.api_workshop(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_userworkshopcode
    ADD CONSTRAINT api_userworkshopcode_user_id_e8825285_fk_account_user_id
    FOREIGN KEY (user_id)
    REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_userworkshopcode
    ADD CONSTRAINT api_userworkshopcode_workshop_code_id_41e7efb0_fk_api_works
    FOREIGN KEY (workshop_code_id)
    REFERENCES public.api_workshopcode(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_workshop
    ADD CONSTRAINT api_workshop_creator_id_af8fa8dd_fk_account_user_id
    FOREIGN KEY (creator_id)
    REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_workshopcode
    ADD CONSTRAINT api_workshopcode_workshop_id_fddfd219_fk_api_workshop_id
    FOREIGN KEY (workshop_id)
    REFERENCES public.api_workshop(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_workshopcontact
    ADD CONSTRAINT api_workshopcontact_workshop_id_2e4ffc40_fk_api_workshop_id
    FOREIGN KEY (workshop_id)
    REFERENCES public.api_workshop(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_workshopenrollmentrequest
    ADD CONSTRAINT api_workshopenrollme_user_id_d36f55b9_fk_account_u
    FOREIGN KEY (user_id)
    REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_workshopenrollmentrequestlog
    ADD CONSTRAINT api_workshopenrollme_workshop_enrollment__e62392ac_fk_api_works
    FOREIGN KEY (workshop_enrollment_request_id)
    REFERENCES public.api_workshopenrollmentrequest(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_workshopenrollmentrequest
    ADD CONSTRAINT api_workshopenrollme_workshop_id_4bb40b68_fk_api_works
    FOREIGN KEY (workshop_id)
    REFERENCES public.api_workshop(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_workshopform
    ADD CONSTRAINT api_workshopform_form_id_3eb3338d_fk_api_form_id
    FOREIGN KEY (form_id)
    REFERENCES public.api_form(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_workshopformsubmission
    ADD CONSTRAINT api_workshopformsubm_form_submission_id_18c05abc_fk_api_forms
    FOREIGN KEY (form_submission_id)
    REFERENCES public.api_formsubmission(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_workshopformsubmission
    ADD CONSTRAINT api_workshopformsubmission_user_id_1c2047eb_fk_account_user_id
    FOREIGN KEY (user_id)
    REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_workshoporganizer
    ADD CONSTRAINT api_workshoporganizer_organizer_id_273ccc45_fk_account_user_id
    FOREIGN KEY (organizer_id)
    REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_workshoporganizer
    ADD CONSTRAINT api_workshoporganizer_workshop_id_8450d9df_fk_api_workshop_id
    FOREIGN KEY (workshop_id)
    REFERENCES public.api_workshop(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_workshopservice
    ADD CONSTRAINT api_workshopservice_service_id_9d6bbf61_fk_api_service_id
    FOREIGN KEY (service_id)
    REFERENCES public.api_service(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_workshopservice
    ADD CONSTRAINT api_workshopservice_workshop_id_e33ba697_fk_api_workshop_id
    FOREIGN KEY (workshop_id)
    REFERENCES public.api_workshop(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_workshopuseremail
    ADD CONSTRAINT api_workshopuseremail_workshop_id_be8ddd55_fk_api_workshop_id
    FOREIGN KEY (workshop_id)
    REFERENCES public.api_workshop(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permiss_permission_id_84c5c92e_fk_auth_permission_id
    FOREIGN KEY (permission_id)
    REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id
    FOREIGN KEY (group_id)
    REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permiss_content_type_id_2f476e4b_fk_django_content_type_id
    FOREIGN KEY (content_type_id)
    REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_poweredservicecyverseservice
    ADD CONSTRAINT c8feb1fb9d48559470242ca3262133fa
    FOREIGN KEY (cyverse_service_id)
    REFERENCES public.api_cyverseservice(service_ptr_id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_content_type_id_c4bce8eb_fk_django_content_type_id
    FOREIGN KEY (content_type_id)
    REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_account_user_id
    FOREIGN KEY (user_id)
    REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.django_cyverse_auth_token
    ADD CONSTRAINT django_cyverse_auth_token_user_id_f5d59af8_fk_account_user_id
    FOREIGN KEY (user_id)
    REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.api_poweredservicecyverseservice
    ADD CONSTRAINT e699c7c9ef4ec81580faef4428c3306e
    FOREIGN KEY (powered_service_id)
    REFERENCES public.api_poweredservice(service_ptr_id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.account_user
    ADD CONSTRAINT user_grid_fk_c
    FOREIGN KEY (grid_institution_id)
    REFERENCES public.account_institution_grid(id);

ALTER TABLE ONLY public.warden_atmosphereinternationalrequest
    ADD CONSTRAINT warden_a_funding_source_id_fd25e5f5_fk_account_fundingagency_id
    FOREIGN KEY (funding_source_id)
    REFERENCES public.account_fundingagency(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.warden_atmosphereinternationalrequest
    ADD CONSTRAINT warden_atmosphereinternatio_user_id_acc52e7f_fk_account_user_id
    FOREIGN KEY (user_id)
    REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.warden_atmospherestudentrequest
    ADD CONSTRAINT warden_atmospherestudentreq_user_id_6b2ceaa9_fk_account_user_id
    FOREIGN KEY (user_id)
    REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;

COMMIT;
