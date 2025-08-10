--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

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

--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END; $$;


--
-- Name: set_updated_at_addr(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at_addr() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END; $$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: address_verifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.address_verifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    ai_confidence integer,
    created_at timestamp without time zone DEFAULT now(),
    ai_status text DEFAULT 'not_started'::text NOT NULL,
    reviewed_by integer,
    reviewed_at timestamp with time zone,
    decision_reason text,
    country_code character varying(2),
    photo_file_name text,
    photo_content_type text,
    photo_storage_path text,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT address_verifications_ai_status_ck CHECK ((ai_status = ANY (ARRAY['not_started'::text, 'queued'::text, 'completed'::text, 'failed'::text])))
);


--
-- Name: address_verifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.address_verifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: address_verifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.address_verifications_id_seq OWNED BY public.address_verifications.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    verification_request_id integer NOT NULL,
    actor_user_id integer NOT NULL,
    action text NOT NULL,
    metadata text,
    "timestamp" timestamp without time zone DEFAULT now()
);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.documents (
    id integer NOT NULL,
    user_id integer NOT NULL,
    verification_id integer,
    doc_type text NOT NULL,
    filename text NOT NULL,
    content_type text NOT NULL,
    size_bytes integer NOT NULL,
    storage_path text NOT NULL,
    checksum_sha256 text,
    uploaded_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


--
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role text DEFAULT 'user'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    name text DEFAULT ''::text NOT NULL,
    country character varying(50) DEFAULT 'IN'::character varying NOT NULL,
    CONSTRAINT users_role_chk CHECK ((role = ANY (ARRAY['user'::text, 'inspector'::text, 'admin'::text])))
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: verification_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.verification_documents (
    id bigint NOT NULL,
    verification_request_id integer NOT NULL,
    doc_type text,
    file_name text NOT NULL,
    content_type text NOT NULL,
    storage_path text NOT NULL,
    uploaded_by integer,
    uploaded_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: verification_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.verification_documents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: verification_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.verification_documents_id_seq OWNED BY public.verification_documents.id;


--
-- Name: verification_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.verification_requests (
    id integer NOT NULL,
    user_id integer NOT NULL,
    country_code character varying(2) NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    ai_confidence integer,
    ai_is_tampered boolean,
    created_at timestamp without time zone DEFAULT now(),
    ai_status text DEFAULT 'not_started'::text NOT NULL,
    verification_type text DEFAULT 'identity'::text NOT NULL,
    document_type text,
    reviewed_by integer,
    reviewed_at timestamp with time zone,
    decision_reason text,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    file_name text,
    file_content_type text,
    file_storage_path text,
    CONSTRAINT verification_requests_ai_status_ck CHECK ((ai_status = ANY (ARRAY['not_started'::text, 'queued'::text, 'completed'::text, 'failed'::text]))),
    CONSTRAINT verification_requests_country_ck CHECK (((country_code)::text = ANY ((ARRAY['IN'::character varying, 'AU'::character varying, 'GB'::character varying])::text[]))),
    CONSTRAINT verification_requests_verification_type_ck CHECK ((verification_type = ANY (ARRAY['identity'::text, 'address'::text, 'employment'::text, 'business'::text])))
);


--
-- Name: verification_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.verification_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: verification_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.verification_requests_id_seq OWNED BY public.verification_requests.id;


--
-- Name: address_verifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.address_verifications ALTER COLUMN id SET DEFAULT nextval('public.address_verifications_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: verification_documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_documents ALTER COLUMN id SET DEFAULT nextval('public.verification_documents_id_seq'::regclass);


--
-- Name: verification_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_requests ALTER COLUMN id SET DEFAULT nextval('public.verification_requests_id_seq'::regclass);


--
-- Name: address_verifications address_verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.address_verifications
    ADD CONSTRAINT address_verifications_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: verification_documents verification_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_documents
    ADD CONSTRAINT verification_documents_pkey PRIMARY KEY (id);


--
-- Name: verification_requests verification_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_requests
    ADD CONSTRAINT verification_requests_pkey PRIMARY KEY (id);


--
-- Name: idx_documents_doc_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_documents_doc_type ON public.documents USING btree (doc_type);


--
-- Name: idx_documents_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_documents_user ON public.documents USING btree (user_id);


--
-- Name: idx_documents_verification; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_documents_verification ON public.documents USING btree (verification_id);


--
-- Name: idx_ver_req_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ver_req_created ON public.verification_requests USING btree (created_at);


--
-- Name: idx_ver_req_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ver_req_status ON public.verification_requests USING btree (status);


--
-- Name: idx_ver_req_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ver_req_user_id ON public.verification_requests USING btree (user_id);


--
-- Name: idx_verif_docs_request_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_verif_docs_request_id ON public.verification_documents USING btree (verification_request_id);


--
-- Name: address_verifications trg_address_verifications_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_address_verifications_set_updated_at BEFORE UPDATE ON public.address_verifications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_addr();


--
-- Name: verification_requests trg_verification_requests_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_verification_requests_set_updated_at BEFORE UPDATE ON public.verification_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: address_verifications address_verifications_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.address_verifications
    ADD CONSTRAINT address_verifications_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(id);


--
-- Name: address_verifications address_verifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.address_verifications
    ADD CONSTRAINT address_verifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: audit_logs audit_logs_actor_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_actor_user_id_fkey FOREIGN KEY (actor_user_id) REFERENCES public.users(id);


--
-- Name: audit_logs audit_logs_verification_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_verification_request_id_fkey FOREIGN KEY (verification_request_id) REFERENCES public.verification_requests(id);


--
-- Name: documents documents_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: documents documents_verification_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_verification_id_fkey FOREIGN KEY (verification_id) REFERENCES public.verification_requests(id) ON DELETE CASCADE;


--
-- Name: verification_documents verification_documents_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_documents
    ADD CONSTRAINT verification_documents_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id);


--
-- Name: verification_documents verification_documents_verification_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_documents
    ADD CONSTRAINT verification_documents_verification_request_id_fkey FOREIGN KEY (verification_request_id) REFERENCES public.verification_requests(id) ON DELETE CASCADE;


--
-- Name: verification_requests verification_requests_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_requests
    ADD CONSTRAINT verification_requests_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(id);


--
-- Name: verification_requests verification_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_requests
    ADD CONSTRAINT verification_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

