"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Plus, Clock, Users, Save, X, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns"
import { ptBR } from "date-fns/locale"

// Tipos para os eventos
interface Evento {
  id: string
  titulo: string
  data: Date
  horaInicio: string
  horaFim: string
  participantes: string[]
  comentarios: string
  tipo: "reuniao" | "tarefa" | "lembrete" | "retorno" | "outro"
}

// Dados iniciais de eventos
const EVENTOS_INICIAIS: Evento[] = [
  {
    id: "1",
    titulo: "Reunião com equipe de Farmacovigilância",
    data: new Date(2025, 2, 25), // 25 de março de 2025
    horaInicio: "09:00",
    horaFim: "10:30",
    participantes: ["Ana Silva", "Carlos Mendes", "Juliana Costa"],
    comentarios: "Discutir novos procedimentos para registro de eventos adversos.",
    tipo: "reuniao",
  },
  {
    id: "2",
    titulo: "Treinamento sobre novo sistema",
    data: new Date(2025, 2, 26), // 26 de março de 2025
    horaInicio: "14:00",
    horaFim: "16:00",
    participantes: ["Toda a equipe"],
    comentarios: "Treinamento sobre as novas funcionalidades do sistema de atendimento.",
    tipo: "reuniao",
  },
  {
    id: "3",
    titulo: "Prazo final para relatório mensal",
    data: new Date(2025, 2, 30), // 30 de março de 2025
    horaInicio: "18:00",
    horaFim: "18:00",
    participantes: ["Ana Silva"],
    comentarios: "Entregar relatório mensal de atendimentos.",
    tipo: "tarefa",
  },
  {
    id: "4",
    titulo: "Ligação para cliente Maria Silva",
    data: new Date(2025, 2, 4), // 4 de março de 2025
    horaInicio: "11:00",
    horaFim: "11:30",
    participantes: ["Roberto Alves"],
    comentarios: "Retorno sobre queixa técnica registrada na semana passada.",
    tipo: "lembrete",
  },
]

// Dias da semana em português abreviados
const DIAS_SEMANA = ["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "sáb."]

export default function AgendaPage() {
  const [eventos, setEventos] = useState<Evento[]>(EVENTOS_INICIAIS)
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 1)) // Março de 2025
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2025, 2, 25)) // 25 de março de 2025
  const [novoEvento, setNovoEvento] = useState<Omit<Evento, "id">>({
    titulo: "",
    data: selectedDate || new Date(),
    horaInicio: "09:00",
    horaFim: "10:00",
    participantes: [],
    comentarios: "",
    tipo: "reuniao",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null)
  const [participante, setParticipante] = useState("")
  const [viewMode, setViewMode] = useState<"mes" | "semana" | "lista">("mes")

  // Gerar dias do mês atual
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Função para navegar entre meses
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const goToToday = () => {
    const today = new Date()
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelectedDate(today)
  }

  // Filtrar eventos pela data selecionada
  const eventosDoDia = eventos.filter((evento) => selectedDate && isSameDay(evento.data, selectedDate))

  // Verificar se um dia tem eventos
  const getDayEvents = (day: Date) => {
    return eventos.filter((evento) => isSameDay(evento.data, day))
  }

  // Função para adicionar um novo evento
  const handleAddEvento = () => {
    if (!novoEvento.titulo.trim()) {
      toast({
        title: "Erro",
        description: "O título do evento é obrigatório",
        variant: "destructive",
      })
      return
    }

    const newId = (eventos.length + 1).toString()
    const novoEventoCompleto: Evento = {
      id: newId,
      ...novoEvento,
    }

    setEventos([...eventos, novoEventoCompleto])
    setNovoEvento({
      titulo: "",
      data: selectedDate || new Date(),
      horaInicio: "09:00",
      horaFim: "10:00",
      participantes: [],
      comentarios: "",
      tipo: "reuniao",
    })
    setIsDialogOpen(false)

    toast({
      title: "Sucesso",
      description: "Evento adicionado com sucesso",
    })
  }

  // Função para editar um evento
  const handleEditEvento = () => {
    if (!editingEvento || !editingEvento.titulo.trim()) {
      toast({
        title: "Erro",
        description: "O título do evento é obrigatório",
        variant: "destructive",
      })
      return
    }

    setEventos(eventos.map((evento) => (evento.id === editingEvento.id ? editingEvento : evento)))
    setEditingEvento(null)

    toast({
      title: "Sucesso",
      description: "Evento atualizado com sucesso",
    })
  }

  // Função para excluir um evento
  const handleDeleteEvento = (id: string) => {
    setEventos(eventos.filter((evento) => evento.id !== id))

    toast({
      title: "Sucesso",
      description: "Evento removido com sucesso",
    })
  }

  // Função para adicionar participante
  const handleAddParticipante = () => {
    if (!participante.trim()) return

    if (editingEvento) {
      setEditingEvento({
        ...editingEvento,
        participantes: [...editingEvento.participantes, participante],
      })
    } else {
      setNovoEvento({
        ...novoEvento,
        participantes: [...novoEvento.participantes, participante],
      })
    }

    setParticipante("")
  }

  // Função para remover participante
  const handleRemoveParticipante = (index: number) => {
    if (editingEvento) {
      const newParticipantes = [...editingEvento.participantes]
      newParticipantes.splice(index, 1)
      setEditingEvento({
        ...editingEvento,
        participantes: newParticipantes,
      })
    } else {
      const newParticipantes = [...novoEvento.participantes]
      newParticipantes.splice(index, 1)
      setNovoEvento({
        ...novoEvento,
        participantes: newParticipantes,
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex gap-2">
            <Button variant="secondary" className="bg-gray-200 hover:bg-gray-300 text-gray-700" onClick={goToToday}>
              Hoje
            </Button>
            <div className="flex border rounded-md overflow-hidden">
              <Button variant="ghost" size="icon" className="rounded-none border-r h-10" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-none h-10" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <h1 className="text-2xl font-bold uppercase">{format(currentDate, "MMMM 'DE' yyyy", { locale: ptBR })}</h1>

          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "mes" ? "secondary" : "ghost"}
              className="rounded-none border-r px-4 h-10"
              onClick={() => setViewMode("mes")}
            >
              Mês
            </Button>
            <Button
              variant={viewMode === "semana" ? "secondary" : "ghost"}
              className="rounded-none border-r px-4 h-10"
              onClick={() => setViewMode("semana")}
            >
              Semana
            </Button>
            <Button
              variant={viewMode === "lista" ? "secondary" : "ghost"}
              className="rounded-none px-4 h-10"
              onClick={() => setViewMode("lista")}
            >
              Lista
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          {/* Cabeçalho com dias da semana */}
          <div className="grid grid-cols-7 border-b">
            {DIAS_SEMANA.map((dia, index) => (
              <div key={index} className="text-center py-2 text-blue-500 font-medium border-r last:border-r-0">
                {dia}
              </div>
            ))}
          </div>

          {/* Grid do calendário */}
          <div className="grid grid-cols-7 auto-rows-[120px]">
            {monthDays.map((day, index) => {
              const dayEvents = getDayEvents(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
              const isCurrentDay = isToday(day)

              return (
                <div
                  key={index}
                  className={`border-r border-b last:border-r-0 p-1 relative ${
                    !isCurrentMonth ? "bg-gray-50 text-gray-400" : ""
                  } ${isSelected ? "bg-blue-50" : ""} ${isCurrentDay ? "bg-teal-50" : ""}`}
                  onClick={() => {
                    setSelectedDate(day)
                    setNovoEvento({
                      ...novoEvento,
                      data: day,
                    })
                    setIsDialogOpen(true)
                  }}
                >
                  <div className={`text-right p-1 ${isCurrentDay ? "font-bold text-teal-600" : ""}`}>
                    {day.getDate()}
                  </div>

                  <div className="overflow-y-auto max-h-[80px]">
                    {dayEvents.slice(0, 3).map((evento, idx) => (
                      <div
                        key={idx}
                        className={`text-xs p-1 mb-1 rounded truncate ${
                          evento.tipo === "reuniao"
                            ? "bg-blue-100 text-blue-800"
                            : evento.tipo === "tarefa"
                              ? "bg-amber-100 text-amber-800"
                              : evento.tipo === "lembrete"
                                ? "bg-purple-100 text-purple-800"
                                : evento.tipo === "retorno"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingEvento(evento)
                        }}
                      >
                        {evento.horaInicio} - {evento.titulo}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-center text-gray-500">+{dayEvents.length - 3} mais</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Dialog para adicionar evento */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Evento</DialogTitle>
              <DialogDescription>Preencha os detalhes do evento abaixo.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  placeholder="Título do evento"
                  value={novoEvento.titulo}
                  onChange={(e) => setNovoEvento({ ...novoEvento, titulo: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Evento</Label>
                  <Select
                    value={novoEvento.tipo}
                    onValueChange={(value: "reuniao" | "tarefa" | "lembrete" | "retorno" | "outro") =>
                      setNovoEvento({ ...novoEvento, tipo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reuniao">Reunião</SelectItem>
                      <SelectItem value="tarefa">Tarefa</SelectItem>
                      <SelectItem value="lembrete">Lembrete</SelectItem>
                      <SelectItem value="retorno">Retorno</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Data</Label>
                  <Input
                    type="date"
                    value={format(novoEvento.data, "yyyy-MM-dd")}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : new Date()
                      setNovoEvento({ ...novoEvento, data: date })
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="horaInicio">Hora de Início</Label>
                  <Input
                    id="horaInicio"
                    type="time"
                    value={novoEvento.horaInicio}
                    onChange={(e) => setNovoEvento({ ...novoEvento, horaInicio: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horaFim">Hora de Término</Label>
                  <Input
                    id="horaFim"
                    type="time"
                    value={novoEvento.horaFim}
                    onChange={(e) => setNovoEvento({ ...novoEvento, horaFim: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Participantes</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nome do participante"
                    value={participante}
                    onChange={(e) => setParticipante(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddParticipante()}
                  />
                  <Button type="button" onClick={handleAddParticipante} size="sm">
                    Adicionar
                  </Button>
                </div>

                {novoEvento.participantes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {novoEvento.participantes.map((p, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {p}
                        <button
                          onClick={() => handleRemoveParticipante(index)}
                          className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="comentarios">Comentários</Label>
                <Textarea
                  id="comentarios"
                  placeholder="Adicione comentários ou notas sobre o evento"
                  rows={3}
                  value={novoEvento.comentarios}
                  onChange={(e) => setNovoEvento({ ...novoEvento, comentarios: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddEvento}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Evento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para edição de evento */}
        {editingEvento && (
          <Dialog open={!!editingEvento} onOpenChange={(open) => !open && setEditingEvento(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Evento</DialogTitle>
                <DialogDescription>Edite os detalhes do evento abaixo.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-titulo">Título</Label>
                  <Input
                    id="edit-titulo"
                    placeholder="Título do evento"
                    value={editingEvento.titulo}
                    onChange={(e) => setEditingEvento({ ...editingEvento, titulo: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Evento</Label>
                    <Select
                      value={editingEvento.tipo}
                      onValueChange={(value: "reuniao" | "tarefa" | "lembrete" | "retorno" | "outro") =>
                        setEditingEvento({ ...editingEvento, tipo: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reuniao">Reunião</SelectItem>
                        <SelectItem value="tarefa">Tarefa</SelectItem>
                        <SelectItem value="lembrete">Lembrete</SelectItem>
                        <SelectItem value="retorno">Retorno</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Data</Label>
                    <Input
                      type="date"
                      value={format(editingEvento.data, "yyyy-MM-dd")}
                      onChange={(e) => {
                        const date = e.target.value ? new Date(e.target.value) : new Date()
                        setEditingEvento({ ...editingEvento, data: date })
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-horaInicio">Hora de Início</Label>
                    <Input
                      id="edit-horaInicio"
                      type="time"
                      value={editingEvento.horaInicio}
                      onChange={(e) => setEditingEvento({ ...editingEvento, horaInicio: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-horaFim">Hora de Término</Label>
                    <Input
                      id="edit-horaFim"
                      type="time"
                      value={editingEvento.horaFim}
                      onChange={(e) => setEditingEvento({ ...editingEvento, horaFim: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Participantes</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nome do participante"
                      value={participante}
                      onChange={(e) => setParticipante(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddParticipante()}
                    />
                    <Button type="button" onClick={handleAddParticipante} size="sm">
                      Adicionar
                    </Button>
                  </div>

                  {editingEvento.participantes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editingEvento.participantes.map((p, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {p}
                          <button
                            onClick={() => handleRemoveParticipante(index)}
                            className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-comentarios">Comentários</Label>
                  <Textarea
                    id="edit-comentarios"
                    placeholder="Adicione comentários ou notas sobre o evento"
                    rows={3}
                    value={editingEvento.comentarios}
                    onChange={(e) => setEditingEvento({ ...editingEvento, comentarios: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingEvento(null)}>
                  Cancelar
                </Button>
                <Button onClick={handleEditEvento}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  )
}

