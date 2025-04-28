"use client"

import { Menu, Bell, Sun, Moon, Search, Globe, ChevronDown, User, LogOut, MessageSquare, Plus, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/sidebar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { useState } from "react"

// Traduções para os diferentes idiomas
const translations = {
  pt: {
    search: "Pesquisar...",
    notifications: "Notificações",
    viewAll: "Ver todas as notificações",
    newComplaint: "Nova queixa técnica registrada",
    complaintWaiting: "Queixa técnica foi registrada e aguarda análise.",
    minutes: "minutos",
    account: "Minha Conta",
    profile: "Perfil",
    viewProfile: "Visualizar Perfil",
    settings: "Configurações",
    support: "Suporte",
    logout: "Sair",
    adminGroup: "ADMINISTRADOR",
    youBelongTo: "Você pertence ao grupo",
  },
  en: {
    search: "Search...",
    notifications: "Notifications",
    viewAll: "View all notifications",
    newComplaint: "New technical complaint registered",
    complaintWaiting: "Technical complaint was registered and awaits analysis.",
    minutes: "minutes",
    account: "My Account",
    profile: "Profile",
    viewProfile: "View Profile",
    settings: "Settings",
    support: "Support",
    logout: "Logout",
    adminGroup: "ADMINISTRATOR",
    youBelongTo: "You belong to the group",
  },
  es: {
    search: "Buscar...",
    notifications: "Notificaciones",
    viewAll: "Ver todas las notificaciones",
    newComplaint: "Nueva queja técnica registrada",
    complaintWaiting: "La queja técnica fue registrada y espera análisis.",
    minutes: "minutos",
    account: "Mi Cuenta",
    profile: "Perfil",
    viewProfile: "Ver Perfil",
    settings: "Configuraciones",
    support: "Soporte",
    logout: "Salir",
    adminGroup: "ADMINISTRADOR",
    youBelongTo: "Perteneces al grupo",
  },
}

export function Header() {
  const { setTheme, theme } = useTheme()
  const [language, setLanguage] = useState<"pt" | "en" | "es">("pt")
  const t = translations[language]

  // Controle manual do Drawer/Sheet do menu lateral
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Funções para as ações do menu
  const handleNovaConversa = () => {
    // TODO: abrir modal de nova conversa
    alert('Abrir modal de nova conversa')
  }
  const handleVerTodas = () => {
    // TODO: redirecionar para tela de conversas
    alert('Ver todas as conversas')
  }

  return (
    <header className="border-b bg-white dark:bg-gray-950 sticky top-0 z-10">
      <div className="flex h-16 items-center px-4 gap-4">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative max-w-sm items-center">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t.search}
                className="pl-8 w-[200px] lg:w-[300px] rounded-full bg-muted border-none focus-visible:ring-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">Change language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("pt")} className="cursor-pointer">
                  <span className={`mr-2 ${language === "pt" ? "font-bold" : ""}`}>🇧🇷</span> Português
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("en")} className="cursor-pointer">
                  <span className={`mr-2 ${language === "en" ? "font-bold" : ""}`}>🇺🇸</span> English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("es")} className="cursor-pointer">
                  <span className={`mr-2 ${language === "es" ? "font-bold" : ""}`}>🇪🇸</span> Español
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Ícone de notificação (sino) com badge */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">3</Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>{t.notifications}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-auto">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <DropdownMenuItem key={i} className="cursor-pointer p-4">
                      <div className="flex items-start gap-2">
                        <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                          <Bell className="h-4 w-4" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{t.newComplaint}</p>
                          <p className="text-xs text-muted-foreground">{t.complaintWaiting}</p>
                          <p className="text-xs text-muted-foreground">
                            {t.minutes} {10 + i * 5}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer justify-center">
                  <Button variant="ghost" size="sm" className="w-full">
                    {t.viewAll}
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dropdown de chat apenas no mobile, à direita do globo e do sino */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="block md:hidden text-muted-foreground"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span className="sr-only">Abrir chat</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleNovaConversa}>
                  <Plus className="h-4 w-4 mr-2" /> Nova conversa
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleVerTodas}>
                  <List className="h-4 w-4 mr-2" /> Ver todas as conversas
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1">
                  <span>{t.profile}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  {t.viewProfile}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  {t.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

