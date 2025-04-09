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
  CalendarIcon,
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
} from "lucide-react"
import { IniciarAtendimentoModal } from "@/components/iniciar-atendimento-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
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
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-teal-800">Dashboard</h1>
          <Button 
            className="bg-[#26B99D] hover:bg-[#1E9A82]"
            onClick={() => setShowAtendimentoModal(true)}
          >
            <PhoneCall className="mr-2 h-4 w-4" />
            Novo Atendimento
          </Button>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atendimentos Hoje</CardTitle>
              <PhoneCall className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ESTATISTICAS.atendimentosHoje}</div>
              <p className="text-xs text-muted-foreground">
                +{ESTATISTICAS.atendimentosHoje - 8} em relação a ontem
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atendimentos Pendentes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ESTATISTICAS.atendimentosPendentes}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((ESTATISTICAS.atendimentosPendentes / ESTATISTICAS.atendimentosMes) * 100)}% do total mensal
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio de Atendimento</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ESTATISTICAS.tempoMedioAtendimento}</div>
              <p className="text-xs text-muted-foreground">
                -2 min em relação à média semanal
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfação dos Clientes</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ESTATISTICAS.satisfacaoClientes}%</div>
              <p className="text-xs text-muted-foreground">
                +3% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos e informações adicionais */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Gráfico de atendimentos por motivo */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Atendimentos por Motivo</CardTitle>
              <CardDescription>Distribuição dos atendimentos por tipo de motivo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ATENDIMENTOS_POR_MOTIVO.map((item) => (
                  <div key={item.motivo} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.motivo === "Queixa Técnica" && <FileText className="h-4 w-4 text-blue-500" />}
                        {item.motivo === "Informação Médica" && <HelpCircle className="h-4 w-4 text-purple-500" />}
                        {item.motivo === "Farmacovigilância" && <Pill className="h-4 w-4 text-red-500" />}
                        {item.motivo === "Evento Adverso" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                        {item.motivo === "Contato para retorno" && <PhoneCall className="h-4 w-4 text-green-500" />}
                        <span className="text-sm font-medium">{item.motivo}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.quantidade} ({item.percentual}%)</span>
                    </div>
                    <Progress value={item.percentual} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>Atualizações importantes do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {NOTIFICACOES.map((notificacao) => (
                  <div key={notificacao.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
                    <div className="mt-1">
                      {notificacao.tipo === "farmacovigilancia" && <Pill className="h-4 w-4 text-red-500" />}
                      {notificacao.tipo === "evento-adverso" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                      {notificacao.tipo === "retorno" && <PhoneCall className="h-4 w-4 text-green-500" />}
                      {notificacao.tipo === "produto" && <ShieldCheck className="h-4 w-4 text-blue-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{notificacao.titulo}</p>
                      <p className="text-xs text-muted-foreground">{notificacao.descricao}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notificacao.data}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Ver todas as notificações</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Gráfico de tendência e atendimentos por produto */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Gráfico de tendência */}
          <Card>
            <CardHeader>
              <CardTitle>Tendência de Atendimentos</CardTitle>
              <CardDescription>Atendimentos realizados nos últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-end justify-between gap-1">
                {TENDENCIA_ATENDIMENTOS.map((item) => (
                  <div key={item.dia} className="flex flex-col items-center gap-1">
                    <div 
                      className="w-8 bg-[#26B99D] rounded-t-sm" 
                      style={{ height: `${(item.quantidade / 25) * 100}%` }}
                    ></div>
                    <span className="text-xs">{item.dia}</span>
                    <span className="text-xs font-medium">{item.quantidade}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Atendimentos por produto */}
          <Card>
            <CardHeader>
              <CardTitle>Atendimentos por Produto</CardTitle>
              <CardDescription>Distribuição dos atendimentos por produto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ATENDIMENTOS_POR_PRODUTO.map((item) => (
                  <div key={item.produto} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.produto}</span>
                      <span className="text-sm text-muted-foreground">{item.quantidade} ({item.percentual}%)</span>
                    </div>
                    <Progress value={item.percentual} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de atendimentos */}
        <div className="border rounded-md shadow-sm">
          <Collapsible open={isAtendimentosExpanded} onOpenChange={setIsAtendimentosExpanded}>
            {/* Cabeçalho clicável */}
            <div
              className="flex items-center justify-between p-4 border-b cursor-pointer hover:bg-gray-50"
              onClick={toggleCollapsible}
            >
              <h2 className="text-lg font-medium">Últimos Atendimentos</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation() // Impede que o clique propague para o cabeçalho
                    setShowFilters(!showFilters)
                  }}
                  className={showFilters ? "bg-muted" : ""}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <div>
                  {isAtendimentosExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
            </div>

            <CollapsibleContent>
              <div className="px-4 pb-4">
                <div className={`space-y-4 ${showFilters ? "block" : "hidden"}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data Início</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dataInicio ? (
                              format(dataInicio, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dataInicio}
                            onSelect={setDataInicio}
                            initialFocus
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data Fim</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dataFim ? format(dataFim, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecione a data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={dataFim} onSelect={setDataFim} initialFocus locale={ptBR} />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Motivo</label>
                      <Select value={motivoFiltro} onValueChange={setMotivoFiltro}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos os motivos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os motivos</SelectItem>
                          {MOTIVOS.map((motivo) => (
                            <SelectItem key={motivo} value={motivo}>
                              {motivo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Produto</label>
                      <Select value={produtoFiltro} onValueChange={setProdutoFiltro}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos os produtos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os produtos</SelectItem>
                          {PRODUTOS.map((produto) => (
                            <SelectItem key={produto} value={produto}>
                              {produto}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select value={statusFiltro} onValueChange={setStatusFiltro}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos os status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os status</SelectItem>
                          {STATUS.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Busca</label>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Buscar por protocolo, nome, motivo..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex items-end">
                      <Button variant="outline" size="sm" onClick={resetFilters} className="h-10">
                        Limpar Filtros
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Protocolo</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Motivo</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAtendimentos.length > 0 ? (
                        filteredAtendimentos.map((atendimento) => (
                          <TableRow key={atendimento.protocolo}>
                            <TableCell className="font-medium">{atendimento.protocolo}</TableCell>
                            <TableCell>{atendimento.data}</TableCell>
                            <TableCell>
                              <Link
                                href={`/clientes/${atendimento.clienteId}`}
                                className="text-primary hover:underline"
                              >
                                {atendimento.nome}
                              </Link>
                            </TableCell>
                            <TableCell>{atendimento.motivo}</TableCell>
                            <TableCell>{atendimento.produto}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {atendimento.statusVariant === "completed" ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 text-teal-500" />
                                    <span>{atendimento.status}</span>
                                  </>
                                ) : atendimento.status === "Em análise" ? (
                                  <>
                                    <Clock className="h-4 w-4 text-amber-500" />
                                    <span>{atendimento.status}</span>
                                  </>
                                ) : (
                                  <>
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                    <span>{atendimento.status}</span>
                                  </>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200"
                                asChild
                              >
                                <Link href={`/protocolos/${atendimento.protocolo}`}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Ver detalhes
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6">
                            Nenhum atendimento encontrado com os critérios de busca.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      <IniciarAtendimentoModal open={showAtendimentoModal} onOpenChange={setShowAtendimentoModal} />
    </DashboardLayout>
  )
}

