"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, FileText, CheckCircle, Clock, AlertTriangle, Plus, CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

// Dados simulados de queixas técnicas
const QUEIXAS_MOCK = [
  {
    id: "QT-2023-0001",
    data: "15/06/2023",
    cliente: "Maria Silva",
    clienteId: "1",
    produto: "Medicamento A",
    lote: "ABC123",
    tipo: "Problema na embalagem",
    status: "Em análise",
    statusVariant: "pending" as const,
    protocoloId: "PR-2023-0001",
  },
  {
    id: "QT-2023-0002",
    data: "16/06/2023",
    cliente: "João Santos",
    clienteId: "2",
    produto: "Medicamento B",
    lote: "DEF456",
    tipo: "Problema no conteúdo",
    status: "Concluído",
    statusVariant: "completed" as const,
    protocoloId: "PR-2023-0002",
  },
  {
    id: "QT-2023-0003",
    data: "17/06/2023",
    cliente: "Farmácia Saúde",
    clienteId: "3",
    produto: "Dispositivo Médico X",
    lote: "GHI789",
    tipo: "Problema no funcionamento",
    status: "Pendente",
    statusVariant: "pending" as const,
    protocoloId: "PR-2023-0003",
  },
  {
    id: "QT-2023-0004",
    data: "18/06/2023",
    cliente: "Ana Oliveira",
    clienteId: "4",
    produto: "Medicamento C",
    lote: "JKL012",
    tipo: "Problema na rotulagem",
    status: "Concluído",
    statusVariant: "completed" as const,
    protocoloId: "PR-2023-0004",
  },
  {
    id: "QT-2023-0005",
    data: "19/06/2023",
    cliente: "Carlos Mendes",
    clienteId: "5",
    produto: "Medicamento D",
    lote: "MNO345",
    tipo: "Suspeita de contaminação",
    status: "Em análise",
    statusVariant: "pending" as const,
    protocoloId: "PR-2023-0005",
  },
]

// Lista de tipos de queixas e status para os filtros
const TIPOS_QUEIXA = [
  "Problema na embalagem",
  "Problema na rotulagem",
  "Problema no conteúdo",
  "Problema no funcionamento",
  "Suspeita de contaminação",
  "Outro",
]

const STATUS = ["Concluído", "Em análise", "Pendente"]

// Dados simulados de clientes
const CLIENTES_MOCK = [
  {
    id: "1",
    nome: "Maria Silva",
    documento: "123.456.789-00",
    telefone: "(11) 98765-4321",
    email: "maria.silva@email.com",
    endereco: "Av. Paulista, 1000 - São Paulo/SP",
    tipo: "Pessoa Física",
  },
  {
    id: "2",
    nome: "João Santos",
    documento: "987.654.321-00",
    telefone: "(11) 91234-5678",
    email: "joao.santos@email.com",
    endereco: "Rua Augusta, 500 - São Paulo/SP",
    tipo: "Pessoa Física",
  },
  {
    id: "3",
    nome: "Farmácia Saúde Ltda",
    documento: "12.345.678/0001-90",
    telefone: "(11) 3456-7890",
    email: "contato@farmaciasaude.com.br",
    endereco: "Av. Rebouças, 1500 - São Paulo/SP",
    tipo: "Pessoa Jurídica",
  },
  {
    id: "4",
    nome: "Ana Oliveira",
    documento: "456.789.123-00",
    telefone: "(11) 97654-3210",
    email: "ana.oliveira@email.com",
    endereco: "Rua Oscar Freire, 300 - São Paulo/SP",
    tipo: "Pessoa Física",
  },
  {
    id: "5",
    nome: "Carlos Mendes",
    documento: "789.123.456-00",
    telefone: "(11) 95678-1234",
    email: "carlos.mendes@email.com",
    endereco: "Av. Brigadeiro Faria Lima, 2000 - São Paulo/SP",
    tipo: "Pessoa Física",
  },
]

export default function QueixasTecnicasPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dataInicio, setDataInicio] = useState<Date>()
  const [dataFim, setDataFim] = useState<Date>()
  const [tipoFiltro, setTipoFiltro] = useState<string>("")
  const [statusFiltro, setStatusFiltro] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)
  const [isNovaQueixaDialogOpen, setIsNovaQueixaDialogOpen] = useState(false)
  const [clienteSearchQuery, setClienteSearchQuery] = useState("")
  const [selectedCliente, setSelectedCliente] = useState<(typeof CLIENTES_MOCK)[0] | null>(null)

  // Estado para o formulário de nova queixa
  const [formData, setFormData] = useState({
    produto: "",
    lote: "",
    dataFabricacao: "",
    dataValidade: "",
    descricaoQueixa: "",
    tipoQueixa: "embalagem",
    possuiAmostra: "nao",
    enviarAmostra: false,
    prioridade: "normal",
    observacoes: "",
  })

  // Filtrar queixas com base nos filtros
  const filteredQueixas = QUEIXAS_MOCK.filter((queixa) => {
    // Filtro de texto (busca)
    const matchesSearch =
      searchQuery === "" ||
      queixa.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      queixa.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      queixa.produto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      queixa.lote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      queixa.tipo.toLowerCase().includes(searchQuery.toLowerCase())

    // Filtro de data início
    const matchesDataInicio = !dataInicio || new Date(queixa.data.split("/").reverse().join("-")) >= dataInicio

    // Filtro de data fim
    const matchesDataFim = !dataFim || new Date(queixa.data.split("/").reverse().join("-")) <= dataFim

    // Filtro de tipo
    const matchesTipo = !tipoFiltro || queixa.tipo === tipoFiltro

    // Filtro de status
    const matchesStatus = !statusFiltro || queixa.status === statusFiltro

    return matchesSearch && matchesDataInicio && matchesDataFim && matchesTipo && matchesStatus
  })

  // Filtrar clientes com base na busca
  const filteredClientes = CLIENTES_MOCK.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(clienteSearchQuery.toLowerCase()) ||
      cliente.documento.includes(clienteSearchQuery) ||
      cliente.email.toLowerCase().includes(clienteSearchQuery.toLowerCase()) ||
      cliente.telefone.includes(clienteSearchQuery),
  )

  const resetFilters = () => {
    setSearchQuery("")
    setDataInicio(undefined)
    setDataFim(undefined)
    setTipoFiltro("")
    setStatusFiltro("")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmitQueixa = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!formData.produto || !formData.lote || !formData.descricaoQueixa) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    // Simulação de envio
    toast({
      title: "Queixa técnica registrada",
      description: "A queixa técnica foi registrada com sucesso",
      duration: 3000,
    })

    setIsNovaQueixaDialogOpen(false)

    // Resetar formulário
    setFormData({
      produto: "",
      lote: "",
      dataFabricacao: "",
      dataValidade: "",
      descricaoQueixa: "",
      tipoQueixa: "embalagem",
      possuiAmostra: "nao",
      enviarAmostra: false,
      prioridade: "normal",
      observacoes: "",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="bg-gradient-to-r from-[#E6F7F5] to-[#F0FAF8] p-4 rounded-lg border border-[#26B99D] flex-1">
            <h1 className="text-2xl font-bold text-[#26B99D]">Queixas Técnicas</h1>
            <p className="text-sm text-[#26B99D] mt-1">Gerenciamento de queixas técnicas relacionadas a produtos</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <div className="relative w-full sm:w-[350px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar queixas..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="icon"
              title="Filtrar"
              onClick={() => setShowFilters(!showFilters)}
              className={`${showFilters ? "bg-muted" : ""} sm:flex-none`}
            >
              <Filter className="h-4 w-4" />
            </Button>

            <Button
              variant="primary"
              className="bg-[#26B99D] hover:bg-[#1E9A82] w-full sm:w-auto"
              onClick={() => setIsNovaQueixaDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Queixa Técnica
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Lista de Queixas Técnicas</CardTitle>
            <CardDescription>Visualize e gerencie todas as queixas técnicas registradas</CardDescription>
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
                  <label className="text-sm font-medium">Tipo de Queixa</label>
                  <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      {TIPOS_QUEIXA.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
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

                <div className="flex items-end">
                  <Button variant="outline" size="sm" onClick={resetFilters} className="h-10">
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-md border mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Código</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQueixas.length > 0 ? (
                    filteredQueixas.map((queixa) => (
                      <TableRow key={queixa.id}>
                        <TableCell className="font-medium">{queixa.id}</TableCell>
                        <TableCell>{queixa.data}</TableCell>
                        <TableCell>
                          <Link href={`/clientes/${queixa.clienteId}`} className="text-[#26B99D] hover:underline">
                            {queixa.cliente}
                          </Link>
                        </TableCell>
                        <TableCell>{queixa.produto}</TableCell>
                        <TableCell>{queixa.lote}</TableCell>
                        <TableCell>{queixa.tipo}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {queixa.statusVariant === "completed" ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-[#26B99D]" />
                                <span>{queixa.status}</span>
                              </>
                            ) : queixa.status === "Em análise" ? (
                              <>
                                <Clock className="h-4 w-4 text-amber-500" />
                                <span>{queixa.status}</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                <span>{queixa.status}</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-[#E6F7F5] hover:text-[#26B99D] hover:border-[#26B99D]"
                            asChild
                          >
                            <Link href={`/protocolos/${queixa.protocoloId}?tab=queixas`}>
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
                        Nenhuma queixa técnica encontrada com os critérios de busca.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {filteredQueixas.length} de {QUEIXAS_MOCK.length} queixas técnicas
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <Button variant="outline" size="sm">
                Próximo
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Dialog para nova queixa técnica */}
      <Dialog open={isNovaQueixaDialogOpen} onOpenChange={setIsNovaQueixaDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Queixa Técnica</DialogTitle>
            <DialogDescription>Preencha o formulário abaixo para registrar uma nova queixa técnica</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitQueixa} className="space-y-6">
            {/* Informações do Cliente */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#26B99D]">Informações do Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Select>
                    <SelectTrigger id="cliente">
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLIENTES_MOCK.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contato">Contato</Label>
                  <Input id="contato" placeholder="Nome do contato" />
                </div>
              </div>
            </div>

            {/* Informações do Produto */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#26B99D]">Informações do Produto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="produto">
                    Produto <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    name="produto"
                    value={formData.produto}
                    onValueChange={(value) => handleSelectChange("produto", value)}
                    required
                  >
                    <SelectTrigger id="produto">
                      <SelectValue placeholder="Selecione o produto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medicamento-a">Medicamento A</SelectItem>
                      <SelectItem value="medicamento-b">Medicamento B</SelectItem>
                      <SelectItem value="medicamento-c">Medicamento C</SelectItem>
                      <SelectItem value="dispositivo-x">Dispositivo Médico X</SelectItem>
                      <SelectItem value="dispositivo-y">Dispositivo Médico Y</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lote">
                    Número do Lote <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lote"
                    name="lote"
                    placeholder="Ex: ABC123456"
                    value={formData.lote}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataFabricacao">Data de Fabricação</Label>
                  <Input
                    id="dataFabricacao"
                    name="dataFabricacao"
                    type="date"
                    value={formData.dataFabricacao}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataValidade">Data de Validade</Label>
                  <Input
                    id="dataValidade"
                    name="dataValidade"
                    type="date"
                    value={formData.dataValidade}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Detalhes da Queixa */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#26B99D]">Detalhes da Queixa</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tipoQueixa">
                    Tipo de Queixa <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    name="tipoQueixa"
                    value={formData.tipoQueixa}
                    onValueChange={(value) => handleSelectChange("tipoQueixa", value)}
                  >
                    <SelectTrigger id="tipoQueixa">
                      <SelectValue placeholder="Selecione o tipo de queixa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="embalagem">Problema na embalagem</SelectItem>
                      <SelectItem value="rotulagem">Problema na rotulagem</SelectItem>
                      <SelectItem value="conteudo">Problema no conteúdo</SelectItem>
                      <SelectItem value="funcionamento">Problema no funcionamento</SelectItem>
                      <SelectItem value="contaminacao">Suspeita de contaminação</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricaoQueixa">
                    Descrição da Queixa <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="descricaoQueixa"
                    name="descricaoQueixa"
                    placeholder="Descreva detalhadamente o problema encontrado"
                    rows={4}
                    value={formData.descricaoQueixa}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Select
                    name="prioridade"
                    value={formData.prioridade}
                    onValueChange={(value) => handleSelectChange("prioridade", value)}
                  >
                    <SelectTrigger id="prioridade">
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações Adicionais</Label>
              <Textarea
                id="observacoes"
                name="observacoes"
                placeholder="Informações adicionais relevantes"
                rows={3}
                value={formData.observacoes}
                onChange={handleInputChange}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsNovaQueixaDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#26B99D] hover:bg-[#1E9A82]">
                <CheckCircle className="mr-2 h-4 w-4" />
                Registrar Queixa Técnica
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

