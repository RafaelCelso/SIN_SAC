"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  BarChart3, 
  Users, 
  HeadphonesIcon, 
  Pill, 
  Package, 
  ClipboardList, 
  DollarSign, 
  FileText, 
  Download, 
  Calendar as CalendarIcon,
  Clock,
  Eye,
  Settings,
  CheckCircle2,
  Plus,
  Minus,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

type ModuleField = {
  id: string
  label: string
  type: "text" | "number" | "date" | "boolean" | "select"
  required?: boolean
  description?: string
}

type ReportModule = {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  fields: ModuleField[]
  estimatedRecords: number
}

type SelectedField = {
  moduleId: string
  fieldId: string
  label: string
}

type ReportTemplate = {
  id: string
  name: string
  description: string
  fields: SelectedField[]
  modules: Record<string, boolean>
  dateFrom?: Date
  dateTo?: Date
  exportFormat: string
  isDefault?: boolean
}

const REPORT_MODULES: Record<string, ReportModule[]> = {
  clientes: [
    {
      id: "clientes",
      name: "Dados de Clientes",
      description: "Informações básicas dos clientes cadastrados",
      icon: <Users className="h-4 w-4" />,
      estimatedRecords: 1247,
      fields: [
        { id: "nome", label: "Nome Completo", type: "text", required: true },
        { id: "documento", label: "CPF/CNPJ", type: "text" },
        { id: "telefone", label: "Telefone", type: "text" },
        { id: "email", label: "E-mail", type: "text" },
        { id: "endereco", label: "Endereço Completo", type: "text" },
        { id: "cidade", label: "Cidade", type: "text" },
        { id: "estado", label: "Estado", type: "text" },
        { id: "cep", label: "CEP", type: "text" },
        { id: "data_cadastro", label: "Data de Cadastro", type: "date" },
        { id: "status", label: "Status", type: "select" }
      ]
    }
  ],
  atendimentos: [
    {
      id: "protocolos",
      name: "Protocolos de Atendimento",
      description: "Histórico completo de protocolos gerados",
      icon: <HeadphonesIcon className="h-4 w-4" />,
      estimatedRecords: 3456,
      fields: [
        { id: "protocolo", label: "Número do Protocolo", type: "text", required: true },
        { id: "cliente_nome", label: "Nome do Cliente", type: "text" },
        { id: "cliente_documento", label: "Documento do Cliente", type: "text" },
        { id: "tipo_atendimento", label: "Tipo de Atendimento", type: "select" },
        { id: "motivo", label: "Motivo do Contato", type: "text" },
        { id: "status", label: "Status", type: "select" },
        { id: "data_abertura", label: "Data de Abertura", type: "date" },
        { id: "data_fechamento", label: "Data de Fechamento", type: "date" },
        { id: "usuario_responsavel", label: "Usuário Responsável", type: "text" },
        { id: "observacoes", label: "Observações", type: "text" }
      ]
    }
  ],
  queixas_tecnicas: [
    {
      id: "queixas_tecnicas",
      name: "Queixas Técnicas",
      description: "Registro de queixas técnicas de produtos",
      icon: <ClipboardList className="h-4 w-4" />,
      estimatedRecords: 234,
      fields: [
        { id: "protocolo", label: "Protocolo", type: "text", required: true },
        { id: "produto_nome", label: "Nome do Produto", type: "text" },
        { id: "produto_lote", label: "Lote", type: "text" },
        { id: "produto_validade", label: "Validade", type: "date" },
        { id: "tipo_problema", label: "Tipo do Problema", type: "select" },
        { id: "descricao_problema", label: "Descrição do Problema", type: "text" },
        { id: "gravidade", label: "Gravidade", type: "select" },
        { id: "status_investigacao", label: "Status da Investigação", type: "select" },
        { id: "data_ocorrencia", label: "Data da Ocorrência", type: "date" },
        { id: "acao_tomada", label: "Ação Tomada", type: "text" }
      ]
    }
  ],
  farmacovigilancia: [
    {
      id: "eventos_adversos",
      name: "Farmacovigilâncias",
      description: "Registro de eventos adversos e reações medicamentosas",
      icon: <Pill className="h-4 w-4" />,
      estimatedRecords: 67,
      fields: [
        { id: "protocolo", label: "Protocolo", type: "text", required: true },
        { id: "produto_nome", label: "Nome do Produto", type: "text" },
        { id: "produto_lote", label: "Lote", type: "text" },
        { id: "evento_descricao", label: "Descrição do Evento", type: "text" },
        { id: "gravidade", label: "Gravidade", type: "select" },
        { id: "desfecho", label: "Desfecho", type: "select" },
        { id: "paciente_idade", label: "Idade do Paciente", type: "number" },
        { id: "paciente_sexo", label: "Sexo do Paciente", type: "select" },
        { id: "data_inicio_evento", label: "Data Início do Evento", type: "date" },
        { id: "notificacao_anvisa", label: "Notificação ANVISA", type: "boolean" },
        { id: "data_notificacao", label: "Data da Notificação", type: "date" }
      ]
    }
  ],
  produtos: [
    {
      id: "produtos",
      name: "Cadastro de Produtos",
      description: "Informações dos produtos cadastrados no sistema",
      icon: <Package className="h-4 w-4" />,
      estimatedRecords: 456,
      fields: [
        { id: "nome", label: "Nome do Produto", type: "text", required: true },
        { id: "codigo", label: "Código do Produto", type: "text" },
        { id: "categoria", label: "Categoria", type: "select" },
        { id: "principio_ativo", label: "Princípio Ativo", type: "text" },
        { id: "concentracao", label: "Concentração", type: "text" },
        { id: "forma_farmaceutica", label: "Forma Farmacêutica", type: "select" },
        { id: "fabricante", label: "Fabricante", type: "text" },
        { id: "registro_anvisa", label: "Registro ANVISA", type: "text" },
        { id: "status", label: "Status", type: "select" },
        { id: "data_cadastro", label: "Data de Cadastro", type: "date" }
      ]
    },
    {
      id: "lotes",
      name: "Controle de Lotes",
      description: "Informações detalhadas sobre lotes dos produtos",
      icon: <Package className="h-4 w-4" />,
      estimatedRecords: 2341,
      fields: [
        { id: "produto_nome", label: "Nome do Produto", type: "text", required: true },
        { id: "lote", label: "Número do Lote", type: "text", required: true },
        { id: "data_fabricacao", label: "Data de Fabricação", type: "date" },
        { id: "data_validade", label: "Data de Validade", type: "date" },
        { id: "quantidade_produzida", label: "Quantidade Produzida", type: "number" },
        { id: "quantidade_disponivel", label: "Quantidade Disponível", type: "number" },
        { id: "status_lote", label: "Status do Lote", type: "select" },
        { id: "local_armazenamento", label: "Local de Armazenamento", type: "text" },
        { id: "temperatura_armazenamento", label: "Temperatura de Armazenamento", type: "text" },
        { id: "observacoes", label: "Observações", type: "text" }
      ]
    }
  ],
  ressarcimento: [
    {
      id: "ressarcimentos",
      name: "Casos de Ressarcimento",
      description: "Registros de ressarcimento aos clientes",
      icon: <DollarSign className="h-4 w-4" />,
      estimatedRecords: 89,
      fields: [
        { id: "protocolo", label: "Protocolo", type: "text", required: true },
        { id: "cliente_nome", label: "Nome do Cliente", type: "text" },
        { id: "produto_nome", label: "Nome do Produto", type: "text" },
        { id: "motivo_ressarcimento", label: "Motivo do Ressarcimento", type: "text" },
        { id: "valor_produto", label: "Valor do Produto", type: "number" },
        { id: "valor_ressarcimento", label: "Valor do Ressarcimento", type: "number" },
        { id: "forma_ressarcimento", label: "Forma de Ressarcimento", type: "select" },
        { id: "status", label: "Status", type: "select" },
        { id: "data_solicitacao", label: "Data da Solicitação", type: "date" },
        { id: "data_aprovacao", label: "Data da Aprovação", type: "date" },
        { id: "data_pagamento", label: "Data do Pagamento", type: "date" }
      ]
    }
  ],
  sistema: [
    {
      id: "usuarios",
      name: "Usuários do Sistema",
      description: "Informações dos usuários cadastrados",
      icon: <Users className="h-4 w-4" />,
      estimatedRecords: 23,
      fields: [
        { id: "nome", label: "Nome Completo", type: "text", required: true },
        { id: "email", label: "E-mail", type: "text" },
        { id: "perfil", label: "Perfil de Acesso", type: "select" },
        { id: "departamento", label: "Departamento", type: "text" },
        { id: "status", label: "Status", type: "select" },
        { id: "ultimo_acesso", label: "Último Acesso", type: "date" },
        { id: "data_cadastro", label: "Data de Cadastro", type: "date" },
        { id: "tentativas_login", label: "Tentativas de Login", type: "number" }
      ]
    },
    {
      id: "audit_trail",
      name: "Trilha de Auditoria",
      description: "Log de ações realizadas no sistema",
      icon: <FileText className="h-4 w-4" />,
      estimatedRecords: 12456,
      fields: [
        { id: "usuario", label: "Usuário", type: "text", required: true },
        { id: "acao", label: "Ação Realizada", type: "text" },
        { id: "modulo", label: "Módulo do Sistema", type: "select" },
        { id: "descricao", label: "Descrição Detalhada", type: "text" },
        { id: "ip_address", label: "Endereço IP", type: "text" },
        { id: "data_hora", label: "Data e Hora", type: "date" },
        { id: "resultado", label: "Resultado da Ação", type: "select" }
      ]
    }
  ]
}

const TAB_CONFIG = [
  { id: "clientes", label: "Clientes", icon: <Users className="h-4 w-4" /> },
  { id: "atendimentos", label: "Atendimentos", icon: <HeadphonesIcon className="h-4 w-4" /> },
  { id: "queixas_tecnicas", label: "Queixas Técnicas", icon: <ClipboardList className="h-4 w-4" /> },
  { id: "farmacovigilancia", label: "Farmacovigilância", icon: <Pill className="h-4 w-4" /> },
  { id: "produtos", label: "Produtos", icon: <Package className="h-4 w-4" /> },
  { id: "ressarcimento", label: "Ressarcimento", icon: <DollarSign className="h-4 w-4" /> },
  { id: "sistema", label: "Sistema", icon: <Settings className="h-4 w-4" /> }
]

const DEFAULT_TEMPLATES: ReportTemplate[] = [
  {
    id: "template-clientes-completo",
    name: "Clientes - Relatório Completo",
    description: "Todos os dados de clientes cadastrados no sistema",
    isDefault: true,
    fields: [
      { moduleId: "clientes", fieldId: "nome", label: "Nome Completo" },
      { moduleId: "clientes", fieldId: "documento", label: "CPF/CNPJ" },
      { moduleId: "clientes", fieldId: "telefone", label: "Telefone" },
      { moduleId: "clientes", fieldId: "email", label: "E-mail" },
      { moduleId: "clientes", fieldId: "endereco", label: "Endereço Completo" },
      { moduleId: "clientes", fieldId: "cidade", label: "Cidade" },
      { moduleId: "clientes", fieldId: "estado", label: "Estado" },
      { moduleId: "clientes", fieldId: "data_cadastro", label: "Data de Cadastro" },
      { moduleId: "clientes", fieldId: "status", label: "Status" }
    ],
    modules: { "clientes": true },
    exportFormat: "excel"
  },
  {
    id: "template-protocolos-resumo",
    name: "Protocolos - Resumo Executivo",
    description: "Informações essenciais dos protocolos de atendimento",
    isDefault: true,
    fields: [
      { moduleId: "protocolos", fieldId: "protocolo", label: "Número do Protocolo" },
      { moduleId: "protocolos", fieldId: "cliente_nome", label: "Nome do Cliente" },
      { moduleId: "protocolos", fieldId: "tipo_atendimento", label: "Tipo de Atendimento" },
      { moduleId: "protocolos", fieldId: "status", label: "Status" },
      { moduleId: "protocolos", fieldId: "data_abertura", label: "Data de Abertura" },
      { moduleId: "protocolos", fieldId: "usuario_responsavel", label: "Usuário Responsável" }
    ],
    modules: { "protocolos": true },
    exportFormat: "excel"
  },
  {
    id: "template-queixas-completo",
    name: "Queixas Técnicas - Detalhado",
    description: "Relatório completo de queixas técnicas para análise",
    isDefault: true,
    fields: [
      { moduleId: "queixas_tecnicas", fieldId: "protocolo", label: "Protocolo" },
      { moduleId: "queixas_tecnicas", fieldId: "produto_nome", label: "Nome do Produto" },
      { moduleId: "queixas_tecnicas", fieldId: "produto_lote", label: "Lote" },
      { moduleId: "queixas_tecnicas", fieldId: "tipo_problema", label: "Tipo do Problema" },
      { moduleId: "queixas_tecnicas", fieldId: "gravidade", label: "Gravidade" },
      { moduleId: "queixas_tecnicas", fieldId: "status_investigacao", label: "Status da Investigação" },
      { moduleId: "queixas_tecnicas", fieldId: "data_ocorrencia", label: "Data da Ocorrência" },
      { moduleId: "queixas_tecnicas", fieldId: "acao_tomada", label: "Ação Tomada" }
    ],
    modules: { "queixas_tecnicas": true },
    exportFormat: "excel"
  },
  {
    id: "template-farmacovigilancia-anvisa",
    name: "Farmacovigilância - Notificação ANVISA",
    description: "Campos necessários para notificação à ANVISA",
    isDefault: true,
    fields: [
      { moduleId: "eventos_adversos", fieldId: "protocolo", label: "Protocolo" },
      { moduleId: "eventos_adversos", fieldId: "produto_nome", label: "Nome do Produto" },
      { moduleId: "eventos_adversos", fieldId: "produto_lote", label: "Lote" },
      { moduleId: "eventos_adversos", fieldId: "evento_descricao", label: "Descrição do Evento" },
      { moduleId: "eventos_adversos", fieldId: "gravidade", label: "Gravidade" },
      { moduleId: "eventos_adversos", fieldId: "desfecho", label: "Desfecho" },
      { moduleId: "eventos_adversos", fieldId: "paciente_idade", label: "Idade do Paciente" },
      { moduleId: "eventos_adversos", fieldId: "paciente_sexo", label: "Sexo do Paciente" },
      { moduleId: "eventos_adversos", fieldId: "data_inicio_evento", label: "Data Início do Evento" },
      { moduleId: "eventos_adversos", fieldId: "notificacao_anvisa", label: "Notificação ANVISA" }
    ],
    modules: { "eventos_adversos": true },
    exportFormat: "excel"
  },
  {
    id: "template-produtos-lotes",
    name: "Produtos e Lotes - Controle de Estoque",
    description: "Informações de produtos e controle de lotes",
    isDefault: true,
    fields: [
      { moduleId: "produtos", fieldId: "nome", label: "Nome do Produto" },
      { moduleId: "produtos", fieldId: "codigo", label: "Código do Produto" },
      { moduleId: "produtos", fieldId: "categoria", label: "Categoria" },
      { moduleId: "produtos", fieldId: "status", label: "Status" },
      { moduleId: "lotes", fieldId: "lote", label: "Número do Lote" },
      { moduleId: "lotes", fieldId: "data_fabricacao", label: "Data de Fabricação" },
      { moduleId: "lotes", fieldId: "data_validade", label: "Data de Validade" },
      { moduleId: "lotes", fieldId: "quantidade_disponivel", label: "Quantidade Disponível" },
      { moduleId: "lotes", fieldId: "status_lote", label: "Status do Lote" }
    ],
    modules: { "produtos": true, "lotes": true },
    exportFormat: "excel"
  }
]

export default function RelatoriosPage() {
  const [selectedFields, setSelectedFields] = useState<SelectedField[]>([])
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [exportFormat, setExportFormat] = useState<string>("excel")
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedTemplates, setSavedTemplates] = useState<ReportTemplate[]>([])
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false)
  const [templateName, setTemplateName] = useState<string>("")
  const [templateDescription, setTemplateDescription] = useState<string>("")
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({})

  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }))
  }

  const handleFieldToggle = (moduleId: string, fieldId: string, fieldLabel: string, checked: boolean) => {
    if (checked) {
      setSelectedFields(prev => [...prev, { moduleId, fieldId, label: fieldLabel }])
    } else {
      setSelectedFields(prev => 
        prev.filter(field => !(field.moduleId === moduleId && field.fieldId === fieldId))
      )
    }
  }

  const removeSelectedField = (moduleId: string, fieldId: string) => {
    setSelectedFields(prev => 
      prev.filter(field => !(field.moduleId === moduleId && field.fieldId === fieldId))
    )
  }

  const isFieldSelected = (moduleId: string, fieldId: string) => {
    return selectedFields.some(field => field.moduleId === moduleId && field.fieldId === fieldId)
  }

  const handleSelectAllFields = (moduleId: string, module: ReportModule) => {
    const moduleFields = module.fields.map(field => ({
      moduleId,
      fieldId: field.id,
      label: field.label
    }))
    
    setSelectedFields(prev => [
      ...prev.filter(field => field.moduleId !== moduleId),
      ...moduleFields
    ])
  }

  const handleDeselectAllFields = (moduleId: string) => {
    setSelectedFields(prev => prev.filter(field => field.moduleId !== moduleId))
  }

  const getSelectedFieldsCount = (moduleId: string) => {
    return selectedFields.filter(field => field.moduleId === moduleId).length
  }

  const getTotalEstimatedRecords = () => {
    let total = 0
    const moduleIds = [...new Set(selectedFields.map(field => field.moduleId))]
    
    Object.entries(REPORT_MODULES).forEach(([category, modules]) => {
      modules.forEach(module => {
        if (moduleIds.includes(module.id)) {
          total += module.estimatedRecords
        }
      })
    })
    return total
  }

  const handleGenerateReport = async () => {
    if (selectedFields.length === 0) {
      alert("Selecione pelo menos um campo para gerar o relatório")
      return
    }

    setIsGenerating(true)
    
    // Simular geração do relatório
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    console.log("Gerando relatório personalizado:", {
      selectedFields,
      dateFrom,
      dateTo,
      format: exportFormat,
      estimatedRecords: getTotalEstimatedRecords()
    })
    
    setIsGenerating(false)
  }

  const loadTemplate = (template: ReportTemplate) => {
    setSelectedFields(template.fields)
    setDateFrom(template.dateFrom)
    setDateTo(template.dateTo)
    setExportFormat(template.exportFormat)
  }

  const saveTemplate = () => {
    if (!templateName.trim()) {
      alert("Digite um nome para o template")
      return
    }

    if (selectedFields.length === 0) {
      alert("Selecione pelo menos um campo para salvar o template")
      return
    }

    const modules = selectedFields.reduce((acc, field) => {
      acc[field.moduleId] = true
      return acc
    }, {} as Record<string, boolean>)

    const newTemplate: ReportTemplate = {
      id: `template-${Date.now()}`,
      name: templateName,
      description: templateDescription || `Template personalizado criado em ${format(new Date(), "dd/MM/yyyy", { locale: ptBR })}`,
      fields: [...selectedFields],
      modules,
      dateFrom,
      dateTo,
      exportFormat,
      isDefault: false
    }

    setSavedTemplates(prev => [...prev, newTemplate])
    setTemplateName("")
    setTemplateDescription("")
    setShowSaveTemplateModal(false)
    
    // Simular salvamento no localStorage ou backend
    console.log("Template salvo:", newTemplate)
  }

  const deleteTemplate = (templateId: string) => {
    setSavedTemplates(prev => prev.filter(t => t.id !== templateId))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600">
              Extraia relatórios usando modelos pré-definidos ou crie relatórios personalizados
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Modelos de Relatório */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Modelos de Relatório
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="modelos-padrao" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 max-w-2xl mb-6">
                    <TabsTrigger value="modelos-padrao" className="text-sm font-medium">Modelos Padrão</TabsTrigger>
                    <TabsTrigger value="relatorios-personalizados" className="text-sm font-medium">Relatórios Personalizados</TabsTrigger>
                    <TabsTrigger value="meus-relatorios" className="text-sm font-medium">Meus Relatórios</TabsTrigger>
                  </TabsList>

                  {/* Aba Modelos Padrão */}
                  <TabsContent value="modelos-padrao" className="space-y-6">
                    {/* Filtros de Data */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Data Inicial */}
                      <div className="space-y-2">
                        <Label>Data Inicial</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !dateFrom && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start" side="bottom">
                            <Calendar
                              mode="single"
                              selected={dateFrom}
                              onSelect={setDateFrom}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Data Final */}
                      <div className="space-y-2">
                        <Label>Data Final</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !dateTo && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start" side="bottom">
                            <Calendar
                              mode="single"
                              selected={dateTo}
                              onSelect={setDateTo}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Botão Limpar Seleção */}
                      <div className="space-y-2">
                        <div className="h-6 flex items-end"></div>
                        <Button
                          variant="outline"
                          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            setSelectedFields([])
                            setExpandedModules({})
                          }}
                          disabled={selectedFields.length === 0}
                        >
                          <Minus className="mr-2 h-4 w-4" />
                          Limpar Seleção
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {DEFAULT_TEMPLATES.map((template) => (
                        <Card key={template.id} className="border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{template.name}</h4>
                                <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                              </div>
                              <Badge variant="secondary" className="text-xs ml-2">
                                {template.fields.length} campos
                              </Badge>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-2"
                              onClick={() => loadTemplate(template)}
                            >
                              Carregar Modelo
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Aba Relatórios Personalizados */}
                  <TabsContent value="relatorios-personalizados" className="space-y-6">
                    {/* Filtros de Data e Formato */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Data Inicial */}
                      <div className="space-y-2">
                        <Label>Data Inicial</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !dateFrom && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start" side="bottom">
                            <Calendar
                              mode="single"
                              selected={dateFrom}
                              onSelect={setDateFrom}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Data Final */}
                      <div className="space-y-2">
                        <Label>Data Final</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !dateTo && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start" side="bottom">
                            <Calendar
                              mode="single"
                              selected={dateTo}
                              onSelect={setDateTo}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Botão Limpar Seleção */}
                      <div className="space-y-2">
                        <div className="h-6 flex items-end"></div>
                        <Button
                          variant="outline"
                          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            setSelectedFields([])
                            setExpandedModules({})
                          }}
                          disabled={selectedFields.length === 0}
                        >
                          <Minus className="mr-2 h-4 w-4" />
                          Limpar Seleção
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Abas por Categoria */}
                    <Tabs defaultValue="clientes" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 text-xs">
                        {TAB_CONFIG.map((tab) => (
                          <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className="flex items-center gap-1 px-2 py-1"
                          >
                            <span className="flex items-center justify-center">{tab.icon}</span>
                            <span className="hidden lg:inline text-xs">{tab.label}</span>
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {Object.entries(REPORT_MODULES).map(([category, modules]) => (
                        <TabsContent key={category} value={category} className="space-y-4">
                          {modules.map((module) => (
                            <Card key={module.id} className="border-l-4 border-l-blue-500">
                              <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleModuleExpansion(module.id)}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                      {expandedModules[module.id] ? (
                                        <ChevronDown className="h-4 w-4 text-gray-500" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4 text-gray-500" />
                                      )}
                                      {module.icon}
                                      <div>
                                        <CardTitle className="text-base">{module.name}</CardTitle>
                                        <p className="text-sm text-gray-600">{module.description}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-medium">
                                      {getSelectedFieldsCount(module.id)} / {module.fields.length} campos
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      ~{module.estimatedRecords.toLocaleString()} registros
                                    </div>
                                  </div>
                                </div>
                              </CardHeader>
                              
                              {expandedModules[module.id] && (
                                <CardContent className="pt-0">
                                  <div className="flex items-center gap-2 mb-3">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleSelectAllFields(module.id, module)
                                      }}
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Selecionar Todos
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeselectAllFields(module.id)
                                      }}
                                    >
                                      <Minus className="h-3 w-3 mr-1" />
                                      Desmarcar Todos
                                    </Button>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                                    {module.fields.map((field) => (
                                      <div
                                        key={field.id}
                                        className="flex items-center space-x-2 p-2 rounded border hover:bg-gray-50"
                                      >
                                        <Checkbox
                                          id={`field-${module.id}-${field.id}`}
                                          checked={isFieldSelected(module.id, field.id)}
                                          onCheckedChange={(checked) =>
                                            handleFieldToggle(module.id, field.id, field.label, checked as boolean)
                                          }
                                        />
                                        <label
                                          htmlFor={`field-${module.id}-${field.id}`}
                                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                                        >
                                          {field.label}
                                          {field.required && (
                                            <span className="text-red-500 ml-1">*</span>
                                          )}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              )}
                            </Card>
                          ))}
                        </TabsContent>
                      ))}
                    </Tabs>
                  </TabsContent>

                  {/* Aba Meus Relatórios */}
                  <TabsContent value="meus-relatorios" className="space-y-6">
                    {/* Filtros de Data e Formato */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Data Inicial */}
                      <div className="space-y-2">
                        <Label>Data Inicial</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !dateFrom && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start" side="bottom">
                            <Calendar
                              mode="single"
                              selected={dateFrom}
                              onSelect={setDateFrom}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Data Final */}
                      <div className="space-y-2">
                        <Label>Data Final</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !dateTo && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start" side="bottom">
                            <Calendar
                              mode="single"
                              selected={dateTo}
                              onSelect={setDateTo}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Botão Limpar Seleção */}
                      <div className="space-y-2">
                        <div className="h-6 flex items-end"></div>
                        <Button
                          variant="outline"
                          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            setSelectedFields([])
                            setExpandedModules({})
                          }}
                          disabled={selectedFields.length === 0}
                        >
                          <Minus className="mr-2 h-4 w-4" />
                          Limpar Seleção
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-end mb-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSaveTemplateModal(true)}
                        disabled={selectedFields.length === 0}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Salvar Template
                      </Button>
                    </div>

                    {savedTemplates.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 text-sm">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <h3 className="font-medium mb-1">Nenhum relatório personalizado</h3>
                        <p className="text-xs">Configure um relatório e clique em "Salvar Template" para começar</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {savedTemplates.map((template) => (
                          <Card key={template.id} className="border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">{template.name}</h4>
                                  <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Badge variant="outline" className="text-xs">
                                    {template.fields.length} campos
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      deleteTemplate(template.id)
                                    }}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-2"
                                onClick={() => loadTemplate(template)}
                              >
                                Carregar Template
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Resumo e Configurações */}
          <div className="flex flex-col">
                        {/* Resumo da Seleção */}
            <Card className="border-2 shadow-lg flex flex-col h-full" style={{ borderColor: '#27B99E' }}>
              <CardHeader className="bg-gradient-to-r to-gray-50 border-b" style={{ 
                backgroundImage: 'linear-gradient(to right, #27B99E10, rgb(249 250 251))',
                borderBottomColor: '#27B99E30'
              }}>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#27B99E20' }}>
                    <Eye className="h-5 w-5" style={{ color: '#27B99E' }} />
                  </div>
                  <div>
                    <div className="text-lg font-bold">Resumo da Seleção</div>
                    <div className="text-xs font-normal text-gray-600 mt-1">
                      Configure seu relatório personalizado
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex flex-col flex-1 min-h-0">

                {/* Seção de campos selecionados - expansível */}
                <div className="flex-1 min-h-0 mb-4">
                  {selectedFields.length > 0 ? (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#27B99E' }}></div>
                        <Label className="text-sm font-semibold text-gray-800">
                          CAMPOS SELECIONADOS
                        </Label>
                        <Badge className="hover:opacity-80" style={{ 
                          backgroundColor: '#27B99E20', 
                          color: '#27B99E',
                          borderColor: '#27B99E40'
                        }}>
                          {selectedFields.length}
                        </Badge>
                      </div>
                      <ScrollArea 
                        className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg border min-h-0" 
                        style={{ maxHeight: selectedFields.length > 7 ? '280px' : 'none' }}
                      >
                        <div className="space-y-1 p-2">
                          {selectedFields.map((field, index) => {
                            // Mapear categoria baseada no moduleId
                            const getCategoryInfo = (moduleId: string) => {
                              const categoryMap: Record<string, { label: string; color: string; bgColor: string }> = {
                                'clientes': { label: 'Cliente', color: '#3B82F6', bgColor: '#EFF6FF' },
                                'protocolos': { label: 'Atendimento', color: '#8B5CF6', bgColor: '#F3E8FF' },
                                'queixas_tecnicas': { label: 'Queixa Técnica', color: '#F59E0B', bgColor: '#FEF3C7' },
                                'eventos_adversos': { label: 'Farmacovigilância', color: '#EF4444', bgColor: '#FEE2E2' },
                                'produtos': { label: 'Produto', color: '#10B981', bgColor: '#D1FAE5' },
                                'lotes': { label: 'Lote', color: '#059669', bgColor: '#ECFDF5' },
                                'ressarcimentos': { label: 'Ressarcimento', color: '#F97316', bgColor: '#FFF7ED' },
                                'usuarios': { label: 'Usuário', color: '#6366F1', bgColor: '#EEF2FF' },
                                'audit_trail': { label: 'Auditoria', color: '#64748B', bgColor: '#F8FAFC' }
                              }
                              return categoryMap[moduleId] || { label: 'Sistema', color: '#64748B', bgColor: '#F8FAFC' }
                            }
                            
                            const categoryInfo = getCategoryInfo(field.moduleId)
                            
                            return (
                              <div key={index} className="text-xs p-2 bg-white rounded shadow-sm hover:shadow-md transition-shadow" style={{ borderLeft: `4px solid #27B99E` }}>
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-medium text-gray-700 flex-1">{field.label}</span>
                                  <div className="flex items-center gap-1">
                                    <div 
                                      className="px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                                      style={{ 
                                        color: categoryInfo.color,
                                        backgroundColor: categoryInfo.bgColor,
                                        border: `1px solid ${categoryInfo.color}20`
                                      }}
                                    >
                                      {categoryInfo.label}
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-5 w-5 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => removeSelectedField(field.moduleId, field.fieldId)}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </ScrollArea>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center py-8 text-gray-400">
                        <Eye className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm font-medium">Nenhum campo selecionado</p>
                        <p className="text-xs mt-1">Selecione campos para visualizar aqui</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-auto space-y-4">
                  <div className="h-px w-full" style={{ background: `linear-gradient(to right, #27B99E20, #27B99E40, #27B99E20)` }}></div>

                  {/* Formato de Exportação */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-800">Formato de Exportação</Label>
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                        <SelectItem value="csv">CSV (.csv)</SelectItem>
                        <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                                    {/* Botão de Gerar Relatório */}
                  <div>
                    <Button
                      onClick={handleGenerateReport}
                      disabled={selectedFields.length === 0 || isGenerating}
                      className="w-full text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 hover:opacity-90"
                      style={{ 
                        background: `linear-gradient(to right, #27B99E, #1F9A85)`
                      }}
                      size="lg"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      {isGenerating ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Gerando Relatório...
                        </div>
                      ) : (
                        "Baixar Relatório"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>
        </div>



        {/* Modal para Salvar Template */}
        {showSaveTemplateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Salvar Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome do Template</Label>
                  <Input
                    placeholder="Digite um nome para o template"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição (opcional)</Label>
                  <Input
                    placeholder="Descreva o propósito deste template"
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  <p>Campos selecionados: <strong>{selectedFields.length}</strong></p>
                  <p>Este template salvará sua configuração atual</p>
                </div>
              </CardContent>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowSaveTemplateModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={saveTemplate}
                    disabled={!templateName.trim()}
                  >
                    Salvar Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 