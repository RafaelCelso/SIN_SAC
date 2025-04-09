"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Package, FileText, AlertTriangle, Calendar, Phone } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface DetalhesRegistroModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  registro: {
    id: string
    tipo: string
    data: string
    produto: string
    status: string
    descricao: string
    [key: string]: any // Para campos adicionais específicos de cada tipo
  }
}

export function DetalhesRegistroModal({ open, onOpenChange, registro }: DetalhesRegistroModalProps) {
  // Determinar o título e ícone com base no tipo de registro
  let registroTitulo = ""
  let registroIcone = null

  if (registro.tipo === "queixa") {
    registroTitulo = "Queixa Técnica"
    registroIcone = <Package className="h-5 w-5 text-[#26B99D]" />
  } else if (registro.tipo === "informacao") {
    registroTitulo = "Informação Médica"
    registroIcone = <FileText className="h-5 w-5 text-[#26B99D]" />
  } else if (registro.tipo === "farmacovigilancia") {
    registroTitulo = "Farmacovigilância"
    registroIcone = <AlertTriangle className="h-5 w-5 text-[#26B99D]" />
  } else if (registro.tipo === "contato") {
    registroTitulo = "Histórico de Contato"
    registroIcone = <Phone className="h-5 w-5 text-[#26B99D]" />
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#E6F7F5] flex items-center justify-center">{registroIcone}</div>
            {registroTitulo} - {registro.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Gerais */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Data:</span>
                  <span>{registro.data}</span>
                </div>
                <Badge
                  variant={
                    registro.status === "Concluído" || registro.status === "Respondido" ? "default" : "secondary"
                  }
                  className={registro.status === "Concluído" || registro.status === "Respondido" ? "bg-[#26B99D]" : ""}
                >
                  {registro.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Produto:</span>
                <span>{registro.produto}</span>
              </div>

              {/* Campos específicos para Queixa Técnica */}
              {registro.tipo === "queixa" && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Lote:</span>
                    <span>{registro.lote}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Tipo de Queixa:</span>
                    <span>{registro.tipoQueixa}</span>
                  </div>
                </>
              )}

              {/* Campos específicos para Informação Médica */}
              {registro.tipo === "informacao" && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Assunto:</span>
                  <span>{registro.assunto}</span>
                </div>
              )}

              {/* Campos específicos para Farmacovigilância */}
              {registro.tipo === "farmacovigilancia" && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Reação Adversa:</span>
                    <span>{registro.reacao}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Gravidade:</span>
                    <Badge
                      variant={registro.gravidade === "Leve" ? "default" : "secondary"}
                      className={registro.gravidade === "Leve" ? "bg-[#26B99D]" : ""}
                    >
                      {registro.gravidade}
                    </Badge>
                  </div>
                </>
              )}

              {/* Campos específicos para Contato */}
              {registro.tipo === "contato" && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Tipo de Contato:</span>
                    <span>{registro.tipoContato}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Atendente:</span>
                    <span>{registro.atendente}</span>
                  </div>
                </>
              )}

              <Separator />

              <div className="space-y-2">
                <Label className="font-medium">Descrição</Label>
                <div className="p-3 border rounded-md bg-gray-50 min-h-[100px] whitespace-pre-wrap">
                  {registro.descricao}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Histórico de Atividades (se disponível) */}
          {registro.historico && registro.historico.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Histórico de Atividades</h3>
              {registro.historico.map((item: any, index: number) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{item.acao}</span>
                      <span className="text-sm text-gray-500">{item.data}</span>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">Por: {item.usuario}</div>
                    <div className="text-sm">{item.comentario}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

