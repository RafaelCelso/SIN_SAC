"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

interface NovoMotivo {
  nome: string;
  status: "Ativo" | "Inativo";
  tipo: "Principal" | "Subcategoria" | "Detalhe";
  categoriaPrincipal?: string;
  subcategoria?: string;
}

export default function NovoMotivoPage() {
  const router = useRouter();
  const [motivo, setMotivo] = useState<NovoMotivo>({
    nome: "",
    status: "Ativo",
    tipo: "Principal",
  });

  const [categoriasPrincipais, setCategoriasPrincipais] = useState<string[]>([]);
  const [subcategorias, setSubcategorias] = useState<string[]>([]);

  // Simular carregamento das categorias principais
  useEffect(() => {
    // Aqui você faria uma chamada à API para buscar as categorias principais
    const carregarCategoriasPrincipais = async () => {
      try {
        // Simulando dados da API
        const categorias = ["Reclamação", "Solicitação", "Dúvida", "Sugestão"];
        setCategoriasPrincipais(categorias);
      } catch (error) {
        console.error("Erro ao carregar categorias principais:", error);
      }
    };

    if (motivo.tipo !== "Principal") {
      carregarCategoriasPrincipais();
    }
  }, [motivo.tipo]);

  // Simular carregamento das subcategorias
  useEffect(() => {
    // Aqui você faria uma chamada à API para buscar as subcategorias
    const carregarSubcategorias = async () => {
      try {
        // Simulando dados da API
        const subcategorias = ["Produto", "Atendimento", "Entrega", "Preço"];
        setSubcategorias(subcategorias);
      } catch (error) {
        console.error("Erro ao carregar subcategorias:", error);
      }
    };

    if (motivo.tipo === "Detalhe" && motivo.categoriaPrincipal) {
      carregarSubcategorias();
    }
  }, [motivo.tipo, motivo.categoriaPrincipal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação dos campos
    if (!motivo.nome.trim()) {
      toast({
        title: "Erro",
        description: "O nome do motivo é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (motivo.tipo !== "Principal" && !motivo.categoriaPrincipal) {
      toast({
        title: "Erro",
        description: "A categoria principal é obrigatória",
        variant: "destructive",
      });
      return;
    }

    if (motivo.tipo === "Detalhe" && !motivo.subcategoria) {
      toast({
        title: "Erro",
        description: "A subcategoria é obrigatória",
        variant: "destructive",
      });
      return;
    }

    // Aqui você chamaria a API para salvar o novo motivo
    console.log("Novo motivo:", motivo);
    toast({
      title: "Sucesso",
      description: "Motivo cadastrado com sucesso",
    });
    router.push("/motivos");
  };

  const handleTipoChange = (value: "Principal" | "Subcategoria" | "Detalhe") => {
    setMotivo({
      ...motivo,
      tipo: value,
      categoriaPrincipal: "",
      subcategoria: "",
    });
  };

  const handleCategoriaPrincipalChange = (value: string) => {
    setMotivo({
      ...motivo,
      categoriaPrincipal: value,
      subcategoria: "",
    });
  };

  const handleSubcategoriaChange = (value: string) => {
    setMotivo({
      ...motivo,
      subcategoria: value,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="bg-gradient-to-r from-[#E6F7F5] to-[#F0FAF8] p-4 rounded-lg border border-[#26B99D] flex-1">
            <h1 className="text-2xl font-bold text-[#26B99D]">Novo Motivo</h1>
            <p className="text-sm text-[#26B99D] mt-1">Cadastro de novo motivo</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Motivo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={motivo.nome}
                  onChange={(e) => setMotivo({ ...motivo, nome: e.target.value })}
                  placeholder="Digite o nome do motivo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select
                  value={motivo.tipo}
                  onValueChange={handleTipoChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Principal">Principal</SelectItem>
                    <SelectItem value="Subcategoria">Subcategoria</SelectItem>
                    <SelectItem value="Detalhe">Detalhe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {motivo.tipo !== "Principal" && (
                <div className="space-y-2">
                  <Label htmlFor="categoriaPrincipal">Categoria Principal</Label>
                  <Select
                    value={motivo.categoriaPrincipal}
                    onValueChange={handleCategoriaPrincipalChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria principal" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriasPrincipais.map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>
                          {categoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {motivo.tipo === "Detalhe" && (
                <div className="space-y-2">
                  <Label htmlFor="subcategoria">Subcategoria</Label>
                  <Select
                    value={motivo.subcategoria}
                    onValueChange={handleSubcategoriaChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a subcategoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategorias.map((subcategoria) => (
                        <SelectItem key={subcategoria} value={subcategoria}>
                          {subcategoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={motivo.status}
                  onValueChange={(value: "Ativo" | "Inativo") => setMotivo({ ...motivo, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/motivos")}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-[#26B99D] hover:bg-[#1E9A82]"
                >
                  Salvar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 