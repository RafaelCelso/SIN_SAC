"use client"

import { createContext, useContext, useState, ReactNode } from "react"

// Tipos
export interface Evento {
  id: string
  titulo: string
  data: Date
  horaInicio: string
  horaFim: string
  participantes: string[]
  comentarios: string
  tipo: "reuniao" | "tarefa" | "lembrete" | "retorno" | "outro"
}

// Dados iniciais
const EVENTOS_INICIAIS: Evento[] = [
  {
    id: "1",
    titulo: "Reunião com equipe de Farmacovigilância",
    data: new Date(2025, 2, 25),
    horaInicio: "09:00",
    horaFim: "10:30",
    participantes: ["Ana Silva", "Carlos Mendes", "Juliana Costa"],
    comentarios: "Discutir novos procedimentos para registro de eventos adversos.",
    tipo: "reuniao",
  },
  {
    id: "2",
    titulo: "Treinamento sobre novo sistema",
    data: new Date(2025, 2, 26),
    horaInicio: "14:00",
    horaFim: "16:00",
    participantes: ["Toda a equipe"],
    comentarios: "Treinamento sobre as novas funcionalidades do sistema de atendimento.",
    tipo: "reuniao",
  },
]

// Interface do Contexto
interface EventosContextType {
  eventos: Evento[]
  adicionarEvento: (evento: Evento) => void
  removerEvento: (id: string) => void
  atualizarEvento: (id: string, evento: Evento) => void
}

// Criar Contexto
const EventosContext = createContext<EventosContextType | undefined>(undefined)

// Provider Component
export function EventosProvider({ children }: { children: ReactNode }) {
  const [eventos, setEventos] = useState<Evento[]>(EVENTOS_INICIAIS)

  const adicionarEvento = (evento: Evento) => {
    setEventos(prev => [...prev, evento])
  }

  const removerEvento = (id: string) => {
    setEventos(prev => prev.filter(evento => evento.id !== id))
  }

  const atualizarEvento = (id: string, eventoAtualizado: Evento) => {
    setEventos(prev => prev.map(evento => evento.id === id ? eventoAtualizado : evento))
  }

  return (
    <EventosContext.Provider value={{ eventos, adicionarEvento, removerEvento, atualizarEvento }}>
      {children}
    </EventosContext.Provider>
  )
}

// Hook personalizado para usar o contexto
export function useEventos() {
  const context = useContext(EventosContext)
  if (context === undefined) {
    throw new Error("useEventos deve ser usado dentro de um EventosProvider")
  }
  return context
} 