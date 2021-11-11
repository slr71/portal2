--
-- PostgreSQL database dump
--

-- Dumped from database version 12.8 (Ubuntu 12.8-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.8 (Ubuntu 12.8-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account_awarechannel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_awarechannel (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.account_awarechannel OWNER TO postgres;

--
-- Name: account_awarechannel_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_awarechannel_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_awarechannel_id_seq OWNER TO postgres;

--
-- Name: account_awarechannel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_awarechannel_id_seq OWNED BY public.account_awarechannel.id;


--
-- Name: account_country; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_country (
    id integer NOT NULL,
    code character varying(256) NOT NULL,
    name character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.account_country OWNER TO postgres;

--
-- Name: account_country_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_country_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_country_id_seq OWNER TO postgres;

--
-- Name: account_country_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_country_id_seq OWNED BY public.account_country.id;


--
-- Name: account_emailaddress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_emailaddress (
    id integer NOT NULL,
    email character varying(254) NOT NULL,
    verified boolean NOT NULL,
    "primary" boolean NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.account_emailaddress OWNER TO postgres;

--
-- Name: account_emailaddress_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_emailaddress_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_emailaddress_id_seq OWNER TO postgres;

--
-- Name: account_emailaddress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_emailaddress_id_seq OWNED BY public.account_emailaddress.id;


--
-- Name: account_ethnicity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_ethnicity (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.account_ethnicity OWNER TO postgres;

--
-- Name: account_ethnicity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_ethnicity_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_ethnicity_id_seq OWNER TO postgres;

--
-- Name: account_ethnicity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_ethnicity_id_seq OWNED BY public.account_ethnicity.id;


--
-- Name: account_fundingagency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_fundingagency (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.account_fundingagency OWNER TO postgres;

--
-- Name: account_fundingagency_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_fundingagency_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_fundingagency_id_seq OWNER TO postgres;

--
-- Name: account_fundingagency_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_fundingagency_id_seq OWNED BY public.account_fundingagency.id;


--
-- Name: account_gender; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_gender (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.account_gender OWNER TO postgres;

--
-- Name: account_gender_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_gender_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_gender_id_seq OWNER TO postgres;

--
-- Name: account_gender_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_gender_id_seq OWNED BY public.account_gender.id;


--
-- Name: account_institution; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_institution (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    name_lowercase character varying(256) NOT NULL
);


ALTER TABLE public.account_institution OWNER TO postgres;

--
-- Name: account_institution_grid; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_institution_grid (
    id integer NOT NULL,
    grid_id character varying(20) NOT NULL,
    name character varying(255) NOT NULL,
    city character varying(50) NOT NULL,
    state character varying(50) NOT NULL,
    country character varying(50) NOT NULL
);


ALTER TABLE public.account_institution_grid OWNER TO postgres;

--
-- Name: account_institution_grid_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_institution_grid_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_institution_grid_id_seq OWNER TO postgres;

--
-- Name: account_institution_grid_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_institution_grid_id_seq OWNED BY public.account_institution_grid.id;


--
-- Name: account_institution_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_institution_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_institution_id_seq OWNER TO postgres;

--
-- Name: account_institution_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_institution_id_seq OWNED BY public.account_institution.id;


--
-- Name: account_occupation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_occupation (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.account_occupation OWNER TO postgres;

--
-- Name: account_occupation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_occupation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_occupation_id_seq OWNER TO postgres;

--
-- Name: account_occupation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_occupation_id_seq OWNED BY public.account_occupation.id;


--
-- Name: account_passwordreset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_passwordreset (
    id integer NOT NULL,
    key character varying(256) NOT NULL,
    password character varying(256),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.account_passwordreset OWNER TO postgres;

--
-- Name: account_passwordreset_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_passwordreset_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_passwordreset_id_seq OWNER TO postgres;

--
-- Name: account_passwordreset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_passwordreset_id_seq OWNED BY public.account_passwordreset.id;


--
-- Name: account_passwordresetrequest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_passwordresetrequest (
    id integer NOT NULL,
    key character varying(256) NOT NULL,
    username character varying(256) NOT NULL,
    email character varying(254) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id integer NOT NULL,
    email_address_id integer
);


ALTER TABLE public.account_passwordresetrequest OWNER TO postgres;

--
-- Name: account_passwordresetrequest_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_passwordresetrequest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_passwordresetrequest_id_seq OWNER TO postgres;

--
-- Name: account_passwordresetrequest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_passwordresetrequest_id_seq OWNED BY public.account_passwordresetrequest.id;


--
-- Name: account_region; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_region (
    id integer NOT NULL,
    code character varying(256) NOT NULL,
    name character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    country_id integer NOT NULL
);


ALTER TABLE public.account_region OWNER TO postgres;

--
-- Name: account_region_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_region_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_region_id_seq OWNER TO postgres;

--
-- Name: account_region_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_region_id_seq OWNED BY public.account_region.id;


--
-- Name: account_researcharea; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_researcharea (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.account_researcharea OWNER TO postgres;

--
-- Name: account_researcharea_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_researcharea_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_researcharea_id_seq OWNER TO postgres;

--
-- Name: account_researcharea_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_researcharea_id_seq OWNED BY public.account_researcharea.id;


--
-- Name: account_restrictedusername; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_restrictedusername (
    id integer NOT NULL,
    username character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.account_restrictedusername OWNER TO postgres;

--
-- Name: account_restrictedusername_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_restrictedusername_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_restrictedusername_id_seq OWNER TO postgres;

--
-- Name: account_restrictedusername_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_restrictedusername_id_seq OWNED BY public.account_restrictedusername.id;


--
-- Name: account_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_user (
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


ALTER TABLE public.account_user OWNER TO postgres;

--
-- Name: account_user_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_user_groups (
    id integer NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE public.account_user_groups OWNER TO postgres;

--
-- Name: account_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_user_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_user_groups_id_seq OWNER TO postgres;

--
-- Name: account_user_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_user_groups_id_seq OWNED BY public.account_user_groups.id;


--
-- Name: account_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_user_id_seq OWNER TO postgres;

--
-- Name: account_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_user_id_seq OWNED BY public.account_user.id;


--
-- Name: account_user_sanitized; Type: VIEW; Schema: public; Owner: postgres
--

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


ALTER TABLE public.account_user_sanitized OWNER TO postgres;

--
-- Name: account_user_user_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_user_user_permissions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.account_user_user_permissions OWNER TO postgres;

--
-- Name: account_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_user_user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_user_user_permissions_id_seq OWNER TO postgres;

--
-- Name: account_user_user_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_user_user_permissions_id_seq OWNED BY public.account_user_user_permissions.id;


--
-- Name: account_userinstitution; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_userinstitution (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    institution_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.account_userinstitution OWNER TO postgres;

--
-- Name: account_userinstitution_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_userinstitution_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_userinstitution_id_seq OWNER TO postgres;

--
-- Name: account_userinstitution_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_userinstitution_id_seq OWNED BY public.account_userinstitution.id;


--
-- Name: api_accessrequest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_accessrequest (
    id integer NOT NULL,
    status character varying(256) NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    service_id integer NOT NULL,
    user_id integer NOT NULL,
    auto_approve boolean NOT NULL
);


ALTER TABLE public.api_accessrequest OWNER TO postgres;

--
-- Name: api_accessrequest_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_accessrequest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_accessrequest_id_seq OWNER TO postgres;

--
-- Name: api_accessrequest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_accessrequest_id_seq OWNED BY public.api_accessrequest.id;


--
-- Name: api_accessrequestanswer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_accessrequestanswer (
    id integer NOT NULL,
    value_char character varying(256),
    value_text text,
    value_bool boolean,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    access_request_question_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.api_accessrequestanswer OWNER TO postgres;

--
-- Name: api_accessrequestanswer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_accessrequestanswer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_accessrequestanswer_id_seq OWNER TO postgres;

--
-- Name: api_accessrequestanswer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_accessrequestanswer_id_seq OWNED BY public.api_accessrequestanswer.id;


--
-- Name: api_accessrequestconversation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_accessrequestconversation (
    id integer NOT NULL,
    intercom_message_id character varying(256),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    access_request_id integer NOT NULL,
    intercom_conversation_id character varying(256)
);


ALTER TABLE public.api_accessrequestconversation OWNER TO postgres;

--
-- Name: api_accessrequestconversation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_accessrequestconversation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_accessrequestconversation_id_seq OWNER TO postgres;

--
-- Name: api_accessrequestconversation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_accessrequestconversation_id_seq OWNED BY public.api_accessrequestconversation.id;


--
-- Name: api_accessrequestlog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_accessrequestlog (
    id integer NOT NULL,
    status character varying(256) NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    access_request_id integer NOT NULL
);


ALTER TABLE public.api_accessrequestlog OWNER TO postgres;

--
-- Name: api_accessrequestlog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_accessrequestlog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_accessrequestlog_id_seq OWNER TO postgres;

--
-- Name: api_accessrequestlog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_accessrequestlog_id_seq OWNED BY public.api_accessrequestlog.id;


--
-- Name: api_accessrequestquestion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_accessrequestquestion (
    id integer NOT NULL,
    type character varying(256) NOT NULL,
    question character varying(256) NOT NULL,
    is_required boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    service_id integer NOT NULL
);


ALTER TABLE public.api_accessrequestquestion OWNER TO postgres;

--
-- Name: api_accessrequestquestion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_accessrequestquestion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_accessrequestquestion_id_seq OWNER TO postgres;

--
-- Name: api_accessrequestquestion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_accessrequestquestion_id_seq OWNED BY public.api_accessrequestquestion.id;


--
-- Name: api_contact; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_contact (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    email character varying(254) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    service_id integer NOT NULL
);


ALTER TABLE public.api_contact OWNER TO postgres;

--
-- Name: api_contact_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_contact_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_contact_id_seq OWNER TO postgres;

--
-- Name: api_contact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_contact_id_seq OWNED BY public.api_contact.id;


--
-- Name: api_cyverseservice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_cyverseservice (
    service_ptr_id integer NOT NULL,
    approval_request_url character varying(200) NOT NULL,
    grant_request_url character varying(200) NOT NULL,
    auto_add_new_users boolean NOT NULL,
    grant_dag_id character varying(256) NOT NULL,
    review_dag_id character varying(256) NOT NULL
);


ALTER TABLE public.api_cyverseservice OWNER TO postgres;

--
-- Name: api_emailaddressmailinglist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_emailaddressmailinglist (
    id integer NOT NULL,
    is_subscribed boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    email_address_id integer NOT NULL,
    mailing_list_id integer NOT NULL
);


ALTER TABLE public.api_emailaddressmailinglist OWNER TO postgres;

--
-- Name: api_emailaddressmailinglist_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_emailaddressmailinglist_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_emailaddressmailinglist_id_seq OWNER TO postgres;

--
-- Name: api_emailaddressmailinglist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_emailaddressmailinglist_id_seq OWNED BY public.api_emailaddressmailinglist.id;


--
-- Name: api_form; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_form (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    description text NOT NULL,
    explanation text NOT NULL,
    intercom_team_id integer,
    is_public boolean DEFAULT false
);


ALTER TABLE public.api_form OWNER TO postgres;

--
-- Name: api_form_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_form_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_form_id_seq OWNER TO postgres;

--
-- Name: api_form_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_form_id_seq OWNED BY public.api_form.id;


--
-- Name: api_formfield; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_formfield (
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


ALTER TABLE public.api_formfield OWNER TO postgres;

--
-- Name: api_formfield_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_formfield_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_formfield_id_seq OWNER TO postgres;

--
-- Name: api_formfield_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_formfield_id_seq OWNED BY public.api_formfield.id;


--
-- Name: api_formfieldoption; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_formfieldoption (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    index integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    form_field_id integer NOT NULL
);


ALTER TABLE public.api_formfieldoption OWNER TO postgres;

--
-- Name: api_formfieldoption_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_formfieldoption_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_formfieldoption_id_seq OWNER TO postgres;

--
-- Name: api_formfieldoption_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_formfieldoption_id_seq OWNED BY public.api_formfieldoption.id;


--
-- Name: api_formfieldsubmission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_formfieldsubmission (
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


ALTER TABLE public.api_formfieldsubmission OWNER TO postgres;

--
-- Name: api_formfieldsubmission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_formfieldsubmission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_formfieldsubmission_id_seq OWNER TO postgres;

--
-- Name: api_formfieldsubmission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_formfieldsubmission_id_seq OWNED BY public.api_formfieldsubmission.id;


--
-- Name: api_formgroup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_formgroup (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    description text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    index integer NOT NULL
);


ALTER TABLE public.api_formgroup OWNER TO postgres;

--
-- Name: api_formgroup_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_formgroup_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_formgroup_id_seq OWNER TO postgres;

--
-- Name: api_formgroup_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_formgroup_id_seq OWNED BY public.api_formgroup.id;


--
-- Name: api_formgroupform; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_formgroupform (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    form_id integer NOT NULL,
    form_group_id integer NOT NULL
);


ALTER TABLE public.api_formgroupform OWNER TO postgres;

--
-- Name: api_formgroupform_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_formgroupform_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_formgroupform_id_seq OWNER TO postgres;

--
-- Name: api_formgroupform_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_formgroupform_id_seq OWNED BY public.api_formgroupform.id;


--
-- Name: api_formintercomteam; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_formintercomteam (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    form_id integer NOT NULL,
    intercom_team_id integer NOT NULL
);


ALTER TABLE public.api_formintercomteam OWNER TO postgres;

--
-- Name: api_formintercomteam_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_formintercomteam_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_formintercomteam_id_seq OWNER TO postgres;

--
-- Name: api_formintercomteam_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_formintercomteam_id_seq OWNED BY public.api_formintercomteam.id;


--
-- Name: api_formsection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_formsection (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    form_id integer NOT NULL,
    index integer NOT NULL,
    description text NOT NULL
);


ALTER TABLE public.api_formsection OWNER TO postgres;

--
-- Name: api_formsection_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_formsection_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_formsection_id_seq OWNER TO postgres;

--
-- Name: api_formsection_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_formsection_id_seq OWNED BY public.api_formsection.id;


--
-- Name: api_formsubmission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_formsubmission (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    form_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.api_formsubmission OWNER TO postgres;

--
-- Name: api_formsubmission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_formsubmission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_formsubmission_id_seq OWNER TO postgres;

--
-- Name: api_formsubmission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_formsubmission_id_seq OWNED BY public.api_formsubmission.id;


--
-- Name: api_formsubmissionconversation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_formsubmissionconversation (
    id integer NOT NULL,
    intercom_message_id character varying(256),
    intercom_conversation_id character varying(256),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    form_submission_id integer NOT NULL
);


ALTER TABLE public.api_formsubmissionconversation OWNER TO postgres;

--
-- Name: api_formsubmissionconversation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_formsubmissionconversation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_formsubmissionconversation_id_seq OWNER TO postgres;

--
-- Name: api_formsubmissionconversation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_formsubmissionconversation_id_seq OWNED BY public.api_formsubmissionconversation.id;


--
-- Name: api_helpservice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_helpservice (
    service_ptr_id integer NOT NULL
);


ALTER TABLE public.api_helpservice OWNER TO postgres;

--
-- Name: api_intercomteam; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_intercomteam (
    id integer NOT NULL,
    team_name character varying(256) NOT NULL,
    team_id character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.api_intercomteam OWNER TO postgres;

--
-- Name: api_intercomteam_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_intercomteam_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_intercomteam_id_seq OWNER TO postgres;

--
-- Name: api_intercomteam_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_intercomteam_id_seq OWNED BY public.api_intercomteam.id;


--
-- Name: api_mailinglist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_mailinglist (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    list_name character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    service_id integer
);


ALTER TABLE public.api_mailinglist OWNER TO postgres;

--
-- Name: api_mailinglist_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_mailinglist_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_mailinglist_id_seq OWNER TO postgres;

--
-- Name: api_mailinglist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_mailinglist_id_seq OWNED BY public.api_mailinglist.id;


--
-- Name: api_poweredbyoption; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_poweredbyoption (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    description text NOT NULL,
    icon_url character varying(200) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.api_poweredbyoption OWNER TO postgres;

--
-- Name: api_poweredbyoption_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_poweredbyoption_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_poweredbyoption_id_seq OWNER TO postgres;

--
-- Name: api_poweredbyoption_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_poweredbyoption_id_seq OWNED BY public.api_poweredbyoption.id;


--
-- Name: api_poweredservice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_poweredservice (
    service_ptr_id integer NOT NULL
);


ALTER TABLE public.api_poweredservice OWNER TO postgres;

--
-- Name: api_poweredservicecyverseservice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_poweredservicecyverseservice (
    id integer NOT NULL,
    cyverse_service_id integer NOT NULL,
    powered_service_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.api_poweredservicecyverseservice OWNER TO postgres;

--
-- Name: api_poweredservicecyverseservice_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_poweredservicecyverseservice_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_poweredservicecyverseservice_id_seq OWNER TO postgres;

--
-- Name: api_poweredservicecyverseservice_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_poweredservicecyverseservice_id_seq OWNED BY public.api_poweredservicecyverseservice.id;


--
-- Name: api_poweredservicepoweredbyoption; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_poweredservicepoweredbyoption (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    powered_by_option_id integer NOT NULL,
    powered_service_id integer NOT NULL
);


ALTER TABLE public.api_poweredservicepoweredbyoption OWNER TO postgres;

--
-- Name: api_poweredservicepoweredbyoption_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_poweredservicepoweredbyoption_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_poweredservicepoweredbyoption_id_seq OWNER TO postgres;

--
-- Name: api_poweredservicepoweredbyoption_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_poweredservicepoweredbyoption_id_seq OWNED BY public.api_poweredservicepoweredbyoption.id;


--
-- Name: api_service; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_service (
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


ALTER TABLE public.api_service OWNER TO postgres;

--
-- Name: api_service_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_service_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_service_id_seq OWNER TO postgres;

--
-- Name: api_service_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_service_id_seq OWNED BY public.api_service.id;


--
-- Name: api_serviceform; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_serviceform (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    form_id integer NOT NULL,
    service_id integer NOT NULL
);


ALTER TABLE public.api_serviceform OWNER TO postgres;

--
-- Name: api_serviceform_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_serviceform_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_serviceform_id_seq OWNER TO postgres;

--
-- Name: api_serviceform_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_serviceform_id_seq OWNED BY public.api_serviceform.id;


--
-- Name: api_servicemaintainer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_servicemaintainer (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    website_url character varying(200) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.api_servicemaintainer OWNER TO postgres;

--
-- Name: api_servicemaintainer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_servicemaintainer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_servicemaintainer_id_seq OWNER TO postgres;

--
-- Name: api_servicemaintainer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_servicemaintainer_id_seq OWNED BY public.api_servicemaintainer.id;


--
-- Name: api_serviceresource; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_serviceresource (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    description text NOT NULL,
    url character varying(200) NOT NULL,
    icon_url character varying(200) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    service_id integer NOT NULL
);


ALTER TABLE public.api_serviceresource OWNER TO postgres;

--
-- Name: api_serviceresource_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_serviceresource_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_serviceresource_id_seq OWNER TO postgres;

--
-- Name: api_serviceresource_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_serviceresource_id_seq OWNED BY public.api_serviceresource.id;


--
-- Name: api_servicestatus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_servicestatus (
    id integer NOT NULL,
    status character varying(256) NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    service_id integer NOT NULL
);


ALTER TABLE public.api_servicestatus OWNER TO postgres;

--
-- Name: api_servicestatus_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_servicestatus_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_servicestatus_id_seq OWNER TO postgres;

--
-- Name: api_servicestatus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_servicestatus_id_seq OWNED BY public.api_servicestatus.id;


--
-- Name: api_userservice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_userservice (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    access_request_id integer,
    service_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.api_userservice OWNER TO postgres;

--
-- Name: api_userservice_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_userservice_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_userservice_id_seq OWNER TO postgres;

--
-- Name: api_userservice_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_userservice_id_seq OWNED BY public.api_userservice.id;


--
-- Name: api_userworkshop; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_userworkshop (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id integer NOT NULL,
    workshop_id integer NOT NULL,
    workshop_enrollment_request_id integer
);


ALTER TABLE public.api_userworkshop OWNER TO postgres;

--
-- Name: api_userworkshop_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_userworkshop_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_userworkshop_id_seq OWNER TO postgres;

--
-- Name: api_userworkshop_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_userworkshop_id_seq OWNED BY public.api_userworkshop.id;


--
-- Name: api_userworkshopcode; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_userworkshopcode (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id integer NOT NULL,
    workshop_code_id integer NOT NULL
);


ALTER TABLE public.api_userworkshopcode OWNER TO postgres;

--
-- Name: api_userworkshopcode_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_userworkshopcode_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_userworkshopcode_id_seq OWNER TO postgres;

--
-- Name: api_userworkshopcode_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_userworkshopcode_id_seq OWNED BY public.api_userworkshopcode.id;


--
-- Name: api_workshop; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_workshop (
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


ALTER TABLE public.api_workshop OWNER TO postgres;

--
-- Name: api_workshop_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_workshop_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_workshop_id_seq OWNER TO postgres;

--
-- Name: api_workshop_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_workshop_id_seq OWNED BY public.api_workshop.id;


--
-- Name: api_workshopcode; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_workshopcode (
    id integer NOT NULL,
    code uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    workshop_id integer NOT NULL,
    valid_ending_at timestamp with time zone NOT NULL,
    valid_starting_at timestamp with time zone NOT NULL
);


ALTER TABLE public.api_workshopcode OWNER TO postgres;

--
-- Name: api_workshopcode_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_workshopcode_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_workshopcode_id_seq OWNER TO postgres;

--
-- Name: api_workshopcode_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_workshopcode_id_seq OWNED BY public.api_workshopcode.id;


--
-- Name: api_workshopcontact; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_workshopcontact (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    email character varying(254) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    workshop_id integer NOT NULL
);


ALTER TABLE public.api_workshopcontact OWNER TO postgres;

--
-- Name: api_workshopcontact_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_workshopcontact_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_workshopcontact_id_seq OWNER TO postgres;

--
-- Name: api_workshopcontact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_workshopcontact_id_seq OWNED BY public.api_workshopcontact.id;


--
-- Name: api_workshopenrollmentrequest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_workshopenrollmentrequest (
    id integer NOT NULL,
    status character varying(256) NOT NULL,
    message text NOT NULL,
    auto_approve boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id integer NOT NULL,
    workshop_id integer NOT NULL
);


ALTER TABLE public.api_workshopenrollmentrequest OWNER TO postgres;

--
-- Name: api_workshopenrollmentrequest_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_workshopenrollmentrequest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_workshopenrollmentrequest_id_seq OWNER TO postgres;

--
-- Name: api_workshopenrollmentrequest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_workshopenrollmentrequest_id_seq OWNED BY public.api_workshopenrollmentrequest.id;


--
-- Name: api_workshopenrollmentrequestlog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_workshopenrollmentrequestlog (
    id integer NOT NULL,
    status character varying(256) NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    workshop_enrollment_request_id integer NOT NULL
);


ALTER TABLE public.api_workshopenrollmentrequestlog OWNER TO postgres;

--
-- Name: api_workshopenrollmentrequestlog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_workshopenrollmentrequestlog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_workshopenrollmentrequestlog_id_seq OWNER TO postgres;

--
-- Name: api_workshopenrollmentrequestlog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_workshopenrollmentrequestlog_id_seq OWNED BY public.api_workshopenrollmentrequestlog.id;


--
-- Name: api_workshopform; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_workshopform (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    form_id integer NOT NULL
);


ALTER TABLE public.api_workshopform OWNER TO postgres;

--
-- Name: api_workshopform_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_workshopform_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_workshopform_id_seq OWNER TO postgres;

--
-- Name: api_workshopform_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_workshopform_id_seq OWNED BY public.api_workshopform.id;


--
-- Name: api_workshopformsubmission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_workshopformsubmission (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    form_submission_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.api_workshopformsubmission OWNER TO postgres;

--
-- Name: api_workshopformsubmission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_workshopformsubmission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_workshopformsubmission_id_seq OWNER TO postgres;

--
-- Name: api_workshopformsubmission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_workshopformsubmission_id_seq OWNED BY public.api_workshopformsubmission.id;


--
-- Name: api_workshoporganizer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_workshoporganizer (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    organizer_id integer NOT NULL,
    workshop_id integer NOT NULL
);


ALTER TABLE public.api_workshoporganizer OWNER TO postgres;

--
-- Name: api_workshoporganizer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_workshoporganizer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_workshoporganizer_id_seq OWNER TO postgres;

--
-- Name: api_workshoporganizer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_workshoporganizer_id_seq OWNED BY public.api_workshoporganizer.id;


--
-- Name: api_workshopservice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_workshopservice (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    service_id integer NOT NULL,
    workshop_id integer NOT NULL
);


ALTER TABLE public.api_workshopservice OWNER TO postgres;

--
-- Name: api_workshopservice_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_workshopservice_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_workshopservice_id_seq OWNER TO postgres;

--
-- Name: api_workshopservice_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_workshopservice_id_seq OWNED BY public.api_workshopservice.id;


--
-- Name: api_workshopuseremail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_workshopuseremail (
    id integer NOT NULL,
    email character varying(254) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    workshop_id integer NOT NULL
);


ALTER TABLE public.api_workshopuseremail OWNER TO postgres;

--
-- Name: api_workshopuseremail_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_workshopuseremail_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_workshopuseremail_id_seq OWNER TO postgres;

--
-- Name: api_workshopuseremail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_workshopuseremail_id_seq OWNED BY public.api_workshopuseremail.id;


--
-- Name: auth_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(80) NOT NULL
);


ALTER TABLE public.auth_group OWNER TO postgres;

--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auth_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_id_seq OWNER TO postgres;

--
-- Name: auth_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_group_id_seq OWNED BY public.auth_group.id;


--
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_group_permissions (
    id integer NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_group_permissions OWNER TO postgres;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auth_group_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_permissions_id_seq OWNER TO postgres;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_group_permissions_id_seq OWNED BY public.auth_group_permissions.id;


--
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


ALTER TABLE public.auth_permission OWNER TO postgres;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auth_permission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_permission_id_seq OWNER TO postgres;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_permission_id_seq OWNED BY public.auth_permission.id;


--
-- Name: blah; Type: TABLE; Schema: public; Owner: portal_db_reader
--

CREATE TABLE public.blah (
    id integer
);


ALTER TABLE public.blah OWNER TO portal_db_reader;

--
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_admin_log (
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


ALTER TABLE public.django_admin_log OWNER TO postgres;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.django_admin_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_admin_log_id_seq OWNER TO postgres;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.django_admin_log_id_seq OWNED BY public.django_admin_log.id;


--
-- Name: django_celery_results_taskresult; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_celery_results_taskresult (
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


ALTER TABLE public.django_celery_results_taskresult OWNER TO postgres;

--
-- Name: django_celery_results_taskresult_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.django_celery_results_taskresult_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_celery_results_taskresult_id_seq OWNER TO postgres;

--
-- Name: django_celery_results_taskresult_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.django_celery_results_taskresult_id_seq OWNED BY public.django_celery_results_taskresult.id;


--
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


ALTER TABLE public.django_content_type OWNER TO postgres;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.django_content_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_content_type_id_seq OWNER TO postgres;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.django_content_type_id_seq OWNED BY public.django_content_type.id;


--
-- Name: django_cyverse_auth_accesstoken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_cyverse_auth_accesstoken (
    key character varying(255) NOT NULL,
    issuer text,
    "expireTime" timestamp with time zone
);


ALTER TABLE public.django_cyverse_auth_accesstoken OWNER TO postgres;

--
-- Name: django_cyverse_auth_token; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_cyverse_auth_token (
    key character varying(255) NOT NULL,
    api_server_url character varying(255),
    remote_ip character varying(128),
    issuer text,
    "issuedTime" timestamp with time zone NOT NULL,
    "expireTime" timestamp with time zone,
    user_id integer NOT NULL
);


ALTER TABLE public.django_cyverse_auth_token OWNER TO postgres;

--
-- Name: django_cyverse_auth_userproxy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_cyverse_auth_userproxy (
    id integer NOT NULL,
    username character varying(128),
    "proxyIOU" character varying(128) NOT NULL,
    "proxyTicket" character varying(128) NOT NULL,
    "expiresOn" timestamp with time zone
);


ALTER TABLE public.django_cyverse_auth_userproxy OWNER TO postgres;

--
-- Name: django_cyverse_auth_userproxy_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.django_cyverse_auth_userproxy_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_cyverse_auth_userproxy_id_seq OWNER TO postgres;

--
-- Name: django_cyverse_auth_userproxy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.django_cyverse_auth_userproxy_id_seq OWNED BY public.django_cyverse_auth_userproxy.id;


--
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_migrations (
    id integer NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


ALTER TABLE public.django_migrations OWNER TO postgres;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.django_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_migrations_id_seq OWNER TO postgres;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.django_migrations_id_seq OWNED BY public.django_migrations.id;


--
-- Name: django_session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


ALTER TABLE public.django_session OWNER TO postgres;

--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: warden_atmosphereinternationalrequest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warden_atmosphereinternationalrequest (
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


ALTER TABLE public.warden_atmosphereinternationalrequest OWNER TO postgres;

--
-- Name: warden_atmosphereinternationalrequest_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.warden_atmosphereinternationalrequest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.warden_atmosphereinternationalrequest_id_seq OWNER TO postgres;

--
-- Name: warden_atmosphereinternationalrequest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.warden_atmosphereinternationalrequest_id_seq OWNED BY public.warden_atmosphereinternationalrequest.id;


--
-- Name: warden_atmospherestudentrequest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warden_atmospherestudentrequest (
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


ALTER TABLE public.warden_atmospherestudentrequest OWNER TO postgres;

--
-- Name: warden_atmospherestudentrequest_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.warden_atmospherestudentrequest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.warden_atmospherestudentrequest_id_seq OWNER TO postgres;

--
-- Name: warden_atmospherestudentrequest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.warden_atmospherestudentrequest_id_seq OWNED BY public.warden_atmospherestudentrequest.id;


--
-- Name: account_awarechannel id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_awarechannel ALTER COLUMN id SET DEFAULT nextval('public.account_awarechannel_id_seq'::regclass);


--
-- Name: account_country id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_country ALTER COLUMN id SET DEFAULT nextval('public.account_country_id_seq'::regclass);


--
-- Name: account_emailaddress id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_emailaddress ALTER COLUMN id SET DEFAULT nextval('public.account_emailaddress_id_seq'::regclass);


--
-- Name: account_ethnicity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_ethnicity ALTER COLUMN id SET DEFAULT nextval('public.account_ethnicity_id_seq'::regclass);


--
-- Name: account_fundingagency id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_fundingagency ALTER COLUMN id SET DEFAULT nextval('public.account_fundingagency_id_seq'::regclass);


--
-- Name: account_gender id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_gender ALTER COLUMN id SET DEFAULT nextval('public.account_gender_id_seq'::regclass);


--
-- Name: account_institution id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_institution ALTER COLUMN id SET DEFAULT nextval('public.account_institution_id_seq'::regclass);


--
-- Name: account_institution_grid id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_institution_grid ALTER COLUMN id SET DEFAULT nextval('public.account_institution_grid_id_seq'::regclass);


--
-- Name: account_occupation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_occupation ALTER COLUMN id SET DEFAULT nextval('public.account_occupation_id_seq'::regclass);


--
-- Name: account_passwordreset id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_passwordreset ALTER COLUMN id SET DEFAULT nextval('public.account_passwordreset_id_seq'::regclass);


--
-- Name: account_passwordresetrequest id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_passwordresetrequest ALTER COLUMN id SET DEFAULT nextval('public.account_passwordresetrequest_id_seq'::regclass);


--
-- Name: account_region id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_region ALTER COLUMN id SET DEFAULT nextval('public.account_region_id_seq'::regclass);


--
-- Name: account_researcharea id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_researcharea ALTER COLUMN id SET DEFAULT nextval('public.account_researcharea_id_seq'::regclass);


--
-- Name: account_restrictedusername id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_restrictedusername ALTER COLUMN id SET DEFAULT nextval('public.account_restrictedusername_id_seq'::regclass);


--
-- Name: account_user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_user ALTER COLUMN id SET DEFAULT nextval('public.account_user_id_seq'::regclass);


--
-- Name: account_user_groups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_user_groups ALTER COLUMN id SET DEFAULT nextval('public.account_user_groups_id_seq'::regclass);


--
-- Name: account_user_user_permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_user_user_permissions ALTER COLUMN id SET DEFAULT nextval('public.account_user_user_permissions_id_seq'::regclass);


--
-- Name: account_userinstitution id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_userinstitution ALTER COLUMN id SET DEFAULT nextval('public.account_userinstitution_id_seq'::regclass);


--
-- Name: api_accessrequest id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_accessrequest ALTER COLUMN id SET DEFAULT nextval('public.api_accessrequest_id_seq'::regclass);


--
-- Name: api_accessrequestanswer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_accessrequestanswer ALTER COLUMN id SET DEFAULT nextval('public.api_accessrequestanswer_id_seq'::regclass);


--
-- Name: api_accessrequestconversation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_accessrequestconversation ALTER COLUMN id SET DEFAULT nextval('public.api_accessrequestconversation_id_seq'::regclass);


--
-- Name: api_accessrequestlog id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_accessrequestlog ALTER COLUMN id SET DEFAULT nextval('public.api_accessrequestlog_id_seq'::regclass);


--
-- Name: api_accessrequestquestion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_accessrequestquestion ALTER COLUMN id SET DEFAULT nextval('public.api_accessrequestquestion_id_seq'::regclass);


--
-- Name: api_contact id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_contact ALTER COLUMN id SET DEFAULT nextval('public.api_contact_id_seq'::regclass);


--
-- Name: api_emailaddressmailinglist id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_emailaddressmailinglist ALTER COLUMN id SET DEFAULT nextval('public.api_emailaddressmailinglist_id_seq'::regclass);


--
-- Name: api_form id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_form ALTER COLUMN id SET DEFAULT nextval('public.api_form_id_seq'::regclass);


--
-- Name: api_formfield id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formfield ALTER COLUMN id SET DEFAULT nextval('public.api_formfield_id_seq'::regclass);


--
-- Name: api_formfieldoption id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formfieldoption ALTER COLUMN id SET DEFAULT nextval('public.api_formfieldoption_id_seq'::regclass);


--
-- Name: api_formfieldsubmission id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formfieldsubmission ALTER COLUMN id SET DEFAULT nextval('public.api_formfieldsubmission_id_seq'::regclass);


--
-- Name: api_formgroup id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formgroup ALTER COLUMN id SET DEFAULT nextval('public.api_formgroup_id_seq'::regclass);


--
-- Name: api_formgroupform id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formgroupform ALTER COLUMN id SET DEFAULT nextval('public.api_formgroupform_id_seq'::regclass);


--
-- Name: api_formintercomteam id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formintercomteam ALTER COLUMN id SET DEFAULT nextval('public.api_formintercomteam_id_seq'::regclass);


--
-- Name: api_formsection id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formsection ALTER COLUMN id SET DEFAULT nextval('public.api_formsection_id_seq'::regclass);


--
-- Name: api_formsubmission id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formsubmission ALTER COLUMN id SET DEFAULT nextval('public.api_formsubmission_id_seq'::regclass);


--
-- Name: api_formsubmissionconversation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formsubmissionconversation ALTER COLUMN id SET DEFAULT nextval('public.api_formsubmissionconversation_id_seq'::regclass);


--
-- Name: api_intercomteam id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_intercomteam ALTER COLUMN id SET DEFAULT nextval('public.api_intercomteam_id_seq'::regclass);


--
-- Name: api_mailinglist id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_mailinglist ALTER COLUMN id SET DEFAULT nextval('public.api_mailinglist_id_seq'::regclass);


--
-- Name: api_poweredbyoption id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_poweredbyoption ALTER COLUMN id SET DEFAULT nextval('public.api_poweredbyoption_id_seq'::regclass);


--
-- Name: api_poweredservicecyverseservice id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_poweredservicecyverseservice ALTER COLUMN id SET DEFAULT nextval('public.api_poweredservicecyverseservice_id_seq'::regclass);


--
-- Name: api_poweredservicepoweredbyoption id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_poweredservicepoweredbyoption ALTER COLUMN id SET DEFAULT nextval('public.api_poweredservicepoweredbyoption_id_seq'::regclass);


--
-- Name: api_service id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_service ALTER COLUMN id SET DEFAULT nextval('public.api_service_id_seq'::regclass);


--
-- Name: api_serviceform id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_serviceform ALTER COLUMN id SET DEFAULT nextval('public.api_serviceform_id_seq'::regclass);


--
-- Name: api_servicemaintainer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_servicemaintainer ALTER COLUMN id SET DEFAULT nextval('public.api_servicemaintainer_id_seq'::regclass);


--
-- Name: api_serviceresource id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_serviceresource ALTER COLUMN id SET DEFAULT nextval('public.api_serviceresource_id_seq'::regclass);


--
-- Name: api_servicestatus id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_servicestatus ALTER COLUMN id SET DEFAULT nextval('public.api_servicestatus_id_seq'::regclass);


--
-- Name: api_userservice id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_userservice ALTER COLUMN id SET DEFAULT nextval('public.api_userservice_id_seq'::regclass);


--
-- Name: api_userworkshop id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_userworkshop ALTER COLUMN id SET DEFAULT nextval('public.api_userworkshop_id_seq'::regclass);


--
-- Name: api_userworkshopcode id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_userworkshopcode ALTER COLUMN id SET DEFAULT nextval('public.api_userworkshopcode_id_seq'::regclass);


--
-- Name: api_workshop id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshop ALTER COLUMN id SET DEFAULT nextval('public.api_workshop_id_seq'::regclass);


--
-- Name: api_workshopcode id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopcode ALTER COLUMN id SET DEFAULT nextval('public.api_workshopcode_id_seq'::regclass);


--
-- Name: api_workshopcontact id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopcontact ALTER COLUMN id SET DEFAULT nextval('public.api_workshopcontact_id_seq'::regclass);


--
-- Name: api_workshopenrollmentrequest id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopenrollmentrequest ALTER COLUMN id SET DEFAULT nextval('public.api_workshopenrollmentrequest_id_seq'::regclass);


--
-- Name: api_workshopenrollmentrequestlog id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopenrollmentrequestlog ALTER COLUMN id SET DEFAULT nextval('public.api_workshopenrollmentrequestlog_id_seq'::regclass);


--
-- Name: api_workshopform id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopform ALTER COLUMN id SET DEFAULT nextval('public.api_workshopform_id_seq'::regclass);


--
-- Name: api_workshopformsubmission id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopformsubmission ALTER COLUMN id SET DEFAULT nextval('public.api_workshopformsubmission_id_seq'::regclass);


--
-- Name: api_workshoporganizer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshoporganizer ALTER COLUMN id SET DEFAULT nextval('public.api_workshoporganizer_id_seq'::regclass);


--
-- Name: api_workshopservice id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopservice ALTER COLUMN id SET DEFAULT nextval('public.api_workshopservice_id_seq'::regclass);


--
-- Name: api_workshopuseremail id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopuseremail ALTER COLUMN id SET DEFAULT nextval('public.api_workshopuseremail_id_seq'::regclass);


--
-- Name: auth_group id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group ALTER COLUMN id SET DEFAULT nextval('public.auth_group_id_seq'::regclass);


--
-- Name: auth_group_permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_group_permissions_id_seq'::regclass);


--
-- Name: auth_permission id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission ALTER COLUMN id SET DEFAULT nextval('public.auth_permission_id_seq'::regclass);


--
-- Name: django_admin_log id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log ALTER COLUMN id SET DEFAULT nextval('public.django_admin_log_id_seq'::regclass);


--
-- Name: django_celery_results_taskresult id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_celery_results_taskresult ALTER COLUMN id SET DEFAULT nextval('public.django_celery_results_taskresult_id_seq'::regclass);


--
-- Name: django_content_type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_content_type ALTER COLUMN id SET DEFAULT nextval('public.django_content_type_id_seq'::regclass);


--
-- Name: django_cyverse_auth_userproxy id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_cyverse_auth_userproxy ALTER COLUMN id SET DEFAULT nextval('public.django_cyverse_auth_userproxy_id_seq'::regclass);


--
-- Name: django_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_migrations ALTER COLUMN id SET DEFAULT nextval('public.django_migrations_id_seq'::regclass);


--
-- Name: warden_atmosphereinternationalrequest id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warden_atmosphereinternationalrequest ALTER COLUMN id SET DEFAULT nextval('public.warden_atmosphereinternationalrequest_id_seq'::regclass);


--
-- Name: warden_atmospherestudentrequest id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warden_atmospherestudentrequest ALTER COLUMN id SET DEFAULT nextval('public.warden_atmospherestudentrequest_id_seq'::regclass);


--
-- Name: account_awarechannel account_awarechannel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_awarechannel
    ADD CONSTRAINT account_awarechannel_pkey PRIMARY KEY (id);


--
-- Name: account_country account_country_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_country
    ADD CONSTRAINT account_country_pkey PRIMARY KEY (id);


--
-- Name: account_emailaddress account_emailaddress_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_emailaddress
    ADD CONSTRAINT account_emailaddress_email_key UNIQUE (email);


--
-- Name: account_emailaddress account_emailaddress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_emailaddress
    ADD CONSTRAINT account_emailaddress_pkey PRIMARY KEY (id);


--
-- Name: account_ethnicity account_ethnicity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_ethnicity
    ADD CONSTRAINT account_ethnicity_pkey PRIMARY KEY (id);


--
-- Name: account_fundingagency account_fundingagency_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_fundingagency
    ADD CONSTRAINT account_fundingagency_pkey PRIMARY KEY (id);


--
-- Name: account_gender account_gender_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_gender
    ADD CONSTRAINT account_gender_pkey PRIMARY KEY (id);


--
-- Name: account_institution_grid account_institution_grid_grid_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_institution_grid
    ADD CONSTRAINT account_institution_grid_grid_id_key UNIQUE (grid_id);


--
-- Name: account_institution_grid account_institution_grid_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_institution_grid
    ADD CONSTRAINT account_institution_grid_pkey PRIMARY KEY (id);


--
-- Name: account_institution account_institution_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_institution
    ADD CONSTRAINT account_institution_pkey PRIMARY KEY (id);


--
-- Name: account_occupation account_occupation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_occupation
    ADD CONSTRAINT account_occupation_pkey PRIMARY KEY (id);


--
-- Name: account_passwordreset account_passwordreset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_passwordreset
    ADD CONSTRAINT account_passwordreset_pkey PRIMARY KEY (id);


--
-- Name: account_passwordresetrequest account_passwordresetrequest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_passwordresetrequest
    ADD CONSTRAINT account_passwordresetrequest_pkey PRIMARY KEY (id);


--
-- Name: account_region account_region_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_region
    ADD CONSTRAINT account_region_pkey PRIMARY KEY (id);


--
-- Name: account_researcharea account_researcharea_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_researcharea
    ADD CONSTRAINT account_researcharea_pkey PRIMARY KEY (id);


--
-- Name: account_restrictedusername account_restrictedusername_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_restrictedusername
    ADD CONSTRAINT account_restrictedusername_pkey PRIMARY KEY (id);


--
-- Name: account_user account_user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_user
    ADD CONSTRAINT account_user_email_key UNIQUE (email);


--
-- Name: account_user_groups account_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_user_groups
    ADD CONSTRAINT account_user_groups_pkey PRIMARY KEY (id);


--
-- Name: account_user_groups account_user_groups_user_id_4d09af3e_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_user_groups
    ADD CONSTRAINT account_user_groups_user_id_4d09af3e_uniq UNIQUE (user_id, group_id);


--
-- Name: account_user account_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_user
    ADD CONSTRAINT account_user_pkey PRIMARY KEY (id);


--
-- Name: account_user_user_permissions account_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_user_user_permissions
    ADD CONSTRAINT account_user_user_permissions_pkey PRIMARY KEY (id);


--
-- Name: account_user_user_permissions account_user_user_permissions_user_id_48bdd28b_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_user_user_permissions
    ADD CONSTRAINT account_user_user_permissions_user_id_48bdd28b_uniq UNIQUE (user_id, permission_id);


--
-- Name: account_user account_user_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_user
    ADD CONSTRAINT account_user_username_key UNIQUE (username);


--
-- Name: account_userinstitution account_userinstitution_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_userinstitution
    ADD CONSTRAINT account_userinstitution_pkey PRIMARY KEY (id);


--
-- Name: account_userinstitution account_userinstitution_user_id_institution_id_f2260979_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_userinstitution
    ADD CONSTRAINT account_userinstitution_user_id_institution_id_f2260979_uniq UNIQUE (user_id, institution_id);


--
-- Name: api_accessrequest api_accessrequest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_accessrequest
    ADD CONSTRAINT api_accessrequest_pkey PRIMARY KEY (id);


--
-- Name: api_accessrequest api_accessrequest_user_id_cea86630_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_accessrequest
    ADD CONSTRAINT api_accessrequest_user_id_cea86630_uniq UNIQUE (user_id, service_id);


--
-- Name: api_accessrequestanswer api_accessrequestanswer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_accessrequestanswer
    ADD CONSTRAINT api_accessrequestanswer_pkey PRIMARY KEY (id);


--
-- Name: api_accessrequestanswer api_accessrequestanswer_user_id_7a78e616_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_accessrequestanswer
    ADD CONSTRAINT api_accessrequestanswer_user_id_7a78e616_uniq UNIQUE (user_id, access_request_question_id);


--
-- Name: api_accessrequestconversation api_accessrequestconversation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_accessrequestconversation
    ADD CONSTRAINT api_accessrequestconversation_pkey PRIMARY KEY (id);


--
-- Name: api_accessrequestlog api_accessrequestlog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_accessrequestlog
    ADD CONSTRAINT api_accessrequestlog_pkey PRIMARY KEY (id);


--
-- Name: api_accessrequestquestion api_accessrequestquestion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_accessrequestquestion
    ADD CONSTRAINT api_accessrequestquestion_pkey PRIMARY KEY (id);


--
-- Name: api_contact api_contact_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_contact
    ADD CONSTRAINT api_contact_pkey PRIMARY KEY (id);


--
-- Name: api_cyverseservice api_cyverseservice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_cyverseservice
    ADD CONSTRAINT api_cyverseservice_pkey PRIMARY KEY (service_ptr_id);


--
-- Name: api_emailaddressmailinglist api_emailaddressmailingl_email_address_id_mailing_5bf847b4_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_emailaddressmailinglist
    ADD CONSTRAINT api_emailaddressmailingl_email_address_id_mailing_5bf847b4_uniq UNIQUE (email_address_id, mailing_list_id);


--
-- Name: api_emailaddressmailinglist api_emailaddressmailinglist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_emailaddressmailinglist
    ADD CONSTRAINT api_emailaddressmailinglist_pkey PRIMARY KEY (id);


--
-- Name: api_form api_form_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_form
    ADD CONSTRAINT api_form_pkey PRIMARY KEY (id);


--
-- Name: api_formfield api_formfield_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formfield
    ADD CONSTRAINT api_formfield_pkey PRIMARY KEY (id);


--
-- Name: api_formfieldoption api_formfieldoption_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formfieldoption
    ADD CONSTRAINT api_formfieldoption_pkey PRIMARY KEY (id);


--
-- Name: api_formfieldsubmission api_formfieldsubmission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formfieldsubmission
    ADD CONSTRAINT api_formfieldsubmission_pkey PRIMARY KEY (id);


--
-- Name: api_formgroup api_formgroup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formgroup
    ADD CONSTRAINT api_formgroup_pkey PRIMARY KEY (id);


--
-- Name: api_formgroupform api_formgroupform_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formgroupform
    ADD CONSTRAINT api_formgroupform_pkey PRIMARY KEY (id);


--
-- Name: api_formintercomteam api_formintercomteam_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formintercomteam
    ADD CONSTRAINT api_formintercomteam_pkey PRIMARY KEY (id);


--
-- Name: api_formsection api_formsection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formsection
    ADD CONSTRAINT api_formsection_pkey PRIMARY KEY (id);


--
-- Name: api_formsubmission api_formsubmission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formsubmission
    ADD CONSTRAINT api_formsubmission_pkey PRIMARY KEY (id);


--
-- Name: api_formsubmissionconversation api_formsubmissionconversation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formsubmissionconversation
    ADD CONSTRAINT api_formsubmissionconversation_pkey PRIMARY KEY (id);


--
-- Name: api_helpservice api_helpservice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_helpservice
    ADD CONSTRAINT api_helpservice_pkey PRIMARY KEY (service_ptr_id);


--
-- Name: api_intercomteam api_intercomteam_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_intercomteam
    ADD CONSTRAINT api_intercomteam_pkey PRIMARY KEY (id);


--
-- Name: api_mailinglist api_mailinglist_list_name_d595132f_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_mailinglist
    ADD CONSTRAINT api_mailinglist_list_name_d595132f_uniq UNIQUE (list_name);


--
-- Name: api_mailinglist api_mailinglist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_mailinglist
    ADD CONSTRAINT api_mailinglist_pkey PRIMARY KEY (id);


--
-- Name: api_poweredbyoption api_poweredbyoption_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_poweredbyoption
    ADD CONSTRAINT api_poweredbyoption_pkey PRIMARY KEY (id);


--
-- Name: api_poweredservice api_poweredservice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_poweredservice
    ADD CONSTRAINT api_poweredservice_pkey PRIMARY KEY (service_ptr_id);


--
-- Name: api_poweredservicecyverseservice api_poweredservicecyverseservi_powered_service_id_264ce172_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_poweredservicecyverseservice
    ADD CONSTRAINT api_poweredservicecyverseservi_powered_service_id_264ce172_uniq UNIQUE (powered_service_id, cyverse_service_id);


--
-- Name: api_poweredservicecyverseservice api_poweredservicecyverseservice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_poweredservicecyverseservice
    ADD CONSTRAINT api_poweredservicecyverseservice_pkey PRIMARY KEY (id);


--
-- Name: api_poweredservicepoweredbyoption api_poweredservicepoweredbyopt_powered_service_id_56822772_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_poweredservicepoweredbyoption
    ADD CONSTRAINT api_poweredservicepoweredbyopt_powered_service_id_56822772_uniq UNIQUE (powered_service_id, powered_by_option_id);


--
-- Name: api_poweredservicepoweredbyoption api_poweredservicepoweredbyoption_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_poweredservicepoweredbyoption
    ADD CONSTRAINT api_poweredservicepoweredbyoption_pkey PRIMARY KEY (id);


--
-- Name: api_service api_service_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_service
    ADD CONSTRAINT api_service_pkey PRIMARY KEY (id);


--
-- Name: api_serviceform api_serviceform_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_serviceform
    ADD CONSTRAINT api_serviceform_pkey PRIMARY KEY (id);


--
-- Name: api_servicemaintainer api_servicemaintainer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_servicemaintainer
    ADD CONSTRAINT api_servicemaintainer_pkey PRIMARY KEY (id);


--
-- Name: api_serviceresource api_serviceresource_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_serviceresource
    ADD CONSTRAINT api_serviceresource_pkey PRIMARY KEY (id);


--
-- Name: api_servicestatus api_servicestatus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_servicestatus
    ADD CONSTRAINT api_servicestatus_pkey PRIMARY KEY (id);


--
-- Name: api_userservice api_userservice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_userservice
    ADD CONSTRAINT api_userservice_pkey PRIMARY KEY (id);


--
-- Name: api_userservice api_userservice_user_id_service_id_2776fa73_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_userservice
    ADD CONSTRAINT api_userservice_user_id_service_id_2776fa73_uniq UNIQUE (user_id, service_id);


--
-- Name: api_userworkshop api_userworkshop_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_userworkshop
    ADD CONSTRAINT api_userworkshop_pkey PRIMARY KEY (id);


--
-- Name: api_userworkshop api_userworkshop_user_id_workshop_id_ae118775_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_userworkshop
    ADD CONSTRAINT api_userworkshop_user_id_workshop_id_ae118775_uniq UNIQUE (user_id, workshop_id);


--
-- Name: api_userworkshopcode api_userworkshopcode_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_userworkshopcode
    ADD CONSTRAINT api_userworkshopcode_pkey PRIMARY KEY (id);


--
-- Name: api_userworkshopcode api_userworkshopcode_user_id_workshop_code_id_fb6325ac_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_userworkshopcode
    ADD CONSTRAINT api_userworkshopcode_user_id_workshop_code_id_fb6325ac_uniq UNIQUE (user_id, workshop_code_id);


--
-- Name: api_workshop api_workshop_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshop
    ADD CONSTRAINT api_workshop_pkey PRIMARY KEY (id);


--
-- Name: api_workshopcode api_workshopcode_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopcode
    ADD CONSTRAINT api_workshopcode_pkey PRIMARY KEY (id);


--
-- Name: api_workshopcode api_workshopcode_workshop_id_code_afadf662_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopcode
    ADD CONSTRAINT api_workshopcode_workshop_id_code_afadf662_uniq UNIQUE (workshop_id, code);


--
-- Name: api_workshopcontact api_workshopcontact_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopcontact
    ADD CONSTRAINT api_workshopcontact_pkey PRIMARY KEY (id);


--
-- Name: api_workshopenrollmentrequest api_workshopenrollmentrequest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopenrollmentrequest
    ADD CONSTRAINT api_workshopenrollmentrequest_pkey PRIMARY KEY (id);


--
-- Name: api_workshopenrollmentrequest api_workshopenrollmentrequest_user_id_workshop_id_e10a3b96_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopenrollmentrequest
    ADD CONSTRAINT api_workshopenrollmentrequest_user_id_workshop_id_e10a3b96_uniq UNIQUE (user_id, workshop_id);


--
-- Name: api_workshopenrollmentrequestlog api_workshopenrollmentrequestlog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopenrollmentrequestlog
    ADD CONSTRAINT api_workshopenrollmentrequestlog_pkey PRIMARY KEY (id);


--
-- Name: api_workshopform api_workshopform_form_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopform
    ADD CONSTRAINT api_workshopform_form_id_key UNIQUE (form_id);


--
-- Name: api_workshopform api_workshopform_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopform
    ADD CONSTRAINT api_workshopform_pkey PRIMARY KEY (id);


--
-- Name: api_workshopformsubmission api_workshopformsubmission_form_submission_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopformsubmission
    ADD CONSTRAINT api_workshopformsubmission_form_submission_id_key UNIQUE (form_submission_id);


--
-- Name: api_workshopformsubmission api_workshopformsubmission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopformsubmission
    ADD CONSTRAINT api_workshopformsubmission_pkey PRIMARY KEY (id);


--
-- Name: api_workshoporganizer api_workshoporganizer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshoporganizer
    ADD CONSTRAINT api_workshoporganizer_pkey PRIMARY KEY (id);


--
-- Name: api_workshoporganizer api_workshoporganizer_workshop_id_organizer_id_50107c22_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshoporganizer
    ADD CONSTRAINT api_workshoporganizer_workshop_id_organizer_id_50107c22_uniq UNIQUE (workshop_id, organizer_id);


--
-- Name: api_workshopservice api_workshopservice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopservice
    ADD CONSTRAINT api_workshopservice_pkey PRIMARY KEY (id);


--
-- Name: api_workshopservice api_workshopservice_workshop_id_service_id_19eefb53_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopservice
    ADD CONSTRAINT api_workshopservice_workshop_id_service_id_19eefb53_uniq UNIQUE (workshop_id, service_id);


--
-- Name: api_workshopuseremail api_workshopuseremail_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopuseremail
    ADD CONSTRAINT api_workshopuseremail_pkey PRIMARY KEY (id);


--
-- Name: api_workshopuseremail api_workshopuseremail_workshop_id_email_aa182774_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopuseremail
    ADD CONSTRAINT api_workshopuseremail_workshop_id_email_aa182774_uniq UNIQUE (workshop_id, email);


--
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- Name: auth_group_permissions auth_group_permissions_group_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- Name: auth_permission auth_permission_content_type_id_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- Name: django_celery_results_taskresult django_celery_results_taskresult_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_celery_results_taskresult
    ADD CONSTRAINT django_celery_results_taskresult_pkey PRIMARY KEY (id);


--
-- Name: django_celery_results_taskresult django_celery_results_taskresult_task_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_celery_results_taskresult
    ADD CONSTRAINT django_celery_results_taskresult_task_id_key UNIQUE (task_id);


--
-- Name: django_content_type django_content_type_app_label_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- Name: django_cyverse_auth_accesstoken django_cyverse_auth_accesstoken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_cyverse_auth_accesstoken
    ADD CONSTRAINT django_cyverse_auth_accesstoken_pkey PRIMARY KEY (key);


--
-- Name: django_cyverse_auth_token django_cyverse_auth_token_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_cyverse_auth_token
    ADD CONSTRAINT django_cyverse_auth_token_pkey PRIMARY KEY (key);


--
-- Name: django_cyverse_auth_userproxy django_cyverse_auth_userproxy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_cyverse_auth_userproxy
    ADD CONSTRAINT django_cyverse_auth_userproxy_pkey PRIMARY KEY (id);


--
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: warden_atmosphereinternationalrequest warden_atmosphereinternationalrequest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warden_atmosphereinternationalrequest
    ADD CONSTRAINT warden_atmosphereinternationalrequest_pkey PRIMARY KEY (id);


--
-- Name: warden_atmosphereinternationalrequest warden_atmosphereinternationalrequest_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warden_atmosphereinternationalrequest
    ADD CONSTRAINT warden_atmosphereinternationalrequest_user_id_key UNIQUE (user_id);


--
-- Name: warden_atmospherestudentrequest warden_atmospherestudentrequest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warden_atmospherestudentrequest
    ADD CONSTRAINT warden_atmospherestudentrequest_pkey PRIMARY KEY (id);


--
-- Name: warden_atmospherestudentrequest warden_atmospherestudentrequest_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warden_atmospherestudentrequest
    ADD CONSTRAINT warden_atmospherestudentrequest_user_id_key UNIQUE (user_id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: account_emailaddress_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_emailaddress_e8701ad4 ON public.account_emailaddress USING btree (user_id);


--
-- Name: account_emailaddress_email_03be32b2_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_emailaddress_email_03be32b2_like ON public.account_emailaddress USING btree (email varchar_pattern_ops);


--
-- Name: account_passwordreset_user_id_8d2f98f2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_passwordreset_user_id_8d2f98f2 ON public.account_passwordreset USING btree (user_id);


--
-- Name: account_passwordresetrequest_email_address_id_1a2cd918; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_passwordresetrequest_email_address_id_1a2cd918 ON public.account_passwordresetrequest USING btree (email_address_id);


--
-- Name: account_passwordresetrequest_user_id_28b4624d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_passwordresetrequest_user_id_28b4624d ON public.account_passwordresetrequest USING btree (user_id);


--
-- Name: account_region_93bfec8a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_region_93bfec8a ON public.account_region USING btree (country_id);


--
-- Name: account_user_0f442f96; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_user_0f442f96 ON public.account_user USING btree (region_id);


--
-- Name: account_user_1574219a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_user_1574219a ON public.account_user USING btree (research_area_id);


--
-- Name: account_user_31999bd7; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_user_31999bd7 ON public.account_user USING btree (ethnicity_id);


--
-- Name: account_user_623af7fd; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_user_623af7fd ON public.account_user USING btree (gender_id);


--
-- Name: account_user_8a5c8bdd; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_user_8a5c8bdd ON public.account_user USING btree (aware_channel_id);


--
-- Name: account_user_b3a8f282; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_user_b3a8f282 ON public.account_user USING btree (occupation_id);


--
-- Name: account_user_e353a8c6; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_user_e353a8c6 ON public.account_user USING btree (funding_agency_id);


--
-- Name: account_user_email_0bd7c421_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_user_email_0bd7c421_like ON public.account_user USING btree (email varchar_pattern_ops);


--
-- Name: account_user_groups_0e939a4f; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_user_groups_0e939a4f ON public.account_user_groups USING btree (group_id);


--
-- Name: account_user_groups_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_user_groups_e8701ad4 ON public.account_user_groups USING btree (user_id);


--
-- Name: account_user_user_institution_id_fb1c5582; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_user_user_institution_id_fb1c5582 ON public.account_user USING btree (user_institution_id);


--
-- Name: account_user_user_permissions_8373b171; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_user_user_permissions_8373b171 ON public.account_user_user_permissions USING btree (permission_id);


--
-- Name: account_user_user_permissions_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_user_user_permissions_e8701ad4 ON public.account_user_user_permissions USING btree (user_id);


--
-- Name: account_user_username_d393f583_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_user_username_d393f583_like ON public.account_user USING btree (username varchar_pattern_ops);


--
-- Name: account_userinstitution_institution_id_18e3dba5; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_userinstitution_institution_id_18e3dba5 ON public.account_userinstitution USING btree (institution_id);


--
-- Name: account_userinstitution_user_id_0b76a0cb; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_userinstitution_user_id_0b76a0cb ON public.account_userinstitution USING btree (user_id);


--
-- Name: api_accessrequest_b0dc1e29; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_accessrequest_b0dc1e29 ON public.api_accessrequest USING btree (service_id);


--
-- Name: api_accessrequest_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_accessrequest_e8701ad4 ON public.api_accessrequest USING btree (user_id);


--
-- Name: api_accessrequestanswer_13c3dc40; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_accessrequestanswer_13c3dc40 ON public.api_accessrequestanswer USING btree (access_request_question_id);


--
-- Name: api_accessrequestanswer_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_accessrequestanswer_e8701ad4 ON public.api_accessrequestanswer USING btree (user_id);


--
-- Name: api_accessrequestconversation_access_request_id_a8515c28; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_accessrequestconversation_access_request_id_a8515c28 ON public.api_accessrequestconversation USING btree (access_request_id);


--
-- Name: api_accessrequestlog_c94ebcdd; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_accessrequestlog_c94ebcdd ON public.api_accessrequestlog USING btree (access_request_id);


--
-- Name: api_accessrequestquestion_b0dc1e29; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_accessrequestquestion_b0dc1e29 ON public.api_accessrequestquestion USING btree (service_id);


--
-- Name: api_contact_b0dc1e29; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_contact_b0dc1e29 ON public.api_contact USING btree (service_id);


--
-- Name: api_emailaddressmailinglist_email_address_id_2d07d4e7; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_emailaddressmailinglist_email_address_id_2d07d4e7 ON public.api_emailaddressmailinglist USING btree (email_address_id);


--
-- Name: api_emailaddressmailinglist_mailing_address_id_051dae9e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_emailaddressmailinglist_mailing_address_id_051dae9e ON public.api_emailaddressmailinglist USING btree (mailing_list_id);


--
-- Name: api_formfield_form_section_id_6f306a91; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_formfield_form_section_id_6f306a91 ON public.api_formfield USING btree (form_section_id);


--
-- Name: api_formfieldoption_form_field_id_62aa3e83; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_formfieldoption_form_field_id_62aa3e83 ON public.api_formfieldoption USING btree (form_field_id);


--
-- Name: api_formfieldsubmission_form_field_id_9e3a6547; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_formfieldsubmission_form_field_id_9e3a6547 ON public.api_formfieldsubmission USING btree (form_field_id);


--
-- Name: api_formfieldsubmission_form_submission_id_51d1f53b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_formfieldsubmission_form_submission_id_51d1f53b ON public.api_formfieldsubmission USING btree (form_submission_id);


--
-- Name: api_formfieldsubmission_value_select_id_fabaa8f4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_formfieldsubmission_value_select_id_fabaa8f4 ON public.api_formfieldsubmission USING btree (value_select_id);


--
-- Name: api_formgroupform_form_group_id_a4cc3d7e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_formgroupform_form_group_id_a4cc3d7e ON public.api_formgroupform USING btree (form_group_id);


--
-- Name: api_formgroupform_form_id_073cbd92; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_formgroupform_form_id_073cbd92 ON public.api_formgroupform USING btree (form_id);


--
-- Name: api_formintercomteam_form_id_d2e3c75b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_formintercomteam_form_id_d2e3c75b ON public.api_formintercomteam USING btree (form_id);


--
-- Name: api_formintercomteam_intercom_team_id_b813a8e6; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_formintercomteam_intercom_team_id_b813a8e6 ON public.api_formintercomteam USING btree (intercom_team_id);


--
-- Name: api_formsection_form_id_5c611d28; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_formsection_form_id_5c611d28 ON public.api_formsection USING btree (form_id);


--
-- Name: api_formsubmission_form_id_1c863302; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_formsubmission_form_id_1c863302 ON public.api_formsubmission USING btree (form_id);


--
-- Name: api_formsubmission_user_id_7e9d6537; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_formsubmission_user_id_7e9d6537 ON public.api_formsubmission USING btree (user_id);


--
-- Name: api_formsubmissionconversation_form_submission_id_9d42c29b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_formsubmissionconversation_form_submission_id_9d42c29b ON public.api_formsubmissionconversation USING btree (form_submission_id);


--
-- Name: api_mailinglist_list_name_d595132f_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_mailinglist_list_name_d595132f_like ON public.api_mailinglist USING btree (list_name varchar_pattern_ops);


--
-- Name: api_mailinglist_service_id_83ffaeff; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_mailinglist_service_id_83ffaeff ON public.api_mailinglist USING btree (service_id);


--
-- Name: api_poweredservicecyverseservice_38803362; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_poweredservicecyverseservice_38803362 ON public.api_poweredservicecyverseservice USING btree (powered_service_id);


--
-- Name: api_poweredservicecyverseservice_8ba1970c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_poweredservicecyverseservice_8ba1970c ON public.api_poweredservicecyverseservice USING btree (cyverse_service_id);


--
-- Name: api_poweredservicepoweredbyoption_38803362; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_poweredservicepoweredbyoption_38803362 ON public.api_poweredservicepoweredbyoption USING btree (powered_service_id);


--
-- Name: api_poweredservicepoweredbyoption_4ff4714f; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_poweredservicepoweredbyoption_4ff4714f ON public.api_poweredservicepoweredbyoption USING btree (powered_by_option_id);


--
-- Name: api_service_24fc69df; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_service_24fc69df ON public.api_service USING btree (service_maintainer_id);


--
-- Name: api_serviceform_form_id_38a26656; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_serviceform_form_id_38a26656 ON public.api_serviceform USING btree (form_id);


--
-- Name: api_serviceform_service_id_ba400062; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_serviceform_service_id_ba400062 ON public.api_serviceform USING btree (service_id);


--
-- Name: api_serviceresource_b0dc1e29; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_serviceresource_b0dc1e29 ON public.api_serviceresource USING btree (service_id);


--
-- Name: api_servicestatus_b0dc1e29; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_servicestatus_b0dc1e29 ON public.api_servicestatus USING btree (service_id);


--
-- Name: api_userservice_b0dc1e29; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_userservice_b0dc1e29 ON public.api_userservice USING btree (service_id);


--
-- Name: api_userservice_c94ebcdd; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_userservice_c94ebcdd ON public.api_userservice USING btree (access_request_id);


--
-- Name: api_userservice_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_userservice_e8701ad4 ON public.api_userservice USING btree (user_id);


--
-- Name: api_userworkshop_user_id_3dc8dd6f; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_userworkshop_user_id_3dc8dd6f ON public.api_userworkshop USING btree (user_id);


--
-- Name: api_userworkshop_workshop_enrollment_request_id_8a6c05a2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_userworkshop_workshop_enrollment_request_id_8a6c05a2 ON public.api_userworkshop USING btree (workshop_enrollment_request_id);


--
-- Name: api_userworkshop_workshop_id_ab1b8028; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_userworkshop_workshop_id_ab1b8028 ON public.api_userworkshop USING btree (workshop_id);


--
-- Name: api_userworkshopcode_user_id_e8825285; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_userworkshopcode_user_id_e8825285 ON public.api_userworkshopcode USING btree (user_id);


--
-- Name: api_userworkshopcode_workshop_code_id_41e7efb0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_userworkshopcode_workshop_code_id_41e7efb0 ON public.api_userworkshopcode USING btree (workshop_code_id);


--
-- Name: api_workshop_creator_id_af8fa8dd; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_workshop_creator_id_af8fa8dd ON public.api_workshop USING btree (creator_id);


--
-- Name: api_workshopcode_workshop_id_fddfd219; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_workshopcode_workshop_id_fddfd219 ON public.api_workshopcode USING btree (workshop_id);


--
-- Name: api_workshopcontact_workshop_id_2e4ffc40; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_workshopcontact_workshop_id_2e4ffc40 ON public.api_workshopcontact USING btree (workshop_id);


--
-- Name: api_workshopenrollmentrequ_workshop_enrollment_reques_e62392ac; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_workshopenrollmentrequ_workshop_enrollment_reques_e62392ac ON public.api_workshopenrollmentrequestlog USING btree (workshop_enrollment_request_id);


--
-- Name: api_workshopenrollmentrequest_user_id_d36f55b9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_workshopenrollmentrequest_user_id_d36f55b9 ON public.api_workshopenrollmentrequest USING btree (user_id);


--
-- Name: api_workshopenrollmentrequest_workshop_id_4bb40b68; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_workshopenrollmentrequest_workshop_id_4bb40b68 ON public.api_workshopenrollmentrequest USING btree (workshop_id);


--
-- Name: api_workshopformsubmission_user_id_1c2047eb; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_workshopformsubmission_user_id_1c2047eb ON public.api_workshopformsubmission USING btree (user_id);


--
-- Name: api_workshoporganizer_organizer_id_273ccc45; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_workshoporganizer_organizer_id_273ccc45 ON public.api_workshoporganizer USING btree (organizer_id);


--
-- Name: api_workshoporganizer_workshop_id_8450d9df; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_workshoporganizer_workshop_id_8450d9df ON public.api_workshoporganizer USING btree (workshop_id);


--
-- Name: api_workshopservice_service_id_9d6bbf61; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_workshopservice_service_id_9d6bbf61 ON public.api_workshopservice USING btree (service_id);


--
-- Name: api_workshopservice_workshop_id_e33ba697; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_workshopservice_workshop_id_e33ba697 ON public.api_workshopservice USING btree (workshop_id);


--
-- Name: api_workshopuseremail_workshop_id_be8ddd55; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_workshopuseremail_workshop_id_be8ddd55 ON public.api_workshopuseremail USING btree (workshop_id);


--
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- Name: auth_group_permissions_0e939a4f; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_group_permissions_0e939a4f ON public.auth_group_permissions USING btree (group_id);


--
-- Name: auth_group_permissions_8373b171; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_group_permissions_8373b171 ON public.auth_group_permissions USING btree (permission_id);


--
-- Name: auth_permission_417f1b1c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_permission_417f1b1c ON public.auth_permission USING btree (content_type_id);


--
-- Name: django_admin_log_417f1b1c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_admin_log_417f1b1c ON public.django_admin_log USING btree (content_type_id);


--
-- Name: django_admin_log_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_admin_log_e8701ad4 ON public.django_admin_log USING btree (user_id);


--
-- Name: django_celery_results_taskresult_hidden_cd77412f; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_celery_results_taskresult_hidden_cd77412f ON public.django_celery_results_taskresult USING btree (hidden);


--
-- Name: django_celery_results_taskresult_task_id_de0d95bf_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_celery_results_taskresult_task_id_de0d95bf_like ON public.django_celery_results_taskresult USING btree (task_id varchar_pattern_ops);


--
-- Name: django_cyverse_auth_accesstoken_key_848d4959_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_cyverse_auth_accesstoken_key_848d4959_like ON public.django_cyverse_auth_accesstoken USING btree (key varchar_pattern_ops);


--
-- Name: django_cyverse_auth_token_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_cyverse_auth_token_e8701ad4 ON public.django_cyverse_auth_token USING btree (user_id);


--
-- Name: django_cyverse_auth_token_key_a7f8d021_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_cyverse_auth_token_key_a7f8d021_like ON public.django_cyverse_auth_token USING btree (key varchar_pattern_ops);


--
-- Name: django_session_de54fa62; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_session_de54fa62 ON public.django_session USING btree (expire_date);


--
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


--
-- Name: warden_atmosphereinternationalrequest_60f75a15; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX warden_atmosphereinternationalrequest_60f75a15 ON public.warden_atmosphereinternationalrequest USING btree (funding_source_id);


--
-- Name: api_poweredservicepoweredbyoption D45cebc13548a0e108f3ef0440eec694; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_poweredservicepoweredbyoption
    ADD CONSTRAINT "D45cebc13548a0e108f3ef0440eec694" FOREIGN KEY (powered_service_id) REFERENCES public.api_poweredservice(service_ptr_id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_accessrequestanswer D91b67e45fb3af160e434ce8b5965134; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_accessrequestanswer
    ADD CONSTRAINT "D91b67e45fb3af160e434ce8b5965134" FOREIGN KEY (access_request_question_id) REFERENCES public.api_accessrequestquestion(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: account_user account__funding_agency_id_48dc69d4_fk_account_fundingagency_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_user
    ADD CONSTRAINT account__funding_agency_id_48dc69d4_fk_account_fundingagency_id FOREIGN KEY (funding_agency_id) REFERENCES public.account_fundingagency(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: account_emailaddress account_emailaddress_user_id_2c513194_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_emailaddress
    ADD CONSTRAINT account_emailaddress_user_id_2c513194_fk_account_user_id FOREIGN KEY (user_id) REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: account_passwordresetrequest account_passwordrese_email_address_id_1a2cd918_fk_account_e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_passwordresetrequest
    ADD CONSTRAINT account_passwordrese_email_address_id_1a2cd918_fk_account_e FOREIGN KEY (email_address_id) REFERENCES public.account_emailaddress(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: account_passwordresetrequest account_passwordrese_user_id_28b4624d_fk_account_u; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_passwordresetrequest
    ADD CONSTRAINT account_passwordrese_user_id_28b4624d_fk_account_u FOREIGN KEY (user_id) REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: account_passwordreset account_passwordreset_user_id_8d2f98f2_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_passwordreset
    ADD CONSTRAINT account_passwordreset_user_id_8d2f98f2_fk_account_user_id FOREIGN KEY (user_id) REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: account_region account_region_country_id_b25a520c_fk_account_country_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_region
    ADD CONSTRAINT account_region_country_id_b25a520c_fk_account_country_id FOREIGN KEY (country_id) REFERENCES public.account_country(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: account_user account_us_aware_channel_id_d6dfa82b_fk_account_awarechannel_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_user
    ADD CONSTRAINT account_us_aware_channel_id_d6dfa82b_fk_account_awarechannel_id FOREIGN KEY (aware_channel_id) REFERENCES public.account_awarechannel(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: account_user account_us_research_area_id_9f530d2b_fk_account_researcharea_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_user
    ADD CONSTRAINT account_us_research_area_id_9f530d2b_fk_account_researcharea_id FOREIGN KEY (research_area_id) REFERENCES public.account_researcharea(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: account_user account_user_ethnicity_id_3e03590f_fk_account_ethnicity_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_user
    ADD CONSTRAINT account_user_ethnicity_id_3e03590f_fk_account_ethnicity_id FOREIGN KEY (ethnicity_id) REFERENCES public.account_ethnicity(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: account_user account_user_gender_id_dd2adcaa_fk_account_gender_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_user
    ADD CONSTRAINT account_user_gender_id_dd2adcaa_fk_account_gender_id FOREIGN KEY (gender_id) REFERENCES public.account_gender(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: account_user_groups account_user_groups_group_id_6c71f749_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_user_groups
    ADD CONSTRAINT account_user_groups_group_id_6c71f749_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: account_user_groups account_user_groups_user_id_14345e7b_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_user_groups
    ADD CONSTRAINT account_user_groups_user_id_14345e7b_fk_account_user_id FOREIGN KEY (user_id) REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: account_user account_user_occupation_id_05073ebb_fk_account_occupation_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_user
    ADD CONSTRAINT account_user_occupation_id_05073ebb_fk_account_occupation_id FOREIGN KEY (occupation_id) REFERENCES public.account_occupation(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: account_user account_user_region_id_4138ba34_fk_account_region_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_user
    ADD CONSTRAINT account_user_region_id_4138ba34_fk_account_region_id FOREIGN KEY (region_id) REFERENCES public.account_region(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: account_user_user_permissions account_user_user__permission_id_66c44191_fk_auth_permission_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_user_user_permissions
    ADD CONSTRAINT account_user_user__permission_id_66c44191_fk_auth_permission_id FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: account_user account_user_user_institution_id_fb1c5582_fk_account_i; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_user
    ADD CONSTRAINT account_user_user_institution_id_fb1c5582_fk_account_i FOREIGN KEY (user_institution_id) REFERENCES public.account_institution(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: account_user_user_permissions account_user_user_permissio_user_id_cc42d270_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_user_user_permissions
    ADD CONSTRAINT account_user_user_permissio_user_id_cc42d270_fk_account_user_id FOREIGN KEY (user_id) REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: account_userinstitution account_userinstitut_institution_id_18e3dba5_fk_account_i; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_userinstitution
    ADD CONSTRAINT account_userinstitut_institution_id_18e3dba5_fk_account_i FOREIGN KEY (institution_id) REFERENCES public.account_institution(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: account_userinstitution account_userinstitution_user_id_0b76a0cb_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_userinstitution
    ADD CONSTRAINT account_userinstitution_user_id_0b76a0cb_fk_account_user_id FOREIGN KEY (user_id) REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_service api__service_maintainer_id_0ae12004_fk_api_servicemaintainer_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_service
    ADD CONSTRAINT api__service_maintainer_id_0ae12004_fk_api_servicemaintainer_id FOREIGN KEY (service_maintainer_id) REFERENCES public.api_servicemaintainer(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_accessrequestlog api_accessre_access_request_id_d021dd12_fk_api_accessrequest_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_accessrequestlog
    ADD CONSTRAINT api_accessre_access_request_id_d021dd12_fk_api_accessrequest_id FOREIGN KEY (access_request_id) REFERENCES public.api_accessrequest(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_accessrequest api_accessrequest_service_id_8a5d1451_fk_api_service_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_accessrequest
    ADD CONSTRAINT api_accessrequest_service_id_8a5d1451_fk_api_service_id FOREIGN KEY (service_id) REFERENCES public.api_service(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_accessrequest api_accessrequest_user_id_478b1081_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_accessrequest
    ADD CONSTRAINT api_accessrequest_user_id_478b1081_fk_account_user_id FOREIGN KEY (user_id) REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_accessrequestanswer api_accessrequestanswer_user_id_816cb9f9_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_accessrequestanswer
    ADD CONSTRAINT api_accessrequestanswer_user_id_816cb9f9_fk_account_user_id FOREIGN KEY (user_id) REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_accessrequestconversation api_accessrequestcon_access_request_id_a8515c28_fk_api_acces; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_accessrequestconversation
    ADD CONSTRAINT api_accessrequestcon_access_request_id_a8515c28_fk_api_acces FOREIGN KEY (access_request_id) REFERENCES public.api_accessrequest(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_accessrequestquestion api_accessrequestquestion_service_id_008bdd01_fk_api_service_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_accessrequestquestion
    ADD CONSTRAINT api_accessrequestquestion_service_id_008bdd01_fk_api_service_id FOREIGN KEY (service_id) REFERENCES public.api_service(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_contact api_contact_service_id_6acbc419_fk_api_service_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_contact
    ADD CONSTRAINT api_contact_service_id_6acbc419_fk_api_service_id FOREIGN KEY (service_id) REFERENCES public.api_service(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_cyverseservice api_cyverseservice_service_ptr_id_c7823d13_fk_api_service_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_cyverseservice
    ADD CONSTRAINT api_cyverseservice_service_ptr_id_c7823d13_fk_api_service_id FOREIGN KEY (service_ptr_id) REFERENCES public.api_service(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_emailaddressmailinglist api_emailaddressmail_email_address_id_2d07d4e7_fk_account_e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_emailaddressmailinglist
    ADD CONSTRAINT api_emailaddressmail_email_address_id_2d07d4e7_fk_account_e FOREIGN KEY (email_address_id) REFERENCES public.account_emailaddress(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_emailaddressmailinglist api_emailaddressmail_mailing_list_id_65920a16_fk_api_maili; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_emailaddressmailinglist
    ADD CONSTRAINT api_emailaddressmail_mailing_list_id_65920a16_fk_api_maili FOREIGN KEY (mailing_list_id) REFERENCES public.api_mailinglist(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_formfield api_formfield_form_section_id_6f306a91_fk_api_formsection_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formfield
    ADD CONSTRAINT api_formfield_form_section_id_6f306a91_fk_api_formsection_id FOREIGN KEY (form_section_id) REFERENCES public.api_formsection(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_formfieldoption api_formfieldoption_form_field_id_62aa3e83_fk_api_formfield_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formfieldoption
    ADD CONSTRAINT api_formfieldoption_form_field_id_62aa3e83_fk_api_formfield_id FOREIGN KEY (form_field_id) REFERENCES public.api_formfield(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_formfieldsubmission api_formfieldsubmiss_form_field_id_9e3a6547_fk_api_formf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formfieldsubmission
    ADD CONSTRAINT api_formfieldsubmiss_form_field_id_9e3a6547_fk_api_formf FOREIGN KEY (form_field_id) REFERENCES public.api_formfield(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_formfieldsubmission api_formfieldsubmiss_form_submission_id_51d1f53b_fk_api_forms; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formfieldsubmission
    ADD CONSTRAINT api_formfieldsubmiss_form_submission_id_51d1f53b_fk_api_forms FOREIGN KEY (form_submission_id) REFERENCES public.api_formsubmission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_formfieldsubmission api_formfieldsubmiss_value_select_id_fabaa8f4_fk_api_formf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formfieldsubmission
    ADD CONSTRAINT api_formfieldsubmiss_value_select_id_fabaa8f4_fk_api_formf FOREIGN KEY (value_select_id) REFERENCES public.api_formfieldoption(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_formgroupform api_formgroupform_form_group_id_a4cc3d7e_fk_api_formgroup_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formgroupform
    ADD CONSTRAINT api_formgroupform_form_group_id_a4cc3d7e_fk_api_formgroup_id FOREIGN KEY (form_group_id) REFERENCES public.api_formgroup(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_formgroupform api_formgroupform_form_id_073cbd92_fk_api_form_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formgroupform
    ADD CONSTRAINT api_formgroupform_form_id_073cbd92_fk_api_form_id FOREIGN KEY (form_id) REFERENCES public.api_form(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_formintercomteam api_formintercomteam_form_id_d2e3c75b_fk_api_form_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formintercomteam
    ADD CONSTRAINT api_formintercomteam_form_id_d2e3c75b_fk_api_form_id FOREIGN KEY (form_id) REFERENCES public.api_form(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_formintercomteam api_formintercomteam_intercom_team_id_b813a8e6_fk_api_inter; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formintercomteam
    ADD CONSTRAINT api_formintercomteam_intercom_team_id_b813a8e6_fk_api_inter FOREIGN KEY (intercom_team_id) REFERENCES public.api_intercomteam(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_formsection api_formsection_form_id_5c611d28_fk_api_form_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formsection
    ADD CONSTRAINT api_formsection_form_id_5c611d28_fk_api_form_id FOREIGN KEY (form_id) REFERENCES public.api_form(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_formsubmission api_formsubmission_form_id_1c863302_fk_api_form_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formsubmission
    ADD CONSTRAINT api_formsubmission_form_id_1c863302_fk_api_form_id FOREIGN KEY (form_id) REFERENCES public.api_form(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_formsubmission api_formsubmission_user_id_7e9d6537_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formsubmission
    ADD CONSTRAINT api_formsubmission_user_id_7e9d6537_fk_account_user_id FOREIGN KEY (user_id) REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_formsubmissionconversation api_formsubmissionco_form_submission_id_9d42c29b_fk_api_forms; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_formsubmissionconversation
    ADD CONSTRAINT api_formsubmissionco_form_submission_id_9d42c29b_fk_api_forms FOREIGN KEY (form_submission_id) REFERENCES public.api_formsubmission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_helpservice api_helpservice_service_ptr_id_9dcd90ca_fk_api_service_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_helpservice
    ADD CONSTRAINT api_helpservice_service_ptr_id_9dcd90ca_fk_api_service_id FOREIGN KEY (service_ptr_id) REFERENCES public.api_service(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_mailinglist api_mailinglist_service_id_83ffaeff_fk_api_cyver; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_mailinglist
    ADD CONSTRAINT api_mailinglist_service_id_83ffaeff_fk_api_cyver FOREIGN KEY (service_id) REFERENCES public.api_cyverseservice(service_ptr_id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_poweredservicepoweredbyoption api_pow_powered_by_option_id_78bae803_fk_api_poweredbyoption_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_poweredservicepoweredbyoption
    ADD CONSTRAINT api_pow_powered_by_option_id_78bae803_fk_api_poweredbyoption_id FOREIGN KEY (powered_by_option_id) REFERENCES public.api_poweredbyoption(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_poweredservice api_poweredservice_service_ptr_id_2b59ce79_fk_api_service_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_poweredservice
    ADD CONSTRAINT api_poweredservice_service_ptr_id_2b59ce79_fk_api_service_id FOREIGN KEY (service_ptr_id) REFERENCES public.api_service(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_serviceform api_serviceform_form_id_38a26656_fk_api_form_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_serviceform
    ADD CONSTRAINT api_serviceform_form_id_38a26656_fk_api_form_id FOREIGN KEY (form_id) REFERENCES public.api_form(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_serviceform api_serviceform_service_id_ba400062_fk_api_service_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_serviceform
    ADD CONSTRAINT api_serviceform_service_id_ba400062_fk_api_service_id FOREIGN KEY (service_id) REFERENCES public.api_service(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_serviceresource api_serviceresource_service_id_0d506d54_fk_api_service_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_serviceresource
    ADD CONSTRAINT api_serviceresource_service_id_0d506d54_fk_api_service_id FOREIGN KEY (service_id) REFERENCES public.api_service(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_servicestatus api_servicestatus_service_id_d43acab5_fk_api_service_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_servicestatus
    ADD CONSTRAINT api_servicestatus_service_id_d43acab5_fk_api_service_id FOREIGN KEY (service_id) REFERENCES public.api_service(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_userservice api_userserv_access_request_id_1745bd33_fk_api_accessrequest_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_userservice
    ADD CONSTRAINT api_userserv_access_request_id_1745bd33_fk_api_accessrequest_id FOREIGN KEY (access_request_id) REFERENCES public.api_accessrequest(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_userservice api_userservice_service_id_4ed3a1e1_fk_api_service_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_userservice
    ADD CONSTRAINT api_userservice_service_id_4ed3a1e1_fk_api_service_id FOREIGN KEY (service_id) REFERENCES public.api_service(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_userservice api_userservice_user_id_ae6e486d_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_userservice
    ADD CONSTRAINT api_userservice_user_id_ae6e486d_fk_account_user_id FOREIGN KEY (user_id) REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_userworkshop api_userworkshop_user_id_3dc8dd6f_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_userworkshop
    ADD CONSTRAINT api_userworkshop_user_id_3dc8dd6f_fk_account_user_id FOREIGN KEY (user_id) REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_userworkshop api_userworkshop_workshop_enrollment__8a6c05a2_fk_api_works; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_userworkshop
    ADD CONSTRAINT api_userworkshop_workshop_enrollment__8a6c05a2_fk_api_works FOREIGN KEY (workshop_enrollment_request_id) REFERENCES public.api_workshopenrollmentrequest(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_userworkshop api_userworkshop_workshop_id_ab1b8028_fk_api_workshop_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_userworkshop
    ADD CONSTRAINT api_userworkshop_workshop_id_ab1b8028_fk_api_workshop_id FOREIGN KEY (workshop_id) REFERENCES public.api_workshop(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_userworkshopcode api_userworkshopcode_user_id_e8825285_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_userworkshopcode
    ADD CONSTRAINT api_userworkshopcode_user_id_e8825285_fk_account_user_id FOREIGN KEY (user_id) REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_userworkshopcode api_userworkshopcode_workshop_code_id_41e7efb0_fk_api_works; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_userworkshopcode
    ADD CONSTRAINT api_userworkshopcode_workshop_code_id_41e7efb0_fk_api_works FOREIGN KEY (workshop_code_id) REFERENCES public.api_workshopcode(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_workshop api_workshop_creator_id_af8fa8dd_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshop
    ADD CONSTRAINT api_workshop_creator_id_af8fa8dd_fk_account_user_id FOREIGN KEY (creator_id) REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_workshopcode api_workshopcode_workshop_id_fddfd219_fk_api_workshop_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopcode
    ADD CONSTRAINT api_workshopcode_workshop_id_fddfd219_fk_api_workshop_id FOREIGN KEY (workshop_id) REFERENCES public.api_workshop(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_workshopcontact api_workshopcontact_workshop_id_2e4ffc40_fk_api_workshop_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopcontact
    ADD CONSTRAINT api_workshopcontact_workshop_id_2e4ffc40_fk_api_workshop_id FOREIGN KEY (workshop_id) REFERENCES public.api_workshop(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_workshopenrollmentrequest api_workshopenrollme_user_id_d36f55b9_fk_account_u; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopenrollmentrequest
    ADD CONSTRAINT api_workshopenrollme_user_id_d36f55b9_fk_account_u FOREIGN KEY (user_id) REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_workshopenrollmentrequestlog api_workshopenrollme_workshop_enrollment__e62392ac_fk_api_works; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopenrollmentrequestlog
    ADD CONSTRAINT api_workshopenrollme_workshop_enrollment__e62392ac_fk_api_works FOREIGN KEY (workshop_enrollment_request_id) REFERENCES public.api_workshopenrollmentrequest(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_workshopenrollmentrequest api_workshopenrollme_workshop_id_4bb40b68_fk_api_works; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopenrollmentrequest
    ADD CONSTRAINT api_workshopenrollme_workshop_id_4bb40b68_fk_api_works FOREIGN KEY (workshop_id) REFERENCES public.api_workshop(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_workshopform api_workshopform_form_id_3eb3338d_fk_api_form_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopform
    ADD CONSTRAINT api_workshopform_form_id_3eb3338d_fk_api_form_id FOREIGN KEY (form_id) REFERENCES public.api_form(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_workshopformsubmission api_workshopformsubm_form_submission_id_18c05abc_fk_api_forms; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopformsubmission
    ADD CONSTRAINT api_workshopformsubm_form_submission_id_18c05abc_fk_api_forms FOREIGN KEY (form_submission_id) REFERENCES public.api_formsubmission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_workshopformsubmission api_workshopformsubmission_user_id_1c2047eb_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopformsubmission
    ADD CONSTRAINT api_workshopformsubmission_user_id_1c2047eb_fk_account_user_id FOREIGN KEY (user_id) REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_workshoporganizer api_workshoporganizer_organizer_id_273ccc45_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshoporganizer
    ADD CONSTRAINT api_workshoporganizer_organizer_id_273ccc45_fk_account_user_id FOREIGN KEY (organizer_id) REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_workshoporganizer api_workshoporganizer_workshop_id_8450d9df_fk_api_workshop_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshoporganizer
    ADD CONSTRAINT api_workshoporganizer_workshop_id_8450d9df_fk_api_workshop_id FOREIGN KEY (workshop_id) REFERENCES public.api_workshop(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_workshopservice api_workshopservice_service_id_9d6bbf61_fk_api_service_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopservice
    ADD CONSTRAINT api_workshopservice_service_id_9d6bbf61_fk_api_service_id FOREIGN KEY (service_id) REFERENCES public.api_service(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_workshopservice api_workshopservice_workshop_id_e33ba697_fk_api_workshop_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopservice
    ADD CONSTRAINT api_workshopservice_workshop_id_e33ba697_fk_api_workshop_id FOREIGN KEY (workshop_id) REFERENCES public.api_workshop(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_workshopuseremail api_workshopuseremail_workshop_id_be8ddd55_fk_api_workshop_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_workshopuseremail
    ADD CONSTRAINT api_workshopuseremail_workshop_id_be8ddd55_fk_api_workshop_id FOREIGN KEY (workshop_id) REFERENCES public.api_workshop(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permiss_permission_id_84c5c92e_fk_auth_permission_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permiss_permission_id_84c5c92e_fk_auth_permission_id FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_permission auth_permiss_content_type_id_2f476e4b_fk_django_content_type_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permiss_content_type_id_2f476e4b_fk_django_content_type_id FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_poweredservicecyverseservice c8feb1fb9d48559470242ca3262133fa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_poweredservicecyverseservice
    ADD CONSTRAINT c8feb1fb9d48559470242ca3262133fa FOREIGN KEY (cyverse_service_id) REFERENCES public.api_cyverseservice(service_ptr_id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_content_type_id_c4bce8eb_fk_django_content_type_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_content_type_id_c4bce8eb_fk_django_content_type_id FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_account_user_id FOREIGN KEY (user_id) REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_cyverse_auth_token django_cyverse_auth_token_user_id_f5d59af8_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_cyverse_auth_token
    ADD CONSTRAINT django_cyverse_auth_token_user_id_f5d59af8_fk_account_user_id FOREIGN KEY (user_id) REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_poweredservicecyverseservice e699c7c9ef4ec81580faef4428c3306e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_poweredservicecyverseservice
    ADD CONSTRAINT e699c7c9ef4ec81580faef4428c3306e FOREIGN KEY (powered_service_id) REFERENCES public.api_poweredservice(service_ptr_id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: account_user user_grid_fk_c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_user
    ADD CONSTRAINT user_grid_fk_c FOREIGN KEY (grid_institution_id) REFERENCES public.account_institution_grid(id);


--
-- Name: warden_atmosphereinternationalrequest warden_a_funding_source_id_fd25e5f5_fk_account_fundingagency_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warden_atmosphereinternationalrequest
    ADD CONSTRAINT warden_a_funding_source_id_fd25e5f5_fk_account_fundingagency_id FOREIGN KEY (funding_source_id) REFERENCES public.account_fundingagency(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: warden_atmosphereinternationalrequest warden_atmosphereinternatio_user_id_acc52e7f_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warden_atmosphereinternationalrequest
    ADD CONSTRAINT warden_atmosphereinternatio_user_id_acc52e7f_fk_account_user_id FOREIGN KEY (user_id) REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: warden_atmospherestudentrequest warden_atmospherestudentreq_user_id_6b2ceaa9_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warden_atmospherestudentrequest
    ADD CONSTRAINT warden_atmospherestudentreq_user_id_6b2ceaa9_fk_account_user_id FOREIGN KEY (user_id) REFERENCES public.account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: TABLE account_awarechannel; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.account_awarechannel TO portal_db_reader;


--
-- Name: TABLE account_country; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.account_country TO portal_db_reader;


--
-- Name: TABLE account_emailaddress; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.account_emailaddress TO portal_db_reader;


--
-- Name: TABLE account_ethnicity; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.account_ethnicity TO portal_db_reader;


--
-- Name: TABLE account_fundingagency; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.account_fundingagency TO portal_db_reader;


--
-- Name: TABLE account_gender; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.account_gender TO portal_db_reader;


--
-- Name: TABLE account_institution; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.account_institution TO portal_db_reader;


--
-- Name: TABLE account_institution_grid; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.account_institution_grid TO portal_db_reader;


--
-- Name: COLUMN account_institution_grid.id; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(id) ON TABLE public.account_institution_grid TO portal_db_reader;


--
-- Name: COLUMN account_institution_grid.grid_id; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(grid_id) ON TABLE public.account_institution_grid TO portal_db_reader;


--
-- Name: COLUMN account_institution_grid.name; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(name) ON TABLE public.account_institution_grid TO portal_db_reader;


--
-- Name: COLUMN account_institution_grid.city; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(city) ON TABLE public.account_institution_grid TO portal_db_reader;


--
-- Name: COLUMN account_institution_grid.state; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(state) ON TABLE public.account_institution_grid TO portal_db_reader;


--
-- Name: COLUMN account_institution_grid.country; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(country) ON TABLE public.account_institution_grid TO portal_db_reader;


--
-- Name: TABLE account_occupation; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.account_occupation TO portal_db_reader;


--
-- Name: TABLE account_passwordreset; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.account_passwordreset TO portal_db_reader;


--
-- Name: TABLE account_passwordresetrequest; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.account_passwordresetrequest TO portal_db_reader;


--
-- Name: TABLE account_region; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.account_region TO portal_db_reader;


--
-- Name: TABLE account_researcharea; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.account_researcharea TO portal_db_reader;


--
-- Name: TABLE account_restrictedusername; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.account_restrictedusername TO portal_db_reader;


--
-- Name: COLUMN account_user.grid_institution_id; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(grid_institution_id) ON TABLE public.account_user TO portal_db_reader;


--
-- Name: TABLE account_user_groups; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.account_user_groups TO portal_db_reader;


--
-- Name: TABLE account_user_sanitized; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.account_user_sanitized TO portal_db_reader;


--
-- Name: COLUMN account_user_sanitized.grid_institution_id; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT(grid_institution_id) ON TABLE public.account_user_sanitized TO portal_db_reader;


--
-- Name: TABLE account_user_user_permissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.account_user_user_permissions TO portal_db_reader;


--
-- Name: TABLE account_userinstitution; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.account_userinstitution TO portal_db_reader;


--
-- Name: TABLE api_accessrequest; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_accessrequest TO portal_db_reader;


--
-- Name: TABLE api_accessrequestanswer; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_accessrequestanswer TO portal_db_reader;


--
-- Name: TABLE api_accessrequestconversation; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_accessrequestconversation TO portal_db_reader;


--
-- Name: TABLE api_accessrequestlog; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_accessrequestlog TO portal_db_reader;


--
-- Name: TABLE api_accessrequestquestion; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_accessrequestquestion TO portal_db_reader;


--
-- Name: TABLE api_contact; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_contact TO portal_db_reader;


--
-- Name: TABLE api_cyverseservice; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_cyverseservice TO portal_db_reader;


--
-- Name: TABLE api_emailaddressmailinglist; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_emailaddressmailinglist TO portal_db_reader;


--
-- Name: TABLE api_form; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_form TO portal_db_reader;


--
-- Name: TABLE api_formfield; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_formfield TO portal_db_reader;


--
-- Name: TABLE api_formfieldoption; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_formfieldoption TO portal_db_reader;


--
-- Name: TABLE api_formfieldsubmission; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_formfieldsubmission TO portal_db_reader;


--
-- Name: TABLE api_formgroup; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_formgroup TO portal_db_reader;


--
-- Name: TABLE api_formgroupform; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_formgroupform TO portal_db_reader;


--
-- Name: TABLE api_formintercomteam; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_formintercomteam TO portal_db_reader;


--
-- Name: TABLE api_formsection; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_formsection TO portal_db_reader;


--
-- Name: TABLE api_formsubmission; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_formsubmission TO portal_db_reader;


--
-- Name: TABLE api_formsubmissionconversation; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_formsubmissionconversation TO portal_db_reader;


--
-- Name: TABLE api_helpservice; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_helpservice TO portal_db_reader;


--
-- Name: TABLE api_intercomteam; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_intercomteam TO portal_db_reader;


--
-- Name: TABLE api_mailinglist; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_mailinglist TO portal_db_reader;


--
-- Name: TABLE api_poweredbyoption; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_poweredbyoption TO portal_db_reader;


--
-- Name: TABLE api_poweredservice; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_poweredservice TO portal_db_reader;


--
-- Name: TABLE api_poweredservicecyverseservice; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_poweredservicecyverseservice TO portal_db_reader;


--
-- Name: TABLE api_poweredservicepoweredbyoption; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_poweredservicepoweredbyoption TO portal_db_reader;


--
-- Name: TABLE api_service; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_service TO portal_db_reader;


--
-- Name: TABLE api_serviceform; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_serviceform TO portal_db_reader;


--
-- Name: TABLE api_servicemaintainer; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_servicemaintainer TO portal_db_reader;


--
-- Name: TABLE api_serviceresource; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_serviceresource TO portal_db_reader;


--
-- Name: TABLE api_servicestatus; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_servicestatus TO portal_db_reader;


--
-- Name: TABLE api_userservice; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_userservice TO portal_db_reader;


--
-- Name: TABLE api_userworkshop; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_userworkshop TO portal_db_reader;


--
-- Name: TABLE api_userworkshopcode; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_userworkshopcode TO portal_db_reader;


--
-- Name: TABLE api_workshop; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_workshop TO portal_db_reader;


--
-- Name: TABLE api_workshopcode; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_workshopcode TO portal_db_reader;


--
-- Name: TABLE api_workshopenrollmentrequest; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_workshopenrollmentrequest TO portal_db_reader;


--
-- Name: TABLE api_workshopenrollmentrequestlog; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_workshopenrollmentrequestlog TO portal_db_reader;


--
-- Name: TABLE api_workshopform; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_workshopform TO portal_db_reader;


--
-- Name: TABLE api_workshopformsubmission; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_workshopformsubmission TO portal_db_reader;


--
-- Name: TABLE api_workshoporganizer; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_workshoporganizer TO portal_db_reader;


--
-- Name: TABLE api_workshopservice; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_workshopservice TO portal_db_reader;


--
-- Name: TABLE api_workshopuseremail; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.api_workshopuseremail TO portal_db_reader;


--
-- Name: TABLE auth_group; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.auth_group TO portal_db_reader;


--
-- Name: TABLE auth_group_permissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.auth_group_permissions TO portal_db_reader;


--
-- Name: TABLE auth_permission; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.auth_permission TO portal_db_reader;


--
-- Name: TABLE django_admin_log; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.django_admin_log TO portal_db_reader;


--
-- Name: TABLE django_celery_results_taskresult; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.django_celery_results_taskresult TO portal_db_reader;


--
-- Name: TABLE django_content_type; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.django_content_type TO portal_db_reader;


--
-- Name: TABLE django_cyverse_auth_accesstoken; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.django_cyverse_auth_accesstoken TO portal_db_reader;


--
-- Name: TABLE django_cyverse_auth_token; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.django_cyverse_auth_token TO portal_db_reader;


--
-- Name: TABLE django_cyverse_auth_userproxy; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.django_cyverse_auth_userproxy TO portal_db_reader;


--
-- Name: TABLE django_migrations; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.django_migrations TO portal_db_reader;


--
-- Name: TABLE django_session; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.django_session TO portal_db_reader;


--
-- Name: TABLE warden_atmosphereinternationalrequest; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.warden_atmosphereinternationalrequest TO portal_db_reader;


--
-- Name: TABLE warden_atmospherestudentrequest; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.warden_atmospherestudentrequest TO portal_db_reader;


--
-- PostgreSQL database dump complete
--

