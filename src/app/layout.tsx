import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Zero Freights — Zero Hassles, Just Freight',
  description:
    'Zero Freights simplifies global logistics. Get instant shipping quotes, reliable freight forwarding, and seamless supply chain support. Zero hassles, just freight.',
  keywords: [
    'freight forwarding',
    'logistics services',
    'global shipping',
    'international freight',
    'shipping quotes',
    'ocean freight',
    'air freight',
    'import export services',
    'Zero Freights',
    'supply chain solutions',
    'door to door shipping',
    'customs clearance'
  ],
  authors: [{ name: 'Amith A G', url: 'https://github.com/Amith-AG' }],
  creator: 'Zero Freights',
  publisher: 'Bloksupplychain Securelog Private Limited India',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://zerofreights.com'),
  openGraph: {
    title: 'Zero Freights — Zero Hassles, Just Freight',
    description:
      'Experience hassle-free freight forwarding and global shipping solutions. From ocean to air — Zero Freights delivers seamless logistics.',
    url: 'https://zerofreights.com',
    siteName: 'Zero Freights',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zero Freights — Zero Hassles, Just Freight',
    description:
      'Get transparent rates and reliable global freight services with Zero Freights. Your logistics partner in seamless shipping.',
    creator: '@zerofreights',
  },
  category: 'Logistics',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
