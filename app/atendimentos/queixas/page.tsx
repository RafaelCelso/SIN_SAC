"use client"

import React, { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, FileText, CheckCircle, Clock, AlertTriangle, Plus, CalendarIcon, Loader, Eye, ArrowLeftCircle, XCircle, ClipboardPenLine } from "lucide-react"
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
import { Separator } from "@/components/ui/separator"

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
    status: "Aberto",
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
    status: "Revisão",
    statusVariant: "pending" as const,
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
    status: "Qualidade",
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

const STATUS = ["Aberto", "Revisão", "Qualidade", "Retorno para Atendimento", "Em análise", "Concluído", "Inválido"]

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

const PRODUTOS_MOCK = [
  { nome: "Medicamento A", ean: "7891234567890", lote: "L2024001" },
  { nome: "Medicamento B", ean: "7891234567891", lote: "L2024002" },
  { nome: "Dispositivo Médico X", ean: "7891234567892", lote: "L2024003" },
  { nome: "Dispositivo Médico Y", ean: "7891234567893", lote: "L2024004" },
  { nome: "Medicamento C", ean: "7891234567894", lote: "L2024005" },
];

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
  const [showResults, setShowResults] = useState(false)
  const [produtoSearch, setProdutoSearch] = useState("");
  const [showProdutosList, setShowProdutosList] = useState(false);
  const [produtosFiltrados, setProdutosFiltrados] = useState(PRODUTOS_MOCK);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleSearch = () => {
    // A busca já é feita automaticamente pelo filteredClientes
    // Esta função é apenas para manter a consistência com o evento onKeyDown
  }

  React.useEffect(() => {
    const termoBusca = produtoSearch.toLowerCase();
    const produtos = PRODUTOS_MOCK.filter(
      produto =>
        produto.nome.toLowerCase().includes(termoBusca) ||
        produto.ean.includes(termoBusca)
    );
    setProdutosFiltrados(produtos);
  }, [produtoSearch]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowProdutosList(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSelectProduto(produto: typeof PRODUTOS_MOCK[0]) {
    setFormData(prev => ({ ...prev, produto: produto.nome }));
    setProdutoSearch("");
    setShowProdutosList(false);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="p-4 rounded-lg flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Queixas Técnicas</h1>
            <p className="text-sm text-gray-600 mt-1">Gerenciamento de queixas técnicas relacionadas a produtos</p>
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
              variant="default"
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
                        <TableCell>{queixa.tipo}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {queixa.status === "Concluído" ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-[#26B99D]" />
                                <span>{queixa.status}</span>
                              </>
                            ) : queixa.status === "Em análise" ? (
                              <>
                                <Clock className="h-4 w-4 text-amber-500" />
                                <span>{queixa.status}</span>
                              </>
                            ) : queixa.status === "Aberto" ? (
                              <>
                                <Loader className="h-4 w-4 text-blue-500 animate-spin" />
                                <span>{queixa.status}</span>
                              </>
                            ) : queixa.status === "Revisão" ? (
                              <>
                                <Eye className="h-4 w-4 text-purple-500" />
                                <span>{queixa.status}</span>
                              </>
                            ) : queixa.status === "Qualidade" ? (
                              <>
                                <ClipboardPenLine className="h-4 w-4 text-indigo-500" />
                                <span>{queixa.status}</span>
                              </>
                            ) : queixa.status === "Retorno para Atendimento" ? (
                              <>
                                <ArrowLeftCircle className="h-4 w-4 text-orange-500" />
                                <span>{queixa.status}</span>
                              </>
                            ) : queixa.status === "Inválido" ? (
                              <>
                                <XCircle className="h-4 w-4 text-red-500" />
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
      <Dialog open={isNovaQueixaDialogOpen} onOpenChange={(open) => {
        setIsNovaQueixaDialogOpen(open)
        if (!open) {
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
          setSelectedCliente(null)
          setClienteSearchQuery("")
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Queixa Técnica</DialogTitle>
            <DialogDescription>Preencha o formulário abaixo para registrar uma nova queixa técnica</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitQueixa} className="space-y-6">
            {/* Informações do Cliente */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#15937E" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-3.33 0-10 1.67-10 5v1a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-1c0-3.33-6.67-5-10-5Z"/></svg>
                <h3 className="text-lg font-bold text-black">Informações do Cliente</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar por nome, CPF, telefone ou email"
                      className="pl-8 h-11"
                      value={clienteSearchQuery}
                      onChange={(e) => {
                        setClienteSearchQuery(e.target.value)
                        setShowResults(true)
                      }}
                    />
                  </div>
                  {showResults && filteredClientes.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
                      {filteredClientes.map((cliente) => (
                        <button
                          key={cliente.id}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b last:border-b-0"
                          onClick={() => {
                            setSelectedCliente(cliente)
                            setClienteSearchQuery("")
                            setShowResults(false)
                          }}
                        >
                          <div className="font-medium text-gray-900">{cliente.nome}</div>
                          <div className="text-sm text-gray-500">
                            {cliente.documento} • {cliente.telefone}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {selectedCliente && (
                  <div className="flex items-center justify-between p-4 rounded-lg border-2 border-[#26B99D] bg-[#F7FDFC] shadow-md mt-2 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#15937E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                          <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-3.33 0-10 1.67-10 5v1a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-1c0-3.33-6.67-5-10-5Z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-lg text-gray-900">{selectedCliente.nome}</div>
                        <div className="flex flex-wrap gap-6 text-sm text-gray-700 mt-1">
                          <span><span className="font-medium">CPF:</span> {selectedCliente.documento}</span>
                          <span><span className="font-medium">Telefone:</span> {selectedCliente.telefone}</span>
                          <span><span className="font-medium">Email:</span> <span className="text-gray-600">{selectedCliente.email}</span></span>
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      className="bg-[#26B99D] hover:bg-[#1E9A82] text-white font-semibold px-6"
                      onClick={() => setSelectedCliente(null)}
                    >
                      Remover
                    </Button>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="contato">Contato</Label>
                  <Input id="contato" placeholder="Nome do contato" />
                </div>
              </div>
            </div>
            <Separator className="my-6" />
            {/* Informações do Produto */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#15937E" strokeWidth="1.5"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4"/></svg>
                <h3 className="text-lg font-bold text-black">Informações do Produto</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="produto">
                    Produto <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Buscar produto por nome ou EAN"
                      className="h-11 pl-10"
                      value={produtoSearch}
                      onChange={e => setProdutoSearch(e.target.value)}
                      onFocus={() => setShowProdutosList(true)}
                      ref={searchInputRef}
                      required
                    />
                    {showProdutosList && (
                      <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
                        {produtosFiltrados.length > 0 ? (
                          produtosFiltrados.map((produto, index) => (
                            <button
                              key={produto.ean}
                              className={`w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${index !== produtosFiltrados.length - 1 ? "border-b" : ""}`}
                              onClick={() => handleSelectProduto(produto)}
                              type="button"
                            >
                              <div className="font-medium text-gray-900">{produto.nome}</div>
                              <div className="text-sm text-gray-500">EAN: {produto.ean}</div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500">Nenhum produto encontrado</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lote">
                    Número do Lote <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Buscar por lote"
                      className="h-11 pl-10"
                      value={formData.lote}
                      onChange={handleInputChange}
                      name="lote"
                      required
                    />
                  </div>
                </div>
                {formData.produto && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                    <div className="font-medium text-gray-900">{formData.produto}</div>
                    <div className="text-sm text-gray-500">
                      EAN: {PRODUTOS_MOCK.find(p => p.nome === formData.produto)?.ean}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Separator className="my-6" />
            {/* Detalhes da Queixa */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#EAB308" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <h3 className="text-lg font-bold text-black">Detalhes da Queixa</h3>
              </div>
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
            <Separator className="my-6" />
            {/* Observações */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#15937E" strokeWidth="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/></svg>
                <h3 className="text-lg font-bold text-black">Observações</h3>
              </div>
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

