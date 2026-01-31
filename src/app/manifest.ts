import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ZeroFreights',
    short_name: 'ZeroFreights',
    description:
      'ZeroFreights is a modern freight forwarding platform providing the best shipping quotations, seamless comparison of cargo options, and efficient end-to-end logistics solutions for global businesses.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
