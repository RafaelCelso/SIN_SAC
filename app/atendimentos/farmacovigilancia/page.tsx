"use client"

import React, { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, FileText, CheckCircle, Clock, AlertTriangle, Plus, CalendarIcon, Package, Barcode, ArrowLeft, Edit, Eye, Trash2, ClipboardPlus, ChevronDown, ChevronRight, ExternalLink } from "lucide-react"
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
import Link from "next/link"
import { NovaFarmacovigilanciaForm } from "./NovaFarmacovigilanciaForm"

// Dados simulados de farmacovigilância
const FARMACOVIGILANCIA_MOCK = [
  {
    id: "FV-2023-0001",
    data: "15/06/2023",
    cliente: "Maria Silva",
    clienteId: "1",
    produto: "Medicamento A",
    reacao: "Náusea",
    gravidade: "Leve",
    status: "Concluído",
    statusVariant: "completed" as const,
    protocoloId: "protocolo-1",
    hasFup: true,
    followUps: [
      { id: "FUP-001", data: "20/06/2023" },
      { id: "FUP-002", data: "25/06/2023" }
    ],
  },
  {
    id: "FV-2023-0002",
    data: "16/06/2023",
    cliente: "João Santos",
    clienteId: "2",
    produto: "Medicamento B",
    reacao: "Erupção cutânea",
    gravidade: "Moderada",
    status: "Em análise",
    statusVariant: "pending" as const,
    protocoloId: "protocolo-2",
    hasFup: false,
  },
  {
    id: "FV-2023-0003",
    data: "17/06/2023",
    cliente: "Farmácia Saúde",
    clienteId: "3",
    produto: "Dispositivo Médico X",
    reacao: "Diarreia",
    gravidade: "Grave",
    status: "Pendente",
    statusVariant: "pending" as const,
    protocoloId: "protocolo-3",
    hasFup: true,
    followUps: [
      { id: "FUP-003", data: "22/06/2023" }
    ],
  },
  {
    id: "FV-2023-0004",
    data: "18/06/2023",
    cliente: "Ana Oliveira",
    clienteId: "4",
    produto: "Medicamento C",
    reacao: "Tontura",
    gravidade: "Moderada",
    status: "Concluído",
    statusVariant: "completed" as const,
    protocoloId: "protocolo-4",
    hasFup: false,
  },
  {
    id: "FV-2023-0005",
    data: "19/06/2023",
    cliente: "Carlos Mendes",
    clienteId: "5",
    produto: "Medicamento D",
    reacao: "Dor abdominal",
    gravidade: "Leve",
    status: "Em análise",
    statusVariant: "pending" as const,
    protocoloId: "protocolo-5",
    hasFup: true,
    followUps: [
      { id: "FUP-004", data: "24/06/2023" },
      { id: "FUP-005", data: "29/06/2023" },
      { id: "FUP-006", data: "04/07/2023" }
    ],
  },
]

// Lista de gravidades e status para os filtros
const GRAVIDADES = ["Leve", "Moderada", "Grave"]
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
]

export default function FarmacovigilanciaPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dataInicio, setDataInicio] = useState<Date>()
  const [dataFim, setDataFim] = useState<Date>()
  const [gravidadeFiltro, setGravidadeFiltro] = useState<string>("")
  const [statusFiltro, setStatusFiltro] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)
  const [isNovoRegistroDialogOpen, setIsNovoRegistroDialogOpen] = useState(false)
  const [showNovaFarmacovigilancia, setShowNovaFarmacovigilancia] = useState(false)
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
  const allFilteredNotificacoes = FARMACOVIGILANCIA_MOCK.filter((notificacao) => {
    // Filtro de texto (busca)
    const matchesSearch =
      searchQuery === "" ||
      notificacao.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notificacao.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notificacao.produto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notificacao.reacao.toLowerCase().includes(searchQuery.toLowerCase())

    // Filtro de data início
    const matchesDataInicio = !dataInicio || new Date(notificacao.data.split("/").reverse().join("-")) >= dataInicio

    // Filtro de data fim
    const matchesDataFim = !dataFim || new Date(notificacao.data.split("/").reverse().join("-")) <= dataFim

    // Filtro de gravidade
    const matchesGravidade = !gravidadeFiltro || notificacao.gravidade === gravidadeFiltro

    // Filtro de status
    const matchesStatus = !statusFiltro || notificacao.status === statusFiltro

    return matchesSearch && matchesGravidade && matchesStatus && matchesDataInicio && matchesDataFim
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
    setSearchQuery("")
    setDataInicio(undefined)
    setDataFim(undefined)
    setGravidadeFiltro("")
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
      description: "O registro de farmacovigilância foi criado com sucesso",
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

  const handleNovaFarmacovigilancia = (data: any) => {
    toast({
      title: "Farmacovigilância criada",
      description: "O registro de farmacovigilância foi criado com sucesso",
      duration: 3000,
    });
    setShowNovaFarmacovigilancia(false);
  };

  return (
    <DashboardLayout>
      {showNovaFarmacovigilancia ? (
        <div className="space-y-6 p-4">
          <NovaFarmacovigilanciaForm 
            onSubmit={handleNovaFarmacovigilancia} 
            onBack={() => setShowNovaFarmacovigilancia(false)}
          />
        </div>
      ) : (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="p-4 rounded-lg flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Farmacovigilância</h1>
            <p className="text-sm text-gray-600 mt-1">Gerenciamento de eventos adversos e farmacovigilância</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <div className="relative w-full sm:w-[350px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar Farmacovigilância..."
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
              className="bg-[#26B99D] hover:bg-[#1E9A82] w-full sm:w-auto text-white"
                onClick={() => setShowNovaFarmacovigilancia(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Farmacovigilância
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle></CardTitle>
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
                  <label className="text-sm font-medium">Gravidade</label>
                  <Select value={gravidadeFiltro} onValueChange={setGravidadeFiltro}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as gravidades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as gravidades</SelectItem>
                      {GRAVIDADES.map((gravidade) => (
                        <SelectItem key={gravidade} value={gravidade}>
                          {gravidade}
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
                    <TableHead>Protocolo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Gravidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotificacoes.length > 0 ? (
                    filteredNotificacoes.map((notificacao) => (
                      <React.Fragment key={notificacao.id}>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <span>{notificacao.id}</span>
                              {notificacao.hasFup && (
                                <Badge 
                                  variant="secondary" 
                                  className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-1 cursor-pointer hover:bg-blue-100 transition-colors"
                                  onClick={() => setExpandedRow(expandedRow === notificacao.id ? null : notificacao.id)}
                                >
                                  <div className="flex items-center gap-1">
                                    {expandedRow === notificacao.id ? (
                                      <ChevronDown className="h-3 w-3" />
                                    ) : (
                                      <ChevronRight className="h-3 w-3" />
                                    )}
                                    Ver Follow-ups
                                  </div>
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        <TableCell>{notificacao.data}</TableCell>
                        <TableCell>
                          <Link href={`/clientes/${notificacao.clienteId}`} className="text-[#26B99D] hover:underline">
                            {notificacao.cliente}
                          </Link>
                        </TableCell>
                        <TableCell>{notificacao.produto}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              notificacao.gravidade === "Leve"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : notificacao.gravidade === "Moderada"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                            }
                          >
                            {notificacao.gravidade}
                          </Badge>
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
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Botão de Criar Follow Up - sempre presente */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                              title="Criar Follow Up"
                            >
                              <ClipboardPlus className="h-4 w-4" />
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
                                <Link href={`/protocolos/${notificacao.protocoloId}?tab=farmacovigilancia`}>
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
                                <Link href={`/protocolos/${notificacao.protocoloId}?tab=farmacovigilancia&mode=edit`}>
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
                      {expandedRow === notificacao.id && notificacao.hasFup && notificacao.followUps && (
                        <TableRow>
                          <TableCell colSpan={7} className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 border-l-4 border-green-400">
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-green-100 rounded-lg">
                                  <FileText className="h-5 w-5 text-green-600" />
                                </div>
                                <h4 className="font-semibold text-gray-800 text-lg">Follow-ups Registrados</h4>
                                <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700">
                                  {notificacao.followUps.length} {notificacao.followUps.length === 1 ? 'registro' : 'registros'}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {notificacao.followUps.map((followUp, index) => (
                                  <div
                                    key={followUp.id}
                                    className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                                    onMouseEnter={() => setHoveredFollowUp(followUp.id)}
                                    onMouseLeave={() => setHoveredFollowUp(null)}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                          <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                                            <ClipboardPlus className="h-4 w-4 text-white" />
                                          </div>
                                          <span className="font-semibold text-gray-900 text-sm">{followUp.id}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                                          <span>{followUp.data}</span>
                                        </div>

                                      </div>
                                      {hoveredFollowUp === followUp.id && (
                                        <div className="flex items-center gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 px-3 text-xs bg-white hover:bg-gray-50 hover:text-gray-600 hover:border-gray-400 border-gray-300 shadow-sm transition-all duration-200"
                                            title="Ver detalhes do follow-up"
                                          >
                                            <ExternalLink className="h-3 w-3 mr-1" />
                                            Ver detalhes
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 w-8 p-0 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-400 border-gray-300 shadow-sm transition-all duration-200"
                                            title="Excluir follow-up"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              // Aqui você pode adicionar a lógica de exclusão
                                              toast({
                                                title: "Follow-up excluído",
                                                description: `O follow-up ${followUp.id} foi excluído com sucesso.`,
                                                duration: 3000,
                                              });
                                            }}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 to-slate-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                      </React.Fragment>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
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
      </div>
      )}
    </DashboardLayout>
  )
}

