"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, CheckCircle, Clock, AlertTriangle, Plus, CalendarIcon } from "lucide-react"
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

// Dados simulados de informações médicas
const INFO_MOCK = [
  {
    id: "IM-2023-0001",
    data: "15/06/2023",
    cliente: "Maria Silva",
    clienteId: "1",
    produto: "Medicamento A",
    assunto: "Posologia",
    status: "Respondido",
    statusVariant: "completed" as const,
    protocoloId: "1",
  },
  {
    id: "IM-2023-0002",
    data: "16/06/2023",
    cliente: "João Santos",
    clienteId: "2",
    produto: "Medicamento B",
    assunto: "Interações medicamentosas",
    status: "Em análise",
    statusVariant: "pending" as const,
    protocoloId: "2",
  },
  {
    id: "IM-2023-0003",
    data: "17/06/2023",
    cliente: "Farmácia Saúde",
    clienteId: "3",
    produto: "Dispositivo Médico X",
    assunto: "Modo de uso",
    status: "Pendente",
    statusVariant: "pending" as const,
    protocoloId: "3",
  },
  {
    id: "IM-2023-0004",
    data: "18/06/2023",
    cliente: "Ana Oliveira",
    clienteId: "4",
    produto: "Medicamento C",
    assunto: "Contraindicações",
    status: "Respondido",
    statusVariant: "completed" as const,
    protocoloId: "4",
  },
  {
    id: "IM-2023-0005",
    data: "19/06/2023",
    cliente: "Carlos Mendes",
    clienteId: "5",
    produto: "Medicamento D",
    assunto: "Efeitos colaterais",
    status: "Em análise",
    statusVariant: "pending" as const,
    protocoloId: "5",
  },
]

// Lista de assuntos e status para os filtros
const ASSUNTOS = [
  "Posologia",
  "Interações medicamentosas",
  "Modo de uso",
  "Contraindicações",
  "Efeitos colaterais",
  "Outro",
]

const STATUS = ["Respondido", "Em análise", "Pendente"]

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
]

export default function InformacoesMedicasPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dataInicio, setDataInicio] = useState<Date>()
  const [dataFim, setDataFim] = useState<Date>()
  const [assuntoFiltro, setAssuntoFiltro] = useState<string>("")
  const [statusFiltro, setStatusFiltro] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)
  const [isNovoFormDialogOpen, setIsNovoFormDialogOpen] = useState(false)

  // Estado para o formulário de nova solicitação
  const [formData, setFormData] = useState({
    cliente: "",
    produto: "",
    assunto: "",
    descricao: "",
    prioridade: "normal",
    profissionalSaude: false,
    especialidade: "",
    observacoes: "",
  })

  // Filtrar informações médicas com base nos filtros
  const filteredInfo = INFO_MOCK.filter((info) => {
    // Filtro de texto (busca)
    const matchesSearch =
      searchQuery === "" ||
      info.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      info.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      info.produto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      info.assunto.toLowerCase().includes(searchQuery.toLowerCase())

    // Filtro de data início
    const matchesDataInicio = !dataInicio || new Date(info.data.split("/").reverse().join("-")) >= dataInicio

    // Filtro de data fim
    const matchesDataFim = !dataFim || new Date(info.data.split("/").reverse().join("-")) <= dataFim

    // Filtro de assunto
    const matchesAssunto = !assuntoFiltro || info.assunto === assuntoFiltro

    // Filtro de status
    const matchesStatus = !statusFiltro || info.status === statusFiltro

    return matchesSearch && matchesDataInicio && matchesDataFim && matchesAssunto && matchesStatus
  })

  const resetFilters = () => {
    setSearchQuery("")
    setDataInicio(undefined)
    setDataFim(undefined)
    setAssuntoFiltro("")
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

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!formData.cliente || !formData.produto || !formData.assunto || !formData.descricao) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    // Simulação de envio
    toast({
      title: "Solicitação registrada",
      description: "A solicitação de informação médica foi registrada com sucesso",
      duration: 3000,
    })

    setIsNovoFormDialogOpen(false)

    // Resetar formulário
    setFormData({
      cliente: "",
      produto: "",
      assunto: "",
      descricao: "",
      prioridade: "normal",
      profissionalSaude: false,
      especialidade: "",
      observacoes: "",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="p-4 rounded-lg border border-[#26B99D] flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Informações Médicas</h1>
            <p className="text-sm text-gray-600 mt-1">Gerenciamento de solicitações de informações médicas</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <div className="relative w-full sm:w-[350px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar informações..."
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
              onClick={() => setIsNovoFormDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Solicitação
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Solicitações de Informações Médicas</CardTitle>
            <CardDescription>Visualize e gerencie todas as solicitações de informações médicas</CardDescription>
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
                  <label className="text-sm font-medium">Assunto</label>
                  <Select value={assuntoFiltro} onValueChange={setAssuntoFiltro}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os assuntos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os assuntos</SelectItem>
                      {ASSUNTOS.map((assunto) => (
                        <SelectItem key={assunto} value={assunto}>
                          {assunto}
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
                    <TableHead>Assunto</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInfo.length > 0 ? (
                    filteredInfo.map((info) => (
                      <TableRow key={info.id}>
                        <TableCell className="font-medium">{info.id}</TableCell>
                        <TableCell>{info.data}</TableCell>
                        <TableCell>
                          <Link href={`/clientes/${info.clienteId}`} className="text-[#26B99D] hover:underline">
                            {info.cliente}
                          </Link>
                        </TableCell>
                        <TableCell>{info.produto}</TableCell>
                        <TableCell>{info.assunto}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {info.statusVariant === "completed" ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-[#26B99D]" />
                                <span>{info.status}</span>
                              </>
                            ) : info.status === "Em análise" ? (
                              <>
                                <Clock className="h-4 w-4 text-amber-500" />
                                <span>{info.status}</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                <span>{info.status}</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/protocolos/${info.protocoloId}?tab=info`}>Ver detalhes</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        Nenhuma solicitação de informação médica encontrada com os critérios de busca.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {filteredInfo.length} de {INFO_MOCK.length} solicitações
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

      {/* Dialog para nova solicitação de informação médica */}
      <Dialog open={isNovoFormDialogOpen} onOpenChange={setIsNovoFormDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Solicitação de Informação Médica</DialogTitle>
            <DialogDescription>
              Preencha o formulário abaixo para registrar uma nova solicitação de informação médica
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-6">
            {/* Informações do Cliente */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#26B99D]">Informações do Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">
                    Cliente <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    name="cliente"
                    value={formData.cliente}
                    onValueChange={(value) => handleSelectChange("cliente", value)}
                    required
                  >
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

            {/* Informações da Solicitação */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#26B99D]">Informações da Solicitação</h3>
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
                  <Label htmlFor="assunto">
                    Assunto <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    name="assunto"
                    value={formData.assunto}
                    onValueChange={(value) => handleSelectChange("assunto", value)}
                    required
                  >
                    <SelectTrigger id="assunto">
                      <SelectValue placeholder="Selecione o assunto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="posologia">Posologia</SelectItem>
                      <SelectItem value="interacoes">Interações medicamentosas</SelectItem>
                      <SelectItem value="modo-uso">Modo de uso</SelectItem>
                      <SelectItem value="contraindicacoes">Contraindicações</SelectItem>
                      <SelectItem value="efeitos-colaterais">Efeitos colaterais</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="descricao">
                    Descrição da Solicitação <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="descricao"
                    name="descricao"
                    placeholder="Descreva detalhadamente a informação solicitada"
                    rows={4}
                    value={formData.descricao}
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
              <Button variant="outline" type="button" onClick={() => setIsNovoFormDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#26B99D] hover:bg-[#1E9A82]">
                <CheckCircle className="mr-2 h-4 w-4" />
                Registrar Solicitação
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

