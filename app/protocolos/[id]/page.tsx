"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { NovoRegistroModal } from "@/components/novo-registro-modal"
import { Plus, FileText, Calendar, Mail, Phone, User, MessageSquare, ChevronDown, ChevronUp, Clock } from "lucide-react"

interface Contato {
  id: string
  data: string
  tipo: "Email" | "Telefone" | "Presencial"
  assunto: string
  atendente: string
  descricao: string
  protocolo_interno: string
  duracao?: string
  telefone?: string
  email?: string
}

interface Protocolo {
  id: string
  data: string
  tipo: string
  produto: string
  status: string
  clienteId: string
  cliente: string
  descricao: string
  historico: Array<{
    data: string
    usuario: string
    tipo: string
    descricao: string
  }>
  queixas: Array<{
    id: string
    data: string
    produto: string
    status: string
    descricao: string
    historico: Array<{
      data: string
      usuario: string
      acao: string
      descricao: string
    }>
  }>
  informacoes: Array<{
    id: string
    data: string
    produto: string
    status: string
    descricao: string
    historico: Array<{
      data: string
      usuario: string
      acao: string
      descricao: string
    }>
  }>
  farmacovigilancia: Array<{
    id: string
    data: string
    produto: string
    status: string
    descricao: string
    historico: Array<{
      data: string
      usuario: string
      acao: string
      descricao: string
    }>
  }>
  contatos: Contato[]
}

// Dados simulados de protocolos
const PROTOCOLOS_MOCK = [
  {
    id: "P-2023-001",
    data: "15/03/2023",
    tipo: "Queixa Técnica",
    produto: "Medicamento A",
    status: "Em análise",
    clienteId: "1",
    cliente: "Maria Silva",
    descricao: "Cliente relatou problema com a embalagem do medicamento.",
    historico: [
      {
        data: "15/03/2023 10:30",
        usuario: "Ana Silva",
        tipo: "Registro",
        descricao: "Protocolo criado",
      },
      {
        data: "16/03/2023 14:15",
        usuario: "Carlos Mendes",
        tipo: "Análise",
        descricao: "Iniciada análise do caso",
      },
    ],
    queixas: [
      {
        id: "QT-2023-0001",
        data: "15/03/2023",
        produto: "Medicamento A",
        status: "Em análise",
        descricao: "Problema na embalagem",
        historico: [
          { data: "15/03/2023", usuario: "Ana Silva", acao: "Registro", descricao: "Queixa registrada" },
          { data: "16/03/2023", usuario: "Carlos Mendes", acao: "Análise", descricao: "Iniciada análise" },
        ],
      },
    ],
    informacoes: [
      {
        id: "IM-2023-0001",
        data: "16/03/2023",
        produto: "Medicamento A",
        status: "Respondido",
        descricao: "Dúvida sobre posologia",
        historico: [
          { data: "16/03/2023", usuario: "Ana Silva", acao: "Registro", descricao: "Solicitação registrada" },
          { data: "17/03/2023", usuario: "Dr. Paulo", acao: "Resposta", descricao: "Informações enviadas" },
        ],
      },
    ],
    farmacovigilancia: [
      {
        id: "FV-2023-0001",
        data: "18/03/2023",
        produto: "Medicamento A",
        status: "Concluído",
        descricao: "Reação leve após uso",
        historico: [
          { data: "18/03/2023", usuario: "Ana Silva", acao: "Registro", descricao: "Evento registrado" },
          { data: "19/03/2023", usuario: "Dr. Paulo", acao: "Análise", descricao: "Evento analisado" },
          { data: "20/03/2023", usuario: "Ana Silva", acao: "Conclusão", descricao: "Caso concluído" },
        ],
      },
    ],
    contatos: [
      {
        id: "CT-2023-001",
        data: "15/03/2023 09:45",
        tipo: "Telefone",
        assunto: "Abertura de protocolo",
        atendente: "Ana Silva",
        descricao: "Cliente entrou em contato relatando problema com a embalagem do medicamento. Informou que a caixa estava danificada no momento da compra. Orientado sobre o processo de registro da queixa técnica.",
        duracao: "15 minutos",
        telefone: "(11) 98765-4321",
        protocolo_interno: "TEL-20230315-001"
      },
      {
        id: "CT-2023-002",
        data: "17/03/2023 14:30",
        tipo: "Email",
        assunto: "Envio de informações",
        atendente: "Carlos Mendes",
        descricao: "Prezada Sra. Maria Silva,\n\nConforme solicitado, seguem as informações sobre o andamento da análise da queixa técnica registrada.\n\nA área técnica está avaliando o caso e deve concluir a análise em até 5 dias úteis.\n\nPermanecemos à disposição para mais esclarecimentos.\n\nAtenciosamente,\nCarlos Mendes\nSAC - Departamento Técnico",
        email: "maria.silva@email.com",
        protocolo_interno: "EMAIL-20230317-003"
      },
      {
        id: "CT-2023-003",
        data: "20/03/2023 11:15",
        tipo: "Telefone",
        assunto: "Acompanhamento",
        atendente: "Ana Silva",
        descricao: "Cliente ligou para acompanhar o status da análise. Informado que a área técnica já concluiu a avaliação e que o retorno será enviado por email ainda hoje.",
        duracao: "8 minutos",
        telefone: "(11) 98765-4321",
        protocolo_interno: "TEL-20230320-007"
      }
    ],
  },
  {
    id: "P-2023-045",
    data: "22/04/2023",
    tipo: "Evento Adverso",
    produto: "Medicamento B",
    status: "Pendente",
    clienteId: "1",
    cliente: "Maria Silva",
    descricao: "Reação alérgica após uso do medicamento.",
    historico: [
      {
        data: "22/04/2023 09:45",
        usuario: "Ana Silva",
        tipo: "Registro",
        descricao: "Protocolo criado",
      },
    ],
    queixas: [],
    informacoes: [],
    farmacovigilancia: [
      {
        id: "FV-2023-0002",
        data: "22/04/2023",
        produto: "Medicamento B",
        status: "Pendente",
        descricao: "Reação alérgica",
        historico: [{ data: "22/04/2023", usuario: "Ana Silva", acao: "Registro", descricao: "Evento registrado" }],
      },
    ],
    contatos: [
      {
        data: "22/04/2023 09:30",
        tipo: "Telefone",
        assunto: "Relato de reação alérgica",
        atendente: "Ana Silva",
      },
    ],
  },
  {
    id: "QT-2023-0001",
    data: "15/06/2023",
    tipo: "Queixa Técnica",
    produto: "Medicamento A",
    lote: "ABC123",
    status: "Em análise",
    clienteId: "1",
    cliente: "Maria Silva",
    descricao: "Cliente relatou problema com a embalagem do medicamento.",
    historico: [
      {
        data: "15/06/2023 10:30",
        usuario: "Ana Silva",
        tipo: "Registro",
        descricao: "Queixa técnica registrada",
      },
      {
        data: "16/06/2023 14:15",
        usuario: "Carlos Mendes",
        tipo: "Análise",
        descricao: "Iniciada análise do caso",
      },
    ],
    queixas: [
      {
        id: "QT-2023-0001",
        data: "15/06/2023",
        produto: "Medicamento A",
        status: "Em análise",
        descricao: "Problema na embalagem",
        historico: [
          { data: "15/06/2023", usuario: "Ana Silva", acao: "Registro", descricao: "Queixa registrada" },
          { data: "16/06/2023", usuario: "Carlos Mendes", acao: "Análise", descricao: "Iniciada análise" },
        ],
      },
    ],
    informacoes: [],
    farmacovigilancia: [],
    contatos: [
      {
        data: "15/06/2023 10:15",
        tipo: "Telefone",
        assunto: "Relato de problema na embalagem",
        atendente: "Ana Silva",
      },
    ],
  },
  // Outros protocolos...
]

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

export default function ProtocoloPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab")
  const [currentTab, setCurrentTab] = useState(activeTab || "detalhes")
  const [expandedContacts, setExpandedContacts] = useState<Set<string>>(new Set())

  const protocolo = PROTOCOLOS_MOCK.find((p) => p.id === params.id) as Protocolo | undefined
  const cliente = CLIENTES_MOCK.find((c) => c.id === protocolo?.clienteId)

  const [showNovoRegistroModal, setShowNovoRegistroModal] = useState(false)
  const [tipoRegistro, setTipoRegistro] = useState<string>("")

  // Determinar quais abas mostrar com base no parâmetro de consulta
  const showAllTabs = !activeTab || activeTab === "all"

  if (!protocolo || !cliente) {
    return <div className="p-6">Protocolo não encontrado</div>
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/protocolos">Protocolos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Protocolo #{protocolo.id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mt-4">
          <h1 className="text-2xl font-bold">Protocolo #{protocolo.id}</h1>
          <div className="flex gap-2">
            <Button variant="outline">Editar</Button>
            <Button>Finalizar Protocolo</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-6">
          <Tabs defaultValue={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
              <TabsTrigger value="historico">Contatos</TabsTrigger>
              {(showAllTabs || activeTab === "queixas") && <TabsTrigger value="queixas">Queixas Técnicas</TabsTrigger>}
              {(showAllTabs || activeTab === "info") && <TabsTrigger value="info">Informações Médicas</TabsTrigger>}
              {(showAllTabs || activeTab === "farmacovigilancia") && (
                <TabsTrigger value="farmacovigilancia">Farmacovigilância</TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="detalhes" className="mt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  {/* Card de Dados do Cliente */}
                  <div className="border rounded-md p-4 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Dados do Cliente</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Nome</p>
                        <p className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          {cliente.nome}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Documento</p>
                        <p>{cliente.documento}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          {cliente.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Telefone</p>
                        <p className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          {cliente.telefone}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <Button variant="outline" size="sm" className="mt-2" asChild>
                          <Link href={`/clientes/${cliente.id}`}>Ver perfil completo</Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Card de Detalhes do Protocolo */}
                  <div className="border rounded-md p-4">
                    <h2 className="text-lg font-semibold mb-4">Detalhes do Protocolo</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Número</p>
                        <p>{protocolo.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <Badge variant={protocolo.status === "Aberto" ? "default" : "secondary"}>
                          {protocolo.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Data de Abertura</p>
                        <p className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {protocolo.data}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Última Atualização</p>
                        <p>{protocolo.data}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tipo</p>
                        <p>{protocolo.tipo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Produto</p>
                        <p>{protocolo.produto}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="historico" className="border rounded-md p-4 mt-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Contatos</h2>
                <Button
                  onClick={() => {
                    setTipoRegistro("contato")
                    setShowNovoRegistroModal(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Contato
                </Button>
              </div>

              {protocolo.contatos && protocolo.contatos.length > 0 ? (
                <div className="space-y-4">
                  {protocolo.contatos.map((contato) => (
                    <div key={contato.id} className="border rounded-lg shadow-sm bg-white">
                      <button
                        onClick={() => {
                          const newExpandedContacts = new Set(expandedContacts);
                          if (newExpandedContacts.has(contato.id)) {
                            newExpandedContacts.delete(contato.id);
                          } else {
                            newExpandedContacts.add(contato.id);
                          }
                          setExpandedContacts(newExpandedContacts);
                        }}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50/80 transition-colors"
                      >
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 min-w-[8rem]">
                            <div className={`p-2 rounded-full 
                              ${contato.tipo === "Email" 
                                ? "bg-blue-50" 
                                : contato.tipo === "Telefone"
                                  ? "bg-green-50"
                                  : "bg-purple-50"}`}
                            >
                              {contato.tipo === "Email" ? (
                                <Mail className="h-4 w-4 text-blue-600" />
                              ) : contato.tipo === "Telefone" ? (
                                <Phone className="h-4 w-4 text-green-600" />
                              ) : (
                                <MessageSquare className="h-4 w-4 text-purple-600" />
                              )}
                            </div>
                            <span className="font-medium">{contato.tipo}</span>
                          </div>
                          <div className="text-sm text-muted-foreground min-w-[9rem]">{contato.data}</div>
                          <div className="font-medium text-gray-900">{contato.assunto}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-muted-foreground">{contato.atendente}</div>
                          {expandedContacts.has(contato.id) ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </button>
                      {expandedContacts.has(contato.id) && (
                        <div className="px-6 pb-6 pt-2 border-t bg-gray-50/50">
                          <div className="grid grid-cols-2 gap-6 mt-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Protocolo Interno</p>
                              <p className="mt-1">{contato.protocolo_interno}</p>
                            </div>
                            {contato.tipo === "Telefone" && (
                              <>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Telefone</p>
                                  <p className="mt-1 flex items-center gap-2">
                                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                    {contato.telefone}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Duração</p>
                                  <p className="mt-1 flex items-center gap-2">
                                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                    {contato.duracao}
                                  </p>
                                </div>
                              </>
                            )}
                            {contato.tipo === "Email" && (
                              <div>
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <p className="mt-1 flex items-center gap-2">
                                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                  {contato.email}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="mt-6">
                            <p className="text-sm font-medium text-gray-500 mb-2">Descrição</p>
                            <div className={`bg-white border rounded-lg p-4 whitespace-pre-wrap text-sm leading-relaxed
                              ${contato.tipo === "Email" ? "font-mono" : ""}`}
                            >
                              {contato.descricao}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum contato registrado para este protocolo.
                </div>
              )}
            </TabsContent>
            {(showAllTabs || activeTab === "queixas") && (
              <TabsContent value="queixas" className="border rounded-md p-4 mt-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Queixas Técnicas</h2>
                  <Button
                    onClick={() => {
                      setTipoRegistro("queixa")
                      setShowNovoRegistroModal(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Queixa Técnica
                  </Button>
                </div>

                {protocolo.queixas && protocolo.queixas.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {protocolo.queixas.map((queixa) => (
                        <TableRow key={queixa.id}>
                          <TableCell>{queixa.id}</TableCell>
                          <TableCell>{queixa.data}</TableCell>
                          <TableCell>{queixa.produto}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                queixa.status === "Concluído"
                                  ? "secondary"
                                  : queixa.status === "Em análise"
                                    ? "outline"
                                    : "secondary"
                              }
                            >
                              {queixa.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/protocolos/detalhes/${queixa.id}?tipo=queixa`}>
                                <FileText className="h-4 w-4 mr-2" />
                                Ver detalhes
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma queixa técnica registrada para este protocolo.
                  </div>
                )}
              </TabsContent>
            )}
            {(showAllTabs || activeTab === "info") && (
              <TabsContent value="info" className="border rounded-md p-4 mt-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Informações Médicas</h2>
                  <Button
                    onClick={() => {
                      setTipoRegistro("info")
                      setShowNovoRegistroModal(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Solicitação
                  </Button>
                </div>

                {protocolo.informacoes && protocolo.informacoes.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {protocolo.informacoes.map((info) => (
                        <TableRow key={info.id}>
                          <TableCell>{info.id}</TableCell>
                          <TableCell>{info.data}</TableCell>
                          <TableCell>{info.produto}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                info.status === "Respondido"
                                  ? "secondary"
                                  : info.status === "Em análise"
                                    ? "outline"
                                    : "secondary"
                              }
                            >
                              {info.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/protocolos/detalhes/${info.id}?tipo=informacao`}>
                                <FileText className="h-4 w-4 mr-2" />
                                Ver detalhes
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma solicitação de informação médica registrada para este protocolo.
                  </div>
                )}
              </TabsContent>
            )}
            {(showAllTabs || activeTab === "farmacovigilancia") && (
              <TabsContent value="farmacovigilancia" className="border rounded-md p-4 mt-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Farmacovigilância</h2>
                  <Button
                    onClick={() => {
                      setTipoRegistro("farmacovigilancia")
                      setShowNovoRegistroModal(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Registro
                  </Button>
                </div>

                {protocolo.farmacovigilancia && protocolo.farmacovigilancia.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {protocolo.farmacovigilancia.map((farmaco) => (
                        <TableRow key={farmaco.id}>
                          <TableCell>{farmaco.id}</TableCell>
                          <TableCell>{farmaco.data}</TableCell>
                          <TableCell>{farmaco.produto}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                farmaco.status === "Concluído"
                                  ? "secondary"
                                  : farmaco.status === "Em análise"
                                    ? "outline"
                                    : "secondary"
                              }
                            >
                              {farmaco.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/protocolos/detalhes/${farmaco.id}?tipo=farmacovigilancia`}>
                                <FileText className="h-4 w-4 mr-2" />
                                Ver detalhes
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum registro de farmacovigilância para este protocolo.
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>

        <NovoRegistroModal
          open={showNovoRegistroModal}
          onOpenChange={setShowNovoRegistroModal}
          tipo={
            tipoRegistro === "queixa"
              ? "queixa"
              : tipoRegistro === "info"
                ? "informacao"
                : tipoRegistro === "farmacovigilancia"
                  ? "farmacovigilancia"
                  : "contato"
          }
          clienteId={cliente.id}
        />
      </div>
    </DashboardLayout>
  )
}

