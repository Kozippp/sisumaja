import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type ProjectType = 'youtube_ad' | 'shorts' | 'training';

const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  youtube_ad: 'YouTube reklaam (pikk video, tavaliselt mitu reklaamsegmenti)',
  shorts: 'Lühivideo koostöö (TikTok/Reels/Shorts, tavaliselt üks plokk)',
  training: 'Koolitus / Üritus (esinemine, workshop vms)',
};

// JSON schema for structured output — matches ProjectForm fields
const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      description: 'Projekti pealkiri, nt "Lightyear" või "Kikkoman - rebitud liha burger"',
    },
    slug: {
      type: 'string',
      description: 'URL-slug: ainult väiketähed a-z, numbrid, alakriipsud. Nt "lightyear" või "kikkoman_burger"',
    },
    description: {
      type: 'string',
      description: 'SEO lühikirjeldus (1-2 lauset), nähtav Google otsingus ja tööde nimekirjas',
    },
    content: {
      type: 'array',
      description: 'Sisuplokid, mis kuvatakse projekti detailvaates',
      items: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['text', 'video', 'image', 'carousel'],
            description: 'Ploki tüüp. "video" kui plokiga käib kaasas video, "text" kui ainult tekst',
          },
          layout: {
            type: 'string',
            enum: ['left', 'right'],
            description: 'Meedia paigutus desktopil. Vaheldu plokkide vahel (left, right, left...)',
          },
          title: {
            type: 'string',
            description: 'Ploki pealkiri SUURTE TÄHTEDEGA, nt "KAMPAANIA TUTVUSTUS" või "1. REKLAAMSEGMENT: TUTVUSTUS"',
          },
          content: {
            type: 'string',
            description: 'Ploki tekst. Reklaamsegmendi puhul alusta reaga "Ajavahemik: MM:SS–MM:SS" kui kasutaja andis ajavahemikud',
          },
          mediaUrl: {
            type: 'string',
            description: 'Video URL (YouTube, TikTok või Instagram Reeli link; YouTube link võib sisaldada ?t= ajatemplit). Tühi string kui kasutaja linki ei andnud',
          },
        },
        required: ['type', 'layout', 'title', 'content', 'mediaUrl'],
        additionalProperties: false,
      },
    },
    links: {
      type: 'array',
      description: 'Sotsiaalmeedia lingid lehe lõppu. Ainult kui kasutaja andis lingid. Muidu tühi massiiv',
      items: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['youtube', 'instagram', 'tiktok', 'other'],
          },
          label: {
            type: 'string',
            description: 'Nupu tekst, nt "Vaata videot YouTube\'is"',
          },
          url: { type: 'string' },
        },
        required: ['type', 'label', 'url'],
        additionalProperties: false,
      },
    },
  },
  required: ['title', 'slug', 'description', 'content', 'links'],
  additionalProperties: false,
} as const;

const SYSTEM_PROMPT = `Sa oled Kozipi (Eesti sisuloojad, kes müüvad brändireklaame oma YouTube'i videotes, lühivideotes ja koolitustel) veebilehe sisukirjutaja.

SINU ÜLESANNE: kasutaja kirjeldab vabas vormis uut tehtud tööd (brändikoostööd) ja sina kirjutad selle põhjal valmis "Tehtud töö" lehe sisu, mis läheb otse veebilehele.

LEHE EESMÄRK: tehtud tööde leht on müügitööriist TURUNDAJATELE. Nad peavad kiirelt mõistma:
1. MIDA reklaamiti (bränd, toode, teenus)
2. KUIDAS seda reklaamiti (kuidas reklaam oli orgaaniliselt sisusse integreeritud, mitu segmenti, mis lähenemine)
3. MIKS see oli tõhus (miks selline integratsioon töötab, kuidas see ehitab usaldust ja bränditeadlikkust)

STIILIREEGLID:
- Kirjuta eesti keeles, "meie"-vormis (nt "Reklaamisime...", "Lõime...", "Tahtsime...")
- Kirjuta samas stiilis ja struktuuris nagu kaasasolevad NÄITED — need on meie varasemad tehtud tööd
- Ole konkreetne ja professionaalne, aga mitte kuiv. Turundaja peab lugedes mõtlema "tahan ka sellist koostööd"
- Ploki pealkirjad kirjuta SUURTE TÄHTEDEGA (nt "KAMPAANIA TUTVUSTUS", "1. REKLAAMSEGMENT: TUTVUSTUS")

STRUKTUURIREEGLID tüübi järgi:
- YouTube reklaam: esimene plokk on tekstiplokk "KAMPAANIA TUTVUSTUS" (mis video, mis bränd, mis oli eesmärk), seejärel iga reklaamsegmendi kohta eraldi video-plokk pealkirjaga "N. REKLAAMSEGMENT: ..." mille sisu algab reaga "Ajavahemik: MM:SS–MM:SS" (kui kasutaja andis ajad) ja selgitab, kuidas ja miks see segment töötas. Vaheldu layout väärtustega left/right.
- Lühivideo: tavaliselt ÜKS video-plokk pealkirjaga "KOOSTÖÖ TUTVUSTUS", mis kirjeldab mida ja kuidas reklaamiti ning mis oli eesmärk.
- Koolitus: üks-kaks plokki, mis kirjeldavad mida esitleti, kellele ja mis kasu osalejad said.
- Kui kasutaja ütleb täpselt, mitu plokki ja mida ta tahab — järgi TÄPSELT kasutaja soove, need on ülimuslikud.

RANGED PIIRANGUD:
- ÄRA mõtle välja statistikat, numbreid ega tulemusi, mida kasutaja ei andnud
- ÄRA mõtle välja video URL-e ega ajavahemikke — kasuta ainult neid, mis kasutaja andis. Kui linki pole, jäta mediaUrl tühjaks
- ÄRA kirjuta kliendi tsitaate ega tagasisidet
- Slug: ainult väiketähed, numbrid ja alakriipsud`;

export async function POST(req: NextRequest) {
  try {
    // Verify admin session (Supabase auth token from the client)
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    const token = authHeader.slice('Bearer '.length);
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !userData?.user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const prompt: string = body.prompt;
    const projectType: ProjectType = body.projectType;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ error: 'prompt_required' }, { status: 400 });
    }
    if (!['youtube_ad', 'shorts', 'training'].includes(projectType)) {
      return NextResponse.json({ error: 'invalid_project_type' }, { status: 400 });
    }

    // Fetch existing visible projects of the same type as style examples
    const { data: examples } = await supabase
      .from('projects')
      .select('title, description, content')
      .eq('is_visible', true)
      .eq('project_type', projectType)
      .order('created_at', { ascending: false })
      .limit(6);

    const examplesText = (examples || [])
      .filter((p) => Array.isArray(p.content) && (p.content as unknown[]).length > 0)
      .map((p, i) => {
        const blocks = (p.content as { type?: string; title?: string; content?: string }[])
          .map(
            (b) =>
              `  Plokk (${b.type}): "${b.title || ''}"\n  ${String(b.content || '').replace(/\n/g, '\n  ')}`
          )
          .join('\n\n');
        return `NÄIDE ${i + 1}:\nPealkiri: ${p.title}\nSEO kirjeldus: ${p.description || ''}\nSisuplokid:\n${blocks}`;
      })
      .join('\n\n---\n\n');

    const userMessage = `TÖÖ TÜÜP: ${PROJECT_TYPE_LABELS[projectType]}

MEIE VARASEMAD SAMA TÜÜPI TEHTUD TÖÖD (kirjuta samas stiilis):

${examplesText || '(Näiteid pole — kirjuta stiilireeglite järgi.)'}

---

KASUTAJA KIRJELDUS UUE TEHTUD TÖÖ KOHTA:

${prompt.trim()}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-5.6-terra',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'project_draft',
          strict: true,
          schema: OUTPUT_SCHEMA as unknown as Record<string, unknown>,
        },
      },
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return NextResponse.json({ error: 'empty_response' }, { status: 500 });
    }

    const draft = JSON.parse(raw);

    // Sanitize slug server-side just in case
    if (typeof draft.slug === 'string') {
      draft.slug = draft.slug
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '_')
        .replace(/^_+|_+$/g, '');
    }

    return NextResponse.json({ success: true, draft });
  } catch (error) {
    console.error('Generate project API error:', error);
    return NextResponse.json(
      {
        error: 'generation_failed',
        message: error instanceof Error ? error.message : 'Generation failed',
      },
      { status: 500 }
    );
  }
}
