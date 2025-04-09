"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UsuarioDetalhes {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  status: "Ativo" | "Inativo";
  senha?: string;
}

export default function UsuarioDetalhesPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [usuario, setUsuario] = useState<UsuarioDetalhes>({
    id: params.id,
    nome: "João Silva", // Mock - substituir por dados da API
    email: "joao.silva@empresa.com",
    perfil: "Administrador",
    status: "Ativo",
  });
  const [formData, setFormData] = useState(usuario);

  const perfis = ["Administrador", "Analista", "Supervisor", "Usuário"];

  const handleStatusChange = () => {
    setUsuario(prev => ({
      ...prev,
      status: prev.status === "Ativo" ? "Inativo" : "Ativo"
    }));
    // Aqui você chamaria a API para atualizar o status
  };

  const handleSaveEdit = () => {
    setUsuario(formData);
    setIsEditing(false);
    // Aqui você chamaria a API para atualizar os dados
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="bg-gradient-to-r from-[#E6F7F5] to-[#F0FAF8] p-4 rounded-lg border border-[#26B99D] flex-1">
            <h1 className="text-2xl font-bold text-[#26B99D]">Detalhes do Usuário</h1>
            <p className="text-sm text-[#26B99D] mt-1">Visualização e edição do usuário</p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleStatusChange}
            className={usuario.status === "Ativo" ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
          >
            {usuario.status === "Ativo" ? "Desativar" : "Ativar"}
          </Button>
          {!isEditing && (
            <Button
              className="bg-[#26B99D] hover:bg-[#1E9A82]"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
          )}
        </div>

        <Card>
          <CardContent className="pt-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="perfil">Perfil</Label>
                    <Select
                      value={formData.perfil}
                      onValueChange={(value) => setFormData({ ...formData, perfil: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        {perfis.map((perfil) => (
                          <SelectItem key={perfil} value={perfil}>
                            {perfil}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senha">Nova Senha (opcional)</Label>
                    <Input
                      id="senha"
                      type="password"
                      placeholder="Digite a nova senha"
                      onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button className="bg-[#26B99D] hover:bg-[#1E9A82]" onClick={handleSaveEdit}>
                    Salvar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-500">Nome</Label>
                    <p className="text-base">{usuario.nome}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Email</Label>
                    <p className="text-base">{usuario.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Perfil</Label>
                    <p className="text-base">{usuario.perfil}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Status</Label>
                    <Badge 
                      variant="outline" 
                      className={usuario.status === "Ativo" 
                        ? "bg-green-50 text-green-700 border-green-200" 
                        : "bg-red-50 text-red-700 border-red-200"}
                    >
                      {usuario.status}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 