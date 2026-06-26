import { ImageResponse } from 'next/og';

// Dünaamiline sotsiaalmeedia eelvaatepilt (og:image + twitter:image).
// Next.js seab selle automaatselt kõikidele lehtedele, kus pole oma pilti.
export const alt = 'Kozip — sinu brändi sotsiaalmeedia partner';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 50% 40%, #2a0a2a 0%, #0a0a0a 70%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 160,
            fontWeight: 800,
            letterSpacing: '-0.04em',
            backgroundImage: 'linear-gradient(90deg, #ff2bd6, #a855f7)',
            backgroundClip: 'text',
            color: 'transparent',
            display: 'flex',
          }}
        >
          KOZIP
        </div>
        <div style={{ fontSize: 40, color: '#d4d4d4', marginTop: 8, display: 'flex' }}>
          Sinu brändi sotsiaalmeedia partner
        </div>
        <div style={{ fontSize: 26, color: '#8a8a8a', marginTop: 28, display: 'flex' }}>
          YouTube · lühivideod · brändikoostöö
        </div>
      </div>
    ),
    { ...size },
  );
}
