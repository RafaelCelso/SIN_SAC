"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { ElementType } from "@/components/form-builder/form-builder"
import {
  AlignLeft,
  Calendar,
  CheckSquare,
  ChevronsUpDown,
  Heading1,
  Mail,
  Radio,
  Layers,
  Type,
  Hash,
} from "lucide-react"

interface FormElementPaletteProps {
  onAddElement: (type: ElementType) => void
}

interface ElementOption {
  type: ElementType
  label: string
  icon: React.ReactNode
  description: string
}

export function FormElementPalette({ onAddElement }: FormElementPaletteProps) {
  const basicElements: ElementOption[] = [
    {
      type: "text",
      label: "Texto",
      icon: <Type className="h-4 w-4" />,
      description: "Campo de texto simples",
    },
    {
      type: "textarea",
      label: "Área de Texto",
      icon: <AlignLeft className="h-4 w-4" />,
      description: "Campo para textos longos",
    },
    {
      type: "number",
      label: "Número",
      icon: <Hash className="h-4 w-4" />,
      description: "Campo para valores numéricos",
    },
    {
      type: "email",
      label: "Email",
      icon: <Mail className="h-4 w-4" />,
      description: "Campo para endereços de email",
    },
  ]

  const advancedElements: ElementOption[] = [
    {
      type: "select",
      label: "Seleção",
      icon: <ChevronsUpDown className="h-4 w-4" />,
      description: "Lista suspensa de opções",
    },
    {
      type: "radio",
      label: "Opção Única",
      icon: <Radio className="h-4 w-4" />,
      description: "Botões de opção única",
    },
    {
      type: "checkbox",
      label: "Caixa de Seleção",
      icon: <CheckSquare className="h-4 w-4" />,
      description: "Opções de múltipla escolha",
    },
    {
      type: "date",
      label: "Data",
      icon: <Calendar className="h-4 w-4" />,
      description: "Seletor de data",
    },
  ]

  const layoutElements: ElementOption[] = [
    {
      type: "section",
      label: "Seção",
      icon: <Layers className="h-4 w-4" />,
      description: "Agrupa campos relacionados",
    },
    {
      type: "heading",
      label: "Título",
      icon: <Heading1 className="h-4 w-4" />,
      description: "Título ou subtítulo",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Elementos</CardTitle>
        <CardDescription>Arraste ou clique para adicionar ao formulário</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-300px)] px-4">
          <div className="space-y-6 pb-6">
            <div>
              <h3 className="mb-2 px-2 text-sm font-medium">Campos Básicos</h3>
              <div className="space-y-2">
                {basicElements.map((element) => (
                  <Button
                    key={element.type}
                    variant="outline"
                    className="w-full justify-start text-left"
                    onClick={() => onAddElement(element.type)}
                  >
                    <div className="mr-2">{element.icon}</div>
                    <div>
                      <div className="font-medium">{element.label}</div>
                      <div className="text-xs text-muted-foreground">{element.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 px-2 text-sm font-medium">Campos Avançados</h3>
              <div className="space-y-2">
                {advancedElements.map((element) => (
                  <Button
                    key={element.type}
                    variant="outline"
                    className="w-full justify-start text-left"
                    onClick={() => onAddElement(element.type)}
                  >
                    <div className="mr-2">{element.icon}</div>
                    <div>
                      <div className="font-medium">{element.label}</div>
                      <div className="text-xs text-muted-foreground">{element.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 px-2 text-sm font-medium">Layout</h3>
              <div className="space-y-2">
                {layoutElements.map((element) => (
                  <Button
                    key={element.type}
                    variant="outline"
                    className="w-full justify-start text-left"
                    onClick={() => onAddElement(element.type)}
                  >
                    <div className="mr-2">{element.icon}</div>
                    <div>
                      <div className="font-medium">{element.label}</div>
                      <div className="text-xs text-muted-foreground">{element.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

