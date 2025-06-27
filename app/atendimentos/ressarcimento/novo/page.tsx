"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { DollarSign, Search, User, FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

// Dados simulados de clientes
const CLIENTES_MOCK = [
  {
    id: "1",
    nome: "Maria Silva",
    documento: "123.456.789-00",
    telefone: "(11) 98765-4321",
    email: "maria.silva@email.com",
    endereco: "Av. Paulista, 1000 - Bela Vista - São Paulo/SP",
  },
  {
    id: "2",
    nome: "João Santos",
    documento: "987.654.321-00",
    telefone: "(11) 91234-5678",
    email: "joao.santos@email.com",
    endereco: "Rua Augusta, 500 - Consolação - São Paulo/SP",
  },
  {
    id: "3",
    nome: "Farmácia Central Ltda",
    documento: "12.345.678/0001-99",
    telefone: "(11) 4002-8922",
    email: "contato@farmaciacentral.com",
    endereco: "Rua das Flores, 123 - Centro - São Paulo/SP",
  },
]

// Dados simulados de queixas técnicas
const QUEIXAS_TECNICAS_MOCK = [
  {
    id: "QT-2023-0001",
    clienteId: "1",
    data: "15/06/2023",
    produto: "Medicamento A",
    lote: "ABC123",
    status: "Em análise",
    descricao: "Problema com embalagem do medicamento que impossibilitou o uso adequado",
    gravidade: "Leve"
  },
  {
    id: "QT-2023-0005",
    clienteId: "1", 
    data: "20/06/2023",
    produto: "Medicamento C",
    lote: "DEF456",
    status: "Concluído",
    descricao: "Produto apresentou alteração de cor após abertura da embalagem",
    gravidade: "Moderada"
  },
  {
    id: "QT-2023-0002",
    clienteId: "2",
    data: "16/06/2023",
    produto: "Medicamento B",
    lote: "XYZ789",
    status: "Em análise",
    descricao: "Medicamento com validade vencida na embalagem secundária",
    gravidade: "Moderada"
  },
  {
    id: "QT-2023-0008",
    clienteId: "2",
    data: "22/06/2023",
    produto: "Dispositivo Médico X",
    lote: "DEV001",
    status: "Pendente",
    descricao: "Dispositivo apresentou falha no funcionamento durante o uso",
    gravidade: "Alta"
  },
  {
    id: "QT-2023-0003",
    clienteId: "3",
    data: "18/06/2023",
    produto: "Medicamento A",
    lote: "ABC124",
    status: "Concluído",
    descricao: "Embalagem primária com defeito de vedação",
    gravidade: "Leve"
  }
]

export default function NovoRessarcimentoPage() {
  const searchParams = useSearchParams()
  const clienteId = searchParams.get("clienteId")
  const clienteNome = searchParams.get("clienteNome")
  
  // Estado para busca de cliente
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<typeof CLIENTES_MOCK>([])
  const [selectedCliente, setSelectedCliente] = useState<(typeof CLIENTES_MOCK)[0] | null>(null)
  const [showResults, setShowResults] = useState(false)
  
  // Estado para queixas técnicas
  const [queixasTecnicas, setQueixasTecnicas] = useState<typeof QUEIXAS_TECNICAS_MOCK>([])
  const [selectedQueixa, setSelectedQueixa] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    tipoRessarcimento: "financeiro",
    queixaTecnicaId: "",
    reembolsoNome: "",
    reembolsoCpf: "",
    reembolsoTelefone: "",
    reembolsoEndereco: "",
    reembolsoNumero: "",
    reembolsoComplemento: "",
    reembolsoBairro: "",
    reembolsoCidade: "",
    reembolsoEstado: "",
    reembolsoCep: "",
    financeiroNome: "",
    financeiroCpf: "",
    financeiroBanco: "",
    financeiroAgencia: "",
    financeiroConta: "",
    financeiroTipoConta: "corrente",
  })
  const [submitting, setSubmitting] = useState(false)

  // Carregar cliente se vier da página de cadastro
  useEffect(() => {
    if (clienteId && clienteNome) {
      const cliente = CLIENTES_MOCK.find(c => c.id === clienteId) || {
        id: clienteId,
        nome: clienteNome,
        documento: "",
        telefone: "",
        email: "",
        endereco: "",
      }
      setSelectedCliente(cliente)
      
      // Carregar queixas técnicas do cliente
      const queixasCliente = QUEIXAS_TECNICAS_MOCK.filter(q => q.clienteId === clienteId)
      setQueixasTecnicas(queixasCliente)
    }
  }, [clienteId, clienteNome])

  // Função para buscar clientes
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    const results = CLIENTES_MOCK.filter((cliente) => {
      const term = searchTerm.toLowerCase()
      return (
        cliente.nome.toLowerCase().includes(term) ||
        cliente.documento.replace(/\D/g, "").includes(term.replace(/\D/g, "")) ||
        cliente.telefone.replace(/\D/g, "").includes(term.replace(/\D/g, "")) ||
        cliente.email.toLowerCase().includes(term)
      )
    })

    setSearchResults(results)
    setShowResults(true)
  }

  // Função para selecionar cliente
  const handleClienteSelect = (cliente: (typeof CLIENTES_MOCK)[0]) => {
    setSelectedCliente(cliente)
    setShowResults(false)
    setSearchTerm("")
    
    // Carregar queixas técnicas do cliente
    const queixasCliente = QUEIXAS_TECNICAS_MOCK.filter(q => q.clienteId === cliente.id)
    setQueixasTecnicas(queixasCliente)
    setSelectedQueixa(null)
    setFormData(prev => ({ ...prev, queixaTecnicaId: "" }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Função para selecionar queixa técnica
  const handleQueixaSelect = (queixaId: string) => {
    setSelectedQueixa(queixaId)
    setFormData(prev => ({ ...prev, queixaTecnicaId: queixaId }))
  }

  // Função para desvincular queixa técnica
  const handleQueixaDeselect = () => {
    setSelectedQueixa(null)
    setFormData(prev => ({ ...prev, queixaTecnicaId: "" }))
  }

  // Função para preencher dados do cliente
  const handleUsarDadosCliente = () => {
    if (!selectedCliente) return

    // Extrair dados do endereço (assumindo formato: "Rua, Número - Bairro - Cidade/Estado")
    const enderecoParts = selectedCliente.endereco.split(' - ')
    let logradouro = "", numero = "", bairro = "", cidade = "", estado = ""
    
    if (enderecoParts.length >= 3) {
      // Primeira parte: Logradouro e número
      const logradouroNumero = enderecoParts[0].split(', ')
      logradouro = logradouroNumero[0] || ""
      numero = logradouroNumero[1] || ""
      
      // Segunda parte: Bairro
      bairro = enderecoParts[1] || ""
      
      // Terceira parte: Cidade/Estado
      const cidadeEstado = enderecoParts[2].split('/')
      cidade = cidadeEstado[0] || ""
      estado = cidadeEstado[1] || ""
    }

    setFormData(prev => ({
      ...prev,
      reembolsoNome: selectedCliente.nome,
      reembolsoCpf: selectedCliente.documento,
      reembolsoTelefone: selectedCliente.telefone,
      reembolsoEndereco: logradouro,
      reembolsoNumero: numero,
      reembolsoComplemento: "", // Manter vazio para o usuário preencher se necessário
      reembolsoBairro: bairro,
      reembolsoCidade: cidade,
      reembolsoEstado: estado,
      reembolsoCep: "", // Manter vazio para o usuário preencher
    }))

    toast({
      title: "Dados preenchidos",
      description: "Os dados do cliente foram copiados para o formulário. Você pode editá-los se necessário.",
      duration: 3000,
    })
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar se cliente foi selecionado (quando não vier da página de cadastro)
    if (!clienteId && !selectedCliente) {
      toast({
        title: "Erro",
        description: "Selecione um cliente para continuar.",
        variant: "destructive",
      })
      return
    }



    setSubmitting(true)
    setTimeout(() => {
      const queixaVinculada = selectedQueixa ? ` e vinculado à queixa técnica ${selectedQueixa}` : ""
      toast({
        title: "Ressarcimento registrado",
        description: `O ressarcimento foi registrado com sucesso${queixaVinculada}.`,
        duration: 4000,
      })
      setSubmitting(false)
    }, 1200)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="h-7 w-7 text-[#26B99D]" />
          <h1 className="text-2xl font-bold">Novo Ressarcimento</h1>
        </div>
        <Card>
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-xl font-bold">Ressarcimento</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-8 p-8">
              {/* Seção de Cliente - só mostra se não vier da página de cadastro */}
              {!clienteId && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Cliente</Label>
                    <Badge variant="outline" className="text-xs">
                      Pode ser alterado
                    </Badge>
                  </div>
                  
                  {!selectedCliente ? (
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row gap-2">
                        <div className="flex-1 relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Buscar por nome, CPF/CNPJ, telefone ou email"
                            className="pl-8 h-11"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                          />
                        </div>
                        <Button type="button" onClick={handleSearch} className="bg-teal-600 hover:bg-teal-700 h-11">
                          <Search className="mr-2 h-4 w-4" />
                          Buscar
                        </Button>
                      </div>

                      {showResults && (
                        <Card className="border-teal-100 shadow-sm">
                          <CardContent className="p-0">
                            {searchResults.length > 0 ? (
                              <div className="grid grid-cols-1 gap-4 p-4">
                                {searchResults.map((cliente) => (
                                  <Card key={cliente.id} className="border-gray-200 hover:border-teal-200 transition-colors">
                                    <CardContent className="p-4">
                                      <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                                          <User className="h-6 w-6 text-teal-600" />
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-medium">{cliente.nome}</h3>
                                            <Button
                                              type="button"
                                              size="sm"
                                              onClick={() => handleClienteSelect(cliente)}
                                              className="bg-teal-600 hover:bg-teal-700"
                                            >
                                              Selecionar
                                            </Button>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                              <span className="font-medium">{
                                                cliente.documento.replace(/\D/g, "").length === 14 ? "CNPJ:" : "CPF:"
                                              }</span>
                                              <span>{cliente.documento}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                              <span className="font-medium">Telefone:</span>
                                              <span>{cliente.telefone}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                              <span className="font-medium">Email:</span>
                                              <span className="truncate max-w-[180px] overflow-hidden">{cliente.email}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            ) : (
                              <div className="p-6 text-center space-y-4">
                                <p className="text-gray-600">
                                  Nenhum cliente encontrado. Verifique os critérios de busca.
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <Card className="border-teal-100 bg-gray-50 shadow-sm">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-teal-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-medium">{selectedCliente.nome}</h3>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedCliente(null)
                                  setSearchTerm("")
                                  setShowResults(false)
                                  setQueixasTecnicas([])
                                  setSelectedQueixa(null)
                                  setFormData(prev => ({ ...prev, queixaTecnicaId: "" }))
                                }}
                              >
                                Alterar Cliente
                              </Button>
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
                  )}
                </div>
              )}

              {/* Cliente selecionado quando vier da página de cadastro - sem opção de alterar */}
              {clienteId && selectedCliente && (
                <div className="space-y-4">
                  <Label className="text-base font-medium">Cliente</Label>
                  <Card className="border-teal-100 bg-gray-50 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-teal-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">{selectedCliente.nome}</h3>
                            <Badge variant="secondary" className="text-xs">
                              Cliente fixo
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                            {selectedCliente.email && (
                              <div className="flex items-center gap-1 text-gray-600">
                                <span>{selectedCliente.email}</span>
                              </div>
                            )}
                            {selectedCliente.telefone && (
                              <div className="flex items-center gap-1 text-gray-600">
                                <span>{selectedCliente.telefone}</span>
                              </div>
                            )}
                            {selectedCliente.documento && (
                              <div className="flex items-center gap-1 text-gray-600">
                                <span>{selectedCliente.documento}</span>
                              </div>
                            )}
                            {selectedCliente.endereco && (
                              <div className="flex items-center gap-1 text-gray-600">
                                <span>{selectedCliente.endereco}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Este ressarcimento está sendo criado para este cliente específico
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Seção de Queixas Técnicas - mostra quando cliente está selecionado */}
              {selectedCliente && queixasTecnicas.length > 0 && (
              <div className="space-y-4">
                  <Label className="text-base font-medium">Queixas Técnicas do Cliente</Label>
                  
                  {!selectedQueixa ? (
                    <>
                      <p className="text-sm text-gray-600">Selecione uma queixa técnica para vincular ao ressarcimento:</p>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {queixasTecnicas.map((queixa) => (
                          <Card 
                            key={queixa.id} 
                            className="border-2 border-gray-200 hover:border-[#26B99D]/50 transition-all cursor-pointer hover:shadow-md"
                            onClick={() => handleQueixaSelect(queixa.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-gray-900">{queixa.id}</h4>
                                    <div className="flex items-center gap-2">
                                      <Badge 
                                        variant="outline" 
                                        className={`${
                                          queixa.gravidade === 'Alta' ? 'bg-red-50 text-red-700 border-red-200' :
                                          queixa.gravidade === 'Moderada' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                          'bg-green-50 text-green-700 border-green-200'
                                        }`}
                                      >
                                        {queixa.gravidade}
                                      </Badge>
                                      <div className="flex items-center gap-1">
                                        {queixa.status === "Concluído" ? (
                                          <CheckCircle className="h-4 w-4 text-[#26B99D]" />
                                        ) : queixa.status === "Em análise" ? (
                                          <Clock className="h-4 w-4 text-amber-500" />
                                        ) : (
                                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                                        )}
                                        <span className="text-sm text-gray-600">{queixa.status}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                    <div className="flex items-center gap-2 text-sm">
                                      <span className="font-medium text-gray-500">Data:</span>
                                      <span className="text-gray-700">{queixa.data}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <span className="font-medium text-gray-500">Produto:</span>
                                      <span className="text-gray-700">{queixa.produto}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <span className="font-medium text-gray-500">Lote:</span>
                                      <span className="text-gray-700">{queixa.lote}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-sm text-gray-700 leading-relaxed">{queixa.descricao}</p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600">Queixa técnica vinculada:</p>
                      
                      {/* Mostrar apenas a queixa selecionada com botão desvincular */}
                      {(() => {
                        const queixaSelecionada = queixasTecnicas.find(q => q.id === selectedQueixa)
                        return queixaSelecionada && (
                          <Card className="border-2 border-[#26B99D] bg-[#F7FDFC]">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-gray-900">{queixaSelecionada.id}</h4>
                                    <div className="flex items-center gap-2">
                                      <Badge 
                                        variant="outline" 
                                        className={`${
                                          queixaSelecionada.gravidade === 'Alta' ? 'bg-red-50 text-red-700 border-red-200' :
                                          queixaSelecionada.gravidade === 'Moderada' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                          'bg-green-50 text-green-700 border-green-200'
                                        }`}
                                      >
                                        {queixaSelecionada.gravidade}
                                      </Badge>
                                      <div className="flex items-center gap-1">
                                        {queixaSelecionada.status === "Concluído" ? (
                                          <CheckCircle className="h-4 w-4 text-[#26B99D]" />
                                        ) : queixaSelecionada.status === "Em análise" ? (
                                          <Clock className="h-4 w-4 text-amber-500" />
                                        ) : (
                                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                                        )}
                                        <span className="text-sm text-gray-600">{queixaSelecionada.status}</span>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleQueixaDeselect}
                                        className="ml-2 hover:bg-red-50 hover:text-red-600 hover:border-red-600"
                                      >
                                        Desvincular
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                    <div className="flex items-center gap-2 text-sm">
                                      <span className="font-medium text-gray-500">Data:</span>
                                      <span className="text-gray-700">{queixaSelecionada.data}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <span className="font-medium text-gray-500">Produto:</span>
                                      <span className="text-gray-700">{queixaSelecionada.produto}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <span className="font-medium text-gray-500">Lote:</span>
                                      <span className="text-gray-700">{queixaSelecionada.lote}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-white rounded-lg p-3 border border-[#26B99D]/20">
                                    <p className="text-sm text-gray-700 leading-relaxed">{queixaSelecionada.descricao}</p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })()}
                    </>
                  )}
                </div>
              )}

              {/* Mostrar mensagem quando cliente não tem queixas técnicas */}
              {selectedCliente && queixasTecnicas.length === 0 && (
                <div className="space-y-4">
                  <Label className="text-base font-medium">Queixas Técnicas do Cliente</Label>
                  <Card className="border-gray-200">
                    <CardContent className="p-6 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Nenhuma queixa técnica encontrada</h4>
                          <p className="text-sm text-gray-500">Este cliente não possui queixas técnicas registradas para vincular ao ressarcimento.</p>
                  </div>
                  </div>
                    </CardContent>
                  </Card>
              </div>
              )}

                <div className="mt-6 space-y-8 border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold">Informações para Ressarcimento</h4>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-medium mb-2 block">Tipo de ressarcimento</Label>
                    <RadioGroup
                      value={formData.tipoRessarcimento}
                      onValueChange={value => handleSelectChange("tipoRessarcimento", value)}
                      className="flex gap-6 mt-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="financeiro" id="ressarcimento-financeiro" />
                        <Label htmlFor="ressarcimento-financeiro">Financeiro</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="produto" id="ressarcimento-produto" />
                        <Label htmlFor="ressarcimento-produto">Produto</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="mt-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold">Dados do Solicitante</h4>
                      {selectedCliente && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleUsarDadosCliente}
                          className="hover:bg-teal-50 hover:text-teal-700 hover:border-teal-600"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Usar dados do cliente
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input name="reembolsoNome" placeholder="Nome" value={formData.reembolsoNome} onChange={handleInputChange} />
                      <Input name="reembolsoCpf" placeholder="CPF" value={formData.reembolsoCpf} onChange={handleInputChange} />
                      <Input name="reembolsoTelefone" placeholder="Telefone" value={formData.reembolsoTelefone} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-4">
                      <h5 className="text-base font-semibold">Dados de Endereço</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input name="reembolsoEndereco" placeholder="Logradouro" value={formData.reembolsoEndereco} onChange={handleInputChange} />
                        <Input name="reembolsoNumero" placeholder="Nº" value={formData.reembolsoNumero} onChange={handleInputChange} />
                        <Input name="reembolsoComplemento" placeholder="Complemento" value={formData.reembolsoComplemento} onChange={handleInputChange} />
                        <Input name="reembolsoBairro" placeholder="Bairro" value={formData.reembolsoBairro} onChange={handleInputChange} />
                        <Input name="reembolsoCidade" placeholder="Cidade" value={formData.reembolsoCidade} onChange={handleInputChange} />
                        <Select value={formData.reembolsoEstado} onValueChange={value => handleSelectChange('reembolsoEstado', value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AC">AC</SelectItem>
                            <SelectItem value="AL">AL</SelectItem>
                            <SelectItem value="AP">AP</SelectItem>
                            <SelectItem value="AM">AM</SelectItem>
                            <SelectItem value="BA">BA</SelectItem>
                            <SelectItem value="CE">CE</SelectItem>
                            <SelectItem value="DF">DF</SelectItem>
                            <SelectItem value="ES">ES</SelectItem>
                            <SelectItem value="GO">GO</SelectItem>
                            <SelectItem value="MA">MA</SelectItem>
                            <SelectItem value="MT">MT</SelectItem>
                            <SelectItem value="MS">MS</SelectItem>
                            <SelectItem value="MG">MG</SelectItem>
                            <SelectItem value="PA">PA</SelectItem>
                            <SelectItem value="PB">PB</SelectItem>
                            <SelectItem value="PR">PR</SelectItem>
                            <SelectItem value="PE">PE</SelectItem>
                            <SelectItem value="PI">PI</SelectItem>
                            <SelectItem value="RJ">RJ</SelectItem>
                            <SelectItem value="RN">RN</SelectItem>
                            <SelectItem value="RS">RS</SelectItem>
                            <SelectItem value="RO">RO</SelectItem>
                            <SelectItem value="RR">RR</SelectItem>
                            <SelectItem value="SC">SC</SelectItem>
                            <SelectItem value="SP">SP</SelectItem>
                            <SelectItem value="SE">SE</SelectItem>
                            <SelectItem value="TO">TO</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input name="reembolsoCep" placeholder="CEP" value={formData.reembolsoCep} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>
                  {formData.tipoRessarcimento === 'financeiro' && (
                    <Card className="border-teal-100 bg-teal-50/50 shadow-sm mt-6">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-900">
                              <rect width="20" height="14" x="2" y="5" rx="2"/>
                              <line x1="2" x2="22" y1="10" y2="10"/>
                              <path d="M6 14h.01"/>
                              <path d="M10 14h.01"/>
                              <path d="M14 14h.01"/>
                              <path d="M18 14h.01"/>
                            </svg>
                            <h5 className="text-base font-semibold text-teal-900">Dados Bancários</h5>
                          </div>
                          {selectedCliente && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  financeiroNome: selectedCliente.nome,
                                  financeiroCpf: selectedCliente.documento,
                                }))
                                toast({
                                  title: "Dados do titular preenchidos",
                                  description: "Nome e CPF do cliente foram copiados para os dados bancários.",
                                  duration: 3000,
                                })
                              }}
                              className="hover:bg-teal-50 hover:text-teal-700 hover:border-teal-600 text-xs"
                            >
                              <User className="mr-1 h-3 w-3" />
                              Usar dados do cliente
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input name="financeiroNome" placeholder="Nome do titular" value={formData.financeiroNome} onChange={handleInputChange} />
                          <Input name="financeiroCpf" placeholder="CPF do titular" value={formData.financeiroCpf} onChange={handleInputChange} />
                          <Input name="financeiroBanco" placeholder="Banco" value={formData.financeiroBanco} onChange={handleInputChange} />
                          <Input name="financeiroAgencia" placeholder="Agência" value={formData.financeiroAgencia} onChange={handleInputChange} />
                          <div className="space-y-4 col-span-2">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Tipo de Conta</Label>
                              <RadioGroup
                                value={formData.financeiroTipoConta}
                                onValueChange={value => handleSelectChange('financeiroTipoConta', value)}
                                className="flex gap-6"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="corrente" id="tipoConta-corrente" />
                                  <Label htmlFor="tipoConta-corrente">Conta corrente</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="poupanca" id="tipoConta-poupanca" />
                                  <Label htmlFor="tipoConta-poupanca">Poupança</Label>
                                </div>
                              </RadioGroup>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Número da Conta</Label>
                              <Input name="financeiroConta" placeholder="Conta" value={formData.financeiroConta} onChange={handleInputChange} />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
            </CardContent>
            <div className="flex justify-end gap-2 px-8 pb-8">
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={submitting}>
                Salvar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
} 