"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, FileText, CheckCircle, Clock, AlertTriangle, Plus, CalendarIcon, Package, Barcode } from "lucide-react"
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
  const filteredNotificacoes = FARMACOVIGILANCIA_MOCK.filter((notificacao) => {
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

    return matchesSearch && matchesDataInicio && matchesDataFim && matchesGravidade && matchesStatus
  })

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="bg-gradient-to-r from-[#E6F7F5] to-[#F0FAF8] p-4 rounded-lg border border-[#26B99D] flex-1">
            <h1 className="text-2xl font-bold text-[#26B99D]">Farmacovigilância</h1>
            <p className="text-sm text-[#26B99D] mt-1">
              Monitoramento e registro de eventos adversos relacionados a medicamentos
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <div className="relative w-full sm:w-[350px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar notificações..."
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
              onClick={() => setIsNovoRegistroDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Registro
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Notificações de Farmacovigilância</CardTitle>
            <CardDescription>
              Lista de todas as notificações de eventos adversos relacionados a medicamentos
            </CardDescription>
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
                    <TableHead className="w-[100px]">Código</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Reação Adversa</TableHead>
                    <TableHead>Gravidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotificacoes.length > 0 ? (
                    filteredNotificacoes.map((notificacao) => (
                      <TableRow key={notificacao.id}>
                        <TableCell className="font-medium">{notificacao.id}</TableCell>
                        <TableCell>{notificacao.data}</TableCell>
                        <TableCell>
                          <Link href={`/clientes/${notificacao.clienteId}`} className="text-[#26B99D] hover:underline">
                            {notificacao.cliente}
                          </Link>
                        </TableCell>
                        <TableCell>{notificacao.produto}</TableCell>
                        <TableCell>{notificacao.reacao}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              notificacao.gravidade === "Leve"
                                ? "default"
                                : notificacao.gravidade === "Moderada"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className={notificacao.gravidade === "Leve" ? "bg-[#26B99D]" : ""}
                          >
                            {notificacao.gravidade}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {notificacao.statusVariant === "completed" ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-[#26B99D]" />
                                <span>{notificacao.status}</span>
                              </>
                            ) : notificacao.status === "Em análise" ? (
                              <>
                                <Clock className="h-4 w-4 text-amber-500" />
                                <span>{notificacao.status}</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                <span>{notificacao.status}</span>
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
                            <Link href={`/protocolos/${notificacao.protocoloId}?tab=farmacovigilancia`}>
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
              Mostrando {filteredNotificacoes.length} de {FARMACOVIGILANCIA_MOCK.length} notificações
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

      {/* Dialog para novo registro de farmacovigilância */}
      <Dialog open={isNovoRegistroDialogOpen} onOpenChange={setIsNovoRegistroDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Registro de Farmacovigilância</DialogTitle>
            <DialogDescription>Preencha o formulário abaixo para registrar um novo evento adverso</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-6">
            {/* Informações do Paciente */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#26B99D]">Informações do Paciente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">
                    Paciente <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    name="cliente"
                    value={formData.cliente}
                    onValueChange={(value) => handleSelectChange("cliente", value)}
                    required
                  >
                    <SelectTrigger id="cliente">
                      <SelectValue placeholder="Selecione o paciente" />
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
                  <Label htmlFor="idade">Idade</Label>
                  <Input id="idade" placeholder="Idade do paciente" type="number" />
                </div>
              </div>
            </div>

            {/* Informações do Medicamento */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#26B99D]">Informações do Medicamento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="produto" className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-[#26B99D]" />
                    <span>Medicamento <span className="text-red-500">*</span></span>
                  </Label>
                  <Select
                    name="produto"
                    value={formData.produto}
                    onValueChange={(value) => handleSelectChange("produto", value)}
                    required
                  >
                    <SelectTrigger id="produto" className="h-11">
                      <SelectValue placeholder="Selecione o medicamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medicamento-a">Medicamento A</SelectItem>
                      <SelectItem value="medicamento-b">Medicamento B</SelectItem>
                      <SelectItem value="medicamento-c">Medicamento C</SelectItem>
                      <SelectItem value="medicamento-d">Medicamento D</SelectItem>
                      <SelectItem value="medicamento-e">Medicamento E</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lote" className="flex items-center space-x-2">
                    <Barcode className="h-4 w-4 text-[#26B99D]" />
                    <span>Número do Lote</span>
                  </Label>
                  <Input 
                    id="lote" 
                    placeholder="Ex: ABC123456" 
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataInicio">Data de Início do Uso</Label>
                  <Input
                    id="dataInicio"
                    name="dataInicio"
                    type="date"
                    value={formData.dataInicio}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataFim">Data de Término do Uso</Label>
                  <Input
                    id="dataFim"
                    name="dataFim"
                    type="date"
                    value={formData.dataFim}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Informações da Reação Adversa */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#26B99D]">Informações da Reação Adversa</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reacaoAdversa">
                    Reação Adversa <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="reacaoAdversa"
                    name="reacaoAdversa"
                    placeholder="Ex: Náusea, Erupção cutânea, etc."
                    value={formData.reacaoAdversa}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">
                    Descrição Detalhada <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="descricao"
                    name="descricao"
                    placeholder="Descreva detalhadamente a reação adversa observada"
                    rows={4}
                    value={formData.descricao}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gravidade">Gravidade</Label>
                    <Select
                      name="gravidade"
                      value={formData.gravidade}
                      onValueChange={(value) => handleSelectChange("gravidade", value)}
                    >
                      <SelectTrigger id="gravidade">
                        <SelectValue placeholder="Selecione a gravidade" />
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
                    <Select
                      name="desfecho"
                      value={formData.desfecho}
                      onValueChange={(value) => handleSelectChange("desfecho", value)}
                    >
                      <SelectTrigger id="desfecho">
                        <SelectValue placeholder="Selecione o desfecho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recuperado">Recuperado</SelectItem>
                        <SelectItem value="em-recuperacao">Em recuperação</SelectItem>
                        <SelectItem value="nao-recuperado">Não recuperado</SelectItem>
                        <SelectItem value="sequela">Sequela</SelectItem>
                        <SelectItem value="fatal">Fatal</SelectItem>
                        <SelectItem value="desconhecido">Desconhecido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="medicamentosSuspensos"
                      checked={formData.medicamentosSuspensos}
                      onCheckedChange={(checked) => handleCheckboxChange("medicamentosSuspensos", checked as boolean)}
                    />
                    <Label htmlFor="medicamentosSuspensos">Medicamentos suspensos após a reação</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hospitalizado"
                      checked={formData.hospitalizado}
                      onCheckedChange={(checked) => handleCheckboxChange("hospitalizado", checked as boolean)}
                    />
                    <Label htmlFor="hospitalizado">Paciente foi hospitalizado</Label>
                  </div>
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
              <Button variant="outline" type="button" onClick={() => setIsNovoRegistroDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#26B99D] hover:bg-[#1E9A82]">
                <CheckCircle className="mr-2 h-4 w-4" />
                Registrar Evento Adverso
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

