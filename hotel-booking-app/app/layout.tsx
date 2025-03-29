import type React from "react"
import { Inter } from "next/font/google"

import { AuthProvider } from "../components/auth-provider"

import './globals.css';

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <main className="flex-1">{children}</main>
            </div>
          </AuthProvider>
      </body>
    </html>
  )
}
