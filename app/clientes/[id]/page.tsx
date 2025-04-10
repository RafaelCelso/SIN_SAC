"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Edit,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Shield,
  Plus,
  Clock,
  ChevronDown,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { NovoProtocoloModal } from "@/components/novo-protocolo-modal"
import { DetalhesRegistroModal } from "@/components/detalhes-registro-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

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
    observacoes: "Cliente preferencial. Possui histórico de alergias a medicamentos com sulfato.",
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
    observacoes: "Cliente solicita contato apenas por e-mail.",
  },
  {
    id: "3",
    nome: "Farmácia Saúde Ltda",
    documento: "12.345.678/0001-90",
    telefone: "(11) 3456-7890",
    email: "contato@farmaciasaude.com.br",
    endereco: "Av. Rebouças, 1500 - São Paulo/SP",
    tipo: "Pessoa Jurídica",
    dataCadastro: "05/03/2023",
    observacoes: "Farmácia parceira. Contato principal: Dr. Roberto (Farmacêutico responsável).",
  },
  {
    id: "novo",
    nome: "Novo Cliente",
    documento: "",
    telefone: "",
    email: "",
    endereco: "",
    tipo: "Pessoa Física",
    dataCadastro: new Date().toLocaleDateString("pt-BR"),
    observacoes: "",
  },
]

// Dados simulados de protocolos
const PROTOCOLOS_MOCK = [
  {
    id: "P-2023-001",
    data: "15/03/2023",
    tipo: "Queixa Técnica",
    produto: "Medicamento A",
    status: "Em análise",
    clienteId: "1",
    descricao: "Cliente relatou problema com a embalagem do medicamento.",
  },
  {
    id: "P-2023-045",
    data: "22/04/2023",
    tipo: "Evento Adverso",
    produto: "Medicamento B",
    status: "Pendente",
    clienteId: "1",
    descricao: "Reação alérgica após uso do medicamento.",
  },
  {
    id: "P-2023-078",
    data: "10/05/2023",
    tipo: "Informação Médica",
    produto: "Medicamento C",
    status: "Em andamento",
    clienteId: "2",
    descricao: "Solicitação de informações sobre posologia.",
  },
  {
    id: "P-2023-112",
    data: "05/06/2023",
    tipo: "Farmacovigilância",
    produto: "Dispositivo Médico X",
    status: "Pendente",
    clienteId: "3",
    descricao: "Notificação de evento adverso relacionado ao uso do dispositivo.",
  },
]

export default function ClientePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const clienteId = params.id as string
  const novoProtocolo = searchParams.get("protocolo")

  const [cliente, setCliente] = useState<(typeof CLIENTES_MOCK)[0] | null>(null)
  const [protocolos, setProtocolos] = useState<typeof PROTOCOLOS_MOCK>([])
  const [activeTab, setActiveTab] = useState("dados")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    documento: "",
    telefone: "",
    email: "",
    endereco: "",
    tipo: "Pessoa Física",
    observacoes: "",
  })

  const [showNovoProtocoloModal, setShowNovoProtocoloModal] = useState(false)
  const [showDetalhesModal, setShowDetalhesModal] = useState(false)
  const [registroSelecionado, setRegistroSelecionado] = useState<any>(null)

  // Carregar dados do cliente
  useEffect(() => {
    const clienteEncontrado = CLIENTES_MOCK.find((c) => c.id === clienteId)
    if (clienteEncontrado) {
      setCliente(clienteEncontrado)
      setFormData({
        nome: clienteEncontrado.nome,
        documento: clienteEncontrado.documento,
        telefone: clienteEncontrado.telefone,
        email: clienteEncontrado.email,
        endereco: clienteEncontrado.endereco,
        tipo: clienteEncontrado.tipo,
        observacoes: clienteEncontrado.observacoes,
      })
    }

    // Carregar protocolos do cliente
    const protocolosCliente = PROTOCOLOS_MOCK.filter((p) => p.clienteId === clienteId)
    setProtocolos(protocolosCliente)

    // Mostrar notificação se houver novo protocolo
    if (novoProtocolo) {
      toast({
        title: "Protocolo criado",
        description: `O protocolo ${novoProtocolo} foi criado com sucesso para este cliente.`,
        duration: 5000,
      })
    }
  }, [clienteId, novoProtocolo])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    // Simulação de salvamento
    toast({
      title: "Dados salvos",
      description: "As informações do cliente foram atualizadas com sucesso.",
      duration: 3000,
    })
    setIsEditing(false)

    // Atualizar dados do cliente na interface
    if (cliente) {
      const clienteAtualizado = {
        ...cliente,
        ...formData,
      }
      setCliente(clienteAtualizado)
    }
  }

  const handleVerDetalhes = (registro: any) => {
    setRegistroSelecionado(registro)
    setShowDetalhesModal(true)
  }

  if (!cliente) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Cliente não encontrado</AlertTitle>
            <AlertDescription>Não foi possível encontrar o cliente com o ID especificado.</AlertDescription>
          </Alert>
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
              <a href="/">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <h1 className="text-2xl font-bold">Cadastro do Cliente</h1>
          </div>

          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Cadastro
            </Button>
          ) : (
            <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700">
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          )}
        </div>

        {novoProtocolo && (
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Protocolo criado com sucesso</AlertTitle>
            <AlertDescription>
              O protocolo <strong>{novoProtocolo}</strong> foi criado e associado a este cliente.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center">
                <User className="h-8 w-8 text-teal-600" />
              </div>
              <div>
                <CardTitle>{cliente.nome}</CardTitle>
                <CardDescription>
                  <Badge variant="outline" className="mr-2">
                    {cliente.tipo}
                  </Badge>
                  <span className="text-muted-foreground">Cadastrado em {cliente.dataCadastro}</span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Modificar a lista de abas para incluir as novas abas solicitadas */}
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="dados"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#26B99D] data-[state=active]:bg-transparent"
                >
                  Dados Cadastrais
                </TabsTrigger>
                <TabsTrigger
                  value="protocolos"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#26B99D] data-[state=active]:bg-transparent"
                >
                  Protocolos
                </TabsTrigger>
                <TabsTrigger
                  value="queixas"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#26B99D] data-[state=active]:bg-transparent"
                >
                  Queixas Técnicas
                </TabsTrigger>
                <TabsTrigger
                  value="informacoes"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#26B99D] data-[state=active]:bg-transparent"
                >
                  Informações Médicas
                </TabsTrigger>
                <TabsTrigger
                  value="farmacovigilancia"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#26B99D] data-[state=active]:bg-transparent"
                >
                  Farmacovigilância
                </TabsTrigger>
              </TabsList>

              {/* Conteúdo existente das abas */}
              {/* ... */}

              <TabsContent value="dados" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo</Label>
                      {isEditing ? (
                        <Input id="nome" name="nome" value={formData.nome} onChange={handleInputChange} />
                      ) : (
                        <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                          <User className="h-4 w-4 text-gray-500" />
                          <span>{cliente.nome}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="documento">CPF</Label>
                      {isEditing ? (
                        <Input
                          id="documento"
                          name="documento"
                          value={formData.documento}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                          <Shield className="h-4 w-4 text-gray-500" />
                          <span>{cliente.documento}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      {isEditing ? (
                        <Input id="telefone" name="telefone" value={formData.telefone} onChange={handleInputChange} />
                      ) : (
                        <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{cliente.telefone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>{cliente.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endereco">Endereço</Label>
                      {isEditing ? (
                        <Input id="endereco" name="endereco" value={formData.endereco} onChange={handleInputChange} />
                      ) : (
                        <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{cliente.endereco}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo do Cliente</Label>
                      {isEditing ? (
                        <Select value={formData.tipo} onValueChange={(value) => setFormData((prev) => ({ ...prev, tipo: value }))}>
                          <SelectTrigger id="tipo">
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
                      ) : (
                        <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                          <User className="h-4 w-4 text-gray-500" />
                          <span>{cliente.tipo}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  {isEditing ? (
                    <Textarea
                      id="observacoes"
                      name="observacoes"
                      value={formData.observacoes}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  ) : (
                    <div className="p-3 border rounded-md bg-gray-50 min-h-[100px]">
                      {cliente.observacoes || "Nenhuma observação registrada."}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="protocolos" className="p-6">
                {protocolos.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Protocolos do Cliente</h3>
                      <div className="flex gap-2 items-center">
                        <Badge variant="outline" className="bg-gray-100">
                          {protocolos.length} protocolo(s)
                        </Badge>
                        <Button
                          className="bg-[#26B99D] hover:bg-[#1E9A82]"
                          onClick={() => setShowNovoProtocoloModal(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Novo Protocolo
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {protocolos.map((protocolo) => (
                        <Collapsible key={protocolo.id} className="border rounded-md data-[state=open]:bg-[#F7FDFC]">
                          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                              <div className="flex flex-col">
                                <span className="font-medium">{protocolo.id}</span>
                                <span className="text-sm text-gray-500">{protocolo.data}</span>
                              </div>
                            </div>
                            <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 data-[state=open]:rotate-180" />
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="p-4 pt-6 border-t">
                              {/* Informações Principais */}
                              <div className="mb-6 grid grid-cols-3 gap-4 bg-white border rounded-lg shadow-sm">
                                <div className="p-4 border-r">
                                  <p className="text-sm font-medium text-gray-600 mb-1">Criado por</p>
                                  <p className="text-gray-900">Rafael Celso</p>
                                </div>
                                <div className="p-4 border-r">
                                  <p className="text-sm font-medium text-gray-600 mb-1">Data de Criação</p>
                                  <p className="text-gray-900">{protocolo.data}</p>
                                </div>
                                <div className="p-4">
                                  <p className="text-sm font-medium text-gray-600 mb-1">Última Atualização</p>
                                  <p className="text-gray-900">{protocolo.data}</p>
                                </div>
                              </div>

                              {/* Abas de Navegação */}
                              <Tabs defaultValue="contatos" className="w-full">
                                <TabsList className="w-full grid grid-cols-4 gap-2 bg-gray-100 p-1 rounded-lg">
                                  <TabsTrigger value="contatos" className="data-[state=active]:bg-[#26B99D] data-[state=active]:text-white">
                                    <Phone className="h-4 w-4 mr-2" />
                                    Contatos
                                  </TabsTrigger>
                                  <TabsTrigger value="queixas" className="data-[state=active]:bg-[#26B99D] data-[state=active]:text-white">
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    Queixas Técnicas
                                  </TabsTrigger>
                                  <TabsTrigger value="informacoes" className="data-[state=active]:bg-[#26B99D] data-[state=active]:text-white">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Informações Médicas
                                  </TabsTrigger>
                                  <TabsTrigger value="farmacovigilancia" className="data-[state=active]:bg-[#26B99D] data-[state=active]:text-white">
                                    <Shield className="h-4 w-4 mr-2" />
                                    Farmacovigilância
                                  </TabsTrigger>
                                </TabsList>

                                <TabsContent value="contatos" className="mt-4">
                                  <div className="space-y-4">
                                    <div className="bg-white border rounded-lg shadow-sm">
                                      <div className="border-b bg-gray-50 p-4 rounded-t-lg">
                                        <div className="flex items-center">
                                          <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                              <Phone className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                              <p className="font-semibold text-gray-900">Contato Inicial</p>
                                              <p className="text-sm text-gray-600">15/06/2023 10:30</p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="p-4">
                                        <p className="text-gray-700">Cliente entrou em contato relatando problema com o produto.</p>
                                      </div>
                                    </div>
                                    <div className="bg-white border rounded-lg shadow-sm">
                                      <div className="border-b bg-gray-50 p-4 rounded-t-lg">
                                        <div className="flex items-center">
                                          <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                              <Mail className="h-4 w-4 text-purple-600" />
                                            </div>
                                            <div>
                                              <p className="font-semibold text-gray-900">Retorno ao Cliente</p>
                                              <p className="text-sm text-gray-600">16/06/2023 14:15</p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="p-4">
                                        <p className="text-gray-700">Enviado email com instruções e formulário para preenchimento.</p>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="queixas" className="mt-4">
                                  <div className="space-y-4">
                                    <div className="bg-white border rounded-lg shadow-sm">
                                      <div className="border-b bg-gray-50 p-4 rounded-t-lg">
                                        <div className="flex items-center">
                                          <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                                              <AlertTriangle className="h-4 w-4 text-amber-600" />
                                            </div>
                                            <div>
                                              <p className="font-semibold text-gray-900">Registro da Queixa</p>
                                              <p className="text-sm text-gray-600">15/06/2023 11:00</p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="p-4">
                                        <div className="grid grid-cols-2 gap-6">
                                          <div className="bg-gray-50 p-3 rounded-md">
                                            <p className="text-sm font-medium text-gray-600 mb-1">Produto</p>
                                            <p className="text-gray-900">Medicamento A</p>
                                          </div>
                                          <div className="bg-gray-50 p-3 rounded-md">
                                            <p className="text-sm font-medium text-gray-600 mb-1">Lote</p>
                                            <p className="text-gray-900">ABC123</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="informacoes" className="mt-4">
                                  <div className="space-y-4">
                                    <div className="bg-white border rounded-lg shadow-sm">
                                      <div className="border-b bg-gray-50 p-4 rounded-t-lg">
                                        <div className="flex items-center">
                                          <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                              <FileText className="h-4 w-4 text-indigo-600" />
                                            </div>
                                            <div>
                                              <p className="font-semibold text-gray-900">Solicitação de Informação</p>
                                              <p className="text-sm text-gray-600">15/06/2023 10:45</p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="p-4">
                                        <p className="text-gray-700">Solicitação de informações sobre dosagem e forma de administração.</p>
                                      </div>
                                    </div>
                                    <div className="bg-white border rounded-lg shadow-sm">
                                      <div className="border-b bg-gray-50 p-4 rounded-t-lg">
                                        <div className="flex items-center">
                                          <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                              <CheckCircle className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                              <p className="font-semibold text-gray-900">Resposta Técnica</p>
                                              <p className="text-sm text-gray-600">16/06/2023 09:30</p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="p-4">
                                        <p className="text-gray-700">Enviada orientação técnica sobre posologia conforme bula.</p>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="farmacovigilancia" className="mt-4">
                                  <div className="space-y-4">
                                    <div className="bg-white border rounded-lg shadow-sm">
                                      <div className="border-b bg-gray-50 p-4 rounded-t-lg">
                                        <div className="flex items-center">
                                          <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center">
                                              <Shield className="h-4 w-4 text-rose-600" />
                                            </div>
                                            <div>
                                              <p className="font-semibold text-gray-900">Notificação de Evento Adverso</p>
                                              <p className="text-sm text-gray-600">15/06/2023 11:15</p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="p-4">
                                        <div className="grid grid-cols-2 gap-6">
                                          <div className="bg-gray-50 p-3 rounded-md">
                                            <p className="text-sm font-medium text-gray-600 mb-1">Reação Adversa</p>
                                            <p className="text-gray-900">Náusea</p>
                                          </div>
                                          <div className="bg-gray-50 p-3 rounded-md">
                                            <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
                                            <p className="text-gray-900">Concluído</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium">Nenhum protocolo encontrado</h3>
                    <p className="text-muted-foreground mt-1">Este cliente ainda não possui protocolos registrados.</p>
                  </div>
                )}
              </TabsContent>

              {/* Nova aba de Queixas Técnicas */}
              <TabsContent value="queixas" className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Queixas Técnicas do Cliente</h3>
                    <Button className="bg-[#26B99D] hover:bg-[#1E9A82]">
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Queixa Técnica
                    </Button>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Protocolo</TableHead>
                          <TableHead>Criado em</TableHead>
                          <TableHead>Criado por</TableHead>
                          <TableHead>Produto</TableHead>
                          <TableHead>Lote</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cliente.id === "1" ? (
                          <>
                            <TableRow>
                              <TableCell className="font-medium">QT-2023-0001</TableCell>
                              <TableCell>15/06/2023</TableCell>
                              <TableCell>Rafael Celso</TableCell>
                              <TableCell>Medicamento A</TableCell>
                              <TableCell>ABC123</TableCell>
                              <TableCell>Problema na embalagem</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-amber-500" />
                                  <span>Em análise</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="hover:bg-[#E6F7F5] hover:text-[#26B99D] hover:border-[#26B99D]"
                                  asChild
                                >
                                  <Link href={`/protocolos/QT-2023-0001?tab=queixas`}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Ver detalhes
                                  </Link>
                                </Button>
                              </TableCell>
                            </TableRow>
                          </>
                        ) : cliente.id === "2" ? (
                          <TableRow>
                            <TableCell className="font-medium">QT-2023-0002</TableCell>
                            <TableCell>16/06/2023</TableCell>
                            <TableCell>Rafael Celso</TableCell>
                            <TableCell>Medicamento B</TableCell>
                            <TableCell>DEF456</TableCell>
                            <TableCell>Problema no conteúdo</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-[#26B99D]" />
                                <span>Concluído</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-[#E6F7F5] hover:text-[#26B99D] hover:border-[#26B99D]"
                                asChild
                              >
                                <Link href={`/protocolos/QT-2023-0002?tab=queixas`}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Ver detalhes
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-6">
                              Este cliente não possui queixas técnicas registradas.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {/* Nova aba de Informações Médicas */}
              <TabsContent value="informacoes" className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Informações Médicas do Cliente</h3>
                    <Button className="bg-[#26B99D] hover:bg-[#1E9A82]">
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Solicitação
                    </Button>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Protocolo</TableHead>
                          <TableHead>Criado em</TableHead>
                          <TableHead>Criado por</TableHead>
                          <TableHead>Produto</TableHead>
                          <TableHead>Assunto</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cliente.id === "1" ? (
                          <TableRow>
                            <TableCell className="font-medium">IM-2023-0001</TableCell>
                            <TableCell>15/06/2023</TableCell>
                            <TableCell>Rafael Celso</TableCell>
                            <TableCell>Medicamento A</TableCell>
                            <TableCell>Posologia</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-[#26B99D]" />
                                <span>Respondido</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-[#E6F7F5] hover:text-[#26B99D] hover:border-[#26B99D]"
                                asChild
                              >
                                <Link href={`/protocolos/IM-2023-0001?tab=informacoes`}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Ver detalhes
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ) : cliente.id === "2" ? (
                          <TableRow>
                            <TableCell className="font-medium">IM-2023-0002</TableCell>
                            <TableCell>16/06/2023</TableCell>
                            <TableCell>Rafael Celso</TableCell>
                            <TableCell>Medicamento B</TableCell>
                            <TableCell>Interações medicamentosas</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-amber-500" />
                                <span>Em análise</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-[#E6F7F5] hover:text-[#26B99D] hover:border-[#26B99D]"
                                asChild
                              >
                                <Link href={`/protocolos/IM-2023-0002?tab=informacoes`}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Ver detalhes
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-6">
                              Este cliente não possui solicitações de informações médicas registradas.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {/* Nova aba de Farmacovigilância */}
              <TabsContent value="farmacovigilancia" className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Registros de Farmacovigilância do Cliente</h3>
                    <Button className="bg-[#26B99D] hover:bg-[#1E9A82]">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Registro
                    </Button>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Protocolo</TableHead>
                          <TableHead>Criado em</TableHead>
                          <TableHead>Criado por</TableHead>
                          <TableHead>Produto</TableHead>
                          <TableHead>Reação Adversa</TableHead>
                          <TableHead>Gravidade</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cliente.id === "1" ? (
                          <TableRow>
                            <TableCell className="font-medium">FV-2023-0001</TableCell>
                            <TableCell>15/06/2023</TableCell>
                            <TableCell>Rafael Celso</TableCell>
                            <TableCell>Medicamento A</TableCell>
                            <TableCell>Náusea</TableCell>
                            <TableCell>
                              <Badge className="bg-[#26B99D]">Leve</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-[#26B99D]" />
                                <span>Concluído</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-[#E6F7F5] hover:text-[#26B99D] hover:border-[#26B99D]"
                                asChild
                              >
                                <Link href={`/protocolos/FV-2023-0001?tab=farmacovigilancia`}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Ver detalhes
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ) : cliente.id === "2" ? (
                          <TableRow>
                            <TableCell className="font-medium">FV-2023-0002</TableCell>
                            <TableCell>16/06/2023</TableCell>
                            <TableCell>Rafael Celso</TableCell>
                            <TableCell>Medicamento B</TableCell>
                            <TableCell>Erupção cutânea</TableCell>
                            <TableCell>
                              <Badge variant="secondary">Moderada</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-amber-500" />
                                <span>Em análise</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-[#E6F7F5] hover:text-[#26B99D] hover:border-[#26B99D]"
                                asChild
                              >
                                <Link href={`/protocolos/FV-2023-0002?tab=farmacovigilancia`}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Ver detalhes
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-6">
                              Este cliente não possui registros de farmacovigilância.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Modais */}
        {cliente && (
          <NovoProtocoloModal
            open={showNovoProtocoloModal}
            onOpenChange={setShowNovoProtocoloModal}
            cliente={cliente}
          />
        )}

        {registroSelecionado && (
          <DetalhesRegistroModal
            open={showDetalhesModal}
            onOpenChange={setShowDetalhesModal}
            registro={registroSelecionado}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

