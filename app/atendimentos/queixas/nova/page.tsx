"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/date-picker"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, FileText, AlertTriangle, CheckCircle, Upload, Barcode } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Dados simulados de clientes
const CLIENTES_MOCK = [
  {
    id: "1",
    nome: "Maria Silva",
    documento: "123.456.789-00",
    telefone: "(11) 98765-4321",
    email: "maria.silva@email.com",
    endereco: "Av. Paulista, 1000 - São Paulo/SP",
    tipo: "Pessoa Física",
  },
  {
    id: "2",
    nome: "João Santos",
    documento: "987.654.321-00",
    telefone: "(11) 91234-5678",
    email: "joao.santos@email.com",
    endereco: "Rua Augusta, 500 - São Paulo/SP",
    tipo: "Pessoa Física",
  },
  {
    id: "3",
    nome: "Farmácia Saúde Ltda",
    documento: "12.345.678/0001-90",
    telefone: "(11) 3456-7890",
    email: "contato@farmaciasaude.com.br",
    endereco: "Av. Rebouças, 1500 - São Paulo/SP",
    tipo: "Pessoa Jurídica",
  },
]

export default function NovaQueixaTecnicaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Recuperar parâmetros da URL
  const protocolo = searchParams.get("protocolo")
  const clienteId = searchParams.get("cliente")
  const nomeSemRegistro = searchParams.get("nome")
  const telefoneSemRegistro = searchParams.get("telefone")
  const emailSemRegistro = searchParams.get("email")

  const [cliente, setCliente] = useState<(typeof CLIENTES_MOCK)[0] | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    produto: "",
    lote: "",
    dataFabricacao: "",
    dataValidade: "",
    descricaoQueixa: "",
    tipoQueixa: "embalagem",
    possuiAmostra: "nao",
    enviarAmostra: false,
    prioridade: "normal",
    observacoes: "",
  })

  // Carregar dados do cliente se disponível
  useEffect(() => {
    if (clienteId && clienteId !== "novo") {
      const clienteEncontrado = CLIENTES_MOCK.find((c) => c.id === clienteId)
      if (clienteEncontrado) {
        setCliente(clienteEncontrado)
      }
    }
    setLoading(false)
  }, [clienteId])

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

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulação de envio do formulário
    toast({
      title: "Queixa técnica registrada",
      description: `O protocolo ${protocolo} foi registrado com sucesso.`,
      duration: 5000,
    })

    // Redirecionar para a página de listagem de queixas
    setTimeout(() => {
      router.push("/atendimentos/queixas")
    }, 1500)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <p>Carregando...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <a href="/atendimentos/queixas">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <h1 className="text-2xl font-bold">Nova Queixa Técnica</h1>
          </div>

          {protocolo && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-sm px-3 py-1">
              Protocolo: {protocolo}
            </Badge>
          )}
        </div>

        {/* Informações do Cliente */}
        <Card>
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Informações do Cliente</CardTitle>
              {cliente && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`/clientes/${cliente.id}`}>
                    <FileText className="h-4 w-4 mr-2" />
                    Ver cadastro completo
                  </a>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {cliente ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Nome</p>
                  <p className="font-medium">{cliente.nome}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Documento</p>
                  <p>{cliente.documento}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p>{cliente.telefone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{cliente.email}</p>
                </div>
              </div>
            ) : nomeSemRegistro ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Nome</p>
                  <p className="font-medium">{nomeSemRegistro}</p>
                </div>
                {telefoneSemRegistro && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Telefone</p>
                    <p>{telefoneSemRegistro}</p>
                  </div>
                )}
                {emailSemRegistro && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{emailSemRegistro}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    Cliente sem registro
                  </Badge>
                </div>
              </div>
            ) : clienteId === "novo" ? (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertTitle>Novo cliente</AlertTitle>
                <AlertDescription>Um novo cliente será cadastrado ao salvar esta queixa técnica.</AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle>Cliente não identificado</AlertTitle>
                <AlertDescription>
                  Nenhuma informação de cliente foi fornecida para esta queixa técnica.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Formulário de Queixa Técnica */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Queixa Técnica</CardTitle>
              <CardDescription>Preencha as informações sobre o produto e a queixa técnica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informações do Produto */}
              <div>
                <h3 className="text-lg font-medium flex items-center mb-4">
                  <Package className="mr-2 h-5 w-5 text-primary" />
                  Informações do Produto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="produto" className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-[#26B99D]" />
                      <span>Produto <span className="text-red-500">*</span></span>
                    </Label>
                    <Select
                      name="produto"
                      value={formData.produto}
                      onValueChange={(value) => handleSelectChange("produto", value)}
                      required
                    >
                      <SelectTrigger id="produto" className="h-11">
                        <SelectValue placeholder="Selecione o produto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medicamento-a">Medicamento A</SelectItem>
                        <SelectItem value="medicamento-b">Medicamento B</SelectItem>
                        <SelectItem value="medicamento-c">Medicamento C</SelectItem>
                        <SelectItem value="dispositivo-x">Dispositivo Médico X</SelectItem>
                        <SelectItem value="dispositivo-y">Dispositivo Médico Y</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lote" className="flex items-center space-x-2">
                      <Barcode className="h-4 w-4 text-[#26B99D]" />
                      <span>Número do Lote <span className="text-red-500">*</span></span>
                    </Label>
                    <Input
                      id="lote"
                      name="lote"
                      placeholder="Ex: ABC123456"
                      value={formData.lote}
                      onChange={handleInputChange}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataFabricacao">Data de Fabricação</Label>
                    <DatePicker />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataValidade">Data de Validade</Label>
                    <DatePicker />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Detalhes da Queixa */}
              <div>
                <h3 className="text-lg font-medium flex items-center mb-4">
                  <AlertTriangle className="mr-2 h-5 w-5 text-primary" />
                  Detalhes da Queixa
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipoQueixa">
                      Tipo de Queixa <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      defaultValue={formData.tipoQueixa}
                      onValueChange={(value) => handleSelectChange("tipoQueixa", value)}
                      className="grid grid-cols-1 md:grid-cols-2 gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="embalagem" id="embalagem" />
                        <Label htmlFor="embalagem">Problema na embalagem</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rotulagem" id="rotulagem" />
                        <Label htmlFor="rotulagem">Problema na rotulagem</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="conteudo" id="conteudo" />
                        <Label htmlFor="conteudo">Problema no conteúdo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="funcionamento" id="funcionamento" />
                        <Label htmlFor="funcionamento">Problema no funcionamento</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="contaminacao" id="contaminacao" />
                        <Label htmlFor="contaminacao">Suspeita de contaminação</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="outro" id="outro" />
                        <Label htmlFor="outro">Outro</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descricaoQueixa">
                      Descrição da Queixa <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="descricaoQueixa"
                      name="descricaoQueixa"
                      placeholder="Descreva detalhadamente o problema encontrado"
                      rows={4}
                      value={formData.descricaoQueixa}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="possuiAmostra">Possui amostra do produto?</Label>
                    <RadioGroup
                      defaultValue={formData.possuiAmostra}
                      onValueChange={(value) => handleSelectChange("possuiAmostra", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sim" id="possui-sim" />
                        <Label htmlFor="possui-sim">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nao" id="possui-nao" />
                        <Label htmlFor="possui-nao">Não</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.possuiAmostra === "sim" && (
                    <div className="flex items-center space-x-2 ml-6 p-2 bg-gray-50 rounded-md">
                      <Checkbox
                        id="enviarAmostra"
                        checked={formData.enviarAmostra}
                        onCheckedChange={(checked) => handleCheckboxChange("enviarAmostra", checked as boolean)}
                      />
                      <Label htmlFor="enviarAmostra">Deseja enviar a amostra para análise?</Label>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="prioridade">Prioridade</Label>
                    <Select
                      name="prioridade"
                      value={formData.prioridade}
                      onValueChange={(value) => handleSelectChange("prioridade", value)}
                    >
                      <SelectTrigger id="prioridade">
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Evidências */}
              <div>
                <h3 className="text-lg font-medium flex items-center mb-4">
                  <Upload className="mr-2 h-5 w-5 text-primary" />
                  Evidências
                </h3>

                <div className="space-y-4">
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Arraste e solte arquivos aqui ou clique para selecionar</p>
                    <p className="text-xs text-gray-400 mt-1">Suporta imagens, documentos e vídeos (máx. 10MB)</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Selecionar Arquivos
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações Adicionais</Label>
                <Textarea
                  id="observacoes"
                  name="observacoes"
                  placeholder="Informações adicionais relevantes"
                  rows={3}
                  value={formData.observacoes}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.push("/atendimentos/queixas")}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                <CheckCircle className="mr-2 h-4 w-4" />
                Registrar Queixa Técnica
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  )
}

