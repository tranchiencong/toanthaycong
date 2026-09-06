import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://toanthaycong.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/admin/',
        '/teacher',
        '/teacher/',
        '/dashboard',
        '/dashboard/',
        '/learn',
        '/learn/',
        '/api',
        '/api/',
        '/auth',
        '/auth/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
