"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineHeader,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline"
import { ArrowLeft, FileText, Package, AlertTriangle, MessageSquare, Calendar, User } from "lucide-react"

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
        lote: "ABC123",
        tipoQueixa: "Problema na embalagem",
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
        assunto: "Posologia",
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
        reacao: "Náusea",
        gravidade: "Leve",
        historico: [
          { data: "18/03/2023", usuario: "Ana Silva", acao: "Registro", descricao: "Evento registrado" },
          { data: "19/03/2023", usuario: "Dr. Paulo", acao: "Análise", descricao: "Evento analisado" },
          { data: "20/03/2023", usuario: "Ana Silva", acao: "Conclusão", descricao: "Caso concluído" },
        ],
      },
    ],
    contatos: [
      {
        id: "CT-2023-0001",
        data: "15/03/2023 09:45",
        tipo: "Telefone",
        assunto: "Abertura de protocolo",
        atendente: "Ana Silva",
        descricao: "Cliente entrou em contato para relatar problema com a embalagem do medicamento.",
      },
      {
        id: "CT-2023-0002",
        data: "17/03/2023 14:30",
        tipo: "Email",
        assunto: "Envio de informações",
        atendente: "Carlos Mendes",
        descricao: "Enviadas informações adicionais sobre o andamento da análise.",
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
  // Outros clientes...
]

export default function DetalhesRegistroPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const tipoParam = searchParams.get("tipo") || "queixa"

  const [registro, setRegistro] = useState<any>(null)
  const [protocolo, setProtocolo] = useState<any>(null)
  const [cliente, setCliente] = useState<any>(null)

  useEffect(() => {
    // Encontrar o protocolo que contém o registro
    let registroEncontrado = null
    let protocoloEncontrado = null

    for (const p of PROTOCOLOS_MOCK) {
      if (tipoParam === "queixa") {
        registroEncontrado = p.queixas?.find((q: any) => q.id === params.id)
      } else if (tipoParam === "informacao") {
        registroEncontrado = p.informacoes?.find((i: any) => i.id === params.id)
      } else if (tipoParam === "farmacovigilancia") {
        registroEncontrado = p.farmacovigilancia?.find((f: any) => f.id === params.id)
      } else if (tipoParam === "contato") {
        registroEncontrado = p.contatos?.find((c: any) => c.id === params.id)
      }

      if (registroEncontrado) {
        protocoloEncontrado = p
        break
      }
    }

    if (registroEncontrado && protocoloEncontrado) {
      setRegistro(registroEncontrado)
      setProtocolo(protocoloEncontrado)

      // Encontrar o cliente
      const clienteEncontrado = CLIENTES_MOCK.find((c) => c.id === protocoloEncontrado.clienteId)
      if (clienteEncontrado) {
        setCliente(clienteEncontrado)
      }
    }
  }, [params.id, tipoParam])

  if (!registro || !protocolo || !cliente) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold">Registro não encontrado</h2>
            <p className="text-muted-foreground mt-2">O registro solicitado não foi encontrado no sistema.</p>
            <Button className="mt-4" asChild>
              <Link href="/protocolos">Voltar para Protocolos</Link>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Determinar título e ícone com base no tipo
  let titulo = ""
  let icone = null

  if (tipoParam === "queixa") {
    titulo = "Queixa Técnica"
    icone = <Package className="h-5 w-5 text-[#26B99D]" />
  } else if (tipoParam === "informacao") {
    titulo = "Informação Médica"
    icone = <FileText className="h-5 w-5 text-[#26B99D]" />
  } else if (tipoParam === "farmacovigilancia") {
    titulo = "Farmacovigilância"
    icone = <AlertTriangle className="h-5 w-5 text-[#26B99D]" />
  } else if (tipoParam === "contato") {
    titulo = "Histórico de Contato"
    icone = <MessageSquare className="h-5 w-5 text-[#26B99D]" />
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
              <BreadcrumbLink href={`/protocolos/${protocolo.id}`}>Protocolo #{protocolo.id}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {titulo} #{registro.id}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" asChild>
              <Link href={`/protocolos/${protocolo.id}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#E6F7F5] flex items-center justify-center">{icone}</div>
              <h1 className="text-2xl font-bold">
                {titulo} - {registro.id}
              </h1>
            </div>
          </div>
          <Button>Editar Registro</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle>Detalhes do Registro</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Data</p>
                    <p className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      {registro.data}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge
                      variant={
                        registro.status === "Concluído" || registro.status === "Respondido" ? "success" : "secondary"
                      }
                    >
                      {registro.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Produto</p>
                    <p>{registro.produto}</p>
                  </div>

                  {/* Campos específicos para cada tipo de registro */}
                  {tipoParam === "queixa" && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Lote</p>
                        <p>{registro.lote}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tipo de Queixa</p>
                        <p>{registro.tipoQueixa}</p>
                      </div>
                    </>
                  )}

                  {tipoParam === "informacao" && (
                    <div>
                      <p className="text-sm text-gray-500">Assunto</p>
                      <p>{registro.assunto}</p>
                    </div>
                  )}

                  {tipoParam === "farmacovigilancia" && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Reação Adversa</p>
                        <p>{registro.reacao}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Gravidade</p>
                        <Badge variant={registro.gravidade === "Leve" ? "success" : "warning"}>
                          {registro.gravidade}
                        </Badge>
                      </div>
                    </>
                  )}

                  {tipoParam === "contato" && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Tipo de Contato</p>
                        <p>{registro.tipo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Atendente</p>
                        <p>{registro.atendente}</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">Descrição</p>
                  <div className="p-3 border rounded-md bg-gray-50 min-h-[100px]">{registro.descricao}</div>
                </div>

                <div className="mt-6">
                  <h3 className="text-md font-semibold mb-3">Protocolo Relacionado</h3>
                  <div className="p-3 border rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{protocolo.id}</p>
                        <p className="text-sm text-muted-foreground">{protocolo.tipo}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/protocolos/${protocolo.id}`}>Ver protocolo</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-md font-semibold mb-3">Cliente</h3>
                  <div className="p-3 border rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          {cliente.nome}
                        </p>
                        <p className="text-sm text-muted-foreground">{cliente.documento}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/clientes/${cliente.id}`}>Ver cliente</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Linha do tempo do registro */}
          <div>
            <Card>
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle>Linha do Tempo</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {registro.historico && registro.historico.length > 0 ? (
                  <Timeline>
                    {registro.historico.map((item: any, index: number) => (
                      <TimelineItem key={index}>
                        <TimelineSeparator>
                          <TimelineDot
                            color={
                              item.acao === "Registro"
                                ? "blue"
                                : item.acao === "Análise"
                                  ? "amber"
                                  : item.acao === "Resposta"
                                    ? "purple"
                                    : "green"
                            }
                          />
                          {index < registro.historico.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                          <TimelineHeader>
                            <TimelineTitle>{item.acao}</TimelineTitle>
                            <span className="text-xs text-muted-foreground">{item.data}</span>
                          </TimelineHeader>
                          <p className="text-sm">{item.descricao}</p>
                          <p className="text-xs text-muted-foreground">Por: {item.usuario}</p>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    Nenhum histórico disponível para este registro.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

