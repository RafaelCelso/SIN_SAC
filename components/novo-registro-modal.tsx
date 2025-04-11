"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle, User, FileText, AlertTriangle, Info, Activity, Phone, Package, Search } from "lucide-react"

interface NovoRegistroModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tipo: "queixa" | "informacao" | "farmacovigilancia" | "contato"
  clienteId?: string
  cliente?: {
    id: string
    nome: string
  }
}

// Dados simulados de produtos
const PRODUTOS_MOCK = [
  {
    nome: "Medicamento A",
    ean: "7891234567890",
    lote: "L2024001"
  },
  {
    nome: "Medicamento B",
    ean: "7891234567891",
    lote: "L2024002"
  },
  {
    nome: "Dispositivo Médico X",
    ean: "7891234567892",
    lote: "L2024003"
  },
  {
    nome: "Dispositivo Médico Y",
    ean: "7891234567893",
    lote: "L2024004"
  },
  {
    nome: "Medicamento C",
    ean: "7891234567894",
    lote: "L2024005"
  },
]

export function NovoRegistroModal({ open, onOpenChange, tipo, cliente, clienteId }: NovoRegistroModalProps) {
  // Estado para o formulário
  const [formData, setFormData] = useState({
    // Campos comuns
    produto: "",
    descricao: "",

    // Campos específicos para queixa técnica
    lote: "",
    tipoQueixa: "",

    // Campos específicos para informação médica
    assunto: "",

    // Campos específicos para farmacovigilância
    reacaoAdversa: "",
    gravidade: "leve",

    // Campos específicos para contato
    tipoContato: "telefone",
    autorizaRetorno: "sim",
    dataRetorno: "",
    horarioRetorno: "",
    motivoContato: "",
  })

  // Estado para busca de produtos
  const [produtoSearch, setProdutoSearch] = useState("")
  const [showProdutosList, setShowProdutosList] = useState(false)
  const [produtosFiltrados, setProdutosFiltrados] = useState(PRODUTOS_MOCK)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Buscar dados do cliente se apenas o ID for fornecido
  const [clienteData, setClienteData] = useState<{ id: string; nome: string } | null>(cliente ? cliente : null)

  useEffect(() => {
    // Se temos um cliente completo, use-o
    if (cliente) {
      setClienteData(cliente)
    }
    // Se temos apenas o ID, busque os dados do cliente (simulado)
    else if (clienteId) {
      // Simulação de busca de cliente
      const clienteEncontrado = {
        id: clienteId,
        nome: clienteId === "1" ? "Maria Silva" : clienteId === "2" ? "João Santos" : "Cliente " + clienteId,
      }
      setClienteData(clienteEncontrado)
    }
  }, [cliente, clienteId])

  // Efeito para filtrar produtos baseado na busca
  useEffect(() => {
    const termoBusca = produtoSearch.toLowerCase()
    const produtos = PRODUTOS_MOCK.filter(
      produto =>
        produto.nome.toLowerCase().includes(termoBusca) ||
        produto.ean.includes(termoBusca) ||
        produto.lote.toLowerCase().includes(termoBusca)
    )
    setProdutosFiltrados(produtos)
  }, [produtoSearch])

  // Função para selecionar um produto
  const handleSelectProduto = (produto: typeof PRODUTOS_MOCK[0]) => {
    setFormData(prev => ({
      ...prev,
      produto: produto.nome
    }))
    setProdutoSearch("")
    setShowProdutosList(false)
  }

  // Efeito para fechar a lista quando clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowProdutosList(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

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
    if (tipo === "queixa" && (!formData.produto || !formData.lote || !formData.tipoQueixa || !formData.descricao)) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    if (tipo === "informacao" && (!formData.produto || !formData.assunto || !formData.descricao)) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    if (tipo === "farmacovigilancia" && (!formData.produto || !formData.reacaoAdversa || !formData.descricao)) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    if (tipo === "contato") {
      // Validação básica dos campos de contato
      if (!formData.tipoContato || !formData.descricao || !formData.motivoContato || !formData.produto) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos obrigatórios",
          variant: "destructive",
        })
        return
      }

      // Validação adicional se autorizar retorno
      if (formData.autorizaRetorno === "sim" && (!formData.dataRetorno || !formData.horarioRetorno)) {
        toast({
          title: "Erro",
          description: "Preencha a data e horário do retorno",
          variant: "destructive",
        })
        return
      }
    }

    // Simulação de envio
    let mensagem = ""
    if (tipo === "queixa") {
      mensagem = "Queixa técnica registrada com sucesso"
    } else if (tipo === "informacao") {
      mensagem = "Solicitação de informação médica registrada com sucesso"
    } else if (tipo === "farmacovigilancia") {
      mensagem = "Evento adverso registrado com sucesso"
    } else if (tipo === "contato") {
      mensagem = "Contato registrado com sucesso"
    }

    toast({
      title: "Sucesso",
      description: mensagem,
      duration: 3000,
    })

    onOpenChange(false)
  }

  // Determinar o título com base no tipo
  let titulo = ""
  if (tipo === "queixa") {
    titulo = "Nova Queixa Técnica"
  } else if (tipo === "informacao") {
    titulo = "Nova Solicitação de Informação Médica"
  } else if (tipo === "farmacovigilancia") {
    titulo = "Novo Registro de Farmacovigilância"
  } else if (tipo === "contato") {
    titulo = "Novo Registro de Contato"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-lg shadow-xl">
        <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg">
          <DialogTitle className="text-xl font-bold">{titulo}</DialogTitle>
          <DialogDescription className="text-teal-100">
            Preencha as informações do novo registro
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informações do Cliente */}
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-teal-600" />
                <h3 className="font-medium text-lg text-gray-800">Informações do Cliente</h3>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <div className="p-3 border rounded-lg bg-gray-50 shadow-sm">{clienteData?.nome}</div>
                </div>
              </div>
            </div>

            {/* Campos específicos para cada tipo */}
            {tipo === "queixa" && (
              <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-teal-600" />
                  <h3 className="font-medium text-lg text-gray-800">Detalhes da Queixa</h3>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="produto">
                      Produto <span className="text-red-500">*</span>
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
                    <Label htmlFor="lote">
                      Número do Lote <span className="text-red-500">*</span>
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
                    <Label htmlFor="tipoQueixa">
                      Tipo de Queixa <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      name="tipoQueixa"
                      value={formData.tipoQueixa}
                      onValueChange={(value) => handleSelectChange("tipoQueixa", value)}
                      required
                    >
                      <SelectTrigger id="tipoQueixa" className="h-11">
                        <SelectValue placeholder="Selecione o tipo de queixa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="embalagem">Problema na embalagem</SelectItem>
                        <SelectItem value="rotulagem">Problema na rotulagem</SelectItem>
                        <SelectItem value="conteudo">Problema no conteúdo</SelectItem>
                        <SelectItem value="funcionamento">Problema no funcionamento</SelectItem>
                        <SelectItem value="contaminacao">Suspeita de contaminação</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {tipo === "informacao" && (
              <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="h-5 w-5 text-teal-600" />
                  <h3 className="font-medium text-lg text-gray-800">Detalhes da Informação</h3>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="produto">
                      Produto <span className="text-red-500">*</span>
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
                    <Label htmlFor="assunto">
                      Assunto <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      name="assunto"
                      value={formData.assunto}
                      onValueChange={(value) => handleSelectChange("assunto", value)}
                      required
                    >
                      <SelectTrigger id="assunto" className="h-11">
                        <SelectValue placeholder="Selecione o assunto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="posologia">Posologia</SelectItem>
                        <SelectItem value="interacoes">Interações medicamentosas</SelectItem>
                        <SelectItem value="modo-uso">Modo de uso</SelectItem>
                        <SelectItem value="contraindicacoes">Contraindicações</SelectItem>
                        <SelectItem value="efeitos-colaterais">Efeitos colaterais</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {tipo === "farmacovigilancia" && (
              <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="h-5 w-5 text-teal-600" />
                  <h3 className="font-medium text-lg text-gray-800">Detalhes da Farmacovigilância</h3>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="produto">
                      Medicamento <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      name="produto"
                      value={formData.produto}
                      onValueChange={(value) => handleSelectChange("produto", value)}
                      required
                    >
                      <SelectTrigger id="produto" className="h-11">
                        <SelectValue placeholder="Selecione o medicamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medicamento-a">Medicamento A</SelectItem>
                        <SelectItem value="medicamento-b">Medicamento B</SelectItem>
                        <SelectItem value="medicamento-c">Medicamento C</SelectItem>
                        <SelectItem value="medicamento-d">Medicamento D</SelectItem>
                        <SelectItem value="medicamento-e">Medicamento E</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reacaoAdversa">
                      Reação Adversa <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="reacaoAdversa"
                      name="reacaoAdversa"
                      placeholder="Ex: Náusea, Erupção cutânea, etc."
                      value={formData.reacaoAdversa}
                      onChange={handleInputChange}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gravidade">Gravidade</Label>
                    <Select
                      name="gravidade"
                      value={formData.gravidade}
                      onValueChange={(value) => handleSelectChange("gravidade", value)}
                    >
                      <SelectTrigger id="gravidade" className="h-11">
                        <SelectValue placeholder="Selecione a gravidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="leve">Leve</SelectItem>
                        <SelectItem value="moderada">Moderada</SelectItem>
                        <SelectItem value="grave">Grave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {tipo === "contato" && (
              <>
                {/* Seção Produto */}
                <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="h-5 w-5 text-teal-600" />
                    <h3 className="font-medium text-lg text-gray-800">Produto</h3>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Buscar produto por nome, lote ou EAN"
                          className="h-11 pl-10"
                          value={produtoSearch}
                          onChange={(e) => setProdutoSearch(e.target.value)}
                          onFocus={() => setShowProdutosList(true)}
                          ref={searchInputRef}
                        />
                        {showProdutosList && (
                          <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
                            {produtosFiltrados.length > 0 ? (
                              produtosFiltrados.map((produto, index) => (
                                <button
                                  key={produto.ean}
                                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                                    index !== produtosFiltrados.length - 1 ? "border-b" : ""
                                  }`}
                                  onClick={() => handleSelectProduto(produto)}
                                >
                                  <div className="font-medium text-gray-900">{produto.nome}</div>
                                  <div className="text-sm text-gray-500">
                                    EAN: {produto.ean} | Lote: {produto.lote}
                                  </div>
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-sm text-gray-500">
                                Nenhum produto encontrado
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {formData.produto && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                          <div className="font-medium text-gray-900">{formData.produto}</div>
                          <div className="text-sm text-gray-500">
                            EAN: {PRODUTOS_MOCK.find(p => p.nome === formData.produto)?.ean} | 
                            Lote: {PRODUTOS_MOCK.find(p => p.nome === formData.produto)?.lote}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Seção Informações do Contato */}
                <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <Phone className="h-5 w-5 text-teal-600" />
                    <h3 className="font-medium text-lg text-gray-800">Informações do Contato</h3>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="motivoContato">
                        Motivo do Contato <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        name="motivoContato"
                        value={formData.motivoContato}
                        onValueChange={(value) => handleSelectChange("motivoContato", value)}
                        required
                      >
                        <SelectTrigger id="motivoContato" className="h-11">
                          <SelectValue placeholder="Selecione o motivo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="duvida">Dúvida</SelectItem>
                          <SelectItem value="reclamacao">Reclamação</SelectItem>
                          <SelectItem value="solicitacao">Solicitação</SelectItem>
                          <SelectItem value="informacao">Informação</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tipoContato">
                          Tipo de Contato <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          name="tipoContato"
                          value={formData.tipoContato}
                          onValueChange={(value) => handleSelectChange("tipoContato", value)}
                          required
                        >
                          <SelectTrigger id="tipoContato" className="h-11">
                            <SelectValue placeholder="Selecione o tipo de contato" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="telefone">Telefone</SelectItem>
                            <SelectItem value="email">E-mail</SelectItem>
                            <SelectItem value="presencial">Presencial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="autorizaRetorno">
                          Autoriza retorno de contato <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          name="autorizaRetorno"
                          value={formData.autorizaRetorno}
                          onValueChange={(value) => handleSelectChange("autorizaRetorno", value)}
                          required
                        >
                          <SelectTrigger id="autorizaRetorno" className="h-11">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sim">Sim</SelectItem>
                            <SelectItem value="nao">Não</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {formData.autorizaRetorno === "sim" && (
                      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-2">
                          <Label htmlFor="dataRetorno">
                            Data do Retorno <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="date"
                            id="dataRetorno"
                            name="dataRetorno"
                            value={formData.dataRetorno}
                            onChange={handleInputChange}
                            className="h-11"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="horarioRetorno">
                            Horário do Retorno <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="time"
                            id="horarioRetorno"
                            name="horarioRetorno"
                            value={formData.horarioRetorno}
                            onChange={handleInputChange}
                            className="h-11"
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

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
                    name="descricao"
                    placeholder="Descreva o conteúdo do contato"
                    rows={4}
                    value={formData.descricao}
                    onChange={handleInputChange}
                    required
                    className="font-mono min-h-[200px] whitespace-pre-wrap resize-none"
                    style={{
                      lineHeight: "1.5",
                      padding: "1rem",
                      backgroundColor: formData.tipoContato === "email" ? "#f8fafc" : "white"
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
            onClick={handleSubmit}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

