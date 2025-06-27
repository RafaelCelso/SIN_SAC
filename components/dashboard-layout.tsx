"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ChatSidebar } from "@/components/chat-sidebar"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [chatExpanded, setChatExpanded] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showMobileChat, setShowMobileChat] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    } else {
      setSidebarOpen(true)
    }
  }, [isMobile])

  const toggleChat = () => {
    setChatExpanded(!chatExpanded)
  }

  // Função para abrir o chat no mobile
  const openMobileChat = () => setShowMobileChat(true)
  const closeMobileChat = () => setShowMobileChat(false)

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
        style={{
          marginRight: !isMobile ? (chatExpanded ? 320 : 64) : 0,
        }}
      >
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4">{children}</div>
        </main>
      </div>

      {/* Chat Sidebar - apenas desktop/tablet */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-40 transform transition-all duration-300 ease-in-out bg-[#F1F5F9] border-l border-gray-200 hidden md:block",
          chatExpanded ? "w-80 translate-x-0" : "w-16 translate-x-0"
        )}
      >
        <ChatSidebar expanded={chatExpanded} onToggle={toggleChat} />
      </div>

      {/* Chat Sidebar Mobile - modal/drawer */}
      {isMobile && showMobileChat && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end">
          <div className="w-80 h-full bg-[#F1F5F9] border-l border-gray-200">
            <ChatSidebar expanded={true} onToggle={closeMobileChat} />
          </div>
        </div>
      )}

      {/* Overlay para fechar o sidebar em dispositivos móveis */}
      {sidebarOpen && isMobile && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

