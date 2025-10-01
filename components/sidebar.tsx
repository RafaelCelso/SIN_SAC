"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import {
  Home,
  Users,
  Settings,
  HeadphonesIcon,
  ShieldCheck,
  FileText,
  BarChart3,
  KeyRound,
  ChevronDown,
  Calendar,
  HelpCircle,
  Pill,
  ChevronLeft,
  Menu,
  LayoutDashboard,
  Search,
  UserPlus,
  ClipboardList,
  BookOpen,
  FileEdit,
  Clipboard,
  PhoneCall,
  Package2,
  Tag,
  DollarSign,
  AlertTriangle,
  Syringe,
  MonitorCog,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { usePathname } from "next/navigation"
import { IniciarAtendimentoModal } from "@/components/iniciar-atendimento-modal"

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  href: string
  active?: boolean
  hasSubmenu?: boolean
  badge?: number
  onClick?: () => void
}

function SidebarItem({ icon, label, href, active, hasSubmenu, badge, onClick }: SidebarItemProps) {
  return (
    <Link href={href} className="w-full" onClick={onClick}>
      <Button
        variant="ghost"
        className={cn("w-full justify-start gap-2 font-normal", active && "bg-[#26B99D] text-white")}
      >
        {icon}
        <span className="sidebar-label">{label}</span>
        {hasSubmenu && <ChevronDown className="ml-auto h-4 w-4 sidebar-icon" />}
        {badge && (
          <Badge className="ml-auto sidebar-badge" variant="secondary">
            {badge}
          </Badge>
        )}
      </Button>
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    atendimentos: pathname.includes("/atendimentos") || pathname.includes("/protocolos"),
    clientes: pathname.includes("/clientes"),
    preferencias: pathname.includes("/preferencias"),
    seguranca: pathname.includes("/seguranca"),
  })
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showAtendimentoModal, setShowAtendimentoModal] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setCollapsed(false)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Atualizar o estado quando o pathname mudar
  useEffect(() => {
    setOpenMenus((prev) => ({
      ...prev,
      atendimentos: pathname.includes("/atendimentos") || pathname.includes("/protocolos"),
      clientes: pathname.includes("/clientes"),
      preferencias: pathname.includes("/preferencias"),
      seguranca: pathname.includes("/seguranca"),
    }))
  }, [pathname])

  const toggleMenu = (menu: string, e: React.MouseEvent) => {
    e.preventDefault() // Prevenir navegação ao clicar no trigger
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-white dark:bg-gray-950 h-full transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-4 border-b flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-atendi.png" alt="SIN SAC" width={40} height={40} />
          {!collapsed && <span className="text-xl font-bold">SIN SAC</span>}
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
          {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {/* 1. Home */}
        <SidebarItem icon={<Home size={20} />} label="Home" href="/" active={pathname === "/"} />

        {/* 2. Dashboard */}
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          href="/dashboard"
          active={pathname === "/dashboard"}
        />

        {/* 3. Clientes */}
        <div className="w-full">
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2 font-normal", openMenus.clientes && "bg-[#26B99D] text-white")}
            onClick={(e) => toggleMenu("clientes", e)}
          >
            <Users size={20} />
            {!collapsed && <span>Clientes</span>}
            {!collapsed && (
              <ChevronDown
                className={cn("ml-auto h-4 w-4 transition-transform duration-200", openMenus.clientes && "rotate-180")}
              />
            )}
          </Button>
          <div className={cn("space-y-1 pt-1", collapsed ? "pl-0" : "pl-8", !openMenus.clientes && "hidden")}>
            <SidebarItem
              icon={<Search size={16} />}
              label="Buscar Clientes"
              href="/clientes"
              active={pathname === "/clientes"}
            />
            <SidebarItem
              icon={<UserPlus size={16} />}
              label="Novo Cliente"
              href="/clientes/novo"
              active={pathname === "/clientes/novo"}
            />
          </div>
        </div>

        {/* 4. Atendimentos */}
        <div className="w-full">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 font-normal",
              openMenus.atendimentos && "bg-[#26B99D] text-white",
            )}
            onClick={(e) => toggleMenu("atendimentos", e)}
          >
            <HeadphonesIcon size={20} />
            {!collapsed && <span>Atendimentos</span>}
            {!collapsed && (
              <ChevronDown
                className={cn(
                  "ml-auto h-4 w-4 transition-transform duration-200",
                  openMenus.atendimentos && "rotate-180",
                )}
              />
            )}
          </Button>
          <div className={cn("space-y-1 pt-1", collapsed ? "pl-0" : "pl-8", !openMenus.atendimentos && "hidden")}>
            <SidebarItem
              icon={<Clipboard size={16} />}
              label="Protocolos"
              href="/protocolos"
              active={pathname.includes("/protocolos")}
            />
            <SidebarItem
              icon={<ClipboardList size={16} />}
              label="Queixas Técnicas"
              href="/atendimentos/queixas"
              active={pathname.includes("/atendimentos/queixas")}
            />
            <SidebarItem
              icon={<Pill size={16} />}
              label="Farmacovigilância"
              href="/atendimentos/farmacovigilancia"
              active={pathname.includes("/atendimentos/farmacovigilancia")}
            />
            <SidebarItem
              icon={<DollarSign size={16} />}
              label="Ressarcimento"
              href="/atendimentos/ressarcimento"
              active={pathname.includes("/atendimentos/ressarcimento")}
            />
            <SidebarItem
              icon={<Image src="/gestacao.png" alt="Gestação" width={20} height={20} />}
              label="Gestação"
              href="/atendimentos/gestacao"
              active={pathname.includes("/atendimentos/gestacao")}
            />
          </div>
        </div>

        {/* 5. Agenda */}
        <SidebarItem
          icon={<Calendar size={20} />}
          label="Agenda"
          href="/agenda"
          active={pathname.includes("/agenda")}
        />

        {/* 6. FAQ */}
        <SidebarItem icon={<BookOpen size={20} />} label="FAQ" href="/faq" active={pathname.includes("/faq")} />

        {/* 7. Relatórios */}
        <SidebarItem
          icon={<BarChart3 size={20} />}
          label="Relatórios"
          href="/relatorios"
          active={pathname.includes("/relatorios")}
        />

        {/* 8. Preferências */}
        <div className="w-full">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 font-normal",
              openMenus.preferencias && "bg-[#26B99D] text-white",
            )}
            onClick={(e) => toggleMenu("preferencias", e)}
          >
            <Settings size={20} />
            {!collapsed && <span>Preferências</span>}
            {!collapsed && (
              <ChevronDown
                className={cn(
                  "ml-auto h-4 w-4 transition-transform duration-200",
                  openMenus.preferencias && "rotate-180",
                )}
              />
            )}
          </Button>
          <div className={cn("space-y-1 pt-1", collapsed ? "pl-0" : "pl-8", !openMenus.preferencias && "hidden")}>
            <SidebarItem
              icon={<Pill size={16} />}
              label="Produtos"
              href="/produtos"
              active={pathname.includes("/produtos")}
            />
            <SidebarItem
              icon={<ClipboardList size={16} />}
              label="Motivos"
              href="/motivos"
              active={pathname.includes("/motivos")}
            />
            <SidebarItem
              icon={<AlertTriangle size={16} />}
              label="Evento Adverso"
              href="/preferencias/evento-adverso"
              active={pathname.includes("/preferencias/evento-adverso")}
            />
            <SidebarItem
              icon={<Syringe size={16} />}
              label="Via de Administração"
              href="/preferencias/via-administracao"
              active={pathname.includes("/preferencias/via-administracao")}
            />
            <SidebarItem
              icon={<FileEdit size={16} />}
              label="Formulários"
              href="/preferencias/construtor-formularios"
              active={pathname.includes("/preferencias/construtor-formularios")}
            />
            <SidebarItem
              icon={<MonitorCog size={16} />}
              label="Parametrização"
              href="/preferencias/parametrizacao"
              active={pathname.includes("/preferencias/parametrizacao")}
            />
          </div>
        </div>

        {/* 9. Segurança */}
        <div className="w-full">
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2 font-normal", openMenus.seguranca && "bg-[#26B99D] text-white")}
            onClick={(e) => toggleMenu("seguranca", e)}
          >
            <ShieldCheck size={20} />
            {!collapsed && <span>Segurança</span>}
            {!collapsed && (
              <ChevronDown
                className={cn("ml-auto h-4 w-4 transition-transform duration-200", openMenus.seguranca && "rotate-180")}
              />
            )}
          </Button>
          <div className={cn("space-y-1 pt-1", collapsed ? "pl-0" : "pl-8", !openMenus.seguranca && "hidden")}>
            <SidebarItem
              icon={<FileText size={16} />}
              label="Audit Trail"
              href="/audit-trail"
              active={pathname.includes("/audit-trail")}
            />
            <SidebarItem
              icon={<Users size={16} />}
              label="Usuários"
              href="/usuarios"
              active={pathname.includes("/usuarios")}
            />
            <SidebarItem
              icon={<KeyRound size={16} />}
              label="Permissões"
              href="/seguranca/permissoes"
              active={pathname.includes("/seguranca/permissoes")}
            />
          </div>
        </div>
      </nav>

      {/* Botão de Novo Atendimento */}
      <div className="mt-auto p-2 border-t pt-4 pb-4">
        <Button
          className={cn(
            "w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-6",
            collapsed ? "px-0" : "px-4",
          )}
          onClick={() => setShowAtendimentoModal(true)}
        >
          <PhoneCall size={collapsed ? 24 : 20} className={collapsed ? "" : "mr-2"} />
          {!collapsed && <span className="text-base">Novo Contato</span>}
        </Button>
      </div>

      {/* Modal de Novo Atendimento */}
      <IniciarAtendimentoModal open={showAtendimentoModal} onOpenChange={setShowAtendimentoModal} />

      <style jsx global>{`
      ${
        collapsed
          ? `
        .sidebar-label, 
        .sidebar-icon:not(.lucide-chevron-left):not(.lucide-menu) { 
          display: none; 
        }
        .sidebar-badge {
          position: absolute;
          top: 0;
          right: 0;
          transform: scale(0.7);
        }
      `
          : ""
      }
    `}</style>
    </aside>
  )
}

