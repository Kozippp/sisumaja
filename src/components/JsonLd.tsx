/**
 * Renderdab JSON-LD structured data <script> märgendi. Server-komponent.
 * AI ja otsingumootorid loevad neid masinloetavaid fakte palju paremini kui
 * reklaamteksti. Kasuta koos abifunktsioonidega failist src/lib/schema.ts.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // andmed on meie enda genereeritud, mitte kasutaja sisend
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
