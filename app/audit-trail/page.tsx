"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, SearchIcon, FilterXIcon, DownloadIcon, EyeIcon, ChevronDown, LogIn, LogOut, Plus, Edit, Trash2, FileText, User, Package, Building2, Calendar } from "lucide-react"
import { DatePicker } from "@/components/date-picker"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AuditDetailsModal } from "@/components/audit-details-modal"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"

interface AuditRecord {
  id: string
  dateTime: string
  user: string
  action: string
  details: string
  status: string
}

interface AuditRecord {
  id: string
  dateTime: string
  user: string
  action: string
  category: string
  details: string
  status: string
  userIp?: string
  userAgent?: string
  beforeData?: any
  afterData?: any
}

// Dados de exemplo para o audit trail
const mockAuditData: AuditRecord[] = [
  {
    id: "001",
    dateTime: "2024-01-15T08:30:25",
    user: "João Silva",
    action: "Login",
    category: "Home",
    details: "Usuário fez login no sistema",
    status: "SUCCESS",
    userIp: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    beforeData: null,
    afterData: {
      "Usuário": "João Silva",
      "Horário": "08:30:25",
      "IP": "192.168.1.100"
    }
  },
  {
    id: "002",
    dateTime: "2024-01-15T09:15:12",
    user: "Maria Santos",
    action: "Criação",
    category: "Protocolo",
    details: "Novo protocolo criado",
    status: "SUCCESS",
    userIp: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    beforeData: null,
    afterData: {
      "ID": "12345",
      "Cliente": "Cliente ABC Ltda",
      "Tipo": "Reclamação",
      "Status": "Aberto",
      "Data Abertura": "15/01/2024"
    }
  },
  {
    id: "003",
    dateTime: "2024-01-15T10:45:08",
    user: "Pedro Costa",
    action: "Atualização",
    category: "Protocolo",
    details: "Status do protocolo alterado",
    status: "SUCCESS",
    userIp: "192.168.1.102",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    beforeData: {
      "Status": "Aberto",
      "Responsável": "João Silva",
      "Prioridade": "Média"
    },
    afterData: {
      "Status": "Em Andamento",
      "Responsável": "Pedro Costa",
      "Prioridade": "Alta"
    }
  },
  {
    id: "004",
    dateTime: "2024-01-15T11:20:33",
    user: "Ana Oliveira",
    action: "Exclusão",
    category: "Protocolo",
    details: "Protocolo removido do sistema",
    status: "SUCCESS",
    userIp: "192.168.1.103",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    beforeData: {
      "ID": "12346",
      "Cliente": "Cliente XYZ Ltda",
      "Tipo": "Sugestão",
      "Status": "Fechado",
      "Data Fechamento": "14/01/2024"
    },
    afterData: null
  },
    {
      id: "005",
      dateTime: "2024-01-15T12:10:17",
      user: "Carlos Ferreira",
      action: "Criação",
      category: "Clientes",
      details: "Novo cliente cadastrado",
      status: "SUCCESS",
      userIp: "192.168.1.104",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
      beforeData: null,
      afterData: {
        "ID": "CLI001",
        "Nome": "Cliente DEF Ltda",
        "Email": "contato@def.com",
        "Telefone": "(11) 1234-5678",
        "Status": "Ativo"
      }
    },
    {
      id: "006",
      dateTime: "2024-01-15T13:25:45",
      user: "João Silva",
      action: "Atualização",
      category: "Clientes",
      details: "Dados do cliente atualizados",
      status: "SUCCESS",
      userIp: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      beforeData: {
        "Nome": "Cliente ABC Ltda",
        "Email": "contato@abc.com",
        "Telefone": "(11) 1234-5678",
        "Endereço": "Rua A, 123"
      },
      afterData: {
        "Nome": "Cliente ABC Ltda",
        "Email": "novo@abc.com",
        "Telefone": "(11) 9876-5432",
        "Endereço": "Rua B, 456"
      }
    },
    {
      id: "007",
      dateTime: "2024-01-15T14:15:22",
      user: "Maria Santos",
      action: "Exclusão",
      category: "Clientes",
      details: "Cliente removido do sistema",
      status: "SUCCESS",
      userIp: "192.168.1.101",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      beforeData: {
        "ID": "CLI002",
        "Nome": "Cliente GHI Ltda",
        "Status": "Inativo",
        "Data Cadastro": "10/01/2024"
      },
      afterData: null
    },
    {
      id: "008",
      dateTime: "2024-01-15T15:30:11",
      user: "Pedro Costa",
      action: "Criação",
    category: "Produto",
    details: "Novo produto cadastrado",
      status: "SUCCESS",
      userIp: "192.168.1.102",
      userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
      beforeData: null,
      afterData: {
        "ID": "PROD001",
        "Nome": "Produto Alpha",
        "Categoria": "Medicamentos",
        "Preço": "R$ 25,90",
        "Status": "Ativo"
      }
    },
    {
      id: "009",
      dateTime: "2024-01-15T16:45:33",
      user: "Ana Oliveira",
      action: "Atualização",
    category: "Produto",
    details: "Preço do produto alterado",
      status: "SUCCESS",
      userIp: "192.168.1.103",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      beforeData: {
        "Preço": "R$ 25,90",
        "Desconto": "0%",
        "Promoção": "Não"
      },
      afterData: {
        "Preço": "R$ 23,90",
        "Desconto": "10%",
        "Promoção": "Sim"
      }
    },
    {
      id: "010",
      dateTime: "2024-01-15T17:20:55",
      user: "Carlos Ferreira",
      action: "Exclusão",
    category: "Produto",
    details: "Produto descontinuado",
      status: "SUCCESS",
      userIp: "192.168.1.104",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
      beforeData: {
        "ID": "PROD002",
        "Nome": "Produto Beta",
        "Status": "Descontinuado",
        "Estoque": "0"
      },
      afterData: null
    },
    {
      id: "011",
      dateTime: "2024-01-15T18:10:44",
      user: "João Silva",
      action: "Exportação",
      category: "Relatórios",
      details: "Relatório de auditoria exportado",
      status: "SUCCESS",
      userIp: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      beforeData: null,
      afterData: {
        "Tipo": "Relatório de Auditoria",
        "Período": "01/01/2024 - 15/01/2024",
        "Formato": "PDF",
        "Registros": "150"
      }
    },
    {
      id: "012",
      dateTime: "2024-01-15T18:55:12",
      user: "Maria Santos",
      action: "Logout",
      category: "Home",
      details: "Usuário fez logout do sistema",
      status: "SUCCESS",
      userIp: "192.168.1.101",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      beforeData: {
        "Usuário": "Maria Santos",
        "Sessão": "4h 25min",
        "Última Atividade": "18:50:12"
      },
      afterData: null
    },
    {
      id: "013",
      dateTime: "2024-01-16T09:15:30",
      user: "Pedro Costa",
      action: "Criação",
      category: "Dashboard",
      details: "Novo widget adicionado ao dashboard",
      status: "SUCCESS",
      userIp: "192.168.1.102",
      userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
      beforeData: null,
      afterData: {
        "Widget": "Gráfico de Vendas",
        "Posição": "Superior Direita",
        "Tipo": "Gráfico de Barras"
      }
    },
    {
      id: "014",
      dateTime: "2024-01-16T10:30:45",
      user: "Ana Oliveira",
      action: "Atualização",
      category: "Agenda",
      details: "Evento da agenda modificado",
      status: "SUCCESS",
      userIp: "192.168.1.103",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      beforeData: {
        "Título": "Reunião Semanal",
        "Data": "16/01/2024",
        "Horário": "14:00"
      },
      afterData: {
        "Título": "Reunião Semanal - Equipe",
        "Data": "16/01/2024",
        "Horário": "15:00"
      }
    },
    {
      id: "015",
      dateTime: "2024-01-16T11:45:20",
      user: "Carlos Ferreira",
      action: "Criação",
      category: "FAQ",
      details: "Nova pergunta frequente adicionada",
      status: "SUCCESS",
      userIp: "192.168.1.104",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
      beforeData: null,
      afterData: {
        "Pergunta": "Como resetar minha senha?",
        "Categoria": "Acesso",
        "Status": "Ativo"
      }
    },
    {
      id: "016",
      dateTime: "2024-01-16T13:20:15",
      user: "João Silva",
      action: "Atualização",
    category: "Permissões",
    details: "Permissões de usuário alteradas",
      status: "SUCCESS",
      userIp: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      beforeData: {
        "Usuário": "Maria Santos",
        "Perfil": "Operador",
        "Permissões": "Leitura"
      },
      afterData: {
        "Usuário": "Maria Santos",
        "Perfil": "Supervisor",
        "Permissões": "Leitura/Escrita"
      }
    }
  ]

const actionTypes = [
  "Atualização",
  "Criação",
  "Exclusão",
  "Exportação",
  "Login",
  "Logout"
]

const categoryTypes = [
  "Agenda",
  "Audit Trail",
  "Clientes",
  "Dashboard",
  "Evento Adverso",
  "FAQ",
  "Farmacovigilância",
  "Formulários",
  "Home",
  "Motivo",
  "Parametrização",
  "Permissões",
  "Produto",
  "Protocolo",
  "Queixa Técnica",
  "Relatórios",
  "Ressarcimento",
  "Usuários",
  "Via Administração"
]

const users = [
  "Ana Oliveira",
  "Carlos Ferreira",
  "João Silva",
  "Maria Santos",
  "Pedro Costa"
]



function getActionBadgeVariant(action: string) {
  // Todas as badges de ação usam o mesmo estilo outline
  return "outline"
}

function getActionIcon(action: string) {
  switch (action) {
    case "Login":
      return <LogIn className="h-3 w-3 mr-1" />
    case "Logout":
      return <LogOut className="h-3 w-3 mr-1" />
    case "Criação":
      return <Plus className="h-3 w-3 mr-1" />
    case "Atualização":
      return <Edit className="h-3 w-3 mr-1" />
    case "Exclusão":
      return <Trash2 className="h-3 w-3 mr-1" />
    case "Exportação":
      return <FileText className="h-3 w-3 mr-1" />
    default:
      return <FileText className="h-3 w-3 mr-1" />
  }
}

function getCategoryBadgeVariant(category: string) {
  // Todas as badges de categoria usam o mesmo estilo outline
  return "outline"
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "Home":
      return <Building2 className="h-3 w-3 mr-1" />
    case "Dashboard":
      return <Building2 className="h-3 w-3 mr-1" />
    case "Clientes":
      return <User className="h-3 w-3 mr-1" />
    case "Agenda":
       return <Calendar className="h-3 w-3 mr-1" />
    case "FAQ":
      return <FileText className="h-3 w-3 mr-1" />
    case "Relatórios":
      return <FileText className="h-3 w-3 mr-1" />
    case "Protocolo":
      return <FileText className="h-3 w-3 mr-1" />
    case "Queixa Técnica":
      return <FileText className="h-3 w-3 mr-1" />
    case "Farmacovigilância":
      return <Package className="h-3 w-3 mr-1" />
    case "Ressarcimento":
      return <FileText className="h-3 w-3 mr-1" />
    case "Produto":
      return <Package className="h-3 w-3 mr-1" />
    case "Motivo":
      return <FileText className="h-3 w-3 mr-1" />
    case "Evento Adverso":
      return <FileText className="h-3 w-3 mr-1" />
    case "Via Administração":
      return <FileText className="h-3 w-3 mr-1" />
    case "Formulários":
      return <FileText className="h-3 w-3 mr-1" />
    case "Parametrização":
      return <Building2 className="h-3 w-3 mr-1" />
    case "Audit Trail":
      return <FileText className="h-3 w-3 mr-1" />
    case "Usuários":
      return <User className="h-3 w-3 mr-1" />
    case "Permissões":
      return <Building2 className="h-3 w-3 mr-1" />
    default:
      return <FileText className="h-3 w-3 mr-1" />
  }
}



// Componente MultiSelect customizado
const MultiSelect = ({ 
  placeholder, 
  options, 
  selected, 
  onSelectionChange 
}: {
  placeholder: string
  options: string[]
  selected: string[]
  onSelectionChange: (items: string[]) => void
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between text-left font-normal">
          <span className="truncate">
            {selected.length === 0 
              ? placeholder 
              : selected.length === 1 
                ? selected[0] 
                : `${selected.length} selecionados`
            }
          </span>
          <div className="flex items-center gap-1">
            {selected.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {selected.length}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="p-3 border-b space-y-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectionChange(options)}
              className="flex-1"
            >
              Selecionar Todos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectionChange([])}
              className="flex-1"
            >
              Limpar
            </Button>
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto">
          {filteredOptions.map((option) => {
            const isSelected = selected.includes(option)
            return (
              <div
                key={option}
                className="flex items-center space-x-2 p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  if (isSelected) {
                    onSelectionChange(selected.filter(item => item !== option))
                  } else {
                    onSelectionChange([...selected, option])
                  }
                }}
              >
                <Checkbox
                  checked={isSelected}
                  onChange={() => {}}
                />
                <span className="text-sm">{option}</span>
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default function AuditTrailPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedActions, setSelectedActions] = useState<string[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [filteredData, setFilteredData] = useState(mockAuditData)
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 10

  const handleSearch = () => {
    let filtered = mockAuditData

    if (searchTerm) {
      filtered = filtered.filter(
        record =>
          record.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedActions.length > 0) {
      filtered = filtered.filter(record => selectedActions.includes(record.action))
    }

    if (selectedUsers.length > 0) {
      filtered = filtered.filter(record => selectedUsers.includes(record.user))
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(record => selectedCategories.includes(record.category))
    }

    if (startDate) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.dateTime)
        return recordDate >= startDate
      })
    }

    if (endDate) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.dateTime)
        return recordDate <= endDate
      })
    }

    setFilteredData(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedActions([])
    setSelectedUsers([])
    setSelectedCategories([])
    setStartDate(undefined)
    setEndDate(undefined)
    setCurrentPage(1)
    setFilteredData(mockAuditData)
  }

  const handleViewDetails = (record: AuditRecord) => {
    setSelectedRecord(record)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRecord(null)
  }

  const exportData = () => {
    // Implementar lógica de exportação
    console.log("Exportando dados...", filteredData)
    // Aqui você pode implementar a exportação para CSV, Excel, etc.
  }

  // Aplicar filtros automaticamente quando os valores mudarem
  useEffect(() => {
    handleSearch()
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchTerm, selectedActions, selectedUsers, selectedCategories, startDate, endDate])

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / recordsPerPage)
  const startIndex = (currentPage - 1) * recordsPerPage
  const endIndex = startIndex + recordsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Audit Trail</h1>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Pesquisa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Barra de Pesquisa */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Pesquisar por usuário, ação ou detalhes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Ações</label>
              <MultiSelect
                placeholder="Selecionar ações"
                options={actionTypes}
                selected={selectedActions}
                onSelectionChange={setSelectedActions}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Usuários</label>
              <MultiSelect
                placeholder="Selecionar usuários"
                options={users}
                selected={selectedUsers}
                onSelectionChange={setSelectedUsers}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Categorias</label>
              <MultiSelect
                placeholder="Selecionar categorias"
                options={categoryTypes}
                selected={selectedCategories}
                onSelectionChange={setSelectedCategories}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Data</label>
              <div className="flex gap-2">
                <DatePicker
                  date={startDate}
                  setDate={setStartDate}
                  placeholder="Data inicial"
                />
                <DatePicker
                  date={endDate}
                  setDate={setEndDate}
                  placeholder="Data final"
                />
                <Button onClick={clearFilters} variant="outline" className="gap-2">
                  <FilterXIcon className="h-4 w-4" />
                  Limpar Filtros
                </Button>
                <Button onClick={exportData} className="gap-2">
                  <DownloadIcon className="h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Registros */}
      <Card>
        <CardHeader>
          <CardTitle>Registros de Auditoria ({filteredData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-sm">
                        #{record.id}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {new Date(record.dateTime).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell className="font-medium">
                        {record.user}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionBadgeVariant(record.action)} className="flex items-center w-fit">
                          {getActionIcon(record.action)}
                          {record.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getCategoryBadgeVariant(record.category)} className="flex items-center w-fit">
                          {getCategoryIcon(record.category)}
                          {record.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(record)}
                          className="h-8 w-8 p-0"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredData.length)} de {filteredData.length} registros
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AuditDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        record={selectedRecord}
      />
      </div>
    </DashboardLayout>
  )
}