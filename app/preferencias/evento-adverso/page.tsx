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
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface EventoAdverso {
  id: string;
  nome: string;
  status: "Ativo" | "Inativo";
  gravidade: "Grave" | "Moderado" | "Leve";
}

export default function EventoAdversoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [gravidadeFilter, setGravidadeFilter] = useState<"Grave" | "Moderado" | "Leve" | null>(null);
  const itemsPerPage = 15;

  // Estados para os modais
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvento, setEditingEvento] = useState<EventoAdverso | null>(null);

  // Estados para os formulários
  const [newEventoNome, setNewEventoNome] = useState("");
  const [newEventoStatus, setNewEventoStatus] = useState<"Ativo" | "Inativo">("Ativo");
  const [newEventoGravidade, setNewEventoGravidade] = useState<"Grave" | "Moderado" | "Leve">("Leve");
  const [editEventoNome, setEditEventoNome] = useState("");
  const [editEventoStatus, setEditEventoStatus] = useState<"Ativo" | "Inativo">("Ativo");
  const [editEventoGravidade, setEditEventoGravidade] = useState<"Grave" | "Moderado" | "Leve">("Leve");

  // Mock de dados - Substituir por dados reais da API
  const [eventosAdversos, setEventosAdversos] = useState<EventoAdverso[]>([
    {
      id: "129",
      nome: "Elogios",
      status: "Ativo",
      gravidade: "Leve",
    },
    {
      id: "116",
      nome: "Sugestão",
      status: "Ativo",
      gravidade: "Leve",
    },
    {
      id: "105",
      nome: "Reclamação",
      status: "Ativo",
      gravidade: "Moderado",
    },
    {
      id: "98",
      nome: "Denúncia",
      status: "Ativo",
      gravidade: "Moderado",
    },
    {
      id: "97",
      nome: "Outros",
      status: "Ativo",
      gravidade: "Leve",
    },
    {
      id: "96",
      nome: "Suspeita de Transmissão de Agente Infeccioso",
      status: "Ativo",
      gravidade: "Grave",
    },
    {
      id: "95",
      nome: "Uso off-label",
      status: "Ativo",
      gravidade: "Moderado",
    },
  ]);

  // Funções para manipular os modais
  const handleAddEvento = () => {
    if (!newEventoNome.trim()) {
      toast({
        title: "Erro",
        description: "Nome do evento adverso é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const newEvento: EventoAdverso = {
      id: (Date.now()).toString(),
      nome: newEventoNome.trim(),
      status: newEventoStatus,
      gravidade: newEventoGravidade,
    };

    setEventosAdversos(prev => [...prev, newEvento]);
    setNewEventoNome("");
    setNewEventoStatus("Ativo");
    setNewEventoGravidade("Leve");
    setIsAddModalOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Evento adverso adicionado com sucesso",
    });
  };

  const handleEditEvento = () => {
    if (!editEventoNome.trim()) {
      toast({
        title: "Erro",
        description: "Nome do evento adverso é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (!editingEvento) return;

    setEventosAdversos(prev => 
      prev.map(evento => 
        evento.id === editingEvento.id 
          ? { ...evento, nome: editEventoNome.trim(), status: editEventoStatus, gravidade: editEventoGravidade }
          : evento
      )
    );

    setIsEditModalOpen(false);
    setEditingEvento(null);
    
    toast({
      title: "Sucesso",
      description: "Evento adverso atualizado com sucesso",
    });
  };

  const openEditModal = (evento: EventoAdverso) => {
    setEditingEvento(evento);
    setEditEventoNome(evento.nome);
    setEditEventoStatus(evento.status);
    setEditEventoGravidade(evento.gravidade);
    setIsEditModalOpen(true);
  };

  const handleDeleteEvento = (id: string) => {
    setEventosAdversos(prev => prev.filter(evento => evento.id !== id));
    toast({
      title: "Sucesso",
      description: "Evento adverso removido com sucesso",
    });
  };

  const filteredEventos = eventosAdversos.filter((evento) => {
    const matchesSearch = evento.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? evento.status === statusFilter : true;
    const matchesGravidade = gravidadeFilter ? evento.gravidade === gravidadeFilter : true;
    return matchesSearch && matchesStatus && matchesGravidade;
  });

  const totalPages = Math.ceil(filteredEventos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEventos = filteredEventos.slice(startIndex, endIndex);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="p-4 rounded-lg flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Eventos Adversos</h1>
            <p className="text-sm text-gray-600 mt-1">Gerenciamento de eventos adversos</p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            className="bg-[#26B99D] hover:bg-[#1E9A82]"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Evento Adverso
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Lista de Eventos Adversos</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter || "todos"} onValueChange={(value) => setStatusFilter(value === "todos" ? null : value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todos os Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
              <Select value={gravidadeFilter || "todas"} onValueChange={(value) => setGravidadeFilter(value === "todas" ? null : (value as "Grave" | "Moderado" | "Leve"))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todas as Gravidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as Gravidades</SelectItem>
                  <SelectItem value="Grave">Grave</SelectItem>
                  <SelectItem value="Moderado">Moderado</SelectItem>
                  <SelectItem value="Leve">Leve</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">
                      <div className="flex items-center gap-1">
                        ID
                        <div className="flex flex-col">
                          <button className="text-xs text-gray-400 hover:text-gray-600">▲</button>
                          <button className="text-xs text-gray-400 hover:text-gray-600">▼</button>
                        </div>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Nome
                        <div className="flex flex-col">
                          <button className="text-xs text-gray-400 hover:text-gray-600">▲</button>
                          <button className="text-xs text-gray-400 hover:text-gray-600">▼</button>
                        </div>
                      </div>
                    </TableHead>
                    <TableHead>Gravidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[120px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentEventos.map((evento) => (
                    <TableRow key={evento.id}>
                      <TableCell className="font-medium">{evento.id}</TableCell>
                      <TableCell>{evento.nome}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            evento.gravidade === "Grave"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : evento.gravidade === "Moderado"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-green-50 text-green-700 border-green-200"
                          }
                        >
                          {evento.gravidade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={evento.status === "Ativo" 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : "bg-red-50 text-red-700 border-red-200"}
                        >
                          {evento.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(evento)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEvento(evento.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredEventos.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum evento adverso encontrado.
              </div>
            )}

            {totalPages > 1 && (
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal para adicionar evento adverso */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Evento Adverso</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <Input
                id="nome"
                value={newEventoNome}
                onChange={(e) => setNewEventoNome(e.target.value)}
                className="col-span-3"
                placeholder="Digite o nome do evento adverso"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={newEventoStatus} onValueChange={(value: "Ativo" | "Inativo") => setNewEventoStatus(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gravidade" className="text-right">
                Gravidade
              </Label>
              <Select value={newEventoGravidade} onValueChange={(value: "Grave" | "Moderado" | "Leve") => setNewEventoGravidade(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a gravidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Grave">Grave</SelectItem>
                  <SelectItem value="Moderado">Moderado</SelectItem>
                  <SelectItem value="Leve">Leve</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddEvento} className="bg-[#26B99D] hover:bg-[#1E9A82]">
              Adicionar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para editar evento adverso */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Evento Adverso</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-nome" className="text-right">
                Nome
              </Label>
              <Input
                id="edit-nome"
                value={editEventoNome}
                onChange={(e) => setEditEventoNome(e.target.value)}
                className="col-span-3"
                placeholder="Digite o nome do evento adverso"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select value={editEventoStatus} onValueChange={(value: "Ativo" | "Inativo") => setEditEventoStatus(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-gravidade" className="text-right">
                Gravidade
              </Label>
              <Select value={editEventoGravidade} onValueChange={(value: "Grave" | "Moderado" | "Leve") => setEditEventoGravidade(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a gravidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Grave">Grave</SelectItem>
                  <SelectItem value="Moderado">Moderado</SelectItem>
                  <SelectItem value="Leve">Leve</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditEvento} className="bg-[#26B99D] hover:bg-[#1E9A82]">
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
} 