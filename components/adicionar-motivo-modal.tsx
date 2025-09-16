"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface AdicionarMotivoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (tipoMotivo: string, motivoSelecionado: string) => void
}

const MOTIVOS_INTERNOS = [
  "Aguardando outro setor",
  "Abertura de Queixa Técnica",
  "Abertura de Farmacovigilância",
  "Aguardando retorno operacional",
  "Outro"
]

const MOTIVOS_CLIENTE = [
  "Informações incompletas",
  "Solicitou prazo maior para retorno",
  "Não disponível no contato",
  "Outro"
]

export function AdicionarMotivoModal({ isOpen, onClose, onSubmit }: AdicionarMotivoModalProps) {
  const [tipoMotivo, setTipoMotivo] = useState<string>("")
  const [motivoSelecionado, setMotivoSelecionado] = useState<string>("")

  const handleSubmit = () => {
    if (tipoMotivo && motivoSelecionado) {
      onSubmit(tipoMotivo, motivoSelecionado)
      handleClose()
    }
  }

  const handleClose = () => {
    setTipoMotivo("")
    setMotivoSelecionado("")
    onClose()
  }

  const handleTipoMotivoChange = (value: string) => {
    setTipoMotivo(value)
    setMotivoSelecionado("") // Reset da justificativa selecionada ao trocar o tipo
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Justificativa</DialogTitle>
          <DialogDescription>
            Selecione o tipo de justificativa e a opção específica para justificar o status do protocolo.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="tipo-motivo">Tipo de Justificativa *</Label>
            <Select value={tipoMotivo} onValueChange={handleTipoMotivoChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de justificativa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Interno">Interno</SelectItem>
                <SelectItem value="Cliente">Cliente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {tipoMotivo && (
            <div className="grid gap-2">
              <Label htmlFor="motivo-especifico">Justificativa {tipoMotivo} *</Label>
              <Select value={motivoSelecionado} onValueChange={setMotivoSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder={`Selecione a Justificativa ${tipoMotivo.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {tipoMotivo === "Interno" 
                    ? MOTIVOS_INTERNOS.map((motivo) => (
                        <SelectItem key={motivo} value={motivo}>
                          {motivo}
                        </SelectItem>
                      ))
                    : MOTIVOS_CLIENTE.map((motivo) => (
                        <SelectItem key={motivo} value={motivo}>
                          {motivo}
                        </SelectItem>
                      ))
                  }
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!tipoMotivo || !motivoSelecionado}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
