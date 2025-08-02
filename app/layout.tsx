import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'SearchSocial - Discover Top Influencers',
  description: 'Find and connect with verified influencers across all major social media platforms. Search by niche, location, engagement rate, and more.',
  keywords: 'influencer marketing, social media influencers, brand collaboration, influencer discovery',
  authors: [{ name: 'SearchSocial Team' }],
  generator: 'Next.js',
  openGraph: {
    title: 'SearchSocial - Discover Top Influencers',
    description: 'Find and connect with verified influencers across all major social media platforms.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SearchSocial - Discover Top Influencers',
    description: 'Find and connect with verified influencers across all major social media platforms.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
