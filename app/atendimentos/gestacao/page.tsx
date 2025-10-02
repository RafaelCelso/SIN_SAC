"use client"

import React, { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, FileText, CheckCircle, Clock, AlertTriangle, Plus, CalendarIcon, Package, Barcode, ArrowLeft, Edit, Eye, Trash2, ClipboardPlus, ChevronDown, ChevronRight, ExternalLink, Check, ChevronsUpDown, FilePlus, ClipboardPenLine, Baby } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
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
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { NovaGestacaoForm } from "./NovaGestacaoForm"

// Dados simulados de gestação
const GESTACAO_MOCK = [
  {
    id: "GES-2023-0001",
    protocolo: "2023061500001-GI001",
    criadoEm: "15/06/2023",
    atualizadoEm: "20/06/2023",
    cliente: "Maria Silva",
    clienteId: "1",
    telefone: "(11) 98765-4321",
    produto: "Medicamento A",
    tipo: "Gestação Inicial",
    status: "Concluído",
    statusVariant: "completed" as const,
    protocoloId: "protocolo-1",
    hasFup: true,
    followUps: [
      { id: "GA001", data: "20/06/2023" },
      { id: "GA002", data: "25/06/2023" },
      { id: "GA003", data: "30/06/2023" },
      { id: "GN011", data: "05/07/2023" },
      { id: "GN012", data: "12/07/2023" },
      { id: "GN013", data: "18/07/2023" }
    ],
  },
  {
    id: "GES-2023-0002",
    protocolo: "2023061600002-GI002",
    criadoEm: "16/06/2023",
    atualizadoEm: "18/06/2023",
    cliente: "João Santos",
    clienteId: "2",
    telefone: "(11) 91234-5678",
    produto: "Medicamento B",
    tipo: "Atualização de Gestação",
    status: "Revisão",
    statusVariant: "pending" as const,
    protocoloId: "protocolo-2",
    hasFup: false,
  },
  {
    id: "GES-2023-0003",
    protocolo: "2023061700003-GN003",
    criadoEm: "17/06/2023",
    atualizadoEm: "22/06/2023",
    cliente: "Farmácia Saúde",
    clienteId: "3",
    telefone: "(11) 3456-7890",
    produto: "Dispositivo Médico X",
    tipo: "Nascimento",
    status: "Aberto",
    statusVariant: "pending" as const,
    protocoloId: "protocolo-3",
    hasFup: true,
    followUps: [
      { id: "GA004", data: "22/06/2023" },
      { id: "GA005", data: "28/06/2023" }
    ],
  },
  {
    id: "GES-2023-0004",
    protocolo: "2023061800004-GI004",
    criadoEm: "18/06/2023",
    atualizadoEm: "19/06/2023",
    cliente: "Ana Oliveira",
    clienteId: "4",
    telefone: "(11) 99876-5432",
    produto: "Medicamento C",
    tipo: "Gestação Inicial",
    status: "Farmacovigilância",
    statusVariant: "completed" as const,
    protocoloId: "protocolo-4",
    hasFup: false,
  },
  {
    id: "GES-2023-0005",
    protocolo: "2023061900005-GN005",
    criadoEm: "19/06/2023",
    atualizadoEm: "21/06/2023",
    cliente: "Carlos Mendes",
    clienteId: "5",
    telefone: "(11) 98765-1234",
    produto: "Medicamento D",
    tipo: "Atualização de Gestação",
    status: "Retornado",
    statusVariant: "pending" as const,
    protocoloId: "protocolo-5",
    hasFup: true,
    followUps: [
      { id: "GA006", data: "24/06/2023" },
      { id: "GA007", data: "29/06/2023" },
      { id: "GA008", data: "04/07/2023" },
      { id: "GA009", data: "10/07/2023" },
      { id: "GA010", data: "15/07/2023" }
    ],
  },
]

// Lista de opções para os filtros
const PROTOCOLOS = ["2023061500001-GI001", "2023061600002-GI002", "2023061700003-GN003", "2023061800004-GI004", "2023061900005-GN005"]
const CLIENTES = ["Maria Silva", "João Santos", "Farmácia Saúde", "Ana Oliveira", "Carlos Mendes"]
const TELEFONES = ["(11) 98765-4321", "(11) 91234-5678", "(11) 3456-7890", "(11) 99876-5432", "(11) 98765-1234"]
const PRODUTOS = ["Medicamento A", "Medicamento B", "Dispositivo Médico X", "Medicamento C", "Medicamento D"]
const TIPOS = ["Gestação Inicial", "Atualização de Gestação", "Nascimento"]
const STATUS = ["Aberto", "Revisão", "Rejeitado", "Retornado", "Farmacovigilância", "Concluído"]

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

export default function GestacaoPage() {
  const [protocoloFiltro, setProtocoloFiltro] = useState<string | undefined>(undefined)
  const [dataInicio, setDataInicio] = useState<Date>()
  const [dataFim, setDataFim] = useState<Date>()
  const [clienteFiltro, setClienteFiltro] = useState<string | undefined>(undefined)
  const [telefoneFiltro, setTelefoneFiltro] = useState<string | undefined>(undefined)
  const [produtoFiltro, setProdutoFiltro] = useState<string | undefined>(undefined)
  const [tipoFiltro, setTipoFiltro] = useState<string | undefined>(undefined)
  const [statusFiltro, setStatusFiltro] = useState<string | undefined>(undefined)
  const [isNovoRegistroDialogOpen, setIsNovoRegistroDialogOpen] = useState(false)
  const [showNovaGestacao, setShowNovaGestacao] = useState(false)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [hoveredFollowUp, setHoveredFollowUp] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Estado para o formulário de novo registro
  const [formData, setFormData] = useState({
    cliente: "",
    produto: "",
    dataInicio: "",
    dataFim: "",
    reacaoAdversa: "",
    descricao: "",
    gravidade: "leve",
    desfecho: "recuperado",
    medicamentosSuspensos: false,
    hospitalizado: false,
    observacoes: "",
  })

  // Filtrar notificações com base nos filtros
  const allFilteredNotificacoes = GESTACAO_MOCK.filter((notificacao) => {
    // Filtro de protocolo
    const matchesProtocolo = !protocoloFiltro || notificacao.protocolo === protocoloFiltro

    // Filtro de data início
    const matchesDataInicio = !dataInicio || new Date(notificacao.criadoEm.split("/").reverse().join("-")) >= dataInicio

    // Filtro de data fim
    const matchesDataFim = !dataFim || new Date(notificacao.criadoEm.split("/").reverse().join("-")) <= dataFim

    // Filtro de cliente
    const matchesCliente = !clienteFiltro || notificacao.cliente === clienteFiltro

    // Filtro de telefone
    const matchesTelefone = !telefoneFiltro || notificacao.telefone === telefoneFiltro

    // Filtro de produto
    const matchesProduto = !produtoFiltro || notificacao.produto === produtoFiltro

    // Filtro de tipo
    const matchesTipo = !tipoFiltro || notificacao.tipo === tipoFiltro

    // Filtro de status
    const matchesStatus = !statusFiltro || notificacao.status === statusFiltro

    return matchesProtocolo && matchesDataInicio && matchesDataFim && matchesCliente && matchesTelefone && matchesProduto && matchesTipo && matchesStatus
  })

  // Calcular paginação
  const totalPages = Math.ceil(allFilteredNotificacoes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const filteredNotificacoes = allFilteredNotificacoes.slice(startIndex, endIndex)

  // Funções de navegação
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const resetFilters = () => {
    setProtocoloFiltro(undefined)
    setDataInicio(undefined)
    setDataFim(undefined)
    setClienteFiltro(undefined)
    setTelefoneFiltro(undefined)
    setProdutoFiltro(undefined)
    setTipoFiltro(undefined)
    setStatusFiltro(undefined)
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
    if (!formData.cliente || !formData.produto || !formData.reacaoAdversa || !formData.descricao) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    // Simulação de envio
    toast({
      title: "Registro criado",
      description: "O registro de gestação foi criado com sucesso",
      duration: 3000,
    })

    setIsNovoRegistroDialogOpen(false)

    // Resetar formulário
    setFormData({
      cliente: "",
      produto: "",
      dataInicio: "",
      dataFim: "",
      reacaoAdversa: "",
      descricao: "",
      gravidade: "leve",
      desfecho: "recuperado",
      medicamentosSuspensos: false,
      hospitalizado: false,
      observacoes: "",
    })
  }

  const handleNovaGestacao = (data: any) => {
    toast({
      title: "Gestação criada",
      description: "O registro de gestação foi criado com sucesso",
      duration: 3000,
    });
    setShowNovaGestacao(false);
  };

  return (
    <DashboardLayout>
      {showNovaGestacao ? (
        <div className="space-y-6 p-4">
          <NovaGestacaoForm 
            onSubmit={handleNovaGestacao} 
            onBack={() => setShowNovaGestacao(false)}
          />
        </div>
      ) : (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="p-4 rounded-lg flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Gestação</h1>
            <p className="text-sm text-gray-600 mt-1">Gerenciamento de eventos relacionados à gestação</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mb-4">
          <div className="flex gap-2 w-full sm:w-auto">
             <Button
               className="bg-[#26B99D] hover:bg-[#1E9A82] w-full sm:w-auto text-white"
               onClick={() => setShowNovaGestacao(true)}
             >
              <Plus className="h-4 w-4 mr-2" />
              Nova Gestação
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Protocolo</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {protocoloFiltro ? protocoloFiltro : "Todos os protocolos"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Buscar protocolo..." />
                        <CommandList>
                          <CommandEmpty>Nenhum protocolo encontrado.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value=""
                              onSelect={() => setProtocoloFiltro(undefined)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  !protocoloFiltro ? "opacity-100" : "opacity-0"
                                )}
                              />
                              Todos os protocolos
                            </CommandItem>
                            {PROTOCOLOS.map((protocolo) => (
                              <CommandItem
                                key={protocolo}
                                value={protocolo}
                                onSelect={() => setProtocoloFiltro(protocolo)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    protocoloFiltro === protocolo ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {protocolo}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

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
                  <label className="text-sm font-medium">Cliente</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {clienteFiltro ? clienteFiltro : "Todos os clientes"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Buscar cliente..." />
                        <CommandList>
                          <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value=""
                              onSelect={() => setClienteFiltro(undefined)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  !clienteFiltro ? "opacity-100" : "opacity-0"
                                )}
                              />
                              Todos os clientes
                            </CommandItem>
                            {CLIENTES.map((cliente) => (
                              <CommandItem
                                key={cliente}
                                value={cliente}
                                onSelect={() => setClienteFiltro(cliente)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    clienteFiltro === cliente ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {cliente}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Telefone</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {telefoneFiltro ? telefoneFiltro : "Todos os telefones"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Buscar telefone..." />
                        <CommandList>
                          <CommandEmpty>Nenhum telefone encontrado.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value=""
                              onSelect={() => setTelefoneFiltro(undefined)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  !telefoneFiltro ? "opacity-100" : "opacity-0"
                                )}
                              />
                              Todos os telefones
                            </CommandItem>
                            {TELEFONES.map((telefone) => (
                              <CommandItem
                                key={telefone}
                                value={telefone}
                                onSelect={() => setTelefoneFiltro(telefone)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    telefoneFiltro === telefone ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {telefone}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Produto</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {produtoFiltro ? produtoFiltro : "Todos os produtos"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Buscar produto..." />
                        <CommandList>
                          <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value=""
                              onSelect={() => setProdutoFiltro(undefined)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  !produtoFiltro ? "opacity-100" : "opacity-0"
                                )}
                              />
                              Todos os produtos
                            </CommandItem>
                            {PRODUTOS.map((produto) => (
                              <CommandItem
                                key={produto}
                                value={produto}
                                onSelect={() => setProdutoFiltro(produto)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    produtoFiltro === produto ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {produto}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {tipoFiltro ? tipoFiltro : "Todos os tipos"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Buscar tipo..." />
                        <CommandList>
                          <CommandEmpty>Nenhum tipo encontrado.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value=""
                              onSelect={() => setTipoFiltro(undefined)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  !tipoFiltro ? "opacity-100" : "opacity-0"
                                )}
                              />
                              Todos os tipos
                            </CommandItem>
                            {TIPOS.map((tipo) => (
                              <CommandItem
                                key={tipo}
                                value={tipo}
                                onSelect={() => setTipoFiltro(tipo)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    tipoFiltro === tipo ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {tipo}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {statusFiltro ? statusFiltro : "Todos os status"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Buscar status..." />
                        <CommandList>
                          <CommandEmpty>Nenhum status encontrado.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value=""
                              onSelect={() => setStatusFiltro(undefined)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  !statusFiltro ? "opacity-100" : "opacity-0"
                                )}
                              />
                              Todos os status
                            </CommandItem>
                            {STATUS.map((status) => (
                              <CommandItem
                                key={status}
                                value={status}
                                onSelect={() => setStatusFiltro(status)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    statusFiltro === status ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {status}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
                    <TableHead>Protocolo</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Atualizado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotificacoes.length > 0 ? (
                    filteredNotificacoes.map((notificacao) => (
                      <React.Fragment key={notificacao.id}>
                        <TableRow>
                          <TableCell className="font-medium">
                             <span>{notificacao.protocolo}</span>
                          </TableCell>
                        <TableCell>{notificacao.criadoEm}</TableCell>
                        <TableCell>
                          <Link href={`/clientes/${notificacao.clienteId}`} className="text-[#26B99D] hover:underline">
                            {notificacao.cliente}
                          </Link>
                        </TableCell>
                        <TableCell>{notificacao.produto}</TableCell>
                        <TableCell className="text-black">
                          {notificacao.tipo}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {notificacao.statusVariant === "completed" ? (
                              <CheckCircle className="h-4 w-4 text-[#26B99D]" />
                            ) : (
                              <Clock className="h-4 w-4 text-amber-500" />
                            )}
                            <span>{notificacao.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>{notificacao.atualizadoEm}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                             {/* Botão de Ver Follow Up - sempre presente */}
                             <Button
                               variant="outline"
                               size="sm"
                               className={`h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 ${
                                 notificacao.followUps && notificacao.followUps.length > 0 
                                   ? 'text-green-600 hover:text-green-600' 
                                   : ''
                               }`}
                               title="Notificação de seguimento"
                               onClick={() => setExpandedRow(expandedRow === notificacao.id ? null : notificacao.id)}
                             >
                               <FilePlus className="h-4 w-4" />
                             </Button>
                            
                            {/* Botão de Editar/Visualizar - condicional baseado no status */}
                            {notificacao.status === "Concluído" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-[#E6F7F5] hover:text-[#26B99D] hover:border-[#26B99D]"
                                title="Visualizar"
                                asChild
                              >
                                <Link href={`/protocolos/${notificacao.protocoloId}?tab=gestacao`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300"
                                title="Editar"
                                asChild
                              >
                                <Link href={`/protocolos/${notificacao.protocoloId}?tab=gestacao&mode=edit`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                            
                            {/* Botão de Excluir - sempre presente */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                              title="Excluir"
                              onClick={() => {
                                toast({
                                  title: "Confirmar exclusão",
                                  description: `Deseja realmente excluir o registro ${notificacao.id}?`,
                                  duration: 3000,
                                })
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      
                       {/* Linha do acordeon com follow-ups */}
                       {expandedRow === notificacao.id && (
                        <TableRow>
                          <TableCell colSpan={8} className={`bg-gradient-to-br from-gray-50 to-slate-50 p-6 border-l-4 ${
                            notificacao.followUps && notificacao.followUps.length > 0 
                              ? 'border-green-400' 
                              : 'border-gray-400'
                          }`}>
                            <div className="space-y-4">
                               <div className="flex items-center gap-2 mb-4">
                                 <div className="p-2 bg-green-100 rounded-lg">
                                   <FilePlus className="h-5 w-5 text-green-600" />
                                 </div>
                                 <h4 className="font-semibold text-gray-800 text-lg">Notificações de seguimento</h4>
                                 {notificacao.followUps && notificacao.followUps.length > 0 && (
                                   <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700">
                                     {notificacao.followUps.length} {notificacao.followUps.length === 1 ? 'registro' : 'registros'}
                                   </Badge>
                                 )}
                               </div>
                               
                               {notificacao.followUps && notificacao.followUps.length > 0 ? (
                                 <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                   {notificacao.followUps.map((followUp, index) => (
                                     <div
                                       key={followUp.id}
                                       className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-gray-300 transition-all duration-300"
                                     >
                                       {/* Linha superior: Ícone + ID + Warning */}
                                       <div className="flex items-center justify-between mb-3">
                                         <div className="flex items-center gap-2">
                                          <div className="p-1.5 bg-[#DCFCE7] rounded-lg">
                                            {followUp.id.startsWith('GA') ? (
                                              <ClipboardPenLine className="h-4 w-4 text-[#16A34A]" />
                                            ) : followUp.id.startsWith('GN') ? (
                                              <Baby className="h-4 w-4 text-[#16A34A]" />
                                            ) : (
                                              <FilePlus className="h-4 w-4 text-[#16A34A]" />
                                            )}
                                          </div>
                                           <span className="font-semibold text-gray-900 text-sm">{followUp.id}</span>
                                         </div>
                                         <div className="p-1">
                                           <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                         </div>
                                       </div>

                                       {/* Linha do meio: Data + Botões */}
                                       <div className="flex items-center justify-between mb-3">
                                         <div className="flex items-center gap-2 text-sm text-gray-600">
                                           <CalendarIcon className="h-4 w-4 text-gray-400" />
                                           <span>{followUp.data}</span>
                                         </div>
                                         <div className="flex items-center gap-2">
                                           <Button
                                             variant="outline"
                                             size="sm"
                                             className="h-8 w-8 p-0 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
                                             title="Ver detalhes do follow-up"
                                           >
                                             <Eye className="h-3 w-3 text-gray-600" />
                                           </Button>
                                           <Button
                                             variant="outline"
                                             size="sm"
                                             className="h-8 w-8 p-0 bg-white border-red-300 hover:bg-red-50 hover:border-red-400 shadow-sm"
                                             title="Excluir follow-up"
                                             onClick={(e) => {
                                               e.stopPropagation();
                                               toast({
                                                 title: "Follow-up excluído",
                                                 description: `O follow-up ${followUp.id} foi excluído com sucesso.`,
                                                 duration: 3000,
                                               });
                                             }}
                                           >
                                             <Trash2 className="h-3 w-3 text-red-600" />
                                           </Button>
                                         </div>
                                       </div>

                                       {/* Linha inferior: Criado por */}
                                       <div className="text-sm text-gray-600">
                                         Criado por: Administrador
                                       </div>
                                     </div>
                                   ))}
                                   
                                   {/* Botão Novo Follow-up */}
                                   <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-4 hover:bg-gray-200 hover:border-gray-400 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[140px]">
                                     <div className="w-12 h-12 bg-gray-200 border border-gray-400 rounded-lg flex items-center justify-center mb-3">
                                       <Plus className="h-6 w-6 text-gray-600" />
                                     </div>
                                     <span className="text-sm font-medium text-gray-700 text-center">Nova Notificação de seguimento</span>
                                   </div>
                                 </div>
                               ) : (
                                 /* Quando não há follow-ups, mostrar mensagem e botão centralizados */
                                 <div className="flex flex-col items-center justify-center py-12">
                                   <p className="text-gray-500 text-sm mb-4">Não há registros de notificações de seguimento criados</p>
                                   <Button
                                     variant="outline"
                                     className="bg-gray-100 border-2 border-dashed border-gray-300 hover:bg-gray-200 hover:border-gray-400 transition-all duration-300"
                                   >
                                     <Plus className="h-4 w-4 mr-2" />
                                     Nova Notificação de seguimento
                                   </Button>
                                 </div>
                               )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                      </React.Fragment>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6">
                        Nenhuma notificação encontrada com os critérios de busca.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1}-{Math.min(endIndex, allFilteredNotificacoes.length)} de {allFilteredNotificacoes.length} notificações
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              
              {/* Números das páginas */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 p-0 ${currentPage === page ? 'bg-primary text-primary-foreground' : ''}`}
                >
                  {page}
                </Button>
              ))}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Próximo
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Dialog para Novo Registro */}
        <Dialog open={isNovoRegistroDialogOpen} onOpenChange={setIsNovoRegistroDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Registro de Gestação</DialogTitle>
            <DialogDescription>
              Preencha os dados para criar um novo registro de gestação.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente *</Label>
                <Select value={formData.cliente} onValueChange={(value) => handleSelectChange("cliente", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLIENTES_MOCK.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.nome}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="produto">Produto *</Label>
                <Input
                  id="produto"
                  name="produto"
                  value={formData.produto}
                  onChange={handleInputChange}
                  placeholder="Nome do produto"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data de Início</Label>
                <Input
                  id="dataInicio"
                  name="dataInicio"
                  type="date"
                  value={formData.dataInicio}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataFim">Data de Fim</Label>
                <Input
                  id="dataFim"
                  name="dataFim"
                  type="date"
                  value={formData.dataFim}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reacaoAdversa">Reação Adversa *</Label>
              <Input
                id="reacaoAdversa"
                name="reacaoAdversa"
                value={formData.reacaoAdversa}
                onChange={handleInputChange}
                placeholder="Descreva a reação adversa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                placeholder="Descrição detalhada do evento"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gravidade">Gravidade</Label>
                <Select value={formData.gravidade} onValueChange={(value) => handleSelectChange("gravidade", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leve">Leve</SelectItem>
                    <SelectItem value="moderada">Moderada</SelectItem>
                    <SelectItem value="grave">Grave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="desfecho">Desfecho</Label>
                <Select value={formData.desfecho} onValueChange={(value) => handleSelectChange("desfecho", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recuperado">Recuperado</SelectItem>
                    <SelectItem value="em_tratamento">Em Tratamento</SelectItem>
                    <SelectItem value="sequelas">Sequelas</SelectItem>
                    <SelectItem value="fatal">Fatal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medicamentosSuspensos"
                  checked={formData.medicamentosSuspensos}
                  onCheckedChange={(checked) => handleCheckboxChange("medicamentosSuspensos", checked as boolean)}
                />
                <Label htmlFor="medicamentosSuspensos">Medicamentos suspensos</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hospitalizado"
                  checked={formData.hospitalizado}
                  onCheckedChange={(checked) => handleCheckboxChange("hospitalizado", checked as boolean)}
                />
                <Label htmlFor="hospitalizado">Hospitalizado</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleInputChange}
                placeholder="Observações adicionais"
                rows={2}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsNovoRegistroDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#26B99D] hover:bg-[#1E9A82]">
                Criar Registro
              </Button>
            </DialogFooter>
          </form>
         </DialogContent>
        </Dialog>
      </div>
      )}
     </DashboardLayout>
   )
 }
