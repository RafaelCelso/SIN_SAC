"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/date-picker"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, FileText, AlertTriangle, CheckCircle, Upload, Barcode, Search, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

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
    dataCadastro: "10/01/2023",
  },
  {
    id: "2",
    nome: "João Santos",
    documento: "987.654.321-00",
    telefone: "(11) 91234-5678",
    email: "joao.santos@email.com",
    endereco: "Rua Augusta, 500 - São Paulo/SP",
    tipo: "Pessoa Física",
    dataCadastro: "15/02/2023",
  },
  {
    id: "3",
    nome: "Farmácia Saúde Ltda",
    documento: "12.345.678/0001-90",
    telefone: "(11) 3456-7890",
    email: "contato@farmaciasaude.com.br",
    endereco: "Av. Rebouças, 1500 - São Paulo/SP",
    tipo: "Pessoa Jurídica",
    dataCadastro: "20/03/2023",
  },
]

// Mock de protocolos por cliente
type Protocolo = { id: string; data: string; produto: string; motivo: string }
const PROTOCOLOS_MOCK: Record<string, Protocolo[]> = {
  "1": [
    { id: "P-1001", data: "05/01/2023", produto: "Medicamento A", motivo: "Dúvida sobre uso" },
    { id: "P-1002", data: "20/02/2023", produto: "Dispositivo X", motivo: "Reclamação de funcionamento" },
  ],
  "2": [
    { id: "P-2001", data: "10/03/2023", produto: "Medicamento B", motivo: "Solicitação de troca" },
  ],
  "3": [
    { id: "P-3001", data: "15/04/2023", produto: "Medicamento C", motivo: "Dúvida sobre validade" },
    { id: "P-3002", data: "22/05/2023", produto: "Dispositivo Y", motivo: "Reclamação de embalagem" },
    { id: "P-3003", data: "01/06/2023", produto: "Medicamento A", motivo: "Solicitação de devolução" },
  ],
};

export default function NovaQueixaTecnicaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Recuperar parâmetros da URL
  const protocolo = searchParams.get("protocolo")
  const clienteId = searchParams.get("cliente")
  const nomeSemRegistro = searchParams.get("nome")
  const telefoneSemRegistro = searchParams.get("telefone")
  const emailSemRegistro = searchParams.get("email")

  const [cliente, setCliente] = useState<(typeof CLIENTES_MOCK)[0] | null>(null)
  const [loading, setLoading] = useState(true)
  const [clienteSearchQuery, setClienteSearchQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
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
  const [protocoloSelecionado, setProtocoloSelecionado] = useState<Protocolo | null>(null)
  const [protocoloVinculado, setProtocoloVinculado] = useState<Protocolo | null>(null)

  // Filtrar clientes com base na busca
  const filteredClientes = CLIENTES_MOCK.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(clienteSearchQuery.toLowerCase()) ||
      cliente.documento.includes(clienteSearchQuery) ||
      cliente.email.toLowerCase().includes(clienteSearchQuery.toLowerCase()) ||
      cliente.telefone.includes(clienteSearchQuery),
  )

  // Carregar dados do cliente se disponível
  useEffect(() => {
    if (clienteId && clienteId !== "novo") {
      const clienteEncontrado = CLIENTES_MOCK.find((c) => c.id === clienteId)
      if (clienteEncontrado) {
        setCliente(clienteEncontrado)
      }
    }
    setLoading(false)
  }, [clienteId])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulação de envio do formulário
    toast({
      title: "Queixa técnica registrada",
      description: `O protocolo ${protocolo} foi registrado com sucesso.`,
      duration: 5000,
    })

    // Redirecionar para a página de listagem de queixas
    setTimeout(() => {
      router.push("/atendimentos/queixas")
    }, 1500)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <p>Carregando...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <a href="/atendimentos/queixas">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <h1 className="text-2xl font-bold">Nova Queixa Técnica</h1>
          </div>

          {protocolo && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-sm px-3 py-1">
              Protocolo: {protocolo}
            </Badge>
          )}
        </div>

        {/* Informações do Cliente */}
        <Card>
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Informações do Cliente</CardTitle>
              {cliente && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`/clientes/${cliente.id}`}>
                    <FileText className="h-4 w-4 mr-2" />
                    Ver cadastro completo
                  </a>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {cliente ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4 justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#15937E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                        <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-3.33 0-10 1.67-10 5v1a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-1c0-3.33-6.67-5-10-5Z" />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-[#26B99D] text-white text-xs px-2 py-0.5 font-semibold">ID:{cliente.id}</span>
                        <span className="font-bold text-lg text-gray-900">{cliente.nome}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="rounded-md border border-black text-black text-xs px-2 py-0.5 font-semibold bg-transparent">{cliente.tipo}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-[#26B99D] hover:bg-[#1E9A82] text-white font-semibold px-6"
                    onClick={() => setCliente(null)}
                  >
                    Remover
                  </Button>
                </div>
                {/* Protocolos do cliente */}
                {PROTOCOLOS_MOCK[cliente.id] && PROTOCOLOS_MOCK[cliente.id].length > 0 && (
                  <div className="bg-gray-50 border rounded-lg p-4">
                    <div className="font-semibold mb-2 text-gray-800">Protocolos do cliente</div>
                    {protocoloVinculado ? (
                      <div className="flex flex-wrap gap-3">
                        <div className="relative px-4 py-2 rounded-md border border-[#26B99D] bg-[#e6faf7] flex flex-col items-start min-w-[200px] shadow-sm">
                          <button
                            type="button"
                            className="absolute top-2 right-2 p-1 rounded hover:bg-red-100 text-red-700"
                            onClick={() => {
                              setProtocoloVinculado(null)
                              setProtocoloSelecionado(null)
                            }}
                            aria-label="Desvincular protocolo"
                          >
                            <X size={16} />
                          </button>
                          <span className="font-bold text-base text-[#26B99D] tracking-wide mb-1">{protocoloVinculado.id}</span>
                          <span className="text-xs text-gray-500 mb-1">{protocoloVinculado.data}</span>
                          <span className="text-sm text-gray-900 mb-0.5">Produto: {protocoloVinculado.produto}</span>
                          <span className="text-sm text-gray-800">Motivo: {protocoloVinculado.motivo}</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap gap-3">
                          {PROTOCOLOS_MOCK[cliente.id].map((protocolo: Protocolo) => (
                            <button
                              key={protocolo.id}
                              type="button"
                              className={`px-4 py-2 rounded-md border flex flex-col items-start min-w-[200px] transition-colors shadow-sm
                                ${protocoloSelecionado && protocoloSelecionado.id === protocolo.id ? 'border-[#26B99D] bg-[#e6faf7]' : 'border-gray-200 bg-white hover:border-[#26B99D]'}
                              `}
                              onClick={() => setProtocoloSelecionado(protocolo)}
                            >
                              <span className="font-bold text-base text-[#26B99D] tracking-wide mb-1">{protocolo.id}</span>
                              <span className="text-xs text-gray-500 mb-1">{protocolo.data}</span>
                              <span className="text-sm text-gray-900 mb-0.5">Produto: {protocolo.produto}</span>
                              <span className="text-sm text-gray-800">Motivo: {protocolo.motivo}</span>
                            </button>
                          ))}
                        </div>
                        {protocoloSelecionado && (
                          <button
                            type="button"
                            className="mt-4 px-4 py-2 rounded bg-[#26B99D] text-white text-sm font-semibold hover:bg-[#15937E] transition"
                            onClick={() => setProtocoloVinculado(protocoloSelecionado)}
                          >
                            Vincular
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#26B99D]">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      <span className="font-medium">Telefone:</span>
                      <span>{cliente.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#26B99D]">
                        <rect width="20" height="16" x="2" y="4" rx="2"/>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                      <span className="font-medium">Email:</span>
                      <span>{cliente.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#26B99D]">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span className="font-medium">Endereço:</span>
                      <span>{cliente.endereco}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#26B99D]">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      <span className="font-medium">Documento:</span>
                      <span>{cliente.documento}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
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
                            setCliente(cliente)
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
                {nomeSemRegistro && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Nome</p>
                      <p className="font-medium">{nomeSemRegistro}</p>
                    </div>
                    {telefoneSemRegistro && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Telefone</p>
                        <p>{telefoneSemRegistro}</p>
                      </div>
                    )}
                    {emailSemRegistro && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Email</p>
                        <p>{emailSemRegistro}</p>
                      </div>
                    )}
                    <div className="col-span-2">
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Cliente sem registro
                      </Badge>
                    </div>
                  </div>
                )}
                {clienteId === "novo" && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                    <AlertTitle>Novo cliente</AlertTitle>
                    <AlertDescription>Um novo cliente será cadastrado ao salvar esta queixa técnica.</AlertDescription>
                  </Alert>
                )}
                {!clienteId && !nomeSemRegistro && (
                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertTitle>Cliente não identificado</AlertTitle>
                    <AlertDescription>
                      Nenhuma informação de cliente foi fornecida para esta queixa técnica.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Formulário de Queixa Técnica */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Queixa Técnica</CardTitle>
              <CardDescription>Preencha as informações sobre o produto e a queixa técnica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informações do Produto */}
              <div>
                <h3 className="text-lg font-medium flex items-center mb-4">
                  <Package className="mr-2 h-5 w-5 text-primary" />
                  Informações do Produto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="produto" className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-[#26B99D]" />
                      <span>Produto <span className="text-red-500">*</span></span>
                    </Label>
                    <Select
                      name="produto"
                      value={formData.produto}
                      onValueChange={(value) => handleSelectChange("produto", value)}
                      required
                    >
                      <SelectTrigger id="produto" className="h-11">
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
                    <Label htmlFor="lote" className="flex items-center space-x-2">
                      <Barcode className="h-4 w-4 text-[#26B99D]" />
                      <span>Número do Lote <span className="text-red-500">*</span></span>
                    </Label>
                    <Input
                      id="lote"
                      name="lote"
                      placeholder="Ex: ABC123456"
                      value={formData.lote}
                      onChange={handleInputChange}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataFabricacao">Data de Fabricação</Label>
                    <DatePicker />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataValidade">Data de Validade</Label>
                    <DatePicker />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Detalhes da Queixa */}
              <div>
                <h3 className="text-lg font-medium flex items-center mb-4">
                  <AlertTriangle className="mr-2 h-5 w-5 text-primary" />
                  Detalhes da Queixa
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipoQueixa">
                      Tipo de Queixa <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      defaultValue={formData.tipoQueixa}
                      onValueChange={(value) => handleSelectChange("tipoQueixa", value)}
                      className="grid grid-cols-1 md:grid-cols-2 gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="embalagem" id="embalagem" />
                        <Label htmlFor="embalagem">Problema na embalagem</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rotulagem" id="rotulagem" />
                        <Label htmlFor="rotulagem">Problema na rotulagem</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="conteudo" id="conteudo" />
                        <Label htmlFor="conteudo">Problema no conteúdo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="funcionamento" id="funcionamento" />
                        <Label htmlFor="funcionamento">Problema no funcionamento</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="contaminacao" id="contaminacao" />
                        <Label htmlFor="contaminacao">Suspeita de contaminação</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="outro" id="outro" />
                        <Label htmlFor="outro">Outro</Label>
                      </div>
                    </RadioGroup>
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
                    <Label htmlFor="possuiAmostra">Possui amostra do produto?</Label>
                    <RadioGroup
                      defaultValue={formData.possuiAmostra}
                      onValueChange={(value) => handleSelectChange("possuiAmostra", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sim" id="possui-sim" />
                        <Label htmlFor="possui-sim">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nao" id="possui-nao" />
                        <Label htmlFor="possui-nao">Não</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.possuiAmostra === "sim" && (
                    <div className="flex items-center space-x-2 ml-6 p-2 bg-gray-50 rounded-md">
                      <Checkbox
                        id="enviarAmostra"
                        checked={formData.enviarAmostra}
                        onCheckedChange={(checked) => handleCheckboxChange("enviarAmostra", checked as boolean)}
                      />
                      <Label htmlFor="enviarAmostra">Deseja enviar a amostra para análise?</Label>
                    </div>
                  )}

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

              <Separator />

              {/* Evidências */}
              <div>
                <h3 className="text-lg font-medium flex items-center mb-4">
                  <Upload className="mr-2 h-5 w-5 text-primary" />
                  Evidências
                </h3>

                <div className="space-y-4">
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Arraste e solte arquivos aqui ou clique para selecionar</p>
                    <p className="text-xs text-gray-400 mt-1">Suporta imagens, documentos e vídeos (máx. 10MB)</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Selecionar Arquivos
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

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
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.push("/atendimentos/queixas")}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                <CheckCircle className="mr-2 h-4 w-4" />
                Registrar Queixa Técnica
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  )
}

