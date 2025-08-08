"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { User, Phone, Mail, Calendar, Clock, Bell } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

interface NovoContatoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cliente: {
    id: string
    nome: string
    documento: string
    telefone: string
    email: string
    endereco: string
    tipo: string
  }
}

export function NovoContatoModal({ open, onOpenChange, cliente }: NovoContatoModalProps) {
  const [tipoContato, setTipoContato] = useState<string>("telefone")
  const [autorizaRetorno, setAutorizaRetorno] = useState<string>("sim")
  const [dataRetorno, setDataRetorno] = useState<string>("")
  const [horaRetorno, setHoraRetorno] = useState<string>("")
  const [descricao, setDescricao] = useState<string>("")
  const [lembreteAtivo, setLembreteAtivo] = useState<boolean>(false)
  const [lembreteAntecedencia, setLembreteAntecedencia] = useState<number>(15)

  const resetForm = () => {
    setTipoContato("telefone")
    setAutorizaRetorno("sim")
    setDataRetorno("")
    setHoraRetorno("")
    setDescricao("")
    setLembreteAtivo(false)
    setLembreteAntecedencia(15)
  }

  const handleSalvar = () => {
    // Validar dados
    if (!descricao.trim()) {
      toast({
        title: "Erro",
        description: "A descrição do contato é obrigatória",
        variant: "destructive",
      })
      return
    }

    if (autorizaRetorno === "sim" && (!dataRetorno || !horaRetorno)) {
      toast({
        title: "Erro",
        description: "Data e hora do retorno são obrigatórios quando autorizado",
        variant: "destructive",
      })
      return
    }

    // Simular criação do contato
    toast({
      title: "Sucesso",
      description: "Contato registrado com sucesso",
      variant: "default",
    })

    // Fechar modal e resetar form
    onOpenChange(false)
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) resetForm()
      onOpenChange(open)
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-lg shadow-xl">
        <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg">
          <DialogTitle className="text-xl font-bold">Novo Contato</DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <div className="space-y-8">
            {/* Informações do Cliente */}
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-teal-600" />
                <h3 className="font-medium text-lg text-gray-800">Informações do Cliente</h3>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{cliente.nome}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações do Contato */}
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <Phone className="h-5 w-5 text-teal-600" />
                <h3 className="font-medium text-lg text-gray-800">Informações do Contato</h3>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipoContato">
                        Tipo de Contato <span className="text-red-500">*</span>
                      </Label>
                      <Select value={tipoContato} onValueChange={setTipoContato}>
                        <SelectTrigger id="tipoContato" className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="telefone">Telefone</SelectItem>
                          <SelectItem value="email">E-mail</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="autorizaRetorno">
                        Autoriza retorno de contato <span className="text-red-500">*</span>
                      </Label>
                      <Select value={autorizaRetorno} onValueChange={setAutorizaRetorno}>
                        <SelectTrigger id="autorizaRetorno" className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sim">Sim</SelectItem>
                          <SelectItem value="nao">Não</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {autorizaRetorno === "sim" && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-teal-50 rounded-lg border border-teal-100">
                      <div className="space-y-2">
                        <Label htmlFor="dataRetorno">
                          Data do Retorno <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            type="date"
                            id="dataRetorno"
                            value={dataRetorno}
                            onChange={(e) => setDataRetorno(e.target.value)}
                            className="pl-10 h-11"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="horaRetorno">
                          Horário do Retorno <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            type="time"
                            id="horaRetorno"
                            value={horaRetorno}
                            onChange={(e) => setHoraRetorno(e.target.value)}
                            className="pl-10 h-11"
                          />
                        </div>
                      </div>

                      {/* Seção de Lembrete */}
                      <div className="space-y-4 border-t pt-4">
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4 text-blue-600" />
                          <Label className="text-sm font-medium">Configurar Lembrete</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="lembrete-ativo-contato"
                            checked={lembreteAtivo}
                            onChange={(e) => setLembreteAtivo(e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="lembrete-ativo-contato" className="text-sm">Ativar lembrete para este retorno</Label>
                        </div>

                        {lembreteAtivo && (
                          <div className="space-y-3 ml-6">
                            <div>
                              <Label className="text-sm font-medium">Antecedência</Label>
                              <Select
                                value={lembreteAntecedencia.toString()}
                                onValueChange={(value) => setLembreteAntecedencia(parseInt(value))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="5">5 minutos antes</SelectItem>
                                  <SelectItem value="15">15 minutos antes</SelectItem>
                                  <SelectItem value="30">30 minutos antes</SelectItem>
                                  <SelectItem value="60">1 hora antes</SelectItem>
                                  <SelectItem value="120">2 horas antes</SelectItem>
                                  <SelectItem value="1440">1 dia antes</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="descricao">
                      Descrição do Contato <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="descricao"
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      placeholder="Descreva o conteúdo do contato"
                      required
                      className="font-mono min-h-[200px] whitespace-pre-wrap resize-none"
                      style={{
                        lineHeight: "1.5",
                        padding: "1rem",
                        backgroundColor: tipoContato === "email" ? "#f8fafc" : "white"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2 p-6 border-t bg-gray-50 rounded-b-lg">
          <Button
            variant="outline"
            className="bg-red-100 hover:bg-red-200 text-red-600 border-red-200 h-11"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            className="bg-teal-600 hover:bg-teal-700 h-11" 
            onClick={handleSalvar}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}