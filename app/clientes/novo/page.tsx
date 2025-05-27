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
  const [tipoDocumento, setTipoDocumento] = useState<'cpf' | 'cnpj'>('cpf')
  const [formData, setFormData] = useState({
    nome: "",
    documento: "",
    telefone: "",
    email: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    observacoes: "",
    tipoCliente: "",
  })

  // Função para aplicar máscara
  const aplicarMascaraDocumento = (valor: string, tipo: 'cpf' | 'cnpj') => {
    const numeros = valor.replace(/\D/g, "")
    if (tipo === 'cpf') {
      return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    } else {
      return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'documento') {
      setFormData((prev) => ({
        ...prev,
        [name]: aplicarMascaraDocumento(value, tipoDocumento),
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
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
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="p-4 rounded-lg flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Novo Cliente</h1>
            <p className="text-sm text-gray-600 mt-1">Cadastro de novo cliente no sistema</p>
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
                      Nome<span className="text-red-500">*</span>
                    </Label>
                    <Input id="nome" name="nome" value={formData.nome} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documento">
                      Documento <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Select
                        value={tipoDocumento}
                        onValueChange={(value: 'cpf' | 'cnpj') => {
                          setTipoDocumento(value)
                          setFormData(prev => ({ ...prev, documento: '' }))
                        }}
                      >
                        <SelectTrigger className="w-[100px] h-11">
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cpf">CPF</SelectItem>
                          <SelectItem value="cnpj">CNPJ</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        id="documento"
                        name="documento"
                        value={formData.documento}
                        onChange={handleInputChange}
                        placeholder={tipoDocumento === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
                        required
                        maxLength={tipoDocumento === 'cpf' ? 14 : 18}
                        className="h-11 flex-1"
                      />
                    </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="logradouro">Logradouro</Label>
                      <Input
                        id="logradouro"
                        name="logradouro"
                        value={formData.logradouro}
                        onChange={handleInputChange}
                        placeholder="Logradouro"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numero">N°</Label>
                      <Input
                        id="numero"
                        name="numero"
                        value={formData.numero}
                        onChange={handleInputChange}
                        placeholder="Número"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="complemento">Complemento</Label>
                      <Input
                        id="complemento"
                        name="complemento"
                        value={formData.complemento}
                        onChange={handleInputChange}
                        placeholder="Complemento"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bairro">Bairro</Label>
                      <Input
                        id="bairro"
                        name="bairro"
                        value={formData.bairro}
                        onChange={handleInputChange}
                        placeholder="Bairro"
                      />
                    </div>
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

