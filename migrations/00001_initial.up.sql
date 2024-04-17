--
-- Initial Database Schema
--

SET search_path = public, pg_catalog;

BEGIN;

--
-- account_awarechannel
--

CREATE TABLE IF NOT EXISTS public.account_awarechannel (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.account_awarechannel_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.account_awarechannel_id_seq OWNED BY public.account_awarechannel.id;
ALTER TABLE ONLY public.account_awarechannel ALTER COLUMN id SET DEFAULT nextval('public.account_awarechannel_id_seq'::regclass);

--
-- account_country
--

CREATE TABLE IF NOT EXISTS public.account_country (
    id integer NOT NULL,
    code character varying(256) NOT NULL,
    name character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.account_country_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.account_country_id_seq OWNED BY public.account_country.id;
ALTER TABLE ONLY public.account_country ALTER COLUMN id SET DEFAULT nextval('public.account_country_id_seq'::regclass);

--
-- account_emailaddress
--

CREATE TABLE IF NOT EXISTS public.account_emailaddress (
    id integer NOT NULL,
    email character varying(254) NOT NULL,
    verified boolean NOT NULL,
    "primary" boolean NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.account_emailaddress_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.account_emailaddress_id_seq OWNED BY public.account_emailaddress.id;
ALTER TABLE ONLY public.account_emailaddress ALTER COLUMN id SET DEFAULT nextval('public.account_emailaddress_id_seq'::regclass);

--
-- account_ethnicity
--

CREATE TABLE IF NOT EXISTS public.account_ethnicity (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.account_ethnicity_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.account_ethnicity_id_seq OWNED BY public.account_ethnicity.id;
ALTER TABLE ONLY public.account_ethnicity ALTER COLUMN id SET DEFAULT nextval('public.account_ethnicity_id_seq'::regclass);

--
-- account_fundingagency
--

CREATE TABLE IF NOT EXISTS public.account_fundingagency (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.account_fundingagency_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.account_fundingagency_id_seq OWNED BY public.account_fundingagency.id;
ALTER TABLE ONLY public.account_fundingagency ALTER COLUMN id SET DEFAULT nextval('public.account_fundingagency_id_seq'::regclass);

--
-- account_gender
--

CREATE TABLE IF NOT EXISTS public.account_gender (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.account_gender_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.account_gender_id_seq OWNED BY public.account_gender.id;
ALTER TABLE ONLY public.account_gender ALTER COLUMN id SET DEFAULT nextval('public.account_gender_id_seq'::regclass);

--
-- account_institution
--

CREATE TABLE IF NOT EXISTS public.account_institution (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    name_lowercase character varying(256) NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.account_institution_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.account_institution_id_seq OWNED BY public.account_institution.id;
ALTER TABLE ONLY public.account_institution ALTER COLUMN id SET DEFAULT nextval('public.account_institution_id_seq'::regclass);


--
-- account_institution_grid
--

CREATE TABLE IF NOT EXISTS public.account_institution_grid (
    id integer NOT NULL,
    grid_id character varying(20) NOT NULL,
    name character varying(255) NOT NULL,
    city character varying(50) NOT NULL,
    state character varying(50) NOT NULL,
    country character varying(50) NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.account_institution_grid_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.account_institution_grid_id_seq OWNED BY public.account_institution_grid.id;
ALTER TABLE ONLY public.account_institution_grid ALTER COLUMN id SET DEFAULT nextval('public.account_institution_grid_id_seq'::regclass);

--
-- account_occupation
--

CREATE TABLE IF NOT EXISTS public.account_occupation (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.account_occupation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.account_occupation_id_seq OWNED BY public.account_occupation.id;
ALTER TABLE ONLY public.account_occupation ALTER COLUMN id SET DEFAULT nextval('public.account_occupation_id_seq'::regclass);

--
-- account_passwordreset
--

CREATE TABLE IF NOT EXISTS public.account_passwordreset (
    id integer NOT NULL,
    key character varying(256) NOT NULL,
    password character varying(256),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.account_passwordreset_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.account_passwordreset_id_seq OWNED BY public.account_passwordreset.id;
ALTER TABLE ONLY public.account_passwordreset ALTER COLUMN id SET DEFAULT nextval('public.account_passwordreset_id_seq'::regclass);

--
-- account_passwordresetrequest
--

CREATE TABLE IF NOT EXISTS public.account_passwordresetrequest (
    id integer NOT NULL,
    key character varying(256) NOT NULL,
    username character varying(256) NOT NULL,
    email character varying(254) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id integer NOT NULL,
    email_address_id integer
);

CREATE SEQUENCE IF NOT EXISTS public.account_passwordresetrequest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.account_passwordresetrequest_id_seq OWNED BY public.account_passwordresetrequest.id;
ALTER TABLE ONLY public.account_passwordresetrequest ALTER COLUMN id SET DEFAULT nextval('public.account_passwordresetrequest_id_seq'::regclass);

--
-- account_region
--

CREATE TABLE IF NOT EXISTS public.account_region (
    id integer NOT NULL,
    code character varying(256) NOT NULL,
    name character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    country_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.account_region_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.account_region_id_seq OWNED BY public.account_region.id;
ALTER TABLE ONLY public.account_region ALTER COLUMN id SET DEFAULT nextval('public.account_region_id_seq'::regclass);

--
-- account_researcharea
--

CREATE TABLE IF NOT EXISTS public.account_researcharea (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.account_researcharea_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.account_researcharea_id_seq OWNED BY public.account_researcharea.id;
ALTER TABLE ONLY public.account_researcharea ALTER COLUMN id SET DEFAULT nextval('public.account_researcharea_id_seq'::regclass);

--
-- account_restrictedusername
--

CREATE TABLE IF NOT EXISTS public.account_restrictedusername (
    id integer NOT NULL,
    username character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.account_restrictedusername_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.account_restrictedusername_id_seq OWNED BY public.account_restrictedusername.id;
ALTER TABLE ONLY public.account_restrictedusername ALTER COLUMN id SET DEFAULT nextval('public.account_restrictedusername_id_seq'::regclass);

--
-- account_user
--

CREATE TABLE IF NOT EXISTS public.account_user (
    id integer NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    username character varying(150) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL,
    first_name character varying(256) NOT NULL,
    last_name character varying(256) NOT NULL,
    email character varying(254) NOT NULL,
    has_verified_email boolean NOT NULL,
    institution character varying(256) NOT NULL,
    department character varying(256) NOT NULL,
    participate_in_study boolean NOT NULL,
    subscribe_to_newsletter boolean NOT NULL,
    aware_channel_id integer NOT NULL,
    ethnicity_id integer NOT NULL,
    funding_agency_id integer NOT NULL,
    gender_id integer NOT NULL,
    occupation_id integer NOT NULL,
    region_id integer NOT NULL,
    research_area_id integer NOT NULL,
    orcid_id character varying(256) NOT NULL,
    user_institution_id integer,
    settings json,
    grid_institution_id integer,
    updated_at timestamp with time zone
);

CREATE SEQUENCE IF NOT EXISTS public.account_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.account_user_id_seq OWNED BY public.account_user.id;
ALTER TABLE ONLY public.account_user ALTER COLUMN id SET DEFAULT nextval('public.account_user_id_seq'::regclass);

--
-- account_user_groups
--

CREATE TABLE IF NOT EXISTS public.account_user_groups (
    id integer NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.account_user_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.account_user_groups_id_seq OWNED BY public.account_user_groups.id;
ALTER TABLE ONLY public.account_user_groups ALTER COLUMN id SET DEFAULT nextval('public.account_user_groups_id_seq'::regclass);

--
-- account_user_sanitized
--

DROP VIEW IF EXISTS public.account_user_sanitized;
CREATE VIEW public.account_user_sanitized AS
 SELECT account_user.id,
    account_user.last_login,
    account_user.is_superuser,
    account_user.username,
    account_user.is_staff,
    account_user.is_active,
    account_user.date_joined,
    account_user.first_name,
    account_user.last_name,
    account_user.email,
    account_user.has_verified_email,
    account_user.institution,
    account_user.department,
    account_user.participate_in_study,
    account_user.subscribe_to_newsletter,
    account_user.aware_channel_id,
    account_user.ethnicity_id,
    account_user.funding_agency_id,
    account_user.gender_id,
    account_user.occupation_id,
    account_user.region_id,
    account_user.research_area_id,
    account_user.orcid_id,
    account_user.user_institution_id,
    account_user.grid_institution_id,
    account_user.updated_at
   FROM public.account_user;

--
-- account_user_user_permissions
--

CREATE TABLE IF NOT EXISTS public.account_user_user_permissions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.account_user_user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.account_user_user_permissions_id_seq OWNED BY public.account_user_user_permissions.id;
ALTER TABLE ONLY public.account_user_user_permissions ALTER COLUMN id SET DEFAULT nextval('public.account_user_user_permissions_id_seq'::regclass);

--
-- account_userinstitution
--

CREATE TABLE IF NOT EXISTS public.account_userinstitution (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    institution_id integer NOT NULL,
    user_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.account_userinstitution_id_seq
    START WITH 1    
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.account_userinstitution_id_seq OWNED BY public.account_userinstitution.id;
ALTER TABLE ONLY public.account_userinstitution ALTER COLUMN id SET DEFAULT nextval('public.account_userinstitution_id_seq'::regclass);

--
-- api_accessrequest
--

CREATE TABLE IF NOT EXISTS public.api_accessrequest (
    id integer NOT NULL,
    status character varying(256) NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    service_id integer NOT NULL,
    user_id integer NOT NULL,
    auto_approve boolean NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_accessrequest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_accessrequest_id_seq OWNED BY public.api_accessrequest.id;
ALTER TABLE ONLY public.api_accessrequest ALTER COLUMN id SET DEFAULT nextval('public.api_accessrequest_id_seq'::regclass);

--
-- api_accessrequestanswer
--

CREATE TABLE IF NOT EXISTS public.api_accessrequestanswer (
    id integer NOT NULL,
    value_char character varying(256),
    value_text text,
    value_bool boolean,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    access_request_question_id integer NOT NULL,
    user_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_accessrequestanswer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_accessrequestanswer_id_seq OWNED BY public.api_accessrequestanswer.id;
ALTER TABLE ONLY public.api_accessrequestanswer ALTER COLUMN id SET DEFAULT nextval('public.api_accessrequestanswer_id_seq'::regclass);

--
-- api_accessrequestconversation
--

CREATE TABLE IF NOT EXISTS public.api_accessrequestconversation (
    id integer NOT NULL,
    intercom_message_id character varying(256),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    access_request_id integer NOT NULL,
    intercom_conversation_id character varying(256)
);

CREATE SEQUENCE IF NOT EXISTS public.api_accessrequestconversation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_accessrequestconversation_id_seq OWNED BY public.api_accessrequestconversation.id;
ALTER TABLE ONLY public.api_accessrequestconversation ALTER COLUMN id SET DEFAULT nextval('public.api_accessrequestconversation_id_seq'::regclass);

--
-- api_accessrequestlog
--

CREATE TABLE IF NOT EXISTS public.api_accessrequestlog (
    id integer NOT NULL,
    status character varying(256) NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    access_request_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_accessrequestlog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_accessrequestlog_id_seq OWNED BY public.api_accessrequestlog.id;
ALTER TABLE ONLY public.api_accessrequestlog ALTER COLUMN id SET DEFAULT nextval('public.api_accessrequestlog_id_seq'::regclass);

--
-- api_accessrequestquestion
--

CREATE TABLE IF NOT EXISTS public.api_accessrequestquestion (
    id integer NOT NULL,
    type character varying(256) NOT NULL,
    question character varying(256) NOT NULL,
    is_required boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    service_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_accessrequestquestion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_accessrequestquestion_id_seq OWNED BY public.api_accessrequestquestion.id;
ALTER TABLE ONLY public.api_accessrequestquestion ALTER COLUMN id SET DEFAULT nextval('public.api_accessrequestquestion_id_seq'::regclass);

--
-- api_contact
--

CREATE TABLE IF NOT EXISTS public.api_contact (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    email character varying(254) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    service_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_contact_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_contact_id_seq OWNED BY public.api_contact.id;
ALTER TABLE ONLY public.api_contact ALTER COLUMN id SET DEFAULT nextval('public.api_contact_id_seq'::regclass);

--
-- api_cyverseservice
--

CREATE TABLE IF NOT EXISTS public.api_cyverseservice (
    service_ptr_id integer NOT NULL,
    approval_request_url character varying(200) NOT NULL,
    grant_request_url character varying(200) NOT NULL,
    auto_add_new_users boolean NOT NULL,
    grant_dag_id character varying(256) NOT NULL,
    review_dag_id character varying(256) NOT NULL
);

--
-- api_emailaddressmailinglist
--

CREATE TABLE IF NOT EXISTS public.api_emailaddressmailinglist (
    id integer NOT NULL,
    is_subscribed boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    email_address_id integer NOT NULL,
    mailing_list_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_emailaddressmailinglist_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_emailaddressmailinglist_id_seq OWNED BY public.api_emailaddressmailinglist.id;
ALTER TABLE ONLY public.api_emailaddressmailinglist ALTER COLUMN id SET DEFAULT nextval('public.api_emailaddressmailinglist_id_seq'::regclass);

--
-- api_form
--

CREATE TABLE IF NOT EXISTS public.api_form (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    description text NOT NULL,
    explanation text NOT NULL,
    intercom_team_id integer,
    is_public boolean DEFAULT false
);

CREATE SEQUENCE IF NOT EXISTS public.api_form_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_form_id_seq OWNED BY public.api_form.id;
ALTER TABLE ONLY public.api_form ALTER COLUMN id SET DEFAULT nextval('public.api_form_id_seq'::regclass);

--
-- api_formfield
--

CREATE TABLE IF NOT EXISTS public.api_formfield (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    type character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    form_section_id integer NOT NULL,
    index integer NOT NULL,
    description text,
    is_required boolean NOT NULL,
    conversion_key character varying(256)
);

CREATE SEQUENCE IF NOT EXISTS public.api_formfield_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_formfield_id_seq OWNED BY public.api_formfield.id;
ALTER TABLE ONLY public.api_formfield ALTER COLUMN id SET DEFAULT nextval('public.api_formfield_id_seq'::regclass);

--
-- api_formfieldoption
--

CREATE TABLE IF NOT EXISTS public.api_formfieldoption (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    index integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    form_field_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_formfieldoption_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_formfieldoption_id_seq OWNED BY public.api_formfieldoption.id;
ALTER TABLE ONLY public.api_formfieldoption ALTER COLUMN id SET DEFAULT nextval('public.api_formfieldoption_id_seq'::regclass);

--
-- api_formfieldsubmission
--

CREATE TABLE IF NOT EXISTS public.api_formfieldsubmission (
    id integer NOT NULL,
    value_string character varying(256),
    value_text text,
    value_boolean boolean,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    form_field_id integer NOT NULL,
    form_submission_id integer NOT NULL,
    value_number bigint,
    value_select_id integer,
    value_email character varying(254),
    value_date character varying(256)
);

CREATE SEQUENCE IF NOT EXISTS public.api_formfieldsubmission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_formfieldsubmission_id_seq OWNED BY public.api_formfieldsubmission.id;
ALTER TABLE ONLY public.api_formfieldsubmission ALTER COLUMN id SET DEFAULT nextval('public.api_formfieldsubmission_id_seq'::regclass);

--
-- api_formgroup
--

CREATE TABLE IF NOT EXISTS public.api_formgroup (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    description text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    index integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_formgroup_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_formgroup_id_seq OWNED BY public.api_formgroup.id;
ALTER TABLE ONLY public.api_formgroup ALTER COLUMN id SET DEFAULT nextval('public.api_formgroup_id_seq'::regclass);

--
-- api_formgroupform
--

CREATE TABLE IF NOT EXISTS public.api_formgroupform (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    form_id integer NOT NULL,
    form_group_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_formgroupform_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_formgroupform_id_seq OWNED BY public.api_formgroupform.id;
ALTER TABLE ONLY public.api_formgroupform ALTER COLUMN id SET DEFAULT nextval('public.api_formgroupform_id_seq'::regclass);

--
-- api_formintercomteam
--

CREATE TABLE IF NOT EXISTS public.api_formintercomteam (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    form_id integer NOT NULL,
    intercom_team_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_formintercomteam_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_formintercomteam_id_seq OWNED BY public.api_formintercomteam.id;
ALTER TABLE ONLY public.api_formintercomteam ALTER COLUMN id SET DEFAULT nextval('public.api_formintercomteam_id_seq'::regclass);

--
-- api_formsection
--

CREATE TABLE IF NOT EXISTS public.api_formsection (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    form_id integer NOT NULL,
    index integer NOT NULL,
    description text NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_formsection_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_formsection_id_seq OWNED BY public.api_formsection.id;
ALTER TABLE ONLY public.api_formsection ALTER COLUMN id SET DEFAULT nextval('public.api_formsection_id_seq'::regclass);

--
-- api_formsubmission
--

CREATE TABLE IF NOT EXISTS public.api_formsubmission (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    form_id integer NOT NULL,
    user_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_formsubmission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_formsubmission_id_seq OWNED BY public.api_formsubmission.id;
ALTER TABLE ONLY public.api_formsubmission ALTER COLUMN id SET DEFAULT nextval('public.api_formsubmission_id_seq'::regclass);

--
-- api_formsubmissionconversation
--

CREATE TABLE IF NOT EXISTS public.api_formsubmissionconversation (
    id integer NOT NULL,
    intercom_message_id character varying(256),
    intercom_conversation_id character varying(256),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    form_submission_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_formsubmissionconversation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_formsubmissionconversation_id_seq OWNED BY public.api_formsubmissionconversation.id;
ALTER TABLE ONLY public.api_formsubmissionconversation ALTER COLUMN id SET DEFAULT nextval('public.api_formsubmissionconversation_id_seq'::regclass);

--
-- api_helpservice
--

CREATE TABLE IF NOT EXISTS public.api_helpservice (
    service_ptr_id integer NOT NULL
);

--
-- api_intercomteam
--

CREATE TABLE IF NOT EXISTS public.api_intercomteam (
    id integer NOT NULL,
    team_name character varying(256) NOT NULL,
    team_id character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_intercomteam_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_intercomteam_id_seq OWNED BY public.api_intercomteam.id;
ALTER TABLE ONLY public.api_intercomteam ALTER COLUMN id SET DEFAULT nextval('public.api_intercomteam_id_seq'::regclass);

--
-- api_mailinglist
--

CREATE TABLE IF NOT EXISTS public.api_mailinglist (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    list_name character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    service_id integer
);

CREATE SEQUENCE IF NOT EXISTS public.api_mailinglist_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_mailinglist_id_seq OWNED BY public.api_mailinglist.id;
ALTER TABLE ONLY public.api_mailinglist ALTER COLUMN id SET DEFAULT nextval('public.api_mailinglist_id_seq'::regclass);

--
-- api_poweredbyoption
--

CREATE TABLE IF NOT EXISTS public.api_poweredbyoption (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    description text NOT NULL,
    icon_url character varying(200) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_poweredbyoption_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_poweredbyoption_id_seq OWNED BY public.api_poweredbyoption.id;
ALTER TABLE ONLY public.api_poweredbyoption ALTER COLUMN id SET DEFAULT nextval('public.api_poweredbyoption_id_seq'::regclass);

--
-- api_poweredservice
--

CREATE TABLE IF NOT EXISTS public.api_poweredservice (
    service_ptr_id integer NOT NULL
);

--
-- api_poweredservicecyverseservice
--

CREATE TABLE IF NOT EXISTS public.api_poweredservicecyverseservice (
    id integer NOT NULL,
    cyverse_service_id integer NOT NULL,
    powered_service_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_poweredservicecyverseservice_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_poweredservicecyverseservice_id_seq OWNED BY public.api_poweredservicecyverseservice.id;
ALTER TABLE ONLY public.api_poweredservicecyverseservice ALTER COLUMN id SET DEFAULT nextval('public.api_poweredservicecyverseservice_id_seq'::regclass);

--
-- api_poweredservicepoweredbyoption
--

CREATE TABLE IF NOT EXISTS public.api_poweredservicepoweredbyoption (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    powered_by_option_id integer NOT NULL,
    powered_service_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_poweredservicepoweredbyoption_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_poweredservicepoweredbyoption_id_seq OWNED BY public.api_poweredservicepoweredbyoption.id;
ALTER TABLE ONLY public.api_poweredservicepoweredbyoption ALTER COLUMN id SET DEFAULT nextval('public.api_poweredservicepoweredbyoption_id_seq'::regclass);

--
-- api_service
--

CREATE TABLE IF NOT EXISTS public.api_service (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    description text NOT NULL,
    about text NOT NULL,
    service_url character varying(200) NOT NULL,
    is_public boolean NOT NULL,
    icon_url character varying(200) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    service_maintainer_id integer NOT NULL,
    approval_key character varying(256) NOT NULL,
    subtitle character varying(256) NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_service_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_service_id_seq OWNED BY public.api_service.id;
ALTER TABLE ONLY public.api_service ALTER COLUMN id SET DEFAULT nextval('public.api_service_id_seq'::regclass);

--
-- api_serviceform
--

CREATE TABLE IF NOT EXISTS public.api_serviceform (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    form_id integer NOT NULL,
    service_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_serviceform_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_serviceform_id_seq OWNED BY public.api_serviceform.id;
ALTER TABLE ONLY public.api_serviceform ALTER COLUMN id SET DEFAULT nextval('public.api_serviceform_id_seq'::regclass);

--
-- api_servicemaintainer
--

CREATE TABLE IF NOT EXISTS public.api_servicemaintainer (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    website_url character varying(200) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_servicemaintainer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_servicemaintainer_id_seq OWNED BY public.api_servicemaintainer.id;
ALTER TABLE ONLY public.api_servicemaintainer ALTER COLUMN id SET DEFAULT nextval('public.api_servicemaintainer_id_seq'::regclass);

--
-- api_serviceresource
--

CREATE TABLE IF NOT EXISTS public.api_serviceresource (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    description text NOT NULL,
    url character varying(200) NOT NULL,
    icon_url character varying(200) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    service_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_serviceresource_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_serviceresource_id_seq OWNED BY public.api_serviceresource.id;
ALTER TABLE ONLY public.api_serviceresource ALTER COLUMN id SET DEFAULT nextval('public.api_serviceresource_id_seq'::regclass);

--
-- api_servicestatus
--

CREATE TABLE IF NOT EXISTS public.api_servicestatus (
    id integer NOT NULL,
    status character varying(256) NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    service_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_servicestatus_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_servicestatus_id_seq OWNED BY public.api_servicestatus.id;
ALTER TABLE ONLY public.api_servicestatus ALTER COLUMN id SET DEFAULT nextval('public.api_servicestatus_id_seq'::regclass);

--
-- api_userservice
--

CREATE TABLE IF NOT EXISTS public.api_userservice (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    access_request_id integer,
    service_id integer NOT NULL,
    user_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_userservice_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_userservice_id_seq OWNED BY public.api_userservice.id;
ALTER TABLE ONLY public.api_userservice ALTER COLUMN id SET DEFAULT nextval('public.api_userservice_id_seq'::regclass);

--
-- api_userworkshop
--

CREATE TABLE IF NOT EXISTS public.api_userworkshop (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id integer NOT NULL,
    workshop_id integer NOT NULL,
    workshop_enrollment_request_id integer
);

CREATE SEQUENCE IF NOT EXISTS public.api_userworkshop_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_userworkshop_id_seq OWNED BY public.api_userworkshop.id;
ALTER TABLE ONLY public.api_userworkshop ALTER COLUMN id SET DEFAULT nextval('public.api_userworkshop_id_seq'::regclass);

--
-- api_userworkshopcode
--

CREATE TABLE IF NOT EXISTS public.api_userworkshopcode (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id integer NOT NULL,
    workshop_code_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_userworkshopcode_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_userworkshopcode_id_seq OWNED BY public.api_userworkshopcode.id;
ALTER TABLE ONLY public.api_userworkshopcode ALTER COLUMN id SET DEFAULT nextval('public.api_userworkshopcode_id_seq'::regclass);

--
-- api_workshop
--

CREATE TABLE IF NOT EXISTS public.api_workshop (
    id integer NOT NULL,
    title character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    creator_id integer NOT NULL,
    about text NOT NULL,
    description text NOT NULL,
    enrollment_begins timestamp with time zone NOT NULL,
    enrollment_ends timestamp with time zone NOT NULL,
    contact_email character varying(256) NOT NULL,
    contact_name character varying(256) NOT NULL,
    end_date timestamp with time zone NOT NULL,
    start_date timestamp with time zone NOT NULL,
    is_public boolean DEFAULT false
);

CREATE SEQUENCE IF NOT EXISTS public.api_workshop_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_workshop_id_seq OWNED BY public.api_workshop.id;
ALTER TABLE ONLY public.api_workshop ALTER COLUMN id SET DEFAULT nextval('public.api_workshop_id_seq'::regclass);

--
-- api_workshopcode
--

CREATE TABLE IF NOT EXISTS public.api_workshopcode (
    id integer NOT NULL,
    code uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    workshop_id integer NOT NULL,
    valid_ending_at timestamp with time zone NOT NULL,
    valid_starting_at timestamp with time zone NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_workshopcode_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_workshopcode_id_seq OWNED BY public.api_workshopcode.id;
ALTER TABLE ONLY public.api_workshopcode ALTER COLUMN id SET DEFAULT nextval('public.api_workshopcode_id_seq'::regclass);

--
-- api_workshopcontact
--

CREATE TABLE IF NOT EXISTS public.api_workshopcontact (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    email character varying(254) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    workshop_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_workshopcontact_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_workshopcontact_id_seq OWNED BY public.api_workshopcontact.id;
ALTER TABLE ONLY public.api_workshopcontact ALTER COLUMN id SET DEFAULT nextval('public.api_workshopcontact_id_seq'::regclass);

--
-- api_workshopenrollmentrequest
--

CREATE TABLE IF NOT EXISTS public.api_workshopenrollmentrequest (
    id integer NOT NULL,
    status character varying(256) NOT NULL,
    message text NOT NULL,
    auto_approve boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id integer NOT NULL,
    workshop_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_workshopenrollmentrequest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_workshopenrollmentrequest_id_seq OWNED BY public.api_workshopenrollmentrequest.id;
ALTER TABLE ONLY public.api_workshopenrollmentrequest ALTER COLUMN id SET DEFAULT nextval('public.api_workshopenrollmentrequest_id_seq'::regclass);

--
-- api_workshopenrollmentrequestlog
--

CREATE TABLE IF NOT EXISTS public.api_workshopenrollmentrequestlog (
    id integer NOT NULL,
    status character varying(256) NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    workshop_enrollment_request_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_workshopenrollmentrequestlog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_workshopenrollmentrequestlog_id_seq OWNED BY public.api_workshopenrollmentrequestlog.id;
ALTER TABLE ONLY public.api_workshopenrollmentrequestlog ALTER COLUMN id SET DEFAULT nextval('public.api_workshopenrollmentrequestlog_id_seq'::regclass);

--
-- api_workshopform
--

CREATE TABLE IF NOT EXISTS public.api_workshopform (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    form_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_workshopform_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.api_workshopform_id_seq OWNED BY public.api_workshopform.id;
ALTER TABLE ONLY public.api_workshopform ALTER COLUMN id SET DEFAULT nextval('public.api_workshopform_id_seq'::regclass);

--
-- api_workshopformsubmission
--

CREATE TABLE IF NOT EXISTS public.api_workshopformsubmission (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    form_submission_id integer NOT NULL,
    user_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_workshopformsubmission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_workshopformsubmission_id_seq OWNED BY public.api_workshopformsubmission.id;
ALTER TABLE ONLY public.api_workshopformsubmission ALTER COLUMN id SET DEFAULT nextval('public.api_workshopformsubmission_id_seq'::regclass);

--
-- api_workshoporganizer
--

CREATE TABLE IF NOT EXISTS public.api_workshoporganizer (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    organizer_id integer NOT NULL,
    workshop_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_workshoporganizer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_workshoporganizer_id_seq OWNED BY public.api_workshoporganizer.id;
ALTER TABLE ONLY public.api_workshoporganizer ALTER COLUMN id SET DEFAULT nextval('public.api_workshoporganizer_id_seq'::regclass);

--
-- api_workshopservice
--

CREATE TABLE IF NOT EXISTS public.api_workshopservice (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    service_id integer NOT NULL,
    workshop_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_workshopservice_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_workshopservice_id_seq OWNED BY public.api_workshopservice.id;
ALTER TABLE ONLY public.api_workshopservice ALTER COLUMN id SET DEFAULT nextval('public.api_workshopservice_id_seq'::regclass);

--
-- api_workshopuseremail
--

CREATE TABLE IF NOT EXISTS public.api_workshopuseremail (
    id integer NOT NULL,
    email character varying(254) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    workshop_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.api_workshopuseremail_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.api_workshopuseremail_id_seq OWNED BY public.api_workshopuseremail.id;
ALTER TABLE ONLY public.api_workshopuseremail ALTER COLUMN id SET DEFAULT nextval('public.api_workshopuseremail_id_seq'::regclass);

--
-- auth_group
--

CREATE TABLE IF NOT EXISTS public.auth_group (
    id integer NOT NULL,
    name character varying(80) NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.auth_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.auth_group_id_seq OWNED BY public.auth_group.id;
ALTER TABLE ONLY public.auth_group ALTER COLUMN id SET DEFAULT nextval('public.auth_group_id_seq'::regclass);

--
-- auth_group_permissions
--

CREATE TABLE IF NOT EXISTS public.auth_group_permissions (
    id integer NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.auth_group_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.auth_group_permissions_id_seq OWNED BY public.auth_group_permissions.id;
ALTER TABLE ONLY public.auth_group_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_group_permissions_id_seq'::regclass);

--
-- auth_permission
--

CREATE TABLE IF NOT EXISTS public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.auth_permission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.auth_permission_id_seq OWNED BY public.auth_permission.id;
ALTER TABLE ONLY public.auth_permission ALTER COLUMN id SET DEFAULT nextval('public.auth_permission_id_seq'::regclass);

--
-- django_admin_log
--

CREATE TABLE IF NOT EXISTS public.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);

CREATE SEQUENCE IF NOT EXISTS public.django_admin_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.django_admin_log_id_seq OWNED BY public.django_admin_log.id;
ALTER TABLE ONLY public.django_admin_log ALTER COLUMN id SET DEFAULT nextval('public.django_admin_log_id_seq'::regclass);

--
-- django_celery_results_taskresult
--

CREATE TABLE IF NOT EXISTS public.django_celery_results_taskresult (
    id integer NOT NULL,
    task_id character varying(255) NOT NULL,
    status character varying(50) NOT NULL,
    content_type character varying(128) NOT NULL,
    content_encoding character varying(64) NOT NULL,
    result text,
    date_done timestamp with time zone NOT NULL,
    traceback text,
    hidden boolean NOT NULL,
    meta text
);

CREATE SEQUENCE IF NOT EXISTS public.django_celery_results_taskresult_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.django_celery_results_taskresult_id_seq OWNED BY public.django_celery_results_taskresult.id;
ALTER TABLE ONLY public.django_celery_results_taskresult ALTER COLUMN id SET DEFAULT nextval('public.django_celery_results_taskresult_id_seq'::regclass);

--
-- django_content_type
--

CREATE TABLE IF NOT EXISTS public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.django_content_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.django_content_type_id_seq OWNED BY public.django_content_type.id;
ALTER TABLE ONLY public.django_content_type ALTER COLUMN id SET DEFAULT nextval('public.django_content_type_id_seq'::regclass);

--
-- django_auth_accesstoken
--

CREATE TABLE IF NOT EXISTS public.django_cyverse_auth_accesstoken (
    key character varying(255) NOT NULL,
    issuer text,
    "expireTime" timestamp with time zone
);

--
-- django_cyvers_auth_token
--

CREATE TABLE IF NOT EXISTS public.django_cyverse_auth_token (
    key character varying(255) NOT NULL,
    api_server_url character varying(255),
    remote_ip character varying(128),
    issuer text,
    "issuedTime" timestamp with time zone NOT NULL,
    "expireTime" timestamp with time zone,
    user_id integer NOT NULL
);

--
-- django_cyverse_auth_userproxy
--

CREATE TABLE IF NOT EXISTS public.django_cyverse_auth_userproxy (
    id integer NOT NULL,
    username character varying(128),
    "proxyIOU" character varying(128) NOT NULL,
    "proxyTicket" character varying(128) NOT NULL,
    "expiresOn" timestamp with time zone
);

CREATE SEQUENCE IF NOT EXISTS public.django_cyverse_auth_userproxy_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.django_cyverse_auth_userproxy_id_seq OWNED BY public.django_cyverse_auth_userproxy.id;
ALTER TABLE ONLY public.django_cyverse_auth_userproxy ALTER COLUMN id SET DEFAULT nextval('public.django_cyverse_auth_userproxy_id_seq'::regclass);

--
-- django_migrations
--

CREATE TABLE IF NOT EXISTS public.django_migrations (
    id integer NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.django_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.django_migrations_id_seq OWNED BY public.django_migrations.id;
ALTER TABLE ONLY public.django_migrations ALTER COLUMN id SET DEFAULT nextval('public.django_migrations_id_seq'::regclass);

--
-- django_session
--

CREATE TABLE IF NOT EXISTS public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);

--
-- session
--

CREATE TABLE IF NOT EXISTS public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);

--
-- warden_atmosphereinternationalrequest
--

CREATE TABLE IF NOT EXISTS public.warden_atmosphereinternationalrequest (
    id integer NOT NULL,
    project_title character varying(256) NOT NULL,
    project_description text NOT NULL,
    scientific_description text NOT NULL,
    technical_description text NOT NULL,
    project_duration text NOT NULL,
    project_resources text NOT NULL,
    impact text NOT NULL,
    collaborators text NOT NULL,
    previous_interaction text NOT NULL,
    other_funding_option text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id integer NOT NULL,
    funding_source_id integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.warden_atmosphereinternationalrequest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.warden_atmosphereinternationalrequest_id_seq OWNED BY public.warden_atmosphereinternationalrequest.id;
ALTER TABLE ONLY public.warden_atmosphereinternationalrequest ALTER COLUMN id SET DEFAULT nextval('public.warden_atmosphereinternationalrequest_id_seq'::regclass);

--
-- warden_atmospherestudentrequest
--

CREATE TABLE IF NOT EXISTS public.warden_atmospherestudentrequest (
    id integer NOT NULL,
    sponsor character varying(256) NOT NULL,
    sponsor_email character varying(254) NOT NULL,
    use_case character varying(256) NOT NULL,
    project_name character varying(256) NOT NULL,
    project_description text NOT NULL,
    project_resources text NOT NULL,
    other text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id integer NOT NULL,
    project_duration text NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.warden_atmospherestudentrequest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.warden_atmospherestudentrequest_id_seq OWNED BY public.warden_atmospherestudentrequest.id;
ALTER TABLE ONLY public.warden_atmospherestudentrequest ALTER COLUMN id SET DEFAULT nextval('public.warden_atmospherestudentrequest_id_seq'::regclass);

COMMIT;
