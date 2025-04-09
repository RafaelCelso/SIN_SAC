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

interface MotivoDetalhes {
  id: string;
  nome: string;
  status: "Ativo" | "Inativo";
}

export default function MotivoDetalhesPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [motivo, setMotivo] = useState<MotivoDetalhes>({
    id: params.id,
    nome: "Devolução por defeito", // Mock - substituir por dados da API
    status: "Ativo", // Mock - substituir por dados da API
  });
  const [novoNome, setNovoNome] = useState(motivo.nome);

  const handleStatusChange = () => {
    setMotivo(prev => ({
      ...prev,
      status: prev.status === "Ativo" ? "Inativo" : "Ativo"
    }));
    // Aqui você chamaria a API para atualizar o status
  };

  const handleSaveEdit = () => {
    setMotivo(prev => ({
      ...prev,
      nome: novoNome
    }));
    setIsEditing(false);
    // Aqui você chamaria a API para atualizar o nome
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="bg-gradient-to-r from-[#E6F7F5] to-[#F0FAF8] p-4 rounded-lg border border-[#26B99D] flex-1">
            <h1 className="text-2xl font-bold text-[#26B99D]">Detalhes do Motivo</h1>
            <p className="text-sm text-[#26B99D] mt-1">Visualização e edição do motivo</p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleStatusChange}
            className={motivo.status === "Ativo" ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
          >
            {motivo.status === "Ativo" ? "Desativar" : "Ativar"}
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
          <CardHeader>
            <CardTitle>Informações do Motivo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>ID</Label>
                <div className="p-2 bg-gray-50 rounded-md">{motivo.id}</div>
              </div>

              <div className="space-y-2">
                <Label>Nome</Label>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Input
                      value={novoNome}
                      onChange={(e) => setNovoNome(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleSaveEdit} className="bg-[#26B99D] hover:bg-[#1E9A82]">
                      Salvar
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setIsEditing(false);
                      setNovoNome(motivo.nome);
                    }}>
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <div className="p-2 bg-gray-50 rounded-md">{motivo.nome}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <div className="p-2">
                  <Badge 
                    variant="outline" 
                    className={motivo.status === "Ativo" 
                      ? "bg-green-50 text-green-700 border-green-200" 
                      : "bg-red-50 text-red-700 border-red-200"}
                  >
                    {motivo.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 