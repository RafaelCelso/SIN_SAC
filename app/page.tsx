"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  FileText,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  Users,
  PhoneCall,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Bell,
  ShieldCheck,
  HelpCircle,
  Pill,
  Contact,
  DollarSign,
  Phone,
  MessageSquare,
  Mail,
  MessageCircle,
  ClipboardList,
  Eye,
} from "lucide-react"
import { IniciarAtendimentoModal } from "@/components/iniciar-atendimento-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Modificar os IDs dos protocolos para corresponder aos IDs na página de protocolos
const ATENDIMENTOS_MOCK = [
  {
    protocolo: "QT-2023-0001",
    data: "15/06/2023",
    nome: "Maria Silva",
    clienteId: "1",
    motivo: "Queixa Técnica",
    produto: "Medicamento A",
    status: "Em análise",
    statusVariant: "pending" as const,
  },
  {
    protocolo: "IM-2023-0001",
    data: "16/06/2023",
    nome: "Maria Silva",
    clienteId: "1",
    motivo: "Informação Médica",
    produto: "Medicamento A",
    status: "Respondido",
    statusVariant: "completed" as const,
  },
  {
    protocolo: "FV-2023-0001",
    data: "17/06/2023",
    nome: "Maria Silva",
    clienteId: "1",
    motivo: "Farmacovigilância",
    produto: "Medicamento A",
    status: "Concluído",
    statusVariant: "completed" as const,
  },
  {
    protocolo: "QT-2023-0002",
    data: "18/06/2023",
    nome: "João Santos",
    clienteId: "2",
    motivo: "Queixa Técnica",
    produto: "Medicamento B",
    status: "Concluído",
    statusVariant: "completed" as const,
  },
  {
    protocolo: "IM-2023-0002",
    data: "19/06/2023",
    nome: "João Santos",
    clienteId: "2",
    motivo: "Informação Médica",
    produto: "Medicamento B",
    status: "Em análise",
    statusVariant: "pending" as const,
  },
  {
    protocolo: "FV-2023-0002",
    data: "20/06/2023",
    nome: "João Santos",
    clienteId: "2",
    motivo: "Farmacovigilância",
    produto: "Medicamento B",
    status: "Em análise",
    statusVariant: "pending" as const,
  },
  {
    protocolo: "P-2023-001",
    data: "21/06/2023",
    nome: "Maria Silva",
    clienteId: "1",
    motivo: "Queixa Técnica",
    produto: "Medicamento A",
    status: "Em análise",
    statusVariant: "pending" as const,
  },
  {
    protocolo: "P-2023-045",
    data: "22/06/2023",
    nome: "Maria Silva",
    clienteId: "1",
    motivo: "Evento Adverso",
    produto: "Medicamento B",
    status: "Pendente",
    statusVariant: "pending" as const,
  },
]

// Lista de motivos e produtos para os filtros
const MOTIVOS = ["Queixa Técnica", "Evento Adverso", "Informação Médica", "Farmacovigilância", "Contato para retorno"]
const PRODUTOS = [
  "Medicamento A",
  "Medicamento B",
  "Medicamento C",
  "Medicamento D",
  "Medicamento E",
  "Medicamento F",
  "Dispositivo Médico X",
  "Dispositivo Médico Y",
]
const STATUS = ["Concluído", "Em análise", "Pendente"]

// Dados de estatísticas para os cards
const ESTATISTICAS = {
  atendimentosHoje: 12,
  atendimentosSemana: 78,
  atendimentosMes: 342,
  atendimentosPendentes: 24,
  tempoMedioAtendimento: "8 min",
  satisfacaoClientes: 92,
  chamadasPerdidas: 3,
  chamadasEmEspera: 5,
}

// Dados mockados para pendências
const PENDENCIAS_SUPERVISAO = [
  {
    id: 1,
    titulo: "Revisão de Protocolo QT-2023-0045",
    descricao: "Protocolo de queixa técnica aguarda revisão da supervisão",
    prioridade: "alta",
    prazo: "Hoje",
    responsavel: "Maria Silva"
  },
  {
    id: 2,
    titulo: "Aprovação de Relatório Mensal",
    descricao: "Relatório de atendimentos do mês aguarda aprovação",
    prioridade: "media",
    prazo: "Amanhã",
    responsavel: "João Santos"
  },
  {
    id: 3,
    titulo: "Análise de Indicadores",
    descricao: "Indicadores de qualidade precisam de análise detalhada",
    prioridade: "baixa",
    prazo: "Esta semana",
    responsavel: "Ana Costa"
  },
  {
    id: 4,
    titulo: "Validação de Processo",
    descricao: "Novo processo de atendimento precisa de validação",
    prioridade: "media",
    prazo: "Próxima semana",
    responsavel: "Carlos Oliveira"
  }
]

const PENDENCIAS_QUALIDADE = [
  {
    id: 1,
    titulo: "Auditoria Interna - Setor A",
    descricao: "Auditoria interna do setor A aguarda execução",
    prioridade: "alta",
    prazo: "Hoje",
    responsavel: "Carlos Lima"
  },
  {
    id: 2,
    titulo: "Não Conformidade NC-2023-008",
    descricao: "Não conformidade identificada precisa de plano de ação",
    prioridade: "alta",
    prazo: "Amanhã",
    responsavel: "Fernanda Rocha"
  },
  {
    id: 3,
    titulo: "Revisão de Procedimento",
    descricao: "Procedimento PQ-001 precisa de revisão anual",
    prioridade: "media",
    prazo: "Esta semana",
    responsavel: "Roberto Silva"
  },
  {
    id: 4,
    titulo: "Ação Corretiva AC-2023-015",
    descricao: "Ação corretiva aguarda implementação e verificação",
    prioridade: "alta",
    prazo: "Amanhã",
    responsavel: "Mariana Costa"
  }
]

const PENDENCIAS_FARMACOVIGILANCIA = [
  {
    id: 1,
    titulo: "Evento Adverso Grave - EA-2023-012",
    descricao: "Evento adverso grave aguarda investigação detalhada",
    prioridade: "alta",
    prazo: "Hoje",
    responsavel: "Dra. Patricia Mendes"
  },
  {
    id: 2,
    titulo: "Relatório ANVISA - Trimestral",
    descricao: "Relatório trimestral para ANVISA aguarda finalização",
    prioridade: "alta",
    prazo: "Amanhã",
    responsavel: "Dr. Ricardo Alves"
  },
  {
    id: 3,
    titulo: "Análise de Sinal de Segurança",
    descricao: "Sinal de segurança identificado precisa de análise",
    prioridade: "media",
    prazo: "Esta semana",
    responsavel: "Dra. Lucia Santos"
  },
  {
    id: 4,
    titulo: "PSUR - Relatório Periódico",
    descricao: "Relatório periódico de segurança aguarda elaboração",
    prioridade: "media",
    prazo: "Próxima semana",
    responsavel: "Dr. Fernando Lima"
  }
]

const PENDENCIAS_ATENDIMENTO = [
  {
    id: 1,
    titulo: "Retorno para Cliente - ID 1234",
    descricao: "Cliente aguarda retorno sobre consulta médica",
    prioridade: "alta",
    prazo: "Hoje",
    responsavel: "Atendente Maria"
  },
  {
    id: 2,
    titulo: "Protocolo IM-2023-0089 - Pendente",
    descricao: "Informação médica aguarda resposta do especialista",
    prioridade: "media",
    prazo: "Amanhã",
    responsavel: "Dr. José Silva"
  },
  {
    id: 3,
    titulo: "Chamada Não Atendida - Reagendar",
    descricao: "Cliente não atendeu chamada, reagendar contato",
    prioridade: "baixa",
    prazo: "Esta semana",
    responsavel: "Atendente João"
  },
  {
    id: 4,
    titulo: "Protocolo QT-2023-0156 - Análise",
    descricao: "Queixa técnica aguarda análise do departamento",
    prioridade: "media",
    prazo: "Amanhã",
    responsavel: "Analista Pedro"
  }
]

// Dados para Contatos
const CONTATOS_DATA = [
  {
    id: 2,
    nome: "João Carlos Oliveira",
    clienteId: "01",
    telefone: "(11) 88888-5678",
    email: "joao.oliveira@email.com",
    empresa: "Drogaria São Paulo",
    protocolo: "CT-2023-0002",
    dataHora: "14/12/2023 16:45",
    statusResolucao: "Pendente",
    usuarioRegistro: "Rafael Silva"
  },
  {
    id: 5,
    nome: "Fernanda Rocha Silva",
    clienteId: "02",
    telefone: "(11) 55555-7890",
    email: "fernanda.rocha@email.com",
    empresa: "Drogaria Bem Estar",
    protocolo: "CT-2023-0005",
    dataHora: "11/12/2023 15:50",
    statusResolucao: "Pendente",
    usuarioRegistro: "Mariana Santos"
  },
  {
    id: 6,
    nome: "Pedro Almeida",
    clienteId: "03",
    telefone: "(11) 44444-1234",
    email: "pedro.almeida@email.com",
    empresa: "Farmácia Popular",
    protocolo: "CT-2023-0006",
    dataHora: "19/12/2023 08:30",
    statusResolucao: "Pendente",
    usuarioRegistro: "João Costa"
  }
]

// Dados para Queixas Técnicas
const QUEIXAS_TECNICAS_DATA = [
  {
    id: 1,
    protocolo: "QT-2023-0045",
    produto: "Medicamento A - 500mg",
    cliente: "Maria Silva",
    clienteId: "01",
    descricao: "Comprimido com coloração alterada",
    dataAbertura: "15/12/2023",
    criadoPor: "Rafael Silva",
    status: "Revisão"
  },
  {
    id: 2,
    protocolo: "QT-2023-0046",
    produto: "Medicamento B - 250mg",
    cliente: "João Santos",
    clienteId: "02",
    descricao: "Embalagem danificada no transporte",
    dataAbertura: "14/12/2023",
    criadoPor: "Ana Costa",
    status: "Aberto"
  },
  {
    id: 3,
    protocolo: "QT-2023-0047",
    produto: "Medicamento C - 100mg",
    cliente: "Ana Costa",
    clienteId: "03",
    descricao: "Sabor alterado do medicamento",
    dataAbertura: "13/12/2023",
    criadoPor: "João Santos",
    status: "Retornado"
  }
]

// Dados para Farmacovigilância
const FARMACOVIGILANCIA_DATA = [
  {
    id: 1,
    protocolo: "FV-2023-0012",
    eventoAdverso: "Reação alérgica cutânea",
    medicamento: "Medicamento A",
    paciente: "Maria Silva",
    gravidade: "Moderado",
    dataOcorrencia: "12/12/2023",
    status: "Aberto",
    clienteId: "01",
    criadoPor: "Ana Silva"
  },
  {
    id: 2,
    protocolo: "FV-2023-0013",
    eventoAdverso: "Náusea e vômito",
    medicamento: "Medicamento B",
    paciente: "João Santos",
    gravidade: "Leve",
    dataOcorrencia: "11/12/2023",
    status: "Revisão",
    clienteId: "02",
    criadoPor: "Carlos Mendes"
  },
  {
    id: 3,
    protocolo: "FV-2023-0014",
    eventoAdverso: "Tontura e cefaleia",
    medicamento: "Medicamento C",
    paciente: "Ana Costa",
    gravidade: "Leve",
    dataOcorrencia: "10/12/2023",
    status: "Retornado",
    clienteId: "03",
    criadoPor: "João Santos"
  }
]

// Dados para Ressarcimento
const RESSARCIMENTO_DATA = [
  {
    id: 1,
    protocolo: "RS-2023-0008",
    cliente: "Farmácia Central",
    clienteId: "01",
    produto: "Medicamento A - Lote ABC123",
    valor: "R$ 1.250,00",
    motivo: "Produto vencido",
    dataAbertura: "10/12/2023",
    criadoPor: "Ana Silva",
    status: "Aprovado"
  },
  {
    id: 2,
    protocolo: "RS-2023-0009",
    cliente: "Drogaria São Paulo",
    clienteId: "02",
    produto: "Medicamento B - Lote DEF456",
    valor: "R$ 850,00",
    motivo: "Embalagem danificada",
    dataAbertura: "08/12/2023",
    criadoPor: "Carlos Mendes",
    status: "Em análise"
  },
  {
    id: 3,
    protocolo: "RS-2023-0010",
    cliente: "Farmácia Popular",
    clienteId: "03",
    produto: "Medicamento C - Lote GHI789",
    valor: "R$ 650,00",
    motivo: "Defeito de fabricação",
    dataAbertura: "05/12/2023",
    criadoPor: "João Santos",
    status: "Pendente"
  }
]

// Dados para Agenda
const AGENDA_DATA = [
  {
    id: 1,
    titulo: "Reunião de Supervisão",
    descricao: "Reunião semanal da equipe de supervisão",
    data: "18/12/2023",
    horario: "09:00",
    participantes: "Equipe Supervisão",
    local: "Sala de Reuniões A"
  },
  {
    id: 2,
    titulo: "Auditoria Interna",
    descricao: "Auditoria do processo de atendimento",
    data: "19/12/2023",
    horario: "14:00",
    participantes: "Auditores Internos",
    local: "Departamento de Qualidade"
  },
  {
    id: 3,
    titulo: "Treinamento Farmacovigilância",
    descricao: "Treinamento sobre novos procedimentos",
    data: "20/12/2023",
    horario: "10:00",
    participantes: "Equipe Farmacovigilância",
    local: "Auditório Principal"
  }
]

// Dados para o gráfico de atendimentos por motivo
const ATENDIMENTOS_POR_MOTIVO = [
  { motivo: "Queixa Técnica", quantidade: 45, percentual: 35 },
  { motivo: "Informação Médica", quantidade: 38, percentual: 30 },
  { motivo: "Farmacovigilância", quantidade: 25, percentual: 20 },
  { motivo: "Evento Adverso", quantidade: 15, percentual: 10 },
  { motivo: "Contato para retorno", quantidade: 7, percentual: 5 },
]

// Dados para o gráfico de atendimentos por produto
const ATENDIMENTOS_POR_PRODUTO = [
  { produto: "Medicamento A", quantidade: 52, percentual: 40 },
  { produto: "Medicamento B", quantidade: 39, percentual: 30 },
  { produto: "Medicamento C", quantidade: 26, percentual: 20 },
  { produto: "Dispositivo Médico X", quantidade: 13, percentual: 10 },
]

// Dados para o gráfico de tendência
const TENDENCIA_ATENDIMENTOS = [
  { dia: "Seg", quantidade: 18 },
  { dia: "Ter", quantidade: 22 },
  { dia: "Qua", quantidade: 25 },
  { dia: "Qui", quantidade: 20 },
  { dia: "Sex", quantidade: 15 },
  { dia: "Sáb", quantidade: 8 },
  { dia: "Dom", quantidade: 5 },
]

// Dados para as notificações
const NOTIFICACOES = [
  {
    id: 1,
    titulo: "Novo protocolo de farmacovigilância",
    descricao: "Protocolo FV-2023-0123 registrado e aguarda análise.",
    data: "Hoje, 10:30",
    tipo: "farmacovigilancia",
  },
  {
    id: 2,
    titulo: "Evento adverso crítico",
    descricao: "Evento adverso grave registrado para o Medicamento B.",
    data: "Hoje, 09:15",
    tipo: "evento-adverso",
  },
  {
    id: 3,
    titulo: "Lembrete de retorno",
    descricao: "3 clientes aguardam contato de retorno hoje.",
    data: "Hoje, 08:45",
    tipo: "retorno",
  },
  {
    id: 4,
    titulo: "Atualização de produto",
    descricao: "Medicamento C teve atualização na bula.",
    data: "Ontem, 16:20",
    tipo: "produto",
  },
]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAtendimentoModal, setShowAtendimentoModal] = useState(false)
  const [dataInicio, setDataInicio] = useState<Date>()
  const [dataFim, setDataFim] = useState<Date>()
  const [motivoFiltro, setMotivoFiltro] = useState<string>("")
  const [produtoFiltro, setProdutoFiltro] = useState<string>("")
  const [statusFiltro, setStatusFiltro] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)
  const [isAtendimentosExpanded, setIsAtendimentosExpanded] = useState(false)
  const [supervisaoSecaoAtiva, setSupervisaoSecaoAtiva] = useState("contatos")
  const [qualidadeSecaoAtiva, setQualidadeSecaoAtiva] = useState("auditorias")
  const [farmacovigilanciaSecaoAtiva, setFarmacovigilanciaSecaoAtiva] = useState("eventos")
  const [atendimentoSecaoAtiva, setAtendimentoSecaoAtiva] = useState("protocolos")

  // Filtrar atendimentos com base em todos os filtros
  const filteredAtendimentos = ATENDIMENTOS_MOCK.filter((atendimento) => {
    // Filtro de texto (busca)
    const matchesSearch =
      searchQuery === "" ||
      atendimento.protocolo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      atendimento.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      atendimento.motivo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      atendimento.produto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      atendimento.status.toLowerCase().includes(searchQuery.toLowerCase())

    // Filtro de data início
    const matchesDataInicio = !dataInicio || new Date(atendimento.data.split("/").reverse().join("-")) >= dataInicio

    // Filtro de data fim
    const matchesDataFim = !dataFim || new Date(atendimento.data.split("/").reverse().join("-")) <= dataFim

    // Filtro de motivo
    const matchesMotivo = !motivoFiltro || atendimento.motivo === motivoFiltro

    // Filtro de produto
    const matchesProduto = !produtoFiltro || atendimento.produto === produtoFiltro

    // Filtro de status
    const matchesStatus = !statusFiltro || atendimento.status === statusFiltro

    return matchesSearch && matchesDataInicio && matchesDataFim && matchesMotivo && matchesProduto && matchesStatus
  })

  const resetFilters = () => {
    setSearchQuery("")
    setDataInicio(undefined)
    setDataFim(undefined)
    setMotivoFiltro("")
    setProdutoFiltro("")
    setStatusFiltro("")
  }

  // Função para alternar manualmente o estado do collapsible
  const toggleCollapsible = () => {
    setIsAtendimentosExpanded(!isAtendimentosExpanded)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="p-4 rounded-lg flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Home</h1>
            <p className="text-sm text-gray-600 mt-1">Verifique suas pendências e outras informações</p>
          </div>
        </div>

        {/* Sistema de Abas */}
        <Tabs defaultValue="supervisao" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="supervisao">Supervisão</TabsTrigger>
            <TabsTrigger value="qualidade">Qualidade</TabsTrigger>
            <TabsTrigger value="farmacovigilancia">Farmacovigilância</TabsTrigger>
            <TabsTrigger value="atendimento">Atendimento</TabsTrigger>
          </TabsList>

          <TabsContent value="supervisao" className="space-y-6">
            {/* Layout com Sidebar */}
            <div className="flex gap-6">
              {/* Sidebar */}
              <div className="w-64 space-y-2 bg-gray-50 p-4 rounded-lg border">
                  <div className="space-y-1">
                  <Button
                    variant={supervisaoSecaoAtiva === "contatos" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSupervisaoSecaoAtiva("contatos")}
                  >
                    <Contact className="h-4 w-4 mr-2" />
                    Contatos
                  </Button>
                  <Button
                    variant={supervisaoSecaoAtiva === "queixas" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSupervisaoSecaoAtiva("queixas")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Queixas Técnicas
                  </Button>
                  <Button
                    variant={supervisaoSecaoAtiva === "farmacovigilancia" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSupervisaoSecaoAtiva("farmacovigilancia")}
                  >
                    <Pill className="h-4 w-4 mr-2" />
                    Farmacovigilância
                  </Button>
                  <Button
                    variant={supervisaoSecaoAtiva === "ressarcimento" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSupervisaoSecaoAtiva("ressarcimento")}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Ressarcimento
                  </Button>
                  <Button
                    variant={supervisaoSecaoAtiva === "agenda" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSupervisaoSecaoAtiva("agenda")}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Agenda
                  </Button>
                </div>
              </div>

              {/* Conteúdo Principal */}
              <div className="flex-1">
                {/* Seção Contatos */}
                {supervisaoSecaoAtiva === "contatos" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Contatos Pendentes</h2>
                    </div>
                    <div className="grid gap-4">
                      {CONTATOS_DATA.map((contato) => (
                        <Card key={contato.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <Badge variant="outline" className="text-xs">
                                    ID: {contato.clienteId}
                                  </Badge>
                                  <h3 className="font-medium">{contato.nome}</h3>
                                  <Badge variant="destructive">
                                    {contato.statusResolucao}
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <span><strong>Protocolo:</strong> {contato.protocolo}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span><strong>Data/Hora:</strong> {contato.dataHora}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span><strong>Registrado por:</strong> {contato.usuarioRegistro}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seção Queixas Técnicas */}
                {supervisaoSecaoAtiva === "queixas" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Queixas Técnicas</h2>
                    </div>
                    <div className="grid gap-4">
                      {QUEIXAS_TECNICAS_DATA.map((queixa) => (
                        <Card key={queixa.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{queixa.protocolo}</h3>
                                  <Badge variant={queixa.status === "Retornado" ? "destructive" : queixa.status === "Revisão" ? "secondary" : "outline"}>
                                    {queixa.status}
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <span><strong>Cliente:</strong></span>
                                    <Badge variant="outline" className="text-xs">
                                      ID: {queixa.clienteId}
                                    </Badge>
                                    <span>{queixa.cliente}</span>
                                  </div>
                                  <div><strong>Criado em:</strong> {queixa.dataAbertura}</div>
                                  <div><strong>Criado por:</strong> {queixa.criadoPor}</div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seção Farmacovigilância */}
                {supervisaoSecaoAtiva === "farmacovigilancia" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Farmacovigilância</h2>
                    </div>
                    <div className="grid gap-4">
                      {FARMACOVIGILANCIA_DATA.map((evento) => (
                        <Card key={evento.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{evento.protocolo}</h3>
                                  <Badge variant={evento.gravidade === "Moderado" ? "destructive" : "secondary"}>
                                    {evento.gravidade}
                                  </Badge>
                                  <Badge variant={evento.status === "Aberto" ? "default" : evento.status === "Revisão" ? "secondary" : "outline"}>
                                    {evento.status}
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div><strong>Paciente:</strong> <Badge variant="outline" size="xs">ID: {evento.clienteId}</Badge> {evento.paciente}</div>
                                  <div><strong>Criado em:</strong> {evento.dataOcorrencia}</div>
                                  <div><strong>Criado por:</strong> {evento.criadoPor}</div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seção Ressarcimento */}
                {supervisaoSecaoAtiva === "ressarcimento" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Ressarcimento</h2>
                    </div>
                    <div className="grid gap-4">
                      {RESSARCIMENTO_DATA.map((ressarcimento) => (
                        <Card key={ressarcimento.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{ressarcimento.protocolo}</h3>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <strong>Cliente:</strong>
                                    <Badge variant="outline" size="xs">ID: {ressarcimento.clienteId}</Badge>
                                    <span>{ressarcimento.cliente}</span>
                                  </div>
                                  <div><strong>Criado em:</strong> {ressarcimento.dataAbertura}</div>
                                  <div><strong>Criado por:</strong> {ressarcimento.criadoPor}</div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seção Agenda */}
                {supervisaoSecaoAtiva === "agenda" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Agenda</h2>
                    </div>
                    <div className="grid gap-4">
                      {AGENDA_DATA.map((evento) => (
                        <Card key={evento.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <h3 className="font-medium">{evento.titulo}</h3>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div><strong>Descrição:</strong> {evento.descricao}</div>
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                      <CalendarIcon className="h-4 w-4" />
                                      <span>{evento.data}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      <span>{evento.horario}</span>
                                    </div>
                                  </div>
                                  <div><strong>Participantes:</strong> {evento.participantes}</div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Button size="sm" variant="outline">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="qualidade" className="space-y-6">
            {/* Layout com Sidebar */}
            <div className="flex gap-6">
              {/* Sidebar */}
              <div className="w-64 space-y-2 bg-gray-50 p-4 rounded-lg border">
                <div className="space-y-1">
                  <Button
                    variant={qualidadeSecaoAtiva === "auditorias" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setQualidadeSecaoAtiva("auditorias")}
                  >
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Auditorias
                  </Button>
                  <Button
                    variant={qualidadeSecaoAtiva === "nao-conformidades" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setQualidadeSecaoAtiva("nao-conformidades")}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Não Conformidades
                  </Button>
                  <Button
                    variant={qualidadeSecaoAtiva === "acoes-corretivas" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setQualidadeSecaoAtiva("acoes-corretivas")}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Ações Corretivas
                  </Button>
                  <Button
                    variant={qualidadeSecaoAtiva === "procedimentos" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setQualidadeSecaoAtiva("procedimentos")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Procedimentos
                  </Button>
                </div>
              </div>

              {/* Conteúdo Principal */}
              <div className="flex-1">
                {/* Seção Auditorias */}
                {qualidadeSecaoAtiva === "auditorias" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Auditorias</h2>
                      <Button size="sm">
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Nova Auditoria
                      </Button>
                    </div>
                    <div className="grid gap-4">
                      {PENDENCIAS_QUALIDADE.filter(p => p.titulo.includes("Auditoria")).map((pendencia) => (
                        <Card key={pendencia.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{pendencia.titulo}</h3>
                                  <Badge variant={pendencia.prioridade === "alta" ? "destructive" : pendencia.prioridade === "media" ? "default" : "secondary"}>
                                    {pendencia.prioridade === "alta" ? "Alta" : pendencia.prioridade === "media" ? "Média" : "Baixa"}
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div><strong>Descrição:</strong> {pendencia.descricao}</div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span><strong>Prazo:</strong> {pendencia.prazo}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span><strong>Responsável:</strong> {pendencia.responsavel}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seção Não Conformidades */}
                {qualidadeSecaoAtiva === "nao-conformidades" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Não Conformidades</h2>
                      <Button size="sm">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Nova NC
                      </Button>
                    </div>
                    <div className="grid gap-4">
                      {PENDENCIAS_QUALIDADE.filter(p => p.titulo.includes("Não Conformidade")).map((pendencia) => (
                        <Card key={pendencia.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{pendencia.titulo}</h3>
                                  <Badge variant={pendencia.prioridade === "alta" ? "destructive" : pendencia.prioridade === "media" ? "default" : "secondary"}>
                                    {pendencia.prioridade === "alta" ? "Alta" : pendencia.prioridade === "media" ? "Média" : "Baixa"}
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div><strong>Descrição:</strong> {pendencia.descricao}</div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span><strong>Prazo:</strong> {pendencia.prazo}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span><strong>Responsável:</strong> {pendencia.responsavel}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seção Ações Corretivas */}
                {qualidadeSecaoAtiva === "acoes-corretivas" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Ações Corretivas</h2>
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Nova Ação
                      </Button>
                    </div>
                    <div className="grid gap-4">
                      {PENDENCIAS_QUALIDADE.filter(p => p.titulo.includes("Ação Corretiva")).map((pendencia) => (
                        <Card key={pendencia.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{pendencia.titulo}</h3>
                                  <Badge variant={pendencia.prioridade === "alta" ? "destructive" : pendencia.prioridade === "media" ? "default" : "secondary"}>
                                    {pendencia.prioridade === "alta" ? "Alta" : pendencia.prioridade === "media" ? "Média" : "Baixa"}
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div><strong>Descrição:</strong> {pendencia.descricao}</div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span><strong>Prazo:</strong> {pendencia.prazo}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span><strong>Responsável:</strong> {pendencia.responsavel}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seção Procedimentos */}
                {qualidadeSecaoAtiva === "procedimentos" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Procedimentos</h2>
                      <Button size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Novo Procedimento
                      </Button>
                    </div>
                    <div className="grid gap-4">
                      {PENDENCIAS_QUALIDADE.filter(p => p.titulo.includes("Procedimento")).map((pendencia) => (
                        <Card key={pendencia.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{pendencia.titulo}</h3>
                                  <Badge variant={pendencia.prioridade === "alta" ? "destructive" : pendencia.prioridade === "media" ? "default" : "secondary"}>
                                    {pendencia.prioridade === "alta" ? "Alta" : pendencia.prioridade === "media" ? "Média" : "Baixa"}
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div><strong>Descrição:</strong> {pendencia.descricao}</div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span><strong>Prazo:</strong> {pendencia.prazo}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span><strong>Responsável:</strong> {pendencia.responsavel}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="farmacovigilancia" className="space-y-6">
            {/* Layout com Sidebar */}
            <div className="flex gap-6">
              {/* Sidebar */}
              <div className="w-64 space-y-2 bg-gray-50 p-4 rounded-lg border">
                <div className="space-y-1">
                  <Button
                    variant={farmacovigilanciaSecaoAtiva === "eventos" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setFarmacovigilanciaSecaoAtiva("eventos")}
                  >
                    <Pill className="h-4 w-4 mr-2" />
                    Eventos Adversos
                  </Button>
                  <Button
                    variant={farmacovigilanciaSecaoAtiva === "relatorios" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setFarmacovigilanciaSecaoAtiva("relatorios")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Relatórios ANVISA
                  </Button>
                  <Button
                    variant={farmacovigilanciaSecaoAtiva === "sinais" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setFarmacovigilanciaSecaoAtiva("sinais")}
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Sinais de Segurança
                  </Button>
                  <Button
                    variant={farmacovigilanciaSecaoAtiva === "psur" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setFarmacovigilanciaSecaoAtiva("psur")}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    PSUR
                  </Button>
                </div>
              </div>

              {/* Conteúdo Principal */}
              <div className="flex-1">
                {/* Seção Eventos Adversos */}
                {farmacovigilanciaSecaoAtiva === "eventos" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Eventos Adversos</h2>
                      <Button size="sm">
                        <Pill className="h-4 w-4 mr-2" />
                        Novo Evento
                      </Button>
                    </div>
                    <div className="grid gap-4">
                      {PENDENCIAS_FARMACOVIGILANCIA.filter(p => p.titulo.includes("Evento Adverso")).map((pendencia) => (
                        <Card key={pendencia.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{pendencia.titulo}</h3>
                                  <Badge variant={pendencia.prioridade === "alta" ? "destructive" : pendencia.prioridade === "media" ? "default" : "secondary"}>
                                    {pendencia.prioridade === "alta" ? "Alta" : pendencia.prioridade === "media" ? "Média" : "Baixa"}
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div><strong>Descrição:</strong> {pendencia.descricao}</div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span><strong>Prazo:</strong> {pendencia.prazo}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span><strong>Responsável:</strong> {pendencia.responsavel}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Button size="sm" variant="outline">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seção Relatórios ANVISA */}
                {farmacovigilanciaSecaoAtiva === "relatorios" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Relatórios ANVISA</h2>
                      <Button size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Novo Relatório
                      </Button>
                    </div>
                    <div className="grid gap-4">
                      {PENDENCIAS_FARMACOVIGILANCIA.filter(p => p.titulo.includes("Relatório ANVISA")).map((pendencia) => (
                        <Card key={pendencia.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{pendencia.titulo}</h3>
                                  <Badge variant={pendencia.prioridade === "alta" ? "destructive" : pendencia.prioridade === "media" ? "default" : "secondary"}>
                                    {pendencia.prioridade === "alta" ? "Alta" : pendencia.prioridade === "media" ? "Média" : "Baixa"}
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div><strong>Descrição:</strong> {pendencia.descricao}</div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span><strong>Prazo:</strong> {pendencia.prazo}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span><strong>Responsável:</strong> {pendencia.responsavel}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seção Sinais de Segurança */}
                {farmacovigilanciaSecaoAtiva === "sinais" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Sinais de Segurança</h2>
                      <Button size="sm">
                        <Activity className="h-4 w-4 mr-2" />
                        Novo Sinal
                      </Button>
                    </div>
                    <div className="grid gap-4">
                      {PENDENCIAS_FARMACOVIGILANCIA.filter(p => p.titulo.includes("Sinal de Segurança")).map((pendencia) => (
                        <Card key={pendencia.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{pendencia.titulo}</h3>
                                  <Badge variant={pendencia.prioridade === "alta" ? "destructive" : pendencia.prioridade === "media" ? "default" : "secondary"}>
                                    {pendencia.prioridade === "alta" ? "Alta" : pendencia.prioridade === "media" ? "Média" : "Baixa"}
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div><strong>Descrição:</strong> {pendencia.descricao}</div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span><strong>Prazo:</strong> {pendencia.prazo}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span><strong>Responsável:</strong> {pendencia.responsavel}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Button size="sm" variant="outline">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seção PSUR */}
                {farmacovigilanciaSecaoAtiva === "psur" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">PSUR - Relatórios Periódicos</h2>
                      <Button size="sm">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Novo PSUR
                      </Button>
                    </div>
                    <div className="grid gap-4">
                      {PENDENCIAS_FARMACOVIGILANCIA.filter(p => p.titulo.includes("PSUR")).map((pendencia) => (
                        <Card key={pendencia.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{pendencia.titulo}</h3>
                                  <Badge variant={pendencia.prioridade === "alta" ? "destructive" : pendencia.prioridade === "media" ? "default" : "secondary"}>
                                    {pendencia.prioridade === "alta" ? "Alta" : pendencia.prioridade === "media" ? "Média" : "Baixa"}
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div><strong>Descrição:</strong> {pendencia.descricao}</div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span><strong>Prazo:</strong> {pendencia.prazo}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span><strong>Responsável:</strong> {pendencia.responsavel}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="atendimento" className="space-y-6">
            {/* Layout com Sidebar */}
            <div className="flex gap-6">
              {/* Sidebar */}
              <div className="w-64 space-y-2 bg-gray-50 p-4 rounded-lg border">
                <div className="space-y-1">
                  <Button
                    variant={atendimentoSecaoAtiva === "chamados" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setAtendimentoSecaoAtiva("chamados")}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Chamados
                  </Button>
                  <Button
                    variant={atendimentoSecaoAtiva === "chat" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setAtendimentoSecaoAtiva("chat")}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat Online
                  </Button>
                  <Button
                    variant={atendimentoSecaoAtiva === "email" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setAtendimentoSecaoAtiva("email")}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    E-mail
                  </Button>
                  <Button
                    variant={atendimentoSecaoAtiva === "whatsapp" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setAtendimentoSecaoAtiva("whatsapp")}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </div>

              {/* Conteúdo Principal */}
              <div className="flex-1">
                {/* Seção Chamados */}
                {atendimentoSecaoAtiva === "chamados" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Chamados Telefônicos</h2>
                      <Button size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Novo Chamado
                      </Button>
                    </div>
                    <div className="grid gap-4">
                      {PENDENCIAS_ATENDIMENTO.filter(p => p.titulo.includes("Chamado")).map((pendencia) => (
                        <Card key={pendencia.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{pendencia.titulo}</h3>
                                  <Badge variant={pendencia.prioridade === "alta" ? "destructive" : pendencia.prioridade === "media" ? "default" : "secondary"}>
                                    {pendencia.prioridade === "alta" ? "Alta" : pendencia.prioridade === "media" ? "Média" : "Baixa"}
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div><strong>Descrição:</strong> {pendencia.descricao}</div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span><strong>Prazo:</strong> {pendencia.prazo}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span><strong>Responsável:</strong> {pendencia.responsavel}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Button size="sm" variant="outline">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seção Chat Online */}
                {atendimentoSecaoAtiva === "chat" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Chat Online</h2>
                      <Button size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Nova Conversa
                      </Button>
                    </div>
                    <div className="grid gap-4">
                      {PENDENCIAS_ATENDIMENTO.filter(p => p.titulo.includes("Chat")).map((pendencia) => (
                        <Card key={pendencia.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{pendencia.titulo}</h3>
                                  <Badge variant={pendencia.prioridade === "alta" ? "destructive" : pendencia.prioridade === "media" ? "default" : "secondary"}>
                                    {pendencia.prioridade === "alta" ? "Alta" : pendencia.prioridade === "media" ? "Média" : "Baixa"}
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div><strong>Descrição:</strong> {pendencia.descricao}</div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span><strong>Prazo:</strong> {pendencia.prazo}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span><strong>Responsável:</strong> {pendencia.responsavel}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seção E-mail */}
                {atendimentoSecaoAtiva === "email" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Atendimento por E-mail</h2>
                      <Button size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Novo E-mail
                      </Button>
                    </div>
                    <div className="grid gap-4">
                      {PENDENCIAS_ATENDIMENTO.filter(p => p.titulo.includes("E-mail")).map((pendencia) => (
                        <Card key={pendencia.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{pendencia.titulo}</h3>
                                  <Badge variant={pendencia.prioridade === "alta" ? "destructive" : pendencia.prioridade === "media" ? "default" : "secondary"}>
                                    {pendencia.prioridade === "alta" ? "Alta" : pendencia.prioridade === "media" ? "Média" : "Baixa"}
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div><strong>Descrição:</strong> {pendencia.descricao}</div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span><strong>Prazo:</strong> {pendencia.prazo}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span><strong>Responsável:</strong> {pendencia.responsavel}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seção WhatsApp */}
                {atendimentoSecaoAtiva === "whatsapp" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Atendimento WhatsApp</h2>
                      <Button size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Nova Conversa
                      </Button>
                    </div>
                    <div className="grid gap-4">
                      {PENDENCIAS_ATENDIMENTO.filter(p => p.titulo.includes("WhatsApp")).map((pendencia) => (
                        <Card key={pendencia.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{pendencia.titulo}</h3>
                                  <Badge variant={pendencia.prioridade === "alta" ? "destructive" : pendencia.prioridade === "media" ? "default" : "secondary"}>
                                    {pendencia.prioridade === "alta" ? "Alta" : pendencia.prioridade === "media" ? "Média" : "Baixa"}
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div><strong>Descrição:</strong> {pendencia.descricao}</div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span><strong>Prazo:</strong> {pendencia.prazo}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span><strong>Responsável:</strong> {pendencia.responsavel}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <IniciarAtendimentoModal open={showAtendimentoModal} onOpenChange={setShowAtendimentoModal} />
    </DashboardLayout>
  )
}

