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
  Pencil,
  Trash2,
  Download,
  History,
  ScrollText,
  MessageSquare,
  Package,
  Barcode,
  X,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { NovoProtocoloModal } from "@/components/novo-protocolo-modal"
import { DetalhesRegistroModal } from "@/components/detalhes-registro-modal"
import { NovoRegistroModal } from "@/components/novo-registro-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

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

// Dados simulados de produtos e lotes
const PRODUTOS_MOCK = [
  { id: "medicamento-a", nome: "Medicamento A", ean: "7891234567890" },
  { id: "medicamento-b", nome: "Medicamento B", ean: "7891234567891" },
  { id: "medicamento-c", nome: "Medicamento C", ean: "7891234567892" },
  { id: "dispositivo-x", nome: "Dispositivo Médico X", ean: "7891234567893" },
  { id: "dispositivo-y", nome: "Dispositivo Médico Y", ean: "7891234567894" }
]

const LOTES_MOCK = {
  "medicamento-a": [
    { id: "ABC123", numero: "ABC123", validade: "12/2024" },
    { id: "ABC124", numero: "ABC124", validade: "01/2025" },
    { id: "ABC125", numero: "ABC125", validade: "03/2025" }
  ],
  "medicamento-b": [
    { id: "DEF123", numero: "DEF123", validade: "06/2024" },
    { id: "DEF124", numero: "DEF124", validade: "08/2024" }
  ],
  "medicamento-c": [
    { id: "GHI123", numero: "GHI123", validade: "12/2024" }
  ],
  "dispositivo-x": [
    { id: "XYZ123", numero: "XYZ123", validade: "12/2025" },
    { id: "XYZ124", numero: "XYZ124", validade: "12/2025" }
  ],
  "dispositivo-y": [
    { id: "WXY123", numero: "WXY123", validade: "06/2025" }
  ]
}

// Tipos para os selects
type ProdutoSelectProps = {
  value: string[]
  onValueChange: (value: string[]) => void
}

type LoteSelectProps = {
  value: string[]
  onValueChange: (value: string[]) => void
}

const NOTIFICACOES_MOCK = [
  {
    id: "FV-2023-0001",
    data: "15/06/2023",
    cliente: "Rafael Celso",
    produto: "Medicamento A",
    gravidade: "Leve"
  },
  {
    id: "FV-2023-0002", 
    data: "20/06/2023",
    cliente: "Maria Silva",
    produto: "Medicamento B",
    gravidade: "Moderada"
  }
];

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
  const [showNovoRegistroModal, setShowNovoRegistroModal] = useState(false)
  const [tipoRegistro, setTipoRegistro] = useState<"queixa" | "informacao" | "farmacovigilancia" | "contato">("contato")
  const [registroSelecionado, setRegistroSelecionado] = useState<any>(null)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [descricao, setDescricao] = useState("Relato de problema com embalagem do produto.")
  const [isEditingFarmacoDescription, setIsEditingFarmacoDescription] = useState(false)
  const [farmacoDescricao, setFarmacoDescricao] = useState("Relato de reação adversa ao medicamento.")
  const [produto, setProduto] = useState<string[]>([])
  const [lote, setLote] = useState<string[]>([])
  const [showLogsContatosModal, setShowLogsContatosModal] = useState(false)

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
                  value="farmacovigilancia"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#26B99D] data-[state=active]:bg-transparent"
                >
                  Farmacovigilância
                </TabsTrigger>
              </TabsList>

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
                                <TabsList className="w-full grid grid-cols-3 gap-2 bg-gray-100 p-1 rounded-lg">
                                  <TabsTrigger value="contatos" className="data-[state=active]:bg-[#26B99D] data-[state=active]:text-white">
                                    <Phone className="h-4 w-4 mr-2" />
                                    Contatos
                                  </TabsTrigger>
                                  <TabsTrigger value="queixas" className="data-[state=active]:bg-[#26B99D] data-[state=active]:text-white">
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    Queixas Técnicas
                                  </TabsTrigger>
                                  <TabsTrigger value="farmacovigilancia" className="data-[state=active]:bg-[#26B99D] data-[state=active]:text-white">
                                    <Shield className="h-4 w-4 mr-2" />
                                    Farmacovigilância
                                  </TabsTrigger>
                                </TabsList>

                                <TabsContent value="contatos" className="mt-4">
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-4">
                                      <Button 
                                        className="bg-[#26B99D] hover:bg-[#1E9A82]"
                                        onClick={() => {
                                          setTipoRegistro("contato")
                                          setShowNovoRegistroModal(true)
                                        }}
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Novo Contato
                                      </Button>
                                      <Button
                                        variant="outline"
                                        className="hover:bg-[#E6F7F5] hover:text-[#26B99D] hover:border-[#26B99D]"
                                        onClick={() => setShowLogsContatosModal(true)}
                                      >
                                        <History className="h-4 w-4 mr-2" />
                                        Logs
                                      </Button>
                                    </div>
                                    <div className="bg-white border rounded-lg shadow-sm">
                                      <div className="border-b bg-gray-50 p-4 rounded-t-lg">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                              <User className="h-4 w-4 text-indigo-600" />
                                            </div>
                                            <div>
                                              <p className="font-semibold text-gray-900">João Silva</p>
                                              <p className="text-sm text-gray-600">Assistente</p>
                                            </div>
                                          </div>
                                          <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="hover:bg-[#E6F7F5] hover:text-[#26B99D] hover:border-[#26B99D]">
                                              <Pencil className="h-4 w-4 mr-2" />
                                              Editar
                                            </Button>
                                            <Button variant="outline" size="sm" className="hover:bg-red-50 hover:text-red-600 hover:border-red-600">
                                              <Trash2 className="h-4 w-4 mr-2" />
                                              Excluir
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="p-4">
                                        <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae accusamus temporibus eaque quo, similique enim consectetur, iusto aperiam, ab totam et ipsum sequi doloribus eos molestias nam sapiente rem repellat.</p>
                                        <p className="text-gray-700">Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio, eaque quibusdam nulla facilis similique nobis accusantium iusto rerum molestias tempore ipsum, expedita odio maxime. Praesentium quisquam autem odio corporis consectetur?</p>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="queixas" className="mt-4">
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-4">
                                      <Button className="bg-[#26B99D] hover:bg-[#1E9A82]">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Nova Queixa Técnica
                                      </Button>
                                    </div>
                                    <div className="bg-white border rounded-lg shadow-sm">
                                      <Collapsible>
                                        <CollapsibleTrigger className="w-full">
                                          <div className="border-b bg-gray-50 p-4 rounded-t-lg hover:bg-gray-100">
                                            <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                                              <AlertTriangle className="h-4 w-4 text-amber-600" />
                                            </div>
                                            <div>
                                                  <p className="font-semibold text-gray-900">Queixa Técnica #QT-2023-0001</p>
                                                  <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-sm text-gray-600">15/06/2023 10:45</p>
                                                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                                      Em análise
                                                    </Badge>
                                            </div>
                                          </div>
                                        </div>
                                              <div className="flex gap-2">
                                                <Button variant="outline" size="sm" className="hover:bg-[#E6F7F5] hover:text-[#26B99D] hover:border-[#26B99D]">
                                                  <FileText className="h-4 w-4 mr-2" />
                                                  Ver detalhes
                                                </Button>
                                                <Button variant="outline" size="sm" className="hover:bg-red-50 hover:text-red-600 hover:border-red-600">
                                                  <Trash2 className="h-4 w-4 mr-2" />
                                                  Excluir
                                                </Button>
                                      </div>
                                            </div>
                                          </div>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                          <div className="p-6 space-y-6 bg-white border-t border-gray-100">
                                            <div>
                                              <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                  <FileText className="h-5 w-5 text-[#26B99D]" />
                                                  <Label htmlFor="relato-queixa" className="text-base font-medium text-gray-800">Detalhes da Queixa</Label>
                                                </div>
                                                <Button 
                                                  variant="outline" 
                                                  size="sm" 
                                                  className="hover:bg-[#E6F7F5] hover:text-[#26B99D] hover:border-[#26B99D]"
                                                  onClick={() => setIsEditingDescription(!isEditingDescription)}
                                                >
                                                  {isEditingDescription ? (
                                                    <>
                                                      <Save className="h-4 w-4 mr-2" />
                                                      Salvar
                                                    </>
                                                  ) : (
                                                    <>
                                                      <Pencil className="h-4 w-4 mr-2" />
                                                      Editar
                                                    </>
                                                  )}
                                                </Button>
                                              </div>
                                              {isEditingDescription ? (
                                                <div className="space-y-4">
                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                      <Label htmlFor="produto">Produto</Label>
                                                      <div className="relative">
                                                        <Select
                                                          defaultValue={produto[0] || ""}
                                                          onValueChange={(value) => {
                                                            const newValue = produto.includes(value) 
                                                              ? produto.filter(p => p !== value)
                                                              : [...produto, value];
                                                            setProduto(newValue);
                                                            if (produto.length > newValue.length) {
                                                              setLote(lote.filter(l => {
                                                                const loteProduto = Object.entries(LOTES_MOCK).find(([_, lotes]) =>
                                                                  lotes.some(loteItem => loteItem.id === l)
                                                                )?.[0];
                                                                return newValue.includes(loteProduto || "");
                                                              }));
                                                            }
                                                          }}
                                                        >
                                                          <SelectTrigger id="produto" className="h-auto min-h-[2.75rem] text-left">
                                                            <SelectValue>
                                                              {produto.length > 0 ? (
                                                                <div className="flex flex-wrap gap-2">
                                                                  {produto.map(p => {
                                                                    const prod = PRODUTOS_MOCK.find(pm => pm.id === p);
                                                                    return prod && (
                                                                      <Badge 
                                                                        key={prod.id}
                                                                        className="bg-[#E6F7F5] text-[#26B99D] hover:bg-red-100 hover:text-red-600 hover:border-red-600 cursor-pointer group"
                                                                        onClick={(e) => {
                                                                          e.stopPropagation();
                                                                          const newValue = produto.filter(item => item !== prod.id);
                                                                          setProduto(newValue);
                                                                          setLote(lote.filter(l => {
                                                                            const loteProduto = Object.entries(LOTES_MOCK).find(([_, lotes]) =>
                                                                              lotes.some(loteItem => loteItem.id === l)
                                                                            )?.[0];
                                                                            return newValue.includes(loteProduto || "");
                                                                          }));
                                                                        }}
                                                                      >
                                                                        {prod.nome}
                                                                        <X className="h-3 w-3 ml-1 hidden group-hover:inline-block" />
                                                                      </Badge>
                                                                    );
                                                                  })}
                                                                </div>
                                                              ) : (
                                                                "Selecione o produto"
                                                              )}
                                                            </SelectValue>
                                                          </SelectTrigger>
                                                          <SelectContent>
                                                            <div className="p-2">
                                                              <Input 
                                                                type="search" 
                                                                placeholder="Buscar produto..."
                                                                className="mb-2"
                                                              />
                                                            </div>
                                                            {PRODUTOS_MOCK.map((produtoItem) => (
                                                              <SelectItem 
                                                                key={produtoItem.id} 
                                                                value={produtoItem.id} 
                                                                className="text-left"
                                                              >
                                                                <div className="flex items-center gap-2">
                                                                  <div className="flex flex-col">
                                                                    <span>{produtoItem.nome}</span>
                                                                    <span className="text-sm text-gray-500">EAN: {produtoItem.ean}</span>
                                                                  </div>
                                                                  {produto.includes(produtoItem.id) && (
                                                                    <CheckCircle className="h-4 w-4 text-[#26B99D] ml-auto" />
                                                                  )}
                                                                </div>
                                                              </SelectItem>
                                                            ))}
                                                          </SelectContent>
                                                        </Select>
                                                      </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                      <Label htmlFor="lote">Lote</Label>
                                                      <div className="relative">
                                                        <Select
                                                          defaultValue={lote[0] || ""}
                                                          onValueChange={(value) => {
                                                            const newValue = lote.includes(value)
                                                              ? lote.filter(l => l !== value)
                                                              : [...lote, value];
                                                            setLote(newValue);
                                                          }}
                                                          disabled={produto.length === 0}
                                                        >
                                                          <SelectTrigger id="lote" className="h-auto min-h-[2.75rem] text-left">
                                                            <SelectValue>
                                                              {lote.length > 0 ? (
                                                                <div className="flex flex-wrap gap-2">
                                                                  {lote.map(l => {
                                                                    const loteProduto = Object.entries(LOTES_MOCK).find(([_, lotes]) =>
                                                                      lotes.some(loteItem => loteItem.id === l)
                                                                    )?.[0];
                                                                    const loteInfo = LOTES_MOCK[loteProduto as keyof typeof LOTES_MOCK]?.find(
                                                                      loteItem => loteItem.id === l
                                                                    );
                                                                    const produtoInfo = PRODUTOS_MOCK.find(p => p.id === loteProduto);
                                                                    return loteInfo && (
                                                                      <Badge 
                                                                        key={loteInfo.id}
                                                                        className="bg-[#E6F7F5] text-[#26B99D] hover:bg-red-100 hover:text-red-600 hover:border-red-600 cursor-pointer group"
                                                                        onClick={(e) => {
                                                                          e.stopPropagation();
                                                                          setLote(lote.filter(item => item !== loteInfo.id));
                                                                        }}
                                                                      >
                                                                        {produtoInfo?.nome} - Lote: {loteInfo.numero}
                                                                        <X className="h-3 w-3 ml-1 hidden group-hover:inline-block" />
                                                                      </Badge>
                                                                    );
                                                                  })}
                                                                </div>
                                                              ) : (
                                                                "Selecione o lote"
                                                              )}
                                                            </SelectValue>
                                                          </SelectTrigger>
                                                          <SelectContent>
                                                            <div className="p-2">
                                                              <Input 
                                                                type="search" 
                                                                placeholder="Buscar lote..."
                                                                className="mb-2"
                                                              />
                                                            </div>
                                                            {produto.map(prodId => {
                                                              const produtoInfo = PRODUTOS_MOCK.find(p => p.id === prodId);
                                                              return LOTES_MOCK[prodId as keyof typeof LOTES_MOCK]?.map((loteItem) => (
                                                                <SelectItem 
                                                                  key={loteItem.id} 
                                                                  value={loteItem.id} 
                                                                  className="text-left"
                                                                >
                                                                  <div className="flex items-center gap-2">
                                                                    <div className="flex flex-col">
                                                                      <span>{produtoInfo?.nome} - Lote: {loteItem.numero}</span>
                                                                    </div>
                                                                    {lote.includes(loteItem.id) && (
                                                                      <CheckCircle className="h-4 w-4 text-[#26B99D] ml-auto" />
                                                                    )}
                                                                  </div>
                                                                </SelectItem>
                                                              ));
                                                            })}
                                                          </SelectContent>
                                                        </Select>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="space-y-2">
                                                    <Label htmlFor="relato-queixa">Descrição</Label>
                                                    <Textarea
                                                      id="relato-queixa"
                                                      className="min-h-[100px] bg-white focus-visible:ring-[#26B99D]"
                                                      value={descricao}
                                                      onChange={(e) => setDescricao(e.target.value)}
                                                      placeholder="Digite a descrição da queixa técnica..."
                                                    />
                                                  </div>
                                                </div>
                                              ) : (
                                                <div className="space-y-4">
                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="bg-[#F7FDFC] border border-[#E6F7F5] rounded-lg p-4 shadow-sm">
                                                      <Label className="text-sm text-gray-500">Produto</Label>
                                                      <p className="text-gray-700 mt-1">{produto.length > 0 ? produto.join(", ") : "Medicamento A"}</p>
                                                    </div>
                                                    <div className="bg-[#F7FDFC] border border-[#E6F7F5] rounded-lg p-4 shadow-sm">
                                                      <Label className="text-sm text-gray-500">Lote</Label>
                                                      <p className="text-gray-700 mt-1">{lote.length > 0 ? lote.join(", ") : "ABC123"}</p>
                                                    </div>
                                                  </div>
                                                  <div className="bg-[#F7FDFC] border border-[#E6F7F5] rounded-lg p-4 shadow-sm">
                                                    <Label className="text-sm text-gray-500">Descrição</Label>
                                                    <p className="text-gray-700 mt-1">{descricao || "Relato de problema com embalagem do produto."}</p>
                                                  </div>
                                                </div>
                                              )}
                                            </div>

                                            <div className="bg-white rounded-lg border border-gray-200">
                                              <Tabs defaultValue="timeline" className="w-full">
                                                <TabsList className="w-full justify-start border-b bg-gray-50 p-2 rounded-t-lg gap-2">
                                                  <TabsTrigger value="timeline" className="data-[state=active]:bg-white data-[state=active]:border-[#26B99D] data-[state=active]:text-[#26B99D] rounded-md px-4 py-2 hover:bg-gray-100">
                                                    <History className="h-4 w-4 mr-2" />
                                                    Linha do Tempo
                                                  </TabsTrigger>
                                                  <TabsTrigger value="documents" className="data-[state=active]:bg-white data-[state=active]:border-[#26B99D] data-[state=active]:text-[#26B99D] rounded-md px-4 py-2 hover:bg-gray-100">
                                                    <ScrollText className="h-4 w-4 mr-2" />
                                                    Documentos
                                                  </TabsTrigger>
                                                  <TabsTrigger value="messages" className="data-[state=active]:bg-white data-[state=active]:border-[#26B99D] data-[state=active]:text-[#26B99D] rounded-md px-4 py-2 hover:bg-gray-100">
                                                    <MessageSquare className="h-4 w-4 mr-2" />
                                                    Mensagens
                                                  </TabsTrigger>
                                                  <TabsTrigger value="logs" className="data-[state=active]:bg-white data-[state=active]:border-[#26B99D] data-[state=active]:text-[#26B99D] rounded-md px-4 py-2 hover:bg-gray-100">
                                                    <History className="h-4 w-4 mr-2" />
                                                    Logs
                                                  </TabsTrigger>
                                                </TabsList>

                                                <TabsContent value="timeline" className="p-6">
                                                  <div className="space-y-6">
                                                    <div className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-transparent">
                                                      <div className="absolute -left-[16px] top-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                                      </div>
                                                      <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                          <h4 className="font-medium text-gray-900">Registro da queixa</h4>
                                                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                            15/06/2023 10:45
                                                          </Badge>
                                                        </div>
                                                        <p className="text-gray-600">Queixa técnica registrada no sistema por Rafael Celso</p>
                                                      </div>
                                                    </div>

                                                    <div className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-transparent">
                                                      <div className="absolute -left-[16px] top-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                                      </div>
                                                      <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                          <h4 className="font-medium text-gray-900">Análise inicial</h4>
                                                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                            15/06/2023 14:30
                                                          </Badge>
                                                        </div>
                                                        <p className="text-gray-600">Queixa encaminhada para o setor de Qualidade</p>
                                                      </div>
                                                    </div>

                                                    <div className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-transparent">
                                                      <div className="absolute -left-[16px] top-0 h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                                                        <Clock className="h-5 w-5 text-amber-600" />
                                                      </div>
                                                      <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                          <h4 className="font-medium text-gray-900">Avaliação técnica</h4>
                                                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                                            15/06/2023 16:20
                                                          </Badge>
                                                        </div>
                                                        <p className="text-gray-600">Em análise pelo departamento técnico</p>
                                                      </div>
                                                    </div>

                                                    <div className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-transparent">
                                                      <div className="absolute -left-[16px] top-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                        <Clock className="h-5 w-5 text-gray-400" />
                                                      </div>
                                                      <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                          <h4 className="font-medium text-gray-400">Conclusão</h4>
                                                          <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                                                            Pendente
                                                          </Badge>
                                                        </div>
                                                        <p className="text-gray-400">Aguardando parecer final</p>
                                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>

                                                <TabsContent value="messages" className="p-6">
                                                  <div className="space-y-6">
                                                    <div className="space-y-6">
                                                      <div className="flex gap-4">
                                                        <div className="flex flex-col items-center">
                                                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                            <User className="h-5 w-5 text-blue-600" />
                                                          </div>
                                                          <div className="w-px h-full bg-gray-200 my-2"></div>
                                                        </div>
                                                        <div className="flex-1">
                                                          <div className="bg-white rounded-2xl rounded-tl-none border border-gray-200 p-4 shadow-sm">
                                                            <div className="flex items-center justify-between mb-2">
                                                              <div className="flex items-center gap-2">
                                                                <p className="font-medium text-gray-900">Rafael Celso</p>
                                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                                  Atendente
                                                                </Badge>
                                                              </div>
                                                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                <Clock className="h-4 w-4" />
                                                                15/06/2023 11:30
                                                              </div>
                                                            </div>
                                                            <p className="text-gray-700">Queixa técnica registrada e encaminhada para análise inicial.</p>
                                                          </div>
                                                        </div>
                                                      </div>

                                                      <div className="flex gap-4">
                                                        <div className="flex flex-col items-center">
                                                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                                            <User className="h-5 w-5 text-purple-600" />
                                                          </div>
                                                          <div className="w-px h-full bg-gray-200 my-2"></div>
                                                        </div>
                                                        <div className="flex-1">
                                                          <div className="bg-white rounded-2xl rounded-tl-none border border-gray-200 p-4 shadow-sm">
                                                            <div className="flex items-center justify-between mb-2">
                                                              <div className="flex items-center gap-2">
                                                                <p className="font-medium text-gray-900">Eng. Carlos</p>
                                                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                                                  Qualidade
                                                                </Badge>
                                                              </div>
                                                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                <Clock className="h-4 w-4" />
                                                                15/06/2023 15:45
                                                              </div>
                                                            </div>
                                                            <p className="text-gray-700">Análise inicial realizada. Encaminhado para avaliação técnica.</p>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>

                                                    <div className="flex items-center gap-4 pt-4 border-t">
                                                      <div className="h-10 w-10 rounded-full bg-[#E6F7F5] flex items-center justify-center flex-shrink-0">
                                                        <User className="h-5 w-5 text-[#26B99D]" />
                                                      </div>
                                                      <div className="flex-1 relative">
                                                        <Input 
                                                          placeholder="Digite sua mensagem..." 
                                                          className="bg-white pr-24 focus-visible:ring-[#26B99D]" 
                                                        />
                                                        <Button 
                                                          size="sm"
                                                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#26B99D] hover:bg-[#1E9A82]"
                                                        >
                                                          Enviar
                                                        </Button>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </TabsContent>

                                                <TabsContent value="documents" className="p-6">
                                                  <div className="space-y-6">
                                                    <div className="grid gap-4">
                                                      <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-[#26B99D] transition-colors group">
                                                        <div className="flex items-center justify-between">
                                                          <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-[#E6F7F5]">
                                                              <FileText className="h-5 w-5 text-gray-500 group-hover:text-[#26B99D]" />
                                            </div>
                                            <div>
                                                              <p className="font-medium text-gray-900">Relatório Inicial.pdf</p>
                                                              <p className="text-sm text-gray-500">1.2 MB • 15/06/2023</p>
                                            </div>
                                          </div>
                                                          <Button variant="ghost" size="sm" className="group-hover:text-[#26B99D]">
                                                            <Download className="h-4 w-4" />
                                                          </Button>
                                        </div>
                                      </div>

                                                      <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-[#26B99D] transition-colors group">
                                                        <div className="flex items-center justify-between">
                                                          <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-[#E6F7F5]">
                                                              <FileText className="h-5 w-5 text-gray-500 group-hover:text-[#26B99D]" />
                                          </div>
                                                            <div>
                                                              <p className="font-medium text-gray-900">Laudo Parcial.pdf</p>
                                                              <p className="text-sm text-gray-500">2.8 MB • 22/06/2023</p>
                                          </div>
                                                          </div>
                                                          <Button variant="ghost" size="sm" className="group-hover:text-[#26B99D]">
                                                            <Download className="h-4 w-4" />
                                                          </Button>
                                                        </div>
                                                      </div>
                                                    </div>

                                                    <div className="space-y-4 pt-4 border-t">
                                                      <p className="text-sm text-gray-600">Adicionar novo documento</p>
                                                      
                                                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 hover:border-[#26B99D] transition-colors">
                                                        <div className="flex flex-col items-center justify-center gap-4">
                                                          <div className="h-12 w-12 rounded-lg bg-[#E6F7F5] flex items-center justify-center">
                                                            <FileText className="h-6 w-6 text-[#26B99D]" />
                                                          </div>
                                                          <div className="text-center">
                                                            <p className="text-sm font-medium text-gray-900">
                                                              Arraste e solte seus arquivos aqui
                                                            </p>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                              ou
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-2">
                                                              <Button variant="outline" className="text-gray-600">
                                                                Selecionar arquivo
                                                              </Button>
                                                              <Button className="bg-[#26B99D] hover:bg-[#1E9A82]">
                                                                Enviar
                                                              </Button>
                                                            </div>
                                                          </div>
                                                          <p className="text-xs text-gray-500">
                                                            Arquivos suportados: PDF, DOC, DOCX, JPG, PNG, WAV (máx. 10MB)
                                                          </p>
                                        </div>
                                      </div>
                                                    </div>
                                                  </div>
                                                </TabsContent>

                                                <TabsContent value="logs" className="p-6">
                                                  <div className="space-y-6">
                                                    <div className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-transparent">
                                                      <div className="absolute -left-[16px] top-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <History className="h-5 w-5 text-blue-600" />
                                                      </div>
                                                      <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                          <h4 className="font-medium text-gray-900">Atualização de Produto</h4>
                                                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                            15/06/2023 10:45
                                                          </Badge>
                                                        </div>
                                                        <p className="text-gray-600">Produto "Medicamento A" adicionado ao protocolo por Rafael Celso</p>
                                                      </div>
                                                    </div>

                                                    <div className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-transparent">
                                                      <div className="absolute -left-[16px] top-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <History className="h-5 w-5 text-blue-600" />
                                                      </div>
                                                      <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                          <h4 className="font-medium text-gray-900">Atualização de Lote</h4>
                                                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                            15/06/2023 10:46
                                                          </Badge>
                                                        </div>
                                                        <p className="text-gray-600">Lote "ABC123" adicionado ao protocolo por Rafael Celso</p>
                                                      </div>
                                                    </div>

                                                    <div className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-transparent">
                                                      <div className="absolute -left-[16px] top-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <History className="h-5 w-5 text-blue-600" />
                                                      </div>
                                                      <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                          <h4 className="font-medium text-gray-900">Atualização de Status</h4>
                                                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                            15/06/2023 14:30
                                                          </Badge>
                                                        </div>
                                                        <p className="text-gray-600">Status alterado para "Em análise" por Carlos Mendes</p>
                                                      </div>
                                                    </div>

                                                    <div className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-transparent">
                                                      <div className="absolute -left-[16px] top-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <History className="h-5 w-5 text-blue-600" />
                                                      </div>
                                                      <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                          <h4 className="font-medium text-gray-900">Atualização de Descrição</h4>
                                                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                            15/06/2023 16:20
                                                          </Badge>
                                                        </div>
                                                        <p className="text-gray-600">Descrição atualizada por Rafael Celso</p>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </TabsContent>
                                              </Tabs>
                                            </div>
                                          </div>
                                        </CollapsibleContent>
                                      </Collapsible>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="farmacovigilancia" className="mt-4">
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-4">
                                      <Button className="bg-[#26B99D] hover:bg-[#1E9A82]">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Nova Farmacovigilância
                                      </Button>
                                    </div>
                                    <div className="bg-white border rounded-lg shadow-sm">
                                      <Collapsible>
                                        <CollapsibleTrigger className="w-full">
                                          <div className="border-b bg-gray-50 p-4 rounded-t-lg hover:bg-gray-100">
                                            <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                                  <Shield className="h-4 w-4 text-red-600" />
                                            </div>
                                            <div>
                                                  <p className="font-semibold text-gray-900">Farmacovigilância #FM-2023-0001</p>
                                                  <div className="flex items-center gap-2 mt-1">
                                              <p className="text-sm text-gray-600">15/06/2023 10:45</p>
                                                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                                      Em análise
                                                    </Badge>
                                            </div>
                                          </div>
                                        </div>
                                              <div className="flex gap-2">
                                                <Button variant="outline" size="sm" className="hover:bg-[#E6F7F5] hover:text-[#26B99D] hover:border-[#26B99D]">
                                                  <FileText className="h-4 w-4 mr-2" />
                                                  Ver detalhes
                                                </Button>
                                                <Button variant="outline" size="sm" className="hover:bg-red-50 hover:text-red-600 hover:border-red-600">
                                                  <Trash2 className="h-4 w-4 mr-2" />
                                                  Excluir
                                                </Button>
                                      </div>
                                      </div>
                                    </div>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                          <div className="p-4 border-t space-y-4">
                                            <div>
                                              <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                  <FileText className="h-5 w-5 text-[#26B99D]" />
                                                  <Label htmlFor="relato-farmacovigilancia" className="text-base font-medium text-gray-800">Detalhes</Label>
                                                </div>
                                                <Button 
                                                  variant="outline" 
                                                  size="sm" 
                                                  className="hover:bg-[#E6F7F5] hover:text-[#26B99D] hover:border-[#26B99D]"
                                                  onClick={() => setIsEditingFarmacoDescription(!isEditingFarmacoDescription)}
                                                >
                                                  {isEditingFarmacoDescription ? (
                                                    <>
                                                      <Save className="h-4 w-4 mr-2" />
                                                      Salvar
                                                    </>
                                                  ) : (
                                                    <>
                                                      <Pencil className="h-4 w-4 mr-2" />
                                                      Editar
                                                    </>
                                                  )}
                                                </Button>
                                              </div>
                                              {isEditingFarmacoDescription ? (
                                                <div className="space-y-4">
                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                      <Label htmlFor="produto">Produto</Label>
                                                      <div className="relative">
                                                        <Select
                                                          defaultValue={produto[0] || ""}
                                                          onValueChange={(value) => {
                                                            const newValue = produto.includes(value) 
                                                              ? produto.filter(p => p !== value)
                                                              : [...produto, value];
                                                            setProduto(newValue);
                                                            if (produto.length > newValue.length) {
                                                              setLote(lote.filter(l => {
                                                                const loteProduto = Object.entries(LOTES_MOCK).find(([_, lotes]) =>
                                                                  lotes.some(loteItem => loteItem.id === l)
                                                                )?.[0];
                                                                return newValue.includes(loteProduto || "");
                                                              }));
                                                            }
                                                          }}
                                                        >
                                                          <SelectTrigger id="produto" className="h-auto min-h-[2.75rem] text-left">
                                                            <SelectValue>
                                                              {produto.length > 0 ? (
                                                                <div className="flex flex-wrap gap-2">
                                                                  {produto.map(p => {
                                                                    const prod = PRODUTOS_MOCK.find(pm => pm.id === p);
                                                                    return prod && (
                                                                      <Badge 
                                                                        key={prod.id}
                                                                        className="bg-[#E6F7F5] text-[#26B99D] hover:bg-red-100 hover:text-red-600 hover:border-red-600 cursor-pointer group"
                                                                        onClick={(e) => {
                                                                          e.stopPropagation();
                                                                          const newValue = produto.filter(item => item !== prod.id);
                                                                          setProduto(newValue);
                                                                          setLote(lote.filter(l => {
                                                                            const loteProduto = Object.entries(LOTES_MOCK).find(([_, lotes]) =>
                                                                              lotes.some(loteItem => loteItem.id === l)
                                                                            )?.[0];
                                                                            return newValue.includes(loteProduto || "");
                                                                          }));
                                                                        }}
                                                                      >
                                                                        {prod.nome}
                                                                        <X className="h-3 w-3 ml-1 hidden group-hover:inline-block" />
                                                                      </Badge>
                                                                    );
                                                                  })}
                                                                </div>
                                                              ) : (
                                                                "Selecione o produto"
                                                              )}
                                                            </SelectValue>
                                                          </SelectTrigger>
                                                          <SelectContent>
                                                            <div className="p-2">
                                                              <Input 
                                                                type="search" 
                                                                placeholder="Buscar produto..."
                                                                className="mb-2"
                                                              />
                                                            </div>
                                                            {PRODUTOS_MOCK.map((produtoItem) => (
                                                              <SelectItem 
                                                                key={produtoItem.id} 
                                                                value={produtoItem.id} 
                                                                className="text-left"
                                                              >
                                                                <div className="flex items-center gap-2">
                                                                  <div className="flex flex-col">
                                                                    <span>{produtoItem.nome}</span>
                                                                    <span className="text-sm text-gray-500">EAN: {produtoItem.ean}</span>
                                                                  </div>
                                                                  {produto.includes(produtoItem.id) && (
                                                                    <CheckCircle className="h-4 w-4 text-[#26B99D] ml-auto" />
                                                                  )}
                                                                </div>
                                                              </SelectItem>
                                                            ))}
                                                          </SelectContent>
                                                        </Select>
                                                      </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                      <Label htmlFor="lote">Lote</Label>
                                                      <div className="relative">
                                                        <Select
                                                          defaultValue={lote[0] || ""}
                                                          onValueChange={(value) => {
                                                            const newValue = lote.includes(value)
                                                              ? lote.filter(l => l !== value)
                                                              : [...lote, value];
                                                            setLote(newValue);
                                                          }}
                                                          disabled={produto.length === 0}
                                                        >
                                                          <SelectTrigger id="lote" className="h-auto min-h-[2.75rem] text-left">
                                                            <SelectValue>
                                                              {lote.length > 0 ? (
                                                                <div className="flex flex-wrap gap-2">
                                                                  {lote.map(l => {
                                                                    const loteProduto = Object.entries(LOTES_MOCK).find(([_, lotes]) =>
                                                                      lotes.some(loteItem => loteItem.id === l)
                                                                    )?.[0];
                                                                    const loteInfo = LOTES_MOCK[loteProduto as keyof typeof LOTES_MOCK]?.find(
                                                                      loteItem => loteItem.id === l
                                                                    );
                                                                    const produtoInfo = PRODUTOS_MOCK.find(p => p.id === loteProduto);
                                                                    return loteInfo && (
                                                                      <Badge 
                                                                        key={loteInfo.id}
                                                                        className="bg-[#E6F7F5] text-[#26B99D] hover:bg-red-100 hover:text-red-600 hover:border-red-600 cursor-pointer group"
                                                                        onClick={(e) => {
                                                                          e.stopPropagation();
                                                                          setLote(lote.filter(item => item !== loteInfo.id));
                                                                        }}
                                                                      >
                                                                        {produtoInfo?.nome} - Lote: {loteInfo.numero}
                                                                        <X className="h-3 w-3 ml-1 hidden group-hover:inline-block" />
                                                                      </Badge>
                                                                    );
                                                                  })}
                                                                </div>
                                                              ) : (
                                                                "Selecione o lote"
                                                              )}
                                                            </SelectValue>
                                                          </SelectTrigger>
                                                          <SelectContent>
                                                            <div className="p-2">
                                                              <Input 
                                                                type="search" 
                                                                placeholder="Buscar lote..."
                                                                className="mb-2"
                                                              />
                                                            </div>
                                                            {produto.map(prodId => {
                                                              const produtoInfo = PRODUTOS_MOCK.find(p => p.id === prodId);
                                                              return LOTES_MOCK[prodId as keyof typeof LOTES_MOCK]?.map((loteItem) => (
                                                                <SelectItem 
                                                                  key={loteItem.id} 
                                                                  value={loteItem.id} 
                                                                  className="text-left"
                                                                >
                                                                  <div className="flex items-center gap-2">
                                                                    <div className="flex flex-col">
                                                                      <span>{produtoInfo?.nome} - Lote: {loteItem.numero}</span>
                                                                    </div>
                                                                    {lote.includes(loteItem.id) && (
                                                                      <CheckCircle className="h-4 w-4 text-[#26B99D] ml-auto" />
                                                                    )}
                                                                  </div>
                                                                </SelectItem>
                                                              ));
                                                            })}
                                                          </SelectContent>
                                                        </Select>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="space-y-2">
                                                    <Label htmlFor="relato-farmacovigilancia">Descrição</Label>
                                                    <Textarea
                                                      id="relato-farmacovigilancia"
                                                      className="min-h-[100px] bg-white focus-visible:ring-[#26B99D]"
                                                      value={farmacoDescricao}
                                                      onChange={(e) => setFarmacoDescricao(e.target.value)}
                                                      placeholder="Digite a descrição do evento adverso..."
                                                    />
                                                  </div>
                                                </div>
                                              ) : (
                                                <div className="space-y-4">
                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="bg-[#F7FDFC] border border-[#E6F7F5] rounded-lg p-4 shadow-sm">
                                                      <Label className="text-sm text-gray-500">Produto</Label>
                                                      <p className="text-gray-700 mt-1">{produto.length > 0 ? produto.join(", ") : "Medicamento A"}</p>
                                                    </div>
                                                    <div className="bg-[#F7FDFC] border border-[#E6F7F5] rounded-lg p-4 shadow-sm">
                                                      <Label className="text-sm text-gray-500">Lote</Label>
                                                      <p className="text-gray-700 mt-1">{lote.length > 0 ? lote.join(", ") : "ABC123"}</p>
                                                    </div>
                                                  </div>
                                                  <div className="bg-[#F7FDFC] border border-[#E6F7F5] rounded-lg p-4 shadow-sm">
                                                    <Label className="text-sm text-gray-500">Descrição</Label>
                                                    <p className="text-gray-700 mt-1">{farmacoDescricao || "Relato de reação adversa ao medicamento."}</p>
                                                  </div>
                                                </div>
                                              )}
                                            </div>

                                            <div className="bg-white rounded-lg border border-gray-200">
                                              <Tabs defaultValue="timeline" className="w-full">
                                                <TabsList className="w-full justify-start border-b bg-gray-50 p-2 rounded-t-lg gap-2">
                                                  <TabsTrigger value="timeline" className="data-[state=active]:bg-white data-[state=active]:border-[#26B99D] data-[state=active]:text-[#26B99D] rounded-md px-4 py-2 hover:bg-gray-100">
                                                    <History className="h-4 w-4 mr-2" />
                                                    Linha do Tempo
                                                  </TabsTrigger>
                                                  <TabsTrigger value="documents" className="data-[state=active]:bg-white data-[state=active]:border-[#26B99D] data-[state=active]:text-[#26B99D] rounded-md px-4 py-2 hover:bg-gray-100">
                                                    <ScrollText className="h-4 w-4 mr-2" />
                                                    Documentos
                                                  </TabsTrigger>
                                                  <TabsTrigger value="messages" className="data-[state=active]:bg-white data-[state=active]:border-[#26B99D] data-[state=active]:text-[#26B99D] rounded-md px-4 py-2 hover:bg-gray-100">
                                                    <MessageSquare className="h-4 w-4 mr-2" />
                                                    Mensagens
                                                  </TabsTrigger>
                                                  <TabsTrigger value="logs" className="data-[state=active]:bg-white data-[state=active]:border-[#26B99D] data-[state=active]:text-[#26B99D] rounded-md px-4 py-2 hover:bg-gray-100">
                                                    <History className="h-4 w-4 mr-2" />
                                                    Logs
                                                  </TabsTrigger>
                                                </TabsList>

                                                <TabsContent value="timeline" className="p-6">
                                                  <div className="space-y-6">
                                                    <div className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-transparent">
                                                      <div className="absolute -left-[16px] top-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                                      </div>
                                                      <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                          <h4 className="font-medium text-gray-900">Registro do evento</h4>
                                                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                            15/06/2023 11:00
                                                          </Badge>
                                      </div>
                                                        <p className="text-gray-600">Evento adverso registrado no sistema por Rafael Celso</p>
                                                      </div>
                                                    </div>

                                                    <div className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-transparent">
                                                      <div className="absolute -left-[16px] top-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                                      </div>
                                                      <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                          <h4 className="font-medium text-gray-900">Análise inicial</h4>
                                                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                            15/06/2023 14:30
                                                          </Badge>
                                                        </div>
                                                        <p className="text-gray-600">Evento encaminhado para o setor de Farmacovigilância</p>
                                                      </div>
                                                    </div>

                                                    <div className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-transparent">
                                                      <div className="absolute -left-[16px] top-0 h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                                                        <Clock className="h-5 w-5 text-amber-600" />
                                                      </div>
                                                      <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                          <h4 className="font-medium text-gray-900">Avaliação médica</h4>
                                                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                                            15/06/2023 16:20
                                                          </Badge>
                                                        </div>
                                                        <p className="text-gray-600">Em análise pelo departamento médico</p>
                                                      </div>
                                                    </div>

                                                    <div className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-transparent">
                                                      <div className="absolute -left-[16px] top-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                        <Clock className="h-5 w-5 text-gray-400" />
                                                      </div>
                                                      <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                          <h4 className="font-medium text-gray-400">Conclusão</h4>
                                                          <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                                                            Pendente
                                                          </Badge>
                                                        </div>
                                                        <p className="text-gray-400">Aguardando parecer final</p>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>

                                                <TabsContent value="messages" className="p-6">
                                                  <div className="space-y-6">
                                                    <div className="space-y-6">
                                                      <div className="flex gap-4">
                                                        <div className="flex flex-col items-center">
                                                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                            <User className="h-5 w-5 text-blue-600" />
                                                          </div>
                                                          <div className="w-px h-full bg-gray-200 my-2"></div>
                                                        </div>
                                                        <div className="flex-1">
                                                          <div className="bg-white rounded-2xl rounded-tl-none border border-gray-200 p-4 shadow-sm">
                                                            <div className="flex items-center justify-between mb-2">
                                                              <div className="flex items-center gap-2">
                                                                <p className="font-medium text-gray-900">Rafael Celso</p>
                                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                                  Atendente
                                                                </Badge>
                                                              </div>
                                                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                <Clock className="h-4 w-4" />
                                                                15/06/2023 11:30
                                                              </div>
                                                            </div>
                                                            <p className="text-gray-700">Evento adverso registrado e encaminhado para análise inicial.</p>
                                                          </div>
                                                        </div>
                                                      </div>

                                                      <div className="flex gap-4">
                                                        <div className="flex flex-col items-center">
                                                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                                            <User className="h-5 w-5 text-purple-600" />
                                                          </div>
                                                          <div className="w-px h-full bg-gray-200 my-2"></div>
                                                        </div>
                                                        <div className="flex-1">
                                                          <div className="bg-white rounded-2xl rounded-tl-none border border-gray-200 p-4 shadow-sm">
                                                            <div className="flex items-center justify-between mb-2">
                                                              <div className="flex items-center gap-2">
                                                                <p className="font-medium text-gray-900">Dr. Ana Paula</p>
                                                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                                                  Farmacovigilância
                                                                </Badge>
                                                              </div>
                                                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                <Clock className="h-4 w-4" />
                                                                15/06/2023 15:45
                                                              </div>
                                                            </div>
                                                            <p className="text-gray-700">Análise inicial realizada. Encaminhado para avaliação médica.</p>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>

                                                    <div className="flex items-center gap-4 pt-4 border-t">
                                                      <div className="h-10 w-10 rounded-full bg-[#E6F7F5] flex items-center justify-center flex-shrink-0">
                                                        <User className="h-5 w-5 text-[#26B99D]" />
                                                      </div>
                                                      <div className="flex-1 relative">
                                                        <Input 
                                                          placeholder="Digite sua mensagem..." 
                                                          className="bg-white pr-24 focus-visible:ring-[#26B99D]" 
                                                        />
                                                        <Button 
                                                          size="sm"
                                                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#26B99D] hover:bg-[#1E9A82]"
                                                        >
                                                          Enviar
                                      </Button>
                                    </div>
                                                    </div>
                                                  </div>
                                                </TabsContent>

                                                <TabsContent value="documents" className="p-6">
                                                  <div className="space-y-6">
                                                    <div className="grid gap-4">
                                                      <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-[#26B99D] transition-colors group">
                                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-[#E6F7F5]">
                                                              <FileText className="h-5 w-5 text-gray-500 group-hover:text-[#26B99D]" />
                                            </div>
                                            <div>
                                                              <p className="font-medium text-gray-900">Relatório Inicial.pdf</p>
                                                              <p className="text-sm text-gray-500">1.2 MB • 15/06/2023</p>
                                            </div>
                                          </div>
                                                          <Button variant="ghost" size="sm" className="group-hover:text-[#26B99D]">
                                                            <Download className="h-4 w-4" />
                                                          </Button>
                                        </div>
                                      </div>

                                                      <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-[#26B99D] transition-colors group">
                                                        <div className="flex items-center justify-between">
                                                          <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-[#E6F7F5]">
                                                              <FileText className="h-5 w-5 text-gray-500 group-hover:text-[#26B99D]" />
                                          </div>
                                                            <div>
                                                              <p className="font-medium text-gray-900">Laudo Parcial.pdf</p>
                                                              <p className="text-sm text-gray-500">2.8 MB • 22/06/2023</p>
                                          </div>
                                                          </div>
                                                          <Button variant="ghost" size="sm" className="group-hover:text-[#26B99D]">
                                                            <Download className="h-4 w-4" />
                                                          </Button>
                                                        </div>
                                                      </div>
                                                    </div>

                                                    <div className="space-y-4 pt-4 border-t">
                                                      <p className="text-sm text-gray-600">Adicionar novo documento</p>
                                                      
                                                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 hover:border-[#26B99D] transition-colors">
                                                        <div className="flex flex-col items-center justify-center gap-4">
                                                          <div className="h-12 w-12 rounded-lg bg-[#E6F7F5] flex items-center justify-center">
                                                            <FileText className="h-6 w-6 text-[#26B99D]" />
                                                          </div>
                                                          <div className="text-center">
                                                            <p className="text-sm font-medium text-gray-900">
                                                              Arraste e solte seus arquivos aqui
                                                            </p>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                              ou
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-2">
                                                              <Button variant="outline" className="text-gray-600">
                                                                Selecionar arquivo
                                                              </Button>
                                                              <Button className="bg-[#26B99D] hover:bg-[#1E9A82]">
                                                                Enviar
                                                              </Button>
                                                            </div>
                                                          </div>
                                                          <p className="text-xs text-gray-500">
                                                            Arquivos suportados: PDF, DOC, DOCX, JPG, PNG, WAV (máx. 10MB)
                                                          </p>
                                        </div>
                                      </div>
                                                    </div>
                                                  </div>
                                                </TabsContent>

                                                <TabsContent value="logs" className="p-6">
                                                  <div className="space-y-6">
                                                    <div className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-transparent">
                                                      <div className="absolute -left-[16px] top-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <History className="h-5 w-5 text-blue-600" />
                                                      </div>
                                                      <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                          <h4 className="font-medium text-gray-900">Atualização de Produto</h4>
                                                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                            15/06/2023 10:45
                                                          </Badge>
                                                        </div>
                                                        <p className="text-gray-600">Produto "Medicamento A" adicionado ao protocolo por Rafael Celso</p>
                                                      </div>
                                                    </div>

                                                    <div className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-transparent">
                                                      <div className="absolute -left-[16px] top-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <History className="h-5 w-5 text-blue-600" />
                                                      </div>
                                                      <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                          <h4 className="font-medium text-gray-900">Atualização de Lote</h4>
                                                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                            15/06/2023 10:46
                                                          </Badge>
                                                        </div>
                                                        <p className="text-gray-600">Lote "ABC123" adicionado ao protocolo por Rafael Celso</p>
                                                      </div>
                                                    </div>

                                                    <div className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-transparent">
                                                      <div className="absolute -left-[16px] top-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <History className="h-5 w-5 text-blue-600" />
                                                      </div>
                                                      <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                          <h4 className="font-medium text-gray-900">Atualização de Status</h4>
                                                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                            15/06/2023 14:30
                                                          </Badge>
                                                        </div>
                                                        <p className="text-gray-600">Status alterado para "Em análise" por Carlos Mendes</p>
                                                      </div>
                                                    </div>

                                                    <div className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-transparent">
                                                      <div className="absolute -left-[16px] top-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <History className="h-5 w-5 text-blue-600" />
                                                      </div>
                                                      <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                          <h4 className="font-medium text-gray-900">Atualização de Descrição</h4>
                                                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                            15/06/2023 16:20
                                                          </Badge>
                                                        </div>
                                                        <p className="text-gray-600">Descrição atualizada por Rafael Celso</p>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </TabsContent>
                                              </Tabs>
                                            </div>
                                          </div>
                                        </CollapsibleContent>
                                      </Collapsible>
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
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200"
                                >
                                  Leve
                                </Badge>
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
                                <Link href={`/protocolos/QT-2023-0002?tab=queixas`}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Ver detalhes
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-6">
                              Este cliente não possui queixas técnicas registradas.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

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
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200"
                              >
                                Leve
                              </Badge>
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
                            <TableCell colSpan={7} className="text-center py-6">
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

        <NovoRegistroModal
          open={showNovoRegistroModal}
          onOpenChange={setShowNovoRegistroModal}
          tipo={tipoRegistro}
          cliente={cliente}
        />

        <Dialog open={showLogsContatosModal} onOpenChange={setShowLogsContatosModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Logs de Contatos</DialogTitle>
              <DialogDescription>
                Histórico de alterações realizadas nos contatos do protocolo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-transparent">
                <div className="absolute -left-[16px] top-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <History className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">Novo Contato</h4>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      15/06/2023 10:45
                    </Badge>
                  </div>
                  <p className="text-gray-600">Contato criado por Rafael Celso</p>
                </div>
              </div>

              <div className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-transparent">
                <div className="absolute -left-[16px] top-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <History className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">Atualização de Descrição</h4>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      15/06/2023 11:30
                    </Badge>
                  </div>
                  <p className="text-gray-600">Descrição atualizada por Rafael Celso</p>
                </div>
              </div>

              <div className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-transparent">
                <div className="absolute -left-[16px] top-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <History className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">Atualização de Status</h4>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      15/06/2023 14:30
                    </Badge>
                  </div>
                  <p className="text-gray-600">Status alterado para "Em análise" por Carlos Mendes</p>
                </div>
              </div>

              <div className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-transparent">
                <div className="absolute -left-[16px] top-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <History className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">Atualização de Tipo</h4>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      15/06/2023 16:20
                    </Badge>
                  </div>
                  <p className="text-gray-600">Tipo de contato alterado para "Telefone" por Rafael Celso</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

