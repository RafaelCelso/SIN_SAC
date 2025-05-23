"use client"

import React, { useState, useEffect } from "react"
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
import { ArrowLeft, Package, FileText, AlertTriangle, CheckCircle, Upload, Barcode, Search, X, Tag, Hash, Calendar, CalendarCheck, Lock, HelpCircle, ClipboardList, Pill, Save, Pencil, Info, MoreVertical, MessageSquare, Ban, User, Speech, FileCheck, Printer } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import dynamic from "next/dynamic"
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"

// Dados simulados de clientes
const CLIENTES_MOCK = [
  {
    id: "1",
    nome: "Maria Silva",
    documento: "123.456.789-00",
    telefone: "(11) 98765-4321",
    email: "maria.silva@email.com",
    endereco: "Av. Paulista, 1000 - São Paulo/SP",
    tipo: "Médico",
    dataCadastro: "10/01/2023",
  },
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
    dataCadastro: "20/03/2023",
  },
]

// Mock de protocolos por cliente
type Protocolo = {
  id: string;
  data: string;
  produto: string;
  sku: string;
  lote: string;
  ean: string;
  dataFabricacao: string;
  dataValidade: string;
  motivo: string;
  subcategoria?: string;
  detalhe?: string;
  farmacovigilancia?: { 
    id: string; 
    motivoPrincipal: string;
    subcategoria: string;
    detalhe: string;
  }[];
}
const PROTOCOLOS_MOCK: Record<string, Protocolo[]> = {
  "1": [
    {
      id: "P-1001",
      data: "05/01/2023",
      produto: "Medicamento A",
      sku: "SKU-001",
      lote: "L12345",
      ean: "7891234567890",
      dataFabricacao: "2023-01-01",
      dataValidade: "2025-01-01",
      motivo: "Dúvida sobre uso",
      subcategoria: "Medicamento",
      detalhe: "Antagonista",
      farmacovigilancia: [
        { id: "FV-2023-0001", motivoPrincipal: "Qualidade", subcategoria: "Aparência", detalhe: "Risco" },
        { id: "FV-2023-0002", motivoPrincipal: "Embalagem", subcategoria: "Odor", detalhe: "Quebra" }
      ]
    },
    {
      id: "P-1002",
      data: "20/02/2023",
      produto: "Dispositivo X",
      sku: "SKU-002",
      lote: "L54321",
      ean: "7890987654321",
      dataFabricacao: "2023-02-01",
      dataValidade: "2026-02-01",
      motivo: "Reclamação de funcionamento",
      subcategoria: "Dispositivo",
      detalhe: "Implante",
      farmacovigilancia: []
    },
  ],
  "2": [
    {
      id: "P-2001",
      data: "10/03/2023",
      produto: "Medicamento B",
      sku: "SKU-003",
      lote: "L22222",
      ean: "7892222222222",
      dataFabricacao: "2023-03-01",
      dataValidade: "2025-03-01",
      motivo: "Solicitação de troca",
      subcategoria: "Medicamento",
      detalhe: "Antagonista",
      farmacovigilancia: []
    },
  ],
  "3": [
    {
      id: "P-3001",
      data: "15/04/2023",
      produto: "Medicamento C",
      sku: "SKU-004",
      lote: "L33333",
      ean: "7893333333333",
      dataFabricacao: "2023-04-01",
      dataValidade: "2025-04-01",
      motivo: "Dúvida sobre validade",
      subcategoria: "Medicamento",
      detalhe: "Antagonista",
      farmacovigilancia: []
    },
    {
      id: "P-3002",
      data: "22/05/2023",
      produto: "Dispositivo Y",
      sku: "SKU-005",
      lote: "L44444",
      ean: "7894444444444",
      dataFabricacao: "2023-05-01",
      dataValidade: "2026-05-01",
      motivo: "Reclamação de embalagem",
      subcategoria: "Dispositivo",
      detalhe: "Implante",
      farmacovigilancia: []
    },
    {
      id: "P-3003",
      data: "01/06/2023",
      produto: "Medicamento A",
      sku: "SKU-001",
      lote: "L55555",
      ean: "7891234567890",
      dataFabricacao: "2023-06-01",
      dataValidade: "2025-06-01",
      motivo: "Solicitação de devolução",
      subcategoria: "Medicamento",
      detalhe: "Antagonista",
      farmacovigilancia: []
    },
  ],
};

type ArquivoAnexo = {
  id: string;
  nome: string;
  tamanho: number;
  tipo: string;
  arquivo: File;
}

// Função utilitária para renderizar o card de farmacovigilância igual ao card de protocolo, incluindo o produto
function CardFarmacovigilancia({ fv, produto, isSelected, isLinked, onSelect, onUnlink }: {
  fv: { id: string; motivoPrincipal: string; subcategoria: string; detalhe: string };
  produto: string;
  isSelected: boolean;
  isLinked: boolean;
  onSelect: () => void;
  onUnlink: () => void;
}) {
  return (
    <div
      className={`relative px-4 py-2 rounded-md border flex flex-col items-start min-w-[200px] shadow-sm transition-colors min-h-[120px]
        ${isLinked ? 'border-[#15937E] bg-[#e6faf7] ring-2 ring-[#15937E]' : isSelected ? 'border-[#26B99D] bg-[#e6faf7]' : 'border-gray-200 bg-white hover:border-[#26B99D]'}
      `}
      style={{ boxShadow: '0 1px 2px 0 rgb(38 185 157 / 0.08), 0 1.5px 6px 0 rgb(38 185 157 / 0.08)' }}
    >
      {isLinked && (
        <button
          type="button"
          className="absolute top-2 right-2 p-1 rounded hover:bg-red-100 text-red-700"
          onClick={onUnlink}
          aria-label="Desvincular farmacovigilância"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      )}
      <button
        type="button"
        className="w-full text-left"
        disabled={isLinked}
        onClick={onSelect}
      >
        <span className="font-bold text-base text-[#26B99D] tracking-wide">{fv.id}</span>
        <span className="text-sm text-gray-900 flex items-center gap-2 mb-3 mt-4">
          <Pill className="h-4 w-4 text-[#26B99D]" />
          {produto}
        </span>
        <div className="flex flex-wrap gap-2 items-center mt-auto">
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">Motivo Principal: {fv.motivoPrincipal}</span>
          <span className="font-bold text-[#D3D7DD]">&gt;</span>
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">Subcategoria: {fv.subcategoria}</span>
          <span className="font-bold text-[#D3D7DD]">&gt;</span>
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">Detalhe: {fv.detalhe}</span>
        </div>
      </button>
    </div>
  );
}

// Componente de resumo do formulário
interface ResumoFormularioProps {
  formData: any;
  cliente: any;
  relatorNome: string;
  relatorTelefone: string;
  relatorEmail: string;
  relatorRelacao: string;
  clienteEhRelator: "sim" | "nao";
  arquivos: ArquivoAnexo[];
}
function ResumoFormulario({ formData, cliente, relatorNome, relatorTelefone, relatorEmail, relatorRelacao, clienteEhRelator, arquivos }: ResumoFormularioProps) {
  const [idioma, setIdioma] = useState("pt");
  return (
    <Card className="mb-8 border-2 border-teal-200 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-2xl text-teal-900">Resumo do Formulário</CardTitle>
          <div className="flex items-center gap-2 ml-4">
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-200"
              value={idioma}
              onChange={e => setIdioma(e.target.value)}
              style={{ minWidth: 120 }}
            >
              <option value="pt">Português</option>
              <option value="en">Inglês</option>
            </select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.print()}
              title="Imprimir resumo"
            >
              <Printer className="h-5 w-5 text-teal-700" />
            </Button>
          </div>
        </div>
        <CardDescription className="text-base text-gray-700 mt-2">Confira todos os dados informados antes de prosseguir.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Relator */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-4">
            <h3 className="font-bold text-lg text-teal-900 bg-gray-100 border-l-4 border-teal-400 pl-3 py-1 rounded w-full">Informações do Relator</h3>
          </div>
          {clienteEhRelator === 'sim' ? (
            <p className="text-gray-700">O cliente é o relator.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-base leading-relaxed">
              <div><span className="font-semibold text-gray-700">Nome:</span> <span className="text-teal-900 font-bold">{relatorNome}</span></div>
              <div><span className="font-semibold text-gray-700">Telefone:</span> <span className="text-teal-900 font-bold">{relatorTelefone}</span></div>
              <div><span className="font-semibold text-gray-700">E-mail:</span> <span className="text-teal-900 font-bold">{relatorEmail}</span></div>
              <div><span className="font-semibold text-gray-700">Relação com o Cliente:</span> <span className="text-teal-900 font-bold">{relatorRelacao}</span></div>
            </div>
          )}
        </div>
        <Separator />
        {/* Cliente */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-4">
            <h3 className="font-bold text-lg text-teal-900 bg-gray-100 border-l-4 border-teal-400 pl-3 py-1 rounded w-full">Informações do Cliente</h3>
          </div>
          {cliente ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base leading-relaxed">
              <div><span className="font-semibold text-gray-700">Nome:</span> <span className="text-teal-900 font-bold">{cliente.nome}</span></div>
              <div><span className="font-semibold text-gray-700">Documento:</span> <span className="text-teal-900 font-bold">{cliente.documento}</span></div>
              <div><span className="font-semibold text-gray-700">Telefone:</span> <span className="text-teal-900 font-bold">{cliente.telefone}</span></div>
              <div><span className="font-semibold text-gray-700">E-mail:</span> <span className="text-teal-900 font-bold">{cliente.email}</span></div>
              <div className="md:col-span-2"><span className="font-semibold text-gray-700">Endereço:</span> <span className="text-teal-900 font-bold">{cliente.endereco}</span></div>
            </div>
          ) : (
            <span className="text-gray-500">Cliente não selecionado.</span>
          )}
        </div>
        <Separator />
        {/* Produto */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-4">
            <h3 className="font-bold text-lg text-teal-900 bg-gray-100 border-l-4 border-teal-400 pl-3 py-1 rounded w-full">Informações do Produto</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base leading-relaxed">
            <div><span className="font-semibold text-gray-700">Produto:</span> <span className="text-teal-900 font-bold">{formData.produto}</span></div>
            <div><span className="font-semibold text-gray-700">SKU:</span> <span className="text-teal-900 font-bold">{formData.sku}</span></div>
            <div><span className="font-semibold text-gray-700">Lote:</span> <span className="text-teal-900 font-bold">{formData.lote}</span></div>
            <div><span className="font-semibold text-gray-700">EAN:</span> <span className="text-teal-900 font-bold">{formData.ean}</span></div>
            <div><span className="font-semibold text-gray-700">Data de Fabricação:</span> <span className="text-teal-900 font-bold">{formData.dataFabricacao}</span></div>
            <div><span className="font-semibold text-gray-700">Data de Validade:</span> <span className="text-teal-900 font-bold">{formData.dataValidade}</span></div>
          </div>
        </div>
        <Separator />
        {/* Detalhes da Queixa */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-4">
            <h3 className="font-bold text-lg text-teal-900 bg-gray-100 border-l-4 border-teal-400 pl-3 py-1 rounded w-full">Detalhes da Queixa</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base leading-relaxed">
            <div><span className="font-semibold text-gray-700">Motivo Principal:</span> <span className="text-teal-900 font-bold">{formData.motivoPrincipal}</span></div>
            <div><span className="font-semibold text-gray-700">Subcategoria:</span> <span className="text-teal-900 font-bold">{formData.subcategoria}</span></div>
            <div><span className="font-semibold text-gray-700">Detalhe:</span> <span className="text-teal-900 font-bold">{formData.detalhe}</span></div>
            <div><span className="font-semibold text-gray-700">Possui Amostra:</span> <span className="text-teal-900 font-bold">{formData.possuiAmostra === 'sim' ? 'Sim' : 'Não'}</span></div>
          </div>
            <div className="md:col-span-3 col-span-1 mt-4">
              <span className="font-semibold text-gray-700 block mb-2">Narrativa:</span>
              <div
                className="text-teal-900 font-bold text-base bg-gray-50 border-l-4 border-teal-400 p-4 rounded whitespace-pre-line break-words"
                style={{ wordBreak: 'break-word' }}
                dangerouslySetInnerHTML={{ __html: formData.narrativa || '<span class=\'text-gray-400\'>Nenhuma narrativa registrada.</span>' }}
              />
            </div>
        </div>
        <Separator />
        {/* Compra */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-4">
            <h3 className="font-bold text-lg text-teal-900 bg-gray-100 border-l-4 border-teal-400 pl-3 py-1 rounded w-full">Informações de Compra</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base leading-relaxed">
            <div><span className="font-semibold text-gray-700">Quantidade Comprada:</span> <span className="text-teal-900 font-bold">{formData.quantidadeComprada}</span></div>
            <div><span className="font-semibold text-gray-700">Quantidade com Desvio:</span> <span className="text-teal-900 font-bold">{formData.quantidadeDesvio}</span></div>
            <div><span className="font-semibold text-gray-700">Local de Compra:</span> <span className="text-teal-900 font-bold">{formData.localCompra}</span></div>
            <div><span className="font-semibold text-gray-700">Data de Compra:</span> <span className="text-teal-900 font-bold">{formData.dataCompra}</span></div>
          </div>
        </div>
        <Separator />
        {/* Armazenamento */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-4">
            <h3 className="font-bold text-lg text-teal-900 bg-gray-100 border-l-4 border-teal-400 pl-3 py-1 rounded w-full">Armazenamento</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base leading-relaxed">
            <div><span className="font-semibold text-gray-700">Local de Armazenamento:</span> <span className="text-teal-900 font-bold">{formData.localArmazenamento}</span></div>
            <div><span className="font-semibold text-gray-700">Modo de Armazenamento:</span> <span className="text-teal-900 font-bold">{formData.modoArmazenamento}</span></div>
            <div><span className="font-semibold text-gray-700">Caixa Lacrada:</span> <span className="text-teal-900 font-bold">{formData.caixaLacrada === 'sim' ? 'Sim' : 'Não'}</span></div>
          </div>
        </div>
        <Separator />
        
        {/* Anexos */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-4">
            <h3 className="font-bold text-lg text-teal-900 bg-gray-100 border-l-4 border-teal-400 pl-3 py-1 rounded w-full">Anexos</h3>
          </div>
          {arquivos && arquivos.length > 0 ? (
            <ul className="list-disc ml-6 text-teal-900 font-bold text-base">
              {arquivos.map((a: ArquivoAnexo) => (
                <li key={a.id}>{a.nome}</li>
              ))}
            </ul>
          ) : (
            <span className="text-gray-500">Nenhum arquivo anexado.</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

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
  const [clienteSearchQuery, setClienteSearchQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [status, setStatus] = useState<"Aberto" | "Revisão" | "Rejeitado" | "Qualidade" | "Retornado" | "Enviado para fábrica" | "Concluído">("Aberto")
  const [formData, setFormData] = useState({
    produto: "",
    sku: "",
    lote: "",
    ean: "",
    dataFabricacao: "",
    dataValidade: "",
    descricaoQueixa: "",
    tipoQueixa: "embalagem",
    possuiAmostra: "nao",
    enviarAmostra: false,
    prioridade: "normal",
    observacoes: "",
    quantidadeComprada: "",
    quantidadeDesvio: "",
    localCompra: "",
    dataCompra: "",
    dataCompraFormato: "MM/AA",
    dataAbertura: "",
    dataAberturaFormato: "MM/AA",
    localArmazenamento: "",
    modoArmazenamento: "",
    caixaLacrada: "nao",
    utilizouProduto: "nao",
    quantidadeUtilizada: "",
    apresentouSintoma: "nao",
    numeroFarmacovigilancia: "",
    narrativa: "",
    solicitaLaudo: "",
    farmacovigilancia: "",
    envioAmostra: "nao",
    reembolsoNome: "",
    reembolsoCpf: "",
    reembolsoTelefone: "",
    reembolsoCaixa: "",
    reembolsoValor: "",
    reembolsoCodigoPostal: "",
    reembolsoValorPostal: "",
    tipoRessarcimento: "financeiro",
    financeiroNome: "",
    financeiroCpf: "",
    financeiroBanco: "",
    financeiroAgencia: "",
    financeiroConta: "",
    financeiroTipoConta: "",
    reembolsoEndereco: "",
    reembolsoNumero: "",
    reembolsoComplemento: "",
    reembolsoBairro: "",
    reembolsoCidade: "",
    reembolsoEstado: "",
    reembolsoCep: "",
    motivoPrincipal: "",
    subcategoria: "",
    detalhe: "",
    motivo: "",
  })
  const [protocoloSelecionado, setProtocoloSelecionado] = useState<Protocolo | null>(null)
  const [protocoloVinculado, setProtocoloVinculado] = useState<Protocolo | null>(null)
  const [arquivos, setArquivos] = useState<ArquivoAnexo[]>([])
  // Adicione um novo estado para controlar a farmacovigilância vinculada
  const [farmacoVinculada, setFarmacoVinculada] = useState<string | null>(null)
  const [comentarios, setComentarios] = useState<Record<string, { id: string; texto: string; usuario: string; data: string }[]>>({})
  const [comentarioGeral, setComentarioGeral] = useState("")
  // 1. Adicionar estado para destaque do campo Produto
  const [camposAtencao, setCamposAtencao] = useState<{ [key: string]: boolean }>({})
  const [novoComentario, setNovoComentario] = useState<{ [key: string]: string }>({})
  const [editandoComentario, setEditandoComentario] = useState<{ [key: string]: string }>({})
  // Adicione este estado junto aos outros useState
  const [textoEdicaoComentario, setTextoEdicaoComentario] = useState<{ [key: string]: string }>({})
  // Adicione o estado para comentários gerais registrados
  const [comentariosGerais, setComentariosGerais] = useState<{id: string, texto: string, usuario: string, data: string}[]>([]);
  // Adicione o estado para controlar edição de comentário geral
  const [editandoComentarioGeral, setEditandoComentarioGeral] = useState<string | null>(null);
  const [textoEdicaoComentarioGeral, setTextoEdicaoComentarioGeral] = useState<string>("");
  const [relatorNome, setRelatorNome] = useState("")
  const [relatorTelefone, setRelatorTelefone] = useState("")
  const [relatorRelacao, setRelatorRelacao] = useState("")
  const [clienteEhRelator, setClienteEhRelator] = useState<"sim" | "nao">("sim")
  const [relatorEmail, setRelatorEmail] = useState("")

  // Filtrar clientes com base na busca
  const filteredClientes = CLIENTES_MOCK.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(clienteSearchQuery.toLowerCase()) ||
      cliente.documento.includes(clienteSearchQuery) ||
      cliente.email.toLowerCase().includes(clienteSearchQuery.toLowerCase()) ||
      cliente.telefone.includes(clienteSearchQuery),
  )

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

  useEffect(() => {
    if (protocoloVinculado) {
      setFormData((prev) => ({
        ...prev,
        produto: protocoloVinculado.produto,
        sku: protocoloVinculado.sku,
        lote: protocoloVinculado.lote,
        ean: protocoloVinculado.ean,
        dataFabricacao: protocoloVinculado.dataFabricacao,
        dataValidade: protocoloVinculado.dataValidade,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        produto: "",
        sku: "",
        lote: "",
        ean: "",
        dataFabricacao: "",
        dataValidade: "",
      }))
    }
  }, [protocoloVinculado])

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

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

    // Atualiza o status para "Revisão" ao enviar
    setStatus("Revisão")

    // Simulação de envio do formulário
    toast({
      title: "Queixa técnica enviada para revisão",
      description: "O formulário foi enviado e está aguardando revisão.",
      duration: 5000,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const novosArquivos = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        nome: file.name,
        tamanho: file.size,
        tipo: file.type,
        arquivo: file
      }))
      setArquivos(prev => [...prev, ...novosArquivos])
    }
  }

  const handleRemoveFile = (id: string) => {
    setArquivos(prev => prev.filter(arquivo => arquivo.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  // Função para autopreencher os dados de endereço com os dados do cliente selecionado
  const handlePreencherEnderecoCliente = () => {
    if (!cliente) return;
    // Supondo que o endereço do cliente está no formato: 'Rua, Número - Bairro - Cidade/UF'
    // Exemplo: 'Av. Paulista, 1000 - Bela Vista - São Paulo/SP'
    let logradouro = '';
    let numero = '';
    let bairro = '';
    let cidade = '';
    let estado = '';
    let cep = '';
    let complemento = '';
    // Busca o cliente completo no mock para pegar todos os campos
    const clienteMock = CLIENTES_MOCK.find(c => c.id === cliente.id);
    if (clienteMock) {
      logradouro = (clienteMock as any).logradouro || '';
      numero = (clienteMock as any).numero || '';
      complemento = (clienteMock as any).complemento || '';
      bairro = (clienteMock as any).bairro || '';
      cidade = (clienteMock as any).cidade || '';
      estado = (clienteMock as any).estado || '';
      cep = (clienteMock as any).cep || '';
    }
    // Se não houver campos detalhados, tenta extrair do campo endereco
    if ((!logradouro || !numero || !bairro || !cidade || !estado) && cliente.endereco) {
      const [ruaENum, resto] = cliente.endereco.split('-').map(s => s.trim());
      if (ruaENum) {
        const [rua, num] = ruaENum.split(',').map(s => s.trim());
        if (!logradouro) logradouro = rua || '';
        if (!numero) numero = num || '';
      }
      if (resto) {
        const [bairroStr, cidadeUf] = resto.split('-').map(s => s.trim());
        if (!bairro) bairro = bairroStr || '';
        if (cidadeUf) {
          const [cidadeStr, uf] = cidadeUf.split('/').map(s => s.trim());
          if (!cidade) cidade = cidadeStr || '';
          if (!estado) estado = uf || '';
        }
      }
    }
    setFormData(prev => ({
      ...prev,
      reembolsoEndereco: logradouro,
      reembolsoNumero: numero,
      reembolsoComplemento: complemento,
      reembolsoBairro: bairro,
      reembolsoCidade: cidade,
      reembolsoEstado: estado,
      reembolsoCep: cep,
    }));
  };

  // Função para renderizar a tag de status com a cor correta
  const renderStatusBadge = () => {
    const statusConfig = {
      "Aberto": {
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200"
      },
      "Revisão": {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200"
      },
      "Rejeitado": {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200"
      },
      "Qualidade": {
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200"
      },
      "Retornado": {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200"
      },
      "Enviado para fábrica": {
        bg: "bg-indigo-50",
        text: "text-indigo-700",
        border: "border-indigo-200"
      },
      "Concluído": {
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200"
      }
    }

    const config = statusConfig[status]

    return (
      <Badge className={`${config.bg} ${config.text} ${config.border} text-sm px-3 py-1 font-medium`}>
        {status}
      </Badge>
    )
  }

  // Função para atualizar o status
  const updateStatus = (newStatus: typeof status) => {
    setStatus(newStatus)
    toast({
      title: "Status atualizado",
      description: `Status alterado para "${newStatus}"`,
      duration: 3000,
    })
  }

  // Função para verificar se uma transição de status é permitida
  const canTransitionTo = (targetStatus: typeof status) => {
    const allowedTransitions: Record<typeof status, typeof status[]> = {
      "Aberto": ["Revisão"],
      "Revisão": ["Rejeitado", "Qualidade"],
      "Rejeitado": ["Revisão"],
      "Qualidade": ["Retornado", "Enviado para fábrica"],
      "Retornado": ["Qualidade"],
      "Enviado para fábrica": ["Concluído"],
      "Concluído": []
    }
    return allowedTransitions[status].includes(targetStatus)
  }

  // Função para renderizar o menu de ações de status
  const renderStatusActions = () => {
    const allStatuses: typeof status[] = ["Aberto", "Revisão", "Rejeitado", "Qualidade", "Retornado", "Enviado para fábrica", "Concluído"]
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {allStatuses.map((targetStatus) => (
            <DropdownMenuItem
              key={targetStatus}
              disabled={!canTransitionTo(targetStatus)}
              onClick={() => updateStatus(targetStatus)}
              className={!canTransitionTo(targetStatus) ? "opacity-50 cursor-not-allowed" : ""}
            >
              {targetStatus}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // 2. Alterar renderCommentIcon para alinhar ícones centralizados
  const renderCommentIcon = (fieldId: string) => {
    if (status !== "Revisão") return null;
    const comentariosDoCampo = comentarios[fieldId] || [];
    const isAtencao = camposAtencao[fieldId];
    const hasComentario = comentariosDoCampo.length > 0;
    return (
      <div className="flex items-center gap-2 justify-start mt-1 mb-1">
        <button
          type="button"
          className={`flex items-center justify-center p-1 border-0 bg-transparent text-amber-500 mr-1 rounded-full transition-colors duration-150 hover:bg-amber-100 hover:text-amber-600${isAtencao ? ' bg-amber-100' : ''}`}
          onClick={() => setCamposAtencao(prev => ({ ...prev, [fieldId]: !prev[fieldId] }))}
          title="Destacar campo"
        >
          <AlertTriangle className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={`flex items-center justify-center rounded-full p-1 text-blue-500 hover:text-blue-600 transition-colors duration-150 border border-transparent ${hasComentario ? 'bg-blue-100' : ''} ${!hasComentario ? 'hover:bg-blue-100' : ''}`}
          onClick={() => {
            if (!novoComentario[fieldId]) {
              setNovoComentario(prev => ({ ...prev, [fieldId]: "" }));
            }
          }}
          title="Adicionar comentário"
        >
          <MessageSquare className="h-4 w-4" />
        </button>
      </div>
    );
  };

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
        {/* Alerta de Revisão */}
        {status === "Revisão" && (
          <Alert className="bg-amber-50 border-amber-200 text-gray-800">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle>Modo de Revisão</AlertTitle>
            <AlertDescription>
              Este formulário está em modo de revisão. Use os ícones de mensagem para adicionar comentários em cada campo.
            </AlertDescription>
          </Alert>
        )}

        {/* Alerta de Rejeitado */}
        {status === "Rejeitado" && (
          <Alert className="bg-red-50 border-red-200 text-gray-800">
            <Ban className="h-4 w-4 text-red-600" />
            <AlertTitle>Queixa Técnica Rejeitada</AlertTitle>
            <AlertDescription>
              Esta queixa técnica foi rejeitada. Verifique os comentários para entender os motivos da rejeição.
            </AlertDescription>
          </Alert>
        )}

        {status === "Qualidade" && (
          <Alert className="bg-teal-50 border-teal-200 text-gray-800">
            <FileCheck className="h-5 w-5 text-teal-600" />
            <AlertTitle>Você está realizando a análise de qualidade desta queixa técnica.</AlertTitle>
            <AlertDescription>
              Avalie a criticidade, defina o prazo e o responsável pela resolução.
            </AlertDescription>
          </Alert>
        )}

        
        

        <div className="flex flex-col gap-1">
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
          {/* Número da queixa técnica */}
          <div className="mt-6 flex items-center gap-3">
            <Badge className="bg-[#26B99D] text-white text-base px-4 py-1 rounded font-bold shadow">QT-2024-0001</Badge>
            <div className="flex items-center gap-2">
              {renderStatusBadge()}
              {renderStatusActions()}
            </div>
          </div>
        </div>
          {/* RESUMO DO FORMULÁRIO PARA QUALIDADE */}
          {status === "Qualidade" && (
            <>
              <ResumoFormulario
                formData={formData}
                cliente={cliente}
                relatorNome={relatorNome}
                relatorTelefone={relatorTelefone}
                relatorEmail={relatorEmail}
                relatorRelacao={relatorRelacao}
                clienteEhRelator={clienteEhRelator}
                arquivos={arquivos}
              />
              {/* Seção Análise de Qualidade */}
              <Card className="mb-8 border border-gray-200 shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <CardTitle className="text-xl text-gray-900">Análise de Qualidade</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Número de Protocolo Interno */}
                  <div>
                    <Label className="font-semibold text-gray-700">Número de Protocolo Interno <span className="text-gray-400 font-normal">(opcional)</span></Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        placeholder="Ex: QT-INT-2025-0123"
                        className="w-64"
                      />
                      <Button variant="outline" className="h-10">Gerar Automático</Button>
                    </div>
                    <span className="text-xs text-gray-400">Número de protocolo para uso interno do setor de qualidade</span>
                  </div>
                  {/* Criticidade */}
                  <div>
                    <Label className="font-semibold text-gray-700">Criticidade</Label>
                    <div className="flex gap-3 mt-2 flex-wrap">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="criticidade" className="accent-red-600" />
                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-bold">Alta</span>
                        <span className="text-xs text-gray-700 ml-1">Risco à saúde ou segurança</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="criticidade" className="accent-yellow-500" />
                        <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 text-xs font-bold">Média</span>
                        <span className="text-xs text-gray-700 ml-1">Problema significativo</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="criticidade" className="accent-green-600" />
                        <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-bold">Baixa</span>
                        <span className="text-xs text-gray-700 ml-1">Problema menor</span>
                      </label>
                    </div>
                  </div>
                  {/* Tipo de Problema */}
                  <div>
                    <Label className="font-semibold text-gray-700">Tipo de Problema</Label>
                    <Select>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Problema no produto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="produto">Problema no produto</SelectItem>
                        <SelectItem value="processo">Problema no processo</SelectItem>
                        <SelectItem value="documentacao">Problema de documentação</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Necessita de análise laboratorial? */}
                  <div className="flex flex-col md:flex-row gap-6">
                    <div>
                      <Label className="font-semibold text-gray-700">Necessita de análise laboratorial?</Label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" name="analiseLab" className="accent-green-600" />
                          <span>Sim</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" name="analiseLab" className="accent-green-600" />
                          <span>Não</span>
                        </label>
                      </div>
                    </div>
                    {/* Necessita de amostra adicional? */}
                    <div>
                      <Label className="font-semibold text-gray-700">Necessita de amostra adicional?</Label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" name="amostraAdicional" className="accent-green-600" />
                          <span>Sim</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" name="amostraAdicional" className="accent-green-600" />
                          <span>Não</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  {/* Prazo para Resolução e Responsável */}
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <Label className="font-semibold text-gray-700">Prazo para Resolução</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input type="date" className="w-48" />
                        <span className="text-xs text-gray-400">Tempo estimado: 7 dias</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <Label className="font-semibold text-gray-700">Responsável pela Análise</Label>
                      <Select>
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Ana Paula (Controle de Qualidade)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ana">Ana Paula (Controle de Qualidade)</SelectItem>
                          <SelectItem value="joao">João Silva (Controle de Qualidade)</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* Observações e Recomendações */}
                  <div>
                    <Label className="font-semibold text-gray-700">Observações e Recomendações</Label>
                    <Textarea
                      placeholder="Adicione observações e recomendações para a análise desta queixa..."
                      className="mt-1 min-h-[80px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

        {/* NOVA SEÇÃO: Informações do Relator */}
        {status !== 'Qualidade' && (
        <Card>
          <CardHeader className="bg-gray-50 border-b">
                  <div className="flex items-center gap-2">
              <Speech className="h-7 w-7 text-teal-600" />
              <span className="text-xl font-bold">Informações do Relator</span>
                  </div>
                </CardHeader>
          <CardContent className="p-4">
            <div className="mb-6">
              <Label className="font-medium">Cliente é o Relator?</Label>
              <div className="flex gap-6 mt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="relator-sim"
                    name="clienteEhRelator"
                    value="sim"
                    checked={clienteEhRelator === "sim"}
                    onChange={() => setClienteEhRelator("sim")}
                    className="accent-teal-600 h-4 w-4"
                  />
                  <Label htmlFor="relator-sim">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="relator-nao"
                    name="clienteEhRelator"
                    value="nao"
                    checked={clienteEhRelator === "nao"}
                    onChange={() => setClienteEhRelator("nao")}
                    className="accent-teal-600 h-4 w-4"
                  />
                  <Label htmlFor="relator-nao">Não</Label>
                </div>
              </div>
            </div>
            {clienteEhRelator === "nao" && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-teal-50/60 border border-teal-100 rounded-lg p-5">
                <div className="space-y-2">
                  <Label htmlFor="relator-nome">Nome <span className="text-red-500">*</span></Label>
                      <Input
                    id="relator-nome"
                    placeholder="Digite nome do Relator"
                    value={relatorNome}
                    onChange={e => setRelatorNome(e.target.value)}
                    required
                    className="h-11"
                  />
                    </div>
                <div className="space-y-2">
                  <Label htmlFor="relator-telefone">Telefone</Label>
                  <Input
                    id="relator-telefone"
                    placeholder="(00) 00000-0000"
                    value={relatorTelefone}
                    onChange={e => setRelatorTelefone(e.target.value)}
                    className="h-11"
                  />
                  </div>
                <div className="space-y-2">
                  <Label htmlFor="relator-email">E-mail</Label>
                  <Input
                    id="relator-email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={relatorEmail}
                    onChange={e => setRelatorEmail(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relator-relacao">Relação com o Cliente</Label>
                  <Input
                    id="relator-relacao"
                    placeholder="Relação do Relator com o Cliente"
                    value={relatorRelacao}
                    onChange={e => setRelatorRelacao(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        )}

        {/* Informações do Cliente */}
        {status !== 'Qualidade' && (
        <Card>
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#15937E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-3.33 0-10 1.67-10 5v1a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-1c0-3.33-6.67-5-10-5Z" />
                </svg>
                <span className="text-xl font-bold">Informações do Cliente</span>
              </div>
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
              <div className="space-y-6">
                <div className="flex items-center gap-4 justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-[#26B99D] text-white text-xs px-2 py-0.5 font-semibold">ID:{cliente.id}</span>
                        <span className="font-bold text-lg text-gray-900">{cliente.nome}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="rounded-md border border-black text-black text-xs px-2 py-0.5 font-semibold bg-transparent">{cliente.tipo}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-[#26B99D] hover:bg-[#1E9A82] text-white font-semibold px-6"
                    onClick={() => setCliente(null)}
                  >
                    Remover
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-3 text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#26B99D] mt-1">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                  <div>
                        <span className="font-medium text-gray-500 text-sm">Telefone</span>
                        <p className="text-gray-900">{cliente.telefone}</p>
                    </div>
                  </div>
                    <div className="flex items-start gap-3 text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#26B99D] mt-1">
                        <rect width="20" height="16" x="2" y="4" rx="2"/>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                  <div>
                        <span className="font-medium text-gray-500 text-sm">Email</span>
                        <p className="text-gray-900">{cliente.email}</p>
                  </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-start gap-3 text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#26B99D] mt-1">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    <div>
                        <span className="font-medium text-gray-500 text-sm">Documento</span>
                        <p className="text-gray-900">{cliente.documento}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#26B99D] mt-1">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    <div>
                        <span className="font-medium text-gray-500 text-sm">Endereço</span>
                        <p className="text-gray-900">{cliente.endereco}</p>
                      </div>
                    </div>
                  </div>
                      </div>

                {/* Protocolos do cliente */}
                {PROTOCOLOS_MOCK[cliente.id] && PROTOCOLOS_MOCK[cliente.id].length > 0 && (
                  <div className="bg-gray-50 border rounded-lg p-4 mt-6">
                    <div className="font-semibold mb-2 text-gray-800">Protocolos do cliente</div>
                    {protocoloVinculado ? (
                      <div className="flex flex-wrap gap-3">
                        <div className="relative px-4 py-2 rounded-md border border-[#26B99D] bg-[#e6faf7] flex flex-col items-start min-w-[200px] shadow-sm">
                          <button
                            type="button"
                            className="absolute top-2 right-2 p-1 rounded hover:bg-red-100 text-red-700"
                            onClick={() => {
                              setProtocoloVinculado(null)
                              setProtocoloSelecionado(null)
                            }}
                            aria-label="Desvincular protocolo"
                          >
                            <X size={16} />
                          </button>
                          <span className="font-bold text-base text-[#26B99D] tracking-wide mb-1">{protocoloVinculado.id}</span>
                          <span className="text-xs text-gray-500 mb-1">{protocoloVinculado.data}</span>
                          <span className="text-sm text-gray-900 mb-0.5 flex items-center gap-1"><Pill className="h-4 w-4 text-[#26B99D]" />{protocoloVinculado.produto}</span>
                          <div className="flex flex-wrap gap-2 mt-2 items-center">
                            {protocoloVinculado.motivo && (
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">{protocoloVinculado.motivo}</span>
                            )}
                            {protocoloVinculado.motivo && protocoloVinculado.subcategoria && (
                              <span className="font-bold text-[#D3D7DD]">&gt;</span>
                            )}
                            {protocoloVinculado.subcategoria && (
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">{protocoloVinculado.subcategoria}</span>
                            )}
                            {protocoloVinculado.subcategoria && protocoloVinculado.detalhe && (
                              <span className="font-bold text-[#D3D7DD]">&gt;</span>
                            )}
                            {protocoloVinculado.detalhe && (
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">{protocoloVinculado.detalhe}</span>
                            )}
                    </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap gap-3">
                          {PROTOCOLOS_MOCK[cliente.id].map((protocolo: Protocolo) => (
                            <button
                              key={protocolo.id}
                              type="button"
                              className={`px-4 py-2 rounded-md border flex flex-col items-start min-w-[200px] transition-colors shadow-sm
                                ${protocoloSelecionado && protocoloSelecionado.id === protocolo.id ? 'border-[#26B99D] bg-[#e6faf7]' : 'border-gray-200 bg-white hover:border-[#26B99D]'}
                              `}
                              onClick={() => setProtocoloSelecionado(protocolo)}
                            >
                              <span className="font-bold text-base text-[#26B99D] tracking-wide mb-1">{protocolo.id}</span>
                              <span className="text-xs text-gray-500 mb-1">{protocolo.data}</span>
                              <span className="text-sm text-gray-900 mb-0.5 flex items-center gap-1"><Pill className="h-4 w-4 text-[#26B99D]" />{protocolo.produto}</span>
                              <div className="flex flex-wrap gap-2 mt-2 items-center">
                                {protocolo.motivo && (
                                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">{protocolo.motivo}</span>
                                )}
                                {protocolo.motivo && protocolo.subcategoria && (
                                  <span className="font-bold text-[#D3D7DD]">&gt;</span>
                                )}
                                {protocolo.subcategoria && (
                                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">{protocolo.subcategoria}</span>
                                )}
                                {protocolo.subcategoria && protocolo.detalhe && (
                                  <span className="font-bold text-[#D3D7DD]">&gt;</span>
                                )}
                                {protocolo.detalhe && (
                                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">{protocolo.detalhe}</span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                        {protocoloSelecionado && (
                          <button
                            type="button"
                            className="mt-4 px-4 py-2 rounded bg-[#26B99D] text-white text-sm font-semibold hover:bg-[#15937E] transition"
                            onClick={() => setProtocoloVinculado(protocoloSelecionado)}
                          >
                            Vincular
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar por nome, CPF, telefone ou email"
                      className="pl-8 h-11"
                      value={clienteSearchQuery}
                      onChange={(e) => {
                        setClienteSearchQuery(e.target.value)
                        setShowResults(true)
                      }}
                    />
                  {showResults && filteredClientes.length > 0 && (
                      <div className="absolute z-50 w-full left-0 mt-1 bg-white border rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
                      {filteredClientes.map((cliente) => (
                        <button
                          key={cliente.id}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b last:border-b-0"
                          onClick={() => {
                            setCliente(cliente)
                            setClienteSearchQuery("")
                            setShowResults(false)
                          }}
                        >
                          <div className="font-medium text-gray-900">{cliente.nome}</div>
                          <div className="text-sm text-gray-500">
                            {cliente.documento} • {cliente.telefone}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  </div>
                </div>
                {nomeSemRegistro && (
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
                )}
                {clienteId === "novo" && (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertTitle>Novo cliente</AlertTitle>
                <AlertDescription>Um novo cliente será cadastrado ao salvar esta queixa técnica.</AlertDescription>
              </Alert>
                )}
                {!clienteId && !nomeSemRegistro && (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle>Cliente não identificado</AlertTitle>
                <AlertDescription>
                  Nenhuma informação de cliente foi fornecida para esta queixa técnica.
                </AlertDescription>
              </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        )}

        {/* Formulário de Queixa Técnica */}
        {status !== 'Qualidade' && (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-6">
                <Pill className="h-5 w-5 text-primary" />
                <CardTitle>Informações do Produto</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 p-6">
              {/* Informações do Produto */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="produto" className="flex items-center gap-2 text-base font-medium">
                        <Pill className="h-4 w-4 text-[#26B99D]" />
                        Produto <span className="text-red-500">*</span>
                      </Label>
                      {renderCommentIcon("produto")}
                    </div>
                    <div className="relative">
                      <Input
                        id="produto"
                        name="produto"
                        placeholder="Produto"
                        value={formData.produto}
                        onChange={handleInputChange}
                        required
                        className={`h-12 border-gray-200 pr-10 text-base bg-[#F9FAFB] transition-all duration-200 ${camposAtencao['produto'] ? 'border-2 border-red-500 ring-2 ring-red-300 bg-red-50 shadow-[0_0_0_2px_rgba(239,68,68,0.15)]' : ''}`}
                        readOnly
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-400">
                        <Lock className="h-4 w-4" />
                      </div>
                    </div>
                    {/* Input de comentário alinhado */}
                    {novoComentario['produto'] !== undefined && (
                      <div className="w-full mt-2">
                        <div className="relative w-full">
                          <Input
                            placeholder="Digite seu comentário..."
                            value={novoComentario['produto']}
                            onChange={(e) => setNovoComentario(prev => ({ ...prev, ['produto']: e.target.value }))}
                            className="h-12 text-base w-full pr-20 overflow-x-hidden"
                            onKeyDown={e => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (novoComentario['produto'].trim()) {
                                  const novoComentarioObj = {
                                    id: Math.random().toString(36).substr(2, 9),
                                    texto: novoComentario['produto'],
                                    usuario: "Usuário Atual",
                                    data: new Date().toLocaleString(),
                                  };
                                  setComentarios(prev => ({
                                    ...prev,
                                    ['produto']: [...(prev['produto'] || []), novoComentarioObj]
                                  }));
                                  setNovoComentario(prev => {
                                    const newState = { ...prev };
                                    delete newState['produto'];
                                    return newState;
                                  });
                                }
                              }
                            }}
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-600"
                              onClick={() => {
                                setNovoComentario(prev => {
                                  const newState = { ...prev };
                                  delete newState['produto'];
                                  return newState;
                                });
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-[#26B99D] hover:text-[#15937E]"
                              onClick={() => {
                                if (novoComentario['produto'].trim()) {
                                  const novoComentarioObj = {
                                    id: Math.random().toString(36).substr(2, 9),
                                    texto: novoComentario['produto'],
                                    usuario: "Usuário Atual",
                                    data: new Date().toLocaleString(),
                                  };
                                  setComentarios(prev => ({
                                    ...prev,
                                    ['produto']: [...(prev['produto'] || []), novoComentarioObj]
                                  }));
                                  setNovoComentario(prev => {
                                    const newState = { ...prev };
                                    delete newState['produto'];
                                    return newState;
                                  });
                                }
                              }}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Lista de comentários salvos */}
                    {comentarios['produto'] && comentarios['produto'].length > 0 && (
                      <div className="space-y-2 mt-2">
                        {comentarios['produto'].map(comentario => (
                          <div key={comentario.id} className="bg-amber-50 border border-amber-300 rounded-lg p-3 flex justify-between items-start shadow-sm w-full">
                            {editandoComentario['produto'] === comentario.id ? (
                              <>
                                <div className="flex-1 mr-2">
                                  <Input
                                    value={textoEdicaoComentario[comentario.id] ?? comentario.texto}
                                    onChange={e => setTextoEdicaoComentario(prev => ({ ...prev, [comentario.id]: e.target.value }))}
                                    className="h-10 text-base w-full"
                                    onKeyDown={e => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        setComentarios(prev => ({
                                          ...prev,
                                          ['produto']: prev['produto'].map(c =>
                                            c.id === comentario.id ? { ...c, texto: textoEdicaoComentario[comentario.id] ?? c.texto, data: new Date().toLocaleString() } : c
                                          )
                                        }));
                                        setEditandoComentario(prev => { const n = { ...prev }; delete n['produto']; return n; });
                                        setTextoEdicaoComentario(prev => { const n = { ...prev }; delete n[comentario.id]; return n; });
                                      }
                                    }}
                                  />
                                  <p className="text-xs text-gray-500 mt-1"><span className="font-semibold text-gray-800">{comentario.usuario}</span> • {comentario.data}</p>
                                </div>
                                {status !== 'Rejeitado' && (
                                  <div className="flex gap-1 items-center">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => {
                                        setEditandoComentario(prev => { const n = { ...prev }; delete n['produto']; return n; });
                                        setTextoEdicaoComentario(prev => { const n = { ...prev }; delete n[comentario.id]; return n; });
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-[#26B99D] hover:text-[#15937E]"
                                      onClick={() => {
                                        setComentarios(prev => ({
                                          ...prev,
                                          ['produto']: prev['produto'].map(c =>
                                            c.id === comentario.id ? { ...c, texto: textoEdicaoComentario[comentario.id] ?? c.texto, data: new Date().toLocaleString() } : c
                                          )
                                        }));
                                        setEditandoComentario(prev => { const n = { ...prev }; delete n['produto']; return n; });
                                        setTextoEdicaoComentario(prev => { const n = { ...prev }; delete n[comentario.id]; return n; });
                                      }}
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-900 break-words whitespace-pre-line w-full">{comentario.texto}</p>
                                  <p className="text-xs text-gray-500 mt-1"><span className="font-semibold text-gray-800">{comentario.usuario}</span> • {comentario.data}</p>
                                </div>
                                {status !== 'Rejeitado' && (
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => {
                                        setEditandoComentario(prev => ({ ...prev, ['produto']: comentario.id }));
                                        setTextoEdicaoComentario(prev => ({ ...prev, [comentario.id]: comentario.texto }));
                                      }}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                      onClick={() => {
                                        setComentarios(prev => ({
                                          ...prev,
                                          ['produto']: prev['produto'].filter(c => c.id !== comentario.id)
                                        }));
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="sku" className="flex items-center gap-2 text-base font-medium">
                        <Tag className="h-4 w-4 text-[#26B99D]" />
                        SKU
                      </Label>
                      {renderCommentIcon("sku")}
                    </div>
                    <div className="relative">
                      <Input
                        id="sku"
                        name="sku"
                        placeholder="SKU"
                        value={formData.sku}
                        onChange={handleInputChange}
                        className={`h-12 border-gray-200 pr-10 text-base bg-[#F9FAFB] transition-all duration-200 ${camposAtencao['sku'] ? 'border-2 border-red-500 ring-2 ring-red-300 bg-red-50 shadow-[0_0_0_2px_rgba(239,68,68,0.15)]' : ''}`}
                        readOnly
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-400">
                        <Lock className="h-4 w-4" />
                      </div>
                    </div>
                    {/* Input de comentário SKU */}
                    {novoComentario['sku'] !== undefined && (
                      <div className="w-full mt-2">
                        <div className="relative w-full">
                          <Input
                            placeholder="Digite seu comentário..."
                            value={novoComentario['sku']}
                            onChange={(e) => setNovoComentario(prev => ({ ...prev, ['sku']: e.target.value }))}
                            className="h-12 text-base w-full pr-20 overflow-x-hidden"
                            onKeyDown={e => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (novoComentario['sku'].trim()) {
                                  const novoComentarioObj = {
                                    id: Math.random().toString(36).substr(2, 9),
                                    texto: novoComentario['sku'],
                                    usuario: "Usuário Atual",
                                    data: new Date().toLocaleString(),
                                  };
                                  setComentarios(prev => ({
                                    ...prev,
                                    ['sku']: [...(prev['sku'] || []), novoComentarioObj]
                                  }));
                                  setNovoComentario(prev => {
                                    const newState = { ...prev };
                                    delete newState['sku'];
                                    return newState;
                                  });
                                }
                              }
                            }}
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-600"
                              onClick={() => {
                                setNovoComentario(prev => {
                                  const newState = { ...prev };
                                  delete newState['sku'];
                                  return newState;
                                });
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-[#26B99D] hover:text-[#15937E]"
                              onClick={() => {
                                if (novoComentario['sku'].trim()) {
                                  const novoComentarioObj = {
                                    id: Math.random().toString(36).substr(2, 9),
                                    texto: novoComentario['sku'],
                                    usuario: "Usuário Atual",
                                    data: new Date().toLocaleString(),
                                  };
                                  setComentarios(prev => ({
                                    ...prev,
                                    ['sku']: [...(prev['sku'] || []), novoComentarioObj]
                                  }));
                                  setNovoComentario(prev => {
                                    const newState = { ...prev };
                                    delete newState['sku'];
                                    return newState;
                                  });
                                }
                              }}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Lista de comentários SKU */}
                    {comentarios['sku'] && comentarios['sku'].length > 0 && (
                      <div className="space-y-2 mt-2">
                        {comentarios['sku'].map(comentario => (
                          <div key={comentario.id} className="bg-amber-50 border border-amber-300 rounded-lg p-3 flex justify-between items-start shadow-sm w-full">
                            {editandoComentario['sku'] === comentario.id ? (
                              <>
                                <div className="flex-1 mr-2">
                                  <Input
                                    value={textoEdicaoComentario[comentario.id] ?? comentario.texto}
                                    onChange={e => setTextoEdicaoComentario(prev => ({ ...prev, [comentario.id]: e.target.value }))}
                                    className="h-10 text-base w-full"
                                    onKeyDown={e => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        setComentarios(prev => ({
                                          ...prev,
                                          ['sku']: prev['sku'].map(c =>
                                            c.id === comentario.id ? { ...c, texto: textoEdicaoComentario[comentario.id] ?? c.texto, data: new Date().toLocaleString() } : c
                                          )
                                        }));
                                        setEditandoComentario(prev => { const n = { ...prev }; delete n['sku']; return n; });
                                        setTextoEdicaoComentario(prev => { const n = { ...prev }; delete n[comentario.id]; return n; });
                                      }
                                    }}
                                  />
                                  <p className="text-xs text-gray-500 mt-1"><span className="font-semibold text-gray-800">{comentario.usuario}</span> • {comentario.data}</p>
                                </div>
                                {status !== 'Rejeitado' && (
                                  <div className="flex gap-1 items-center">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => {
                                        setEditandoComentario(prev => { const n = { ...prev }; delete n['sku']; return n; });
                                        setTextoEdicaoComentario(prev => { const n = { ...prev }; delete n[comentario.id]; return n; });
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-[#26B99D] hover:text-[#15937E]"
                                      onClick={() => {
                                        setComentarios(prev => ({
                                          ...prev,
                                          ['sku']: prev['sku'].map(c =>
                                            c.id === comentario.id ? { ...c, texto: textoEdicaoComentario[comentario.id] ?? c.texto, data: new Date().toLocaleString() } : c
                                          )
                                        }));
                                        setEditandoComentario(prev => { const n = { ...prev }; delete n['sku']; return n; });
                                        setTextoEdicaoComentario(prev => { const n = { ...prev }; delete n[comentario.id]; return n; });
                                      }}
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-900 break-words whitespace-pre-line w-full">{comentario.texto}</p>
                                  <p className="text-xs text-gray-500 mt-1"><span className="font-semibold text-gray-800">{comentario.usuario}</span> • {comentario.data}</p>
                                </div>
                                {status !== 'Rejeitado' && (
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => {
                                        setEditandoComentario(prev => ({ ...prev, ['sku']: comentario.id }));
                                        setTextoEdicaoComentario(prev => ({ ...prev, [comentario.id]: comentario.texto }));
                                      }}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                      onClick={() => {
                                        setComentarios(prev => ({
                                          ...prev,
                                          ['sku']: prev['sku'].filter(c => c.id !== comentario.id)
                                        }));
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="ean" className="flex items-center gap-2 text-base font-medium">
                        <Barcode className="h-4 w-4 text-[#26B99D]" />
                        EAN
                      </Label>
                      {renderCommentIcon("ean")}
                    </div>
                    <div className="relative">
                      <Input
                        id="ean"
                        name="ean"
                        placeholder="EAN"
                        value={formData.ean}
                        onChange={handleInputChange}
                        className={`h-12 border-gray-200 pr-10 text-base bg-[#F9FAFB] transition-all duration-200 ${camposAtencao['ean'] ? 'border-2 border-red-500 ring-2 ring-red-300 bg-red-50 shadow-[0_0_0_2px_rgba(239,68,68,0.15)]' : ''}`}
                        readOnly
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-400">
                        <Lock className="h-4 w-4" />
                      </div>
                    </div>
                    {/* Input de comentário EAN */}
                    {novoComentario['ean'] !== undefined && (
                      <div className="w-full mt-2">
                        <div className="relative w-full">
                          <Input
                            placeholder="Digite seu comentário..."
                            value={novoComentario['ean']}
                            onChange={(e) => setNovoComentario(prev => ({ ...prev, ['ean']: e.target.value }))}
                            className="h-12 text-base w-full pr-20 overflow-x-hidden"
                            onKeyDown={e => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (novoComentario['ean'].trim()) {
                                  const novoComentarioObj = {
                                    id: Math.random().toString(36).substr(2, 9),
                                    texto: novoComentario['ean'],
                                    usuario: "Usuário Atual",
                                    data: new Date().toLocaleString(),
                                  };
                                  setComentarios(prev => ({
                                    ...prev,
                                    ['ean']: [...(prev['ean'] || []), novoComentarioObj]
                                  }));
                                  setNovoComentario(prev => {
                                    const newState = { ...prev };
                                    delete newState['ean'];
                                    return newState;
                                  });
                                }
                              }
                            }}
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-600"
                              onClick={() => {
                                setNovoComentario(prev => {
                                  const newState = { ...prev };
                                  delete newState['ean'];
                                  return newState;
                                });
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-[#26B99D] hover:text-[#15937E]"
                              onClick={() => {
                                if (novoComentario['ean'].trim()) {
                                  const novoComentarioObj = {
                                    id: Math.random().toString(36).substr(2, 9),
                                    texto: novoComentario['ean'],
                                    usuario: "Usuário Atual",
                                    data: new Date().toLocaleString(),
                                  };
                                  setComentarios(prev => ({
                                    ...prev,
                                    ['ean']: [...(prev['ean'] || []), novoComentarioObj]
                                  }));
                                  setNovoComentario(prev => {
                                    const newState = { ...prev };
                                    delete newState['ean'];
                                    return newState;
                                  });
                                }
                              }}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Lista de comentários EAN */}
                    {comentarios['ean'] && comentarios['ean'].length > 0 && (
                      <div className="space-y-2 mt-2">
                        {comentarios['ean'].map(comentario => (
                          <div key={comentario.id} className="bg-amber-50 border border-amber-300 rounded-lg p-3 flex justify-between items-start shadow-sm w-full">
                            {editandoComentario['ean'] === comentario.id ? (
                              <>
                                <div className="flex-1 mr-2">
                                  <Input
                                    value={textoEdicaoComentario[comentario.id] ?? comentario.texto}
                                    onChange={e => setTextoEdicaoComentario(prev => ({ ...prev, [comentario.id]: e.target.value }))}
                                    className="h-10 text-base w-full"
                                    onKeyDown={e => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        setComentarios(prev => ({
                                          ...prev,
                                          ['ean']: prev['ean'].map(c =>
                                            c.id === comentario.id ? { ...c, texto: textoEdicaoComentario[comentario.id] ?? c.texto, data: new Date().toLocaleString() } : c
                                          )
                                        }));
                                        setEditandoComentario(prev => { const n = { ...prev }; delete n['ean']; return n; });
                                        setTextoEdicaoComentario(prev => { const n = { ...prev }; delete n[comentario.id]; return n; });
                                      }
                                    }}
                                  />
                                  <p className="text-xs text-gray-500 mt-1"><span className="font-semibold text-gray-800">{comentario.usuario}</span> • {comentario.data}</p>
                                </div>
                                {status !== 'Rejeitado' && (
                                  <div className="flex gap-1 items-center">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => {
                                        setEditandoComentario(prev => { const n = { ...prev }; delete n['ean']; return n; });
                                        setTextoEdicaoComentario(prev => { const n = { ...prev }; delete n[comentario.id]; return n; });
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-[#26B99D] hover:text-[#15937E]"
                                      onClick={() => {
                                        setComentarios(prev => ({
                                          ...prev,
                                          ['ean']: prev['ean'].map(c =>
                                            c.id === comentario.id ? { ...c, texto: textoEdicaoComentario[comentario.id] ?? c.texto, data: new Date().toLocaleString() } : c
                                          )
                                        }));
                                        setEditandoComentario(prev => { const n = { ...prev }; delete n['ean']; return n; });
                                        setTextoEdicaoComentario(prev => { const n = { ...prev }; delete n[comentario.id]; return n; });
                                      }}
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-900 break-words whitespace-pre-line w-full">{comentario.texto}</p>
                                  <p className="text-xs text-gray-500 mt-1"><span className="font-semibold text-gray-800">{comentario.usuario}</span> • {comentario.data}</p>
                                </div>
                                {status !== 'Rejeitado' && (
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => {
                                        setEditandoComentario(prev => ({ ...prev, ['ean']: comentario.id }));
                                        setTextoEdicaoComentario(prev => ({ ...prev, [comentario.id]: comentario.texto }));
                                      }}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                      onClick={() => {
                                        setComentarios(prev => ({
                                          ...prev,
                                          ['ean']: prev['ean'].filter(c => c.id !== comentario.id)
                                        }));
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="dataFabricacao" className="flex items-center gap-2 text-base font-medium">
                        <Calendar className="h-4 w-4 text-[#26B99D]" />
                        Data de Fabricação
                      </Label>
                      {renderCommentIcon("dataFabricacao")}
                    </div>
                    <div className="relative">
                      <Input
                        id="dataFabricacao"
                        name="dataFabricacao"
                        type="date"
                        value={formData.dataFabricacao}
                        onChange={handleInputChange}
                        className={`h-12 border-gray-200 pr-10 text-base bg-[#F9FAFB] transition-all duration-200 ${camposAtencao['dataFabricacao'] ? 'border-2 border-red-500 ring-2 ring-red-300 bg-red-50 shadow-[0_0_0_2px_rgba(239,68,68,0.15)]' : ''}`}
                        readOnly
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-400">
                        <Lock className="h-4 w-4" />
                      </div>
                    </div>
                    {/* Input de comentário Data de Fabricação */}
                    {novoComentario['dataFabricacao'] !== undefined && (
                      <div className="w-full mt-2">
                        <div className="relative w-full">
                          <Input
                            placeholder="Digite seu comentário..."
                            value={novoComentario['dataFabricacao']}
                            onChange={(e) => setNovoComentario(prev => ({ ...prev, ['dataFabricacao']: e.target.value }))}
                            className="h-12 text-base w-full pr-20 overflow-x-hidden"
                            onKeyDown={e => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (novoComentario['dataFabricacao'].trim()) {
                                  const novoComentarioObj = {
                                    id: Math.random().toString(36).substr(2, 9),
                                    texto: novoComentario['dataFabricacao'],
                                    usuario: "Usuário Atual",
                                    data: new Date().toLocaleString(),
                                  };
                                  setComentarios(prev => ({
                                    ...prev,
                                    ['dataFabricacao']: [...(prev['dataFabricacao'] || []), novoComentarioObj]
                                  }));
                                  setNovoComentario(prev => {
                                    const newState = { ...prev };
                                    delete newState['dataFabricacao'];
                                    return newState;
                                  });
                                }
                              }
                            }}
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-600"
                              onClick={() => {
                                setNovoComentario(prev => {
                                  const newState = { ...prev };
                                  delete newState['dataFabricacao'];
                                  return newState;
                                });
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-[#26B99D] hover:text-[#15937E]"
                              onClick={() => {
                                if (novoComentario['dataFabricacao'].trim()) {
                                  const novoComentarioObj = {
                                    id: Math.random().toString(36).substr(2, 9),
                                    texto: novoComentario['dataFabricacao'],
                                    usuario: "Usuário Atual",
                                    data: new Date().toLocaleString(),
                                  };
                                  setComentarios(prev => ({
                                    ...prev,
                                    ['dataFabricacao']: [...(prev['dataFabricacao'] || []), novoComentarioObj]
                                  }));
                                  setNovoComentario(prev => {
                                    const newState = { ...prev };
                                    delete newState['dataFabricacao'];
                                    return newState;
                                  });
                                }
                              }}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Lista de comentários Data de Fabricação */}
                    {comentarios['dataFabricacao'] && comentarios['dataFabricacao'].length > 0 && (
                      <div className="space-y-2 mt-2">
                        {comentarios['dataFabricacao'].map(comentario => (
                          <div key={comentario.id} className="bg-amber-50 border border-amber-300 rounded-lg p-3 flex justify-between items-start shadow-sm w-full">
                            {editandoComentario['dataFabricacao'] === comentario.id ? (
                              <>
                                <div className="flex-1 mr-2">
                                  <Input
                                    value={textoEdicaoComentario[comentario.id] ?? comentario.texto}
                                    onChange={e => setTextoEdicaoComentario(prev => ({ ...prev, [comentario.id]: e.target.value }))}
                                    className="h-10 text-base w-full"
                                    onKeyDown={e => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        setComentarios(prev => ({
                                          ...prev,
                                          ['dataFabricacao']: prev['dataFabricacao'].map(c =>
                                            c.id === comentario.id ? { ...c, texto: textoEdicaoComentario[comentario.id] ?? c.texto, data: new Date().toLocaleString() } : c
                                          )
                                        }));
                                        setEditandoComentario(prev => { const n = { ...prev }; delete n['dataFabricacao']; return n; });
                                        setTextoEdicaoComentario(prev => { const n = { ...prev }; delete n[comentario.id]; return n; });
                                      }
                                    }}
                                  />
                                  <p className="text-xs text-gray-500 mt-1"><span className="font-semibold text-gray-800">{comentario.usuario}</span> • {comentario.data}</p>
                                </div>
                                {status !== 'Rejeitado' && (
                                  <div className="flex gap-1 items-center">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => {
                                        setEditandoComentario(prev => { const n = { ...prev }; delete n['dataFabricacao']; return n; });
                                        setTextoEdicaoComentario(prev => { const n = { ...prev }; delete n[comentario.id]; return n; });
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-[#26B99D] hover:text-[#15937E]"
                                      onClick={() => {
                                        setComentarios(prev => ({
                                          ...prev,
                                          ['dataFabricacao']: prev['dataFabricacao'].map(c =>
                                            c.id === comentario.id ? { ...c, texto: textoEdicaoComentario[comentario.id] ?? c.texto, data: new Date().toLocaleString() } : c
                                          )
                                        }));
                                        setEditandoComentario(prev => { const n = { ...prev }; delete n['dataFabricacao']; return n; });
                                        setTextoEdicaoComentario(prev => { const n = { ...prev }; delete n[comentario.id]; return n; });
                                      }}
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-900 break-words whitespace-pre-line w-full">{comentario.texto}</p>
                                  <p className="text-xs text-gray-500 mt-1"><span className="font-semibold text-gray-800">{comentario.usuario}</span> • {comentario.data}</p>
                                </div>
                                {status !== 'Rejeitado' && (
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => {
                                        setEditandoComentario(prev => ({ ...prev, ['dataFabricacao']: comentario.id }));
                                        setTextoEdicaoComentario(prev => ({ ...prev, [comentario.id]: comentario.texto }));
                                      }}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                      onClick={() => {
                                        setComentarios(prev => ({
                                          ...prev,
                                          ['dataFabricacao']: prev['dataFabricacao'].filter(c => c.id !== comentario.id)
                                        }));
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="dataValidade" className="flex items-center gap-2 text-base font-medium">
                        <CalendarCheck className="h-4 w-4 text-[#26B99D]" />
                        Data de Validade
                      </Label>
                      {renderCommentIcon("dataValidade")}
                    </div>
                    <div className="relative">
                      <Input
                        id="dataValidade"
                        name="dataValidade"
                        type="date"
                        value={formData.dataValidade}
                        onChange={handleInputChange}
                        className={`h-12 border-gray-200 pr-10 text-base bg-[#F9FAFB] transition-all duration-200 ${camposAtencao['dataValidade'] ? 'border-2 border-red-500 ring-2 ring-red-300 bg-red-50 shadow-[0_0_0_2px_rgba(239,68,68,0.15)]' : ''}`}
                        readOnly
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-400">
                        <Lock className="h-4 w-4" />
                      </div>
                    </div>
                    {/* Input de comentário Data de Validade */}
                    {novoComentario['dataValidade'] !== undefined && (
                      <div className="w-full mt-2">
                        <div className="relative w-full">
                          <Input
                            placeholder="Digite seu comentário..."
                            value={novoComentario['dataValidade']}
                            onChange={(e) => setNovoComentario(prev => ({ ...prev, ['dataValidade']: e.target.value }))}
                            className="h-12 text-base w-full pr-20 overflow-x-hidden"
                            onKeyDown={e => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (novoComentario['dataValidade'].trim()) {
                                  const novoComentarioObj = {
                                    id: Math.random().toString(36).substr(2, 9),
                                    texto: novoComentario['dataValidade'],
                                    usuario: "Usuário Atual",
                                    data: new Date().toLocaleString(),
                                  };
                                  setComentarios(prev => ({
                                    ...prev,
                                    ['dataValidade']: [...(prev['dataValidade'] || []), novoComentarioObj]
                                  }));
                                  setNovoComentario(prev => {
                                    const newState = { ...prev };
                                    delete newState['dataValidade'];
                                    return newState;
                                  });
                                }
                              }
                            }}
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-600"
                              onClick={() => {
                                setNovoComentario(prev => {
                                  const newState = { ...prev };
                                  delete newState['dataValidade'];
                                  return newState;
                                });
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-[#26B99D] hover:text-[#15937E]"
                              onClick={() => {
                                if (novoComentario['dataValidade'].trim()) {
                                  const novoComentarioObj = {
                                    id: Math.random().toString(36).substr(2, 9),
                                    texto: novoComentario['dataValidade'],
                                    usuario: "Usuário Atual",
                                    data: new Date().toLocaleString(),
                                  };
                                  setComentarios(prev => ({
                                    ...prev,
                                    ['dataValidade']: [...(prev['dataValidade'] || []), novoComentarioObj]
                                  }));
                                  setNovoComentario(prev => {
                                    const newState = { ...prev };
                                    delete newState['dataValidade'];
                                    return newState;
                                  });
                                }
                              }}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Lista de comentários Data de Validade */}
                    {comentarios['dataValidade'] && comentarios['dataValidade'].length > 0 && (
                      <div className="space-y-2 mt-2">
                        {comentarios['dataValidade'].map(comentario => (
                          <div key={comentario.id} className="bg-amber-50 border border-amber-300 rounded-lg p-3 flex justify-between items-start shadow-sm w-full">
                            {editandoComentario['dataValidade'] === comentario.id ? (
                              <>
                                <div className="flex-1 mr-2">
                                  <Input
                                    value={textoEdicaoComentario[comentario.id] ?? comentario.texto}
                                    onChange={e => setTextoEdicaoComentario(prev => ({ ...prev, [comentario.id]: e.target.value }))}
                                    className="h-10 text-base w-full"
                                    onKeyDown={e => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        setComentarios(prev => ({
                                          ...prev,
                                          ['dataValidade']: prev['dataValidade'].map(c =>
                                            c.id === comentario.id ? { ...c, texto: textoEdicaoComentario[comentario.id] ?? c.texto, data: new Date().toLocaleString() } : c
                                          )
                                        }));
                                        setEditandoComentario(prev => { const n = { ...prev }; delete n['dataValidade']; return n; });
                                        setTextoEdicaoComentario(prev => { const n = { ...prev }; delete n[comentario.id]; return n; });
                                      }
                                    }}
                                  />
                                  <p className="text-xs text-gray-500 mt-1"><span className="font-semibold text-gray-800">{comentario.usuario}</span> • {comentario.data}</p>
                                </div>
                                {status !== 'Rejeitado' && (
                                  <div className="flex gap-1 items-center">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => {
                                        setEditandoComentario(prev => { const n = { ...prev }; delete n['dataValidade']; return n; });
                                        setTextoEdicaoComentario(prev => { const n = { ...prev }; delete n[comentario.id]; return n; });
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-[#26B99D] hover:text-[#15937E]"
                                      onClick={() => {
                                        setComentarios(prev => ({
                                          ...prev,
                                          ['dataValidade']: prev['dataValidade'].map(c =>
                                            c.id === comentario.id ? { ...c, texto: textoEdicaoComentario[comentario.id] ?? c.texto, data: new Date().toLocaleString() } : c
                                          )
                                        }));
                                        setEditandoComentario(prev => { const n = { ...prev }; delete n['dataValidade']; return n; });
                                        setTextoEdicaoComentario(prev => { const n = { ...prev }; delete n[comentario.id]; return n; });
                                      }}
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-900 break-words whitespace-pre-line w-full">{comentario.texto}</p>
                                  <p className="text-xs text-gray-500 mt-1"><span className="font-semibold text-gray-800">{comentario.usuario}</span> • {comentario.data}</p>
                                </div>
                                {status !== 'Rejeitado' && (
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => {
                                        setEditandoComentario(prev => ({ ...prev, ['dataValidade']: comentario.id }));
                                        setTextoEdicaoComentario(prev => ({ ...prev, [comentario.id]: comentario.texto }));
                                      }}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                      onClick={() => {
                                        setComentarios(prev => ({
                                          ...prev,
                                          ['dataValidade']: prev['dataValidade'].filter(c => c.id !== comentario.id)
                                        }));
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Detalhes da Queixa */}
              <Card>
                <CardHeader className="px-6">
                  <div className="flex items-center gap-2 mb-6">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    <CardTitle>Detalhes da Queixa</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8 p-6">
                  {/* Fluxo Motivo Principal, Subcategoria e Detalhe igual ao modal Novo Contato */}
                  <div className="space-y-4 bg-white p-5 rounded-lg border border-gray-100 shadow-sm mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Motivo, Subcategoria e Detalhe</h3>
                    {/* Barra de Progresso */}
                    <div className="space-y-2">
                      <div className="flex justify-end">
                        <span className="font-medium text-teal-600">
                          {[formData.motivoPrincipal, formData.subcategoria, formData.detalhe].filter(Boolean).length}/3
                        </span>
                      </div>
                      <div className="relative">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-teal-600 transition-all duration-300"
                            style={{ 
                              width: `${([formData.motivoPrincipal, formData.subcategoria, formData.detalhe].filter(Boolean).length / 3) * 100}%` 
                            }}
                          />
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center pointer-events-none">
                          {[1, 2, 3].map((step) => (
                            <div
                              key={step}
                              className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 ${
                                step <= [formData.motivoPrincipal, formData.subcategoria, formData.detalhe].filter(Boolean).length
                                  ? 'bg-teal-600 border-teal-600'
                                  : 'bg-white border-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Motivo Principal */}
                    {!formData.motivoPrincipal && (
                      <div className="space-y-2">
                        <Label className="font-medium">Motivo Principal</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between h-11"
                            >
                              <div className="flex items-center gap-2">
                                <ClipboardList className="h-4 w-4 text-teal-600" />
                                <span>Selecione o motivo principal</span>
                              </div>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                            <Command>
                              <CommandInput placeholder="Buscar motivo..." />
                              <CommandEmpty>Nenhum motivo encontrado.</CommandEmpty>
                              <CommandGroup>
                                <CommandItem value="Qualidade" onSelect={() => setFormData(prev => ({ ...prev, motivoPrincipal: "Qualidade", subcategoria: "", detalhe: "" }))}>
                                  <ClipboardList className="mr-2 h-4 w-4" />
                                  Qualidade
                                </CommandItem>
                                <CommandItem value="Embalagem" onSelect={() => setFormData(prev => ({ ...prev, motivoPrincipal: "Embalagem", subcategoria: "", detalhe: "" }))}>
                                  <ClipboardList className="mr-2 h-4 w-4" />
                                  Embalagem
                                </CommandItem>
                                <CommandItem value="Vencimento" onSelect={() => setFormData(prev => ({ ...prev, motivoPrincipal: "Vencimento", subcategoria: "", detalhe: "" }))}>
                                  <ClipboardList className="mr-2 h-4 w-4" />
                                  Vencimento
                                </CommandItem>
                                <CommandItem value="Outro" onSelect={() => setFormData(prev => ({ ...prev, motivoPrincipal: "Outro", subcategoria: "", detalhe: "" }))}>
                                  <ClipboardList className="mr-2 h-4 w-4" />
                                  Outro
                                </CommandItem>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}

                    {/* Subcategoria */}
                    {formData.motivoPrincipal && !formData.subcategoria && (
                      <div className="space-y-2">
                        <Label className="font-medium">Subcategoria</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between h-11"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-teal-600" />
                                <span>Selecione a subcategoria</span>
                              </div>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                            <Command>
                              <CommandInput placeholder="Buscar subcategoria..." />
                              <CommandEmpty>Nenhuma subcategoria encontrada.</CommandEmpty>
                              <CommandGroup>
                                <CommandItem value="Aparência" onSelect={() => setFormData(prev => ({ ...prev, subcategoria: "Aparência", detalhe: "" }))}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Aparência
                                </CommandItem>
                                <CommandItem value="Odor" onSelect={() => setFormData(prev => ({ ...prev, subcategoria: "Odor", detalhe: "" }))}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Odor
                                </CommandItem>
                                <CommandItem value="Integridade" onSelect={() => setFormData(prev => ({ ...prev, subcategoria: "Integridade", detalhe: "" }))}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Integridade
                                </CommandItem>
                                <CommandItem value="Outro" onSelect={() => setFormData(prev => ({ ...prev, subcategoria: "Outro", detalhe: "" }))}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Outro
                                </CommandItem>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}

                    {/* Detalhe */}
                    {formData.motivoPrincipal && formData.subcategoria && !formData.detalhe && (
                      <div className="space-y-2">
                        <Label className="font-medium">Detalhe</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between h-11"
                            >
                              <div className="flex items-center gap-2">
                                <Info className="h-4 w-4 text-teal-600" />
                                <span>Selecione o detalhe</span>
                              </div>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                            <Command>
                              <CommandInput placeholder="Buscar detalhe..." />
                              <CommandEmpty>Nenhum detalhe encontrado.</CommandEmpty>
                              <CommandGroup>
                                <CommandItem value="Risco" onSelect={() => setFormData(prev => ({ ...prev, detalhe: "Risco" }))}>
                                  <Info className="mr-2 h-4 w-4" />
                                  Risco
                                </CommandItem>
                                <CommandItem value="Quebra" onSelect={() => setFormData(prev => ({ ...prev, detalhe: "Quebra" }))}>
                                  <Info className="mr-2 h-4 w-4" />
                                  Quebra
                                </CommandItem>
                                <CommandItem value="Falta" onSelect={() => setFormData(prev => ({ ...prev, detalhe: "Falta" }))}>
                                  <Info className="mr-2 h-4 w-4" />
                                  Falta
                                </CommandItem>
                                <CommandItem value="Outro" onSelect={() => setFormData(prev => ({ ...prev, detalhe: "Outro" }))}>
                                  <Info className="mr-2 h-4 w-4" />
                                  Outro
                                </CommandItem>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}

                    {/* Cards-resumo dos passos escolhidos */}
                    {(formData.motivoPrincipal || formData.subcategoria || formData.detalhe) && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {formData.motivoPrincipal && (
                          <Card className="border-teal-100 bg-teal-50/50">
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="h-8 w-8 rounded-full bg-teal-100 flex-shrink-0 flex items-center justify-center">
                                    <ClipboardList className="h-4 w-4 text-teal-600" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs text-gray-500 truncate">Motivo Principal</p>
                                    <h4 className="font-medium text-teal-900 truncate">{formData.motivoPrincipal}</h4>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 flex-shrink-0 text-teal-600 hover:text-teal-700 hover:bg-teal-100"
                                  onClick={() => setFormData(prev => ({ ...prev, motivoPrincipal: '', subcategoria: '', detalhe: '' }))}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                        {formData.subcategoria && (
                          <Card className="border-teal-100 bg-teal-50/50">
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="h-8 w-8 rounded-full bg-teal-100 flex-shrink-0 flex items-center justify-center">
                                    <FileText className="h-4 w-4 text-teal-600" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs text-gray-500 truncate">Subcategoria</p>
                                    <h4 className="font-medium text-teal-900 truncate">{formData.subcategoria}</h4>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 flex-shrink-0 text-teal-600 hover:text-teal-700 hover:bg-teal-100"
                                  onClick={() => setFormData(prev => ({ ...prev, subcategoria: '', detalhe: '' }))}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                        {formData.detalhe && (
                          <Card className="border-teal-100 bg-teal-50/50">
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="h-8 w-8 rounded-full bg-teal-100 flex-shrink-0 flex items-center justify-center">
                                    <Info className="h-4 w-4 text-teal-600" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs text-gray-500 truncate">Detalhe</p>
                                    <h4 className="font-medium text-teal-900 truncate">{formData.detalhe}</h4>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 flex-shrink-0 text-teal-600 hover:text-teal-700 hover:bg-teal-100"
                                  onClick={() => setFormData(prev => ({ ...prev, detalhe: '' }))}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Fim dos selects */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="quantidadeComprada" className="text-base font-medium">Quantidade Comprada</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-gray-600">Quantidade de caixas</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Input
                          id="quantidadeComprada"
                          name="quantidadeComprada"
                          type="number"
                          placeholder="Quantidade de caixas"
                          value={formData.quantidadeComprada}
                          onChange={handleInputChange}
                          className="h-12 text-base"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="quantidadeDesvio" className="text-base font-medium">Quantidade com desvio de Qualidade</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-gray-600">Quantas unidades apresentaram desvio de qualidade</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Input
                          id="quantidadeDesvio"
                          name="quantidadeDesvio"
                          type="number"
                          placeholder="Quantidade de unidades"
                          value={formData.quantidadeDesvio}
                          onChange={handleInputChange}
                          className="h-12 text-base"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="localCompra" className="text-base font-medium">Local de Compra</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-gray-600">Local onde o cliente comprou o produto, exemplo: Farmácia, farmácia de manipulação, hospital etc</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Input
                          id="localCompra"
                          name="localCompra"
                          placeholder="Local de compra"
                          value={formData.localCompra}
                          onChange={handleInputChange}
                          className="h-12 text-base"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="dataCompra" className="text-base font-medium">Data da Compra</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-gray-600">Data em que o produto foi comprado</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex gap-2 mt-1">
                          <Select
                            value={formData.dataCompraFormato}
                            onValueChange={(value) => handleSelectChange("dataCompraFormato", value)}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Formato" />
                        </SelectTrigger>
                        <SelectContent>
                              <SelectItem value="MM/AA">MM/AA</SelectItem>
                              <SelectItem value="DD/MM/AAAA">DD/MM/AAAA</SelectItem>
                        </SelectContent>
                      </Select>
                          <Input
                            id="dataCompra"
                            name="dataCompra"
                            type={formData.dataCompraFormato === "MM/AA" ? "month" : "date"}
                            value={formData.dataCompra}
                            onChange={handleInputChange}
                            className="flex-1 h-12 text-base"
                          />
                    </div>
                  </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="dataAbertura" className="text-base font-medium">Data de abertura da caixa</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-gray-600">Data que o cliente abriu a caixa do produto</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                      </div>
                        <div className="flex gap-2 mt-1">
                          <Select
                            value={formData.dataAberturaFormato}
                            onValueChange={(value) => handleSelectChange("dataAberturaFormato", value)}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Formato" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MM/AA">MM/AA</SelectItem>
                              <SelectItem value="DD/MM/AAAA">DD/MM/AAAA</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            id="dataAbertura"
                            name="dataAbertura"
                            type={formData.dataAberturaFormato === "MM/AA" ? "month" : "date"}
                            value={formData.dataAbertura}
                            onChange={handleInputChange}
                            className="flex-1 h-12 text-base"
                          />
                      </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="localArmazenamento" className="text-base font-medium">Local de armazenamento</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-gray-600">Local onde o cliente guarda o produto, exemplo: Armário da sala, Banheiro, cozinha ,etc</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                      </div>
                        <Input
                          id="localArmazenamento"
                          name="localArmazenamento"
                          placeholder="Local de armazenamento"
                          value={formData.localArmazenamento}
                          onChange={handleInputChange}
                          className="h-12 text-base"
                        />
                  </div>

                  <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="modoArmazenamento" className="text-base font-medium">Como armazena o produto</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-gray-600">Modo em quem o cliente armazena o produto, exemplo: Dentro de uma caixa de remédios, dentro da própria embalagem do produto, dentro de um pote de vidro, etc.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Input
                          id="modoArmazenamento"
                          name="modoArmazenamento"
                          placeholder="Modo de armazenamento"
                          value={formData.modoArmazenamento}
                      onChange={handleInputChange}
                          className="h-12 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="caixaLacrada" className="text-base font-medium">A caixa estava lacrada no momento da compra?</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-gray-600">Indique se a caixa estava lacrada quando foi comprada</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                    <RadioGroup
                          value={formData.caixaLacrada}
                          onValueChange={(value) => handleSelectChange("caixaLacrada", value)}
                          className="flex gap-4 mt-4"
                    >
                      <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sim" id="caixaLacrada-sim" />
                            <Label htmlFor="caixaLacrada-sim">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                            <RadioGroupItem value="nao" id="caixaLacrada-nao" />
                            <Label htmlFor="caixaLacrada-nao">Não</Label>
                      </div>
                    </RadioGroup>
                  </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="utilizouProduto" className="text-base font-medium">Utilizou o produto com desvio de qualidade?</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-gray-600">Indique se o produto com desvio foi utilizado</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="space-y-2">
                          <RadioGroup
                            value={formData.utilizouProduto}
                            onValueChange={(value) => handleSelectChange("utilizouProduto", value)}
                            className="flex gap-4 mt-4"
                          >
                      <div className="flex items-center space-x-2">
                              <RadioGroupItem value="sim" id="utilizouProduto-sim" />
                              <Label htmlFor="utilizouProduto-sim">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                              <RadioGroupItem value="nao" id="utilizouProduto-nao" />
                              <Label htmlFor="utilizouProduto-nao">Não</Label>
                      </div>
                          </RadioGroup>
                          {formData.utilizouProduto === "sim" && (
                            <>
                              <Input
                                id="quantidadeUtilizada"
                                name="quantidadeUtilizada"
                                type="number"
                                placeholder="Quantos?"
                                value={formData.quantidadeUtilizada}
                                onChange={handleInputChange}
                                className="mt-2 h-12 text-base"
                              />
                              <div className="space-y-2 mt-4">
                                <div className="flex items-center gap-2">
                                  <Label htmlFor="apresentouSintoma" className="text-base font-medium">Apresentou algum sintoma?</Label>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <HelpCircle className="h-4 w-4 text-gray-400" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-gray-600">Indique se houve algum sintoma após o uso do produto</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                    </div>
                  <div className="space-y-2">
                                  <RadioGroup
                                    value={formData.apresentouSintoma}
                                    onValueChange={(value) => handleSelectChange("apresentouSintoma", value)}
                                    className="flex gap-4 mt-4"
                                  >
                      <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="sim" id="apresentouSintoma-sim" />
                                      <Label htmlFor="apresentouSintoma-sim">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="nao" id="apresentouSintoma-nao" />
                                      <Label htmlFor="apresentouSintoma-nao">Não</Label>
                      </div>
                    </RadioGroup>
                  </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              {/* Evidências */}
              <Card>
                <CardHeader className="px-6">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle>Narrativa</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 p-6 min-h-[340px]">
              <div className="w-full">
                    <ReactQuill
                      id="narrativa"
                      theme="snow"
                      value={formData.narrativa || ''}
                      onChange={value => setFormData(prev => ({ ...prev, narrativa: value }))}
                      placeholder="Descreva detalhadamente a situação, fatos e contexto da queixa técnica..."
                      className="mt-0"
                      style={{ minHeight: 250, height: 250, width: '100%' }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Anexos */}
              <Card>
                <CardHeader className="px-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Upload className="h-5 w-5 text-primary" />
                    <CardTitle>Anexos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <Label className="text-base font-medium">Arquivos</Label>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-center w-full">
                          <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-3 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG, PDF ou DOC (MAX. 10MB)</p>
                  </div>
                            <input
                              id="dropzone-file"
                              type="file"
                              className="hidden"
                              multiple
                              accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                              onChange={handleFileChange}
                            />
                          </label>
                </div>
                  <div className="space-y-2">
                          <div className="text-sm text-gray-500">
                            Arquivos anexados:
              </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {arquivos.map(arquivo => (
                              <div key={arquivo.id} className="flex items-center justify-between p-3 bg-[#e6faf7] rounded-lg border border-[#26B99D] hover:bg-[#d9f7f2] transition-colors shadow-sm">
                                <div className="flex items-center gap-3 min-w-0">
                                  <FileText className="h-5 w-5 text-[#26B99D] flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-600 truncate">{arquivo.nome}</p>
                                    <p className="text-xs text-gray-500">{formatFileSize(arquivo.tamanho)}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  className="p-1 hover:bg-red-100 rounded-full text-red-600 flex-shrink-0 ml-2"
                                  onClick={() => handleRemoveFile(arquivo.id)}
                                  aria-label="Remover arquivo"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                            {arquivos.length === 0 && (
                              <div className="col-span-full">
                                <p className="text-sm text-gray-500 text-center py-4">
                                  Nenhum arquivo anexado
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Qualidade */}
              <Card>
                <CardHeader className="px-6">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <CardTitle>Qualidade</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                  <div>
                      <Label className="text-base font-medium">Solicita laudo de análise?</Label>
                      <RadioGroup
                        value={formData.solicitaLaudo || ''}
                        onValueChange={value => setFormData(prev => ({ ...prev, solicitaLaudo: value }))}
                        className="flex gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sim" id="solicitaLaudo-sim" />
                          <Label htmlFor="solicitaLaudo-sim">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="nao" id="solicitaLaudo-nao" />
                          <Label htmlFor="solicitaLaudo-nao">Não</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  <div className="space-y-2 mt-6">
                    <Label className="text-base font-medium">Farmacovigilância</Label>
                    <RadioGroup
                      value={formData.farmacovigilancia || ''}
                      onValueChange={value => setFormData(prev => ({ ...prev, farmacovigilancia: value }))}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sim" id="farmacovigilancia-sim" />
                        <Label htmlFor="farmacovigilancia-sim">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nao" id="farmacovigilancia-nao" />
                        <Label htmlFor="farmacovigilancia-nao">Não</Label>
                      </div>
                    </RadioGroup>
                    {formData.farmacovigilancia === "sim" && (
                      <div className="space-y-2 mt-2">
                        {(!protocoloVinculado || !protocoloVinculado.farmacovigilancia || protocoloVinculado.farmacovigilancia.length === 0) ? (
                          <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded px-3 py-2 text-sm mb-2">
                            Nenhuma farmacovigilância vinculada ao protocolo.
                          </div>
                        ) : (
                          <div>
                            <div className="flex flex-wrap gap-3">
                              {protocoloVinculado.farmacovigilancia.map(fv => {
                                const isSelected = formData.numeroFarmacovigilancia === fv.id;
                                const isLinked = farmacoVinculada === fv.id;
                                // Se houver um card vinculado, só mostra ele
                                if (farmacoVinculada && !isLinked) return null;
                                return (
                                  <CardFarmacovigilancia
                                    key={fv.id}
                                    fv={fv}
                                    produto={protocoloVinculado.produto}
                                    isSelected={isSelected}
                                    isLinked={isLinked}
                                    onSelect={() => setFormData(prev => ({ ...prev, numeroFarmacovigilancia: fv.id }))}
                                    onUnlink={() => {
                                      setFarmacoVinculada(null);
                                      setFormData(prev => ({ ...prev, numeroFarmacovigilancia: '' }));
                                    }}
                                  />
                                );
                              })}
                    </div>
                            {/* Botão Vincular */}
                            {formData.numeroFarmacovigilancia && !farmacoVinculada && (
                              <button
                                type="button"
                                className="mt-4 px-4 py-2 rounded bg-[#26B99D] text-white text-sm font-semibold hover:bg-[#15937E] transition"
                                onClick={() => setFarmacoVinculada(formData.numeroFarmacovigilancia)}
                              >
                                Vincular
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Separator />

              {/* Seção de Comentários Gerais */}
              {(status === "Revisão" || status === "Rejeitado") && (
                <Card className="border-gray-200 bg-gray-50">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <CardTitle>Comentários Gerais</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {status !== "Rejeitado" && (
                      <>
                        <Textarea
                          placeholder="Adicione seus comentários gerais sobre a queixa técnica..."
                          value={comentarioGeral}
                          onChange={(e) => setComentarioGeral(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <div className="flex justify-end mt-2">
                          <Button
                            type="button"
                            onClick={() => {
                              if (comentarioGeral.trim()) {
                                setComentariosGerais(prev => [
                                  ...prev,
                                  {
                                    id: Math.random().toString(36).substr(2, 9),
                                    texto: comentarioGeral,
                                    usuario: "Usuário Atual",
                                    data: new Date().toLocaleString(),
                                  }
                                ]);
                                setComentarioGeral("");
                              }
                            }}
                          >
                            Registrar comentário
                          </Button>
                        </div>
            </>
          )}
                    {/* Seção de comentários registrados */}
                    {comentariosGerais.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-base font-semibold mb-2">Comentários</h4>
                        <div className="space-y-2">
                          {comentariosGerais.map(comentario => (
                            <div key={comentario.id} className="bg-amber-50 border border-amber-300 rounded-lg p-3 flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs font-semibold text-gray-800">{comentario.usuario}</span>
                                  <span className="text-xs text-gray-500">{comentario.data}</span>
                                </div>
                                {editandoComentarioGeral === comentario.id ? (
                                  <>
                                    <Textarea
                                      value={textoEdicaoComentarioGeral}
                                      onChange={e => setTextoEdicaoComentarioGeral(e.target.value)}
                                      className="h-20 text-base w-full"
                                      onKeyDown={e => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                          e.preventDefault();
                                          setComentariosGerais(prev => prev.map(c =>
                                            c.id === comentario.id ? { ...c, texto: textoEdicaoComentarioGeral, data: new Date().toLocaleString() } : c
                                          ));
                                          setEditandoComentarioGeral(null);
                                          setTextoEdicaoComentarioGeral("");
                                        }
                                      }}
                                    />
                                    <div className="flex justify-end gap-1 mt-2 w-full">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => {
                                          setEditandoComentarioGeral(null);
                                          setTextoEdicaoComentarioGeral("");
                                        }}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-[#26B99D] hover:text-[#15937E]"
                                        onClick={() => {
                                          setComentariosGerais(prev => prev.map(c =>
                                            c.id === comentario.id ? { ...c, texto: textoEdicaoComentarioGeral, data: new Date().toLocaleString() } : c
                                          ));
                                          setEditandoComentarioGeral(null);
                                          setTextoEdicaoComentarioGeral("");
                                        }}
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </>
                                ) : (
                                  <p className="text-sm text-gray-900 break-words whitespace-pre-line w-full">{comentario.texto}</p>
                                )}
                              </div>
                              {status !== "Rejeitado" && editandoComentarioGeral !== comentario.id && (
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                      setEditandoComentarioGeral(comentario.id);
                                      setTextoEdicaoComentarioGeral(comentario.texto);
                                    }}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                    onClick={() => {
                                      setComentariosGerais(prev => prev.filter(c => c.id !== comentario.id));
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          
          </Card>
        </form>
        )}

        {/* Botões de ação sempre visíveis */}
        <div className="flex justify-between mt-6">
          <Button variant="destructive" type="button" onClick={() => router.push("/atendimentos/queixas")}>Cancelar</Button>
          <div className="flex gap-2">
            <Button
              type="button"
              className="flex items-center bg-[#e6faf7] border border-[#26B99D] text-[#26B99D] hover:bg-[#d9f7f2] hover:border-[#26B99D] font-semibold shadow-sm"
            >
              <Save className="mr-2 h-4 w-4 text-[#26B99D]" />
              Salvar
            </Button>
            {status !== "Rejeitado" && status !== "Aberto" && (
              <Button
                type="button"
                className="flex items-center bg-red-100 border border-red-400 text-red-600 hover:bg-red-200 hover:border-red-500 font-semibold shadow-sm"
                onClick={() => setStatus("Rejeitado")}
              >
                <X className="mr-2 h-4 w-4" />
                Rejeitar
              </Button>
            )}
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 flex items-center"
              onClick={e => {
                if (status === 'Aberto') {
                  e.preventDefault();
                  setStatus('Revisão');
                } else if (status === 'Revisão') {
                  e.preventDefault();
                  setStatus('Qualidade');
                }
                // Nos outros status, deixa o submit normal
              }}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Enviar
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

