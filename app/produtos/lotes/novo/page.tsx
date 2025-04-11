"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

// Dados simulados de produtos - Substituir por dados reais da API
const PRODUTOS_MOCK = [
  {
    id: "1",
    nome: "Medicamento A",
    ean: "7891234567890",
  },
  {
    id: "2",
    nome: "Medicamento B",
    ean: "7891234567891",
  },
  {
    id: "3",
    nome: "Dispositivo Médico X",
    ean: "7891234567892",
  },
];

export default function NovoLotePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    produtoId: "",
    produtoNome: "",
    lote: "",
    dataFabricacao: "",
    dataValidade: "",
  });
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementará a lógica para salvar o lote
    // Por enquanto, apenas redirecionamos para a lista
    router.push("/produtos");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProdutoSelect = (produto: typeof PRODUTOS_MOCK[0]) => {
    setFormData(prev => ({
      ...prev,
      produtoId: produto.id,
      produtoNome: produto.nome
    }));
    setOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="bg-gradient-to-r from-[#E6F7F5] to-[#F0FAF8] p-4 rounded-lg border border-[#26B99D] flex-1">
            <h1 className="text-2xl font-bold text-[#26B99D]">Novo Lote</h1>
            <p className="text-sm text-[#26B99D] mt-1">Cadastre um novo lote para um produto</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Informações do Lote</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="produto">Produto</Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between h-11"
                      >
                        {formData.produtoNome || "Selecione um produto..."}
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command>
                        <CommandInput placeholder="Buscar produto..." className="h-9" />
                        <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                        <CommandGroup>
                          {PRODUTOS_MOCK.map((produto) => (
                            <CommandItem
                              key={produto.id}
                              value={produto.nome}
                              onSelect={() => handleProdutoSelect(produto)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.produtoId === produto.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{produto.nome}</span>
                                <span className="text-sm text-gray-500">
                                  EAN: {produto.ean}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lote">Número do Lote</Label>
                  <Input
                    id="lote"
                    name="lote"
                    value={formData.lote}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataFabricacao">Data de Fabricação</Label>
                  <Input
                    id="dataFabricacao"
                    name="dataFabricacao"
                    type="date"
                    value={formData.dataFabricacao}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataValidade">Data de Validade</Label>
                  <Input
                    id="dataValidade"
                    name="dataValidade"
                    type="date"
                    value={formData.dataValidade}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button type="submit" className="bg-[#26B99D] hover:bg-[#1E9A82]">
                  Salvar Lote
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 