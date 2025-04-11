"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Clipboard, User, Package, FileText, Search, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

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

// Dados simulados de produtos
const PRODUTOS_MOCK = [
  {
    id: "1",
    nome: "Medicamento A",
    ean: "7891234567890",
    lote: "L2024001",
    categoria: "Medicamento"
  },
  {
    id: "2",
    nome: "Medicamento B",
    ean: "7891234567891",
    lote: "L2024002",
    categoria: "Medicamento"
  },
  {
    id: "3",
    nome: "Dispositivo Médico X",
    ean: "7891234567892",
    lote: "L2024003",
    categoria: "Dispositivo Médico"
  },
  {
    id: "4",
    nome: "Dispositivo Médico Y",
    ean: "7891234567893",
    lote: "L2024004",
    categoria: "Dispositivo Médico"
  },
  {
    id: "5",
    nome: "Medicamento C",
    ean: "7891234567894",
    lote: "L2024005",
    categoria: "Medicamento"
  }
]

export function NovoProtocoloModal({ open, onOpenChange, cliente }: NovoProtocoloModalProps) {
  const router = useRouter()
  const [motivoSelecionado, setMotivoSelecionado] = useState<string>("")
  const [subCategoriaSelecionada, setSubCategoriaSelecionada] = useState<string>("")
  const [detalheSelecionado, setDetalheSelecionado] = useState<string>("")
  const [produtoSearchTerm, setProdutoSearchTerm] = useState("")
  const [selectedProduto, setSelectedProduto] = useState<(typeof PRODUTOS_MOCK)[0] | null>(null)
  const [observacoes, setObservacoes] = useState<string>("")
  const [lote, setLote] = useState<string>("")
  const [tipoQueixa, setTipoQueixa] = useState<string>("")
  const [assuntoInfo, setAssuntoInfo] = useState<string>("")
  const [reacaoAdversa, setReacaoAdversa] = useState<string>("")
  const [gravidade, setGravidade] = useState<string>("")

  // Função para filtrar produtos
  const filteredProdutos = PRODUTOS_MOCK.filter((produto) => {
    const searchTerm = produtoSearchTerm.toLowerCase()
    return (
      produto.nome.toLowerCase().includes(searchTerm) ||
      produto.lote.toLowerCase().includes(searchTerm) ||
      produto.ean.includes(searchTerm)
    )
  })

  const resetForm = () => {
    setMotivoSelecionado("")
    setSubCategoriaSelecionada("")
    setDetalheSelecionado("")
    setSelectedProduto(null)
    setProdutoSearchTerm("")
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

    if (!subCategoriaSelecionada) {
      toast({
        title: "Erro",
        description: "Selecione a subcategoria do atendimento",
        variant: "destructive",
      })
      return
    }

    if (!detalheSelecionado) {
      toast({
        title: "Erro",
        description: "Selecione o detalhe do atendimento",
        variant: "destructive",
      })
      return
    }

    if (!selectedProduto) {
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

    // Construir URL com parâmetros
    const urlBase = `/clientes/${cliente.id}`
    const urlParams = new URLSearchParams({
      protocolo: novoProtocolo,
      motivo: motivoSelecionado,
      subcategoria: subCategoriaSelecionada,
      detalhe: detalheSelecionado,
      produto: selectedProduto.nome,
      ean: selectedProduto.ean,
      lote: lote || selectedProduto.lote
    })

    router.push(`${urlBase}?${urlParams.toString()}`)
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
                <h3 className="font-medium text-lg text-gray-800">Motivo do Atendimento</h3>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                <div className="space-y-4">
                  <Select onValueChange={(value) => {
                    setMotivoSelecionado(value)
                    setSubCategoriaSelecionada("")
                    setDetalheSelecionado("")
                  }} value={motivoSelecionado}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecione o motivo principal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="queixa">Queixa Técnica</SelectItem>
                      <SelectItem value="evento">Evento Adverso</SelectItem>
                      <SelectItem value="informacao">Informação Médica</SelectItem>
                      <SelectItem value="farmacovigilancia">Farmacovigilância</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>

                  {motivoSelecionado && (
                    <Select value={subCategoriaSelecionada} onValueChange={setSubCategoriaSelecionada}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Selecione a subcategoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="subcategoria1">Subcategoria 1</SelectItem>
                        <SelectItem value="subcategoria2">Subcategoria 2</SelectItem>
                        <SelectItem value="subcategoria3">Subcategoria 3</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  {subCategoriaSelecionada && (
                    <Select value={detalheSelecionado} onValueChange={setDetalheSelecionado}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Selecione o detalhe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="detalhe1">Detalhe 1</SelectItem>
                        <SelectItem value="detalhe2">Detalhe 2</SelectItem>
                        <SelectItem value="detalhe3">Detalhe 3</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
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
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{cliente.nome}</span>
                  </div>
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
                <div className="space-y-4">
                  <Label htmlFor="produto">
                    Produto <span className="text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between h-11"
                      >
                        {selectedProduto ? selectedProduto.nome : "Buscar produto por nome, lote ou EAN"}
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                      <Command>
                        <CommandInput 
                          placeholder="Digite para buscar por nome, lote ou EAN..." 
                          className="h-9"
                          value={produtoSearchTerm}
                          onValueChange={setProdutoSearchTerm}
                        />
                        <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                        <CommandGroup>
                          {filteredProdutos.map((produto) => (
                            <CommandItem
                              key={produto.id}
                              value={produto.nome}
                              onSelect={() => {
                                setSelectedProduto(produto)
                                setProdutoSearchTerm("")
                                setLote(produto.lote)
                                const button = document.querySelector('[role="combobox"]')
                                const event = new MouseEvent('click', {
                                  bubbles: true,
                                  cancelable: true,
                                  view: window
                                })
                                button?.dispatchEvent(event)
                              }}
                              className="py-2"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedProduto?.id === produto.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">{produto.nome}</span>
                                <span className="text-sm text-gray-500">
                                  EAN: {produto.ean} | Lote: {produto.lote}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {selectedProduto && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Nome do Produto</span>
                          <p className="font-medium">{selectedProduto.nome}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">EAN</span>
                          <p className="font-medium">{selectedProduto.ean}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Lote</span>
                          <p className="font-medium">{selectedProduto.lote}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {motivoSelecionado === "queixa" && (
                    <div className="space-y-2">
                      <Label htmlFor="lote">
                        Lote <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lote"
                        value={lote}
                        onChange={(e) => setLote(e.target.value)}
                        placeholder="Informe o lote do produto"
                        className="h-11"
                      />
                    </div>
                  )}
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

