import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          borderRadius: 40,
        }}
      >
        <span
          style={{
            fontFamily: 'serif',
            fontWeight: 500,
            fontSize: 110,
            color: '#1A1A1A',
            letterSpacing: '-0.02em',
            marginTop: -4,
          }}
        >
          AP
        </span>
      </div>
    ),
    { ...size }
  );
}
