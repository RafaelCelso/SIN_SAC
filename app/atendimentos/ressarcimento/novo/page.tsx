"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Tag } from "lucide-react"

export default function NovoRessarcimentoPage() {
  const [formData, setFormData] = useState({
    envioAmostra: "",
    tipoRessarcimento: "financeiro",
    reembolsoNome: "",
    reembolsoCpf: "",
    reembolsoTelefone: "",
    reembolsoEndereco: "",
    reembolsoNumero: "",
    reembolsoComplemento: "",
    reembolsoBairro: "",
    reembolsoCidade: "",
    reembolsoEstado: "",
    reembolsoCep: "",
    financeiroNome: "",
    financeiroCpf: "",
    financeiroBanco: "",
    financeiroAgencia: "",
    financeiroConta: "",
    financeiroTipoConta: "corrente",
  })
  const [submitting, setSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      toast({
        title: "Ressarcimento registrado",
        description: "O ressarcimento foi registrado com sucesso.",
        duration: 4000,
      })
      setSubmitting(false)
    }, 1200)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4">
        <div className="flex items-center gap-2 mb-6">
          <Tag className="h-7 w-7 text-[#26B99D]" />
          <h1 className="text-2xl font-bold">Novo Ressarcimento</h1>
        </div>
        <Card>
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-xl font-bold">Ressarcimento</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-8 p-8">
              <div className="space-y-4">
                <Label className="text-base font-medium">Paciente aceita envio da amostra?</Label>
                <RadioGroup
                  value={formData.envioAmostra}
                  onValueChange={value => handleSelectChange("envioAmostra", value)}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sim" id="envioAmostra-sim" />
                    <Label htmlFor="envioAmostra-sim">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nao" id="envioAmostra-nao" />
                    <Label htmlFor="envioAmostra-nao">Não</Label>
                  </div>
                </RadioGroup>
              </div>
              {formData.envioAmostra === "sim" && (
                <div className="mt-6 space-y-8 border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold">Informações para Ressarcimento</h4>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-medium mb-2 block">Tipo de ressarcimento</Label>
                    <RadioGroup
                      value={formData.tipoRessarcimento}
                      onValueChange={value => handleSelectChange("tipoRessarcimento", value)}
                      className="flex gap-6 mt-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="financeiro" id="ressarcimento-financeiro" />
                        <Label htmlFor="ressarcimento-financeiro">Financeiro</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="produto" id="ressarcimento-produto" />
                        <Label htmlFor="ressarcimento-produto">Produto</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="mt-8 space-y-6">
                    <h4 className="text-lg font-semibold">Dados do Solicitante</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input name="reembolsoNome" placeholder="Nome" value={formData.reembolsoNome} onChange={handleInputChange} />
                      <Input name="reembolsoCpf" placeholder="CPF" value={formData.reembolsoCpf} onChange={handleInputChange} />
                      <Input name="reembolsoTelefone" placeholder="Telefone" value={formData.reembolsoTelefone} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-4">
                      <h5 className="text-base font-semibold">Dados de Endereço</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input name="reembolsoEndereco" placeholder="Logradouro" value={formData.reembolsoEndereco} onChange={handleInputChange} />
                        <Input name="reembolsoNumero" placeholder="Nº" value={formData.reembolsoNumero} onChange={handleInputChange} />
                        <Input name="reembolsoComplemento" placeholder="Complemento" value={formData.reembolsoComplemento} onChange={handleInputChange} />
                        <Input name="reembolsoBairro" placeholder="Bairro" value={formData.reembolsoBairro} onChange={handleInputChange} />
                        <Input name="reembolsoCidade" placeholder="Cidade" value={formData.reembolsoCidade} onChange={handleInputChange} />
                        <Select value={formData.reembolsoEstado} onValueChange={value => handleSelectChange('reembolsoEstado', value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AC">AC</SelectItem>
                            <SelectItem value="AL">AL</SelectItem>
                            <SelectItem value="AP">AP</SelectItem>
                            <SelectItem value="AM">AM</SelectItem>
                            <SelectItem value="BA">BA</SelectItem>
                            <SelectItem value="CE">CE</SelectItem>
                            <SelectItem value="DF">DF</SelectItem>
                            <SelectItem value="ES">ES</SelectItem>
                            <SelectItem value="GO">GO</SelectItem>
                            <SelectItem value="MA">MA</SelectItem>
                            <SelectItem value="MT">MT</SelectItem>
                            <SelectItem value="MS">MS</SelectItem>
                            <SelectItem value="MG">MG</SelectItem>
                            <SelectItem value="PA">PA</SelectItem>
                            <SelectItem value="PB">PB</SelectItem>
                            <SelectItem value="PR">PR</SelectItem>
                            <SelectItem value="PE">PE</SelectItem>
                            <SelectItem value="PI">PI</SelectItem>
                            <SelectItem value="RJ">RJ</SelectItem>
                            <SelectItem value="RN">RN</SelectItem>
                            <SelectItem value="RS">RS</SelectItem>
                            <SelectItem value="RO">RO</SelectItem>
                            <SelectItem value="RR">RR</SelectItem>
                            <SelectItem value="SC">SC</SelectItem>
                            <SelectItem value="SP">SP</SelectItem>
                            <SelectItem value="SE">SE</SelectItem>
                            <SelectItem value="TO">TO</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input name="reembolsoCep" placeholder="CEP" value={formData.reembolsoCep} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>
                  {formData.tipoRessarcimento === 'financeiro' && (
                    <Card className="border-teal-100 bg-teal-50/50 shadow-sm mt-6">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-900">
                            <rect width="20" height="14" x="2" y="5" rx="2"/>
                            <line x1="2" x2="22" y1="10" y2="10"/>
                            <path d="M6 14h.01"/>
                            <path d="M10 14h.01"/>
                            <path d="M14 14h.01"/>
                            <path d="M18 14h.01"/>
                          </svg>
                          <h5 className="text-base font-semibold text-teal-900">Dados Bancários</h5>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input name="financeiroNome" placeholder="Nome do titular" value={formData.financeiroNome} onChange={handleInputChange} />
                          <Input name="financeiroCpf" placeholder="CPF do titular" value={formData.financeiroCpf} onChange={handleInputChange} />
                          <Input name="financeiroBanco" placeholder="Banco" value={formData.financeiroBanco} onChange={handleInputChange} />
                          <Input name="financeiroAgencia" placeholder="Agência" value={formData.financeiroAgencia} onChange={handleInputChange} />
                          <div className="space-y-4 col-span-2">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Tipo de Conta</Label>
                              <RadioGroup
                                value={formData.financeiroTipoConta}
                                onValueChange={value => handleSelectChange('financeiroTipoConta', value)}
                                className="flex gap-6"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="corrente" id="tipoConta-corrente" />
                                  <Label htmlFor="tipoConta-corrente">Conta corrente</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="poupanca" id="tipoConta-poupanca" />
                                  <Label htmlFor="tipoConta-poupanca">Poupança</Label>
                                </div>
                              </RadioGroup>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Número da Conta</Label>
                              <Input name="financeiroConta" placeholder="Conta" value={formData.financeiroConta} onChange={handleInputChange} />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
            <div className="flex justify-end gap-2 px-8 pb-8">
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={submitting}>
                Salvar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
} 