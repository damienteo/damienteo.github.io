'use client'

import './globals.css'

import React, { useState } from 'react'
// import Script from 'next/script'

import NavBar from '../components/layout/Navbar'
import { ButtonLink } from '../components/common'
import { navLinks } from '../constants'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isDrawerOpen, setDrawerOpen] = useState(false)

  return (
    <html lang="en">
      <body>
        {/* Navbar */}
        <NavBar setDrawerOpen={() => setDrawerOpen(!isDrawerOpen)} />

        {/* Main Content */}
        <div className="container mx-auto max-w-screen-lg py-8 px-4 md:px-0">
          {children}
        </div>

        {/* Mobile Drawer */}
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-blue-50 p-4 rounded-lg shadow-lg text-gray-900">
              {navLinks.map(({ url, text }) => (
                <ButtonLink key={url} url={url} text={text} />
              ))}
            </div>
          </div>
        )}

        {/* Global Site Tag (gtag.js) - Google Analytics */}
        {/* 
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        /> 
        */}
      </body>
    </html>
  )
}
