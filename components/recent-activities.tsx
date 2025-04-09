import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, AlertTriangle, PhoneCall, MessageSquare } from "lucide-react"

interface ActivityProps {
  avatar: string
  name: string
  action: string
  target: string
  time: string
  type: "completed" | "pending" | "call" | "message"
}

function Activity({ avatar, name, action, target, time, type }: ActivityProps) {
  const icons = {
    completed: <CheckCircle className="h-4 w-4 text-emerald-500" />,
    pending: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    call: <PhoneCall className="h-4 w-4 text-blue-500" />,
    message: <MessageSquare className="h-4 w-4 text-purple-500" />,
  }

  return (
    <div className="flex items-start gap-4 py-3">
      <Avatar className="h-9 w-9">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium leading-none">{name}</p>
          <div className="rounded-full p-1 bg-muted">{icons[type]}</div>
        </div>
        <p className="text-sm text-muted-foreground">
          {action} <span className="font-medium text-foreground">{target}</span>
        </p>
      </div>
      <p className="text-xs text-muted-foreground">{time}</p>
    </div>
  )
}

export function RecentActivities() {
  const activities = [
    {
      avatar: "/placeholder.svg?height=36&width=36",
      name: "Ana Silva",
      action: "Resolveu queixa técnica",
      target: "#QT-2023-0587",
      time: "há 5 min",
      type: "completed" as const,
    },
    {
      avatar: "/placeholder.svg?height=36&width=36",
      name: "Carlos Mendes",
      action: "Registrou evento adverso",
      target: "#EA-2023-0124",
      time: "há 27 min",
      type: "pending" as const,
    },
    {
      avatar: "/placeholder.svg?height=36&width=36",
      name: "Juliana Costa",
      action: "Realizou contato com",
      target: "Maria Oliveira",
      time: "há 1h",
      type: "call" as const,
    },
    {
      avatar: "/placeholder.svg?height=36&width=36",
      name: "Roberto Alves",
      action: "Enviou mensagem para",
      target: "Equipe Técnica",
      time: "há 3h",
      type: "message" as const,
    },
  ]

  return (
    <div className="space-y-1">
      {activities.map((activity, index) => (
        <Activity key={index} {...activity} />
      ))}
    </div>
  )
}

