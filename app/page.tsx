"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Calendar as CalendarIcon,
  Users,
  Phone,
  Mail,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Contact,
  TriangleAlert,
  Pill,
  ChevronDown,
  ChevronUp,
  Hand
} from "lucide-react"
import Link from "next/link"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Dados dos casos pendentes baseados na imagem
const CASOS_PENDENTES = [
  {
    id: "01",
    nome: "João Carlos Oliveira",
    prioridade: "Cliente Indisponível",
    protocolo: "CT-2023-0002",
    dataHora: "14/12/2023 16:45",
    responsavel: "Rafael Silva",
    tipo: "Aguardando Resposta",
    status: "Leve",
    motivoPrincipal: "Evento Adverso",
    subcategoria: "Reação Alérgica",
    detalhe: "Urticária"
  },
  {
    id: "02", 
    nome: "Fernanda Rocha Silva",
    prioridade: "Não Atende Ligações",
    protocolo: "CT-2023-0005",
    dataHora: "11/12/2023 15:50",
    responsavel: "Mariana Santos",
    tipo: "Aguardando Resposta",
    status: "Leve",
    motivoPrincipal: "Qualidade",
    subcategoria: "Embalagem",
    detalhe: "Defeito no lacre"
  },
  {
    id: "03",
    nome: "Pedro Almeida",
    prioridade: "Telefone Inválido",
    protocolo: "CT-2023-0006",
    dataHora: "19/12/2023 08:30",
    responsavel: "João Costa",
    tipo: "Documentação Pendente",
    status: "Moderado",
    motivoPrincipal: "Eficácia",
    subcategoria: "Falta de Efeito",
    detalhe: "Não houve melhora"
  },
  {
    id: "04",
    nome: "Carlos Mendes",
    prioridade: "Recusa Contato",
    protocolo: "CT-2023-0011",
    dataHora: "18/12/2023 11:15",
    responsavel: "Ana Silva",
    tipo: "Contato Urgente",
    status: "Grave",
    motivoPrincipal: "Evento Adverso",
    subcategoria: "Reação Grave",
    detalhe: "Hospitalização"
  },
  {
    id: "05",
    nome: "Ana Paula Santos",
    prioridade: "Horário Incompatível",
    protocolo: "CT-2023-0012",
    dataHora: "20/12/2023 09:30",
    responsavel: "Carlos Silva",
    tipo: "Revisão Necessária",
    status: "Leve",
    motivoPrincipal: "Informação",
    subcategoria: "Dúvida Técnica",
    detalhe: "Posologia"
  }
]

// Dados dos eventos do dia para a sidebar
const EVENTOS_HOJE = [
  {
    id: 1,
    titulo: "Reunião de Supervisores",
    horario: "14:00",
    tipo: "Reunião",
    participantes: "Equipe Supervisão"
  },
  {
    id: 2,
    titulo: "Retorno para o Cliente",
    horario: "16:00",
    tipo: "Contato",
    participantes: "Equipe Atendimento"
  },
  {
    id: 3,
    titulo: "Análise de Casos Pend.",
    horario: "10:30",
    tipo: "Análise",
    participantes: "Equipe Técnica"
  },
  {
    id: 4,
    titulo: "Treinamento Farmacovigi...",
    horario: "09:00",
    tipo: "Treinamento",
    participantes: "Nova Colaboradora"
  },
  {
    id: 5,
    titulo: "Revisão de Protocolos",
    horario: "15:30",
    tipo: "Revisão",
    participantes: "Ana Costa"
  }
]

export default function CasosPendentes() {
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 5
  
  // Estados para controlar expansão das seções
  const [isContatosExpanded, setIsContatosExpanded] = useState(true)
  const [isQueixasExpanded, setIsQueixasExpanded] = useState(false)
  const [isFarmacovigilanciaExpanded, setIsFarmacovigilanciaExpanded] = useState(false)
  
  // Estados para controlar filtros ativos
  const [filtroAtivo, setFiltroAtivo] = useState<string | null>(null)
  const [tipoFiltro, setTipoFiltro] = useState<string | null>(null)
  
  // Função para filtrar casos baseado no submenu selecionado
  const filtrarCasos = () => {
    let casosFiltrados = CASOS_PENDENTES
    
    if (filtroAtivo && tipoFiltro) {
      switch (tipoFiltro) {
        case 'contatos':
          if (filtroAtivo === 'motivo-cliente') {
            casosFiltrados = CASOS_PENDENTES.filter(caso => 
              ['Cliente Indisponível', 'Não Atende Ligações', 'Telefone Inválido', 'Recusa Contato'].includes(caso.prioridade)
            )
          } else if (filtroAtivo === 'motivo-interno') {
            casosFiltrados = CASOS_PENDENTES.filter(caso => 
              caso.prioridade === 'Horário Incompatível'
            )
          }
          break
        case 'queixas':
          if (filtroAtivo === 'revisao') {
            casosFiltrados = CASOS_PENDENTES.filter(caso => 
              caso.tipo.includes('Revisão')
            )
          } else if (filtroAtivo === 'retornado') {
            casosFiltrados = CASOS_PENDENTES.filter(caso => 
              caso.tipo.includes('Aguardando')
            )
          }
          break
        case 'farmacovigilancia':
          if (filtroAtivo === 'revisao') {
            casosFiltrados = CASOS_PENDENTES.filter(caso => 
              caso.motivoPrincipal === 'Evento Adverso'
            )
          } else if (filtroAtivo === 'retornado') {
            casosFiltrados = CASOS_PENDENTES.filter(caso => 
              caso.motivoPrincipal === 'Eficácia'
            )
          }
          break
      }
    }
    
    return casosFiltrados
  }
  
  const casosFiltrados = filtrarCasos()
   const totalPaginasFiltradas = Math.ceil(casosFiltrados.length / itensPorPagina)
   const casosExibidos = casosFiltrados.slice(
     (paginaAtual - 1) * itensPorPagina,
     paginaAtual * itensPorPagina
   )
   
   // Função para lidar com cliques nos submenus
   const handleSubmenuClick = (submenu: string, tipo: string) => {
     if (filtroAtivo === submenu && tipoFiltro === tipo) {
       // Se já está ativo, desativa o filtro
       setFiltroAtivo(null)
       setTipoFiltro(null)
     } else {
       // Ativa o novo filtro
       setFiltroAtivo(submenu)
       setTipoFiltro(tipo)
     }
     // Reset da paginação
     setPaginaAtual(1)
   }

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade.toLowerCase()) {
      case 'cliente indisponível':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'não atende ligações':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'telefone inválido':
         return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'recusa contato':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'horário incompatível':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTipoIcon = (tipo: string) => {
    if (tipo.includes('Urgente')) return <AlertTriangle className="h-4 w-4" />
    if (tipo.includes('Documentação')) return <FileText className="h-4 w-4" />
    if (tipo.includes('Revisão')) return <CheckCircle className="h-4 w-4" />
    return <Clock className="h-4 w-4" />
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
            <Hand className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bem-vindo, aqui estão os casos que exigem sua atenção hoje
            </h1>
            <p className="text-gray-600 mt-1">
              Acompanhe os casos que possuem pendência e precisam de atenção
            </p>
          </div>
        </div>

        {/* Layout Principal */}
        <div className="flex gap-6">
          {/* Sidebar de Pendências */}
          <div className="w-80 space-y-3 bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 shadow-lg">

            {/* Seção Contatos */}
            <Collapsible open={isContatosExpanded} onOpenChange={setIsContatosExpanded}>
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 border group bg-[#3BC0A8]/10 border-[#3BC0A8]/30 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div>
                      <Contact className="h-5 w-5 text-[#3BC0A8]" />
                    </div>
                    <span className="font-semibold text-gray-700">Contatos sem resolução</span>
                    <Badge variant="destructive" className="ml-2">8</Badge>
                  </div>
                  {isContatosExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 ml-6 mt-2">
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-sm transition-colors ${
                    filtroAtivo === 'motivo-cliente' && tipoFiltro === 'contatos'
                      ? 'bg-[#3BC0A8]/15 text-gray-700 font-medium border border-[#3BC0A8]/30'
                      : 'hover:bg-[#3BC0A8]/10 text-gray-600'
                  }`}
                  onClick={() => handleSubmenuClick('motivo-cliente', 'contatos')}
                >
                  <span>Motivo do Cliente</span>
                  <Badge className="ml-auto bg-red-50 text-red-700 border-red-200 hover:bg-red-50">4</Badge>
                </Button>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-sm transition-colors ${
                    filtroAtivo === 'motivo-interno' && tipoFiltro === 'contatos'
                      ? 'bg-[#3BC0A8]/15 text-gray-700 font-medium border border-[#3BC0A8]/30'
                      : 'hover:bg-[#3BC0A8]/10 text-gray-600'
                  }`}
                  onClick={() => handleSubmenuClick('motivo-interno', 'contatos')}
                >
                  <span>Motivo Interno</span>
                  <Badge className="ml-auto bg-red-50 text-red-700 border-red-200 hover:bg-red-50">1</Badge>
                </Button>
              </CollapsibleContent>
            </Collapsible>

            {/* Seção Queixas Técnicas */}
            <Collapsible open={isQueixasExpanded} onOpenChange={setIsQueixasExpanded}>
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 border group hover:bg-[#3BC0A8]/5 border-transparent hover:border-[#3BC0A8]/20">
                  <div className="flex items-center gap-3">
                    <div>
                      <TriangleAlert className="h-5 w-5 text-[#3BC0A8]" />
                    </div>
                    <span className="font-semibold text-gray-700">Queixas Técnicas</span>
                    <Badge variant="destructive" className="ml-2">2</Badge>
                  </div>
                  {isQueixasExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 ml-6 mt-2">
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-sm transition-colors ${
                    filtroAtivo === 'revisao' && tipoFiltro === 'queixas'
                      ? 'bg-[#3BC0A8]/15 text-gray-700 font-medium border border-[#3BC0A8]/30'
                      : 'hover:bg-[#3BC0A8]/10 text-gray-600'
                  }`}
                  onClick={() => handleSubmenuClick('revisao', 'queixas')}
                >
                  <span>Revisão</span>
                  <Badge className="ml-auto bg-red-50 text-red-700 border-red-200 hover:bg-red-50">1</Badge>
                </Button>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-sm transition-colors ${
                    filtroAtivo === 'retornado' && tipoFiltro === 'queixas'
                      ? 'bg-[#3BC0A8]/15 text-gray-700 font-medium border border-[#3BC0A8]/30'
                      : 'hover:bg-[#3BC0A8]/10 text-gray-600'
                  }`}
                  onClick={() => handleSubmenuClick('retornado', 'queixas')}
                >
                  <span>Retornado</span>
                  <Badge className="ml-auto bg-red-50 text-red-700 border-red-200 hover:bg-red-50">1</Badge>
                </Button>
              </CollapsibleContent>
            </Collapsible>

            {/* Seção Farmacovigilância */}
            <Collapsible open={isFarmacovigilanciaExpanded} onOpenChange={setIsFarmacovigilanciaExpanded}>
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 border group hover:bg-[#3BC0A8]/5 border-transparent hover:border-[#3BC0A8]/20">
                  <div className="flex items-center gap-3">
                    <div>
                      <Pill className="h-5 w-5 text-[#3BC0A8]" />
                    </div>
                    <span className="font-semibold text-gray-700">Farmacovigilância</span>
                    <Badge variant="destructive" className="ml-2">2</Badge>
                  </div>
                  {isFarmacovigilanciaExpanded ? (
                     <ChevronUp className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                   ) : (
                     <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                   )}
                 </div>
               </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 ml-6 mt-2">
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-sm transition-colors ${
                    filtroAtivo === 'revisao' && tipoFiltro === 'farmacovigilancia'
                      ? 'bg-[#3BC0A8]/15 text-gray-700 font-medium border border-[#3BC0A8]/30'
                      : 'hover:bg-[#3BC0A8]/10 text-gray-600'
                  }`}
                  onClick={() => handleSubmenuClick('revisao', 'farmacovigilancia')}
                >
                  <span>Revisão</span>
                  <Badge className="ml-auto bg-red-50 text-red-700 border-red-200 hover:bg-red-50">1</Badge>
                </Button>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-sm transition-colors ${
                    filtroAtivo === 'retornado' && tipoFiltro === 'farmacovigilancia'
                      ? 'bg-[#3BC0A8]/15 text-gray-700 font-medium border border-[#3BC0A8]/30'
                      : 'hover:bg-[#3BC0A8]/10 text-gray-600'
                  }`}
                  onClick={() => handleSubmenuClick('retornado', 'farmacovigilancia')}
                >
                  <span>Retornado</span>
                  <Badge className="ml-auto bg-red-50 text-red-700 border-red-200 hover:bg-red-50">1</Badge>
                </Button>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Conteúdo Principal - Lista de Casos */}
          <div className="flex-1 space-y-4">
            {casosExibidos.map((caso) => (
              <Card key={caso.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      {/* Linha 1: ID e Nome */}
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs font-mono">
                          ID: {caso.id}
                        </Badge>
                        <h3 className="font-semibold text-lg">{caso.nome}</h3>
                        <Badge className={getPrioridadeColor(caso.prioridade)}>
                          {caso.prioridade}
                        </Badge>
                      </div>

                      {/* Linha 2: Motivo Principal, Subcategoria e Detalhe */}
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="secondary" className="text-xs">
                          {caso.motivoPrincipal}
                        </Badge>
                        <ChevronRight className="h-3 w-3 text-gray-400" />
                        <Badge variant="secondary" className="text-xs">
                          {caso.subcategoria}
                        </Badge>
                        <ChevronRight className="h-3 w-3 text-gray-400" />
                        <Badge variant="secondary" className="text-xs">
                          {caso.detalhe}
                        </Badge>
                      </div>

                      {/* Linha 3: Protocolo, Data e Responsável */}
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>{caso.protocolo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{caso.dataHora}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{caso.responsavel}</span>
                        </div>
                      </div>
                    </div>

                    {/* Botão de Ação */}
                    <div className="ml-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/casos-pendentes/${caso.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Paginação */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-600">
                Mostrando {(paginaAtual - 1) * itensPorPagina + 1}-{Math.min(paginaAtual * itensPorPagina, casosFiltrados.length)} de {casosFiltrados.length} contatos
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
                  disabled={paginaAtual === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <span className="text-sm">
                  Página {paginaAtual} de {totalPaginasFiltradas}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setPaginaAtual(Math.min(totalPaginasFiltradas, paginaAtual + 1))}
                  disabled={paginaAtual === totalPaginasFiltradas}
                >
                  Próximo
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar - Eventos de Hoje */}
          <div className="w-80 space-y-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Eventos de Hoje
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {EVENTOS_HOJE.map((evento) => (
                  <div key={evento.id} className="border-l-4 border-blue-500 pl-3 py-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium text-sm">{evento.titulo}</h4>
                        <p className="text-xs text-gray-600">{evento.participantes}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {evento.horario}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}