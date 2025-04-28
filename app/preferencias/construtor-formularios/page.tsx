"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

// Dados simulados de formulários
const FORMULARIOS_MOCK = [
  {
    id: "1",
    nome: "Formulário de Queixa Técnica Padrão",
    tipo: "Queixa Técnica",
    dataCriacao: "15/06/2023",
    ultimaEdicao: "20/07/2023",
    status: "Ativo",
  },
  {
    id: "2",
    nome: "Formulário de Informações Médicas Básico",
    tipo: "Informações Médicas",
    dataCriacao: "10/05/2023",
    ultimaEdicao: "15/06/2023",
    status: "Ativo",
  },
  {
    id: "3",
    nome: "Formulário de Farmacovigilância Completo",
    tipo: "Farmacovigilância",
    dataCriacao: "05/04/2023",
    ultimaEdicao: "30/05/2023",
    status: "Ativo",
  },
  {
    id: "4",
    nome: "Formulário de Queixa Técnica Simplificado",
    tipo: "Queixa Técnica",
    dataCriacao: "20/03/2023",
    ultimaEdicao: "10/04/2023",
    status: "Inativo",
  },
  {
    id: "5",
    nome: "Formulário de Farmacovigilância Rápido",
    tipo: "Farmacovigilância",
    dataCriacao: "15/02/2023",
    ultimaEdicao: "25/03/2023",
    status: "Ativo",
  },
]

export default function ConstrutorFormulariosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedFormulario, setSelectedFormulario] = useState<(typeof FORMULARIOS_MOCK)[0] | null>(null)

  // Filtrar formulários com base na busca
  const filteredFormularios = FORMULARIOS_MOCK.filter(
    (formulario) =>
      formulario.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formulario.tipo.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDeleteFormulario = () => {
    if (!selectedFormulario) return

    // Simulação de exclusão
    toast({
      title: "Formulário excluído",
      description: `O formulário "${selectedFormulario.nome}" foi excluído com sucesso.`,
      duration: 3000,
    })

    setIsDeleteDialogOpen(false)
    setSelectedFormulario(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="p-4 rounded-lg flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Construtor de Formulários</h1>
            <p className="text-sm text-gray-600 mt-1">Crie e gerencie formulários personalizados para diferentes tipos de atendimento</p>
          </div>
          <Button asChild className="bg-[#26B99D] hover:bg-[#1E9A82] mt-4 md:mt-0">
            <Link href="/preferencias/construtor-formularios/novo">
              <Plus className="mr-2 h-4 w-4" />
              Novo Formulário
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Formulários Disponíveis</CardTitle>
            <CardDescription>Visualize, edite ou exclua os formulários existentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
              <div className="relative w-full sm:w-[350px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar formulários..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead>Última Edição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFormularios.length > 0 ? (
                    filteredFormularios.map((formulario) => (
                      <TableRow key={formulario.id}>
                        <TableCell className="font-medium">{formulario.nome}</TableCell>
                        <TableCell>{formulario.tipo}</TableCell>
                        <TableCell>{formulario.dataCriacao}</TableCell>
                        <TableCell>{formulario.ultimaEdicao}</TableCell>
                        <TableCell>
                          <Badge
                            variant={formulario.status === "Ativo" ? "default" : "secondary"}
                            className={formulario.status === "Ativo" ? "bg-[#26B99D]" : "bg-gray-200"}
                          >
                            {formulario.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-[#E6F7F5] hover:text-[#26B99D] hover:border-[#26B99D]"
                              asChild
                            >
                              <Link href={`/preferencias/construtor-formularios/${formulario.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                Ver
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-[#E6F7F5] hover:text-[#26B99D] hover:border-[#26B99D]"
                              asChild
                            >
                              <Link href={`/preferencias/construtor-formularios/${formulario.id}/editar`}>
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                              onClick={() => {
                                setSelectedFormulario(formulario)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Excluir
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        Nenhum formulário encontrado com os critérios de busca.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o formulário "{selectedFormulario?.nome}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteFormulario}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

