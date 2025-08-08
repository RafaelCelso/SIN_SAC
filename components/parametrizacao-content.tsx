"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  ChevronLeft, 
  ChevronRight, 
  Search,
  LayoutDashboard,
  Users,
  UserPlus,
  Clipboard,
  ClipboardList,
  Pill,
  DollarSign,
  Calendar,
  BookOpen,
  BarChart3,
  Package2,
  Tag,
  AlertTriangle,
  Syringe,
  FileEdit,
  FileText,
  KeyRound,
  Bell,
  Mail,
  Settings2
} from "lucide-react"


export function ParametrizacaoContent() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Removido o CSS inline antigo - agora usando classes Tailwind modernas

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      checkScrollButtons()
      container.addEventListener('scroll', checkScrollButtons)
      window.addEventListener('resize', checkScrollButtons)
      
      return () => {
        container.removeEventListener('scroll', checkScrollButtons)
        window.removeEventListener('resize', checkScrollButtons)
      }
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black">Parametrização</h1>
        <p className="text-muted-foreground mt-2">
          Configure e gerencie os parâmetros do sistema para personalizar o comportamento da aplicação.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Tabs defaultValue="dashboard" className="w-full">
          <div className="relative">
            {/* Botão de scroll para esquerda */}
            <Button
              variant="outline"
              size="sm"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 p-0 bg-gradient-to-r from-white to-gray-50 shadow-lg border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-full"
              onClick={scrollLeft}
            >
              <ChevronLeft className="h-4 w-4 text-[#26B99D]" />
            </Button>
            
            {/* Container das abas com scroll */}
              <div 
                ref={scrollContainerRef}
                className="overflow-x-auto scrollbar-hide px-8"
              >
              <TabsList className="flex w-max min-w-full bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 shadow-lg rounded-xl p-2">
                <TabsTrigger 
                  value="dashboard" 
                  className="text-sm flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#26B99D] data-[state=active]:to-[#20a085] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 font-medium group"
                >
                  <LayoutDashboard size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="buscar-clientes" 
                  className="text-sm flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#26B99D] data-[state=active]:to-[#20a085] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 font-medium group"
                >
                  <Search size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  Buscar Clientes
                </TabsTrigger>
                <TabsTrigger 
                  value="novo-cliente" 
                  className="text-sm flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#26B99D] data-[state=active]:to-[#20a085] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 font-medium group"
                >
                  <UserPlus size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  Novo Cliente
                </TabsTrigger>
                <TabsTrigger 
                  value="protocolos" 
                  className="text-sm flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#26B99D] data-[state=active]:to-[#20a085] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 font-medium group"
                >
                  <Clipboard size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  Protocolos
                </TabsTrigger>
                <TabsTrigger 
                  value="queixas-tecnicas" 
                  className="text-sm flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#26B99D] data-[state=active]:to-[#20a085] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 font-medium group"
                >
                  <ClipboardList size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  Queixas Técnicas
                </TabsTrigger>
                <TabsTrigger 
                  value="farmacovigilancia" 
                  className="text-sm flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#26B99D] data-[state=active]:to-[#20a085] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 font-medium group"
                >
                  <Pill size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  Farmacovigilância
                </TabsTrigger>
                <TabsTrigger 
                  value="ressarcimento" 
                  className="text-sm flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#26B99D] data-[state=active]:to-[#20a085] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 font-medium group"
                >
                  <DollarSign size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  Ressarcimento
                </TabsTrigger>
                <TabsTrigger 
                  value="agenda" 
                  className="text-sm flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#26B99D] data-[state=active]:to-[#20a085] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 font-medium group"
                >
                  <Calendar size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  Agenda
                </TabsTrigger>
                <TabsTrigger 
                  value="faq" 
                  className="text-sm flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#26B99D] data-[state=active]:to-[#20a085] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 font-medium group"
                >
                  <BookOpen size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  FAQ
                </TabsTrigger>
                <TabsTrigger 
                  value="relatorios" 
                  className="text-sm flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#26B99D] data-[state=active]:to-[#20a085] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 font-medium group"
                >
                  <BarChart3 size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  Relatórios
                </TabsTrigger>
                <TabsTrigger 
                  value="produtos" 
                  className="text-sm flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#26B99D] data-[state=active]:to-[#20a085] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 font-medium group"
                >
                  <Pill size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  Produtos
                </TabsTrigger>
                <TabsTrigger 
                  value="motivos" 
                  className="text-sm flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#26B99D] data-[state=active]:to-[#20a085] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 font-medium group"
                >
                  <ClipboardList size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  Motivos
                </TabsTrigger>
                <TabsTrigger 
                  value="evento-adverso" 
                  className="text-sm flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#26B99D] data-[state=active]:to-[#20a085] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 font-medium group"
                >
                  <AlertTriangle size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  Evento Adverso
                </TabsTrigger>
                <TabsTrigger 
                  value="via-administracao" 
                  className="text-sm flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#26B99D] data-[state=active]:to-[#20a085] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 font-medium group"
                >
                  <Syringe size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  Via de Administração
                </TabsTrigger>
                <TabsTrigger 
                  value="formularios" 
                  className="text-sm flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#26B99D] data-[state=active]:to-[#20a085] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 font-medium group"
                >
                  <FileEdit size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  Formulários
                </TabsTrigger>
                <TabsTrigger 
                  value="audit-trail" 
                  className="text-sm flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#26B99D] data-[state=active]:to-[#20a085] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 font-medium group"
                >
                  <FileText size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  Audit Trail
                </TabsTrigger>
                <TabsTrigger 
                  value="usuarios" 
                  className="text-sm flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#26B99D] data-[state=active]:to-[#20a085] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 font-medium group"
                >
                  <Users size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  Usuários
                </TabsTrigger>
                <TabsTrigger 
                  value="permissoes" 
                  className="text-sm flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#26B99D] data-[state=active]:to-[#20a085] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 font-medium group"
                >
                  <KeyRound size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  Permissões
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Botão de scroll para direita */}
            <Button
              variant="outline"
              size="sm"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 p-0 bg-gradient-to-r from-white to-gray-50 shadow-lg border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-full"
              onClick={scrollRight}
            >
              <ChevronRight className="h-4 w-4 text-[#26B99D]" />
            </Button>
          </div>

          <TabsContent value="dashboard" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Conteúdo do Dashboard</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="buscar-clientes" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Conteúdo de Buscar Clientes</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="novo-cliente" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Conteúdo de Novo Cliente</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="protocolos" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Conteúdo de Protocolos</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="queixas-tecnicas" className="mt-8">
            <div className="space-y-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="notificacoes" className="border border-gray-200 rounded-xl shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  <AccordionTrigger className="text-lg font-semibold px-6 py-5 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 rounded-t-xl transition-all duration-300 group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-white to-gray-100 rounded-full shadow-md border border-gray-200 group-hover:shadow-lg transition-all duration-300">
                        <Bell className="h-5 w-5 text-[#26B99D] group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <span className="text-gray-800 group-hover:text-[#26B99D] transition-colors duration-300">Notificações</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 bg-gradient-to-b from-white to-gray-50">
                    <Tabs defaultValue="geral" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg shadow-inner mt-6">
                        <TabsTrigger value="geral" className="data-[state=active]:bg-[#26B99D] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 rounded-md">Geral</TabsTrigger>
                        <TabsTrigger value="personalizar" className="data-[state=active]:bg-[#26B99D] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 rounded-md">Personalizar</TabsTrigger>
                      </TabsList>
                      <TabsContent value="geral" className="mt-4">
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 rounded-xl">
                          <CardHeader className="bg-gradient-to-r from-[#26B99D]/5 to-gray-100/50 rounded-t-xl border-b border-gray-100">
                            <CardTitle className="text-gray-800 flex items-center gap-2">
                              <Settings2 className="h-5 w-5 text-[#26B99D]" />
                              Configurações Gerais
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6 p-6">
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-[#26B99D]/10 to-[#26B99D]/5 rounded-full">
                                  <Mail className="h-4 w-4 text-[#26B99D]" />
                                </div>
                                <Label htmlFor="email-geral-queixas" className="text-sm font-medium text-gray-700">
                                  Notificação por e-mail
                                </Label>
                              </div>
                              <Switch id="email-geral-queixas" className="data-[state=checked]:bg-[#26B99D]" />
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="personalizar" className="mt-4">
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 rounded-xl">
                          <CardHeader className="bg-gradient-to-r from-[#26B99D]/5 to-gray-100/50 rounded-t-xl border-b border-gray-100">
                            <CardTitle className="text-gray-800 flex items-center gap-2">
                              <UserPlus className="h-5 w-5 text-[#26B99D]" />
                              Personalizar por Perfil
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6">
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="email-notifications" className="border border-gray-200 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-md overflow-hidden">
                                <AccordionTrigger className="text-base font-medium px-5 py-4 hover:bg-gradient-to-r hover:from-[#26B99D]/5 hover:to-gray-100/50 rounded-t-lg transition-all duration-300 group">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-[#26B99D]/10 to-[#26B99D]/5 rounded-full group-hover:shadow-md transition-all duration-300">
                                      <Mail className="h-4 w-4 text-[#26B99D] group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <span className="group-hover:text-[#26B99D] transition-colors duration-300">Notificação por e-mail</span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-5 pb-5 bg-gradient-to-b from-white to-gray-50">
                                  <div className="space-y-6 pt-4">
                                    <div>
                                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Perfis que receberão notificações:</h4>
                                      <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
                                          <div>
                                            <p className="font-medium text-gray-800">Admin</p>
                                            <p className="text-sm text-muted-foreground">Perfil de administrador do sistema</p>
                                          </div>
                                          <Switch className="data-[state=checked]:bg-[#26B99D]" defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
                                          <div>
                                            <p className="font-medium text-gray-800">Atendimento</p>
                                            <p className="text-sm text-muted-foreground">Perfil de atendimento ao cliente</p>
                                          </div>
                                          <Switch className="data-[state=checked]:bg-[#26B99D]" defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
                                          <div>
                                            <p className="font-medium text-gray-800">Supervisor</p>
                                            <p className="text-sm text-muted-foreground">Perfil de supervisão e gestão</p>
                                          </div>
                                          <Switch className="data-[state=checked]:bg-[#26B99D]" defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
                                          <div>
                                            <p className="font-medium text-gray-800">Qualidade</p>
                                            <p className="text-sm text-muted-foreground">Perfil de controle de qualidade</p>
                                          </div>
                                          <Switch className="data-[state=checked]:bg-[#26B99D]" defaultChecked />
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="border-t pt-6">
                                      <h4 className="text-sm font-semibold text-gray-700 mb-3">E-mails que NÃO devem receber notificações:</h4>
                                      <div className="space-y-3">
                                        <div className="flex gap-2">
                                          <Input
                                            placeholder="Digite o e-mail para excluir..."
                                            className="flex-1"
                                          />
                                          <Button 
                                            size="sm" 
                                            className="bg-[#26B99D] hover:bg-[#20a085] text-white px-4"
                                          >
                                            Adicionar
                                          </Button>
                                        </div>
                                        <div className="space-y-2">
                                          <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50 border-red-200">
                                            <div>
                                              <p className="font-medium text-gray-800">usuario.excluido@empresa.com</p>
                                              <p className="text-sm text-red-600">Excluído das notificações</p>
                                            </div>
                                            <Button 
                                              size="sm" 
                                              variant="outline" 
                                              className="text-red-600 border-red-300 hover:bg-red-50"
                                            >
                                              Remover
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>
          <TabsContent value="farmacovigilancia" className="mt-8">
            <div className="space-y-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="notificacoes" className="border border-gray-200 rounded-xl shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  <AccordionTrigger className="text-lg font-semibold px-6 py-5 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 rounded-t-xl transition-all duration-300 group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-white to-gray-100 rounded-full shadow-md border border-gray-200 group-hover:shadow-lg transition-all duration-300">
                        <Bell className="h-5 w-5 text-[#26B99D] group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <span className="text-gray-800 group-hover:text-[#26B99D] transition-colors duration-300">Notificações</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 bg-gradient-to-b from-white to-gray-50">
                    <Tabs defaultValue="geral" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg shadow-inner mt-6">
                        <TabsTrigger value="geral" className="data-[state=active]:bg-[#26B99D] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 rounded-md">Geral</TabsTrigger>
                        <TabsTrigger value="personalizar" className="data-[state=active]:bg-[#26B99D] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 rounded-md">Personalizar</TabsTrigger>
                      </TabsList>
                      <TabsContent value="geral" className="mt-4">
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 rounded-xl">
                          <CardHeader className="bg-gradient-to-r from-[#26B99D]/5 to-gray-100/50 rounded-t-xl border-b border-gray-100">
                            <CardTitle className="text-gray-800 flex items-center gap-2">
                              <Settings2 className="h-5 w-5 text-[#26B99D]" />
                              Configurações Gerais
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6 p-6">
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-[#26B99D]/10 to-[#26B99D]/5 rounded-full">
                                  <Mail className="h-4 w-4 text-[#26B99D]" />
                                </div>
                                <Label htmlFor="email-geral-farmaco" className="text-sm font-medium text-gray-700">
                                  Notificação por e-mail
                                </Label>
                              </div>
                              <Switch id="email-geral-farmaco" className="data-[state=checked]:bg-[#26B99D]" />
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="personalizar" className="mt-4">
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 rounded-xl">
                          <CardHeader className="bg-gradient-to-r from-[#26B99D]/5 to-gray-100/50 rounded-t-xl border-b border-gray-100">
                            <CardTitle className="text-gray-800 flex items-center gap-2">
                              <UserPlus className="h-5 w-5 text-[#26B99D]" />
                              Personalizar por Perfil
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6">
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="email-notifications" className="border border-gray-200 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-md overflow-hidden">
                                <AccordionTrigger className="text-base font-medium px-5 py-4 hover:bg-gradient-to-r hover:from-[#26B99D]/5 hover:to-gray-100/50 rounded-t-lg transition-all duration-300 group">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-[#26B99D]/10 to-[#26B99D]/5 rounded-full group-hover:shadow-md transition-all duration-300">
                                      <Mail className="h-4 w-4 text-[#26B99D] group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <span className="group-hover:text-[#26B99D] transition-colors duration-300">Notificação por e-mail</span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-5 pb-5 bg-gradient-to-b from-white to-gray-50">
                                  <div className="space-y-6 pt-4">
                                    <div>
                                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Perfis que receberão notificações:</h4>
                                      <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
                                          <div>
                                            <p className="font-medium text-gray-800">Admin</p>
                                            <p className="text-sm text-muted-foreground">Perfil de administrador do sistema</p>
                                          </div>
                                          <Switch className="data-[state=checked]:bg-[#26B99D]" defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
                                          <div>
                                            <p className="font-medium text-gray-800">Atendimento</p>
                                            <p className="text-sm text-muted-foreground">Perfil de atendimento ao cliente</p>
                                          </div>
                                          <Switch className="data-[state=checked]:bg-[#26B99D]" defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
                                          <div>
                                            <p className="font-medium text-gray-800">Supervisor</p>
                                            <p className="text-sm text-muted-foreground">Perfil de supervisão e gestão</p>
                                          </div>
                                          <Switch className="data-[state=checked]:bg-[#26B99D]" defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
                                          <div>
                                            <p className="font-medium text-gray-800">Farmacovigilância</p>
                                            <p className="text-sm text-muted-foreground">Perfil especializado em farmacovigilância</p>
                                          </div>
                                          <Switch className="data-[state=checked]:bg-[#26B99D]" defaultChecked />
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="border-t pt-6">
                                      <h4 className="text-sm font-semibold text-gray-700 mb-3">E-mails que NÃO devem receber notificações:</h4>
                                      <div className="space-y-3">
                                        <div className="flex gap-2">
                                          <Input
                                            placeholder="Digite o e-mail para excluir..."
                                            className="flex-1"
                                          />
                                          <Button 
                                            size="sm" 
                                            className="bg-[#26B99D] hover:bg-[#20a085] text-white px-4"
                                          >
                                            Adicionar
                                          </Button>
                                        </div>
                                        <div className="space-y-2">
                                          <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50 border-red-200">
                                            <div>
                                              <p className="font-medium text-gray-800">usuario.excluido@empresa.com</p>
                                              <p className="text-sm text-red-600">Excluído das notificações</p>
                                            </div>
                                            <Button 
                                              size="sm" 
                                              variant="outline" 
                                              className="text-red-600 border-red-300 hover:bg-red-50"
                                            >
                                              Remover
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>
          <TabsContent value="ressarcimento" className="mt-8">
            <div className="space-y-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="notificacoes" className="border border-gray-200 rounded-xl shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  <AccordionTrigger className="text-lg font-semibold px-6 py-5 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 rounded-t-xl transition-all duration-300 group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-white to-gray-100 rounded-full shadow-md border border-gray-200 group-hover:shadow-lg transition-all duration-300">
                        <Bell className="h-5 w-5 text-[#26B99D] group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <span className="text-gray-800 group-hover:text-[#26B99D] transition-colors duration-300">Notificações</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 bg-gradient-to-b from-white to-gray-50">
                    <Tabs defaultValue="geral" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg shadow-inner mt-6">
                        <TabsTrigger value="geral" className="data-[state=active]:bg-[#26B99D] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 rounded-md">Geral</TabsTrigger>
                        <TabsTrigger value="personalizar" className="data-[state=active]:bg-[#26B99D] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 rounded-md">Personalizar</TabsTrigger>
                      </TabsList>
                      <TabsContent value="geral" className="mt-4">
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 rounded-xl">
                          <CardHeader className="bg-gradient-to-r from-[#26B99D]/5 to-gray-100/50 rounded-t-xl border-b border-gray-100">
                            <CardTitle className="text-gray-800 flex items-center gap-2">
                              <Settings2 className="h-5 w-5 text-[#26B99D]" />
                              Configurações Gerais
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6 p-6">
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-[#26B99D]/10 to-[#26B99D]/5 rounded-full">
                                  <Mail className="h-4 w-4 text-[#26B99D]" />
                                </div>
                                <Label htmlFor="email-geral-ressarcimento" className="text-sm font-medium text-gray-700">
                                  Notificação por e-mail
                                </Label>
                              </div>
                              <Switch id="email-geral-ressarcimento" className="data-[state=checked]:bg-[#26B99D]" />
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="personalizar" className="mt-4">
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 rounded-xl">
                          <CardHeader className="bg-gradient-to-r from-[#26B99D]/5 to-gray-100/50 rounded-t-xl border-b border-gray-100">
                            <CardTitle className="text-gray-800 flex items-center gap-2">
                              <UserPlus className="h-5 w-5 text-[#26B99D]" />
                              Personalizar por Perfil
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6">
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="email-notifications" className="border border-gray-200 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-md overflow-hidden">
                                <AccordionTrigger className="text-base font-medium px-5 py-4 hover:bg-gradient-to-r hover:from-[#26B99D]/5 hover:to-gray-100/50 rounded-t-lg transition-all duration-300 group">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-[#26B99D]/10 to-[#26B99D]/5 rounded-full group-hover:shadow-md transition-all duration-300">
                                      <Mail className="h-4 w-4 text-[#26B99D] group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <span className="group-hover:text-[#26B99D] transition-colors duration-300">Notificação por e-mail</span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-5 pb-5 bg-gradient-to-b from-white to-gray-50">
                                  <div className="space-y-6 pt-4">
                                    <div>
                                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Perfis que receberão notificações:</h4>
                                      <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
                                          <div>
                                            <p className="font-medium text-gray-800">Admin</p>
                                            <p className="text-sm text-muted-foreground">Perfil de administrador do sistema</p>
                                          </div>
                                          <Switch className="data-[state=checked]:bg-[#26B99D]" defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
                                          <div>
                                            <p className="font-medium text-gray-800">Atendimento</p>
                                            <p className="text-sm text-muted-foreground">Perfil de atendimento ao cliente</p>
                                          </div>
                                          <Switch className="data-[state=checked]:bg-[#26B99D]" defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
                                          <div>
                                            <p className="font-medium text-gray-800">Supervisor</p>
                                            <p className="text-sm text-muted-foreground">Perfil de supervisão e gestão</p>
                                          </div>
                                          <Switch className="data-[state=checked]:bg-[#26B99D]" defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
                                          <div>
                                            <p className="font-medium text-gray-800">Qualidade</p>
                                            <p className="text-sm text-muted-foreground">Perfil de controle de qualidade</p>
                                          </div>
                                          <Switch className="data-[state=checked]:bg-[#26B99D]" defaultChecked />
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="border-t pt-6">
                                      <h4 className="text-sm font-semibold text-gray-700 mb-3">E-mails que NÃO devem receber notificações:</h4>
                                      <div className="space-y-3">
                                        <div className="flex gap-2">
                                          <Input
                                            placeholder="Digite o e-mail para excluir..."
                                            className="flex-1"
                                          />
                                          <Button 
                                            size="sm" 
                                            className="bg-[#26B99D] hover:bg-[#20a085] text-white px-4"
                                          >
                                            Adicionar
                                          </Button>
                                        </div>
                                        <div className="space-y-2">
                                          <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50 border-red-200">
                                            <div>
                                              <p className="font-medium text-gray-800">usuario.excluido@empresa.com</p>
                                              <p className="text-sm text-red-600">Excluído das notificações</p>
                                            </div>
                                            <Button size="sm" variant="ghost" className="text-red-600 border-red-300 hover:bg-red-50">
                                              Remover
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>
          <TabsContent value="agenda" className="mt-8">
            <div className="space-y-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="notificacoes" className="border border-gray-200 rounded-xl shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  <AccordionTrigger className="text-lg font-semibold px-6 py-5 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 rounded-t-xl transition-all duration-300 group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-white to-gray-100 rounded-full shadow-md border border-gray-200 group-hover:shadow-lg transition-all duration-300">
                        <Bell className="h-5 w-5 text-[#26B99D] group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <span className="text-gray-800 group-hover:text-[#26B99D] transition-colors duration-300">Notificações</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 bg-gradient-to-b from-white to-gray-50">
                    <Tabs defaultValue="geral" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg shadow-inner mt-6">
                        <TabsTrigger value="geral" className="data-[state=active]:bg-[#26B99D] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 rounded-md">Geral</TabsTrigger>
                        <TabsTrigger value="personalizar" className="data-[state=active]:bg-[#26B99D] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 rounded-md">Personalizar</TabsTrigger>
                      </TabsList>
                      <TabsContent value="geral" className="mt-4">
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 rounded-xl">
                          <CardHeader className="bg-gradient-to-r from-[#26B99D]/5 to-gray-100/50 rounded-t-xl border-b border-gray-100">
                            <CardTitle className="text-gray-800 flex items-center gap-2">
                              <Settings2 className="h-5 w-5 text-[#26B99D]" />
                              Configurações Gerais
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6 p-6">
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-[#26B99D]/10 to-[#26B99D]/5 rounded-full">
                                  <Mail className="h-4 w-4 text-[#26B99D]" />
                                </div>
                                <Label htmlFor="email-geral-agenda" className="text-sm font-medium text-gray-700">
                                  Notificação por e-mail
                                </Label>
                              </div>
                              <Switch id="email-geral-agenda" className="data-[state=checked]:bg-[#26B99D]" />
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="personalizar" className="mt-4">
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 rounded-xl">
                          <CardHeader className="bg-gradient-to-r from-[#26B99D]/5 to-gray-100/50 rounded-t-xl border-b border-gray-100">
                            <CardTitle className="text-2xl font-semibold leading-none tracking-tight text-gray-800 flex items-center gap-2">
                              <UserPlus className="h-5 w-5 text-[#26B99D]" />
                              Personalizar por Perfil
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6">
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="email-notifications" className="border border-gray-200 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-md overflow-hidden">
                                <AccordionTrigger className="text-base font-medium px-5 py-4 hover:bg-gradient-to-r hover:from-[#26B99D]/5 hover:to-gray-100/50 rounded-t-lg transition-all duration-300 group">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-[#26B99D]/10 to-[#26B99D]/5 rounded-full group-hover:shadow-md transition-all duration-300">
                                      <Mail className="h-4 w-4 text-[#26B99D] group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <span className="group-hover:text-[#26B99D] transition-colors duration-300">Notificação por e-mail</span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-5 pb-5 bg-gradient-to-b from-white to-gray-50">
                                  <div className="pb-4 pt-0">
                                    <div className="space-y-6 pt-4">
                                      <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Perfis que receberão notificações:</h4>
                                        <div className="space-y-3">
                                          <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
                                            <div>
                                              <p className="font-medium text-gray-800">Admin</p>
                                              <p className="text-sm text-muted-foreground">Perfil de administrador do sistema</p>
                                            </div>
                                            <Switch defaultChecked className="data-[state=checked]:bg-[#26B99D]" />
                                          </div>
                                          <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
                                            <div>
                                              <p className="font-medium text-gray-800">Atendimento</p>
                                              <p className="text-sm text-muted-foreground">Perfil de atendimento ao cliente</p>
                                            </div>
                                            <Switch defaultChecked className="data-[state=checked]:bg-[#26B99D]" />
                                          </div>
                                          <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
                                            <div>
                                              <p className="font-medium text-gray-800">Supervisor</p>
                                              <p className="text-sm text-muted-foreground">Perfil de supervisão e gestão</p>
                                            </div>
                                            <Switch defaultChecked className="data-[state=checked]:bg-[#26B99D]" />
                                          </div>
                                          <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
                                            <div>
                                              <p className="font-medium text-gray-800">Farmacovigilância</p>
                                              <p className="text-sm text-muted-foreground">Perfil de farmacovigilância</p>
                                            </div>
                                            <Switch defaultChecked className="data-[state=checked]:bg-[#26B99D]" />
                                          </div>
                                          <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
                                            <div>
                                              <p className="font-medium text-gray-800">Qualidade</p>
                                              <p className="text-sm text-muted-foreground">Perfil de controle de qualidade</p>
                                            </div>
                                            <Switch defaultChecked className="data-[state=checked]:bg-[#26B99D]" />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="border-t pt-6">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3">E-mails que NÃO devem receber notificações:</h4>
                                        <div className="space-y-3">
                                          <div className="flex gap-2">
                                            <Input
                                              placeholder="Digite o e-mail para excluir..."
                                              className="flex-1"
                                            />
                                            <Button className="bg-[#26B99D] hover:bg-[#20a085] text-white">
                                              Adicionar
                                            </Button>
                                          </div>
                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50 border-red-200">
                                              <div>
                                                <p className="font-medium text-gray-800">usuario.excluido@empresa.com</p>
                                                <p className="text-sm text-red-600">Excluído das notificações</p>
                                              </div>
                                              <Button variant="ghost" className="text-red-600 border-red-300 hover:bg-red-50">
                                                Remover
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>
          <TabsContent value="faq" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Conteúdo de FAQ</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="relatorios" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Conteúdo de Relatórios</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="produtos" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Conteúdo de Produtos</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="motivos" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Conteúdo de Motivos</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="evento-adverso" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Conteúdo de Evento Adverso</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="via-administracao" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Conteúdo de Via de Administração</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="formularios" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Conteúdo de Formulários</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="audit-trail" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Conteúdo de Audit Trail</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="usuarios" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Conteúdo de Usuários</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="permissoes" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Conteúdo de Permissões</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>


    </div>
  )
}