"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, User, Phone, MapPin } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function NovoClientePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome: "",
    documento: "",
    telefone: "",
    email: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    observacoes: "",
    tipoCliente: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!formData.nome.trim()) {
      toast({
        title: "Erro",
        description: "O nome do cliente é obrigatório",
        variant: "destructive",
      })
      return
    }

    // Simulação de cadastro
    toast({
      title: "Cliente cadastrado",
      description: "O cliente foi cadastrado com sucesso",
      duration: 5000,
    })

    // Redirecionar para a lista de clientes
    setTimeout(() => {
      router.push("/clientes")
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <a href="/clientes">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <h1 className="text-2xl font-bold">Novo Cliente</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Dados do Cliente</CardTitle>
              <CardDescription>Preencha as informações do novo cliente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informações Básicas */}
              <div>
                <h3 className="text-lg font-medium flex items-center mb-4">
                  <User className="mr-2 h-5 w-5 text-primary" />
                  Informações Básicas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">
                      Nome Completo <span className="text-red-500">*</span>
                    </Label>
                    <Input id="nome" name="nome" value={formData.nome} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documento">
                      CPF <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="documento"
                      name="documento"
                      value={formData.documento}
                      onChange={handleInputChange}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo-cliente">
                      Tipo do Cliente <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.tipoCliente} onValueChange={(value) => handleSelectChange("tipoCliente", value)}>
                      <SelectTrigger id="tipo-cliente">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aut-reg-orgao-publico">Aut. Reg./Órgão Público</SelectItem>
                        <SelectItem value="colaborador">Colaborador/Força de Vendas</SelectItem>
                        <SelectItem value="convenio"> Colaborador Convênio</SelectItem>
                        <SelectItem value="distribuidor">Distribuidor</SelectItem>
                        <SelectItem value="farmacia">Farmacêutico</SelectItem>
                        <SelectItem value="hospital">Colaborador Hospital/Clínica</SelectItem>
                        <SelectItem value="medico">Médico</SelectItem>
                        <SelectItem value="nao-informado">Não informado</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                        <SelectItem value="paciente">Paciente</SelectItem>
                        <SelectItem value="prestador">Prestador de Serviço</SelectItem>
                        <SelectItem value="profissional-saude">Profissional de Saúde</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Contato */}
              <div>
                <h3 className="text-lg font-medium flex items-center mb-4">
                  <Phone className="mr-2 h-5 w-5 text-primary" />
                  Informações de Contato
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefone">
                      Telefone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h3 className="text-lg font-medium flex items-center mb-4">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  Endereço
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleInputChange}
                      placeholder="Rua, número, complemento"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input id="cidade" name="cidade" value={formData.cidade} onChange={handleInputChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado</Label>
                      <Select value={formData.estado} onValueChange={(value) => handleSelectChange("estado", value)}>
                        <SelectTrigger id="estado">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AC">Acre</SelectItem>
                          <SelectItem value="AL">Alagoas</SelectItem>
                          <SelectItem value="AP">Amapá</SelectItem>
                          <SelectItem value="AM">Amazonas</SelectItem>
                          <SelectItem value="BA">Bahia</SelectItem>
                          <SelectItem value="CE">Ceará</SelectItem>
                          <SelectItem value="DF">Distrito Federal</SelectItem>
                          <SelectItem value="ES">Espírito Santo</SelectItem>
                          <SelectItem value="GO">Goiás</SelectItem>
                          <SelectItem value="MA">Maranhão</SelectItem>
                          <SelectItem value="MT">Mato Grosso</SelectItem>
                          <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                          <SelectItem value="MG">Minas Gerais</SelectItem>
                          <SelectItem value="PA">Pará</SelectItem>
                          <SelectItem value="PB">Paraíba</SelectItem>
                          <SelectItem value="PR">Paraná</SelectItem>
                          <SelectItem value="PE">Pernambuco</SelectItem>
                          <SelectItem value="PI">Piauí</SelectItem>
                          <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                          <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                          <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                          <SelectItem value="RO">Rondônia</SelectItem>
                          <SelectItem value="RR">Roraima</SelectItem>
                          <SelectItem value="SC">Santa Catarina</SelectItem>
                          <SelectItem value="SP">São Paulo</SelectItem>
                          <SelectItem value="SE">Sergipe</SelectItem>
                          <SelectItem value="TO">Tocantins</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input
                        id="cep"
                        name="cep"
                        value={formData.cep}
                        onChange={handleInputChange}
                        placeholder="00000-000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  placeholder="Informações adicionais sobre o cliente"
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.push("/clientes")}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                <Save className="mr-2 h-4 w-4" />
                Salvar Cliente
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  )
}

