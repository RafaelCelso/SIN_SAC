"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Search, Plus, ChevronRight, ChevronLeft, User, Phone, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

// Dados simulados de conversas
const CONVERSAS_MOCK = [
  {
    id: "1",
    nome: "Maria Silva",
    avatar: "/placeholder.svg?height=40&width=40",
    ultimaMensagem: "Obrigada pelo atendimento!",
    horario: "10:30",
    naoLidas: 2,
  },
  {
    id: "2",
    nome: "João Santos",
    avatar: "/placeholder.svg?height=40&width=40",
    ultimaMensagem: "Quando poderei receber um retorno?",
    horario: "09:15",
    naoLidas: 0,
  },
  {
    id: "3",
    nome: "Farmácia Saúde",
    avatar: "/placeholder.svg?height=40&width=40",
    ultimaMensagem: "Precisamos de mais informações sobre o produto.",
    horario: "Ontem",
    naoLidas: 1,
  },
  {
    id: "4",
    nome: "Ana Oliveira",
    avatar: "/placeholder.svg?height=40&width=40",
    ultimaMensagem: "O problema foi resolvido, obrigada!",
    horario: "Ontem",
    naoLidas: 0,
  },
  {
    id: "5",
    nome: "Carlos Mendes",
    avatar: "/placeholder.svg?height=40&width=40",
    ultimaMensagem: "Vou enviar os documentos solicitados.",
    horario: "Seg",
    naoLidas: 0,
  },
]

// Dados simulados de contatos
const CONTATOS_MOCK = [
  {
    id: "1",
    nome: "Maria Silva",
    avatar: "/placeholder.svg?height=40&width=40",
    telefone: "(11) 98765-4321",
    email: "maria.silva@email.com",
    online: true,
  },
  {
    id: "2",
    nome: "João Santos",
    avatar: "/placeholder.svg?height=40&width=40",
    telefone: "(11) 91234-5678",
    email: "joao.santos@email.com",
    online: false,
  },
  {
    id: "3",
    nome: "Farmácia Saúde",
    avatar: "/placeholder.svg?height=40&width=40",
    telefone: "(11) 3456-7890",
    email: "contato@farmaciasaude.com.br",
    online: true,
  },
  {
    id: "4",
    nome: "Ana Oliveira",
    avatar: "/placeholder.svg?height=40&width=40",
    telefone: "(11) 97654-3210",
    email: "ana.oliveira@email.com",
    online: false,
  },
  {
    id: "5",
    nome: "Carlos Mendes",
    avatar: "/placeholder.svg?height=40&width=40",
    telefone: "(11) 95678-1234",
    email: "carlos.mendes@email.com",
    online: false,
  },
  {
    id: "6",
    nome: "Drogaria Bem Estar",
    avatar: "/placeholder.svg?height=40&width=40",
    telefone: "(11) 2345-6789",
    email: "contato@drogariabemestar.com.br",
    online: true,
  },
  {
    id: "7",
    nome: "Juliana Costa",
    avatar: "/placeholder.svg?height=40&width=40",
    telefone: "(11) 94321-8765",
    email: "juliana.costa@email.com",
    online: false,
  },
]

interface ChatSidebarProps {
  expanded?: boolean
  onToggle?: () => void
  onClose?: () => void
}

export function ChatSidebar({ expanded = false, onToggle, onClose }: ChatSidebarProps) {
  const [activeTab, setActiveTab] = useState("conversas")
  const [searchQuery, setSearchQuery] = useState("")
  const [showContatos, setShowContatos] = useState(false)

  // Filtrar conversas ou contatos com base na busca
  const filteredConversas = CONVERSAS_MOCK.filter((conversa) =>
    conversa.nome.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredContatos = CONTATOS_MOCK.filter(
    (contato) =>
      contato.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contato.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contato.telefone.includes(searchQuery),
  )

  const toggleSidebar = () => {
    if (onToggle) {
      onToggle()
    }
  }

  const handleNovaConversa = () => {
    setActiveTab("contatos")
    setShowContatos(true)
    if (onToggle && !expanded) {
      onToggle()
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Botão para expandir/recolher */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="absolute -left-4 top-20 h-8 w-8 rounded-full border bg-white shadow-md"
      >
        {expanded ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      {/* Cabeçalho */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-[#26B99D]" />
          {expanded && <span className="font-semibold text-[#26B99D]">Mensagens</span>}
        </div>
        {expanded && (
          <Button size="sm" variant="ghost" className="text-[#26B99D] hover:bg-[#26B99D]/10">
            <Plus className="h-4 w-4" />
            <span className="ml-1">Nova</span>
          </Button>
        )}
      </div>

      {/* Conteúdo */}
      {expanded ? (
        <div className="flex-1 flex flex-col bg-[#F1F5F9]">
          {/* Barra de pesquisa */}
          <div className="p-3 border-b border-gray-200 bg-white shadow-sm">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="pl-8 bg-white border-gray-200 focus:border-[#26B99D] focus:ring-[#26B99D]/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm">
              <TabsTrigger
                value="conversas"
                onClick={() => setShowContatos(false)}
                className="text-gray-700 data-[state=active]:bg-[#26B99D] data-[state=active]:text-white font-medium"
              >
                Conversas
              </TabsTrigger>
              <TabsTrigger
                value="contatos"
                onClick={() => setShowContatos(true)}
                className="text-gray-700 data-[state=active]:bg-[#26B99D] data-[state=active]:text-white font-medium"
              >
                Contatos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="conversas" className="flex-1 p-0">
              <ScrollArea className="h-[calc(100vh-140px)]">
                {filteredConversas.length > 0 ? (
                  <div className="space-y-1 p-1">
                    {filteredConversas.map((conversa) => (
                      <div
                        key={conversa.id}
                        className="flex items-start gap-3 p-2 rounded-md hover:bg-white/80 cursor-pointer text-gray-800 transition-colors"
                      >
                        <Avatar className="h-10 w-10 border border-gray-200">
                          <AvatarImage src={conversa.avatar} alt={conversa.nome} />
                          <AvatarFallback className="bg-[#26B99D]/10 text-[#26B99D]">{conversa.nome.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm text-gray-900">{conversa.nome}</p>
                            <span className="text-xs text-gray-500">{conversa.horario}</span>
                          </div>
                          <p className="text-xs text-gray-600 truncate">{conversa.ultimaMensagem}</p>
                        </div>
                        {conversa.naoLidas > 0 && (
                          <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full bg-[#26B99D] text-white shadow-sm">
                            {conversa.naoLidas}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
                    <MessageSquare className="h-10 w-10 text-gray-300 mb-2" />
                    <p className="text-sm font-medium">Nenhuma conversa encontrada</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {searchQuery ? "Tente uma busca diferente" : "Inicie uma nova conversa"}
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="contatos" className="flex-1 p-0">
              <ScrollArea className="h-[calc(100vh-140px)]">
                {filteredContatos.length > 0 ? (
                  <div className="space-y-1 p-1">
                    {filteredContatos.map((contato) => (
                      <div
                        key={contato.id}
                        className="flex items-start gap-3 p-2 rounded-md hover:bg-white/80 cursor-pointer text-gray-800 transition-colors"
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10 border border-gray-200">
                            <AvatarImage src={contato.avatar} alt={contato.nome} />
                            <AvatarFallback className="bg-[#26B99D]/10 text-[#26B99D]">{contato.nome.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {contato.online && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white shadow-sm" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900">{contato.nome}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Phone className="h-3 w-3" />
                            <span className="truncate">{contato.telefone}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{contato.email}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
                    <User className="h-10 w-10 text-gray-300 mb-2" />
                    <p className="text-sm font-medium">Nenhum contato encontrado</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {searchQuery ? "Tente uma busca diferente" : "Adicione novos contatos"}
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center pt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNovaConversa}
            className="mb-2 text-[#26B99D] hover:bg-[#26B99D]/10"
          >
            <Plus className="h-5 w-5" />
          </Button>
          <div className="space-y-2">
            {CONVERSAS_MOCK.filter((c) => c.naoLidas > 0)
              .slice(0, 3)
              .map((conversa) => (
                <div key={conversa.id} className="relative">
                  <Avatar className="h-10 w-10 cursor-pointer border border-gray-200">
                    <AvatarImage src={conversa.avatar} alt={conversa.nome} />
                    <AvatarFallback className="bg-[#26B99D]/10 text-[#26B99D]">{conversa.nome.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {conversa.naoLidas > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center rounded-full text-[10px] bg-[#26B99D] text-white shadow-sm">
                      {conversa.naoLidas}
                    </Badge>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

