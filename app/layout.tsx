import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Roboto, Libre_Baskerville, Alex_Brush, Oswald } from "next/font/google"
import SmoothScroll from "@/components/smooth-scroll"
import Preloader from "@/components/preloader"
import "./globals.css"

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
})

const alexBrush = Alex_Brush({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-alex-brush",
  display: "swap",
})

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
  display: "swap",
})

const oswald = Oswald({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Rahul Vadhs - Professional Photographer | withtheflowtographer.com",
  description: "Professional photography portfolio by Rahul Vadhs. Capturing moments through the lens - weddings, portraits, events, and creative photography. Award-winning photographer based in India.",
  keywords: "photography, photographer, Rahul Vadhs, wedding photography, portrait photography, event photography, professional photographer, India photographer, withtheflowtographer",
  authors: [{ name: "Rahul Vadhs" }],
  creator: "Rahul Vadhs",
  publisher: "Rahul Vadhs Photography",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://withtheflowtographer.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Rahul Vadhs - Professional Photographer",
    description: "Professional photography portfolio by Rahul Vadhs. Capturing moments through the lens - weddings, portraits, events,Corporate and creative photography.",
    url: 'https://withtheflowtographer.com',
    siteName: 'withtheflowtographer.com',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rahul Vadhs - Professional Photographer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Rahul Vadhs - Professional Photographer",
    description: "Professional photography portfolio by Rahul Vadhs. Capturing moments through the lens - weddings, portraits, events, and creative photography.",
    images: ['/images/og-image.jpg'],
    creator: '@withtheflowtographer',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/apple-icon.png",
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
<html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Rahul Vadhs",
              "jobTitle": "Professional Photographer",
              "description": "Award-winning professional photographer specializing in weddings, portraits, events, and creative photography",
              "url": "https://withtheflowtographer.com",
              "image": "https://withtheflowtographer.com/images/profile.jpg",
              "sameAs": [
                "https://www.instagram.com/withtheflowtographer/",
                "https://www.twitter.com/withtheflowtographer",
                "https://www.facebook.com/withtheflowtographer"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9769926713",
                "contactType": "customer service",
                "availableLanguage": "English",
                "email": "rahulvadhs@gmail.com"
              },
              "hasOccupation": {
                "@type": "Occupation",
                "name": "Professional Photographer",
                "occupationLocation": {
                  "@type": "Country",
                  "name": "India"
                }
              },
              "knowsAbout": [
                "Photography",
                "Wedding Photography",
                "Portrait Photography",
                "Event Photography",
                "Commercial Photography",
                "Photo Editing",
                "Lightroom",
                "Photoshop"
              ]
            })
          }}
        />
      </head>
      <body
        className={`font-sans antialiased ${roboto.variable} ${libreBaskerville.variable} ${alexBrush.variable} ${oswald.variable} relative`}
      >
        {/* Background Video */}
        <div className="fixed inset-0 z-[-1] overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-100"
          >
            <source src="https://res.cloudinary.com/dbbzsyl8u/video/upload/v1767420310/1664_Final_Showreel_tja4ai.mp4" type="video/mp4" />
          </video>
          
        </div>
        
        <Preloader />
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
      </body>
    </html>
  )
}
