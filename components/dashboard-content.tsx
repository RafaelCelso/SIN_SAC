"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { CalendarDays, Phone, Mail, FileText, MessageSquare, TrendingUp, AlertTriangle, Clock, Users, Target, BarChart3, PieChart, Activity } from "lucide-react"

export function DashboardContent() {
  const [periodo, setPeriodo] = useState("hoje")
  const [canal, setCanal] = useState("todos")

  // Dados simulados - em produção viriam de uma API
  const dadosIndicadores = {
    operacionais: {
      totalContatos: 1247,
      tma: "4m 32s",
      slaInicial: "2m 15s",
      taxaConcluidos: 87.3,
      pendentes: 156,
      distribuicao: {
        telefone: 45.2,
        email: 28.7,
        formulario: 18.3,
        chat: 7.8
      },
      topMotivos: [
        { motivo: "Queixa Técnica", quantidade: 423, percentual: 33.9 },
        { motivo: "Farmacovigilância", quantidade: 298, percentual: 23.9 },
        { motivo: "Dúvida Produto", quantidade: 234, percentual: 18.8 },
        { motivo: "Elogio", quantidade: 156, percentual: 12.5 },
        { motivo: "Solicitação", quantidade: 136, percentual: 10.9 }
      ],
      reincidencia: 23.4
    },
    qualidade: {
      queixaTecnica: 33.9,
      eventoAdverso: 23.9,
      tempoEncaminhamento: "1h 23m",
      formularios: {
        gestante: { abertos: 12, analise: 8, finalizados: 145 },
        farmacovigilancia: { abertos: 23, analise: 15, finalizados: 298 },
        tecnico: { abertos: 18, analise: 11, finalizados: 423 }
      }
    },
    experiencia: {
      nps: 8.4,
      csat: 92.1,
      tempoResolucao: {
        queixa: "2d 4h",
        duvida: "45m",
        elogio: "15m",
        solicitacao: "1d 8h"
      },
      fcr: 78.5
    },
    gerenciais: {
      topProdutos: [
        { produto: "Vacina XYZ", contatos: 187, percentual: 15.0 },
        { produto: "Medicamento ABC", contatos: 156, percentual: 12.5 },
        { produto: "Suplemento DEF", contatos: 134, percentual: 10.7 },
        { produto: "Produto GHI", contatos: 98, percentual: 7.9 },
        { produto: "Medicamento JKL", contatos: 87, percentual: 7.0 }
      ],
      tendencias: {
        mesAnterior: 1189,
        mesAtual: 1247,
        variacao: 4.9
      },
      backlog: {
        critico: 23,
        alto: 45,
        medio: 67,
        baixo: 21
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critico": return "destructive"
      case "alto": return "destructive"
      case "medio": return "secondary"
      case "baixo": return "default"
      default: return "default"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header com filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard SAC</h1>
          <p className="text-muted-foreground">
            Indicadores operacionais e gerenciais do atendimento farmacêutico
          </p>
        </div>
        
        <div className="flex gap-4">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hoje">Hoje</SelectItem>
              <SelectItem value="semana">Esta Semana</SelectItem>
              <SelectItem value="mes">Este Mês</SelectItem>
              <SelectItem value="trimestre">Este Trimestre</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={canal} onValueChange={setCanal}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Canais</SelectItem>
              <SelectItem value="telefone">Telefone</SelectItem>
              <SelectItem value="email">E-mail</SelectItem>
              <SelectItem value="formulario">Formulário</SelectItem>
              <SelectItem value="chat">Chat</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="operacionais" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="operacionais">
            <Activity className="h-4 w-4 mr-2" />
            Operacionais
          </TabsTrigger>
          <TabsTrigger value="qualidade">
            <Target className="h-4 w-4 mr-2" />
            Qualidade & Risco
          </TabsTrigger>
          <TabsTrigger value="experiencia">
            <Users className="h-4 w-4 mr-2" />
            Experiência
          </TabsTrigger>
          <TabsTrigger value="gerenciais">
            <BarChart3 className="h-4 w-4 mr-2" />
            Gerenciais
          </TabsTrigger>
        </TabsList>

        {/* INDICADORES OPERACIONAIS */}
        <TabsContent value="operacionais" className="space-y-6">
          {/* Cards principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Contatos</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dadosIndicadores.operacionais.totalContatos.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +4.9% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">TMA</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dadosIndicadores.operacionais.tma}</div>
                <p className="text-xs text-muted-foreground">
                  -12% vs. meta de 5min
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">SLA Inicial</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dadosIndicadores.operacionais.slaInicial}</div>
                <p className="text-xs text-muted-foreground">
                  98.7% dentro do SLA
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa Concluídos</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dadosIndicadores.operacionais.taxaConcluidos}%</div>
                <Progress value={dadosIndicadores.operacionais.taxaConcluidos} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Distribuição por canal e Top motivos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Canal</CardTitle>
                <CardDescription>Percentual de contatos por canal de atendimento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>Telefone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={dadosIndicadores.operacionais.distribuicao.telefone} className="w-20" />
                    <span className="text-sm font-medium">{dadosIndicadores.operacionais.distribuicao.telefone}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>E-mail</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={dadosIndicadores.operacionais.distribuicao.email} className="w-20" />
                    <span className="text-sm font-medium">{dadosIndicadores.operacionais.distribuicao.email}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Formulário</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={dadosIndicadores.operacionais.distribuicao.formulario} className="w-20" />
                    <span className="text-sm font-medium">{dadosIndicadores.operacionais.distribuicao.formulario}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Chat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={dadosIndicadores.operacionais.distribuicao.chat} className="w-20" />
                    <span className="text-sm font-medium">{dadosIndicadores.operacionais.distribuicao.chat}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Motivos de Contato</CardTitle>
                <CardDescription>Principais razões para contato</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dadosIndicadores.operacionais.topMotivos.map((motivo, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="text-sm">{motivo.motivo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{motivo.quantidade}</span>
                      <span className="text-xs text-muted-foreground">({motivo.percentual}%)</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Reincidência */}
          <Card>
            <CardHeader>
              <CardTitle>Taxa de Reincidência</CardTitle>
              <CardDescription>Clientes que entraram em contato mais de uma vez pelo mesmo tema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-center mb-4">{dadosIndicadores.operacionais.reincidencia}%</div>
              <Progress value={dadosIndicadores.operacionais.reincidencia} className="mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                Meta: &lt; 25% - Status: <Badge variant="default">Dentro da Meta</Badge>
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* INDICADORES DE QUALIDADE E RISCO */}
        <TabsContent value="qualidade" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Queixas Técnicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{dadosIndicadores.qualidade.queixaTecnica}%</div>
                <p className="text-sm text-muted-foreground">do total de contatos</p>
                <Badge variant="destructive" className="mt-2">Crítico</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Eventos Adversos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{dadosIndicadores.qualidade.eventoAdverso}%</div>
                <p className="text-sm text-muted-foreground">farmacovigilância</p>
                <Badge variant="destructive" className="mt-2">Alto Risco</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Tempo Encaminhamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{dadosIndicadores.qualidade.tempoEncaminhamento}</div>
                <p className="text-sm text-muted-foreground">casos críticos</p>
                <Badge variant="default" className="mt-2">Meta: &lt; 2h</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Status dos formulários */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Formulários Gestante</CardTitle>
                <CardDescription>Status dos atendimentos de gestantes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Abertos</span>
                  <Badge variant="destructive">{dadosIndicadores.qualidade.formularios.gestante.abertos}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Em Análise</span>
                  <Badge variant="secondary">{dadosIndicadores.qualidade.formularios.gestante.analise}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Finalizados</span>
                  <Badge variant="default">{dadosIndicadores.qualidade.formularios.gestante.finalizados}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Farmacovigilância</CardTitle>
                <CardDescription>Status dos eventos adversos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Abertos</span>
                  <Badge variant="destructive">{dadosIndicadores.qualidade.formularios.farmacovigilancia.abertos}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Em Análise</span>
                  <Badge variant="secondary">{dadosIndicadores.qualidade.formularios.farmacovigilancia.analise}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Finalizados</span>
                  <Badge variant="default">{dadosIndicadores.qualidade.formularios.farmacovigilancia.finalizados}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Queixas Técnicas</CardTitle>
                <CardDescription>Status das queixas técnicas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Abertos</span>
                  <Badge variant="destructive">{dadosIndicadores.qualidade.formularios.tecnico.abertos}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Em Análise</span>
                  <Badge variant="secondary">{dadosIndicadores.qualidade.formularios.tecnico.analise}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Finalizados</span>
                  <Badge variant="default">{dadosIndicadores.qualidade.formularios.tecnico.finalizados}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* INDICADORES DE EXPERIÊNCIA DO CLIENTE */}
        <TabsContent value="experiencia" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  NPS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{dadosIndicadores.experiencia.nps}</div>
                <p className="text-sm text-muted-foreground">Net Promoter Score</p>
                <Badge variant="default" className="mt-2">Bom</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  CSAT
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{dadosIndicadores.experiencia.csat}%</div>
                <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                <Badge variant="default" className="mt-2">Excelente</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  FCR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{dadosIndicadores.experiencia.fcr}%</div>
                <p className="text-sm text-muted-foreground">First Call Resolution</p>
                <Badge variant="default" className="mt-2">Meta: 75%</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atendimentos Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{dadosIndicadores.operacionais.pendentes}</div>
                <p className="text-sm text-muted-foreground">requerem atenção</p>
                <Badge variant="secondary" className="mt-2">Ação Necessária</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Tempo de resolução por tipo */}
          <Card>
            <CardHeader>
              <CardTitle>Tempo de Resolução por Tipo</CardTitle>
              <CardDescription>Tempo médio para resolução por categoria de contato</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-semibold text-red-600">{dadosIndicadores.experiencia.tempoResolucao.queixa}</div>
                  <div className="text-sm text-muted-foreground">Queixa Técnica</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-semibold text-blue-600">{dadosIndicadores.experiencia.tempoResolucao.duvida}</div>
                  <div className="text-sm text-muted-foreground">Dúvida</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-semibold text-green-600">{dadosIndicadores.experiencia.tempoResolucao.elogio}</div>
                  <div className="text-sm text-muted-foreground">Elogio</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-semibold text-orange-600">{dadosIndicadores.experiencia.tempoResolucao.solicitacao}</div>
                  <div className="text-sm text-muted-foreground">Solicitação</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* INSIGHTS GERENCIAIS */}
        <TabsContent value="gerenciais" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tendência Mensal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">+{dadosIndicadores.gerenciais.tendencias.variacao}%</div>
                <p className="text-sm text-muted-foreground">
                  {dadosIndicadores.gerenciais.tendencias.mesAtual.toLocaleString()} vs {dadosIndicadores.gerenciais.tendencias.mesAnterior.toLocaleString()}
                </p>
                <Badge variant="default" className="mt-2">Crescimento</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backlog por Prioridade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Crítico</span>
                  <Badge variant="destructive">{dadosIndicadores.gerenciais.backlog.critico}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Alto</span>
                  <Badge variant="destructive">{dadosIndicadores.gerenciais.backlog.alto}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Médio</span>
                  <Badge variant="secondary">{dadosIndicadores.gerenciais.backlog.medio}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Baixo</span>
                  <Badge variant="default">{dadosIndicadores.gerenciais.backlog.baixo}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risco Operacional</CardTitle>
                <CardDescription>Status do backlog crítico</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {dadosIndicadores.gerenciais.backlog.critico + dadosIndicadores.gerenciais.backlog.alto}
                </div>
                <p className="text-sm text-muted-foreground">casos críticos/alto</p>
                <Badge variant="destructive" className="mt-2">Ação Urgente</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Top produtos */}
          <Card>
            <CardHeader>
              <CardTitle>Produtos com Mais Contatos</CardTitle>
              <CardDescription>Produtos/linhas mais associados a contatos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dadosIndicadores.gerenciais.topProdutos.map((produto, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <div className="font-medium">{produto.produto}</div>
                      <div className="text-sm text-muted-foreground">{produto.contatos} contatos</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{produto.percentual}%</div>
                    <Progress value={produto.percentual} className="w-20 mt-1" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}