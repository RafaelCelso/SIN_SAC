"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { 
  ArrowLeft,
  Save, 
  Shield, 
  Users, 
  Settings, 
  FileText,
  BarChart3,
  HeadphonesIcon,
  BookOpen,
  KeyRound,
  UserCheck,
  CheckCircle,
  XCircle,
  Calendar,
  HelpCircle
} from "lucide-react"
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

interface PermissaoComAcordeon extends Permissao {
  acordeon?: string
}

// Mock de perfis para simular busca por ID
const perfisMock: Perfil[] = [
  {
    id: "1",
    nome: "Administrador",
    descricao: "Perfil com acesso total ao sistema",
    permissoes: ["1", "2", "3", "5", "33", "35"],
    usuarios: 3,
    ativo: true,
    criadoEm: "2024-01-15",
    atualizadoEm: "2024-02-10",
    cor: "#ef4444"
  },
  {
    id: "2", 
    nome: "Atendente",
    descricao: "Perfil para atendimento ao cliente",
    permissoes: ["6", "7", "8", "9"],
    usuarios: 8,
    ativo: true,
    criadoEm: "2024-01-20",
    cor: "#f59e0b"
  },
  {
    id: "3",
    nome: "Supervisor",
    descricao: "Perfil para supervisão de equipes",
    permissoes: ["1", "6", "7", "18", "19"],
    usuarios: 2,
    ativo: true,
    criadoEm: "2024-01-25",
    cor: "#8b5cf6"
  }
]

// Reutilizando as mesmas permissões do NovoPerfilContent
const permissoesMock: PermissaoComAcordeon[] = [
  // Dashboard
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
  
  // Clientes - Buscar Clientes
  {
    id: "2",
    nome: "Buscar Clientes",
    descricao: "Permite pesquisar e visualizar informações de clientes",
    categoria: "Clientes",
    acordeon: "Buscar Clientes",
    ativo: true,
    usuarios: 12,
    criadoEm: "2024-01-10",
    prioridade: "alta",
    modulo: "clientes"
  },
  {
    id: "3",
    nome: "Filtrar Clientes",
    descricao: "Permite aplicar filtros avançados na busca de clientes",
    categoria: "Clientes",
    acordeon: "Buscar Clientes",
    ativo: true,
    usuarios: 10,
    criadoEm: "2024-01-10",
    prioridade: "media",
    modulo: "clientes"
  },
  
  // Clientes - Novo Cliente
  {
    id: "4",
    nome: "Criar Cliente",
    descricao: "Permite criar novos clientes no sistema",
    categoria: "Clientes",
    acordeon: "Novo Cliente",
    ativo: true,
    usuarios: 8,
    criadoEm: "2024-01-10",
    prioridade: "alta",
    modulo: "clientes"
  },
  {
    id: "5",
    nome: "Editar Cliente",
    descricao: "Permite editar informações de clientes existentes",
    categoria: "Clientes",
    acordeon: "Novo Cliente",
    ativo: true,
    usuarios: 8,
    criadoEm: "2024-01-10",
    prioridade: "alta",
    modulo: "clientes"
  },
  
  // Atendimentos - Protocolos
  {
    id: "6",
    nome: "Criar Protocolo",
    descricao: "Permite criar novos protocolos de atendimento",
    categoria: "Atendimentos",
    acordeon: "Protocolos",
    ativo: true,
    usuarios: 15,
    criadoEm: "2024-01-08",
    prioridade: "alta",
    modulo: "atendimentos"
  },
  {
    id: "7",
    nome: "Visualizar Protocolos",
    descricao: "Permite visualizar protocolos existentes",
    categoria: "Atendimentos",
    acordeon: "Protocolos",
    ativo: true,
    usuarios: 20,
    criadoEm: "2024-01-08",
    prioridade: "alta",
    modulo: "atendimentos"
  },
  
  // Atendimentos - Queixa Técnica
  {
    id: "8",
    nome: "Registrar Queixa Técnica",
    descricao: "Permite registrar queixas técnicas de produtos",
    categoria: "Atendimentos",
    acordeon: "Queixa Técnica",
    ativo: true,
    usuarios: 12,
    criadoEm: "2024-01-08",
    prioridade: "alta",
    modulo: "atendimentos"
  },
  {
    id: "9",
    nome: "Acompanhar Queixa Técnica",
    descricao: "Permite acompanhar o andamento de queixas técnicas",
    categoria: "Atendimentos",
    acordeon: "Queixa Técnica",
    ativo: true,
    usuarios: 10,
    criadoEm: "2024-01-08",
    prioridade: "media",
    modulo: "atendimentos"
  },
  
  // Atendimentos - Farmacovigilância
  {
    id: "10",
    nome: "Registrar Evento Adverso",
    descricao: "Permite registrar eventos adversos relacionados a medicamentos",
    categoria: "Atendimentos",
    acordeon: "Farmacovigilância",
    ativo: true,
    usuarios: 8,
    criadoEm: "2024-01-08",
    prioridade: "alta",
    modulo: "atendimentos"
  },
  {
    id: "11",
    nome: "Analisar Farmacovigilância",
    descricao: "Permite analisar dados de farmacovigilância",
    categoria: "Atendimentos",
    acordeon: "Farmacovigilância",
    ativo: true,
    usuarios: 5,
    criadoEm: "2024-01-08",
    prioridade: "alta",
    modulo: "atendimentos"
  },
  
  // Atendimentos - Ressarcimento
  {
    id: "12",
    nome: "Solicitar Ressarcimento",
    descricao: "Permite solicitar ressarcimento para clientes",
    categoria: "Atendimentos",
    acordeon: "Ressarcimento",
    ativo: true,
    usuarios: 6,
    criadoEm: "2024-01-08",
    prioridade: "media",
    modulo: "atendimentos"
  },
  {
    id: "13",
    nome: "Aprovar Ressarcimento",
    descricao: "Permite aprovar solicitações de ressarcimento",
    categoria: "Atendimentos",
    acordeon: "Ressarcimento",
    ativo: true,
    usuarios: 3,
    criadoEm: "2024-01-08",
    prioridade: "alta",
    modulo: "atendimentos"
  },
  
  // Agenda
  {
    id: "14",
    nome: "Visualizar Agenda",
    descricao: "Permite visualizar a agenda de compromissos e eventos",
    categoria: "Agenda",
    ativo: true,
    usuarios: 10,
    criadoEm: "2024-01-30",
    prioridade: "media",
    modulo: "agenda"
  },
  {
    id: "15",
    nome: "Gerenciar Compromissos",
    descricao: "Permite criar, editar e excluir compromissos na agenda",
    categoria: "Agenda",
    ativo: true,
    usuarios: 8,
    criadoEm: "2024-01-30",
    prioridade: "alta",
    modulo: "agenda"
  },
  
  // FAQ
  {
    id: "16",
    nome: "Gerenciar FAQ",
    descricao: "Permite criar e editar perguntas frequentes",
    categoria: "FAQ",
    ativo: true,
    usuarios: 2,
    criadoEm: "2024-01-25",
    prioridade: "baixa",
    modulo: "faq"
  },
  {
    id: "17",
    nome: "Criar Perguntas FAQ",
    descricao: "Permite criar novas perguntas frequentes",
    categoria: "FAQ",
    ativo: true,
    usuarios: 3,
    criadoEm: "2024-01-25",
    prioridade: "media",
    modulo: "faq"
  },
  
  // Relatórios - Relatórios Gerenciais
  {
    id: "18",
    nome: "Visualizar Relatórios Gerenciais",
    descricao: "Permite acessar relatórios gerenciais do sistema",
    categoria: "Relatórios",
    acordeon: "Relatórios Gerenciais",
    ativo: true,
    usuarios: 8,
    criadoEm: "2024-01-05",
    prioridade: "alta",
    modulo: "relatorios"
  },
  {
    id: "19",
    nome: "Exportar Relatórios Gerenciais",
    descricao: "Permite exportar relatórios gerenciais em diversos formatos",
    categoria: "Relatórios",
    acordeon: "Relatórios Gerenciais",
    ativo: true,
    usuarios: 6,
    criadoEm: "2024-01-20",
    prioridade: "media",
    modulo: "relatorios"
  },
  
  // Relatórios - Relatórios de Atendimento
  {
    id: "20",
    nome: "Visualizar Relatórios de Atendimento",
    descricao: "Permite acessar relatórios de atendimento e protocolos",
    categoria: "Relatórios",
    acordeon: "Relatórios de Atendimento",
    ativo: true,
    usuarios: 10,
    criadoEm: "2024-01-05",
    prioridade: "alta",
    modulo: "relatorios"
  },
  {
    id: "21",
    nome: "Exportar Dados de Atendimento",
    descricao: "Permite exportar dados de atendimento e estatísticas",
    categoria: "Relatórios",
    acordeon: "Relatórios de Atendimento",
    ativo: true,
    usuarios: 8,
    criadoEm: "2024-01-20",
    prioridade: "media",
    modulo: "relatorios"
  },
  
  // Relatórios - Relatórios de Farmacovigilância
  {
    id: "22",
    nome: "Visualizar Relatórios de Farmacovigilância",
    descricao: "Permite acessar relatórios de eventos adversos e farmacovigilância",
    categoria: "Relatórios",
    acordeon: "Relatórios de Farmacovigilância",
    ativo: true,
    usuarios: 5,
    criadoEm: "2024-01-05",
    prioridade: "alta",
    modulo: "relatorios"
  },
  {
    id: "23",
    nome: "Exportar Dados de Farmacovigilância",
    descricao: "Permite exportar dados de farmacovigilância para órgãos reguladores",
    categoria: "Relatórios",
    acordeon: "Relatórios de Farmacovigilância",
    ativo: true,
    usuarios: 3,
    criadoEm: "2024-01-20",
    prioridade: "alta",
    modulo: "relatorios"
  },
  
  // Preferências - Produtos
  {
    id: "24",
    nome: "Gerenciar Produtos",
    descricao: "Permite cadastrar e editar produtos no sistema",
    categoria: "Preferências",
    acordeon: "Produtos",
    ativo: true,
    usuarios: 5,
    criadoEm: "2024-01-02",
    prioridade: "alta",
    modulo: "preferencias"
  },
  {
    id: "25",
    nome: "Configurar Categorias de Produtos",
    descricao: "Permite configurar categorias e classificações de produtos",
    categoria: "Preferências",
    acordeon: "Produtos",
    ativo: true,
    usuarios: 3,
    criadoEm: "2024-01-02",
    prioridade: "media",
    modulo: "preferencias"
  },
  
  // Preferências - Motivos
  {
    id: "26",
    nome: "Gerenciar Motivos",
    descricao: "Permite cadastrar e editar motivos de atendimento",
    categoria: "Preferências",
    acordeon: "Motivos",
    ativo: true,
    usuarios: 4,
    criadoEm: "2024-01-02",
    prioridade: "media",
    modulo: "preferencias"
  },
  {
    id: "27",
    nome: "Configurar Tipos de Motivos",
    descricao: "Permite configurar tipos e categorias de motivos",
    categoria: "Preferências",
    acordeon: "Motivos",
    ativo: true,
    usuarios: 2,
    criadoEm: "2024-01-02",
    prioridade: "media",
    modulo: "preferencias"
  },
  
  // Preferências - Evento Adverso
  {
    id: "28",
    nome: "Configurar Eventos Adversos",
    descricao: "Permite configurar tipos de eventos adversos",
    categoria: "Preferências",
    acordeon: "Evento Adverso",
    ativo: true,
    usuarios: 3,
    criadoEm: "2024-01-02",
    prioridade: "alta",
    modulo: "preferencias"
  },
  {
    id: "29",
    nome: "Gerenciar Classificação de Eventos",
    descricao: "Permite gerenciar classificações de eventos adversos",
    categoria: "Preferências",
    acordeon: "Evento Adverso",
    ativo: true,
    usuarios: 2,
    criadoEm: "2024-01-02",
    prioridade: "alta",
    modulo: "preferencias"
  },
  
  // Preferências - Via Administração
  {
    id: "30",
    nome: "Gerenciar Vias de Administração",
    descricao: "Permite cadastrar e editar vias de administração de medicamentos",
    categoria: "Preferências",
    acordeon: "Via Administração",
    ativo: true,
    usuarios: 3,
    criadoEm: "2024-01-02",
    prioridade: "media",
    modulo: "preferencias"
  },
  
  // Preferências - Formulários
  {
    id: "31",
    nome: "Configurar Formulários",
    descricao: "Permite configurar formulários do sistema",
    categoria: "Preferências",
    acordeon: "Formulários",
    ativo: true,
    usuarios: 4,
    criadoEm: "2024-01-02",
    prioridade: "media",
    modulo: "preferencias"
  },
  {
    id: "32",
    nome: "Gerenciar Campos Personalizados",
    descricao: "Permite gerenciar campos personalizados dos formulários",
    categoria: "Preferências",
    acordeon: "Formulários",
    ativo: true,
    usuarios: 2,
    criadoEm: "2024-01-02",
    prioridade: "media",
    modulo: "preferencias"
  },
  
  // Preferências - Parametrização
  {
    id: "33",
    nome: "Configurar Parâmetros do Sistema",
    descricao: "Permite configurar parâmetros gerais do sistema",
    categoria: "Preferências",
    acordeon: "Parametrização",
    ativo: true,
    usuarios: 2,
    criadoEm: "2024-01-02",
    prioridade: "alta",
    modulo: "preferencias"
  },
  {
    id: "34",
    nome: "Gerenciar Configurações Avançadas",
    descricao: "Permite gerenciar configurações avançadas do sistema",
    categoria: "Preferências",
    acordeon: "Parametrização",
    ativo: true,
    usuarios: 1,
    criadoEm: "2024-01-02",
    prioridade: "alta",
    modulo: "preferencias"
  },
  
  // Segurança - Audit Trail
  {
    id: "35",
    nome: "Visualizar Audit Trail",
    descricao: "Permite visualizar logs de auditoria do sistema",
    categoria: "Segurança",
    acordeon: "Audit Trail",
    ativo: true,
    usuarios: 3,
    criadoEm: "2024-01-03",
    prioridade: "alta",
    modulo: "seguranca"
  },
  {
    id: "36",
    nome: "Exportar Logs de Auditoria",
    descricao: "Permite exportar logs de auditoria",
    categoria: "Segurança",
    acordeon: "Audit Trail",
    ativo: true,
    usuarios: 2,
    criadoEm: "2024-01-03",
    prioridade: "media",
    modulo: "seguranca"
  },
  
  // Segurança - Usuários
  {
    id: "37",
    nome: "Gerenciar Usuários",
    descricao: "Permite criar e editar usuários do sistema",
    categoria: "Segurança",
    acordeon: "Usuários",
    ativo: true,
    usuarios: 3,
    criadoEm: "2024-01-03",
    prioridade: "alta",
    modulo: "seguranca"
  },
  {
    id: "38",
    nome: "Resetar Senhas",
    descricao: "Permite resetar senhas de usuários",
    categoria: "Segurança",
    acordeon: "Usuários",
    ativo: true,
    usuarios: 2,
    criadoEm: "2024-01-03",
    prioridade: "alta",
    modulo: "seguranca"
  },
  
  // Segurança - Permissões
  {
    id: "39",
    nome: "Gerenciar Permissões",
    descricao: "Permite gerenciar permissões do sistema",
    categoria: "Segurança",
    acordeon: "Permissões",
    ativo: true,
    usuarios: 2,
    criadoEm: "2024-01-03",
    prioridade: "alta",
    modulo: "seguranca"
  },
  {
    id: "40",
    nome: "Configurar Perfis de Acesso",
    descricao: "Permite configurar perfis de acesso e suas permissões",
    categoria: "Segurança",
    acordeon: "Permissões",
    ativo: true,
    usuarios: 2,
    criadoEm: "2024-01-03",
    prioridade: "alta",
    modulo: "seguranca"
  }
]

const categorias = [
  { id: "dashboard", nome: "Dashboard", icon: <BarChart3 size={16} />, cor: "#3b82f6" },
  { id: "clientes", nome: "Clientes", icon: <Users size={16} />, cor: "#10b981" },
  { id: "atendimentos", nome: "Atendimentos", icon: <HeadphonesIcon size={16} />, cor: "#f59e0b" },
  { id: "agenda", nome: "Agenda", icon: <Calendar size={16} />, cor: "#ec4899" },
  { id: "faq", nome: "FAQ", icon: <BookOpen size={16} />, cor: "#f97316" },
  { id: "relatorios", nome: "Relatórios", icon: <FileText size={16} />, cor: "#8b5cf6" },
  { id: "preferencias", nome: "Preferências", icon: <Settings size={16} />, cor: "#6b7280" },
  { id: "seguranca", nome: "Segurança", icon: <Shield size={16} />, cor: "#ef4444" }
]

interface EditarPerfilContentProps {
  perfilId: string
}

export function EditarPerfilContent({ perfilId }: EditarPerfilContentProps) {
  const router = useRouter()
  const [perfilForm, setPerfilForm] = useState({
    nome: "",
    descricao: "",
    cor: "#3b82f6",
    permissoes: [] as string[],
    ativo: true
  })
  const [loading, setLoading] = useState(true)
  const [perfilOriginal, setPerfilOriginal] = useState<Perfil | null>(null)

  // Carregar dados do perfil ao montar o componente
  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        // Simular busca por ID (em produção seria uma chamada para API)
        const perfil = perfisMock.find(p => p.id === perfilId)
        
        if (!perfil) {
          toast({
            title: "Erro",
            description: "Perfil não encontrado.",
            variant: "destructive"
          })
          router.push('/seguranca/permissoes')
          return
        }

        setPerfilOriginal(perfil)
        setPerfilForm({
          nome: perfil.nome,
          descricao: perfil.descricao,
          cor: perfil.cor,
          permissoes: perfil.permissoes,
          ativo: perfil.ativo
        })
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar dados do perfil.",
          variant: "destructive"
        })
        router.push('/seguranca/permissoes')
      } finally {
        setLoading(false)
      }
    }

    carregarPerfil()
  }, [perfilId, router])

  const handleSavePerfil = () => {
    if (!perfilForm.nome.trim()) {
      toast({
        title: "Erro",
        description: "O nome do perfil é obrigatório.",
        variant: "destructive"
      })
      return
    }

    if (!perfilForm.descricao.trim()) {
      toast({
        title: "Erro",
        description: "A descrição do perfil é obrigatória.",
        variant: "destructive"
      })
      return
    }

    // Aqui você faria a chamada para a API para atualizar o perfil
    // Por enquanto, apenas simulamos o sucesso
    toast({
      title: "Perfil atualizado",
      description: "O perfil foi atualizado com sucesso.",
    })

    // Redireciona de volta para a página de permissões
    router.push('/seguranca/permissoes')
  }

  const handleCancel = () => {
    router.push('/seguranca/permissoes')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados do perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>

      {/* Título da página */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Editar Perfil</h1>
        <p className="text-gray-600 mt-1">
          Edite as informações e permissões do perfil "{perfilOriginal?.nome}"
        </p>
      </div>

      {/* Formulário */}
      <div className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Informações do Perfil
            </CardTitle>
            <CardDescription>
              Edite as informações básicas do perfil de acesso.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome-perfil">Nome do Perfil *</Label>
              <Input
                id="nome-perfil"
                value={perfilForm.nome}
                onChange={(e) => setPerfilForm(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Administrador, Atendente"
              />
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

            <div className="flex items-center space-x-2">
              <Switch
                id="ativo-perfil"
                checked={perfilForm.ativo}
                onCheckedChange={(checked) => setPerfilForm(prev => ({ ...prev, ativo: checked }))}
              />
              <Label htmlFor="ativo-perfil">Perfil ativo</Label>
            </div>
          </CardContent>
        </Card>

        {/* Permissões */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              Permissões do Perfil
            </CardTitle>
            <CardDescription>
              Selecione as permissões que este perfil terá acesso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-8">
                {categorias.map(categoria => (
                  <TabsTrigger key={categoria.id} value={categoria.id} className="flex items-center gap-2">
                    {categoria.icon}
                    {categoria.nome}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categorias.map(categoria => {
                const permissoesCategoria = permissoesMock.filter(p => {
                  // Mapeamento correto das categorias
                  const categoriaMap: Record<string, string> = {
                    'dashboard': 'Dashboard',
                    'clientes': 'Clientes', 
                    'atendimentos': 'Atendimentos',
                    'agenda': 'Agenda',
                    'faq': 'FAQ',
                    'relatorios': 'Relatórios',
                    'preferencias': 'Preferências',
                    'seguranca': 'Segurança'
                  }
                  return p.categoria === categoriaMap[categoria.id]
                })
                
                if (permissoesCategoria.length === 0) return null

                // Categorias que devem ter acordeons
                const categoriasComAcordeon = ['clientes', 'atendimentos', 'relatorios', 'preferencias', 'seguranca']
                const temAcordeon = categoriasComAcordeon.includes(categoria.id)

                return (
                  <TabsContent key={categoria.id} value={categoria.id} className="mt-4">
                    <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                      {temAcordeon ? (
                        // Renderizar com acordeons
                        <div className="space-y-3">
                          {(() => {
                            // Agrupar permissões por acordeon
                            const acordeons = permissoesCategoria.reduce((acc, permissao) => {
                              const acordeonNome = permissao.acordeon || 'Outras'
                              if (!acc[acordeonNome]) {
                                acc[acordeonNome] = []
                              }
                              acc[acordeonNome].push(permissao)
                              return acc
                            }, {} as Record<string, typeof permissoesCategoria>)

                            // Verificar se todas as permissões da categoria estão selecionadas
                            const todasPermissoesCategoria = permissoesCategoria.map(p => p.id)
                            const todasSelecionadasCategoria = todasPermissoesCategoria.every(id => 
                              perfilForm.permissoes.includes(id)
                            )

                            return (
                              <div className="space-y-4">
                                {/* Botão Selecionar/Desmarcar Todos */}
                                <div className="flex justify-between items-center pb-2 border-b">
                                  <span className="text-sm font-medium text-gray-700">
                                    {permissoesCategoria.length} permissão{permissoesCategoria.length !== 1 ? 'ões' : ''} disponível{permissoesCategoria.length !== 1 ? 'is' : ''}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      if (todasSelecionadasCategoria) {
                                        // Desmarcar todas as permissões da categoria
                                        setPerfilForm(prev => ({
                                          ...prev,
                                          permissoes: prev.permissoes.filter(id => 
                                            !todasPermissoesCategoria.includes(id)
                                          )
                                        }))
                                      } else {
                                        // Selecionar todas as permissões da categoria
                                        const novasPermissoes = [...new Set([
                                          ...perfilForm.permissoes,
                                          ...todasPermissoesCategoria
                                        ])]
                                        setPerfilForm(prev => ({
                                          ...prev,
                                          permissoes: novasPermissoes
                                        }))
                                      }
                                    }}
                                    className="text-xs"
                                  >
                                    {todasSelecionadasCategoria ? 'Desmarcar todos' : 'Selecionar todos'}
                                  </Button>
                                </div>
                                <Accordion type="multiple" className="w-full">
                                  {Object.entries(acordeons).map(([acordeonNome, permissoes]) => {
                                    // Verificar se todas as permissões do acordeon estão selecionadas
                                    const todasSelecionadasAcordeon = permissoes.every(p => 
                                      perfilForm.permissoes.includes(p.id)
                                    )
                                    
                                    return (
                                      <AccordionItem key={acordeonNome} value={acordeonNome}>
                                        <AccordionTrigger className="text-sm font-medium">
                                          <div className="flex items-center justify-between w-full pr-4">
                                            <span>{acordeonNome}</span>
                                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                              <Checkbox
                                                checked={todasSelecionadasAcordeon}
                                                onCheckedChange={(checked) => {
                                                  if (checked) {
                                                    // Selecionar todas as permissões do acordeon
                                                    const novasPermissoes = [...new Set([
                                                      ...perfilForm.permissoes,
                                                      ...permissoes.map(p => p.id)
                                                    ])]
                                                    setPerfilForm(prev => ({
                                                      ...prev,
                                                      permissoes: novasPermissoes
                                                    }))
                                                  } else {
                                                    // Desmarcar todas as permissões do acordeon
                                                    setPerfilForm(prev => ({
                                                      ...prev,
                                                      permissoes: prev.permissoes.filter(id => 
                                                        !permissoes.map(p => p.id).includes(id)
                                                      )
                                                    }))
                                                  }
                                                }}
                                              />
                                              <span className="text-xs text-gray-500">
                                                {permissoes.filter(p => perfilForm.permissoes.includes(p.id)).length}/{permissoes.length}
                                              </span>
                                            </div>
                                          </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                          <div className="space-y-3">
                                            {permissoes.map(permissao => (
                                              <div key={permissao.id} className="flex items-center space-x-3">
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
                                                <div className="flex-1">
                                                  <Label htmlFor={`perm-${permissao.id}`} className="text-sm font-medium cursor-pointer">
                                                    {permissao.nome}
                                                  </Label>
                                                  <p className="text-xs text-gray-500 mt-1">{permissao.descricao}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  {permissao.ativo ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                                      <CheckCircle className="h-3 w-3" />
                                                      Ativo
                                                    </span>
                                                  ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                                                      <XCircle className="h-3 w-3" />
                                                      Inativo
                                                    </span>
                                                  )}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </AccordionContent>
                                      </AccordionItem>
                                    )
                                  })}
                                </Accordion>
                              </div>
                            )
                          })()}
                        </div>
                      ) : (
                        // Renderizar sem acordeons (Dashboard, Agenda, FAQ)
                        <div className="space-y-4">
                          {/* Botão Selecionar/Desmarcar Todos */}
                          <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-sm font-medium text-gray-700">
                              {permissoesCategoria.length} permissão{permissoesCategoria.length !== 1 ? 'ões' : ''} disponível{permissoesCategoria.length !== 1 ? 'is' : ''}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Verificar se todas as permissões da categoria estão selecionadas
                                const todasPermissoesCategoria = permissoesCategoria.map(p => p.id)
                                const todasSelecionadas = todasPermissoesCategoria.every(id => 
                                  perfilForm.permissoes.includes(id)
                                )
                                
                                if (todasSelecionadas) {
                                  // Desmarcar todas as permissões da categoria
                                  setPerfilForm(prev => ({
                                    ...prev,
                                    permissoes: prev.permissoes.filter(id => 
                                      !todasPermissoesCategoria.includes(id)
                                    )
                                  }))
                                } else {
                                  // Selecionar todas as permissões da categoria
                                  const novasPermissoes = [...new Set([
                                    ...perfilForm.permissoes,
                                    ...todasPermissoesCategoria
                                  ])]
                                  setPerfilForm(prev => ({
                                    ...prev,
                                    permissoes: novasPermissoes
                                  }))
                                }
                              }}
                              className="text-xs"
                            >
                              {(() => {
                                const todasPermissoesCategoria = permissoesCategoria.map(p => p.id)
                                const todasSelecionadas = todasPermissoesCategoria.every(id => 
                                  perfilForm.permissoes.includes(id)
                                )
                                return todasSelecionadas ? 'Desmarcar todos' : 'Selecionar todos'
                              })()}
                            </Button>
                          </div>
                          
                          {/* Lista de Permissões */}
                          <div className="space-y-3">
                            {permissoesCategoria.map(permissao => (
                              <div key={permissao.id} className="flex items-center space-x-3">
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
                                <div className="flex-1">
                                  <Label htmlFor={`perm-${permissao.id}`} className="text-sm font-medium cursor-pointer">
                                    {permissao.nome}
                                  </Label>
                                  <p className="text-xs text-gray-500 mt-1">{permissao.descricao}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {permissao.ativo ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                      <CheckCircle className="h-3 w-3" />
                                      Ativo
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                                      <XCircle className="h-3 w-3" />
                                      Inativo
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      {perfilForm.permissoes.length} permissão{perfilForm.permissoes.length !== 1 ? 'ões' : ''} selecionada{perfilForm.permissoes.length !== 1 ? 's' : ''}
                    </p>
                  </TabsContent>
                )
              })}
            </Tabs>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="px-6"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSavePerfil}
            className="px-6 bg-[#26B99D] hover:bg-[#1f9a7f] text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  )
}