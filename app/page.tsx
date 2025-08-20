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
const CONTATOS_CLIENTE_DATA = [
  {
    id: 2,
    nome: "João Carlos Oliveira",
    clienteId: "01",
    telefone: "(11) 88888-5678",
    email: "joao.oliveira@email.com",
    empresa: "Drogaria São Paulo",
    protocolo: "CT-2023-0002",
    dataHora: "14/12/2023 16:45",
    motivo: "Não tinha tempo suficiente",
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
    motivo: "Sem interesse",
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
    motivo: "Reagendar",
    statusResolucao: "Pendente",
    usuarioRegistro: "João Costa"
  },
  {
    id: 11,
    nome: "Carlos Mendes",
    clienteId: "04",
    telefone: "(11) 77777-9999",
    email: "carlos.mendes@email.com",
    empresa: "Farmácia Central",
    protocolo: "CT-2023-0011",
    dataHora: "18/12/2023 11:15",
    motivo: "Não tinha informações suficientes",
    statusResolucao: "Pendente",
    usuarioRegistro: "Ana Silva"
  }
]

const CONTATOS_INTERNO_DATA = [
  {
    id: 7,
    departamento: "Qualidade",
    responsavel: "Ana Silva",
    setor: "Controle de Qualidade",
    telefone: "(11) 3333-4567",
    email: "ana.silva@empresa.com",
    protocolo: "CI-2023-0007",
    dataHora: "15/12/2023 14:20",
    motivo: "Aguardando resposta do laboratório",
    statusResolucao: "Pendente",
    usuarioRegistro: "Carlos Lima"
  },
  {
    id: 8,
    departamento: "Farmacovigilância",
    responsavel: "Dr. Ricardo Alves",
    setor: "Segurança de Medicamentos",
    telefone: "(11) 2222-3456",
    email: "ricardo.alves@empresa.com",
    protocolo: "CI-2023-0008",
    dataHora: "13/12/2023 09:15",
    motivo: "Confirmação",
    statusResolucao: "Pendente",
    usuarioRegistro: "Patricia Mendes"
  },
  {
    id: 9,
    departamento: "Regulatório",
    responsavel: "Mariana Costa",
    setor: "Assuntos Regulatórios",
    telefone: "(11) 1111-2345",
    email: "mariana.costa@empresa.com",
    protocolo: "CI-2023-0009",
    dataHora: "12/12/2023 16:30",
    motivo: "Pendência de documentação",
    statusResolucao: "Pendente",
    usuarioRegistro: "Roberto Silva"
  },
  {
    id: 10,
    departamento: "Produção",
    responsavel: "Pedro Lima",
    setor: "Controle de Produção",
    telefone: "(11) 4444-5678",
    email: "pedro.lima@empresa.com",
    protocolo: "CI-2023-0010",
    dataHora: "11/12/2023 10:45",
    motivo: "Em análise",
    statusResolucao: "Pendente",
    usuarioRegistro: "Ana Silva"
  }
]

const CONTATOS_REVIS_DATA = [
  {
    id: 12,
    departamento: "Supervisão",
    responsavel: "Carlos Mendes",
    setor: "Revisão de Protocolos",
    telefone: "(11) 5555-1234",
    email: "carlos.mendes@empresa.com",
    protocolo: "CR-2023-0012",
    dataHora: "16/12/2023 10:30",
    motivo: "Revisão pendente",
    statusResolucao: "Pendente",
    usuarioRegistro: "Ana Silva"
  },
  {
    id: 13,
    departamento: "Qualidade",
    responsavel: "Fernanda Santos",
    setor: "Auditoria Interna",
    telefone: "(11) 6666-5678",
    email: "fernanda.santos@empresa.com",
    protocolo: "CR-2023-0013",
    dataHora: "14/12/2023 14:15",
    motivo: "Aguardando aprovação",
    statusResolucao: "Pendente",
    usuarioRegistro: "Roberto Silva"
  },
  {
    id: 14,
    departamento: "Regulatório",
    responsavel: "João Costa",
    setor: "Compliance",
    telefone: "(11) 7777-9012",
    email: "joao.costa@empresa.com",
    protocolo: "CR-2023-0014",
    dataHora: "13/12/2023 16:45",
    motivo: "Correção necessária",
    statusResolucao: "Pendente",
    usuarioRegistro: "Patricia Mendes"
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
  const [supervisaoSecaoAtiva, setSupervisaoSecaoAtiva] = useState("contatos-cliente")
  const [contatosExpandido, setContatosExpandido] = useState(true)
  const [queixasExpandido, setQueixasExpandido] = useState(false)
  const [farmacovigilanciaExpandido, setFarmacovigilanciaExpandido] = useState(false)
  const [qualidadeSecaoAtiva, setQualidadeSecaoAtiva] = useState("auditorias")
  const [farmacovigilanciaSecaoAtiva, setFarmacovigilanciaSecaoAtiva] = useState("eventos")
  const [atendimentoSecaoAtiva, setAtendimentoSecaoAtiva] = useState("protocolos")

  // Funções para calcular contagens de pendências
  const getContatosClienteCount = () => CONTATOS_CLIENTE_DATA.filter(c => c.statusResolucao === "Pendente").length
  const getContatosInternoCount = () => CONTATOS_INTERNO_DATA.filter(c => c.statusResolucao === "Pendente").length
  const getQueixasRevisaoCount = () => QUEIXAS_TECNICAS_DATA.filter(q => q.status === "Revisão").length
  const getQueixasRetornadoCount = () => QUEIXAS_TECNICAS_DATA.filter(q => q.status === "Retornado").length
  const getFarmacovigilanciaRevisaoCount = () => FARMACOVIGILANCIA_DATA.filter(f => f.status === "Revisão").length
  const getFarmacovigilanciaRetornadoCount = () => FARMACOVIGILANCIA_DATA.filter(f => f.status === "Retornado").length
  const getTotalContatosCount = () => getContatosClienteCount() + getContatosInternoCount()
  const getTotalQueixasCount = () => getQueixasRevisaoCount() + getQueixasRetornadoCount()
  const getTotalFarmacovigilanciaCount = () => getFarmacovigilanciaRevisaoCount() + getFarmacovigilanciaRetornadoCount()

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
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Pendências</h3>
                </div>
                  <div className="space-y-1">
                  <Collapsible open={contatosExpandido} onOpenChange={setContatosExpandido}>
                    <Button
                      variant={supervisaoSecaoAtiva.startsWith("contatos") ? "default" : "ghost"}
                      className="w-full justify-between"
                      onClick={() => setContatosExpandido(!contatosExpandido)}
                    >
                      <div className="flex items-center">
                        <Contact className="h-4 w-4 mr-2" />
                        Contatos
                        {getTotalContatosCount() > 0 && (
                          <Badge variant="destructive" className="ml-2 text-xs">
                            {getTotalContatosCount()}
                          </Badge>
                        )}
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${contatosExpandido ? 'rotate-180' : ''}`} />
                    </Button>
                    <CollapsibleContent className="ml-6 mt-1 space-y-1">
                      <Button
                        variant={supervisaoSecaoAtiva === "contatos-cliente" ? "default" : "ghost"}
                        className="w-full justify-between text-sm"
                        onClick={() => setSupervisaoSecaoAtiva("contatos-cliente")}
                      >
                        <span>Cliente</span>
                        {getContatosClienteCount() > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {getContatosClienteCount()}
                          </Badge>
                        )}
                      </Button>
                      <Button
                        variant={supervisaoSecaoAtiva === "contatos-interno" ? "default" : "ghost"}
                        className="w-full justify-between text-sm"
                        onClick={() => setSupervisaoSecaoAtiva("contatos-interno")}
                      >
                        <span>Interno</span>
                        {getContatosInternoCount() > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {getContatosInternoCount()}
                          </Badge>
                        )}
                      </Button>
                    </CollapsibleContent>
                  </Collapsible>
                  <Collapsible open={queixasExpandido} onOpenChange={setQueixasExpandido}>
                    <Button
                      variant={supervisaoSecaoAtiva.startsWith("queixas") ? "default" : "ghost"}
                      className="w-full justify-between"
                      onClick={() => setQueixasExpandido(!queixasExpandido)}
                    >
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Queixas Técnicas
                        {getTotalQueixasCount() > 0 && (
                          <Badge variant="destructive" className="ml-2 text-xs">
                            {getTotalQueixasCount()}
                          </Badge>
                        )}
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${queixasExpandido ? 'rotate-180' : ''}`} />
                    </Button>
                    <CollapsibleContent className="ml-6 mt-1 space-y-1">
                      <Button
                        variant={supervisaoSecaoAtiva === "queixas-revisao" ? "default" : "ghost"}
                        className="w-full justify-between text-sm"
                        onClick={() => setSupervisaoSecaoAtiva("queixas-revisao")}
                      >
                        <span>Revisão</span>
                        {getQueixasRevisaoCount() > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {getQueixasRevisaoCount()}
                          </Badge>
                        )}
                      </Button>
                      <Button
                        variant={supervisaoSecaoAtiva === "queixas-retornado" ? "default" : "ghost"}
                        className="w-full justify-between text-sm"
                        onClick={() => setSupervisaoSecaoAtiva("queixas-retornado")}
                      >
                        <span>Retornado</span>
                        {getQueixasRetornadoCount() > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {getQueixasRetornadoCount()}
                          </Badge>
                        )}
                      </Button>
                    </CollapsibleContent>
                  </Collapsible>
                  <Collapsible open={farmacovigilanciaExpandido} onOpenChange={setFarmacovigilanciaExpandido}>
                    <Button
                      variant={supervisaoSecaoAtiva.startsWith("farmacovigilancia") ? "default" : "ghost"}
                      className="w-full justify-between"
                      onClick={() => setFarmacovigilanciaExpandido(!farmacovigilanciaExpandido)}
                    >
                      <div className="flex items-center">
                        <Pill className="h-4 w-4 mr-2" />
                        Farmacovigilância
                        {getTotalFarmacovigilanciaCount() > 0 && (
                          <Badge variant="destructive" className="ml-2 text-xs">
                            {getTotalFarmacovigilanciaCount()}
                          </Badge>
                        )}
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${farmacovigilanciaExpandido ? 'rotate-180' : ''}`} />
                    </Button>
                    <CollapsibleContent className="ml-6 mt-1 space-y-1">
                      <Button
                        variant={supervisaoSecaoAtiva === "farmacovigilancia-revisao" ? "default" : "ghost"}
                        className="w-full justify-between text-sm"
                        onClick={() => setSupervisaoSecaoAtiva("farmacovigilancia-revisao")}
                      >
                        <span>Revisão</span>
                        {getFarmacovigilanciaRevisaoCount() > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {getFarmacovigilanciaRevisaoCount()}
                          </Badge>
                        )}
                      </Button>
                      <Button
                        variant={supervisaoSecaoAtiva === "farmacovigilancia-retornado" ? "default" : "ghost"}
                        className="w-full justify-between text-sm"
                        onClick={() => setSupervisaoSecaoAtiva("farmacovigilancia-retornado")}
                      >
                        <span>Retornado</span>
                        {getFarmacovigilanciaRetornadoCount() > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {getFarmacovigilanciaRetornadoCount()}
                          </Badge>
                        )}
                      </Button>
                    </CollapsibleContent>
                  </Collapsible>

                </div>
              </div>

              {/* Conteúdo Principal */}
              <div className="flex-1">
                {/* Seção Contatos */}
                {(supervisaoSecaoAtiva === "contatos" || supervisaoSecaoAtiva === "contatos-cliente" || supervisaoSecaoAtiva === "contatos-interno") && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <div>
                         <h2 className="text-xl font-semibold">Contatos pendentes de resolução</h2>
                         <p className="text-sm text-gray-600 mt-1">
                           {supervisaoSecaoAtiva === "contatos-interno" 
                             ? "Contatos não resolvidos por motivos internos"
                             : "Contatos não resolvidos por motivos relacionados ao cliente"
                           }
                         </p>
                       </div>
                     </div>
                    <div className="grid gap-4">
                      {(supervisaoSecaoAtiva === "contatos-interno" ? CONTATOS_INTERNO_DATA : CONTATOS_CLIENTE_DATA).map((contato) => (
                        <Card key={contato.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                {supervisaoSecaoAtiva === "contatos-interno" ? (
                                  // Layout para contatos internos
                                  <>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="text-xs">
                                          ID: {contato.id}
                                        </Badge>
                                        <h3 className="font-medium">{contato.responsavel}</h3>
                                        <Badge variant={contato.motivo === "Aguardando resposta do laboratório" ? "destructive" : contato.motivo === "Em análise" ? "secondary" : "outline"}>
                                          {contato.motivo}
                                        </Badge>
                                      </div>
                                     <div className="space-y-1 text-sm text-muted-foreground">
                                       <div className="flex items-center gap-2">
                                         <FileText className="h-4 w-4" />
                                         <span><strong>Protocolo:</strong> {contato.protocolo}</span>
                                       </div>
                                       <div className="flex items-center gap-2">
                                         <CalendarIcon className="h-4 w-4" />
                                         <span><strong>Criado em:</strong> {contato.dataHora}</span>
                                       </div>
                                       <div className="flex items-center gap-2">
                                         <Users className="h-4 w-4" />
                                         <span><strong>Criado por:</strong> {contato.usuarioRegistro}</span>
                                       </div>
                                     </div>
                                  </>
                                ) : (
                                  // Layout para contatos de clientes
                                  <>
                                    <div className="flex items-center gap-3">
                                      <Badge variant="outline" className="text-xs">
                                        ID: {contato.clienteId}
                                      </Badge>
                                      <h3 className="font-medium">{contato.nome}</h3>
                                      <Badge variant={
                                        contato.motivo === "Não tinha tempo suficiente" ? "destructive" :
                                        contato.motivo === "Sem interesse" ? "secondary" :
                                        contato.motivo === "Reagendar" ? "outline" :
                                        contato.motivo === "Não tinha informações suficientes" ? "default" :
                                        "outline"
                                      } className={
                                        contato.motivo === "Não tinha tempo suficiente" ? "bg-red-50 text-red-700 border-red-200" :
                                        contato.motivo === "Sem interesse" ? "bg-gray-50 text-gray-700 border-gray-200" :
                                        contato.motivo === "Reagendar" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                        contato.motivo === "Não tinha informações suficientes" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                        "bg-gray-50 text-gray-700 border-gray-200"
                                      }>
                                        {contato.motivo}
                                      </Badge>
                                    </div>
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        <span><strong>Protocolo:</strong> {contato.protocolo}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span><strong>Criado em:</strong> {contato.dataHora}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span><strong>Criado por:</strong> {contato.usuarioRegistro}</span>
                                      </div>
                                    </div>
                                  </>
                                )}
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

                {/* Seção Queixas Técnicas - Revisão */}
                {supervisaoSecaoAtiva === "queixas-revisao" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Queixas Técnicas - Revisão</h2>
                    </div>
                    <div className="grid gap-4">
                      {QUEIXAS_TECNICAS_DATA.filter(queixa => queixa.status === "Revisão").map((queixa) => (
                        <Card key={queixa.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{queixa.protocolo}</h3>
                                  <Badge variant="secondary">
                                    {queixa.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="secondary" className="text-xs">
                                    Motivo
                                  </Badge>
                                  <ChevronDown className="h-3 w-3 rotate-[-90deg]" />
                                  <Badge variant="secondary" className="text-xs">
                                    Subcategoria
                                  </Badge>
                                  <ChevronDown className="h-3 w-3 rotate-[-90deg]" />
                                  <Badge variant="secondary" className="text-xs">
                                    Detalhe
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span><strong>Cliente:</strong></span>
                                    <Badge variant="outline" className="text-xs">
                                      ID: {queixa.clienteId}
                                    </Badge>
                                    <span>{queixa.cliente}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Pill className="h-4 w-4" />
                                    <span><strong>Produto:</strong> {queixa.produto}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span><strong>Criado em:</strong> {queixa.dataAbertura}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span><strong>Criado por:</strong> {queixa.criadoPor}</span>
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

                {/* Seção Queixas Técnicas - Retornado */}
                {supervisaoSecaoAtiva === "queixas-retornado" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Queixas Técnicas - Retornado</h2>
                    </div>
                    <div className="grid gap-4">
                      {QUEIXAS_TECNICAS_DATA.filter(queixa => queixa.status === "Retornado").map((queixa) => (
                        <Card key={queixa.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{queixa.protocolo}</h3>
                                  <Badge variant="destructive">
                                    {queixa.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="secondary" className="text-xs">
                                    Motivo
                                  </Badge>
                                  <ChevronDown className="h-3 w-3 rotate-[-90deg]" />
                                  <Badge variant="secondary" className="text-xs">
                                    Subcategoria
                                  </Badge>
                                  <ChevronDown className="h-3 w-3 rotate-[-90deg]" />
                                  <Badge variant="secondary" className="text-xs">
                                    Detalhe
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span><strong>Cliente:</strong></span>
                                    <Badge variant="outline" className="text-xs">
                                      ID: {queixa.clienteId}
                                    </Badge>
                                    <span>{queixa.cliente}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Pill className="h-4 w-4" />
                                    <span><strong>Produto:</strong> {queixa.produto}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span><strong>Criado em:</strong> {queixa.dataAbertura}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span><strong>Criado por:</strong> {queixa.criadoPor}</span>
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

                {/* Seção Farmacovigilância - Revisão */}
                {supervisaoSecaoAtiva === "farmacovigilancia-revisao" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Farmacovigilância - Revisão</h2>
                    </div>
                    <div className="grid gap-4">
                      {FARMACOVIGILANCIA_DATA.filter(evento => evento.status === "Revisão").map((evento) => (
                        <Card key={evento.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{evento.protocolo}</h3>
                                  <Badge variant={evento.gravidade === "Moderado" ? "destructive" : "secondary"}>
                                    {evento.gravidade}
                                  </Badge>
                                  <Badge variant="secondary">
                                    {evento.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="secondary" className="text-xs">
                                    Motivo
                                  </Badge>
                                  <ChevronDown className="h-3 w-3 rotate-[-90deg]" />
                                  <Badge variant="secondary" className="text-xs">
                                    Subcategoria
                                  </Badge>
                                  <ChevronDown className="h-3 w-3 rotate-[-90deg]" />
                                  <Badge variant="secondary" className="text-xs">
                                    Detalhe
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span><strong>Paciente:</strong></span>
                                    <Badge variant="outline" className="text-xs">ID: {evento.clienteId}</Badge>
                                    <span>{evento.paciente}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Pill className="h-4 w-4" />
                                    <span><strong>Medicamento:</strong> {evento.medicamento}</span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span><strong>Criado em:</strong> {evento.dataOcorrencia}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span><strong>Criado por:</strong> {evento.criadoPor}</span>
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

                {/* Seção Farmacovigilância - Retornado */}
                {supervisaoSecaoAtiva === "farmacovigilancia-retornado" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Farmacovigilância - Retornado</h2>
                    </div>
                    <div className="grid gap-4">
                      {FARMACOVIGILANCIA_DATA.filter(evento => evento.status === "Retornado").map((evento) => (
                        <Card key={evento.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{evento.protocolo}</h3>
                                  <Badge variant={evento.gravidade === "Moderado" ? "destructive" : "secondary"}>
                                    {evento.gravidade}
                                  </Badge>
                                  <Badge variant="destructive">
                                    {evento.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="secondary" className="text-xs">
                                    Motivo
                                  </Badge>
                                  <ChevronDown className="h-3 w-3 rotate-[-90deg]" />
                                  <Badge variant="secondary" className="text-xs">
                                    Subcategoria
                                  </Badge>
                                  <ChevronDown className="h-3 w-3 rotate-[-90deg]" />
                                  <Badge variant="secondary" className="text-xs">
                                    Detalhe
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span><strong>Paciente:</strong></span>
                                    <Badge variant="outline" className="text-xs">ID: {evento.clienteId}</Badge>
                                    <span>{evento.paciente}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Pill className="h-4 w-4" />
                                    <span><strong>Medicamento:</strong> {evento.medicamento}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span><strong>Criado em:</strong> {evento.dataOcorrencia}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span><strong>Criado por:</strong> {evento.criadoPor}</span>
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

