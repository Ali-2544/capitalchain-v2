--
-- PostgreSQL database dump
--

\restrict 4kkFkRYkBzVJlq3oFJ26at2yDC6eSUPZcibMO9KUvDBdSizMUKcU2oYDTpZ8FIL

-- Dumped from database version 16.14 (Homebrew)
-- Dumped by pg_dump version 16.14 (Homebrew)

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

ALTER TABLE IF EXISTS ONLY public."Payout" DROP CONSTRAINT IF EXISTS "Payout_pkey";
ALTER TABLE IF EXISTS public."Payout" ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public."Payout_id_seq";
DROP TABLE IF EXISTS public."Payout";
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Payout; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Payout" (
    id integer NOT NULL,
    flag text NOT NULL,
    country text NOT NULL,
    amount text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "accountSize" text DEFAULT ''::text NOT NULL,
    "amountValue" integer DEFAULT 0 NOT NULL,
    method text DEFAULT 'USDT (TRC-20)'::text NOT NULL,
    "traderName" text NOT NULL
);


--
-- Name: Payout_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Payout_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Payout_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Payout_id_seq" OWNED BY public."Payout".id;


--
-- Name: Payout id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payout" ALTER COLUMN id SET DEFAULT nextval('public."Payout_id_seq"'::regclass);


--
-- Data for Name: Payout; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Payout" (id, flag, country, amount, "createdAt", "updatedAt", "accountSize", "amountValue", method, "traderName") FROM stdin;
35	🇮🇳	India	$2,140	2026-06-10 07:41:50.063	2026-06-10 07:49:50.066	$50,000	2140	USDT (TRC-20)	Rashmeet Kaur
36	🇩🇪	Germany	$1,680	2026-06-10 07:35:50.063	2026-06-10 07:49:50.069	$25,000	1680	Bank transfer	Nik Dolja
37	🇦🇪	UAE	$96,316	2026-06-10 07:09:50.063	2026-06-10 07:49:50.071	$200,000	96316	USDT (TRC-20)	A. Rahman
38	🇳🇱	Netherlands	$1,499	2026-06-10 04:49:50.063	2026-06-10 07:49:50.073	$100,000	1499	USDT (TRC-20)	Jasper Hof
39	🇮🇳	India	$1,205	2026-06-10 03:49:50.063	2026-06-10 07:49:50.075	$10,000	1205	USDT (TRC-20)	Shreyas M V
40	🇵🇰	Pakistan	$940	2026-06-10 03:39:50.063	2026-06-10 07:49:50.076	$25,000	940	USDT (TRC-20)	Saim Ahmed
41	🇲🇾	Malaysia	$3,310	2026-06-10 01:49:50.063	2026-06-10 07:49:50.078	$100,000	3310	Bank transfer	Jun Jye Ooi
42	🇵🇰	Pakistan	$80,369	2026-06-10 00:49:50.063	2026-06-10 07:49:50.08	$100,000	80369	USDT (TRC-20)	U. Bin Hannan
43	🇩🇪	Germany	$80,517	2026-06-09 23:49:50.063	2026-06-10 07:49:50.082	$200,000	80517	Bank transfer	B. Schneider
44	🇬🇧	UK	$66,028	2026-06-09 22:49:50.063	2026-06-10 07:49:50.083	$100,000	66028	USDT (TRC-20)	O. Trish
45	🇸🇬	Singapore	$58,940	2026-06-09 21:49:50.063	2026-06-10 07:49:50.084	$100,000	58940	Bank transfer	M. Chen
46	🇵🇰	Pakistan	$3,020	2026-06-09 20:29:50.063	2026-06-10 07:49:50.085	$50,000	3020	USDT (TRC-20)	Shahyan Zahid
47	🇺🇸	USA	$3,589	2026-06-09 19:09:50.063	2026-06-10 07:49:50.086	$200,000	3589	Bank transfer	Emmanuel A.
48	🇹🇷	Turkey	$2,909	2026-06-09 18:09:50.063	2026-06-10 07:49:50.087	$50,000	2909	USDT (TRC-20)	Onur E.
49	🇮🇩	Indonesia	$1,460	2026-06-09 16:49:50.063	2026-06-10 07:49:50.089	$25,000	1460	USDT (TRC-20)	Adi P.
50	🇿🇦	South Africa	$1,310	2026-06-09 15:09:50.063	2026-06-10 07:49:50.09	$50,000	1310	Bank transfer	T. Mokoena
51	🇧🇷	Brazil	$2,210	2026-06-09 13:29:50.063	2026-06-10 07:49:50.091	$50,000	2210	USDT (TRC-20)	Carlos V.
52	🇪🇬	Egypt	$1,870	2026-06-09 11:49:50.063	2026-06-10 07:49:50.092	$25,000	1870	USDT (TRC-20)	Omar F.
53	🇸🇦	Saudi Arabia	$4,305	2026-06-09 10:09:50.063	2026-06-10 07:49:50.093	$200,000	4305	Bank transfer	K. Al Otaibi
54	🇰🇷	South Korea	$2,450	2026-06-09 07:49:50.063	2026-06-10 07:49:50.094	$100,000	2450	USDT (TRC-20)	Yuki T.
\.


--
-- Name: Payout_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Payout_id_seq"', 55, true);


--
-- Name: Payout Payout_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payout"
    ADD CONSTRAINT "Payout_pkey" PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict 4kkFkRYkBzVJlq3oFJ26at2yDC6eSUPZcibMO9KUvDBdSizMUKcU2oYDTpZ8FIL

