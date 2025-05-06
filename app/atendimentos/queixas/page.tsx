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
      cliente.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cliente.documento.includes(searchQuery) ||
      cliente.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cliente.telefone.includes(searchQuery),
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
              asChild
            >
              <Link href="/atendimentos/queixas/nova">
                <Plus className="h-4 w-4 mr-2" />
                Nova Queixa Técnica
              </Link>
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
    </DashboardLayout>
  )
}

