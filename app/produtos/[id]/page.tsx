"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit2, Check, X } from "lucide-react";
import { Table, TableHeader, TableBody, TableCell, TableRow, TableHead } from "@/components/ui/table";

interface Produto {
  id: string;
  nome: string;
  ean: string;
  sku: string;
  status: "Ativo" | "Inativo";
  lotes: { id: string; numero: string; dataFabricacao: string; dataValidade: string }[];
}

export default function DetalhesProdutoPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [produto, setProduto] = useState<Produto>({
    id: params.id,
    nome: "Produto Exemplo",
    ean: "7891234567890",
    sku: "SKU001",
    status: "Ativo",
    lotes: [
      {
        id: "1",
        numero: "LOT001",
        dataFabricacao: "2024-01-01",
        dataValidade: "2025-01-01"
      },
      {
        id: "2",
        numero: "LOT002",
        dataFabricacao: "2024-02-01",
        dataValidade: "2025-02-01"
      }
    ]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = () => {
    setProduto((prev) => ({
      ...prev,
      status: prev.status === "Ativo" ? "Inativo" : "Ativo",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementará a lógica para atualizar o produto
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="bg-gradient-to-r from-[#E6F7F5] to-[#F0FAF8] p-4 rounded-lg border border-[#26B99D] flex-1">
            <h1 className="text-2xl font-bold text-[#26B99D]">Detalhes do Produto</h1>
            <p className="text-sm text-[#26B99D] mt-1">Visualize e edite as informações do produto</p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <div className="flex gap-2">
            <Button
              variant={produto.status === "Ativo" ? "default" : "destructive"}
              onClick={handleStatusChange}
              className={produto.status === "Ativo" ? "bg-[#26B99D] hover:bg-[#1E9A82]" : ""}
            >
              {produto.status === "Ativo" ? "Desativar" : "Ativar"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar Edição
                </>
              ) : (
                <>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Editar
                </>
              )}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Informações do Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="id">ID do Produto</Label>
                  <Input
                    id="id"
                    value={produto.id}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Produto</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={produto.nome}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ean">EAN</Label>
                  <Input
                    id="ean"
                    name="ean"
                    value={produto.ean}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={produto.sku}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={produto.status === "Ativo" ? "default" : "outline"}
                      className={produto.status === "Ativo" ? "bg-[#26B99D] hover:bg-[#1E9A82]" : ""}
                      onClick={() => handleStatusChange()}
                      disabled={!isEditing}
                    >
                      {produto.status === "Ativo" ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Ativo
                        </>
                      ) : (
                        <>
                          <X className="mr-2 h-4 w-4" />
                          Inativo
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4">
                  <Button type="submit" className="bg-[#26B99D] hover:bg-[#1E9A82]">
                    <Check className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Seção de Lotes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lotes do Produto</h2>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número do Lote</TableHead>
                  <TableHead>Data de Fabricação</TableHead>
                  <TableHead>Data de Validade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produto.lotes.map((lote) => (
                  <TableRow key={lote.id}>
                    <TableCell>{lote.numero}</TableCell>
                    <TableCell>{new Date(lote.dataFabricacao).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{new Date(lote.dataValidade).toLocaleDateString('pt-BR')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 