"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, UserPlus, User, FileText, Clipboard, Phone, Info, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

interface IniciarAtendimentoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Dados simulados de clientes (apenas pessoas físicas)
const CLIENTES_MOCK = [
  {
    id: "1",
    nome: "Maria Silva",
    documento: "123.456.789-00",
    telefone: "(11) 98765-4321",
    email: "maria.silva@email.com",
    endereco: "Av. Paulista, 1000 - São Paulo/SP",
  },
  {
    id: "2",
    nome: "João Santos",
    documento: "987.654.321-00",
    telefone: "(11) 91234-5678",
    email: "joao.santos@email.com",
    endereco: "Rua Augusta, 500 - São Paulo/SP",
  },
]

export function IniciarAtendimentoModal({ open, onOpenChange }: IniciarAtendimentoModalProps) {
  const router = useRouter()
  const [tipoCliente, setTipoCliente] = useState<"cadastrado" | "novo" | "sem-registro">("cadastrado")
  const [tipoContato, setTipoContato] = useState<"ativo" | "receptivo">("ativo")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<typeof CLIENTES_MOCK>([])
  const [selectedCliente, setSelectedCliente] = useState<(typeof CLIENTES_MOCK)[0] | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [showClienteForm, setShowClienteForm] = useState(false)
  const [motivoSelecionado, setMotivoSelecionado] = useState<string>("")
  const [subCategoriaSelecionada, setSubCategoriaSelecionada] = useState<string>("")
  const [detalheSelecionado, setDetalheSelecionado] = useState<string>("")
  const [currentStep, setCurrentStep] = useState<"info" | "contato">("info")
  const [formData, setFormData] = useState({
    tipoContato: "telefone",
    motivo: "",
    descricao: "",
    nome: "",
    email: "",
    telefone: "",
    autorizaRetorno: "sim",
  })

  // Campos para cliente sem registro
  const [nomeSemRegistro, setNomeSemRegistro] = useState("")
  const [telefoneSemRegistro, setTelefoneSemRegistro] = useState("")
  const [emailSemRegistro, setEmailSemRegistro] = useState("")

  // Dados simulados de protocolos abertos
  const protocolosAbertos = [
    {
      id: "P-2023-001",
      data: "15/03/2023",
      tipo: "Queixa Técnica",
      produto: "Medicamento A",
      status: "Em análise",
      clienteId: "1",
    },
    {
      id: "P-2023-045",
      data: "22/04/2023",
      tipo: "Evento Adverso",
      produto: "Medicamento B",
      status: "Pendente",
      clienteId: "1",
    },
    {
      id: "P-2023-078",
      data: "10/05/2023",
      tipo: "Informação Médica",
      produto: "Medicamento C",
      status: "Em andamento",
      clienteId: "2",
    },
  ]

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    const results = CLIENTES_MOCK.filter(
      (cliente) =>
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.documento.includes(searchTerm) ||
        cliente.telefone.includes(searchTerm) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    setSearchResults(results)
    setShowResults(true)
  }

  const handleClienteSelect = (cliente: (typeof CLIENTES_MOCK)[0]) => {
    setSelectedCliente(cliente)
    setShowResults(false)
  }

  const resetForm = () => {
    setTipoCliente("cadastrado")
    setTipoContato("ativo")
    setSearchTerm("")
    setSearchResults([])
    setSelectedCliente(null)
    setShowResults(false)
    setShowClienteForm(false)
    setNomeSemRegistro("")
    setTelefoneSemRegistro("")
    setEmailSemRegistro("")
    setMotivoSelecionado("")
    setSubCategoriaSelecionada("")
    setDetalheSelecionado("")
    setCurrentStep("info")
    setFormData({
      tipoContato: "telefone",
      motivo: "",
      descricao: "",
      nome: "",
      email: "",
      telefone: "",
      autorizaRetorno: "sim",
    })
  }

  const handleNextStep = () => {
    // Validar dados
    if (tipoCliente === "sem-registro" && !nomeSemRegistro.trim()) {
      toast({
        title: "Erro",
        description: "O nome do cliente é obrigatório",
        variant: "destructive",
      })
      return
    }

    if (tipoCliente === "cadastrado" && !selectedCliente) {
      toast({
        title: "Erro",
        description: "Selecione um cliente cadastrado",
        variant: "destructive",
      })
      return
    }

    if (!motivoSelecionado) {
      toast({
        title: "Erro",
        description: "Selecione o motivo do atendimento",
        variant: "destructive",
      })
      return
    }

    // Preencher dados do formulário
    setFormData(prev => ({
      ...prev,
      motivo: motivoSelecionado,
    }))

    setCurrentStep("contato")
  }

  const handleCriarProtocolo = () => {
    // Validar dados
    if (tipoCliente === "sem-registro" && !nomeSemRegistro.trim()) {
      toast({
        title: "Erro",
        description: "O nome do cliente é obrigatório",
        variant: "destructive",
      })
      return
    }

    if (tipoCliente === "cadastrado" && !selectedCliente) {
      toast({
        title: "Erro",
        description: "Selecione um cliente cadastrado",
        variant: "destructive",
      })
      return
    }

    if (!motivoSelecionado) {
      toast({
        title: "Erro",
        description: "Selecione o motivo do atendimento",
        variant: "destructive",
      })
      return
    }

    // Gerar número de protocolo
    const dataAtual = new Date()
    const ano = dataAtual.getFullYear()
    const numeroAleatorio = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
    const novoProtocolo = `AT-${ano}-${numeroAleatorio}`

    // Simular criação de protocolo
    toast({
      title: "Protocolo criado com sucesso",
      description: `Protocolo ${novoProtocolo} registrado`,
      variant: "default",
    })

    // Fechar modal
    onOpenChange(false)

    // Mapear motivo para URL
    const motivoParaURL: Record<string, string> = {
      queixa: "/atendimentos/queixas/nova",
      evento: "/atendimentos/eventos/novo",
      informacao: "/atendimentos/info/nova",
      farmacovigilancia: "/atendimentos/farmacovigilancia/novo",
      outro: "/atendimentos/contatos/novo",
    }

    // Redirecionar para a página específica do motivo
    const urlBase = motivoParaURL[motivoSelecionado] || "/"

    // Adicionar parâmetros de cliente e protocolo
    let urlCompleta = `${urlBase}?protocolo=${novoProtocolo}`

    if (tipoCliente === "cadastrado" && selectedCliente) {
      urlCompleta += `&cliente=${selectedCliente.id}`
    } else if (tipoCliente === "novo") {
      urlCompleta += "&cliente=novo"
    } else if (tipoCliente === "sem-registro") {
      urlCompleta += `&nome=${encodeURIComponent(nomeSemRegistro)}`
      if (telefoneSemRegistro) urlCompleta += `&telefone=${encodeURIComponent(telefoneSemRegistro)}`
      if (emailSemRegistro) urlCompleta += `&email=${encodeURIComponent(emailSemRegistro)}`
    }

    router.push(urlCompleta)
  }

  // Filtrar protocolos do cliente selecionado
  const clienteProtocolos = selectedCliente
    ? protocolosAbertos.filter((protocolo) => protocolo.clienteId === selectedCliente.id)
    : []

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) resetForm()
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-lg shadow-xl">
        <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg">
          <DialogTitle className="text-xl font-bold">Novo Atendimento</DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {currentStep === "info" ? (
            <div className="space-y-8">
              {/* Seção 1: Motivo do Atendimento */}
              <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <Clipboard className="h-5 w-5 text-teal-600" />
                  <h3 className="font-medium text-lg text-gray-800">Motivo do Atendimento</h3>
                </div>

                <div className="space-y-4 bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                  <Select onValueChange={(value) => {
                    setMotivoSelecionado(value)
                    setSubCategoriaSelecionada("")
                    setDetalheSelecionado("")
                  }} value={motivoSelecionado}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecione o motivo principal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="queixa">Queixa Técnica</SelectItem>
                      <SelectItem value="evento">Evento Adverso</SelectItem>
                      <SelectItem value="informacao">Informação Médica</SelectItem>
                      <SelectItem value="farmacovigilancia">Farmacovigilância</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>

                  {motivoSelecionado && (
                    <Select value={subCategoriaSelecionada} onValueChange={setSubCategoriaSelecionada}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Selecione a subcategoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="subcategoria1">Subcategoria 1</SelectItem>
                        <SelectItem value="subcategoria2">Subcategoria 2</SelectItem>
                        <SelectItem value="subcategoria3">Subcategoria 3</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  {subCategoriaSelecionada && (
                    <Select value={detalheSelecionado} onValueChange={setDetalheSelecionado}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Selecione o detalhe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="detalhe1">Detalhe 1</SelectItem>
                        <SelectItem value="detalhe2">Detalhe 2</SelectItem>
                        <SelectItem value="detalhe3">Detalhe 3</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {/* Seção 2: Informações do Cliente */}
              <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-5 w-5 text-teal-600" />
                  <h3 className="font-medium text-lg text-gray-800">Informações do Cliente</h3>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                  <RadioGroup
                    defaultValue="cadastrado"
                    className="flex flex-wrap gap-4 mb-4"
                    onValueChange={(value) => {
                      setTipoCliente(value as "cadastrado" | "novo" | "sem-registro")
                      setShowClienteForm(value === "novo")
                      setSelectedCliente(null)
                      setShowResults(false)
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cadastrado" id="cliente-cadastrado" />
                      <Label htmlFor="cliente-cadastrado" className="font-medium">
                        Cliente Cadastrado
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="novo" id="novo-cliente" />
                      <Label htmlFor="novo-cliente" className="font-medium">
                        Novo Cliente
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sem-registro" id="sem-registro" />
                      <Label htmlFor="sem-registro" className="font-medium">
                        Sem Registro
                      </Label>
                    </div>
                  </RadioGroup>

                  {tipoCliente === "cadastrado" ? (
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row gap-2">
                        <div className="flex-1 relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Buscar por nome, CPF, telefone ou email"
                            className="pl-8 h-11"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                          />
                        </div>
                        <Button onClick={handleSearch} className="bg-teal-600 hover:bg-teal-700 h-11">
                          <Search className="mr-2 h-4 w-4" />
                          Buscar
                        </Button>
                      </div>

                      {showResults && (
                        <Card className="border-teal-100 shadow-sm">
                          <CardContent className="p-0">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Nome</TableHead>
                                  <TableHead>CPF</TableHead>
                                  <TableHead>Telefone</TableHead>
                                  <TableHead>Email</TableHead>
                                  <TableHead className="text-right">Ação</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {searchResults.length > 0 ? (
                                  searchResults.map((cliente) => (
                                    <TableRow key={cliente.id} className="hover:bg-gray-50 transition-colors">
                                      <TableCell className="font-medium">{cliente.nome}</TableCell>
                                      <TableCell>{cliente.documento}</TableCell>
                                      <TableCell>{cliente.telefone}</TableCell>
                                      <TableCell>{cliente.email}</TableCell>
                                      <TableCell className="text-right">
                                        <Button
                                          size="sm"
                                          onClick={() => handleClienteSelect(cliente)}
                                          className="bg-teal-600 hover:bg-teal-700"
                                        >
                                          Selecionar
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4">
                                      Nenhum cliente encontrado. Verifique os critérios de busca ou cadastre um novo
                                      cliente.
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      )}

                      {selectedCliente && (
                        <>
                          <Card className="border-teal-100 bg-gray-50 shadow-sm">
                            <CardContent className="p-5">
                              <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                                  <User className="h-6 w-6 text-teal-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-medium">{selectedCliente.nome}</h3>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                                    <div className="flex items-center gap-1 text-gray-600">
                                      <span>{selectedCliente.email}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-600">
                                      <span>{selectedCliente.telefone}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-600">
                                      <span>{selectedCliente.documento}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-600">
                                      <span>{selectedCliente.endereco}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Protocolos Abertos do Cliente */}
                          {clienteProtocolos.length > 0 && (
                            <Card className="border-amber-100 shadow-sm">
                              <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-base font-medium text-amber-800">Protocolos Abertos</CardTitle>
                                  <Badge variant="outline" className="bg-amber-50 text-amber-700">
                                    {clienteProtocolos.length} protocolo(s)
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="p-0">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Protocolo</TableHead>
                                      <TableHead>Data</TableHead>
                                      <TableHead>Motivo</TableHead>
                                      <TableHead>Produto</TableHead>
                                      <TableHead>Status</TableHead>
                                      <TableHead className="text-right">Ação</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {clienteProtocolos.map((protocolo) => (
                                      <TableRow key={protocolo.id} className="hover:bg-gray-50 transition-colors">
                                        <TableCell className="font-medium">{protocolo.id}</TableCell>
                                        <TableCell>{protocolo.data}</TableCell>
                                        <TableCell>{protocolo.tipo}</TableCell>
                                        <TableCell>{protocolo.produto}</TableCell>
                                        <TableCell>
                                          <Badge
                                            variant={
                                              protocolo.status === "Em análise"
                                                ? "default"
                                                : protocolo.status === "Pendente"
                                                  ? "secondary"
                                                  : "outline"
                                            }
                                          >
                                            {protocolo.status}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 flex items-center gap-1"
                                          >
                                            <FileText className="h-4 w-4" />
                                            Ver detalhes
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </CardContent>
                            </Card>
                          )}
                        </>
                      )}
                    </div>
                  ) : tipoCliente === "novo" ? (
                    <Card className="border-dashed border-2 border-teal-200 shadow-sm">
                      <CardHeader className="pb-2">
                        <h3 className="text-lg flex items-center font-medium">
                          <UserPlus className="mr-2 h-5 w-5 text-teal-500" />
                          Cadastro de Novo Cliente
                        </h3>
                        <p className="text-sm text-muted-foreground">Preencha os dados do novo cliente</p>
                      </CardHeader>
                      <CardContent>
                        {/* Informações Básicas */}
                        <div>
                          <h3 className="text-lg font-medium flex items-center mb-4">
                            <User className="mr-2 h-5 w-5 text-primary" />
                            Informações Básicas
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="nome">
                                Nome Completo <span className="text-red-500">*</span>
                              </Label>
                              <Input id="nome" placeholder="Nome completo do cliente" required className="h-11" />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="documento">
                                CPF <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="documento"
                                placeholder="000.000.000-00"
                                required
                                className="h-11"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="tipo-cliente">
                                Tipo do Cliente <span className="text-red-500">*</span>
                              </Label>
                              <Select>
                                <SelectTrigger id="tipo-cliente" className="h-11">
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="aut-reg-orgao-publico">Aut. Reg./Órgão Público</SelectItem>
                                  <SelectItem value="colaborador">Colaborador/Força de Vendas</SelectItem>
                                  <SelectItem value="convenio">Convênio/Outros PJ</SelectItem>
                                  <SelectItem value="distribuidor">Distribuidor</SelectItem>
                                  <SelectItem value="farmacia">Farmácia/Drogaria</SelectItem>
                                  <SelectItem value="hospital">Hospital/Clínica</SelectItem>
                                  <SelectItem value="medico">Médico</SelectItem>
                                  <SelectItem value="nao-informado">Não informado</SelectItem>
                                  <SelectItem value="outros">Outros</SelectItem>
                                  <SelectItem value="paciente">Paciente</SelectItem>
                                  <SelectItem value="prestador">Prestador de Serviço</SelectItem>
                                  <SelectItem value="profissional-saude">Profissional de Saúde</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        {/* Contato */}
                        <div className="mt-6">
                          <h3 className="text-lg font-medium flex items-center mb-4">
                            <Phone className="mr-2 h-5 w-5 text-primary" />
                            Informações de Contato
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="telefone">
                                Telefone <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="telefone"
                                placeholder="(00) 00000-0000"
                                required
                                className="h-11"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="email@exemplo.com"
                                className="h-11"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Endereço */}
                        <div className="mt-6">
                          <h3 className="text-lg font-medium flex items-center mb-4">
                            <MapPin className="mr-2 h-5 w-5 text-primary" />
                            Endereço
                          </h3>
                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="endereco">Endereço</Label>
                              <Input
                                id="endereco"
                                placeholder="Rua, número, complemento"
                                className="h-11"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="cidade">Cidade</Label>
                                <Input id="cidade" placeholder="Cidade" className="h-11" />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="estado">Estado</Label>
                                <Select>
                                  <SelectTrigger id="estado" className="h-11">
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="AC">Acre</SelectItem>
                                    <SelectItem value="AL">Alagoas</SelectItem>
                                    <SelectItem value="AP">Amapá</SelectItem>
                                    <SelectItem value="AM">Amazonas</SelectItem>
                                    <SelectItem value="BA">Bahia</SelectItem>
                                    <SelectItem value="CE">Ceará</SelectItem>
                                    <SelectItem value="DF">Distrito Federal</SelectItem>
                                    <SelectItem value="ES">Espírito Santo</SelectItem>
                                    <SelectItem value="GO">Goiás</SelectItem>
                                    <SelectItem value="MA">Maranhão</SelectItem>
                                    <SelectItem value="MT">Mato Grosso</SelectItem>
                                    <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                                    <SelectItem value="MG">Minas Gerais</SelectItem>
                                    <SelectItem value="PA">Pará</SelectItem>
                                    <SelectItem value="PB">Paraíba</SelectItem>
                                    <SelectItem value="PR">Paraná</SelectItem>
                                    <SelectItem value="PE">Pernambuco</SelectItem>
                                    <SelectItem value="PI">Piauí</SelectItem>
                                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                                    <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                                    <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                                    <SelectItem value="RO">Rondônia</SelectItem>
                                    <SelectItem value="RR">Roraima</SelectItem>
                                    <SelectItem value="SC">Santa Catarina</SelectItem>
                                    <SelectItem value="SP">São Paulo</SelectItem>
                                    <SelectItem value="SE">Sergipe</SelectItem>
                                    <SelectItem value="TO">Tocantins</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="cep">CEP</Label>
                                <Input
                                  id="cep"
                                  placeholder="00000-000"
                                  className="h-11"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Observações */}
                        <div className="mt-6 space-y-2">
                          <Label htmlFor="observacoes">Observações</Label>
                          <Textarea
                            id="observacoes"
                            placeholder="Informações adicionais sobre o cliente"
                            rows={4}
                            className="resize-none"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4 p-5 border rounded-lg bg-white shadow-sm">
                      <div className="space-y-2">
                        <Label htmlFor="nome-sem-registro" className="font-medium">
                          Nome <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="nome-sem-registro"
                          placeholder="Nome do cliente"
                          value={nomeSemRegistro}
                          onChange={(e) => setNomeSemRegistro(e.target.value)}
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefone-sem-registro">Telefone</Label>
                        <Input
                          id="telefone-sem-registro"
                          placeholder="(00) 00000-0000"
                          value={telefoneSemRegistro}
                          onChange={(e) => setTelefoneSemRegistro(e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email-sem-registro">E-mail</Label>
                        <Input
                          id="email-sem-registro"
                          type="email"
                          placeholder="email@exemplo.com"
                          value={emailSemRegistro}
                          onChange={(e) => setEmailSemRegistro(e.target.value)}
                          className="h-11"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Seção 3: Informações do Contato - Mostrar apenas para "Sem Registro" */}
              {tipoCliente === "sem-registro" && (
                <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <Phone className="h-5 w-5 text-teal-600" />
                    <h3 className="font-medium text-lg text-gray-800">Informações do Contato</h3>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-medium">Tipo de Contato</Label>
                        <RadioGroup
                          defaultValue="ativo"
                          className="flex gap-4"
                          onValueChange={(value) => setTipoContato(value as "ativo" | "receptivo")}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ativo" id="ativo" />
                            <Label htmlFor="ativo">Ativo</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="receptivo" id="receptivo" />
                            <Label htmlFor="receptivo">Receptivo</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contato-via" className="font-medium">
                          Contato via
                        </Label>
                        <Select>
                          <SelectTrigger id="contato-via" className="h-11">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="telefone">Telefone</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="presencial">Presencial</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Seção 4: Detalhes Adicionais - Mostrar apenas para "Sem Registro" */}
              {tipoCliente === "sem-registro" && (
                <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="h-5 w-5 text-teal-600" />
                    <h3 className="font-medium text-lg text-gray-800">Detalhes Adicionais</h3>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm space-y-4">
                    {/* Produtos do Atendimento */}
                    <div className="space-y-2">
                      <Label htmlFor="produtos" className="font-medium">
                        Produtos do Atendimento
                      </Label>
                      <Select>
                        <SelectTrigger id="produtos" className="h-11 bg-gray-50">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="produto1">Medicamento A</SelectItem>
                          <SelectItem value="produto2">Medicamento B</SelectItem>
                          <SelectItem value="produto3">Medicamento C</SelectItem>
                          <SelectItem value="produto4">Dispositivo Médico X</SelectItem>
                          <SelectItem value="produto5">Dispositivo Médico Y</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    {/* Observações */}
                    <div className="space-y-2">
                      <Label htmlFor="observacoes" className="font-medium">
                        Observações
                      </Label>
                      <Textarea
                        id="observacoes"
                        placeholder="Adicione informações relevantes sobre o atendimento"
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Informações do Cliente */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-[#26B99D]">Informações do Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cliente</Label>
                    <div className="p-3 border rounded-lg bg-gray-50 shadow-sm">
                      {selectedCliente?.nome || nomeSemRegistro || ""}
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações do Contato */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-[#26B99D]">Informações do Contato</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipoContato">
                      Tipo de Contato <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.tipoContato}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, tipoContato: value }))}
                    >
                      <SelectTrigger id="tipoContato" className="h-11">
                        <SelectValue placeholder="Selecione o tipo de contato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="telefone">Telefone</SelectItem>
                        <SelectItem value="email">E-mail</SelectItem>
                        <SelectItem value="presencial">Presencial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="autorizaRetorno">
                      Autoriza retorno de contato <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.autorizaRetorno}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, autorizaRetorno: value }))}
                    >
                      <SelectTrigger id="autorizaRetorno" className="h-11">
                        <SelectValue placeholder="Selecione uma opção" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">
                    Descrição do Contato <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Descreva o conteúdo do contato"
                    required
                    className="font-mono min-h-[200px] whitespace-pre-wrap resize-none"
                    style={{
                      lineHeight: "1.5",
                      padding: "1rem",
                      backgroundColor: formData.tipoContato === "email" ? "#f8fafc" : "white"
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-end gap-2 p-6 border-t bg-gray-50 rounded-b-lg">
          <Button
            variant="outline"
            className="bg-red-100 hover:bg-red-200 text-red-600 border-red-200 h-11"
            onClick={() => {
              if (currentStep === "contato") {
                setCurrentStep("info")
              } else {
                onOpenChange(false)
              }
            }}
          >
            {currentStep === "contato" ? "Voltar" : "Cancelar"}
          </Button>
          <Button 
            className="bg-teal-600 hover:bg-teal-700 h-11" 
            onClick={currentStep === "info" ? handleNextStep : handleCriarProtocolo}
          >
            {currentStep === "info" ? "Próximo" : "Criar Protocolo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

