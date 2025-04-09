"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormBuilder } from "@/components/form-builder/form-builder"
import { FormPreview } from "@/components/form-builder/form-preview"
import { ArrowLeft, Eye, Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function NovoFormularioPage() {
  const router = useRouter()
  const [formTitle, setFormTitle] = useState("Novo Formulário")
  const [formDescription, setFormDescription] = useState("Descrição do formulário")
  const [formType, setFormType] = useState("")
  const [activeTab, setActiveTab] = useState("builder")

  const handleSaveForm = () => {
    if (!formTitle.trim()) {
      toast({
        title: "Erro",
        description: "O título do formulário é obrigatório",
        variant: "destructive",
      })
      return
    }

    if (!formType) {
      toast({
        title: "Erro",
        description: "Selecione o tipo de formulário",
        variant: "destructive",
      })
      return
    }

    // Simulação de salvamento
    toast({
      title: "Formulário salvo",
      description: "O formulário foi salvo com sucesso",
      duration: 3000,
    })

    // Redirecionar para a lista de formulários
    setTimeout(() => {
      router.push("/preferencias/construtor-formularios")
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/preferencias/construtor-formularios">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Novo Formulário</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setActiveTab("preview")}
              className="hover:bg-[#E6F7F5] hover:text-[#26B99D] hover:border-[#26B99D]"
            >
              <Eye className="mr-2 h-4 w-4" />
              Pré-visualizar
            </Button>
            <Button onClick={handleSaveForm} className="bg-[#26B99D] hover:bg-[#1E9A82]">
              <Save className="mr-2 h-4 w-4" />
              Salvar Formulário
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Formulário</CardTitle>
            <CardDescription>Preencha as informações básicas do formulário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="form-title">Título do Formulário</Label>
                <Input
                  id="form-title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ex: Formulário de Queixa Técnica"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="form-type">Tipo de Formulário</Label>
                <Select value={formType} onValueChange={setFormType}>
                  <SelectTrigger id="form-type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="queixa-tecnica">Queixa Técnica</SelectItem>
                    <SelectItem value="informacoes-medicas">Informações Médicas</SelectItem>
                    <SelectItem value="farmacovigilancia">Farmacovigilância</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="form-description">Descrição</Label>
              <Textarea
                id="form-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Descreva o propósito deste formulário"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="builder"
                  className="data-[state=active]:bg-[#26B99D] data-[state=active]:text-white"
                >
                  Construtor
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="data-[state=active]:bg-[#26B99D] data-[state=active]:text-white"
                >
                  Pré-visualização
                </TabsTrigger>
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

