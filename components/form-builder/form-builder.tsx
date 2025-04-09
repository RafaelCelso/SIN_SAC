"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormElementPalette } from "@/components/form-builder/form-element-palette"
import { FormElement } from "@/components/form-builder/form-element"
import { AlertCircle, Copy, Edit, Grip, MoreHorizontal, Plus, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Tipos para os elementos do formulário
export type ElementType =
  | "text"
  | "textarea"
  | "number"
  | "email"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "section"
  | "heading"

export interface FormElementData {
  id: string
  type: ElementType
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
  description?: string
}

export interface FormSectionData {
  id: string
  title: string
  description?: string
  elements: FormElementData[]
}

interface FormBuilderProps {
  formTitle: string
  formDescription: string
}

export function FormBuilder({ formTitle, formDescription }: FormBuilderProps) {
  // Estado para armazenar as seções do formulário
  const [sections, setSections] = useState<FormSectionData[]>([
    {
      id: "section-1",
      title: "Informações Gerais",
      description: "Preencha as informações básicas",
      elements: [
        {
          id: "element-1",
          type: "text",
          label: "Nome Completo",
          placeholder: "Digite seu nome completo",
          required: true,
        },
        {
          id: "element-2",
          type: "email",
          label: "Email",
          placeholder: "Digite seu email",
          required: true,
        },
      ],
    },
  ])

  // Estado para armazenar o elemento selecionado para edição
  const [selectedElement, setSelectedElement] = useState<{
    sectionId: string
    elementId: string
  } | null>(null)

  // Função para adicionar uma nova seção
  const addSection = () => {
    const newSection: FormSectionData = {
      id: `section-${Date.now()}`,
      title: "Nova Seção",
      description: "Descrição da seção",
      elements: [],
    }

    setSections([...sections, newSection])
  }

  // Função para adicionar um novo elemento a uma seção
  const addElement = (sectionId: string, type: ElementType) => {
    const newElement: FormElementData = {
      id: `element-${Date.now()}`,
      type,
      label: `Novo campo ${type}`,
      placeholder: `Digite aqui...`,
      required: false,
    }

    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            elements: [...section.elements, newElement],
          }
        }
        return section
      }),
    )
  }

  // Função para remover um elemento
  const removeElement = (sectionId: string, elementId: string) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            elements: section.elements.filter((element) => element.id !== elementId),
          }
        }
        return section
      }),
    )
  }

  // Função para remover uma seção
  const removeSection = (sectionId: string) => {
    setSections(sections.filter((section) => section.id !== sectionId))
  }

  // Função para duplicar um elemento
  const duplicateElement = (sectionId: string, elementId: string) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          const elementToDuplicate = section.elements.find((element) => element.id === elementId)
          if (elementToDuplicate) {
            const duplicatedElement = {
              ...elementToDuplicate,
              id: `element-${Date.now()}`,
              label: `${elementToDuplicate.label} (cópia)`,
            }
            return {
              ...section,
              elements: [...section.elements, duplicatedElement],
            }
          }
        }
        return section
      }),
    )
  }

  // Função para lidar com o arrastar e soltar
  const handleDragEnd = (result: any) => {
    const { source, destination, type } = result

    // Se não houver destino ou o destino for o mesmo que a origem, não fazer nada
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Se estiver arrastando seções
    if (type === "section") {
      const newSections = Array.from(sections)
      const [removed] = newSections.splice(source.index, 1)
      newSections.splice(destination.index, 0, removed)

      setSections(newSections)
      return
    }

    // Se estiver arrastando elementos dentro da mesma seção
    if (source.droppableId === destination.droppableId) {
      const sectionId = source.droppableId
      const sectionIndex = sections.findIndex((section) => section.id === sectionId)

      if (sectionIndex !== -1) {
        const newSections = [...sections]
        const elements = Array.from(newSections[sectionIndex].elements)
        const [removed] = elements.splice(source.index, 1)
        elements.splice(destination.index, 0, removed)

        newSections[sectionIndex].elements = elements
        setSections(newSections)
      }
      return
    }

    // Se estiver arrastando elementos entre seções diferentes
    const sourceSectionIndex = sections.findIndex((section) => section.id === source.droppableId)
    const destSectionIndex = sections.findIndex((section) => section.id === destination.droppableId)

    if (sourceSectionIndex !== -1 && destSectionIndex !== -1) {
      const newSections = [...sections]
      const sourceElements = Array.from(newSections[sourceSectionIndex].elements)
      const destElements = Array.from(newSections[destSectionIndex].elements)

      const [removed] = sourceElements.splice(source.index, 1)
      destElements.splice(destination.index, 0, removed)

      newSections[sourceSectionIndex].elements = sourceElements
      newSections[destSectionIndex].elements = destElements

      setSections(newSections)
    }
  }

  // Função para adicionar elemento da paleta para uma seção
  const handleAddElementFromPalette = (sectionId: string, elementType: ElementType) => {
    addElement(sectionId, elementType)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-1">
        <FormElementPalette
          onAddElement={(type) => {
            if (sections.length > 0) {
              addElement(sections[0].id, type)
            } else {
              // Se não houver seções, criar uma nova e adicionar o elemento
              const newSectionId = `section-${Date.now()}`
              const newSection: FormSectionData = {
                id: newSectionId,
                title: "Nova Seção",
                description: "Descrição da seção",
                elements: [],
              }

              setSections([newSection])

              // Adicionar o elemento após a criação da seção
              setTimeout(() => {
                addElement(newSectionId, type)
              }, 0)
            }
          }}
        />
      </div>

      <div className="md:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>{formTitle}</CardTitle>
            <CardDescription>{formDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            {sections.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Nenhuma seção adicionada</AlertTitle>
                <AlertDescription>Adicione uma seção para começar a construir seu formulário.</AlertDescription>
                <Button variant="outline" size="sm" className="mt-2" onClick={addSection}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Seção
                </Button>
              </Alert>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections" type="section">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                      {sections.map((section, index) => (
                        <Draggable key={section.id} draggableId={section.id} index={index}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} className="relative">
                              <div className="absolute -left-10 top-4 flex items-center justify-center">
                                <div {...provided.dragHandleProps} className="cursor-grab">
                                  <Grip className="h-5 w-5 text-muted-foreground" />
                                </div>
                              </div>

                              <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
                                <CardHeader className="relative pb-2">
                                  <div className="absolute right-4 top-4">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                          <Edit className="mr-2 h-4 w-4" />
                                          Editar Seção
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Copy className="mr-2 h-4 w-4" />
                                          Duplicar Seção
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          className="text-destructive"
                                          onClick={() => removeSection(section.id)}
                                        >
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Remover Seção
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>

                                  <CardTitle className="text-lg">{section.title}</CardTitle>
                                  {section.description && <CardDescription>{section.description}</CardDescription>}
                                </CardHeader>

                                <CardContent>
                                  <Droppable droppableId={section.id} type="element">
                                    {(provided, snapshot) => (
                                      <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`space-y-4 min-h-[100px] p-2 rounded-md ${
                                          snapshot.isDraggingOver ? "bg-muted" : ""
                                        }`}
                                      >
                                        {section.elements.map((element, index) => (
                                          <Draggable key={element.id} draggableId={element.id} index={index}>
                                            {(provided) => (
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className="relative"
                                              >
                                                <div className="absolute -left-8 top-2 flex items-center justify-center">
                                                  <div {...provided.dragHandleProps} className="cursor-grab">
                                                    <Grip className="h-4 w-4 text-muted-foreground" />
                                                  </div>
                                                </div>

                                                <div className="relative group">
                                                  <FormElement element={element} />

                                                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <DropdownMenu>
                                                      <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                          <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                      </DropdownMenuTrigger>
                                                      <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                          <Edit className="mr-2 h-4 w-4" />
                                                          Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                          onClick={() => duplicateElement(section.id, element.id)}
                                                        >
                                                          <Copy className="mr-2 h-4 w-4" />
                                                          Duplicar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                          className="text-destructive"
                                                          onClick={() => removeElement(section.id, element.id)}
                                                        >
                                                          <Trash2 className="mr-2 h-4 w-4" />
                                                          Remover
                                                        </DropdownMenuItem>
                                                      </DropdownMenuContent>
                                                    </DropdownMenu>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </Draggable>
                                        ))}
                                        {provided.placeholder}

                                        <Button
                                          variant="ghost"
                                          className="w-full border border-dashed"
                                          onClick={() => addElement(section.id, "text")}
                                        >
                                          <Plus className="mr-2 h-4 w-4" />
                                          Adicionar Campo
                                        </Button>
                                      </div>
                                    )}
                                  </Droppable>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      <Button variant="outline" className="w-full" onClick={addSection}>
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Nova Seção
                      </Button>
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

