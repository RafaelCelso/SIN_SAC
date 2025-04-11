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
import { Search, UserPlus, User, FileText, Clipboard, Phone, Info, MapPin, Package, Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { useEventos } from "@/contexts/EventosContext"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

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

// Dados simulados de produtos
const PRODUTOS_MOCK = [
  {
    id: "1",
    nome: "Medicamento A",
    ean: "7891234567890",
    lote: "L2024001",
    categoria: "Medicamento"
  },
  {
    id: "2",
    nome: "Medicamento B",
    ean: "7891234567891",
    lote: "L2024002",
    categoria: "Medicamento"
  },
  {
    id: "3",
    nome: "Dispositivo Médico X",
    ean: "7891234567892",
    lote: "L2024003",
    categoria: "Dispositivo Médico"
  },
  {
    id: "4",
    nome: "Dispositivo Médico Y",
    ean: "7891234567893",
    lote: "L2024004",
    categoria: "Dispositivo Médico"
  },
  {
    id: "5",
    nome: "Medicamento C",
    ean: "7891234567894",
    lote: "L2024005",
    categoria: "Medicamento"
  }
]

export function IniciarAtendimentoModal({ open, onOpenChange }: IniciarAtendimentoModalProps) {
  const router = useRouter()
  const { adicionarEvento } = useEventos()
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
  const [produtoSearchTerm, setProdutoSearchTerm] = useState("")
  const [selectedProdutos, setSelectedProdutos] = useState<typeof PRODUTOS_MOCK[0]>([])
  const [showProdutosList, setShowProdutosList] = useState(false)
  const [loteSearchTerm, setLoteSearchTerm] = useState("")
  const [selectedLotes, setSelectedLotes] = useState<string[]>([])
  const [showLotesList, setShowLotesList] = useState(false)
  const [formData, setFormData] = useState({
    tipoContato: "telefone",
    motivo: "",
    descricao: "",
    nome: "",
    email: "",
    telefone: "",
    autorizaRetorno: "sim",
    dataRetorno: "",
    horaRetorno: "",
    lote: "",
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

  type Produto = {
    id: string
    nome: string
    ean: string
    lote: string
    categoria: string
  }

  const handleProdutoSelect = (produto: Produto) => {
    const isAlreadySelected = selectedProdutos.some(p => p.id === produto.id)
    if (!isAlreadySelected) {
      setSelectedProdutos(prev => [...prev, produto])
      setProdutoSearchTerm("")
    }
  }

  const handleRemoveProduto = (produtoId: string) => {
    setSelectedProdutos(prev => prev.filter(p => p.id !== produtoId))
  }

  // Função para filtrar produtos
  const filteredProdutos = PRODUTOS_MOCK.filter((produto) => {
    const searchTerm = produtoSearchTerm.toLowerCase()
    return (
      produto.nome.toLowerCase().includes(searchTerm) ||
      produto.lote.toLowerCase().includes(searchTerm) ||
      produto.ean.includes(searchTerm)
    )
  })

  const handleProdutoSearchFocus = () => {
    setShowProdutosList(true)
  }

  const handleProdutoSearchBlur = () => {
    // Pequeno delay para permitir que o clique no item seja processado
    setTimeout(() => {
      setShowProdutosList(false)
    }, 200)
  }

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
    setProdutoSearchTerm("")
    setSelectedProdutos([])
    setShowProdutosList(false)
    setLoteSearchTerm("")
    setShowLotesList(false)
    setSelectedLotes([])
    setFormData({
      tipoContato: "telefone",
      motivo: "",
      descricao: "",
      nome: "",
      email: "",
      telefone: "",
      autorizaRetorno: "sim",
      dataRetorno: "",
      horaRetorno: "",
      lote: "",
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

    // Validar campos de retorno se autorizado
    if (formData.autorizaRetorno === "sim") {
      if (!formData.dataRetorno || !formData.horaRetorno) {
        toast({
          title: "Erro",
          description: "Data e horário do retorno são obrigatórios quando autorizado",
          variant: "destructive",
        })
        return
      }
    }

    // Gerar número de protocolo
    const dataAtual = new Date()
    const ano = dataAtual.getFullYear()
    const numeroAleatorio = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
    const novoProtocolo = `AT-${ano}-${numeroAleatorio}`

    // Se autorizado retorno, criar evento na agenda
    if (formData.autorizaRetorno === "sim" && formData.dataRetorno && formData.horaRetorno) {
      const nomeCliente = selectedCliente?.nome || nomeSemRegistro || "Cliente"
      const dataRetorno = new Date(formData.dataRetorno + "T" + formData.horaRetorno)
      
      // Criar evento na agenda
      const novoEvento = {
        id: `RET-${novoProtocolo}`,
        titulo: `Retorno - ${nomeCliente}`,
        data: dataRetorno,
        horaInicio: formData.horaRetorno,
        horaFim: new Date(dataRetorno.getTime() + 30 * 60000).toTimeString().slice(0, 5), // Adiciona 30 minutos
        participantes: [],
        comentarios: `Retorno do protocolo ${novoProtocolo}`,
        tipo: "retorno" as const
      }

      // Adicionar evento à agenda usando o contexto
      adicionarEvento(novoEvento)
    }

    // Simular criação de protocolo
    toast({
      title: "Protocolo criado com sucesso",
      description: `Protocolo ${novoProtocolo} registrado`,
      variant: "default",
    })

    // Se houver retorno agendado, mostrar toast adicional
    if (formData.autorizaRetorno === "sim") {
      toast({
        title: "Retorno agendado",
        description: `Retorno agendado para ${new Date(formData.dataRetorno).toLocaleDateString()} às ${formData.horaRetorno}`,
      })
    }

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

  // Função para filtrar produtos por lote
  const filteredProdutosByLote = PRODUTOS_MOCK.filter((produto) => {
    const searchTerm = loteSearchTerm.toLowerCase()
    return produto.lote.toLowerCase().includes(searchTerm)
  })

  const handleLoteSelect = (produto: Produto) => {
    const isAlreadySelected = selectedLotes.includes(produto.lote)
    if (!isAlreadySelected) {
      setSelectedLotes(prev => [...prev, produto.lote])
      setLoteSearchTerm("")
      setFormData(prev => ({
        ...prev,
        lote: [...selectedLotes, produto.lote].join(", ")
      }))
    }
  }

  const handleRemoveLote = (lote: string) => {
    setSelectedLotes(prev => {
      const newLotes = prev.filter(l => l !== lote)
      setFormData(prev => ({
        ...prev,
        lote: newLotes.join(", ")
      }))
      return newLotes
    })
  }

  const handleLoteSearchFocus = () => {
    setShowLotesList(true)
  }

  const handleLoteSearchBlur = () => {
    setTimeout(() => {
      setShowLotesList(false)
    }, 200)
  }

  const validarDados = () => {
    const errors: string[] = []

    // Validação do cliente
    if (tipoCliente === "cadastrado" && !selectedCliente) {
      errors.push("Selecione um cliente cadastrado")
    }

    if (tipoCliente === "sem-registro") {
      if (!nomeSemRegistro.trim()) {
        errors.push("Nome do cliente é obrigatório")
      }
      if (!telefoneSemRegistro.trim()) {
        errors.push("Telefone do cliente é obrigatório")
      }
    }

    // Validação do motivo
    if (!motivoSelecionado) {
      errors.push("Selecione o motivo do atendimento")
    }

    // Validação de produto para motivos específicos
    if (["queixa-tecnica", "evento-adverso", "farmacovigilancia"].includes(motivoSelecionado)) {
      if (!selectedProdutos.length) {
        errors.push("Selecione pelo menos um produto")
      }
      if (!formData.lote.trim()) {
        errors.push("Informe o lote do produto")
      }
    }

    // Validação do agendamento de retorno
    if (formData.autorizaRetorno === "sim") {
      if (!formData.dataRetorno) {
        errors.push("Data de retorno é obrigatória")
      }
      if (!formData.horaRetorno) {
        errors.push("Hora de retorno é obrigatória")
      }
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        toast({
          variant: "destructive",
          title: "Erro de validação",
          description: error
        })
      })
      return false
    }

    return true
  }

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

              {/* Seção 2: Produto */}
              <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-5 w-5 text-teal-600" />
                  <h3 className="font-medium text-lg text-gray-800">Produto</h3>
                </div>

                <div className="space-y-4 bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                  {/* Campo de busca por produto */}
                  <div className="space-y-2">
                    <Label htmlFor="busca-produto" className="font-medium">
                      Buscar Produto
                    </Label>
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="busca-produto"
                          type="text"
                          placeholder="Buscar produto por nome ou EAN"
                          className="h-11 pl-10"
                          value={produtoSearchTerm}
                          onChange={(e) => setProdutoSearchTerm(e.target.value)}
                          onFocus={handleProdutoSearchFocus}
                          onBlur={handleProdutoSearchBlur}
                        />
                        {showProdutosList && (
                          <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
                            {filteredProdutos.length > 0 ? (
                              filteredProdutos.map((produto, index) => (
                                <button
                                  key={produto.id}
                                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                                    index !== filteredProdutos.length - 1 ? "border-b" : ""
                                  }`}
                                  onClick={() => handleProdutoSelect(produto)}
                                >
                                  <div className="font-medium text-gray-900">{produto.nome}</div>
                                  <div className="text-sm text-gray-500">
                                    EAN: {produto.ean}
                                  </div>
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-sm text-gray-500">
                                Nenhum produto encontrado
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Lista de produtos selecionados */}
                      {selectedProdutos.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedProdutos.map((produto) => (
                            <div
                              key={produto.id}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-200"
                            >
                              <span className="text-sm font-medium">{produto.nome}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-teal-100"
                                onClick={() => handleRemoveProduto(produto.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Campo de busca por lote */}
                  <div className="space-y-2">
                    <Label htmlFor="busca-lote" className="font-medium">
                      Buscar Lote
                    </Label>
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="busca-lote"
                          type="text"
                          placeholder="Buscar por lote"
                          className="h-11 pl-10"
                          value={loteSearchTerm}
                          onChange={(e) => setLoteSearchTerm(e.target.value)}
                          onFocus={handleLoteSearchFocus}
                          onBlur={handleLoteSearchBlur}
                        />
                        {showLotesList && (
                          <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
                            {filteredProdutosByLote.length > 0 ? (
                              filteredProdutosByLote.map((produto, index) => (
                                <button
                                  key={produto.id}
                                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                                    index !== filteredProdutosByLote.length - 1 ? "border-b" : ""
                                  }`}
                                  onClick={() => handleLoteSelect(produto)}
                                >
                                  <div className="font-medium text-gray-900">Lote: {produto.lote}</div>
                                  <div className="text-sm text-gray-500">{produto.nome}</div>
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-sm text-gray-500">
                                Nenhum lote encontrado
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Lista de lotes selecionados */}
                      {selectedLotes.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedLotes.map((lote) => (
                            <div
                              key={lote}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-700 rounded-full border border-gray-200"
                            >
                              <span className="text-sm font-medium">Lote: {lote}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-gray-100"
                                onClick={() => handleRemoveLote(lote)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 3: Informações do Cliente */}
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

                  {formData.autorizaRetorno === "sim" && (
                    <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-teal-50 rounded-lg border border-teal-100">
                      <div className="space-y-2">
                        <Label htmlFor="dataRetorno">
                          Data do Retorno <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="dataRetorno"
                          type="date"
                          value={formData.dataRetorno}
                          onChange={(e) => setFormData(prev => ({ ...prev, dataRetorno: e.target.value }))}
                          className="h-11"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="horaRetorno">
                          Horário do Retorno <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="horaRetorno"
                          type="time"
                          value={formData.horaRetorno}
                          onChange={(e) => setFormData(prev => ({ ...prev, horaRetorno: e.target.value }))}
                          className="h-11"
                        />
                      </div>
                    </div>
                  )}
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

        <DialogFooter className="p-6 bg-gray-50 border-t">
          <Button
            variant="outline"
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
          {currentStep === "info" ? (
            <Button onClick={handleNextStep} className="bg-teal-600 hover:bg-teal-700">
              Próximo
            </Button>
          ) : (
            <Button onClick={handleCriarProtocolo} className="bg-teal-600 hover:bg-teal-700">
              Criar Protocolo
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

