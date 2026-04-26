"use client"

import { ReactNode } from "react"
import { Navbar } from "./navbar"
import { Footer } from "./footer"

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main className="relative flex-1">{children}</main>
      <Footer />
    </div>
  )
}
