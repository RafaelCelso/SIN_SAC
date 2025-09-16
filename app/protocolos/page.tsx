"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, Trash, Filter, Clock, CheckCircle, AlertTriangle, CalendarIcon, Plus, Loader, CircleCheckBig } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"

// Dados simulados de protocolos
const PROTOCOLOS_MOCK = [
  {
    id: "P-2023-001",
    data: "15/03/2023",
    tipo: "Queixa Técnica",
    produto: "Medicamento A",
    status: "Em análise",
    clienteId: "1",
    cliente: "Maria Silva",
    telefone: "(11) 98765-4321",
    descricao: "Cliente relatou problema com a embalagem do medicamento.",
    statusVariant: "pending" as const,
  },
  {
    id: "P-2023-045",
    data: "22/04/2023",
    tipo: "Evento Adverso",
    produto: "Medicamento B",
    status: "Pendente",
    clienteId: "1",
    cliente: "Maria Silva",
    telefone: "(11) 98765-4321",
    descricao: "Reação alérgica após uso do medicamento.",
    statusVariant: "pending" as const,
  },
  {
    id: "QT-2023-0001",
    data: "15/06/2023",
    tipo: "Queixa Técnica",
    produto: "Medicamento A",
    status: "Em análise",
    clienteId: "1",
    cliente: "Maria Silva",
    telefone: "(11) 98765-4321",
    descricao: "Cliente relatou problema com a embalagem do medicamento.",
    statusVariant: "pending" as const,
  },
  {
    id: "QT-2023-0002",
    data: "16/06/2023",
    tipo: "Queixa Técnica",
    produto: "Medicamento B",
    status: "Concluído",
    clienteId: "2",
    cliente: "João Santos",
    telefone: "(11) 91234-5678",
    descricao: "Cliente relatou problema no conteúdo do medicamento.",
    statusVariant: "completed" as const,
  },
  {
    id: "IM-2023-0001",
    data: "15/06/2023",
    tipo: "Informação Médica",
    produto: "Medicamento A",
    status: "Respondido",
    clienteId: "1",
    cliente: "Maria Silva",
    telefone: "(11) 98765-4321",
    descricao: "Cliente solicitou informações sobre a posologia do medicamento.",
    statusVariant: "completed" as const,
  },
  {
    id: "IM-2023-0002",
    data: "16/06/2023",
    tipo: "Informação Médica",
    produto: "Medicamento B",
    status: "Em análise",
    clienteId: "2",
    cliente: "João Santos",
    telefone: "(11) 91234-5678",
    descricao: "Cliente solicitou informações sobre possíveis interações medicamentosas.",
    statusVariant: "pending" as const,
  },
  {
    id: "FV-2023-0001",
    data: "15/06/2023",
    tipo: "Farmacovigilância",
    produto: "Medicamento A",
    status: "Concluído",
    clienteId: "1",
    cliente: "Maria Silva",
    telefone: "(11) 98765-4321",
    descricao: "Cliente relatou náusea após o uso do medicamento A.",
    statusVariant: "completed" as const,
  },
  {
    id: "FV-2023-0002",
    data: "16/06/2023",
    tipo: "Farmacovigilância",
    produto: "Medicamento B",
    status: "Em análise",
    clienteId: "2",
    cliente: "João Santos",
    telefone: "(11) 91234-5678",
    descricao: "Cliente relatou erupção cutânea após o uso do medicamento B.",
    statusVariant: "pending" as const,
  },
]

// Lista de tipos, produtos e status para os filtros
const TIPOS = ["Queixa Técnica", "Evento Adverso", "Informação Médica", "Farmacovigilância"]
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
const STATUS = ["Aberto", "Em andamento", "Concluído"]

export default function ProtocolosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dataInicio, setDataInicio] = useState<Date>()
  const [dataFim, setDataFim] = useState<Date>()
  const [tipoFiltro, setTipoFiltro] = useState<string>("")
  const [produtoFiltro, setProdutoFiltro] = useState<string>("")
  const [statusFiltro, setStatusFiltro] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)

  // Filtrar protocolos com base em todos os filtros
  const filteredProtocolos = PROTOCOLOS_MOCK.filter((protocolo) => {
    // Filtro de texto (busca)
    const matchesSearch =
      searchQuery === "" ||
      protocolo.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocolo.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocolo.tipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocolo.produto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocolo.status.toLowerCase().includes(searchQuery.toLowerCase())

    // Filtro de data início
    const matchesDataInicio = !dataInicio || new Date(protocolo.data.split("/").reverse().join("-")) >= dataInicio

    // Filtro de data fim
    const matchesDataFim = !dataFim || new Date(protocolo.data.split("/").reverse().join("-")) <= dataFim

    // Filtro de tipo
    const matchesTipo = !tipoFiltro || protocolo.tipo === tipoFiltro

    // Filtro de produto
    const matchesProduto = !produtoFiltro || protocolo.produto === produtoFiltro

    // Filtro de status
    const matchesStatus = !statusFiltro || statusFiltro === "all" || getStatusLabel(protocolo.status) === statusFiltro

    return matchesSearch && matchesDataInicio && matchesDataFim && matchesTipo && matchesProduto && matchesStatus
  })

  const resetFilters = () => {
    setSearchQuery("")
    setDataInicio(undefined)
    setDataFim(undefined)
    setTipoFiltro("")
    setProdutoFiltro("")
    setStatusFiltro("")
  }

  const getStatusLabel = (status: string) => {
    const s = (status || "").toLowerCase()
    if (s === "pendente" || s === "aberto") return "Aberto"
    if (s === "em análise" || s === "em analise" || s === "em andamento") return "Em andamento"
    if (s === "concluído" || s === "concluido" || s === "respondido") return "Concluído"
    return status || "Aberto"
  }

  const getStatusClasses = (status: string) => {
    const label = getStatusLabel(status)
    switch (label) {
      case "Aberto":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "Em andamento":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "Concluído":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    const label = getStatusLabel(status)
    switch (label) {
      case "Aberto":
        return <Loader className="h-3 w-3" />
      case "Em andamento":
        return <Clock className="h-3 w-3" />
      case "Concluído":
        return <CircleCheckBig className="h-3 w-3" />
      default:
        return <Loader className="h-3 w-3" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="p-4 rounded-lg flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Protocolos</h1>
            <p className="text-sm text-gray-600 mt-1">Gerenciamento de protocolos de atendimento</p>
          </div>
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="mr-2 h-4 w-4" />
            Novo Protocolo
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Lista de Protocolos</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-muted" : ""}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </CardHeader>
          <CardContent>
            <div className={`space-y-4 ${showFilters ? "block" : "hidden"}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <label className="text-sm font-medium">Tipo</label>
                  <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      {TIPOS.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
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
                      placeholder="Buscar por protocolo, cliente, tipo..."
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
                    <TableHead>Cliente</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProtocolos.length > 0 ? (
                    filteredProtocolos.map((protocolo) => (
                      <TableRow key={protocolo.id}>
                        <TableCell className="font-medium">{protocolo.id}</TableCell>
                        <TableCell>{protocolo.data}</TableCell>
                        <TableCell>
                          <Link href={`/clientes/${protocolo.clienteId}`} className="text-primary hover:underline">
                            {protocolo.cliente}
                          </Link>
                        </TableCell>
                        <TableCell>{protocolo.tipo}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs flex items-center gap-1 w-fit ${getStatusClasses(protocolo.status)}`}>
                            {getStatusIcon(protocolo.status)}
                            {getStatusLabel(protocolo.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{protocolo.produto}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 h-8 w-8 p-0"
                              asChild
                              title="Ver detalhes"
                              aria-label="Ver detalhes"
                            >
                              <Link href={`/clientes/${protocolo.clienteId}?tab=protocolos&protocolo=${protocolo.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-red-50 text-red-600 hover:text-red-700 hover:border-red-300 h-8 w-8 p-0"
                              title="Excluir"
                              aria-label="Excluir"
                              onClick={() => { /* ação de excluir */ }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        Nenhum protocolo encontrado com os critérios de busca.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

