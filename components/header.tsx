"use client"

import { Menu, Bell, Sun, Moon, Search, Globe, ChevronDown, User, LogOut, MessageSquare, Plus, List, X, CheckCheck, Trash2, AlertTriangle, Info, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/sidebar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    pending: "Pendências",
    viewAll: "Ver todas as notificações",
    markAllRead: "Marcar todas como lidas",
    clearAll: "Limpar todas",
    newComplaint: "Nova queixa técnica registrada",
    complaintWaiting: "Queixa técnica foi registrada e aguarda análise.",
    pendingTask: "Tarefa pendente de análise",
    pendingReview: "Aguardando revisão do supervisor",
    systemAlert: "Alerta do sistema",
    appointmentReminder: "Lembrete de agendamento",
    documentUpdate: "Documento atualizado",
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
    pending: "Pending",
    viewAll: "View all notifications",
    markAllRead: "Mark all as read",
    clearAll: "Clear all",
    newComplaint: "New technical complaint registered",
    complaintWaiting: "Technical complaint was registered and awaits analysis.",
    pendingTask: "Pending task for analysis",
    pendingReview: "Awaiting supervisor review",
    systemAlert: "System alert",
    appointmentReminder: "Appointment reminder",
    documentUpdate: "Document updated",
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
    pending: "Pendientes",
    viewAll: "Ver todas las notificaciones",
    markAllRead: "Marcar todas como leídas",
    clearAll: "Limpiar todas",
    newComplaint: "Nueva queja técnica registrada",
    complaintWaiting: "La queja técnica fue registrada y espera análisis.",
    pendingTask: "Tarea pendiente de análisis",
    pendingReview: "Esperando revisión del supervisor",
    systemAlert: "Alerta del sistema",
    appointmentReminder: "Recordatorio de cita",
    documentUpdate: "Documento actualizado",
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

// Mock de mensagens não lidas para o chat
const MENSAGENS_NAO_LIDAS = [
  {
    id: 1,
    nome: "Maria Silva",
    mensagem: "Obrigada pelo atendimento!",
  },
  {
    id: 2,
    nome: "João Santos",
    mensagem: "Quando poderei receber um retorno?",
  },
]

// Tipos de notificação
const NOTIFICATION_TYPES = {
  COMPLAINT: 'complaint',
  ALERT: 'alert',
  INFO: 'info',
  DOCUMENT: 'document',
  APPOINTMENT: 'appointment'
}

// Ícones para cada tipo de notificação
const getNotificationIcon = (type: string) => {
  switch (type) {
    case NOTIFICATION_TYPES.COMPLAINT:
      return Bell
    case NOTIFICATION_TYPES.ALERT:
      return AlertTriangle
    case NOTIFICATION_TYPES.INFO:
      return Info
    case NOTIFICATION_TYPES.DOCUMENT:
      return FileText
    case NOTIFICATION_TYPES.APPOINTMENT:
      return Calendar
    default:
      return Bell
  }
}

// Cores para cada tipo de notificação
const getNotificationColors = (type: string) => {
  switch (type) {
    case NOTIFICATION_TYPES.COMPLAINT:
      return { bg: 'bg-blue-100', text: 'text-blue-600' }
    case NOTIFICATION_TYPES.ALERT:
      return { bg: 'bg-red-100', text: 'text-red-600' }
    case NOTIFICATION_TYPES.INFO:
      return { bg: 'bg-green-100', text: 'text-green-600' }
    case NOTIFICATION_TYPES.DOCUMENT:
      return { bg: 'bg-purple-100', text: 'text-purple-600' }
    case NOTIFICATION_TYPES.APPOINTMENT:
      return { bg: 'bg-orange-100', text: 'text-orange-600' }
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-600' }
  }
}

export function Header() {
  const { setTheme, theme } = useTheme()
  const [language, setLanguage] = useState<"pt" | "en" | "es">("pt")
  const t = translations[language]
  
  // Estado das notificações
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: NOTIFICATION_TYPES.COMPLAINT,
      title: "Nova queixa técnica registrada",
      message: "Queixa técnica foi registrada e aguarda análise.",
      time: "10 minutos",
      read: false
    },
    {
      id: 2,
      type: NOTIFICATION_TYPES.ALERT,
      title: "Alerta do sistema",
      message: "Sistema será atualizado em 30 minutos.",
      time: "15 minutos",
      read: false
    },
    {
      id: 3,
      type: NOTIFICATION_TYPES.DOCUMENT,
      title: "Documento atualizado",
      message: "Protocolo #2024-001 foi atualizado.",
      time: "20 minutos",
      read: true
    },
    {
      id: 4,
      type: NOTIFICATION_TYPES.APPOINTMENT,
      title: "Lembrete de agendamento",
      message: "Reunião agendada para hoje às 14:00.",
      time: "25 minutos",
      read: false
    },
    {
      id: 5,
      type: NOTIFICATION_TYPES.INFO,
      title: "Informação importante",
      message: "Nova funcionalidade disponível no sistema.",
      time: "30 minutos",
      read: false
    }
  ])
  
  // Funções para gerenciar notificações
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
  }
  
  const clearAllNotifications = () => {
    setNotifications([])
  }
  
  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }
  
  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }
  
  const unreadCount = notifications.filter(notif => !notif.read).length

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
            {/* Removida a barra de busca */}
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
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-96 p-0">
                <div className="px-4 pt-4 pb-2">
                  <div className="space-y-3">
                    <h4 className="text-base font-bold text-center">{t.notifications}</h4>
                    <div className="flex gap-2 justify-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={markAllAsRead}
                        className="text-xs h-7 px-3 flex-1 bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                        disabled={unreadCount === 0}
                      >
                        <CheckCheck className="h-3 w-3 mr-1" />
                        {t.markAllRead}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearAllNotifications}
                        className="text-xs h-7 px-3 flex-1 bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                        disabled={notifications.length === 0}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        {t.clearAll}
                      </Button>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhuma notificação</p>
                    </div>
                  ) : (
                    notifications.map((notification) => {
                      const IconComponent = getNotificationIcon(notification.type)
                      const colors = getNotificationColors(notification.type)
                      
                      return (
                        <DropdownMenuItem 
                          key={notification.id} 
                          className={`cursor-pointer p-4 mx-2 my-1 rounded relative group ${
                            notification.read ? 'bg-gray-50 opacity-75' : 'bg-white'
                          }`}
                          onClick={() => !notification.read && markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3 w-full">
                            <div className={`rounded-full p-2 ${colors.bg} ${colors.text} flex-shrink-0`}>
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="space-y-1 flex-1 min-w-0">
                              <p className={`text-sm font-medium ${
                                notification.read ? 'text-gray-500' : 'text-gray-900'
                              }`}>
                                {notification.title}
                              </p>
                              <p className={`text-xs ${
                                notification.read ? 'text-gray-400' : 'text-muted-foreground'
                              } line-clamp-2`}>
                                {notification.message}
                              </p>
                              <p className={`text-xs ${
                                notification.read ? 'text-gray-400' : 'text-muted-foreground'
                              }`}>
                                {notification.time} atrás
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-gray-400 hover:text-red-600 flex-shrink-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                           </div>
                         </DropdownMenuItem>
                      )
                    })
                  )}
                </div>
                {notifications.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <Button variant="ghost" size="sm" className="w-full">
                        {t.viewAll}
                      </Button>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dropdown de chat apenas no mobile, à direita do globo e do sino */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="block md:hidden text-muted-foreground relative"
                >
                  <MessageSquare className="h-5 w-5" />
                  {MENSAGENS_NAO_LIDAS.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-teal-600 text-white text-xs font-bold z-10" style={{minWidth: 20, minHeight: 20}}>
                      {MENSAGENS_NAO_LIDAS.length}
                    </span>
                  )}
                  <span className="sr-only">Abrir chat</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 max-w-xs">
                {/* Lista de mensagens não lidas */}
                {MENSAGENS_NAO_LIDAS.length > 0 && (
                  <div className="px-2 pt-2 pb-1">
                    <div className="text-xs text-muted-foreground mb-1 font-semibold">Mensagens não lidas</div>
                    {MENSAGENS_NAO_LIDAS.map((msg) => (
                      <div key={msg.id} className="mb-2 p-2 rounded bg-muted/50 flex flex-col">
                        <span className="font-medium text-sm text-gray-900 truncate">{msg.nome}</span>
                        <span className="text-xs text-gray-600 truncate">{msg.mensagem}</span>
                      </div>
                    ))}
                    <div className="border-b border-gray-200 my-2" />
                  </div>
                )}
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

