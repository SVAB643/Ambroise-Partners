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
          borderRadius: 36,
        }}
      >
        <span
          style={{
            fontFamily: 'Georgia, serif',
            fontWeight: 500,
            fontSize: 90,
            color: '#1A1A1A',
            letterSpacing: -1,
          }}
        >
          AP
        </span>
      </div>
    ),
    { ...size }
  );
}
