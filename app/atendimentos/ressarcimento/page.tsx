"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, FileText, Filter, CalendarIcon, Plus, DollarSign, CheckCircle, Clock, AlertTriangle, Loader, Eye, ArrowLeftCircle, XCircle, ClipboardPenLine, Package } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"

// Dados simulados de ressarcimentos
const RESSARCIMENTOS_MOCK = [
  {
    id: "R-2024-001",
    data: "10/06/2024",
    cliente: "Maria Silva",
    clienteId: "1",
    telefone: "(11) 98765-4321",
    motivo: "Produto com desvio",
    produto: "Medicamento A",
    status: "Em análise",
    tipo: "Financeiro",
  },
  {
    id: "R-2024-002",
    data: "12/06/2024",
    cliente: "João Santos",
    clienteId: "2",
    telefone: "(11) 91234-5678",
    motivo: "Reembolso por devolução",
    produto: "Medicamento B",
    status: "Concluído",
    tipo: "Produto",
  },
  {
    id: "R-2024-003",
    data: "15/06/2024",
    cliente: "Farmácia Saúde Ltda",
    clienteId: "3",
    telefone: "(11) 3456-7890",
    motivo: "Troca de produto",
    produto: "Dispositivo Médico X",
    status: "Pendente",
    tipo: "Financeiro",
  },
]

const STATUS = ["Concluído", "Em análise", "Pendente"]
const PRODUTOS = [
  "Medicamento A",
  "Medicamento B",
  "Dispositivo Médico X",
  "Dispositivo Médico Y",
]
const TIPOS = ["Financeiro", "Produto"]

export default function RessarcimentoPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dataInicio, setDataInicio] = useState<Date>()
  const [dataFim, setDataFim] = useState<Date>()
  const [produtoFiltro, setProdutoFiltro] = useState<string>("")
  const [statusFiltro, setStatusFiltro] = useState<string>("")
  const [tipoFiltro, setTipoFiltro] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)

  // Filtrar ressarcimentos com base nos filtros
  const filteredRessarcimentos = RESSARCIMENTOS_MOCK.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.motivo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.produto.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDataInicio = !dataInicio || new Date(item.data.split("/").reverse().join("-")) >= dataInicio
    const matchesDataFim = !dataFim || new Date(item.data.split("/").reverse().join("-")) <= dataFim
    const matchesProduto = !produtoFiltro || item.produto === produtoFiltro
    const matchesStatus = !statusFiltro || item.status === statusFiltro
    const matchesTipo = !tipoFiltro || tipoFiltro === "all" || item.tipo === tipoFiltro

    return matchesSearch && matchesDataInicio && matchesDataFim && matchesProduto && matchesStatus && matchesTipo
  })

  const resetFilters = () => {
    setSearchQuery("")
    setDataInicio(undefined)
    setDataFim(undefined)
    setProdutoFiltro("")
    setStatusFiltro("")
    setTipoFiltro("")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="p-4 rounded-lg flex-1">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-[#26B99D]" />
              Ressarcimentos
            </h1>
            <p className="text-sm text-gray-600 mt-1">Gerenciamento de ressarcimentos de clientes</p>
          </div>
          <Button className="bg-teal-600 hover:bg-teal-700" asChild>
            <Link href="/atendimentos/ressarcimento/novo">
              <Plus className="mr-2 h-4 w-4" />
              Novo Ressarcimento
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Lista de Ressarcimentos</CardTitle>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                        {dataFim ? (
                          format(dataFim, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={dataFim} onSelect={setDataFim} initialFocus locale={ptBR} />
                    </PopoverContent>
                  </Popover>
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
                  <label className="text-sm font-medium">Busca</label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar por número, cliente, motivo..."
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
                    <TableHead>Número</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRessarcimentos.length > 0 ? (
                    filteredRessarcimentos.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.data}</TableCell>
                        <TableCell>
                          <Link href={`/clientes/${item.clienteId}`} className="text-primary hover:underline">
                            {item.cliente}
                          </Link>
                        </TableCell>
                        <TableCell>{item.telefone}</TableCell>
                        <TableCell>{item.motivo}</TableCell>
                        <TableCell>{item.produto}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {item.tipo === "Financeiro" ? (
                              <>
                                <DollarSign className="h-4 w-4 text-blue-500" />
                                <span>{item.tipo}</span>
                              </>
                            ) : (
                              <>
                                <Package className="h-4 w-4 text-green-500" />
                                <span>{item.tipo}</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {item.status === "Concluído" ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-[#26B99D]" />
                                <span>{item.status}</span>
                              </>
                            ) : item.status === "Em análise" ? (
                              <>
                                <Clock className="h-4 w-4 text-amber-500" />
                                <span>{item.status}</span>
                              </>
                            ) : item.status === "Aberto" ? (
                              <>
                                <Loader className="h-4 w-4 text-blue-500 animate-spin" />
                                <span>{item.status}</span>
                              </>
                            ) : item.status === "Revisão" ? (
                              <>
                                <Eye className="h-4 w-4 text-purple-500" />
                                <span>{item.status}</span>
                              </>
                            ) : item.status === "Qualidade" ? (
                              <>
                                <ClipboardPenLine className="h-4 w-4 text-indigo-500" />
                                <span>{item.status}</span>
                              </>
                            ) : item.status === "Retorno para Atendimento" ? (
                              <>
                                <ArrowLeftCircle className="h-4 w-4 text-orange-500" />
                                <span>{item.status}</span>
                              </>
                            ) : item.status === "Inválido" ? (
                              <>
                                <XCircle className="h-4 w-4 text-red-500" />
                                <span>{item.status}</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                <span>{item.status}</span>
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
                            <Link href={`/atendimentos/ressarcimento/${item.id}`}>
                              <FileText className="h-4 w-4 mr-2" />
                              Ver detalhes
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6">
                        Nenhum ressarcimento encontrado com os critérios de busca.
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