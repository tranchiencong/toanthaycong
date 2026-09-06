import { ImageResponse } from 'next/og'

export const alt = 'Toán Thầy Công - Học Toán Từ Bản Chất'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#0F172A',
          padding: '80px',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#3B82F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#ffffff',
            }}
          >
            ∑
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '28px', fontWeight: 'bold' }}>
              Toán Thầy Công
            </span>
            <span style={{ fontSize: '14px', color: '#94A3B8', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              toanthaycong.com
            </span>
          </div>
        </div>

        {/* Center Main Typography */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1000px' }}>
          <div
            style={{
              fontSize: '64px',
              fontWeight: 900,
              lineHeight: 1.15,
              color: '#FFFFFF',
            }}
          >
            Học Toán Từ Bản Chất
            <br />
            Chinh Phục Điểm 9+
          </div>
          <div style={{ fontSize: '24px', color: '#94A3B8', lineHeight: 1.4 }}>
            Nền tảng học Toán THCS & THPT trực tuyến cùng Thầy Trần Chiến Công. Lộ trình bài bản bám sát cấu trúc đề thi.
          </div>
        </div>

        {/* Bottom Badges */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {['Toán THCS', 'Toán THPT', 'Luyện Thi Vào 10', 'Luyện Thi THPT QG'].map((badge) => (
            <div
              key={badge}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '16px',
                fontWeight: 600,
                color: '#E2E8F0',
              }}
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
