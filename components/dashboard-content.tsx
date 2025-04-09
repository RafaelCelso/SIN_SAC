"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  BadgeAlert,
  Search,
  CalendarIcon,
  ArrowUpRight,
  ArrowDownRight,
  PhoneCall,
} from "lucide-react"
import { DashboardChart } from "@/components/dashboard-chart"
import { RecentActivities } from "@/components/recent-activities"
import { IniciarAtendimentoModal } from "@/components/iniciar-atendimento-modal"

interface StatusCardProps {
  title: string
  count: number
  icon: React.ReactNode
  variant?: "default" | "pending" | "completed"
  trend?: "up" | "down" | "neutral"
  percentage?: number
  timeframe?: string
}

function StatusCard({
  title,
  count,
  icon,
  variant = "default",
  trend = "neutral",
  percentage = 0,
  timeframe = "desde o mês passado",
}: StatusCardProps) {
  const variantStyles = {
    default: "bg-card",
    pending: "bg-amber-50 border-amber-200",
    completed: "bg-teal-50 border-teal-200",
  }

  const trendIcon = {
    up: <ArrowUpRight className="h-4 w-4 text-teal-600" />,
    down: <ArrowDownRight className="h-4 w-4 text-red-600" />,
    neutral: null,
  }

  const trendColor = {
    up: "text-teal-600",
    down: "text-red-600",
    neutral: "text-gray-500",
  }

  return (
    <Card
      className={`${variantStyles[variant]} hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-background shadow-sm">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{count.toLocaleString()}</div>
        {trend !== "neutral" && (
          <div className="flex items-center mt-2 text-xs">
            <span className="flex items-center gap-1">
              {trendIcon[trend]}
              <span className={trendColor[trend]}>{percentage}%</span>
            </span>
            <span className="text-gray-500 ml-1">{timeframe}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="ghost" size="sm" className="text-xs px-0 hover:bg-transparent hover:underline">
          Ver detalhes
        </Button>
      </CardFooter>
    </Card>
  )
}

export function DashboardContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAtendimentoModal, setShowAtendimentoModal] = useState(false)
  const [date, setDate] = useState<Date>()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-teal-800">Dashboard</h1>
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar atendimentos..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 flex-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-teal-800">Total de pendências</CardTitle>
              <Badge variant="outline" className="bg-teal-100 text-teal-800 hover:bg-teal-200">
                Atualizado há 5 min
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <p className="text-5xl font-bold text-teal-800">1047</p>
            <p className="text-sm text-teal-700 mt-2">Distribuídos em 6 categorias diferentes</p>
          </CardContent>
        </Card>

        <Button
          className="md:w-auto h-auto py-6 px-6 bg-teal-600 hover:bg-teal-700 text-white text-lg font-medium"
          onClick={() => setShowAtendimentoModal(true)}
        >
          <PhoneCall className="mr-2 h-5 w-5" />
          Iniciar Novo Atendimento
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Tabs defaultValue="cards" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <TabsList className="grid w-full sm:w-[200px] grid-cols-2">
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="chart">Gráficos</TabsTrigger>
            </TabsList>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd/MM/yyyy") : <span>Filtrar por data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <TabsContent value="cards" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <StatusCard
                title="Queixas Técnicas Pendentes"
                count={1016}
                icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
                variant="pending"
                trend="up"
                percentage={12}
              />
              <StatusCard
                title="Queixas Técnicas Realizadas"
                count={187}
                icon={<CheckCircle className="h-5 w-5 text-teal-500" />}
                variant="completed"
                trend="up"
                percentage={8}
              />
              <StatusCard
                title="Eventos Adversos Pendentes"
                count={21}
                icon={<BadgeAlert className="h-5 w-5 text-amber-500" />}
                variant="pending"
                trend="down"
                percentage={5}
              />
              <StatusCard
                title="Eventos Adversos Realizados"
                count={1264}
                icon={<CheckCircle className="h-5 w-5 text-teal-500" />}
                variant="completed"
                trend="up"
                percentage={23}
              />
              <StatusCard
                title="Informações Médicas Pendentes"
                count={10}
                icon={<HelpCircle className="h-5 w-5 text-amber-500" />}
                variant="pending"
                trend="down"
                percentage={15}
              />
              <StatusCard
                title="Contatos para retorno"
                count={87}
                icon={<PhoneCall className="h-5 w-5 text-teal-500" />}
                trend="neutral"
              />
            </div>
          </TabsContent>

          <TabsContent value="chart" className="mt-0">
            <DashboardChart />
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivities />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Gráfico de distribuição por categoria
            </div>
          </CardContent>
        </Card>
      </div>

      <IniciarAtendimentoModal open={showAtendimentoModal} onOpenChange={setShowAtendimentoModal} />
    </div>
  )
}

