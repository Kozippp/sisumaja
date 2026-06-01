-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Proposal clients
CREATE TABLE IF NOT EXISTS public.proposal_clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  billing_name TEXT,
  billing_registry_code TEXT,
  billing_vat_number TEXT,
  billing_address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Service catalog (Kozip default services)
CREATE TABLE IF NOT EXISTS public.service_catalog (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('youtube', 'short_video', 'instagram', 'event', 'custom')),
  title TEXT NOT NULL,
  short_description TEXT,
  long_description TEXT,
  default_price_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'EUR',
  unit_label TEXT NOT NULL DEFAULT 'video',
  deliverables JSONB DEFAULT '[]',
  default_min_quantity INTEGER DEFAULT 1,
  default_max_quantity INTEGER DEFAULT 12,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Proposals
CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES public.proposal_clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  intro_text TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'opened', 'accepted', 'invoice_requested', 'payment_pending', 'paid', 'expired', 'revoked')),
  access_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  first_opened_at TIMESTAMPTZ,
  last_opened_at TIMESTAMPTZ,
  currency TEXT NOT NULL DEFAULT 'EUR',
  vat_mode TEXT NOT NULL DEFAULT 'excludes_vat' CHECK (vat_mode IN ('includes_vat', 'excludes_vat', 'no_vat')),
  vat_rate DECIMAL(5,2) DEFAULT 22.00,
  guarantee_text TEXT,
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Proposal items (services shown to client)
CREATE TABLE IF NOT EXISTS public.proposal_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE NOT NULL,
  service_catalog_id UUID REFERENCES public.service_catalog(id),
  category TEXT NOT NULL CHECK (category IN ('youtube', 'short_video', 'instagram', 'event', 'custom')),
  title TEXT NOT NULL,
  description TEXT,
  deliverables JSONB DEFAULT '[]',
  base_price_cents INTEGER NOT NULL DEFAULT 0,
  offered_price_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'EUR',
  unit_label TEXT NOT NULL DEFAULT 'video',
  billing_interval TEXT NOT NULL DEFAULT 'one_time' CHECK (billing_interval IN ('one_time', 'monthly')),
  min_quantity INTEGER DEFAULT 1,
  max_quantity INTEGER DEFAULT 12,
  default_quantity INTEGER DEFAULT 1,
  is_enabled BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Proposal discount rules
CREATE TABLE IF NOT EXISTS public.proposal_discount_rules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('quantity', 'bundle', 'commitment', 'manual')),
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  config JSONB DEFAULT '{}',
  min_quantity INTEGER,
  applicable_categories TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Proposal submissions (invoice requests, custom offers, call requests)
CREATE TABLE IF NOT EXISTS public.proposal_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('invoice_request', 'custom_offer', 'call_request')),
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  company_name TEXT,
  message TEXT,
  selected_items_snapshot JSONB DEFAULT '[]',
  totals_snapshot JSONB DEFAULT '{}',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS
ALTER TABLE public.proposal_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_discount_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_submissions ENABLE ROW LEVEL SECURITY;

-- Authenticated users manage all proposal tables
CREATE POLICY "Auth users manage proposal_clients"
  ON public.proposal_clients FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users manage service_catalog"
  ON public.service_catalog FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users manage proposals"
  ON public.proposals FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users manage proposal_items"
  ON public.proposal_items FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users manage proposal_discount_rules"
  ON public.proposal_discount_rules FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users manage proposal_submissions"
  ON public.proposal_submissions FOR ALL USING (auth.role() = 'authenticated');

-- Seed default service catalog
INSERT INTO public.service_catalog (code, category, title, short_description, long_description, default_price_cents, unit_label, deliverables, default_min_quantity, default_max_quantity, display_order) VALUES
(
  'youtube_integration',
  'youtube',
  'YouTube brändiintegratsioon',
  'Orgaaniline brändi tutvustus pikemas YouTube videos',
  'Kozipi YouTube video integreerib su brändi loomuliku osana sisu sisse. Vaatajad jätavad vaid 1–5% videost vahele – reklaamisegmendi lõpuni vaatamise tõenäosus on 95–99%. Keskmine video kogub ~60 000 vaatamist.',
  175000,
  'video',
  '["Brändi mainimine videos (orgaaniline, Kozipi sõnadega)", "Lingi lisamine kirjeldusse", "Sotsiaalmeedia jagamine", "Kliendi kinnitamine enne postitamist"]',
  1, 6, 1
),
(
  'short_video',
  'short_video',
  'Lühivideo koostöö',
  '45–120 sek reklaamvideo 5 platvormile korraga',
  'Kozipi stiilis lühivideo, mis postitatakse TikToki, Instagrami, YouTube Shortsi, Facebooki ja Snapchati. Üks video – maksimaalne levik. Keskmine reach ~100 000 vaatamist video kohta.',
  90000,
  'video',
  '["Video TikTokis", "Video Instagramis (Reels)", "Video YouTube Shortsides", "Video Facebookis", "Video Snapchatis", "Kozipi energiaga stiilitud sisu"]',
  1, 12, 2
),
(
  'event_mc',
  'event',
  'Õhtujuhtimine',
  'Elav ja kaasahaarav õhtujuhtimine su üritusele',
  'Mihkel juhib su üritust professionaalse ja elava õhtujuhina. Sobib firmapeodele, konverentsidele ja muudele üritustele. Transport Tallinna/Tartu piirkonnas kaasas.',
  150000,
  'esinemine',
  '["Eelnev tutvumine kava ja brändiga", "Professionaalne õhtujuhtimine", "Interaktsioon publikuga", "Transport Tallinna/Tartu piirkonnas kaasas"]',
  1, 1, 3
),
(
  'training',
  'event',
  'Koolitus / esinemine',
  'Sisuloome, ettevõtluse või sotsiaalmeedia teemaline koolitus',
  'Mihkli 4+ aasta kogemus sisuloojana – sisuloome strateegia, sotsiaalmeedia turundus, YouTube algoritm, ettevõtlus. Kohandatud koolitus su meeskonnale.',
  200000,
  'koolitus',
  '["Kohandatud koolitusprogram", "Q&A sessioon", "Materjalid (slaidid)", "Järelkonsultatsioon e-posti teel"]',
  1, 1, 4
)
ON CONFLICT (code) DO NOTHING;
