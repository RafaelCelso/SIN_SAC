"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Clock, User, Hash, ArrowRight, Plus, Minus, FileText } from "lucide-react"

interface AuditRecord {
  id: string
  dateTime: string
  user: string
  action: string
  details: string
  status: string
  beforeData?: any
  afterData?: any
}

interface AuditDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  record: AuditRecord | null
}

function getActionBadgeVariant(action: string) {
  switch (action) {
    case "LOGIN":
    case "LOGOUT":
      return "secondary"
    case "CREATE_PROTOCOL":
    case "CREATE_CLIENT":
    case "CREATE_PRODUCT":
      return "default"
    case "UPDATE_PROTOCOL":
    case "UPDATE_CLIENT":
    case "UPDATE_PRODUCT":
      return "outline"
    case "DELETE_PROTOCOL":
    case "DELETE_CLIENT":
    case "DELETE_PRODUCT":
      return "destructive"
    case "EXPORT_REPORT":
      return "secondary"
    default:
      return "default"
  }
}

function formatDateTime(dateTime: string) {
  return new Date(dateTime).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatDataForDisplay(data: any) {
  if (!data || typeof data !== 'object') {
    return (
      <div className="flex items-center justify-center py-8 text-slate-400">
        <span className="text-sm italic">Nenhum dado disponível</span>
      </div>
    )
  }
  
  return Object.entries(data).map(([key, value]) => (
    <div key={key} className="flex justify-between items-center py-2 px-3 bg-white/50 rounded-lg border border-white/20 hover:bg-white/70 transition-colors duration-200">
      <span className="font-medium text-sm text-slate-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
      <span className="text-sm text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded text-right max-w-[200px] truncate" title={String(value)}>
        {String(value)}
      </span>
    </div>
  ))
}

export function AuditDetailsModal({ isOpen, onClose, record }: AuditDetailsModalProps) {
  if (!record) return null

  const isUpdateOrDelete = record.action === 'Atualização' || record.action === 'Exclusão'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 bg-gradient-to-br from-slate-50 to-slate-100 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-200 rounded-lg">
                    <Hash className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">ID</h4>
                    <p className="text-sm font-mono font-semibold text-slate-900">#{record.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-br from-slate-50 to-slate-100 shadow-sm">
               <CardContent className="p-4">
                 <div className="flex items-center space-x-3">
                   <div className="p-2 bg-slate-200 rounded-lg">
                     <Clock className="h-4 w-4 text-slate-600" />
                   </div>
                   <div>
                     <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Data/Hora</h4>
                     <p className="text-sm font-semibold text-slate-900">{formatDateTime(record.dateTime)}</p>
                   </div>
                 </div>
               </CardContent>
             </Card>
            
            <Card className="border-0 bg-gradient-to-br from-slate-50 to-slate-100 shadow-sm">
               <CardContent className="p-4">
                 <div className="flex items-center space-x-3">
                   <div className="p-2 bg-slate-200 rounded-lg">
                     <User className="h-4 w-4 text-slate-600" />
                   </div>
                   <div>
                     <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Usuário</h4>
                     <p className="text-sm font-semibold text-slate-900">{record.user}</p>
                   </div>
                 </div>
               </CardContent>
             </Card>
          </div>

          <Card className="border-0 bg-gradient-to-br from-slate-50 to-slate-100 shadow-sm">
             <CardContent className="p-4">
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                   <div className="p-2 bg-slate-200 rounded-lg">
                     <FileText className="h-4 w-4 text-slate-600" />
                   </div>
                   <div>
                     <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Ação Executada</h4>
                     <p className="text-sm font-semibold text-slate-900">{record.action}</p>
                   </div>
                 </div>
                 <Badge variant="outline" className="bg-white/50 border-slate-200 text-slate-700">
                   {record.action}
                 </Badge>
               </div>
             </CardContent>
           </Card>

          {/* Dados Antes/Depois para UPDATE e DELETE */}
          {isUpdateOrDelete && (
            <>
              <Separator />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="pb-3 border-b border-red-100">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-200 rounded-lg">
                          <Minus className="h-4 w-4 text-red-600" />
                        </div>
                        <CardTitle className="text-sm font-semibold text-red-700 uppercase tracking-wide">Estado Anterior</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2 max-h-48 overflow-auto scrollbar-thin scrollbar-thumb-red-200 scrollbar-track-red-50">
                        {formatDataForDisplay(record.beforeData)}
                      </div>
                    </CardContent>
                  </Card>

                <div className="flex items-center justify-center lg:hidden">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <ArrowRight className="h-5 w-5" />
                    <div className="h-px bg-slate-200 flex-1"></div>
                  </div>
                </div>

                <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="pb-3 border-b border-green-100">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-200 rounded-lg">
                        <Plus className="h-4 w-4 text-green-600" />
                      </div>
                      <CardTitle className="text-sm font-semibold text-green-700 uppercase tracking-wide">Estado Atual</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2 max-h-48 overflow-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-green-50">
                      {formatDataForDisplay(record.afterData)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Dados para CREATE */}
          {record.action === 'Criação' && (
            <>
              <Separator />
              <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-3 border-b border-green-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-200 rounded-lg">
                      <Plus className="h-4 w-4 text-green-600" />
                    </div>
                    <CardTitle className="text-sm font-semibold text-green-700 uppercase tracking-wide">Dados Criados</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2 max-h-48 overflow-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-green-50">
                    {formatDataForDisplay(record.afterData)}
                  </div>
                </CardContent>
              </Card>
            </>
          )}


        </div>
      </DialogContent>
    </Dialog>
  )
}