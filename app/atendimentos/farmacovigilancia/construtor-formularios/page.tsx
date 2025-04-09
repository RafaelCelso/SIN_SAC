"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormBuilder } from "@/components/form-builder/form-builder"
import { FormPreview } from "@/components/form-builder/form-preview"
import { ArrowLeft, Eye, Save } from "lucide-react"
import Link from "next/link"

export default function FormBuilderPage() {
  const [formTitle, setFormTitle] = useState("Novo Formulário Personalizado")
  const [formDescription, setFormDescription] = useState("Descrição do formulário")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/atendimentos/farmacovigilancia">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Construtor de Formulários</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Pré-visualizar
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Salvar Formulário
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <Label htmlFor="form-title">Título do Formulário</Label>
          <Input id="form-title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="mt-1" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-4">
            <Tabs defaultValue="builder" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="builder">Construtor</TabsTrigger>
                <TabsTrigger value="preview">Pré-visualização</TabsTrigger>
              </TabsList>

              <TabsContent value="builder" className="mt-4">
                <FormBuilder formTitle={formTitle} formDescription={formDescription} />
              </TabsContent>

              <TabsContent value="preview" className="mt-4">
                <FormPreview formTitle={formTitle} formDescription={formDescription} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

