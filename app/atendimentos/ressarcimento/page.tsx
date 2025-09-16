"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Filter, CalendarIcon, Plus, DollarSign, CheckCircle, Clock, AlertTriangle, Loader, Eye, ArrowLeftCircle, XCircle, ClipboardPenLine, Package, Trash2, ChevronDown, Search, X } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
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
    tipo: "Financeiro",
    queixaTecnicaId: "QT-2024-001",
  },
  {
    id: "R-2024-002",
    data: "12/06/2024",
    cliente: "João Santos",
    clienteId: "2",
    telefone: "(11) 91234-5678",
    motivo: "Reembolso por devolução",
    produto: "Medicamento B",
    tipo: "Produto",
    queixaTecnicaId: "QT-2024-002",
  },
  {
    id: "R-2024-003",
    data: "15/06/2024",
    cliente: "Farmácia Saúde Ltda",
    clienteId: "3",
    telefone: "(11) 3456-7890",
    motivo: "Troca de produto",
    produto: "Dispositivo Médico X",
    tipo: "Financeiro",
    queixaTecnicaId: "QT-2024-003",
  },
]

const RESSARCIMENTOS = ["R-2024-001", "R-2024-002", "R-2024-003"]
const CLIENTES = ["Maria Silva", "João Santos", "Farmácia Saúde Ltda"]
const MOTIVOS = ["Produto com desvio", "Reembolso por devolução", "Troca de produto"]
const TELEFONES = ["(11) 98765-4321", "(11) 91234-5678", "(11) 3456-7890"]
const PRODUTOS = [
  "Medicamento A",
  "Medicamento B",
  "Dispositivo Médico X",
  "Dispositivo Médico Y",
]
const TIPOS = ["Financeiro", "Produto"]
const QUEIXAS_TECNICAS = ["QT-2024-001", "QT-2024-002", "QT-2024-003"]

export default function RessarcimentoPage() {
  const [dataInicio, setDataInicio] = useState<Date>()
  const [dataFim, setDataFim] = useState<Date>()
  const [ressarcimentoFiltro, setRessarcimentoFiltro] = useState<string[]>([])
  const [clienteFiltro, setClienteFiltro] = useState<string[]>([])
  const [telefoneFiltro, setTelefoneFiltro] = useState<string[]>([])
  const [motivoFiltro, setMotivoFiltro] = useState<string[]>([])
  const [produtoFiltro, setProdutoFiltro] = useState<string[]>([])
  const [tipoFiltro, setTipoFiltro] = useState<string[]>([])
  const [queixaTecnicaFiltro, setQueixaTecnicaFiltro] = useState<string[]>([])

  // Filtrar ressarcimentos com base nos filtros
  const filteredRessarcimentos = RESSARCIMENTOS_MOCK.filter((item) => {
    const matchesRessarcimento = ressarcimentoFiltro.length === 0 || ressarcimentoFiltro.includes(item.id)
    const matchesCliente = clienteFiltro.length === 0 || clienteFiltro.includes(item.cliente)
    const matchesTelefone = telefoneFiltro.length === 0 || telefoneFiltro.includes(item.telefone)
    const matchesMotivo = motivoFiltro.length === 0 || motivoFiltro.includes(item.motivo)
    const matchesDataInicio = !dataInicio || new Date(item.data.split("/").reverse().join("-")) >= dataInicio
    const matchesDataFim = !dataFim || new Date(item.data.split("/").reverse().join("-")) <= dataFim
    const matchesProduto = produtoFiltro.length === 0 || produtoFiltro.includes(item.produto)
    const matchesTipo = tipoFiltro.length === 0 || tipoFiltro.includes(item.tipo)
    const matchesQueixaTecnica = queixaTecnicaFiltro.length === 0 || queixaTecnicaFiltro.includes(item.queixaTecnicaId)

    return matchesRessarcimento && matchesCliente && matchesTelefone && matchesMotivo && matchesDataInicio && matchesDataFim && matchesProduto && matchesTipo && matchesQueixaTecnica
  })

  const resetFilters = () => {
    setRessarcimentoFiltro([])
    setClienteFiltro([])
    setTelefoneFiltro([])
    setMotivoFiltro([])
    setDataInicio(undefined)
    setDataFim(undefined)
    setProdutoFiltro([])
    setTipoFiltro([])
    setQueixaTecnicaFiltro([])
  }

  // Função auxiliar para toggle de itens em arrays
  const toggleItem = (item: string, currentItems: string[], setItems: (items: string[]) => void) => {
    if (currentItems.includes(item)) {
      setItems(currentItems.filter(i => i !== item))
    } else {
      setItems([...currentItems, item])
    }
  }

  // Componente MultiSelect customizado
  const MultiSelect = ({ 
    placeholder, 
    options, 
    selected, 
    onSelectionChange 
  }: {
    placeholder: string
    options: string[]
    selected: string[]
    onSelectionChange: (items: string[]) => void
  }) => {
    const [searchTerm, setSearchTerm] = useState("")
    
    const filteredOptions = options.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between text-left font-normal">
            <span className="truncate">
              {selected.length === 0 
                ? placeholder 
                : selected.length === 1 
                  ? selected[0] 
                  : `${selected.length} selecionados`
              }
            </span>
            <div className="flex items-center gap-1">
              {selected.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {selected.length}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="p-3 border-b space-y-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-8"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-muted"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            {filteredOptions.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs flex-1"
                  onClick={() => {
                    const newSelection = [...selected]
                    filteredOptions.forEach(option => {
                      if (!newSelection.includes(option)) {
                        newSelection.push(option)
                      }
                    })
                    onSelectionChange(newSelection)
                  }}
                >
                  Selecionar Todos
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs flex-1"
                  onClick={() => {
                    const newSelection = selected.filter(item => !filteredOptions.includes(item))
                    onSelectionChange(newSelection)
                  }}
                >
                  Limpar Filtrados
                </Button>
              </div>
            )}
          </div>
                      <div className="max-h-60 overflow-auto">
              {searchTerm && (
                <div className="px-3 py-2 text-xs text-muted-foreground border-b bg-muted/30">
                  {filteredOptions.length} de {options.length} itens encontrados
                </div>
              )}
              <div className="p-2">
                {filteredOptions.length > 0 ? (
                  <div className="space-y-2">
                    {filteredOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2 px-2 py-1 hover:bg-muted rounded">
                        <Checkbox
                          id={`${placeholder}-${option}`}
                          checked={selected.includes(option)}
                          onCheckedChange={() => toggleItem(option, selected, onSelectionChange)}
                        />
                        <label htmlFor={`${placeholder}-${option}`} className="text-sm cursor-pointer flex-1">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    {searchTerm ? "Nenhum item encontrado" : "Nenhum item disponível"}
                  </div>
                )}
              </div>
            </div>
        </PopoverContent>
      </Popover>
    )
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
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Lista de Ressarcimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <label className="text-sm font-medium">Ressarcimento</label>
                  <MultiSelect
                    placeholder="Todos os ressarcimentos"
                    options={RESSARCIMENTOS}
                    selected={ressarcimentoFiltro}
                    onSelectionChange={setRessarcimentoFiltro}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cliente</label>
                  <MultiSelect
                    placeholder="Todos os clientes"
                    options={CLIENTES}
                    selected={clienteFiltro}
                    onSelectionChange={setClienteFiltro}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Telefone</label>
                  <MultiSelect
                    placeholder="Todos os telefones"
                    options={TELEFONES}
                    selected={telefoneFiltro}
                    onSelectionChange={setTelefoneFiltro}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Motivo</label>
                  <MultiSelect
                    placeholder="Todos os motivos"
                    options={MOTIVOS}
                    selected={motivoFiltro}
                    onSelectionChange={setMotivoFiltro}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Produto</label>
                  <MultiSelect
                    placeholder="Todos os produtos"
                    options={PRODUTOS}
                    selected={produtoFiltro}
                    onSelectionChange={setProdutoFiltro}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo</label>
                  <MultiSelect
                    placeholder="Todos os tipos"
                    options={TIPOS}
                    selected={tipoFiltro}
                    onSelectionChange={setTipoFiltro}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Queixa Técnica</label>
                  <MultiSelect
                    placeholder="Todas as queixas técnicas"
                    options={QUEIXAS_TECNICAS}
                    selected={queixaTecnicaFiltro}
                    onSelectionChange={setQueixaTecnicaFiltro}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Limpar Filtros
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ressarcimento</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Queixa Técnica</TableHead>
                    <TableHead className="text-right"></TableHead>
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
                        <TableCell>{item.motivo}</TableCell>
                        <TableCell>{item.produto}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {item.tipo === "Financeiro" ? (
                              <>
                                <DollarSign className="h-4 w-4 text-[#26B99D]" />
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
                          <Link 
                            href={`/atendimentos/queixas/${item.queixaTecnicaId}`} 
                            className="text-primary hover:underline"
                          >
                            {item.queixaTecnicaId}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 h-8 w-8 p-0"
                              asChild
                            >
                              <Link href={`/atendimentos/ressarcimento/${item.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 h-8 w-8 p-0"
                              onClick={() => {
                                if (confirm("Tem certeza que deseja excluir este ressarcimento?")) {
                                  // Aqui seria implementada a lógica de exclusão
                                  console.log("Excluindo ressarcimento:", item.id)
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6">
                        Nenhum ressarcimento encontrado com os critérios de filtro.
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