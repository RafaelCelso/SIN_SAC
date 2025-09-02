"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Calendar as CalendarIcon,
  Users,
  Phone,
  Mail,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Contact,
  TriangleAlert,
  Pill,
  ChevronDown,
  ChevronUp,
  Check,
  Plus
} from "lucide-react"
import Link from "next/link"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { AdicionarMotivoModal } from "@/components/adicionar-motivo-modal"

// Dados dos casos pendentes para Supervisor (todos os casos)
const CASOS_PENDENTES = [
  // Casos para Contatos - Motivo do Cliente
  {
    id: "01",
    nome: "João Carlos Oliveira",
    prioridade: "Cliente Indisponível",
    protocolo: "CT-2023-0002",
    dataHora: "14/12/2023 16:45",
    responsavel: "Rafael Silva",
    tipo: "Aguardando Resposta",
    status: "Leve",
    motivoPrincipal: "Contato",
    subcategoria: "Cliente Indisponível",
    detalhe: "Não atende chamadas",
    categoria: "contatos",
    submenu: "motivo-cliente"
  },
  {
    id: "02", 
    nome: "Fernanda Rocha Silva",
    prioridade: "Não Atende Ligações",
    protocolo: "CT-2023-0005",
    dataHora: "11/12/2023 15:50",
    responsavel: "Mariana Santos",
    tipo: "Aguardando Resposta",
    status: "Leve",
    motivoPrincipal: "Contato",
    subcategoria: "Não Atende",
    detalhe: "Múltiplas tentativas",
    categoria: "contatos",
    submenu: "motivo-cliente"
  },
  {
    id: "03",
    nome: "Pedro Almeida",
    prioridade: "Telefone Inválido",
    protocolo: "CT-2023-0006",
    dataHora: "19/12/2023 08:30",
    responsavel: "João Costa",
    tipo: "Documentação Pendente",
    status: "Moderado",
    motivoPrincipal: "Contato",
    subcategoria: "Telefone Inválido",
    detalhe: "Número inexistente",
    categoria: "contatos",
    submenu: "motivo-cliente"
  },
  {
    id: "04",
    nome: "Carlos Mendes",
    prioridade: "Recusa Contato",
    protocolo: "CT-2023-0011",
    dataHora: "18/12/2023 11:15",
    responsavel: "Ana Silva",
    tipo: "Contato Urgente",
    status: "Grave",
    motivoPrincipal: "Contato",
    subcategoria: "Recusa Contato",
    detalhe: "Cliente se recusa",
    categoria: "contatos",
    submenu: "motivo-cliente"
  },
  // Casos para Contatos - Motivo Interno
  {
    id: "05",
    nome: "Ana Paula Santos",
    prioridade: "Horário Incompatível",
    protocolo: "CT-2023-0012",
    dataHora: "20/12/2023 09:30",
    responsavel: "Carlos Silva",
    tipo: "Revisão Necessária",
    status: "Leve",
    motivoPrincipal: "Interno",
    subcategoria: "Horário",
    detalhe: "Fora do expediente",
    categoria: "contatos",
    submenu: "motivo-interno"
  },
  // Casos para Queixas - Revisão
  {
    id: "06",
    nome: "Maria Silva Costa",
    prioridade: "Revisão Pendente",
    protocolo: "QX-2023-0015",
    dataHora: "21/12/2023 10:15",
    responsavel: "Lucas Oliveira",
    tipo: "Revisão Necessária",
    status: "Moderado",
    motivoPrincipal: "Qualidade",
    subcategoria: "Embalagem",
    detalhe: "Defeito no lacre",
    categoria: "queixas",
    submenu: "revisao"
  },
  {
    id: "07",
    nome: "Roberto Santos",
    prioridade: "Análise Técnica",
    protocolo: "QX-2023-0018",
    dataHora: "22/12/2023 14:20",
    responsavel: "Patricia Lima",
    tipo: "Revisão Necessária",
    status: "Grave",
    motivoPrincipal: "Qualidade",
    subcategoria: "Produto Alterado",
    detalhe: "Cor diferente",
    categoria: "queixas",
    submenu: "revisao"
  },
  // Casos para Queixas - Retornado
  {
    id: "08",
    nome: "Juliana Ferreira",
    prioridade: "Retorno Pendente",
    protocolo: "QX-2023-0020",
    dataHora: "23/12/2023 11:30",
    responsavel: "André Costa",
    tipo: "Aguardando Resposta",
    status: "Leve",
    motivoPrincipal: "Informação",
    subcategoria: "Dúvida Técnica",
    detalhe: "Posologia",
    categoria: "queixas",
    submenu: "retornado"
  },
  {
    id: "09",
    nome: "Eduardo Martins",
    prioridade: "Documentação Retornada",
    protocolo: "QX-2023-0022",
    dataHora: "24/12/2023 16:45",
    responsavel: "Camila Souza",
    tipo: "Aguardando Resposta",
    status: "Moderado",
    motivoPrincipal: "Documentação",
    subcategoria: "Comprovante",
    detalhe: "Nota fiscal",
    categoria: "queixas",
    submenu: "retornado"
  },
  // Casos para Farmacovigilância - Revisão
  {
    id: "10",
    nome: "Sandra Oliveira",
    prioridade: "Evento Adverso",
    protocolo: "FV-2023-0025",
    dataHora: "25/12/2023 09:15",
    responsavel: "Dr. Ricardo Alves",
    tipo: "Revisão Necessária",
    status: "Grave",
    motivoPrincipal: "Evento Adverso",
    subcategoria: "Reação Grave",
    detalhe: "Hospitalização",
    categoria: "farmacovigilancia",
    submenu: "revisao"
  },
  {
    id: "11",
    nome: "Marcos Pereira",
    prioridade: "Reação Adversa",
    protocolo: "FV-2023-0027",
    dataHora: "26/12/2023 13:20",
    responsavel: "Dra. Ana Beatriz",
    tipo: "Revisão Necessária",
    status: "Moderado",
    motivoPrincipal: "Evento Adverso",
    subcategoria: "Reação Alérgica",
    detalhe: "Urticária",
    categoria: "farmacovigilancia",
    submenu: "revisao"
  },
  // Casos para Farmacovigilância - Retornado
  {
    id: "12",
    nome: "Beatriz Lima",
    prioridade: "Eficácia Questionada",
    protocolo: "FV-2023-0030",
    dataHora: "27/12/2023 10:45",
    responsavel: "Dr. Felipe Santos",
    tipo: "Aguardando Resposta",
    status: "Leve",
    motivoPrincipal: "Eficácia",
    subcategoria: "Falta de Efeito",
    detalhe: "Não houve melhora",
    categoria: "farmacovigilancia",
    submenu: "retornado"
  }
]

// Dados específicos para cada perfil
const CASOS_ATENDIMENTO = [
  // Casos para Contatos
  {
    id: "AT01",
    nome: "Maria Santos Silva",
    prioridade: "Cliente Indisponível",
    protocolo: "AT-2023-0001",
    dataHora: "28/12/2023 09:15",
    responsavel: "Carlos Atendimento",
    tipo: "Aguardando Resposta",
    status: "Leve",
    motivoPrincipal: "Atendimento",
    subcategoria: "Primeira Ligação",
    detalhe: "Contato inicial",
    categoria: "contatos",
    submenu: "motivo-cliente"
  },
  {
    id: "AT02",
    nome: "José Silva Costa",
    prioridade: "Reagendamento",
    protocolo: "AT-2023-0002",
    dataHora: "28/12/2023 10:30",
    responsavel: "Ana Atendimento",
    tipo: "Reagendamento",
    status: "Moderado",
    motivoPrincipal: "Atendimento",
    subcategoria: "Horário",
    detalhe: "Conflito agenda",
    categoria: "contatos",
    submenu: "motivo-interno"
  },
  {
    id: "AT03",
    nome: "Fernanda Lima",
    prioridade: "Informações Gerais",
    protocolo: "AT-2023-0003",
    dataHora: "28/12/2023 11:45",
    responsavel: "Pedro Atendimento",
    tipo: "Informação",
    status: "Leve",
    motivoPrincipal: "Informação",
    subcategoria: "Dúvida Geral",
    detalhe: "Horário funcionamento",
    categoria: "contatos",
    submenu: "motivo-cliente"
  },
  // Casos para Queixas Técnicas - Aberto
  {
    id: "AT04",
    nome: "Roberto Silva Santos",
    prioridade: "Produto Defeituoso",
    protocolo: "QT-2023-0001",
    dataHora: "28/12/2023 08:20",
    responsavel: "Dra. Carla Qualidade",
    tipo: "Análise Pendente",
    status: "Grave",
    motivoPrincipal: "Qualidade",
    subcategoria: "Defeito Produto",
    detalhe: "Embalagem violada",
    categoria: "queixas",
    submenu: "aberto"
  },
  {
    id: "AT05",
    nome: "Sandra Costa Lima",
    prioridade: "Lote Contaminado",
    protocolo: "QT-2023-0002",
    dataHora: "28/12/2023 09:35",
    responsavel: "Dr. Paulo Qualidade",
    tipo: "Investigação",
    status: "Grave",
    motivoPrincipal: "Qualidade",
    subcategoria: "Contaminação",
    detalhe: "Suspeita contaminação",
    categoria: "queixas",
    submenu: "aberto"
  },
  {
    id: "AT06",
    nome: "Carlos Pereira",
    prioridade: "Cor Alterada",
    protocolo: "QT-2023-0003",
    dataHora: "28/12/2023 11:10",
    responsavel: "Ana Qualidade",
    tipo: "Verificação",
    status: "Moderado",
    motivoPrincipal: "Qualidade",
    subcategoria: "Aparência",
    detalhe: "Mudança coloração",
    categoria: "queixas",
    submenu: "aberto"
  },
  // Casos para Queixas Técnicas - Rejeitado
  {
    id: "AT07",
    nome: "Lucia Martins",
    prioridade: "Queixa Improcedente",
    protocolo: "QT-2023-0004",
    dataHora: "27/12/2023 15:45",
    responsavel: "Dr. Ricardo Qualidade",
    tipo: "Rejeitado",
    status: "Leve",
    motivoPrincipal: "Qualidade",
    subcategoria: "Uso Incorreto",
    detalhe: "Mau uso produto",
    categoria: "queixas",
    submenu: "rejeitado"
  },
  {
    id: "AT08",
    nome: "Fernando Oliveira",
    prioridade: "Informação Insuficiente",
    protocolo: "QT-2023-0005",
    dataHora: "27/12/2023 16:20",
    responsavel: "Dra. Beatriz Qualidade",
    tipo: "Rejeitado",
    status: "Leve",
    motivoPrincipal: "Qualidade",
    subcategoria: "Dados Incompletos",
    detalhe: "Falta informações",
    categoria: "queixas",
    submenu: "rejeitado"
  },
  // Casos para Farmacovigilância - Aberto
  {
    id: "AT09",
    nome: "Patricia Alves",
    prioridade: "Reação Adversa Grave",
    protocolo: "FV-2023-0010",
    dataHora: "28/12/2023 07:30",
    responsavel: "Dr. Eduardo Farmaco",
    tipo: "Investigação",
    status: "Grave",
    motivoPrincipal: "Evento Adverso",
    subcategoria: "Reação Sistêmica",
    detalhe: "Choque anafilático",
    categoria: "farmacovigilancia",
    submenu: "aberto"
  },
  {
    id: "AT10",
    nome: "Marcos Rodrigues",
    prioridade: "Interação Medicamentosa",
    protocolo: "FV-2023-0011",
    dataHora: "28/12/2023 08:45",
    responsavel: "Dra. Fernanda Farmaco",
    tipo: "Análise",
    status: "Moderado",
    motivoPrincipal: "Interação",
    subcategoria: "Medicamentos",
    detalhe: "Interação perigosa",
    categoria: "farmacovigilancia",
    submenu: "aberto"
  },
  {
    id: "AT11",
    nome: "Julia Santos",
    prioridade: "Efeito Inesperado",
    protocolo: "FV-2023-0012",
    dataHora: "28/12/2023 10:15",
    responsavel: "Dr. Gabriel Farmaco",
    tipo: "Avaliação",
    status: "Moderado",
    motivoPrincipal: "Evento Adverso",
    subcategoria: "Efeito Não Listado",
    detalhe: "Reação não descrita",
    categoria: "farmacovigilancia",
    submenu: "aberto"
  },
  // Casos para Farmacovigilância - Rejeitado
  {
    id: "AT12",
    nome: "Antonio Silva",
    prioridade: "Relato Inconsistente",
    protocolo: "FV-2023-0013",
    dataHora: "27/12/2023 14:30",
    responsavel: "Dra. Camila Farmaco",
    tipo: "Rejeitado",
    status: "Leve",
    motivoPrincipal: "Relato",
    subcategoria: "Inconsistência",
    detalhe: "Dados contraditórios",
    categoria: "farmacovigilancia",
    submenu: "rejeitado"
  },
  {
    id: "AT13",
    nome: "Renata Costa",
    prioridade: "Não Relacionado",
    protocolo: "FV-2023-0014",
    dataHora: "27/12/2023 15:50",
    responsavel: "Dr. Henrique Farmaco",
    tipo: "Rejeitado",
    status: "Leve",
    motivoPrincipal: "Avaliação",
    subcategoria: "Sem Relação",
    detalhe: "Não relacionado ao medicamento",
    categoria: "farmacovigilancia",
    submenu: "rejeitado"
  }
]

const CASOS_QUALIDADE = [
  // Submenu: Qualidade (revisao)
  {
    id: "QL01",
    nome: "Roberto Qualidade Silva",
    prioridade: "Análise Produto",
    protocolo: "QL-2023-0001",
    dataHora: "28/12/2023 08:30",
    responsavel: "Dra. Maria Qualidade",
    tipo: "Revisão Necessária",
    status: "Grave",
    motivoPrincipal: "Qualidade",
    subcategoria: "Defeito Produto",
    detalhe: "Embalagem danificada",
    categoria: "queixas",
    submenu: "revisao"
  },
  {
    id: "QL02",
    nome: "Sandra Controle Silva",
    prioridade: "Lote Suspeito",
    protocolo: "QL-2023-0002",
    dataHora: "28/12/2023 09:45",
    responsavel: "Dr. João Qualidade",
    tipo: "Revisão Necessária",
    status: "Moderado",
    motivoPrincipal: "Qualidade",
    subcategoria: "Lote",
    detalhe: "Verificação necessária",
    categoria: "queixas",
    submenu: "revisao"
  },
  {
    id: "QL04",
    nome: "Fernanda Teste Lima",
    prioridade: "Controle Qualidade",
    protocolo: "QL-2023-0004",
    dataHora: "29/12/2023 10:15",
    responsavel: "Dr. Pedro Qualidade",
    tipo: "Revisão Necessária",
    status: "Grave",
    motivoPrincipal: "Qualidade",
    subcategoria: "Teste Falhou",
    detalhe: "Parâmetros fora do padrão",
    categoria: "queixas",
    submenu: "revisao"
  },
  {
    id: "QL05",
    nome: "Marcos Validação Santos",
    prioridade: "Processo Validação",
    protocolo: "QL-2023-0005",
    dataHora: "29/12/2023 11:30",
    responsavel: "Dra. Carla Qualidade",
    tipo: "Revisão Necessária",
    status: "Moderado",
    motivoPrincipal: "Qualidade",
    subcategoria: "Validação",
    detalhe: "Documentação incompleta",
    categoria: "queixas",
    submenu: "revisao"
  },
  {
    id: "QL06",
    nome: "Julia Especificação Costa",
    prioridade: "Fora Especificação",
    protocolo: "QL-2023-0006",
    dataHora: "29/12/2023 13:45",
    responsavel: "Dr. Rafael Qualidade",
    tipo: "Revisão Necessária",
    status: "Leve",
    motivoPrincipal: "Qualidade",
    subcategoria: "Especificação",
    detalhe: "Cor alterada",
    categoria: "queixas",
    submenu: "revisao"
  },
  // Submenu: Em análise (retornado)
  {
    id: "QL03",
    nome: "Carlos Inspeção Costa",
    prioridade: "Retorno Análise",
    protocolo: "QL-2023-0003",
    dataHora: "28/12/2023 14:20",
    responsavel: "Ana Qualidade",
    tipo: "Aguardando Resposta",
    status: "Leve",
    motivoPrincipal: "Qualidade",
    subcategoria: "Resultado",
    detalhe: "Laudo pendente",
    categoria: "queixas",
    submenu: "retornado"
  },
  {
    id: "QL07",
    nome: "Patricia Laboratório Silva",
    prioridade: "Análise Laboratorial",
    protocolo: "QL-2023-0007",
    dataHora: "29/12/2023 15:00",
    responsavel: "Dr. Lucas Qualidade",
    tipo: "Aguardando Resposta",
    status: "Moderado",
    motivoPrincipal: "Qualidade",
    subcategoria: "Laboratório",
    detalhe: "Aguardando resultado",
    categoria: "queixas",
    submenu: "retornado"
  },
  {
    id: "QL08",
    nome: "Ricardo Microbiologia Lima",
    prioridade: "Teste Microbiológico",
    protocolo: "QL-2023-0008",
    dataHora: "29/12/2023 16:30",
    responsavel: "Dra. Amanda Qualidade",
    tipo: "Aguardando Resposta",
    status: "Grave",
    motivoPrincipal: "Qualidade",
    subcategoria: "Microbiologia",
    detalhe: "Contaminação suspeita",
    categoria: "queixas",
    submenu: "retornado"
  },
  {
    id: "QL09",
    nome: "Beatriz Estabilidade Santos",
    prioridade: "Estudo Estabilidade",
    protocolo: "QL-2023-0009",
    dataHora: "30/12/2023 08:00",
    responsavel: "Dr. Felipe Qualidade",
    tipo: "Aguardando Resposta",
    status: "Leve",
    motivoPrincipal: "Qualidade",
    subcategoria: "Estabilidade",
    detalhe: "Prazo vencimento",
    categoria: "queixas",
    submenu: "retornado"
  }
]

const CASOS_FARMACOVIGILANCIA = [
  {
    id: "FV01",
    nome: "Ana Reação Silva",
    prioridade: "Evento Adverso Grave",
    protocolo: "FV-2023-0001",
    dataHora: "28/12/2023 07:15",
    responsavel: "Dr. Ricardo Farmaco",
    tipo: "Revisão Necessária",
    status: "Grave",
    motivoPrincipal: "Evento Adverso",
    subcategoria: "Reação Grave",
    detalhe: "Internação hospitalar",
    categoria: "farmacovigilancia",
    submenu: "revisao"
  },
  {
    id: "FV02",
    nome: "Pedro Alergia Costa",
    prioridade: "Reação Alérgica",
    protocolo: "FV-2023-0002",
    dataHora: "28/12/2023 08:30",
    responsavel: "Dra. Beatriz Farmaco",
    tipo: "Revisão Necessária",
    status: "Moderado",
    motivoPrincipal: "Evento Adverso",
    subcategoria: "Alergia",
    detalhe: "Erupção cutânea",
    categoria: "farmacovigilancia",
    submenu: "revisao"
  },
  {
    id: "FV03",
    nome: "Lucia Eficácia Lima",
    prioridade: "Falta de Eficácia",
    protocolo: "FV-2023-0003",
    dataHora: "28/12/2023 10:45",
    responsavel: "Dr. Carlos Farmaco",
    tipo: "Aguardando Resposta",
    status: "Leve",
    motivoPrincipal: "Eficácia",
    subcategoria: "Sem Efeito",
    detalhe: "Medicamento ineficaz",
    categoria: "farmacovigilancia",
    submenu: "retornado"
  },
  // Casos para Follow-up pendente de aprovação
  {
    id: "FV04",
    nome: "Maria Follow-up Santos",
    prioridade: "Follow-up Pendente",
    protocolo: "FV-2023-0004",
    dataHora: "29/12/2023 09:30",
    responsavel: "Dr. João Farmaco",
    tipo: "Follow-up Pendente",
    status: "Grave",
    motivoPrincipal: "Follow-up",
    subcategoria: "Aprovação Pendente",
    detalhe: "Aguardando aprovação médica",
    categoria: "farmacovigilancia",
    submenu: "followup-pendente"
  },
  {
    id: "FV05",
    nome: "Roberto Acompanhamento Lima",
    prioridade: "Acompanhamento Médico",
    protocolo: "FV-2023-0005",
    dataHora: "29/12/2023 11:15",
    responsavel: "Dra. Patricia Farmaco",
    tipo: "Follow-up Pendente",
    status: "Moderado",
    motivoPrincipal: "Follow-up",
    subcategoria: "Acompanhamento",
    detalhe: "Necessita avaliação adicional",
    categoria: "farmacovigilancia",
    submenu: "followup-pendente"
  },
  {
    id: "FV06",
    nome: "Carla Monitoramento Costa",
    prioridade: "Monitoramento Contínuo",
    protocolo: "FV-2023-0006",
    dataHora: "29/12/2023 14:20",
    responsavel: "Dr. Fernando Farmaco",
    tipo: "Follow-up Pendente",
    status: "Leve",
    motivoPrincipal: "Follow-up",
    subcategoria: "Monitoramento",
    detalhe: "Acompanhamento de evolução",
    categoria: "farmacovigilancia",
    submenu: "followup-pendente"
  }
]

// Eventos específicos para cada perfil
const EVENTOS_SUPERVISOR = [
  {
    id: 1,
    titulo: "Reunião de Supervisores",
    horario: "09:00",
    tipo: "Reunião",
    participantes: "Equipe Supervisão"
  },
  {
    id: 2,
    titulo: "Análise de Indicadores",
    horario: "14:00",
    tipo: "Análise",
    participantes: "Gerência"
  },
  {
    id: 3,
    titulo: "Revisão de Processos",
    horario: "16:00",
    tipo: "Revisão",
    participantes: "Coordenadores"
  }
]

const EVENTOS_ATENDIMENTO = [
  {
    id: 1,
    titulo: "Treinamento Atendimento",
    horario: "08:30",
    tipo: "Treinamento",
    participantes: "Equipe Atendimento"
  },
  {
    id: 2,
    titulo: "Reunião de Equipe",
    horario: "13:00",
    tipo: "Reunião",
    participantes: "Atendentes"
  },
  {
    id: 3,
    titulo: "Feedback Clientes",
    horario: "15:30",
    tipo: "Análise",
    participantes: "Supervisores"
  }
]

const EVENTOS_QUALIDADE = [
  {
    id: 1,
    titulo: "Auditoria Interna",
    horario: "09:00",
    tipo: "Auditoria",
    participantes: "Equipe Qualidade"
  },
  {
    id: 2,
    titulo: "Análise de Desvios",
    horario: "11:00",
    tipo: "Análise",
    participantes: "Analistas"
  },
  {
    id: 3,
    titulo: "Revisão de Procedimentos",
    horario: "14:30",
    tipo: "Revisão",
    participantes: "Coordenação"
  }
]

const EVENTOS_FARMACOVIGILANCIA = [
  {
    id: 1,
    titulo: "Análise de Casos Graves",
    horario: "08:00",
    tipo: "Análise",
    participantes: "Médicos"
  },
  {
    id: 2,
    titulo: "Reunião Científica",
    horario: "10:30",
    tipo: "Reunião",
    participantes: "Equipe Médica"
  },
  {
    id: 3,
    titulo: "Relatório ANVISA",
    horario: "15:00",
    tipo: "Relatório",
    participantes: "Responsável Técnico"
  }
]

// Dados dos eventos do dia para a sidebar (mantido para compatibilidade)
const EVENTOS_HOJE = [
  {
    id: 4,
    titulo: "Treinamento Farmacovigi...",
    horario: "09:00",
    tipo: "Treinamento",
    participantes: "Nova Colaboradora"
  },
  {
    id: 3,
    titulo: "Análise de Casos Pend.",
    horario: "10:30",
    tipo: "Análise",
    participantes: "Equipe Técnica"
  },
  {
    id: 1,
    titulo: "Reunião de Supervisores",
    horario: "14:00",
    tipo: "Reunião",
    participantes: "Equipe Supervisão"
  },
  {
    id: 5,
    titulo: "Revisão de Protocolos",
    horario: "15:30",
    tipo: "Revisão",
    participantes: "Ana Costa"
  },
  {
    id: 2,
    titulo: "Retorno para o Cliente",
    horario: "16:00",
    tipo: "Contato",
    participantes: "Equipe Atendimento"
  }
]

export default function CasosPendentes() {
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 5
  const [isModalMotivoOpen, setIsModalMotivoOpen] = useState(false)
  const [casoSelecionado, setCasoSelecionado] = useState<any>(null)
  const [casosComMotivo, setCasosComMotivo] = useState<{[key: string]: {tipo: string, motivo: string}}>({})
  
  // Função para verificar se o evento já passou
  const getEventoStatus = (horario: string) => {
    const agora = new Date()
    const horaAtual = agora.getHours() * 60 + agora.getMinutes() // minutos desde meia-noite
    const [hora, minuto] = horario.split(':').map(Number)
    const horarioEvento = hora * 60 + minuto
    
    if (horarioEvento < horaAtual) {
      return 'passado'
    } else if (horarioEvento <= horaAtual + 30) { // próximos 30 minutos
      return 'proximo'
    } else {
      return 'futuro'
    }
  }
  
  // Função para obter as classes CSS baseadas no status do evento
  const getEventoClasses = (horario: string) => {
    const status = getEventoStatus(horario)
    
    switch (status) {
      case 'passado':
        return 'border-l-4 border-gray-400 pl-3 py-2 bg-gray-50 opacity-60'
      case 'proximo':
        return 'border-l-4 border-orange-400 pl-3 py-2 bg-orange-50'
      case 'futuro':
      default:
        return 'border-l-4 border-[#5AC8B3] pl-3 py-2'
    }
  }
  
  // Função para obter as classes do texto baseadas no status do evento
  const getEventoTextClasses = (horario: string) => {
    const status = getEventoStatus(horario)
    
    switch (status) {
      case 'passado':
        return 'text-gray-500'
      case 'proximo':
        return 'text-orange-700 font-medium'
      case 'futuro':
      default:
        return 'text-gray-900'
    }
  }

  // Função para abrir modal de adicionar motivo
  const handleOpenModalMotivo = (caso: any) => {
    setCasoSelecionado(caso)
    setIsModalMotivoOpen(true)
  }

  // Função para lidar com envio do motivo
  const handleSubmitMotivo = (tipoMotivo: string, motivoSelecionado: string) => {
    console.log('Motivo adicionado para caso:', casoSelecionado?.id)
    console.log('Tipo:', tipoMotivo, 'Motivo:', motivoSelecionado)
    
    // Atualizar o estado local para mostrar a tag do motivo
    setCasosComMotivo(prev => ({
      ...prev,
      [casoSelecionado?.id]: {
        tipo: tipoMotivo,
        motivo: motivoSelecionado
      }
    }))
    
    // Aqui você pode implementar a lógica para salvar os motivos
    // Por exemplo, fazer uma chamada para API
  }
  
  // Estados para controlar expansão das seções
  const [isContatosExpanded, setIsContatosExpanded] = useState(true)
  const [isQueixasExpanded, setIsQueixasExpanded] = useState(false)
  const [isFarmacovigilanciaExpanded, setIsFarmacovigilanciaExpanded] = useState(false)
  
  // Estados para controlar filtros ativos
  const [filtroAtivo, setFiltroAtivo] = useState<string | null>(null)
  const [tipoFiltro, setTipoFiltro] = useState<string | null>(null)
  
  // Estado para controlar status dos eventos
  const [eventosStatus, setEventosStatus] = useState<{[key: string]: 'pendente' | 'concluido' | 'cancelado'}>({})
  
  // Estado para controlar qual aba de perfil está ativa
  const [abaAtiva, setAbaAtiva] = useState('supervisor')
  
  // Função para filtrar casos baseado no submenu selecionado
  const filtrarCasos = () => {
    let casosFiltrados = []
    
    // Seleciona o array de dados baseado na aba ativa
    switch (abaAtiva) {
      case 'supervisor':
        casosFiltrados = CASOS_PENDENTES
        break
      case 'atendimento':
        casosFiltrados = CASOS_ATENDIMENTO
        break
      case 'qualidade':
        casosFiltrados = CASOS_QUALIDADE
        break
      case 'farmacovigilancia':
        casosFiltrados = CASOS_FARMACOVIGILANCIA
        break
      default:
        casosFiltrados = CASOS_PENDENTES
    }
    
    if (filtroAtivo && tipoFiltro) {
      // Filtra baseado na categoria e submenu específicos
      casosFiltrados = casosFiltrados.filter(caso => 
        caso.categoria === tipoFiltro && caso.submenu === filtroAtivo
      )
    }
    
    return casosFiltrados
  }
  
  const casosFiltrados = filtrarCasos()
   const totalPaginasFiltradas = Math.ceil(casosFiltrados.length / itensPorPagina)
   const casosExibidos = casosFiltrados.slice(
     (paginaAtual - 1) * itensPorPagina,
     paginaAtual * itensPorPagina
   )
   
   // Função para lidar com cliques nos submenus
   const handleSubmenuClick = (submenu: string, tipo: string) => {
     if (filtroAtivo === submenu && tipoFiltro === tipo) {
       // Se já está ativo, desativa o filtro
       setFiltroAtivo(null)
       setTipoFiltro(null)
     } else {
       // Ativa o novo filtro
       setFiltroAtivo(submenu)
       setTipoFiltro(tipo)
     }
     // Reset da paginação
     setPaginaAtual(1)
   }

  // Função para marcar evento como concluído ou cancelado
  const handleEventoAction = (eventoId: string, action: 'concluido' | 'cancelado') => {
    setEventosStatus(prev => ({
      ...prev,
      [eventoId]: action
    }))
  }

  // Função para obter classes CSS baseadas no status do evento
  const getEventoStatusClass = (eventoId: string, horario: string) => {
    const status = eventosStatus[eventoId]
    if (status === 'concluido') {
      return 'border-l-4 border-green-500 pl-3 py-2 bg-green-50 opacity-80'
    }
    if (status === 'cancelado') {
      return 'border-l-4 border-red-500 pl-3 py-2 bg-red-50 opacity-60'
    }
    return getEventoClasses(horario)
  }

  // Função para obter classes de texto baseadas no status do evento
  const getEventoStatusText = (eventoId: string, horario: string) => {
    const status = eventosStatus[eventoId]
    if (status === 'concluido') {
      return 'text-green-600 line-through'
    }
    if (status === 'cancelado') {
      return 'text-red-500'
    }
    return getEventoTextClasses(horario)
  }

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade.toLowerCase()) {
      case 'cliente indisponível':
        return 'bg-[#E8F7F4] text-[#26B99D] border-[#26B99D]'
      case 'não atende ligações':
        return 'bg-[#E8F7F4] text-[#26B99D] border-[#26B99D]'
      case 'telefone inválido':
        return 'bg-[#E8F7F4] text-[#26B99D] border-[#26B99D]'
      case 'recusa contato':
        return 'bg-[#E8F7F4] text-[#26B99D] border-[#26B99D]'
      case 'horário incompatível':
        return 'bg-[#E8F7F4] text-[#26B99D] border-[#26B99D]'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getGravidadeColor = (status: string) => {
    switch (status) {
      case "Grave":
        return "bg-red-100 text-red-800 border-red-300"
      case "Moderado":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "Leve":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getTipoIcon = (tipo: string) => {
    if (tipo.includes('Urgente')) return <AlertTriangle className="h-4 w-4" />
    if (tipo.includes('Documentação')) return <FileText className="h-4 w-4" />
    if (tipo.includes('Revisão')) return <CheckCircle className="h-4 w-4" />
    return <Clock className="h-4 w-4" />
  }

  // Função para obter tag de gravidade
  const getGravidadeTag = (status: string) => {
    switch (status.toLowerCase()) {
      case 'grave':
        return 'Grave'
      case 'moderado':
        return 'Moderada'
      case 'leve':
        return 'Baixa'
      default:
        return status
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 810 809.999993" className="h-8 w-8 text-white">
            <g>
              <path fill="#ef9645" d="M 119.671875 198.632812 C 140.082031 184.367188 170.855469 187.101562 189.183594 202.238281 L 168.160156 171.683594 C 151.246094 147.558594 157.304688 121.457031 181.453125 104.519531 C 205.601562 87.644531 238.910156 93.464844 255.851562 117.65625 L 447.578125 390.882812 L 449.097656 390.210938 L 274.027344 133.007812 C 256.957031 108.644531 260.148438 77.765625 284.515625 60.675781 C 308.878906 43.648438 342.496094 49.535156 359.566406 73.941406 L 585.84375 393.597656 C 602.933594 417.984375 594.550781 451.386719 570.1875 468.453125 C 566.039062 471.363281 561.566406 473.363281 557.003906 474.945312 L 557.003906 673.191406 L 339.847656 673.191406 L 339.847656 605.589844 C 336.675781 602.789062 318.847656 589.019531 316.328125 585.414062 L 106.402344 274.164062 C 89.179688 249.644531 95.132812 215.832031 119.671875 198.632812 Z M 119.671875 198.632812" />
              <path fill="#ffdc5d" d="M 72.632812 376.464844 C 72.632812 376.464844 48.050781 340.632812 83.90625 316.074219 C 119.714844 291.511719 144.273438 327.324219 144.273438 327.324219 L 258.304688 493.621094 C 262.234375 487.0625 266.535156 480.59375 271.332031 474.207031 L 113.070312 243.433594 C 113.070312 243.433594 88.507812 207.625 124.339844 183.0625 C 160.148438 158.503906 184.710938 194.3125 184.710938 194.3125 L 333.570312 411.40625 C 339.109375 406.890625 344.777344 402.351562 350.617188 397.898438 L 178.042969 146.191406 C 178.042969 146.191406 153.480469 110.382812 189.3125 85.820312 C 225.121094 61.261719 249.683594 97.070312 249.683594 97.070312 L 422.257812 348.734375 C 428.601562 344.847656 434.875 341.480469 441.171875 337.917969 L 279.867188 102.695312 C 279.867188 102.695312 255.308594 66.882812 291.117188 42.324219 C 326.925781 17.761719 351.488281 53.574219 351.488281 53.574219 L 522.042969 302.304688 L 535.703125 322.21875 L 547.972656 340.136719 C 440.523438 413.839844 430.292969 552.492188 491.683594 642.027344 C 503.953125 659.945312 521.871094 647.675781 521.871094 647.675781 C 448.1875 540.203125 470.683594 419.441406 578.15625 345.757812 L 546.472656 187.191406 C 546.472656 187.191406 534.636719 145.410156 576.398438 133.550781 C 618.179688 121.71875 630.035156 163.5 630.035156 163.5 L 666.625 272.164062 C 681.132812 315.25 696.574219 358.179688 717.007812 398.789062 C 774.707031 513.449219 740.242188 655.949219 631.445312 730.585938 C 512.769531 811.953125 350.53125 781.703125 269.140625 663.050781 C 264.839844 656.75 261.234375 650.605469 257.804688 644.480469 L 256.847656 645.132812 Z M 72.632812 376.464844" />
              <path fill="#5ac8b3" d="M 274.699219 695.816406 C 187.835938 695.816406 100.0625 608.042969 100.0625 521.179688 C 100.0625 509.171875 91.265625 499.464844 79.257812 499.464844 C 67.25 499.464844 56.628906 509.171875 56.628906 521.179688 C 56.628906 651.472656 144.40625 739.25 274.699219 739.25 C 286.707031 739.25 296.414062 728.628906 296.414062 716.621094 C 296.414062 704.613281 286.707031 695.816406 274.699219 695.816406 Z M 274.699219 695.816406" />
              <path fill="#5ac8b3" d="M 166.121094 738.335938 C 100.972656 738.335938 57.542969 694.90625 57.542969 629.757812 C 57.542969 617.75 47.835938 608.042969 35.824219 608.042969 C 23.816406 608.042969 14.109375 617.75 14.109375 629.757812 C 14.109375 716.621094 79.257812 781.769531 166.121094 781.769531 C 178.128906 781.769531 187.835938 772.0625 187.835938 760.054688 C 187.835938 748.042969 178.128906 738.335938 166.121094 738.335938 Z M 535.289062 43.433594 C 523.300781 43.433594 513.574219 53.160156 513.574219 65.148438 C 513.574219 77.132812 523.300781 86.863281 535.289062 86.863281 C 622.152344 86.863281 709.015625 164.800781 709.015625 260.589844 C 709.015625 272.578125 718.746094 282.304688 730.730469 282.304688 C 742.71875 282.304688 752.449219 272.578125 752.449219 260.589844 C 752.449219 140.847656 665.585938 43.433594 535.289062 43.433594 Z M 535.289062 43.433594" />
              <path fill="#5ac8b3" d="M 643.867188 0.910156 C 631.882812 0.910156 622.152344 9.730469 622.152344 21.714844 C 622.152344 33.703125 631.882812 44.34375 643.867188 44.34375 C 709.015625 44.34375 751.535156 92.660156 751.535156 152.011719 C 751.535156 163.996094 762.15625 173.726562 774.164062 173.726562 C 786.171875 173.726562 794.96875 163.996094 794.96875 152.011719 C 794.96875 68.6875 730.730469 0.910156 643.867188 0.910156 Z M 643.867188 0.910156" />
            </g>
          </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bem-vindo!
            </h1>
            <p className="text-gray-600 mt-1">
              Acompanhe os casos que possuem pendência e precisam de atenção
            </p>
          </div>
        </div>

        {/* Abas de Perfis */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'supervisor', label: 'Supervisor' },
              { id: 'atendimento', label: 'Atendimento' },
              { id: 'qualidade', label: 'Qualidade' },
              { id: 'farmacovigilancia', label: 'Farmacovigilância' }
            ].map((aba) => (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  abaAtiva === aba.id
                    ? 'border-[#3BC0A8] text-[#3BC0A8]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {aba.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Conteúdo das Abas */}
        {abaAtiva === 'supervisor' && (
          <div className="flex gap-6">
          {/* Sidebar de Pendências */}
          <div className="w-80 space-y-3 bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 shadow-lg">

            {/* Seção Contatos */}
            <Collapsible open={isContatosExpanded} onOpenChange={setIsContatosExpanded}>
              <CollapsibleTrigger asChild>
                <div className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 border group ${
                  tipoFiltro === 'contatos'
                    ? 'bg-[#3BC0A8]/10 border-[#3BC0A8]/30 shadow-sm'
                    : 'hover:bg-[#3BC0A8]/5 border-transparent hover:border-[#3BC0A8]/20'
                }`}>
                  <div className="flex items-center gap-3">
                    <div>
                      <Contact className="h-5 w-5 text-[#3BC0A8]" />
                    </div>
                    <span className="font-semibold text-gray-700">Protocolos</span>
                    <Badge variant="destructive" className="ml-2">5</Badge>
                  </div>
                  {isContatosExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 ml-6 mt-2">
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-sm transition-colors ${
                    filtroAtivo === 'motivo-cliente' && tipoFiltro === 'contatos'
                      ? 'bg-[#3BC0A8]/15 text-gray-700 font-medium border border-[#3BC0A8]/30'
                      : 'hover:bg-[#3BC0A8]/10 text-gray-600'
                  }`}
                  onClick={() => handleSubmenuClick('motivo-cliente', 'contatos')}
                >
                  <span>Aberto</span>
                  <Badge className="ml-auto bg-red-50 text-red-700 border-red-200 hover:bg-red-50">4</Badge>
                </Button>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-sm transition-colors ${
                    filtroAtivo === 'motivo-interno' && tipoFiltro === 'contatos'
                      ? 'bg-[#3BC0A8]/15 text-gray-700 font-medium border border-[#3BC0A8]/30'
                      : 'hover:bg-[#3BC0A8]/10 text-gray-600'
                  }`}
                  onClick={() => handleSubmenuClick('motivo-interno', 'contatos')}
                >
                  <span>Em andamento</span>
                  <Badge className="ml-auto bg-red-50 text-red-700 border-red-200 hover:bg-red-50">1</Badge>
                </Button>
              </CollapsibleContent>
            </Collapsible>

            {/* Seção Queixas Técnicas */}
            <Collapsible open={isQueixasExpanded} onOpenChange={setIsQueixasExpanded}>
              <CollapsibleTrigger asChild>
                <div className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 border group ${
                  tipoFiltro === 'queixas'
                    ? 'bg-[#3BC0A8]/10 border-[#3BC0A8]/30 shadow-sm'
                    : 'hover:bg-[#3BC0A8]/5 border-transparent hover:border-[#3BC0A8]/20'
                }`}>
                  <div className="flex items-center gap-3">
                    <div>
                      <TriangleAlert className="h-5 w-5 text-[#3BC0A8]" />
                    </div>
                    <span className="font-semibold text-gray-700">Queixas Técnicas</span>
                    <Badge variant="destructive" className="ml-2">4</Badge>
                  </div>
                  {isQueixasExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 ml-6 mt-2">
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-sm transition-colors ${
                    filtroAtivo === 'revisao' && tipoFiltro === 'queixas'
                      ? 'bg-[#3BC0A8]/15 text-gray-700 font-medium border border-[#3BC0A8]/30'
                      : 'hover:bg-[#3BC0A8]/10 text-gray-600'
                  }`}
                  onClick={() => handleSubmenuClick('revisao', 'queixas')}
                >
                  <span>Revisão</span>
                  <Badge className="ml-auto bg-red-50 text-red-700 border-red-200 hover:bg-red-50">2</Badge>
                </Button>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-sm transition-colors ${
                    filtroAtivo === 'retornado' && tipoFiltro === 'queixas'
                      ? 'bg-[#3BC0A8]/15 text-gray-700 font-medium border border-[#3BC0A8]/30'
                      : 'hover:bg-[#3BC0A8]/10 text-gray-600'
                  }`}
                  onClick={() => handleSubmenuClick('retornado', 'queixas')}
                >
                  <span>Retornado</span>
                  <Badge className="ml-auto bg-red-50 text-red-700 border-red-200 hover:bg-red-50">2</Badge>
                </Button>
              </CollapsibleContent>
            </Collapsible>

            {/* Seção Farmacovigilância */}
            <Collapsible open={isFarmacovigilanciaExpanded} onOpenChange={setIsFarmacovigilanciaExpanded}>
              <CollapsibleTrigger asChild>
                <div className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 border group ${
                  tipoFiltro === 'farmacovigilancia'
                    ? 'bg-[#3BC0A8]/10 border-[#3BC0A8]/30 shadow-sm'
                    : 'hover:bg-[#3BC0A8]/5 border-transparent hover:border-[#3BC0A8]/20'
                }`}>
                  <div className="flex items-center gap-3">
                    <div>
                      <Pill className="h-5 w-5 text-[#3BC0A8]" />
                    </div>
                    <span className="font-semibold text-gray-700">Farmacovigilância</span>
                    <Badge variant="destructive" className="ml-2">3</Badge>
                  </div>
                  {isFarmacovigilanciaExpanded ? (
                     <ChevronUp className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                   ) : (
                     <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                   )}
                 </div>
               </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 ml-6 mt-2">
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-sm transition-colors ${
                    filtroAtivo === 'revisao' && tipoFiltro === 'farmacovigilancia'
                      ? 'bg-[#3BC0A8]/15 text-gray-700 font-medium border border-[#3BC0A8]/30'
                      : 'hover:bg-[#3BC0A8]/10 text-gray-600'
                  }`}
                  onClick={() => handleSubmenuClick('revisao', 'farmacovigilancia')}
                >
                  <span>Revisão</span>
                  <Badge className="ml-auto bg-red-50 text-red-700 border-red-200 hover:bg-red-50">2</Badge>
                </Button>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-sm transition-colors ${
                    filtroAtivo === 'retornado' && tipoFiltro === 'farmacovigilancia'
                      ? 'bg-[#3BC0A8]/15 text-gray-700 font-medium border border-[#3BC0A8]/30'
                      : 'hover:bg-[#3BC0A8]/10 text-gray-600'
                  }`}
                  onClick={() => handleSubmenuClick('retornado', 'farmacovigilancia')}
                >
                  <span>Retornado</span>
                  <Badge className="ml-auto bg-red-50 text-red-700 border-red-200 hover:bg-red-50">1</Badge>
                </Button>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-sm transition-colors h-12 items-start pt-2 ${
                    filtroAtivo === 'followup-pendente' && tipoFiltro === 'farmacovigilancia'
                      ? 'bg-[#3BC0A8]/15 text-gray-700 font-medium border border-[#3BC0A8]/30'
                      : 'hover:bg-[#3BC0A8]/10 text-gray-600'
                  }`}
                  onClick={() => handleSubmenuClick('followup-pendente', 'farmacovigilancia')}
                >
                   <span className="text-left leading-tight">Follow-up pendente<br />de aprovação</span>
                   <Badge className="ml-auto bg-red-50 text-red-700 border-red-200 hover:bg-red-50 mt-1">3</Badge>
                 </Button>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Conteúdo Principal - Lista de Casos */}
          <div className="flex-1 space-y-4">
            {casosExibidos.map((caso) => (
              <Card key={caso.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      {/* Linha 1: Protocolo */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-600" />
                          <span className="font-semibold text-lg">{caso.protocolo}</span>
                        </div>
                        {/* Exibir tag de gravidade apenas para submenus específicos de Farmacovigilância */}
                        {tipoFiltro === 'farmacovigilancia' && (filtroAtivo === 'revisao' || filtroAtivo === 'retornado') && (
                          <Badge className={getGravidadeColor(caso.status)}>
                            {caso.status}
                          </Badge>
                        )}
                        {/* Exibir tag do motivo adicionado */}
                        {casosComMotivo[caso.id] && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            {casosComMotivo[caso.id].tipo}: {casosComMotivo[caso.id].motivo}
                          </Badge>
                        )}
                      </div>

                      {/* Linha 2: Motivo Principal, Subcategoria e Detalhe */}
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="secondary" className="text-xs">
                          {caso.motivoPrincipal}
                        </Badge>
                        <ChevronRight className="h-3 w-3 text-gray-400" />
                        <Badge variant="secondary" className="text-xs">
                          {caso.subcategoria}
                        </Badge>
                        <ChevronRight className="h-3 w-3 text-gray-400" />
                        <Badge variant="secondary" className="text-xs">
                          {caso.detalhe}
                        </Badge>
                      </div>

                      {/* Linha 3: ID, Nome, Data e Responsável */}
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs font-mono">
                            ID: {caso.id}
                          </Badge>
                          <span className="font-medium">{caso.nome}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{caso.dataHora}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{caso.responsavel}</span>
                        </div>
                      </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="ml-4 flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50" title="Concluir protocolo">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" 
                        title="Adicionar motivo"
                        onClick={() => handleOpenModalMotivo(caso)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/casos-pendentes/${caso.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Paginação */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-600">
                Mostrando {(paginaAtual - 1) * itensPorPagina + 1}-{Math.min(paginaAtual * itensPorPagina, casosFiltrados.length)} de {casosFiltrados.length} contatos
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
                  disabled={paginaAtual === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <span className="text-sm">
                  Página {paginaAtual} de {totalPaginasFiltradas}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setPaginaAtual(Math.min(totalPaginasFiltradas, paginaAtual + 1))}
                  disabled={paginaAtual === totalPaginasFiltradas}
                >
                  Próximo
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar - Eventos de Hoje */}
          <div className="w-80 space-y-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Eventos de Hoje
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {EVENTOS_HOJE.map((evento) => (
                  <div key={evento.id} className={`${getEventoStatusClass(`supervisor-${evento.id}`, evento.horario)} group`}>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h4 className={`font-medium text-sm ${getEventoStatusText(`supervisor-${evento.id}`, evento.horario)}`}>{evento.titulo}</h4>
                        <p className={`text-xs ${eventosStatus[`supervisor-${evento.id}`] ? 'text-gray-400' : getEventoStatus(evento.horario) === 'passado' ? 'text-gray-400' : 'text-gray-600'}`}>{evento.participantes}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <div className={`flex items-center gap-1 text-xs ${
                          eventosStatus[`supervisor-${evento.id}`] ? 'text-gray-400' :
                          getEventoStatus(evento.horario) === 'passado' ? 'text-gray-400' :
                          getEventoStatus(evento.horario) === 'proximo' ? 'text-orange-600' :
                          'text-gray-500'
                        }`}>
                          <Clock className="h-3 w-3" />
                          {evento.horario}
                        </div>
                        <div className={`flex gap-1 ${
                          eventosStatus[`supervisor-${evento.id}`] ? 'opacity-0 group-hover:opacity-100' : ''
                        } transition-opacity duration-200`}>
                          {eventosStatus[`supervisor-${evento.id}`] === 'concluido' ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                                onClick={() => setEventosStatus(prev => ({ ...prev, [`supervisor-${evento.id}`]: undefined }))}
                                title="Marcar como pendente"
                              >
                                ↺
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                onClick={() => handleEventoAction(`supervisor-${evento.id}`, 'cancelado')}
                              >
                                ✕
                              </Button>
                            </>
                          ) : eventosStatus[`supervisor-${evento.id}`] === 'cancelado' ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                onClick={() => handleEventoAction(`supervisor-${evento.id}`, 'concluido')}
                              >
                                ✓
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                                onClick={() => setEventosStatus(prev => ({ ...prev, [`supervisor-${evento.id}`]: undefined }))}
                                title="Marcar como pendente"
                              >
                                ↺
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                onClick={() => handleEventoAction(`supervisor-${evento.id}`, 'concluido')}
                              >
                                ✓
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                onClick={() => handleEventoAction(`supervisor-${evento.id}`, 'cancelado')}
                              >
                                ✕
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
        )}

        {/* Aba Atendimento */}
        {abaAtiva === 'atendimento' && (
          <div className="flex gap-6">
            {/* Sidebar de Pendências - Atendimento */}
            <div className="w-80 space-y-3 bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 shadow-lg">
              {/* Seção Contatos sem resolução */}
              <Collapsible open={isContatosExpanded} onOpenChange={setIsContatosExpanded}>
                <CollapsibleTrigger asChild>
                  <div className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 border group ${
                    tipoFiltro === 'contatos'
                      ? 'bg-[#3BC0A8]/10 border-[#3BC0A8]/30 shadow-sm'
                      : 'hover:bg-[#3BC0A8]/5 border-transparent hover:border-[#3BC0A8]/20'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div>
                        <Contact className="h-5 w-5 text-[#3BC0A8]" />
                      </div>
                      <span className="font-semibold text-gray-700">Protocolos</span>
                      <Badge variant="destructive" className="ml-2">3</Badge>
                    </div>
                    {isContatosExpanded ? (
                      <ChevronUp className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 ml-6 mt-2">
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start text-sm transition-colors ${
                      filtroAtivo === 'motivo-cliente' && tipoFiltro === 'contatos'
                        ? 'bg-[#3BC0A8]/15 text-gray-700 font-medium border border-[#3BC0A8]/30'
                        : 'hover:bg-[#3BC0A8]/10 text-gray-600'
                    }`}
                    onClick={() => handleSubmenuClick('motivo-cliente', 'contatos')}
                  >
                    <span>Aberto</span>
                    <Badge className="ml-auto bg-red-50 text-red-700 border-red-200 hover:bg-red-50">2</Badge>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start text-sm transition-colors ${
                      filtroAtivo === 'motivo-interno' && tipoFiltro === 'contatos'
                        ? 'bg-[#3BC0A8]/15 text-gray-700 font-medium border border-[#3BC0A8]/30'
                        : 'hover:bg-[#3BC0A8]/10 text-gray-600'
                    }`}
                    onClick={() => handleSubmenuClick('motivo-interno', 'contatos')}
                  >
                    <span>Em andamento</span>
                    <Badge className="ml-auto bg-red-50 text-red-700 border-red-200 hover:bg-red-50">1</Badge>
                  </Button>
                </CollapsibleContent>
              </Collapsible>

              {/* Seção Queixas Técnicas */}
              <Collapsible open={isQueixasExpanded} onOpenChange={setIsQueixasExpanded}>
                <CollapsibleTrigger asChild>
                  <div className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 border group ${
                    tipoFiltro === 'queixas'
                      ? 'bg-[#3BC0A8]/10 border-[#3BC0A8]/30 shadow-sm'
                      : 'hover:bg-[#3BC0A8]/5 border-transparent hover:border-[#3BC0A8]/20'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div>
                        <TriangleAlert className="h-5 w-5 text-[#3BC0A8]" />
                      </div>
                      <span className="font-semibold text-gray-700">Queixas Técnicas</span>
                      <Badge variant="destructive" className="ml-2">5</Badge>
                    </div>
                    {isQueixasExpanded ? (
                      <ChevronUp className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 ml-6 mt-2">
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start text-sm transition-colors ${
                      filtroAtivo === 'aberto' && tipoFiltro === 'queixas'
                        ? 'bg-[#3BC0A8]/15 text-gray-700 font-medium border border-[#3BC0A8]/30'
                        : 'hover:bg-[#3BC0A8]/10 text-gray-600'
                    }`}
                    onClick={() => handleSubmenuClick('aberto', 'queixas')}
                  >
                    <span>Aberto</span>
                    <Badge className="ml-auto bg-red-50 text-red-700 border-red-200 hover:bg-red-50">3</Badge>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start text-sm transition-colors ${
                      filtroAtivo === 'rejeitado' && tipoFiltro === 'queixas'
                        ? 'bg-[#3BC0A8]/15 text-gray-700 font-medium border border-[#3BC0A8]/30'
                        : 'hover:bg-[#3BC0A8]/10 text-gray-600'
                    }`}
                    onClick={() => handleSubmenuClick('rejeitado', 'queixas')}
                  >
                    <span>Rejeitado</span>
                    <Badge className="ml-auto bg-red-50 text-red-700 border-red-200 hover:bg-red-50">2</Badge>
                  </Button>
                </CollapsibleContent>
              </Collapsible>

              {/* Seção Farmacovigilância */}
              <Collapsible open={isFarmacovigilanciaExpanded} onOpenChange={setIsFarmacovigilanciaExpanded}>
                <CollapsibleTrigger asChild>
                  <div className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 border group ${
                    tipoFiltro === 'farmacovigilancia'
                      ? 'bg-[#3BC0A8]/10 border-[#3BC0A8]/30 shadow-sm'
                      : 'hover:bg-[#3BC0A8]/5 border-transparent hover:border-[#3BC0A8]/20'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div>
                        <Pill className="h-5 w-5 text-[#3BC0A8]" />
                      </div>
                      <span className="font-semibold text-gray-700">Farmacovigilância</span>
                      <Badge variant="destructive" className="ml-2">5</Badge>
                    </div>
                    {isFarmacovigilanciaExpanded ? (
                      <ChevronUp className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 ml-6 mt-2">
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start text-sm transition-colors ${
                      filtroAtivo === 'aberto' && tipoFiltro === 'farmacovigilancia'
                        ? 'bg-[#3BC0A8]/15 text-gray-700 font-medium border border-[#3BC0A8]/30'
                        : 'hover:bg-[#3BC0A8]/10 text-gray-600'
                    }`}
                    onClick={() => handleSubmenuClick('aberto', 'farmacovigilancia')}
                  >
                    <span>Aberto</span>
                    <Badge className="ml-auto bg-red-50 text-red-700 border-red-200 hover:bg-red-50">2</Badge>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start text-sm transition-colors ${
                      filtroAtivo === 'rejeitado' && tipoFiltro === 'farmacovigilancia'
                        ? 'bg-[#3BC0A8]/15 text-gray-700 font-medium border border-[#3BC0A8]/30'
                        : 'hover:bg-[#3BC0A8]/10 text-gray-600'
                    }`}
                    onClick={() => handleSubmenuClick('rejeitado', 'farmacovigilancia')}
                  >
                    <span>Rejeitado</span>
                    <Badge className="ml-auto bg-red-50 text-red-700 border-red-200 hover:bg-red-50">1</Badge>
                  </Button>
                </CollapsibleContent>
              </Collapsible>


            </div>

            {/* Conteúdo Principal - Lista de Casos Atendimento */}
            <div className="flex-1 space-y-4">
              {casosExibidos.map((caso) => (
                <Card key={caso.id} className={`hover:shadow-md transition-shadow ${
                  filtroAtivo === 'primeira' && tipoFiltro === 'contatos' 
                    ? 'border-l-4 border-l-blue-500 bg-blue-50/30' 
                    : filtroAtivo === 'reagendamento' && tipoFiltro === 'contatos'
                    ? 'border-l-4 border-l-green-500 bg-green-50/30'
                    : ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        {/* Linha 1: Protocolo */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-600" />
                            <span className="font-semibold text-lg">{caso.protocolo}</span>
                          </div>
                          {/* Tag de Gravidade apenas para Farmacovigilância */}
                          {caso.categoria === 'farmacovigilancia' && (
                            <Badge className={`text-xs ${getGravidadeColor(caso.status)}`}>
                              {getGravidadeTag(caso.status)}
                            </Badge>
                          )}
                          {/* Exibir tag do motivo adicionado */}
                          {casosComMotivo[caso.id] && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              {casosComMotivo[caso.id].tipo}: {casosComMotivo[caso.id].motivo}
                            </Badge>
                          )}
                        </div>

                        {/* Linha 2: Motivo Principal, Subcategoria e Detalhe */}
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="secondary" className="text-xs">
                            {caso.motivoPrincipal}
                          </Badge>
                          <ChevronRight className="h-3 w-3 text-gray-400" />
                          <Badge variant="secondary" className="text-xs">
                            {caso.subcategoria}
                          </Badge>
                          <ChevronRight className="h-3 w-3 text-gray-400" />
                          <Badge variant="secondary" className="text-xs">
                            {caso.detalhe}
                          </Badge>
                        </div>

                        {/* Linha 3: ID, Nome, Data e Responsável */}
                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs font-mono">
                              ID: {caso.id.replace(/[^0-9]/g, '')}
                            </Badge>
                            <span className="font-medium">{caso.nome}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{caso.dataHora}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{caso.responsavel}</span>
                          </div>
                        </div>
                      </div>

                      {/* Botões de Ação */}
                      <div className="ml-4 flex items-center gap-2">
                        <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50" title="Concluir protocolo">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" 
                          title="Adicionar motivo"
                          onClick={() => handleOpenModalMotivo(caso)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/casos-pendentes/${caso.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Paginação */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600">
                  Mostrando {(paginaAtual - 1) * itensPorPagina + 1}-{Math.min(paginaAtual * itensPorPagina, casosExibidos.length)} de {casosExibidos.length} casos
                </p>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
                    disabled={paginaAtual === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  <span className="text-sm">
                    Página {paginaAtual} de {totalPaginasFiltradas}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPaginaAtual(Math.min(totalPaginasFiltradas, paginaAtual + 1))}
                    disabled={paginaAtual === totalPaginasFiltradas}
                  >
                    Próximo
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar - Eventos de Hoje Atendimento */}
            <div className="w-80 space-y-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Eventos de Hoje
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {EVENTOS_ATENDIMENTO.map((evento) => (
                    <div key={evento.id} className={`${getEventoStatusClass(`atendimento-${evento.id}`, evento.horario)} group`}>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <h4 className={`font-medium text-sm ${getEventoStatusText(`atendimento-${evento.id}`, evento.horario)}`}>{evento.titulo}</h4>
                          <p className={`text-xs ${eventosStatus[`atendimento-${evento.id}`] ? 'text-gray-400' : getEventoStatus(evento.horario) === 'passado' ? 'text-gray-400' : 'text-gray-600'}`}>{evento.participantes}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <div className={`flex items-center gap-1 text-xs ${
                            eventosStatus[`atendimento-${evento.id}`] ? 'text-gray-400' :
                            getEventoStatus(evento.horario) === 'passado' ? 'text-gray-400' :
                            getEventoStatus(evento.horario) === 'proximo' ? 'text-orange-600' :
                            'text-gray-500'
                          }`}>
                            <Clock className="h-3 w-3" />
                            {evento.horario}
                          </div>
                          <div className={`flex gap-1 ${
                            eventosStatus[`atendimento-${evento.id}`] ? 'opacity-0 group-hover:opacity-100' : ''
                          } transition-opacity duration-200`}>
                            {eventosStatus[`atendimento-${evento.id}`] === 'concluido' ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                                  onClick={() => setEventosStatus(prev => ({ ...prev, [`atendimento-${evento.id}`]: undefined }))}
                                  title="Marcar como pendente"
                                >
                                  ↺
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                  onClick={() => handleEventoAction(`atendimento-${evento.id}`, 'cancelado')}
                                >
                                  ✕
                                </Button>
                              </>
                            ) : eventosStatus[`atendimento-${evento.id}`] === 'cancelado' ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                  onClick={() => handleEventoAction(`atendimento-${evento.id}`, 'concluido')}
                                >
                                  ✓
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                                  onClick={() => setEventosStatus(prev => ({ ...prev, [`atendimento-${evento.id}`]: undefined }))}
                                  title="Marcar como pendente"
                                >
                                  ↺
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                  onClick={() => handleEventoAction(`atendimento-${evento.id}`, 'concluido')}
                                >
                                  ✓
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                  onClick={() => handleEventoAction(`atendimento-${evento.id}`, 'cancelado')}
                                >
                                  ✕
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Aba Qualidade */}
        {abaAtiva === 'qualidade' && (
          <div className="flex gap-6">
            {/* Sidebar de Pendências - Qualidade */}
            <div className="w-80 space-y-3 bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 shadow-lg">
              {/* Seção Controle Qualidade */}
              <Collapsible open={isQueixasExpanded} onOpenChange={setIsQueixasExpanded}>
                <CollapsibleTrigger asChild>
                  <div className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 border group hover:bg-[#3BC0A8]/5 ${
                    (tipoFiltro === 'queixas' && isQueixasExpanded) 
                      ? 'bg-[#3BC0A8]/10 border-[#3BC0A8]/30' 
                      : 'border-transparent hover:border-[#3BC0A8]/20'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div>
                        <TriangleAlert className="h-5 w-5 text-[#3BC0A8]" />
                      </div>
                      <span className="font-semibold text-gray-700">Queixas Técnicas</span>
                      <Badge variant="destructive" className="ml-2">{CASOS_QUALIDADE.length}</Badge>
                    </div>
                    {isQueixasExpanded ? (
                      <ChevronUp className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 ml-6 mt-2">
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start text-sm transition-colors ${
                      filtroAtivo === 'revisao' && tipoFiltro === 'queixas'
                        ? 'bg-[#3BC0A8]/15 text-gray-700 font-medium border border-[#3BC0A8]/30'
                        : 'hover:bg-[#3BC0A8]/10 text-gray-600'
                    }`}
                    onClick={() => handleSubmenuClick('revisao', 'queixas')}
                  >
                    <span>Qualidade</span>
                    <Badge className="ml-auto bg-red-50 text-red-700 border-red-200 hover:bg-red-50">
                      {CASOS_QUALIDADE.filter(caso => caso.submenu === 'revisao').length}
                    </Badge>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start text-sm transition-colors ${
                      filtroAtivo === 'retornado' && tipoFiltro === 'queixas'
                        ? 'bg-[#3BC0A8]/15 text-gray-700 font-medium border border-[#3BC0A8]/30'
                        : 'hover:bg-[#3BC0A8]/10 text-gray-600'
                    }`}
                    onClick={() => handleSubmenuClick('retornado', 'queixas')}
                  >
                    <span>Em análise</span>
                    <Badge className="ml-auto bg-red-50 text-red-700 border-red-200 hover:bg-red-50">
                      {CASOS_QUALIDADE.filter(caso => caso.submenu === 'retornado').length}
                    </Badge>
                  </Button>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Conteúdo Principal - Lista de Casos Qualidade */}
            <div className="flex-1 space-y-4">
              {casosExibidos.length > 0 ? (
                casosExibidos.map((caso) => (
                  <Card key={caso.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          {/* Linha 1: ID e Nome */}
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs font-mono">
                              ID: {caso.id.replace(/[^0-9]/g, '')}
                            </Badge>
                            <h3 className="font-semibold text-lg">{caso.nome}</h3>
                          </div>

                          {/* Linha 2: Motivo Principal, Subcategoria e Detalhe */}
                          <div className="flex items-center gap-2 text-sm">
                            <Badge variant="secondary" className="text-xs">
                              {caso.motivoPrincipal}
                            </Badge>
                            <ChevronRight className="h-3 w-3 text-gray-400" />
                            <Badge variant="secondary" className="text-xs">
                              {caso.subcategoria}
                            </Badge>
                            <ChevronRight className="h-3 w-3 text-gray-400" />
                            <Badge variant="secondary" className="text-xs">
                              {caso.detalhe}
                            </Badge>
                          </div>

                          {/* Linha 3: Protocolo, Data e Responsável */}
                          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span>{caso.protocolo}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4" />
                              <span>{caso.dataHora}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>{caso.responsavel}</span>
                            </div>
                          </div>
                        </div>

                        {/* Botão de Ação */}
                        <div className="ml-4">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/casos-pendentes/${caso.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum caso encontrado para o filtro selecionado.</p>
                </div>
              )}
              
              {/* Paginação */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600">
                  Mostrando {Math.min((paginaAtual - 1) * itensPorPagina + 1, casosExibidos.length)}-{Math.min(paginaAtual * itensPorPagina, casosExibidos.length)} de {casosExibidos.length} casos
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                    disabled={paginaAtual === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  <span className="text-sm">
                    Página {paginaAtual} de {Math.max(1, Math.ceil(casosExibidos.length / itensPorPagina))}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPaginaAtual(prev => Math.min(prev + 1, Math.ceil(casosExibidos.length / itensPorPagina)))}
                    disabled={paginaAtual >= Math.ceil(casosExibidos.length / itensPorPagina)}
                  >
                    Próximo
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar - Eventos de Hoje Qualidade */}
            <div className="w-80 space-y-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Eventos de Hoje
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {EVENTOS_QUALIDADE.map((evento) => (
                    <div key={evento.id} className={`${getEventoStatusClass(`qualidade-${evento.id}`, evento.horario)} group`}>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <h4 className={`font-medium text-sm ${getEventoStatusText(`qualidade-${evento.id}`, evento.horario)}`}>{evento.titulo}</h4>
                          <p className={`text-xs ${eventosStatus[`qualidade-${evento.id}`] ? 'text-gray-400' : getEventoStatus(evento.horario) === 'passado' ? 'text-gray-400' : 'text-gray-600'}`}>{evento.participantes}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <div className={`flex items-center gap-1 text-xs ${
                            eventosStatus[`qualidade-${evento.id}`] ? 'text-gray-400' :
                            getEventoStatus(evento.horario) === 'passado' ? 'text-gray-400' :
                            getEventoStatus(evento.horario) === 'proximo' ? 'text-orange-600' :
                            'text-gray-500'
                          }`}>
                            <Clock className="h-3 w-3" />
                            {evento.horario}
                          </div>
                          <div className={`flex gap-1 ${
                            eventosStatus[`qualidade-${evento.id}`] ? 'opacity-0 group-hover:opacity-100' : ''
                          } transition-opacity duration-200`}>
                            {eventosStatus[`qualidade-${evento.id}`] === 'concluido' ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                                  onClick={() => setEventosStatus(prev => ({ ...prev, [`qualidade-${evento.id}`]: undefined }))}
                                  title="Marcar como pendente"
                                >
                                  ↺
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                  onClick={() => handleEventoAction(`qualidade-${evento.id}`, 'cancelado')}
                                >
                                  ✕
                                </Button>
                              </>
                            ) : eventosStatus[`qualidade-${evento.id}`] === 'cancelado' ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                  onClick={() => handleEventoAction(`qualidade-${evento.id}`, 'concluido')}
                                >
                                  ✓
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                                  onClick={() => setEventosStatus(prev => ({ ...prev, [`qualidade-${evento.id}`]: undefined }))}
                                  title="Marcar como pendente"
                                >
                                  ↺
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                  onClick={() => handleEventoAction(`qualidade-${evento.id}`, 'concluido')}
                                >
                                  ✓
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                  onClick={() => handleEventoAction(`qualidade-${evento.id}`, 'cancelado')}
                                >
                                  ✕
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Aba Farmacovigilância */}
        {abaAtiva === 'farmacovigilancia' && (
          <div className="flex gap-6">
            {/* Sidebar de Pendências - Farmacovigilância */}
            <div className="w-80 space-y-3 bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 shadow-lg">
              {/* Seção Eventos Adversos */}
              <Collapsible open={isFarmacovigilanciaExpanded} onOpenChange={setIsFarmacovigilanciaExpanded}>
                <CollapsibleTrigger asChild>
                  <div className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 border group hover:bg-[#3BC0A8]/5 ${
                    (tipoFiltro === 'farmacovigilancia' && isFarmacovigilanciaExpanded) 
                      ? 'bg-[#3BC0A8]/10 border-[#3BC0A8]/30' 
                      : 'border-transparent hover:border-[#3BC0A8]/20'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div>
                        <Pill className="h-5 w-5 text-[#3BC0A8]" />
                      </div>
                      <span className="font-semibold text-gray-700">Farmacovigilância</span>
                      <Badge variant="destructive" className="ml-2">3</Badge>
                    </div>
                    {isFarmacovigilanciaExpanded ? (
                       <ChevronUp className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                     ) : (
                       <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                     )}
                   </div>
                 </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 ml-6 mt-2">
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start text-sm transition-colors ${
                      filtroAtivo === 'revisao' && tipoFiltro === 'farmacovigilancia'
                        ? 'bg-[#3BC0A8]/15 text-gray-700 font-medium border border-[#3BC0A8]/30'
                        : 'hover:bg-[#3BC0A8]/10 text-gray-600'
                    }`}
                    onClick={() => handleSubmenuClick('revisao', 'farmacovigilancia')}
                  >
                    <span>Farmacovigilância</span>
                    <Badge className="ml-auto bg-red-50 text-red-700 border-red-200 hover:bg-red-50">2</Badge>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start text-sm transition-colors ${
                      filtroAtivo === 'followup' && tipoFiltro === 'farmacovigilancia'
                        ? 'bg-[#3BC0A8]/15 text-gray-700 font-medium border border-[#3BC0A8]/30'
                        : 'hover:bg-[#3BC0A8]/10 text-gray-600'
                    }`}
                    onClick={() => handleSubmenuClick('followup', 'farmacovigilancia')}
                  >
                    <span>Follow-up</span>
                    <Badge className="ml-auto bg-red-50 text-red-700 border-red-200 hover:bg-red-50">1</Badge>
                  </Button>

                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Conteúdo Principal - Lista de Casos Farmacovigilância */}
            <div className="flex-1 space-y-4">
              {CASOS_FARMACOVIGILANCIA.map((caso) => (
                <Card key={caso.id} className={`hover:shadow-md transition-shadow ${
                  filtroAtivo === 'graves' && tipoFiltro === 'eventos' 
                    ? 'border-l-4 border-l-red-500 bg-red-50/30' 
                    : filtroAtivo === 'eficacia' && tipoFiltro === 'eventos'
                    ? 'border-l-4 border-l-yellow-500 bg-yellow-50/30'
                    : ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        {/* Linha 1: ID e Nome */}
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs font-mono">
                            ID: {caso.id.replace(/[^0-9]/g, '')}
                          </Badge>
                          <h3 className="font-semibold text-lg">{caso.nome}</h3>
                          <Badge className={getGravidadeColor(caso.status)}>
                            {caso.status}
                          </Badge>
                        </div>

                        {/* Linha 2: Motivo Principal, Subcategoria e Detalhe */}
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="secondary" className="text-xs">
                            {caso.motivoPrincipal}
                          </Badge>
                          <ChevronRight className="h-3 w-3 text-gray-400" />
                          <Badge variant="secondary" className="text-xs">
                            {caso.subcategoria}
                          </Badge>
                          <ChevronRight className="h-3 w-3 text-gray-400" />
                          <Badge variant="secondary" className="text-xs">
                            {caso.detalhe}
                          </Badge>
                        </div>

                        {/* Linha 3: Protocolo, Data e Responsável */}
                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>{caso.protocolo}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{caso.dataHora}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{caso.responsavel}</span>
                          </div>
                        </div>
                      </div>

                      {/* Botão de Ação */}
                      <div className="ml-4">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/casos-pendentes/${caso.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Paginação */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600">
                  Mostrando 1-{Math.min(itensPorPagina, CASOS_FARMACOVIGILANCIA.length)} de {CASOS_FARMACOVIGILANCIA.length} casos
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
                    disabled={paginaAtual === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  <span className="text-sm">
                    Página {paginaAtual} de {Math.max(1, Math.ceil(CASOS_FARMACOVIGILANCIA.length / itensPorPagina))}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPaginaAtual(Math.min(Math.ceil(CASOS_FARMACOVIGILANCIA.length / itensPorPagina), paginaAtual + 1))}
                    disabled={paginaAtual >= Math.ceil(CASOS_FARMACOVIGILANCIA.length / itensPorPagina)}
                  >
                    Próximo
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar - Eventos de Hoje Farmacovigilância */}
            <div className="w-80 space-y-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Eventos de Hoje
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {EVENTOS_FARMACOVIGILANCIA.map((evento) => (
                    <div key={evento.id} className={`${getEventoStatusClass(`farmacovigilancia-${evento.id}`, evento.horario)} group`}>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <h4 className={`font-medium text-sm ${getEventoStatusText(`farmacovigilancia-${evento.id}`, evento.horario)}`}>{evento.titulo}</h4>
                          <p className={`text-xs ${eventosStatus[`farmacovigilancia-${evento.id}`] ? 'text-gray-400' : getEventoStatus(evento.horario) === 'passado' ? 'text-gray-400' : 'text-gray-600'}`}>{evento.participantes}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <div className={`flex items-center gap-1 text-xs ${
                            eventosStatus[`farmacovigilancia-${evento.id}`] ? 'text-gray-400' :
                            getEventoStatus(evento.horario) === 'passado' ? 'text-gray-400' :
                            getEventoStatus(evento.horario) === 'proximo' ? 'text-orange-600' :
                            'text-gray-500'
                          }`}>
                            <Clock className="h-3 w-3" />
                            {evento.horario}
                          </div>
                          <div className={`flex gap-1 ${
                            eventosStatus[`farmacovigilancia-${evento.id}`] ? 'opacity-0 group-hover:opacity-100' : ''
                          } transition-opacity duration-200`}>
                            {eventosStatus[`farmacovigilancia-${evento.id}`] === 'concluido' ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                                  onClick={() => setEventosStatus(prev => ({ ...prev, [`farmacovigilancia-${evento.id}`]: undefined }))}
                                  title="Marcar como pendente"
                                >
                                  ↺
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                  onClick={() => handleEventoAction(`farmacovigilancia-${evento.id}`, 'cancelado')}
                                >
                                  ✕
                                </Button>
                              </>
                            ) : eventosStatus[`farmacovigilancia-${evento.id}`] === 'cancelado' ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                  onClick={() => handleEventoAction(`farmacovigilancia-${evento.id}`, 'concluido')}
                                >
                                  ✓
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                                  onClick={() => setEventosStatus(prev => ({ ...prev, [`farmacovigilancia-${evento.id}`]: undefined }))}
                                  title="Marcar como pendente"
                                >
                                  ↺
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                  onClick={() => handleEventoAction(`farmacovigilancia-${evento.id}`, 'concluido')}
                                >
                                  ✓
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                  onClick={() => handleEventoAction(`farmacovigilancia-${evento.id}`, 'cancelado')}
                                >
                                  ✕
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Modal para Adicionar Motivo */}
      <AdicionarMotivoModal
        isOpen={isModalMotivoOpen}
        onClose={() => setIsModalMotivoOpen(false)}
        onSubmit={handleSubmitMotivo}
      />
    </DashboardLayout>
  )
}