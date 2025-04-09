"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Clipboard, User, Package, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

interface NovoProtocoloModalProps {
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

export function NovoProtocoloModal({ open, onOpenChange, cliente }: NovoProtocoloModalProps) {
  const router = useRouter()
  const [motivoSelecionado, setMotivoSelecionado] = useState<string>("")
  const [produtoSelecionado, setProdutoSelecionado] = useState<string>("")
  const [observacoes, setObservacoes] = useState<string>("")
  const [lote, setLote] = useState<string>("")
  const [tipoQueixa, setTipoQueixa] = useState<string>("")
  const [assuntoInfo, setAssuntoInfo] = useState<string>("")
  const [reacaoAdversa, setReacaoAdversa] = useState<string>("")
  const [gravidade, setGravidade] = useState<string>("")

  const resetForm = () => {
    setMotivoSelecionado("")
    setProdutoSelecionado("")
    setObservacoes("")
    setLote("")
    setTipoQueixa("")
    setAssuntoInfo("")
    setReacaoAdversa("")
    setGravidade("")
  }

  const handleCriarProtocolo = () => {
    // Validar dados
    if (!motivoSelecionado) {
      toast({
        title: "Erro",
        description: "Selecione o motivo do atendimento",
        variant: "destructive",
      })
      return
    }

    if (!produtoSelecionado) {
      toast({
        title: "Erro",
        description: "Selecione um produto",
        variant: "destructive",
      })
      return
    }

    // Validações específicas por tipo de protocolo
    if (motivoSelecionado === "queixa" && !lote) {
      toast({
        title: "Erro",
        description: "Informe o lote do produto",
        variant: "destructive",
      })
      return
    }

    if (motivoSelecionado === "informacao" && !assuntoInfo) {
      toast({
        title: "Erro",
        description: "Informe o assunto da solicitação",
        variant: "destructive",
      })
      return
    }

    if (motivoSelecionado === "farmacovigilancia" && !reacaoAdversa) {
      toast({
        title: "Erro",
        description: "Informe a reação adversa",
        variant: "destructive",
      })
      return
    }

    // Gerar número de protocolo
    const dataAtual = new Date()
    const ano = dataAtual.getFullYear()
    const numeroAleatorio = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")

    let prefixo = "AT"
    if (motivoSelecionado === "queixa") prefixo = "QT"
    if (motivoSelecionado === "informacao") prefixo = "IM"
    if (motivoSelecionado === "farmacovigilancia") prefixo = "FV"

    const novoProtocolo = `${prefixo}-${ano}-${numeroAleatorio}`

    // Simular criação de protocolo
    toast({
      title: "Protocolo criado com sucesso",
      description: `Protocolo ${novoProtocolo} registrado`,
      variant: "default",
    })

    // Fechar modal
    onOpenChange(false)

    // Mapear motivo para URL
    const motivoParaURL: Record<string, string> = {
      queixa: "/atendimentos/queixas/nova",
      informacao: "/atendimentos/info/nova",
      farmacovigilancia: "/atendimentos/farmacovigilancia/novo",
      outro: "/atendimentos/contatos/novo",
    }

    // Redirecionar para a página específica do motivo ou para a página do cliente com o novo protocolo
    router.push(`/clientes/${cliente.id}?protocolo=${novoProtocolo}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-lg shadow-xl">
        <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg">
          <DialogTitle className="text-xl font-bold">Novo Protocolo</DialogTitle>
          <DialogDescription className="text-teal-100">
            Preencha as informações para criar um novo protocolo
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          <form onSubmit={handleCriarProtocolo} className="space-y-8">
            {/* Motivo do Protocolo */}
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <Clipboard className="h-5 w-5 text-teal-600" />
                <h3 className="font-medium text-lg text-gray-800">Motivo do Protocolo</h3>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                <div className="space-y-2">
                  <Label htmlFor="motivo">
                    Motivo <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={motivoSelecionado}
                    onValueChange={setMotivoSelecionado}
                  >
                    <SelectTrigger id="motivo" className="h-11">
                      <SelectValue placeholder="Selecione o motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="queixa">Queixa Técnica</SelectItem>
                      <SelectItem value="evento">Evento Adverso</SelectItem>
                      <SelectItem value="informacao">Informação Médica</SelectItem>
                      <SelectItem value="farmacovigilancia">Farmacovigilância</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Informações do Cliente */}
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-teal-600" />
                <h3 className="font-medium text-lg text-gray-800">Informações do Cliente</h3>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                <div className="space-y-2">
                  <Label htmlFor="cliente">
                    Cliente <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={cliente.id}
                    onValueChange={(value) => {}}
                  >
                    <SelectTrigger id="cliente" className="h-11">
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cliente1">Cliente 1</SelectItem>
                      <SelectItem value="cliente2">Cliente 2</SelectItem>
                      <SelectItem value="cliente3">Cliente 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Produto */}
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <Package className="h-5 w-5 text-teal-600" />
                <h3 className="font-medium text-lg text-gray-800">Produto</h3>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                <div className="space-y-2">
                  <Label htmlFor="produto">
                    Produto <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={produtoSelecionado}
                    onValueChange={setProdutoSelecionado}
                  >
                    <SelectTrigger id="produto" className="h-11">
                      <SelectValue placeholder="Selecione o produto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="produto1">Medicamento A</SelectItem>
                      <SelectItem value="produto2">Medicamento B</SelectItem>
                      <SelectItem value="produto3">Medicamento C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-teal-600" />
                <h3 className="font-medium text-lg text-gray-800">Descrição</h3>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                <div className="space-y-2">
                  <Label htmlFor="descricao">
                    Descrição <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="descricao"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Descreva o motivo do protocolo"
                    required
                    className="font-mono min-h-[200px] whitespace-pre-wrap resize-none"
                    style={{
                      lineHeight: "1.5",
                      padding: "1rem",
                      backgroundColor: motivoSelecionado === "email" ? "#f8fafc" : "white"
                    }}
                  />
                </div>
              </div>
            </div>
          </form>
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
            onClick={handleCriarProtocolo}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

