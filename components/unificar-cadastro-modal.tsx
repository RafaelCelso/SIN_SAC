"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  FileText,
  Search,
  Merge,
  Check,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Cliente {
  id: string
  nome: string
  documento: string
  telefone: string
  email: string
  endereco: string
  tipo: string
  dataCadastro: string
}

interface Protocolo {
  id: string
  data: string
  tipo: string
  produto: string
  status: string
}

interface UnificarCadastroModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clienteAtual: Cliente
}

// Mock de clientes para busca
const CLIENTES_MOCK = [
  {
    id: "2",
    nome: "João Santos",
    documento: "987.654.321-00",
    telefone: "(11) 91234-5678",
    email: "joao.santos@email.com",
    endereco: "Rua Augusta, 500 - São Paulo/SP",
    tipo: "Médico",
    dataCadastro: "15/02/2023",
  },
  {
    id: "3",
    nome: "Farmácia Saúde Ltda",
    documento: "12.345.678/0001-90",
    telefone: "(11) 3456-7890",
    email: "contato@farmaciasaude.com.br",
    endereco: "Av. Rebouças, 1500 - São Paulo/SP",
    tipo: "Pessoa Jurídica",
    dataCadastro: "05/03/2023",
  },
]

// Mock de protocolos por cliente
const PROTOCOLOS_MOCK: Record<string, Protocolo[]> = {
  "2": [
    {
      id: "P-2023-078",
      data: "10/05/2023",
      tipo: "Informação Médica",
      produto: "Medicamento C",
      status: "Em andamento",
    },
    {
      id: "P-2023-089",
      data: "15/05/2023",
      tipo: "Queixa Técnica",
      produto: "Medicamento D",
      status: "Pendente",
    },
  ],
  "3": [
    {
      id: "P-2023-112",
      data: "05/06/2023",
      tipo: "Farmacovigilância",
      produto: "Dispositivo Médico X",
      status: "Pendente",
    },
  ],
}

export function UnificarCadastroModal({
  open,
  onOpenChange,
  clienteAtual,
}: UnificarCadastroModalProps) {
  const [clienteOrigemId, setClienteOrigemId] = useState("")
  const [clienteOrigem, setClienteOrigem] = useState<Cliente | null>(null)
  const [protocolosOrigem, setProtocolosOrigem] = useState<Protocolo[]>([])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isSelected, setIsSelected] = useState(false)

  const buscarClienteOrigem = () => {
    if (!clienteOrigemId.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira o ID do cliente origem",
        variant: "destructive",
      })
      return
    }

    if (clienteOrigemId === clienteAtual.id) {
      toast({
        title: "Erro",
        description: "O cliente origem não pode ser o mesmo cliente atual",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)
    
    // Simular busca
    setTimeout(() => {
      const cliente = CLIENTES_MOCK.find(c => c.id === clienteOrigemId)
      if (cliente) {
        setClienteOrigem(cliente)
        setProtocolosOrigem(PROTOCOLOS_MOCK[clienteOrigemId] || [])
      } else {
        toast({
          title: "Cliente não encontrado",
          description: "Não foi possível encontrar um cliente com este ID",
          variant: "destructive",
        })
        setClienteOrigem(null)
        setProtocolosOrigem([])
      }
      setIsSearching(false)
    }, 1000)
  }

  const handleUnificar = () => {
    setShowConfirmDialog(true)
  }

  const confirmarUnificacao = () => {
    // Simular processo de unificação
    toast({
      title: "Cadastro unificado com sucesso",
      description: `Os protocolos de ${clienteOrigem?.nome} foram migrados para ${clienteAtual.nome}`,
    })
    
    // Resetar estado e fechar modal
    setClienteOrigemId("")
    setClienteOrigem(null)
    setProtocolosOrigem([])
    setShowConfirmDialog(false)
    onOpenChange(false)
  }

  const resetModal = () => {
    setClienteOrigemId("")
    setClienteOrigem(null)
    setProtocolosOrigem([])
    setShowConfirmDialog(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(open) => {
        if (!open) resetModal()
        onOpenChange(open)
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Merge className="h-5 w-5 text-teal-600" />
              Unificar Cadastro
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Descrição e Aviso */}
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Atenção:</strong> Esta ação irá migrar todos os protocolos do cliente origem para o cliente atual. 
                O cadastro do cliente origem será excluído permanentemente. <strong>Esta ação não poderá ser desfeita.</strong>
              </AlertDescription>
            </Alert>

            {/* Cliente Atual */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-teal-600" />
                  Cliente Atual (Destino)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Nome:</span>
                      <span>{clienteAtual.nome}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Documento:</span>
                      <span>{clienteAtual.documento}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Telefone:</span>
                      <span>{clienteAtual.telefone}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">E-mail:</span>
                      <span>{clienteAtual.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Endereço:</span>
                      <span>{clienteAtual.endereco}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Tipo:</span>
                      <Badge variant="outline">{clienteAtual.tipo}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cliente Origem */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Search className="h-5 w-5 text-teal-600" />
                  Cliente Origem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="clienteOrigemId">ID do Cliente Origem</Label>
                    <Input
                      id="clienteOrigemId"
                      placeholder="Digite o ID do cliente origem"
                      value={clienteOrigemId}
                      onChange={(e) => setClienteOrigemId(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && buscarClienteOrigem()}
                    />
                  </div>
                  <Button 
                    onClick={buscarClienteOrigem} 
                    disabled={isSearching}
                    className="mt-6"
                  >
                    {isSearching ? "Buscando..." : "Buscar"}
                  </Button>
                </div>

                {/* Informações do Cliente Origem */}
                {clienteOrigem && (
                  <Card className="border border-gray-200 bg-white">
                    <CardContent className="p-4">
                      {/* Header do Cliente com Avatar e Botão Remover */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {/* Avatar Circular */}
                          <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {clienteOrigem.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{clienteOrigem.nome}</h3>
                            <p className="text-sm text-gray-600">{clienteOrigem.tipo}</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={isSelected ? "bg-red-500/10 text-red-600 border border-red-200 hover:bg-red-500/20 hover:border-red-300" : "bg-green-500/10 text-green-600 border border-green-200 hover:bg-green-500/20 hover:border-green-300"}
                          onClick={() => {
                            if (isSelected) {
                              setClienteOrigem(null)
                              setProtocolosOrigem([])
                              setClienteOrigemId("")
                              setIsSelected(false)
                            } else {
                              setIsSelected(true)
                            }
                          }}
                        >
                          {isSelected ? (
                            <>
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Remover
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Confirmar
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Informações de Contato */}
                      <div className="grid grid-cols-2 gap-6 text-sm mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{clienteOrigem.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{clienteOrigem.telefone}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{clienteOrigem.documento}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{clienteOrigem.endereco}</span>
                          </div>
                        </div>
                      </div>

                      {/* Protocolos do Cliente Origem */}
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium flex items-center gap-2 text-gray-700">
                            <FileText className="h-4 w-4" />
                            Protocolos
                          </h4>
                          <span className="text-sm text-gray-500">{protocolosOrigem.length} protocolo(s)</span>
                        </div>
                        {protocolosOrigem.length > 0 ? (
                          <div className="space-y-3">
                            {protocolosOrigem.map((protocolo) => (
                              <div key={protocolo.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <div className="mb-2">
                                  <span className="font-semibold text-gray-900">{protocolo.id}</span>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-500">Aberto em</span>
                                    <span className="text-gray-700">{protocolo.data}</span>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-500">Motivo</span>
                                      <span className="text-gray-700">{protocolo.tipo}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-500">Produtos</span>
                                      <span className="text-gray-700">{protocolo.produto}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">Nenhum protocolo encontrado para este cliente.</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleUnificar}
              disabled={!clienteOrigem || !isSelected}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Unificar Cadastro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirmar Unificação de Cadastro
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Você está prestes a unificar o cadastro de <strong>{clienteOrigem?.nome}</strong> com <strong>{clienteAtual.nome}</strong>.
              </p>
              <p>
                Esta ação irá:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Migrar todos os {protocolosOrigem.length} protocolo(s) para {clienteAtual.nome}</li>
                <li>Excluir permanentemente o cadastro de {clienteOrigem?.nome}</li>
              </ul>
              <p className="font-semibold text-red-600">
                ⚠️ Esta ação não poderá ser desfeita!
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmarUnificacao}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirmar Unificação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}