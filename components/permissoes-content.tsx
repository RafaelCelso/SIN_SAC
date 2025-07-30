"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Users, 
  Settings, 
  FileText,
  Calendar,
  BarChart3,
  HeadphonesIcon,
  BookOpen,
  Package2,
  Tag,
  DollarSign,
  AlertTriangle,
  Syringe,
  FileEdit,
  KeyRound,
  UserCheck,
  Lock,
  Unlock,
  Filter,
  MoreHorizontal,
  Eye,
  Copy,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

interface Permissao {
  id: string
  nome: string
  descricao: string
  categoria: string
  ativo: boolean
  usuarios: number
  criadoEm: string
  atualizadoEm?: string
  prioridade: "alta" | "media" | "baixa"
  modulo: string
}

interface Perfil {
  id: string
  nome: string
  descricao: string
  permissoes: string[]
  usuarios: number
  ativo: boolean
  criadoEm: string
  atualizadoEm?: string
  cor: string
}

const permissoesMock: Permissao[] = [
  {
    id: "1",
    nome: "Visualizar Dashboard",
    descricao: "Permite visualizar o dashboard principal com métricas e gráficos",
    categoria: "Dashboard",
    ativo: true,
    usuarios: 15,
    criadoEm: "2024-01-15",
    atualizadoEm: "2024-02-10",
    prioridade: "alta",
    modulo: "dashboard"
  },
  {
    id: "2",
    nome: "Gerenciar Clientes",
    descricao: "Permite criar, editar e excluir clientes do sistema",
    categoria: "Clientes",
    ativo: true,
    usuarios: 8,
    criadoEm: "2024-01-10",
    atualizadoEm: "2024-02-05",
    prioridade: "alta",
    modulo: "clientes"
  },
  {
    id: "3",
    nome: "Criar Atendimentos",
    descricao: "Permite iniciar novos atendimentos e protocolos",
    categoria: "Atendimentos",
    ativo: true,
    usuarios: 12,
    criadoEm: "2024-01-08",
    prioridade: "alta",
    modulo: "atendimentos"
  },
  {
    id: "4",
    nome: "Visualizar Relatórios",
    descricao: "Permite acessar relatórios e exportar dados",
    categoria: "Relatórios",
    ativo: false,
    usuarios: 5,
    criadoEm: "2024-01-05",
    prioridade: "media",
    modulo: "relatorios"
  },
  {
    id: "5",
    nome: "Gerenciar Usuários",
    descricao: "Permite criar e editar usuários do sistema",
    categoria: "Segurança",
    ativo: true,
    usuarios: 3,
    criadoEm: "2024-01-03",
    prioridade: "alta",
    modulo: "usuarios"
  },
  {
    id: "6",
    nome: "Configurar Preferências",
    descricao: "Permite alterar configurações do sistema",
    categoria: "Preferências",
    ativo: true,
    usuarios: 4,
    criadoEm: "2024-01-02",
    prioridade: "media",
    modulo: "preferencias"
  },
  {
    id: "7",
    nome: "Exportar Dados",
    descricao: "Permite exportar dados em diversos formatos",
    categoria: "Relatórios",
    ativo: true,
    usuarios: 6,
    criadoEm: "2024-01-20",
    prioridade: "baixa",
    modulo: "relatorios"
  },
  {
    id: "8",
    nome: "Gerenciar FAQ",
    descricao: "Permite criar e editar perguntas frequentes",
    categoria: "Conteúdo",
    ativo: true,
    usuarios: 2,
    criadoEm: "2024-01-25",
    prioridade: "baixa",
    modulo: "faq"
  }
]

const perfisMock: Perfil[] = [
  {
    id: "1",
    nome: "Administrador",
    descricao: "Acesso completo ao sistema com todas as permissões",
    permissoes: ["1", "2", "3", "4", "5", "6", "7", "8"],
    usuarios: 2,
    ativo: true,
    criadoEm: "2024-01-01",
    atualizadoEm: "2024-02-15",
    cor: "#dc2626"
  },
  {
    id: "2",
    nome: "Atendente",
    descricao: "Acesso para atendimentos e gestão de clientes",
    permissoes: ["1", "2", "3", "8"],
    usuarios: 8,
    ativo: true,
    criadoEm: "2024-01-02",
    cor: "#059669"
  },
  {
    id: "3",
    nome: "Supervisor",
    descricao: "Acesso para supervisão, relatórios e atendimentos",
    permissoes: ["1", "2", "3", "4", "7"],
    usuarios: 3,
    ativo: true,
    criadoEm: "2024-01-03",
    cor: "#7c3aed"
  },
  {
    id: "4",
    nome: "Visualizador",
    descricao: "Apenas visualização de dados e dashboard",
    permissoes: ["1", "4"],
    usuarios: 5,
    ativo: false,
    criadoEm: "2024-01-04",
    cor: "#6b7280"
  },
  {
    id: "5",
    nome: "Analista",
    descricao: "Acesso a relatórios e análise de dados",
    permissoes: ["1", "4", "7"],
    usuarios: 4,
    ativo: true,
    criadoEm: "2024-01-10",
    cor: "#ea580c"
  }
]

const categorias = [
  { id: "dashboard", nome: "Dashboard", icon: <BarChart3 size={16} />, cor: "#3b82f6" },
  { id: "clientes", nome: "Clientes", icon: <Users size={16} />, cor: "#10b981" },
  { id: "atendimentos", nome: "Atendimentos", icon: <HeadphonesIcon size={16} />, cor: "#f59e0b" },
  { id: "relatorios", nome: "Relatórios", icon: <FileText size={16} />, cor: "#8b5cf6" },
  { id: "seguranca", nome: "Segurança", icon: <Shield size={16} />, cor: "#ef4444" },
  { id: "preferencias", nome: "Preferências", icon: <Settings size={16} />, cor: "#6b7280" },
  { id: "conteudo", nome: "Conteúdo", icon: <BookOpen size={16} />, cor: "#06b6d4" }
]

export function PermissoesContent() {
  const [permissoes, setPermissoes] = useState<Permissao[]>(permissoesMock)
  const [perfis, setPerfis] = useState<Perfil[]>(perfisMock)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategoria, setSelectedCategoria] = useState("todas")
  const [selectedStatus, setSelectedStatus] = useState("todos")
  const [activeTab, setActiveTab] = useState("permissoes")
  
  // Estados dos modais
  const [showPerfilModal, setShowPerfilModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditPermissaoModal, setShowEditPermissaoModal] = useState(false)
  const [editingPerfil, setEditingPerfil] = useState<Perfil | null>(null)
  const [editingPermissao, setEditingPermissao] = useState<Permissao | null>(null)
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'permissao' | 'perfil', nome: string} | null>(null)

  // Estados dos formulários
  const [perfilForm, setPerfilForm] = useState({
    nome: "",
    descricao: "",
    cor: "#3b82f6",
    permissoes: [] as string[],
    ativo: true
  })

  const [permissaoForm, setPermissaoForm] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    ativo: true
  })

  const filteredPermissoes = permissoes.filter(permissao => {
    const matchesSearch = permissao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permissao.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = selectedCategoria === "todas" || permissao.categoria.toLowerCase() === selectedCategoria
    const matchesStatus = selectedStatus === "todos" || 
                         (selectedStatus === "ativo" && permissao.ativo) ||
                         (selectedStatus === "inativo" && !permissao.ativo)
    return matchesSearch && matchesCategoria && matchesStatus
  })

  const filteredPerfis = perfis.filter(perfil => {
    const matchesSearch = perfil.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         perfil.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "todos" || 
                         (selectedStatus === "ativo" && perfil.ativo) ||
                         (selectedStatus === "inativo" && !perfil.ativo)
    return matchesSearch && matchesStatus
  })

  const togglePermissaoStatus = (id: string) => {
    setPermissoes(prev => prev.map(p => 
      p.id === id ? { ...p, ativo: !p.ativo, atualizadoEm: new Date().toISOString() } : p
    ))
    toast({
      title: "Status atualizado",
      description: "O status da permissão foi alterado com sucesso.",
    })
  }

  const togglePerfilStatus = (id: string) => {
    setPerfis(prev => prev.map(p => 
      p.id === id ? { ...p, ativo: !p.ativo, atualizadoEm: new Date().toISOString() } : p
    ))
    toast({
      title: "Status atualizado", 
      description: "O status do perfil foi alterado com sucesso.",
    })
  }

  const getPermissoesByPerfil = (perfilId: string) => {
    const perfil = perfis.find(p => p.id === perfilId)
    if (!perfil) return []
    return permissoes.filter(p => perfil.permissoes.includes(p.id))
  }



  const handleEditPermissao = (permissao: Permissao) => {
    setEditingPermissao(permissao)
    setPermissaoForm({
      nome: permissao.nome,
      descricao: permissao.descricao,
      categoria: permissao.categoria,
      ativo: permissao.ativo
    })
    setShowEditPermissaoModal(true)
  }

  const handleSavePermissao = () => {
    if (editingPermissao) {
      setPermissoes(prev => prev.map(p => 
        p.id === editingPermissao.id 
          ? { ...p, ...permissaoForm, atualizadoEm: new Date().toISOString() }
          : p
      ))
      toast({
        title: "Permissão atualizada",
        description: "A permissão foi atualizada com sucesso.",
      })
    }
    
    setShowEditPermissaoModal(false)
    setEditingPermissao(null)
    setPermissaoForm({
      nome: "",
      descricao: "",
      categoria: "",
      ativo: true
    })
  }

  const handleEditPerfil = (perfil: Perfil) => {
    setEditingPerfil(perfil)
    setPerfilForm({
      nome: perfil.nome,
      descricao: perfil.descricao,
      cor: perfil.cor,
      permissoes: perfil.permissoes,
      ativo: perfil.ativo
    })
    setShowPerfilModal(true)
  }

  const handleDeleteItem = (id: string, type: 'permissao' | 'perfil', nome: string) => {
    setItemToDelete({ id, type, nome })
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (!itemToDelete) return
    
    if (itemToDelete.type === 'permissao') {
      setPermissoes(prev => prev.filter(p => p.id !== itemToDelete.id))
    } else {
      setPerfis(prev => prev.filter(p => p.id !== itemToDelete.id))
    }
    
    toast({
      title: "Item excluído",
      description: `${itemToDelete.type === 'permissao' ? 'Permissão' : 'Perfil'} "${itemToDelete.nome}" foi excluído com sucesso.`,
    })
    
    setItemToDelete(null)
    setShowDeleteDialog(false)
  }

  const handleSavePerfil = () => {
    if (editingPerfil) {
      // Editar perfil existente
      setPerfis(prev => prev.map(p => 
        p.id === editingPerfil.id 
          ? { ...p, ...perfilForm, atualizadoEm: new Date().toISOString() }
          : p
      ))
      toast({
        title: "Perfil atualizado",
        description: "O perfil foi atualizado com sucesso.",
      })
    } else {
      // Criar novo perfil
      const novoPerfil: Perfil = {
        id: (perfis.length + 1).toString(),
        ...perfilForm,
        usuarios: 0,
        criadoEm: new Date().toISOString()
      }
      setPerfis(prev => [...prev, novoPerfil])
      toast({
        title: "Perfil criado",
        description: "O novo perfil foi criado com sucesso.",
      })
    }
    
    setShowPerfilModal(false)
    setEditingPerfil(null)
    setPerfilForm({
      nome: "",
      descricao: "",
      cor: "#3b82f6",
      permissoes: [],
      ativo: true
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Permissões</h1>
          <p className="text-gray-600 mt-1">
            Gerencie permissões e perfis de acesso do sistema
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList className="grid w-full sm:w-auto grid-cols-2">
            <TabsTrigger value="permissoes" className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              Permissões
            </TabsTrigger>
            <TabsTrigger value="perfis" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Perfis
            </TabsTrigger>
          </TabsList>

                     <div className="flex gap-2">
             <Button 
               size="sm"
               onClick={() => {
                 window.location.href = '/seguranca/perfis/novo'
               }}
               className={`${activeTab === "perfis" ? "" : "hidden"} bg-[#26B99D] hover:bg-[#1f9a7f] text-white`}
             >
               <Plus className="h-4 w-4 mr-2" />
               Novo Perfil
             </Button>
           </div>
        </div>

        {/* Tab Permissões */}
        <TabsContent value="permissoes" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="search"
                      placeholder="Buscar permissões..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as categorias</SelectItem>
                      {categorias.map(categoria => (
                        <SelectItem key={categoria.id} value={categoria.id}>
                          <div className="flex items-center gap-2">
                            {categoria.icon}
                            {categoria.nome}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os status</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Permissões */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Permissões do Sistema</CardTitle>
                  <CardDescription>
                    {filteredPermissoes.length} permissão{filteredPermissoes.length !== 1 ? 'ões' : ''} encontrada{filteredPermissoes.length !== 1 ? 's' : ''}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                                         <TableHead>Nome</TableHead>
                     <TableHead className="w-48">Descrição</TableHead>
                     <TableHead>Categoria</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPermissoes.map((permissao) => (
                    <TableRow key={permissao.id}>
                      <TableCell className="font-medium">
                        {permissao.nome}
                      </TableCell>
                      <TableCell className="w-48">
                        <p className="truncate" title={permissao.descricao}>
                          {permissao.descricao}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          {categorias.find(c => c.id === permissao.categoria.toLowerCase())?.icon}
                          {permissao.categoria}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {permissao.ativo ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Ativo
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <XCircle className="h-3 w-3 mr-1" />
                              Inativo
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPermissao(permissao)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(permissao.id, 'permissao', permissao.nome)}
                            title="Excluir"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Perfis */}
        <TabsContent value="perfis" className="space-y-4">
          {/* Filtros para Perfis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search-perfis">Buscar Perfis</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="search-perfis"
                      placeholder="Buscar perfis..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status-perfis">Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os status</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Perfis */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Perfis de Acesso</CardTitle>
                  <CardDescription>
                    {filteredPerfis.length} perfil{filteredPerfis.length !== 1 ? 's' : ''} encontrado{filteredPerfis.length !== 1 ? 's' : ''}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPerfis.map((perfil) => (
                  <Card 
                    key={perfil.id} 
                    className="hover:shadow-md transition-all duration-200"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{perfil.nome}</CardTitle>
                        <div className="flex items-center gap-2">
                          {perfil.ativo ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Ativo
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <XCircle className="h-3 w-3 mr-1" />
                              Inativo
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardDescription>{perfil.descricao}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                                             <div className="flex items-center justify-between text-sm">
                         <span className="text-gray-600">Usuários:</span>
                         <div className="flex items-center gap-1">
                           <Users className="h-4 w-4 text-gray-400" />
                           <span className="font-medium">{perfil.usuarios}</span>
                         </div>
                       </div>

                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleEditPerfil(perfil)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                                                     <DropdownMenuContent align="end">
                             <DropdownMenuItem>
                               <Copy className="h-4 w-4 mr-2" />
                               Duplicar
                             </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => togglePerfilStatus(perfil.id)}>
                              {perfil.ativo ? (
                                <>
                                  <Lock className="h-4 w-4 mr-2" />
                                  Desativar
                                </>
                              ) : (
                                <>
                                  <Unlock className="h-4 w-4 mr-2" />
                                  Ativar
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteItem(perfil.id, 'perfil', perfil.nome)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>



      {/* Modal de Edição de Permissão */}
      <Dialog open={showEditPermissaoModal} onOpenChange={setShowEditPermissaoModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Permissão</DialogTitle>
            <DialogDescription>
              Atualize as informações da permissão selecionada.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Permissão *</Label>
              <Input
                id="nome"
                value={permissaoForm.nome}
                onChange={(e) => setPermissaoForm(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Visualizar Dashboard"
              />
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border">
                {categorias.find(c => c.id === permissaoForm.categoria.toLowerCase())?.icon}
                <span className="text-gray-700">{permissaoForm.categoria}</span>
              </div>
            </div>

                         <div className="space-y-2">
               <Label htmlFor="descricao">Descrição</Label>
               <Textarea
                 id="descricao"
                 value={permissaoForm.descricao}
                 onChange={(e) => setPermissaoForm(prev => ({ ...prev, descricao: e.target.value }))}
                 placeholder="Descreva o que esta permissão permite fazer..."
                 rows={3}
               />
             </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={permissaoForm.ativo ? "ativo" : "inativo"} 
                onValueChange={(value) => setPermissaoForm(prev => ({ ...prev, ativo: value === "ativo" }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditPermissaoModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePermissao}>
              Atualizar Permissão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Perfil */}
      <Dialog open={showPerfilModal} onOpenChange={setShowPerfilModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPerfil ? "Editar Perfil" : "Novo Perfil"}
            </DialogTitle>
            <DialogDescription>
              {editingPerfil 
                ? "Atualize as informações do perfil selecionado."
                : "Preencha as informações para criar um novo perfil de acesso."
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome-perfil">Nome do Perfil *</Label>
                <Input
                  id="nome-perfil"
                  value={perfilForm.nome}
                  onChange={(e) => setPerfilForm(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Administrador, Atendente"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao-perfil">Descrição *</Label>
              <Textarea
                id="descricao-perfil"
                value={perfilForm.descricao}
                onChange={(e) => setPerfilForm(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descreva o tipo de acesso deste perfil..."
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <Label>Permissões do Perfil</Label>
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                <div className="space-y-3">
                  {categorias.map(categoria => {
                    const permissoesCategoria = permissoes.filter(p => 
                      p.categoria.toLowerCase() === categoria.id
                    )
                    
                    if (permissoesCategoria.length === 0) return null

                    return (
                      <div key={categoria.id} className="space-y-2">
                        <div className="flex items-center gap-2 font-medium text-sm">
                          {categoria.icon}
                          {categoria.nome}
                        </div>
                        <div className="pl-6 space-y-2">
                          {permissoesCategoria.map(permissao => (
                            <div key={permissao.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`perm-${permissao.id}`}
                                checked={perfilForm.permissoes.includes(permissao.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setPerfilForm(prev => ({
                                      ...prev,
                                      permissoes: [...prev.permissoes, permissao.id]
                                    }))
                                  } else {
                                    setPerfilForm(prev => ({
                                      ...prev,
                                      permissoes: prev.permissoes.filter(id => id !== permissao.id)
                                    }))
                                  }
                                }}
                              />
                              <Label htmlFor={`perm-${permissao.id}`} className="text-sm">
                                {permissao.nome}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {perfilForm.permissoes.length} permissão{perfilForm.permissoes.length !== 1 ? 'ões' : ''} selecionada{perfilForm.permissoes.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="ativo-perfil"
                checked={perfilForm.ativo}
                onCheckedChange={(checked) => setPerfilForm(prev => ({ ...prev, ativo: checked }))}
              />
              <Label htmlFor="ativo-perfil">Perfil ativo</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPerfilModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePerfil}>
              {editingPerfil ? "Atualizar" : "Criar"} Perfil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir {itemToDelete?.type === 'permissao' ? 'a permissão' : 'o perfil'} "{itemToDelete?.nome}"?
              {itemToDelete?.type === 'perfil' && (
                <span className="block mt-2 text-red-600 font-medium">
                  Atenção: Todos os usuários com este perfil perderão o acesso associado.
                </span>
              )}
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 