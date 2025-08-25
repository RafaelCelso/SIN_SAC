"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      if (isMobile) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
  }, [isMobile, isClient])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar principal - apenas desktop/tablet */}
      <div
        className={cn(
          "hidden md:block fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar />
      </div>

      {/* Conteúdo principal */}
      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden transition-all duration-300",
          sidebarOpen ? "md:ml-0" : "ml-0",
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4">{children}</div>
        </main>
      </div>



      {/* Overlay para fechar o sidebar em dispositivos móveis */}
      {sidebarOpen && isMobile && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

