"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { NovoUsuarioModal } from "@/components/novo-usuario-modal";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  status: "Ativo" | "Inativo";
}

export default function UsuariosPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [perfilFilter, setPerfilFilter] = useState<string | null>(null);
  const [showNovoUsuarioModal, setShowNovoUsuarioModal] = useState(false);
  const itemsPerPage = 15;

  // Mock de dados - Substituir por dados reais da API
  const usuarios: Usuario[] = [
    {
      id: "1",
      nome: "João Silva",
      email: "joao.silva@empresa.com",
      perfil: "Administrador",
      status: "Ativo",
    },
    {
      id: "2",
      nome: "Maria Santos",
      email: "maria.santos@empresa.com",
      perfil: "Analista",
      status: "Ativo",
    },
    {
      id: "3",
      nome: "Pedro Oliveira",
      email: "pedro.oliveira@empresa.com",
      perfil: "Supervisor",
      status: "Inativo",
    },
  ];

  // Lista de perfis únicos para o filtro
  const perfis = [...new Set(usuarios.map(user => user.perfil))];

  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchesSearch = 
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? usuario.status === statusFilter : true;
    const matchesPerfil = perfilFilter ? usuario.perfil === perfilFilter : true;
    return matchesSearch && matchesStatus && matchesPerfil;
  });

  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsuarios = filteredUsuarios.slice(startIndex, endIndex);

  const handleNovoUsuario = (usuario: { nome: string; email: string; perfil: string; senha: string }) => {
    // Aqui você chamaria a API para criar o usuário
    console.log("Novo usuário:", usuario);
    setShowNovoUsuarioModal(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="p-4 rounded-lg flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
            <p className="text-sm text-gray-600 mt-1">Gerenciamento de usuários do sistema</p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            className="bg-[#26B99D] hover:bg-[#1E9A82]"
            onClick={() => setShowNovoUsuarioModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Usuário
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Lista de Usuários</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={perfilFilter || "todos"} onValueChange={(value) => setPerfilFilter(value === "todos" ? null : value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todos os perfis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os perfis</SelectItem>
                  {perfis.map((perfil) => (
                    <SelectItem key={perfil} value={perfil}>{perfil}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter || "todos"} onValueChange={(value) => setStatusFilter(value === "todos" ? null : value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentUsuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell>{usuario.id}</TableCell>
                      <TableCell>{usuario.nome}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>{usuario.perfil}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={usuario.status === "Ativo" 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : "bg-red-50 text-red-700 border-red-200"}
                        >
                          {usuario.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          onClick={() => router.push(`/usuarios/${usuario.id}`)}
                        >
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="py-2">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <NovoUsuarioModal
        open={showNovoUsuarioModal}
        onOpenChange={setShowNovoUsuarioModal}
        onSave={handleNovoUsuario}
      />
    </DashboardLayout>
  );
} 