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
import { Plus, Search, Filter, X, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Produto {
  id: string;
  nome: string;
  ean: string;
  sku: string;
  status: "Ativo" | "Inativo";
}

export default function ProdutosPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const itemsPerPage = 15;

  // Mock de dados - Substituir por dados reais da API
  const produtos: Produto[] = [
    {
      id: "1",
      nome: "Produto Exemplo",
      ean: "7891234567890",
      sku: "SKU001",
      status: "Ativo",
    },
    {
      id: "2",
      nome: "Produto Inativo",
      ean: "7891234567891",
      sku: "SKU002",
      status: "Inativo",
    },
  ];

  const filteredProdutos = produtos.filter((produto) => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? produto.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProdutos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProdutos = filteredProdutos.slice(startIndex, endIndex);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Aqui você implementaria a lógica de upload do arquivo
      console.log("Arquivo selecionado:", file);
      // Após o upload bem-sucedido:
      setShowImportModal(false);
    }
  };

  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/templates/produtos-import-template.xlsx';
    link.download = 'modelo-importacao-produtos.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="bg-gradient-to-r from-[#E6F7F5] to-[#F0FAF8] p-4 rounded-lg border border-[#26B99D] flex-1">
            <h1 className="text-2xl font-bold text-[#26B99D]">Produtos</h1>
            <p className="text-sm text-[#26B99D] mt-1">Gerenciamento de produtos e estoque</p>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline"
            className="bg-white hover:bg-gray-100"
            onClick={() => setShowImportModal(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Importar Produtos / Lote
          </Button>
          <Button 
            className="bg-[#26B99D] hover:bg-[#1E9A82]"
            onClick={() => router.push("/produtos/novo")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Produto
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Lista de Produtos</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
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
                    <TableHead>Produto</TableHead>
                    <TableHead>EAN</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentProdutos.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell>{produto.id}</TableCell>
                      <TableCell>{produto.nome}</TableCell>
                      <TableCell>{produto.ean}</TableCell>
                      <TableCell>{produto.sku}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={produto.status === "Ativo" 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : "bg-red-50 text-red-700 border-red-200"}
                        >
                          {produto.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          onClick={() => router.push(`/produtos/${produto.id}`)}
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

        {/* Modal de Importação */}
        <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Importar Produtos / Lote</DialogTitle>
              <DialogDescription>
                Faça o upload do arquivo Excel (.xlsx) com os dados dos produtos seguindo o modelo fornecido.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Instruções</Label>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>1. Baixe o modelo de arquivo clicando no botão abaixo</p>
                  <p>2. Preencha os dados dos produtos conforme o modelo</p>
                  <p>3. Salve o arquivo em formato .xlsx</p>
                  <p>4. Faça o upload do arquivo preenchido</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Modelo do Arquivo</Label>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={downloadTemplate}
                >
                  Baixar Modelo de Importação
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Upload do Arquivo</Label>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="picture" className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-[#26B99D] transition-colors">
                    <Upload className="h-4 w-4 mx-auto mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Clique para selecionar ou arraste o arquivo aqui
                    </span>
                    <Input
                      id="picture"
                      type="file"
                      accept=".xlsx"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Formato aceito: .xlsx (Excel) - Tamanho máximo: 10MB
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
} 