import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  ClipboardList,
  Info,
  FileText,
  User,
  Search,
  Pill,
  X,
  Calendar,
  HelpCircle,
  Plus,
  ArrowLeft,
  MoreVertical,
  Save,
  Send,
  XCircle,
  RotateCcw,
  Check,
  LogOut,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

type ClienteMock = {
  id: string;
  nome: string;
  documento: string;
  telefone: string;
  email: string;
  endereco: string;
};
const CLIENTES_MOCK: ClienteMock[] = [
  {
    id: "1",
    nome: "Maria Silva",
    documento: "123.456.789-00",
    telefone: "(11) 98765-4321",
    email: "maria.silva@email.com",
    endereco: "Av. Paulista, 1000 - São Paulo/SP",
  },
  {
    id: "2",
    nome: "João Santos",
    documento: "987.654.321-00",
    telefone: "(11) 91234-5678",
    email: "joao.santos@email.com",
    endereco: "Rua Augusta, 500 - São Paulo/SP",
  },
  {
    id: "3",
    nome: "Farmácia Saúde Ltda",
    documento: "12.345.678/0001-90",
    telefone: "(11) 3456-7890",
    email: "contato@farmaciasaude.com.br",
    endereco: "Av. Rebouças, 1500 - São Paulo/SP",
  },
];

type QueixaTecnicaMock = {
  numero: string;
  motivo: string;
  subcategoria: string;
  detalhe: string;
};

type ProtocoloMock = {
  id: string;
  data: string;
  produto: string;
  motivo: string;
  autorizaRetorno: boolean;
  queixaTecnica?: QueixaTecnicaMock;
};
const PROTOCOLOS_MOCK: Record<string, ProtocoloMock[]> = {
  "1": [
    {
      id: "P-1001",
      data: "05/01/2023",
      produto: "Medicamento A",
      motivo: "Dúvida sobre uso",
      autorizaRetorno: true,
      queixaTecnica: {
        numero: "QT-2024-0001",
        motivo: "Embalagem danificada",
        subcategoria: "Aparência",
        detalhe: "Rasgado",
      },
    },
    {
      id: "P-1002",
      data: "20/02/2023",
      produto: "Dispositivo X",
      motivo: "Reclamação de funcionamento",
      autorizaRetorno: false,
    },
  ],
  "2": [
    {
      id: "P-2001",
      data: "10/03/2023",
      produto: "Medicamento B",
      motivo: "Solicitação de troca",
      autorizaRetorno: true,
    },
  ],
  "3": [
    {
      id: "P-3001",
      data: "15/04/2023",
      produto: "Medicamento C",
      motivo: "Dúvida sobre validade",
      autorizaRetorno: true,
    },
    {
      id: "P-3002",
      data: "22/05/2023",
      produto: "Dispositivo Y",
      motivo: "Reclamação de embalagem",
      autorizaRetorno: false,
    },
  ],
};

export interface NovaFarmacovigilanciaFormProps {
  onSubmit: (data: any) => void;
  onBack?: () => void;
}

export interface NovaGestacaoFormProps {
  onSubmit: (data: any) => void;
  onBack?: () => void;
}

export function NovaFarmacovigilanciaForm({
  onSubmit,
  onBack,
}: NovaFarmacovigilanciaFormProps) {
  const { toast } = useToast();
  const [status, setStatus] = useState<
    | "Aberto"
    | "Revisão"
    | "Rejeitado"
    | "Retornado"
    | "Farmacovigilância"
    | "Concluído"
  >("Aberto");
  const [activeTab, setActiveTab] = useState<"principal" | "fup-001">(
    "principal"
  );

  const [eventosAdversos, setEventosAdversos] = useState<
    Array<{
      id: string;
      eventoAdverso: string;
      dataInicialEvento: string;
      tipoDataInicialEvento: "mes-ano" | "dia-mes-ano";
      resultadoEvento: string;
      sequelas: string;
      dataFinalEvento: string;
      tipoDataFinalEvento: "mes-ano" | "dia-mes-ano";
      relacaoEventoMedicamento: string;
      informouMedico: string;
      orientacaoMedica: string;
      acaoTomada: string;
      melhorouAposRetirada: string;
      voltouAposRetorno: string;
      usouMedicamentoTratamento: string;
      medicamentoTratamento: {
        produto: string;
        ean: string;
        lote: string;
        dosagem: string;
        viaAdministracao: string;
        indicacao: string;
      };
    }>
  >([
    {
      id: "1",
      eventoAdverso: "",
      dataInicialEvento: "",
      tipoDataInicialEvento: "dia-mes-ano",
      resultadoEvento: "",
      sequelas: "",
      dataFinalEvento: "",
      tipoDataFinalEvento: "dia-mes-ano",
      relacaoEventoMedicamento: "",
      informouMedico: "",
      orientacaoMedica: "",
      acaoTomada: "",
      melhorouAposRetirada: "",
      voltouAposRetorno: "",
      usouMedicamentoTratamento: "",
      medicamentoTratamento: {
        produto: "",
        ean: "",
        lote: "",
        dosagem: "",
        viaAdministracao: "",
        indicacao: "",
      },
    },
  ]);

  const [historicoMedicoItems, setHistoricoMedicoItems] = useState<
    Array<{
      id: string;
      descricaoCondicao: string;
      dataInicio: string;
      tipoDataInicio: "mes-ano" | "dia-mes-ano";
      emCursoDataInicio: boolean;
      dataTermino: string;
      tipoDataTermino: "mes-ano" | "dia-mes-ano";
    }>
  >([
    {
      id: "1",
      descricaoCondicao: "",
      dataInicio: "",
      tipoDataInicio: "dia-mes-ano",
      emCursoDataInicio: false,
      dataTermino: "",
      tipoDataTermino: "dia-mes-ano",
    },
  ]);

  const [examesLaboratoriais, setExamesLaboratoriais] = useState<
    Array<{
      id: string;
      nomeExame: string;
      resultado: string;
      unidade: string;
      faixaReferenciaBaixo: string;
      faixaReferenciaAlto: string;
      dataExame: string;
      tipoDataExame: "mes-ano" | "dia-mes-ano";
    }>
  >([
    {
      id: "1",
      nomeExame: "",
      resultado: "",
      unidade: "",
      faixaReferenciaBaixo: "",
      faixaReferenciaAlto: "",
      dataExame: "",
      tipoDataExame: "dia-mes-ano",
    },
  ]);

  const [medicamentosConcomitantes, setMedicamentosConcomitantes] = useState<
    Array<{
      id: string;
      produto: string;
      ean: string;
      lote: string;
      dosagem: string;
      viaAdministracao: string;
      indicacao: string;
    }>
  >([
    {
      id: "1",
      produto: "",
      ean: "",
      lote: "",
      dosagem: "",
      viaAdministracao: "",
      indicacao: "",
    },
  ]);

  // Estados separados para cada aba
  const [formPrincipal, setFormPrincipal] = useState<{
    cliente: ClienteMock | null;
    protocolo: ProtocoloMock | null;
    dataRecebimento: string;
    narrativa: string;
    anexos: File[];
    relatorEhPaciente: "sim" | "nao";
    relatorNome: string;
    dataNascimento: string;
    altura: string;
    peso: string;
    sexo: "masculino" | "feminino" | "nao-informado" | "";
    gestante: "sim" | "nao" | "nao-informado" | "";
    idadeGestacional: string;
    ultimoPeriodoMenstrual: string;
    tipoDataUltimoPeriodoMenstrual: "mes-ano" | "dia-mes-ano";
    produtoSuspeito: string;
    eanSuspeito: string;
    loteSuspeito: string;
    dosagem: string;
    viaAdministracao: string;
    indicacao: string;
    inicioTratamento: string;
    terminoTratamento: string;
    tratamentoEmAndamento: "sim" | "nao" | "nao-informado" | "";
    tipoDataInicio: "mes-ano" | "dia-mes-ano";
    tipoDataTermino: "mes-ano" | "dia-mes-ano";
    prescritoPeloMedico: "sim" | "nao" | "nao-informado" | "";
    eventoAdverso: string;
    dataInicialEvento: string;
    tipoDataInicialEvento: "mes-ano" | "dia-mes-ano";
    resultadoEvento: string;
    sequelas: string;
    dataFinalEvento: string;
    tipoDataFinalEvento: "mes-ano" | "dia-mes-ano";
    informouMedico: string;
    orientacaoMedica: string;
    acaoTomada: string;
    melhorouAposRetirada: string;
    voltouAposRetorno: string;
    usouMedicamentoTratamento: string;
    relacaoEventoMedicamento: string;
    medicamentoTratamento: {
      produto: string;
      ean: string;
      lote: string;
      dosagem: string;
      viaAdministracao: string;
      indicacao: string;
    };

    medicoPrescritor: {
      nome: string;
      crm: string;
      especialidade: string;
      telefone: string;
      email: string;
    };
  }>({
    cliente: null, // Aba Principal sem cliente pré-selecionado
    protocolo: null,
    dataRecebimento: "",
    narrativa: "",
    anexos: [],
    relatorEhPaciente: "sim",
    relatorNome: "",
    dataNascimento: "",
    altura: "",
    peso: "",
    sexo: "",
    gestante: "",
    idadeGestacional: "",
    ultimoPeriodoMenstrual: "",
    tipoDataUltimoPeriodoMenstrual: "dia-mes-ano",
    produtoSuspeito: "",
    eanSuspeito: "",
    loteSuspeito: "",
    dosagem: "",
    viaAdministracao: "",
    indicacao: "",
    inicioTratamento: "",
    terminoTratamento: "",
    tratamentoEmAndamento: "",
    tipoDataInicio: "dia-mes-ano",
    tipoDataTermino: "dia-mes-ano",
    prescritoPeloMedico: "",
    eventoAdverso: "",
    dataInicialEvento: "",
    tipoDataInicialEvento: "dia-mes-ano",
    resultadoEvento: "",
    sequelas: "",
    dataFinalEvento: "",
    tipoDataFinalEvento: "dia-mes-ano",
    informouMedico: "",
    orientacaoMedica: "",
    acaoTomada: "",
    melhorouAposRetirada: "",
    voltouAposRetorno: "",
    usouMedicamentoTratamento: "",
    relacaoEventoMedicamento: "",
    medicamentoTratamento: {
      produto: "",
      ean: "",
      lote: "",
      dosagem: "",
      viaAdministracao: "",
      indicacao: "",
    },

    medicoPrescritor: {
      nome: "",
      crm: "",
      especialidade: "",
      telefone: "",
      email: "",
    },
  });

  const [formFup, setFormFup] = useState<{
    cliente: ClienteMock | null;
    protocolo: ProtocoloMock | null;
    dataRecebimento: string;
    narrativa: string;
    anexos: File[];
    relatorEhPaciente: "sim" | "nao";
    relatorNome: string;
    dataNascimento: string;
    altura: string;
    peso: string;
    sexo: "masculino" | "feminino" | "nao-informado" | "";
    gestante: "sim" | "nao" | "nao-informado" | "";
    idadeGestacional: string;
    ultimoPeriodoMenstrual: string;
    tipoDataUltimoPeriodoMenstrual: "mes-ano" | "dia-mes-ano";
    produtoSuspeito: string;
    eanSuspeito: string;
    loteSuspeito: string;
    dosagem: string;
    viaAdministracao: string;
    indicacao: string;
    inicioTratamento: string;
    terminoTratamento: string;
    tratamentoEmAndamento: "sim" | "nao" | "nao-informado" | "";
    tipoDataInicio: "mes-ano" | "dia-mes-ano";
    tipoDataTermino: "mes-ano" | "dia-mes-ano";
    prescritoPeloMedico: "sim" | "nao" | "nao-informado" | "";
    eventoAdverso: string;
    dataInicialEvento: string;
    tipoDataInicialEvento: "mes-ano" | "dia-mes-ano";
    resultadoEvento: string;
    sequelas: string;
    dataFinalEvento: string;
    tipoDataFinalEvento: "mes-ano" | "dia-mes-ano";
    informouMedico: string;
    orientacaoMedica: string;
    acaoTomada: string;
    melhorouAposRetirada: string;
    voltouAposRetorno: string;
    usouMedicamentoTratamento: string;
    relacaoEventoMedicamento: string;
    medicamentoTratamento: {
      produto: string;
      ean: string;
      lote: string;
      dosagem: string;
      viaAdministracao: string;
      indicacao: string;
    };

    medicoPrescritor: {
      nome: string;
      crm: string;
      especialidade: string;
      telefone: string;
      email: string;
    };
  }>({
    cliente: CLIENTES_MOCK[0], // Aba Follow Up-001 com cliente pré-selecionado
    protocolo: PROTOCOLOS_MOCK[CLIENTES_MOCK[0].id] ? PROTOCOLOS_MOCK[CLIENTES_MOCK[0].id][0] : null, // Protocolo pré-selecionado
    dataRecebimento: "",
    narrativa: "",
    anexos: [],
    relatorEhPaciente: "sim",
    relatorNome: "",
    dataNascimento: "",
    altura: "",
    peso: "",
    sexo: "",
    gestante: "",
    idadeGestacional: "",
    ultimoPeriodoMenstrual: "",
    tipoDataUltimoPeriodoMenstrual: "dia-mes-ano",
    produtoSuspeito: "",
    eanSuspeito: "",
    loteSuspeito: "",
    dosagem: "",
    viaAdministracao: "",
    indicacao: "",
    inicioTratamento: "",
    terminoTratamento: "",
    tratamentoEmAndamento: "",
    tipoDataInicio: "dia-mes-ano",
    tipoDataTermino: "dia-mes-ano",
    prescritoPeloMedico: "",
    eventoAdverso: "",
    dataInicialEvento: "",
    tipoDataInicialEvento: "dia-mes-ano",
    resultadoEvento: "",
    sequelas: "",
    dataFinalEvento: "",
    tipoDataFinalEvento: "dia-mes-ano",
    informouMedico: "",
    orientacaoMedica: "",
    acaoTomada: "",
    melhorouAposRetirada: "",
    voltouAposRetorno: "",
    usouMedicamentoTratamento: "",
    relacaoEventoMedicamento: "",
    medicamentoTratamento: {
      produto: "",
      ean: "",
      lote: "",
      dosagem: "",
      viaAdministracao: "",
      indicacao: "",
    },

    medicoPrescritor: {
      nome: "",
      crm: "",
      especialidade: "",
      telefone: "",
      email: "",
    },
  });

  // Formulário ativo baseado na aba selecionada
  const form = activeTab === "principal" ? formPrincipal : formFup;
  const setForm = activeTab === "principal" ? setFormPrincipal : setFormFup;

  const [clienteSearch, setClienteSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const filteredClientes = CLIENTES_MOCK.filter(
    (c) =>
      c.nome.toLowerCase().includes(clienteSearch.toLowerCase()) ||
      c.documento.includes(clienteSearch)
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm((prev) => ({
        ...prev,
        anexos: [...prev.anexos, ...Array.from(e.target.files!)],
      }));
    }
  };

  // Protocolos do cliente selecionado
  const protocolos: ProtocoloMock[] = form.cliente
    ? PROTOCOLOS_MOCK[form.cliente.id] || []
    : [];

  // Calcular idade a partir da data de nascimento
  const calcularIdade = (dataNascimento: string): number | null => {
    if (!dataNascimento) return null;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();

    if (
      mesAtual < mesNascimento ||
      (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())
    ) {
      idade--;
    }

    return idade;
  };

  const idade = calcularIdade(form.dataNascimento);

  // Preencher automaticamente os campos do produto quando um protocolo for selecionado
  React.useEffect(() => {
    if (form.protocolo) {
      setForm((prev) => ({
        ...prev,
        produtoSuspeito: form.protocolo!.produto,
        eanSuspeito: "7891234567890", // Mock EAN
        loteSuspeito: "LOT2024001", // Mock lote
      }));
    }
  }, [form.protocolo]);

  // Função para adicionar novo evento adverso
  const adicionarEventoAdverso = () => {
    const novoEvento = {
      id: Date.now().toString(),
      eventoAdverso: "",
      dataInicialEvento: "",
      tipoDataInicialEvento: "dia-mes-ano" as const,
      resultadoEvento: "",
      sequelas: "",
      dataFinalEvento: "",
      tipoDataFinalEvento: "dia-mes-ano" as const,
      relacaoEventoMedicamento: "",
      informouMedico: "",
      orientacaoMedica: "",
      acaoTomada: "",
      melhorouAposRetirada: "",
      voltouAposRetorno: "",
      usouMedicamentoTratamento: "",
      medicamentoTratamento: {
        produto: "",
        ean: "",
        lote: "",
        dosagem: "",
        viaAdministracao: "",
        indicacao: "",
      },
    };
    setEventosAdversos((prev) => [...prev, novoEvento]);
  };

  // Função para remover evento adverso
  const removerEventoAdverso = (id: string) => {
    setEventosAdversos((prev) => prev.filter((evento) => evento.id !== id));
  };

  // Função para atualizar evento adverso
  const atualizarEventoAdverso = (
    id: string,
    campo: string,
    valor: string | boolean,
    subcampo?: string
  ) => {
    setEventosAdversos((prev) =>
      prev.map((evento) => {
        if (evento.id === id) {
          if (subcampo) {
            // Para campos aninhados como medicamentoTratamento
            return {
              ...evento,
              [campo]: {
                ...(evento[campo as keyof typeof evento] as any),
                [subcampo]: valor,
              },
            };
          } else {
            // Para campos simples
            return { ...evento, [campo]: valor };
          }
        }
        return evento;
      })
    );
  };

  // Função para atualizar item do histórico médico
  const atualizarHistoricoMedico = (
    id: string,
    campo: string,
    valor: string | boolean
  ) => {
    setHistoricoMedicoItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [campo]: valor } : item))
    );
  };

  // Função para adicionar nova condição médica
  const adicionarCondicaoMedica = () => {
    const novaCondicao = {
      id: Date.now().toString(),
      descricaoCondicao: "",
      dataInicio: "",
      tipoDataInicio: "dia-mes-ano" as const,
      emCursoDataInicio: false,
      dataTermino: "",
      tipoDataTermino: "dia-mes-ano" as const,
    };
    setHistoricoMedicoItems((prev) => [...prev, novaCondicao]);
  };

  // Função para remover condição médica
  const removerCondicaoMedica = (id: string) => {
    setHistoricoMedicoItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Função para adicionar novo exame laboratorial
  const adicionarExameLaboratorial = () => {
    const novoExame = {
      id: Date.now().toString(),
      nomeExame: "",
      resultado: "",
      unidade: "",
      faixaReferenciaBaixo: "",
      faixaReferenciaAlto: "",
      dataExame: "",
      tipoDataExame: "dia-mes-ano" as const,
    };
    setExamesLaboratoriais((prev) => [...prev, novoExame]);
  };

  // Função para remover exame laboratorial
  const removerExameLaboratorial = (id: string) => {
    setExamesLaboratoriais((prev) => prev.filter((exame) => exame.id !== id));
  };

  // Função para atualizar exames laboratoriais
  const atualizarExamesLaboratoriais = (
    id: string,
    campo: string,
    valor: string
  ) => {
    setExamesLaboratoriais((prev) =>
      prev.map((exame) =>
        exame.id === id ? { ...exame, [campo]: valor } : exame
      )
    );
  };

  // Função para adicionar novo medicamento concomitante
  const adicionarMedicamentoConcomitante = () => {
    const novoMedicamento = {
      id: Date.now().toString(),
      produto: "",
      ean: "",
      lote: "",
      dosagem: "",
      viaAdministracao: "",
      indicacao: "",
    };
    setMedicamentosConcomitantes((prev) => [...prev, novoMedicamento]);
  };

  // Função para remover medicamento concomitante
  const removerMedicamentoConcomitante = (id: string) => {
    setMedicamentosConcomitantes((prev) =>
      prev.filter((medicamento) => medicamento.id !== id)
    );
  };

  // Função para atualizar medicamentos concomitantes
  const atualizarMedicamentoConcomitante = (
    id: string,
    campo: string,
    valor: string
  ) => {
    setMedicamentosConcomitantes((prev) =>
      prev.map((medicamento) =>
        medicamento.id === id ? { ...medicamento, [campo]: valor } : medicamento
      )
    );
  };

  // Função para renderizar o badge de status
  const renderStatusBadge = () => {
    const statusConfig = {
      Aberto: {
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
      },
      Revisão: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
      },
      Rejeitado: {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
      },
      Retornado: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
      },
      Farmacovigilância: {
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
      },
      Concluído: {
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
      },
    };

    const config = statusConfig[status];

    return (
      <Badge
        className={`${config.bg} ${config.text} ${config.border} text-sm px-3 py-1 font-medium`}
      >
        {status}
      </Badge>
    );
  };

  // Função para atualizar o status
  const updateStatus = (newStatus: typeof status) => {
    setStatus(newStatus);
    toast({
      title: "Status atualizado",
      description: `Status alterado para "${newStatus}"`,
      duration: 3000,
    });
  };

  // Função para verificar se uma transição de status é permitida
  const canTransitionTo = (targetStatus: typeof status) => {
    const allowedTransitions: Record<typeof status, (typeof status)[]> = {
      Aberto: ["Revisão"],
      Revisão: ["Rejeitado", "Farmacovigilância"],
      Rejeitado: ["Revisão"],
      Farmacovigilância: ["Retornado", "Concluído"],
      Retornado: ["Farmacovigilância"],
      Concluído: [],
    };
    return allowedTransitions[status].includes(targetStatus);
  };

  // Função para renderizar o menu de ações de status
  const renderStatusActions = () => {
    const allStatuses: (typeof status)[] = [
      "Aberto",
      "Revisão",
      "Rejeitado",
      "Retornado",
      "Farmacovigilância",
      "Concluído",
    ];

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
              className={
                !canTransitionTo(targetStatus)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            >
              {targetStatus}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Função para renderizar botões baseados no status
  const renderActionButtons = () => {
    const handleCancel = () => {
      if (onBack) {
        onBack();
      }
    };

    const handleSave = () => {
      // Salvar sem alterar status
      onSubmit({
        ...form,
        historicoMedico: historicoMedicoItems,
        examesLaboratoriais: examesLaboratoriais,
        eventosAdversos: eventosAdversos,
        medicamentosConcomitantes: medicamentosConcomitantes,
        status: status,
      });
    };

    const handleSubmit = (newStatus: typeof status) => {
      updateStatus(newStatus);
      onSubmit({
        ...form,
        historicoMedico: historicoMedicoItems,
        examesLaboratoriais: examesLaboratoriais,
        eventosAdversos: eventosAdversos,
        medicamentosConcomitantes: medicamentosConcomitantes,
        status: newStatus,
      });
    };

    const handleExit = () => {
      if (onBack) {
        onBack();
      }
    };

    switch (status) {
      case "Aberto":
        return (
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="button" variant="secondary" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit("Revisão")}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          </div>
        );

      case "Revisão":
        return (
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="button" variant="secondary" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => handleSubmit("Rejeitado")}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rejeitar
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit("Farmacovigilância")}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          </div>
        );

      case "Rejeitado":
        return (
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="button" variant="secondary" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit("Revisão")}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          </div>
        );

      case "Retornado":
        return (
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="button" variant="secondary" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit("Farmacovigilância")}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          </div>
        );

      case "Farmacovigilância":
        return (
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => handleSubmit("Retornado")}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Retornar
            </Button>
            <Button type="button" variant="secondary" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit("Concluído")}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Concluir
            </Button>
          </div>
        );

      case "Concluído":
        return (
          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={handleExit}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      {/* Cabeçalho com Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Nova Farmacovigilância</h1>
          </div>
        </div>
        {/* Badge de Status */}
        <div className="mt-6 flex items-center gap-3">
          <div className="flex items-center gap-2">
            {renderStatusBadge()}
            {renderStatusActions()}
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="mt-6">
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "principal" | "fup-001")
            }
          >
            <TabsList className="grid w-full max-w-[400px] grid-cols-2">
              <TabsTrigger value="principal">Principal</TabsTrigger>
              <TabsTrigger value="fup-001">Follow Up-001</TabsTrigger>
            </TabsList>

            <TabsContent value="principal" className="mt-6">
              <form className="space-y-6">
                {/* Informações do Cliente */}
                <Card>
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex items-center gap-2">
                      <User className="h-7 w-7 text-teal-600" />
                      <span className="text-xl font-bold">
                        Informações do Relator
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <Label htmlFor="cliente">
                        Cliente <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="cliente"
                          type="search"
                          placeholder="Buscar por nome ou documento"
                          className="pl-8 h-11"
                          value={clienteSearch}
                          onChange={(e) => {
                            setClienteSearch(e.target.value);
                            setShowResults(true);
                          }}
                          autoComplete="off"
                        />
                        {showResults && filteredClientes.length > 0 && (
                          <div className="absolute z-50 w-full left-0 mt-1 bg-white border rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
                            {filteredClientes.map((cliente) => (
                              <button
                                key={cliente.id}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b last:border-b-0"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setForm((f) => ({
                                    ...f,
                                    cliente,
                                    protocolo: null,
                                  }));
                                  setClienteSearch("");
                                  setShowResults(false);
                                }}
                              >
                                <div className="font-medium text-gray-900">
                                  {cliente.nome}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {cliente.documento} • {cliente.telefone}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {form.cliente && (
                        <div className="mt-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between border border-teal-200 bg-[#F8FEFC] rounded-lg px-6 py-4 mb-2">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#E6FAF7] text-[#26B99D] font-bold text-xl">
                                {form.cliente.nome
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="font-bold text-lg text-gray-900">
                                  {form.cliente.nome}
                                </span>
                                <div className="flex items-center gap-2 text-gray-700 text-sm">
                                  <svg
                                    width="18"
                                    height="18"
                                    fill="none"
                                    stroke="#26B99D"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                  >
                                    <rect
                                      width="20"
                                      height="16"
                                      x="2"
                                      y="4"
                                      rx="2"
                                    />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                  </svg>
                                  <span>{form.cliente.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 text-sm">
                                  <svg
                                    width="18"
                                    height="18"
                                    fill="none"
                                    stroke="#26B99D"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                    <circle cx="12" cy="10" r="3" />
                                  </svg>
                                  <span>{form.cliente.documento}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 text-sm">
                                  <svg
                                    width="18"
                                    height="18"
                                    fill="none"
                                    stroke="#26B99D"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                    <circle cx="12" cy="12" r="5" />
                                  </svg>
                                  <span>
                                    Tipo:{" "}
                                    <b>
                                      {form.cliente.documento &&
                                      form.cliente.documento.length > 14
                                        ? "Pessoa Jurídica"
                                        : "Pessoa Física"}
                                    </b>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 items-end mt-4 md:mt-0">
                              <div className="flex items-center gap-2 text-gray-700 text-sm">
                                <svg
                                  width="18"
                                  height="18"
                                  fill="none"
                                  stroke="#26B99D"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                <span>{form.cliente.telefone}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700 text-sm">
                                <svg
                                  width="18"
                                  height="18"
                                  fill="none"
                                  stroke="#26B99D"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                  <circle cx="12" cy="12" r="5" />
                                </svg>
                                <span>{form.cliente.endereco}</span>
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="mt-2"
                                onClick={() =>
                                  setForm((f) => ({
                                    ...f,
                                    cliente: null,
                                    protocolo: null,
                                  }))
                                }
                              >
                                Remover
                              </Button>
                            </div>
                          </div>
                          {/* Protocolos do cliente */}
                          {protocolos.length > 0 && (
                            <div className="mt-6">
                              <div className="font-semibold mb-2 text-gray-800 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-[#26B99D]" />
                                Protocolos
                                <span className="text-xs text-gray-500 font-normal ml-2">
                                  Protocolos em andamento do cliente
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-3">
                                {protocolos.map((protocolo: ProtocoloMock) => (
                                  <div
                                    key={protocolo.id}
                                    className={`relative px-4 py-2 rounded-md border flex flex-col items-start min-w-[260px] shadow-sm transition-colors min-h-[80px] ${
                                      form.protocolo &&
                                      form.protocolo.id === protocolo.id
                                        ? "border-[#26B99D] bg-[#e6faf7]"
                                        : "border-gray-200 bg-white hover:border-[#26B99D]"
                                    }`}
                                  >
                                    <span className="font-bold text-base text-[#26B99D] tracking-wide mb-1">
                                      {protocolo.id}
                                    </span>
                                    <span className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                      <svg
                                        width="16"
                                        height="16"
                                        fill="none"
                                        stroke="#26B99D"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                      >
                                        <rect
                                          x="3"
                                          y="4"
                                          width="18"
                                          height="18"
                                          rx="2"
                                        />
                                        <path d="M16 2v4M8 2v4M3 10h18" />
                                      </svg>{" "}
                                      Aberto em {protocolo.data}
                                    </span>
                                    <span className="text-sm text-gray-900 mb-0.5 flex items-center gap-1">
                                      <FileText className="h-4 w-4 text-[#26B99D]" />
                                      Motivo: <b>{protocolo.motivo}</b>
                                    </span>
                                    <span className="text-sm text-gray-900 mb-0.5 flex items-center gap-1">
                                      <Pill className="h-4 w-4 text-[#26B99D]" />
                                      Produto: <b>{protocolo.produto}</b>
                                    </span>
                                    <span className="text-sm text-gray-900 mb-0.5 flex items-center gap-1">
                                      <svg
                                        width="16"
                                        height="16"
                                        fill="none"
                                        stroke="#26B99D"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                      </svg>
                                      Autoriza retorno:{" "}
                                      <b>
                                        {protocolo.autorizaRetorno
                                          ? "Sim"
                                          : "Não"}
                                      </b>
                                    </span>
                                    {form.protocolo &&
                                    form.protocolo.id === protocolo.id ? (
                                      <>
                                        <button
                                          type="button"
                                          className="absolute top-2 right-2 p-1 rounded hover:bg-red-100 text-red-700"
                                          onClick={() =>
                                            setForm((f) => ({
                                              ...f,
                                              protocolo: null,
                                            }))
                                          }
                                          aria-label="Desvincular protocolo"
                                        >
                                          <X size={16} />
                                        </button>
                                        {protocolo.queixaTecnica && (
                                          <QueixaTecnicaCard
                                            queixa={protocolo.queixaTecnica}
                                          />
                                        )}
                                      </>
                                    ) : (
                                      <Button
                                        type="button"
                                        className="mt-2 px-3 py-1 rounded bg-[#26B99D] text-white text-xs font-semibold hover:bg-[#15937E] transition"
                                        onClick={() =>
                                          setForm((f) => ({ ...f, protocolo }))
                                        }
                                      >
                                        Vincular
                                      </Button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Dados do Relator */}
                <Card>
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-7 w-7 text-teal-600" />
                      <span className="text-xl font-bold">
                        Dados do Paciente
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <Label className="font-medium">
                        Relator é o paciente?
                      </Label>
                      <div className="flex gap-6 mt-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="relator-sim"
                            name="relatorEhPaciente"
                            value="sim"
                            checked={form.relatorEhPaciente === "sim"}
                            onChange={() =>
                              setForm((f) => ({
                                ...f,
                                relatorEhPaciente: "sim",
                                relatorNome: "",
                              }))
                            }
                            className="accent-teal-600 h-4 w-4"
                          />
                          <Label htmlFor="relator-sim">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="relator-nao"
                            name="relatorEhPaciente"
                            value="nao"
                            checked={form.relatorEhPaciente === "nao"}
                            onChange={() =>
                              setForm((f) => ({
                                ...f,
                                relatorEhPaciente: "nao",
                              }))
                            }
                            className="accent-teal-600 h-4 w-4"
                          />
                          <Label htmlFor="relator-nao">Não</Label>
                        </div>
                      </div>
                    </div>
                    {form.relatorEhPaciente === "nao" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-teal-50/60 border border-teal-100 rounded-lg p-5">
                        <div className="space-y-2">
                          <Label htmlFor="relator-nome">
                            Nome completo do Paciente{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="relator-nome"
                            placeholder="Digite o nome do paciente"
                            value={form.relatorNome || ""}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                relatorNome: e.target.value,
                              }))
                            }
                            required
                            className="h-11"
                          />
                        </div>
                      </div>
                    )}

                    {/* Dados do Paciente */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="data-nascimento">
                            Data de Nascimento
                          </Label>
                          <div className="relative">
                            <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="data-nascimento"
                              type="date"
                              value={form.dataNascimento}
                              onChange={(e) =>
                                setForm((f) => ({
                                  ...f,
                                  dataNascimento: e.target.value,
                                }))
                              }
                              className="pl-8 h-11 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                            />
                          </div>
                          {idade !== null && (
                            <div className="text-sm text-teal-600 font-medium">
                              Idade: {idade} anos
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="sexo">Sexo</Label>
                          <div className="flex gap-6 mt-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="sexo-masculino"
                                name="sexo"
                                value="masculino"
                                checked={form.sexo === "masculino"}
                                onChange={() =>
                                  setForm((f) => ({
                                    ...f,
                                    sexo: "masculino",
                                    gestante: "",
                                    idadeGestacional: "",
                                    ultimoPeriodoMenstrual: "",
                                  }))
                                }
                                className="accent-teal-600 h-4 w-4"
                              />
                              <Label htmlFor="sexo-masculino">Masculino</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="sexo-feminino"
                                name="sexo"
                                value="feminino"
                                checked={form.sexo === "feminino"}
                                onChange={() =>
                                  setForm((f) => ({ ...f, sexo: "feminino" }))
                                }
                                className="accent-teal-600 h-4 w-4"
                              />
                              <Label htmlFor="sexo-feminino">Feminino</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="sexo-nao-informado"
                                name="sexo"
                                value="nao-informado"
                                checked={form.sexo === "nao-informado"}
                                onChange={() =>
                                  setForm((f) => ({
                                    ...f,
                                    sexo: "nao-informado",
                                    gestante: "",
                                    idadeGestacional: "",
                                    ultimoPeriodoMenstrual: "",
                                  }))
                                }
                                className="accent-teal-600 h-4 w-4"
                              />
                              <Label htmlFor="sexo-nao-informado">
                                Não informado
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {form.sexo === "feminino" && (
                        <div className="space-y-4 bg-pink-50/60 border border-pink-100 rounded-lg p-4">
                          <div className="space-y-2">
                            <Label className="font-medium">Gestante</Label>
                            <div className="flex gap-6 mt-2">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="gestante-sim"
                                  name="gestante"
                                  value="sim"
                                  checked={form.gestante === "sim"}
                                  onChange={() =>
                                    setForm((f) => ({ ...f, gestante: "sim" }))
                                  }
                                  className="accent-pink-600 h-4 w-4"
                                />
                                <Label htmlFor="gestante-sim">Sim</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="gestante-nao"
                                  name="gestante"
                                  value="nao"
                                  checked={form.gestante === "nao"}
                                  onChange={() =>
                                    setForm((f) => ({
                                      ...f,
                                      gestante: "nao",
                                      idadeGestacional: "",
                                      ultimoPeriodoMenstrual: "",
                                    }))
                                  }
                                  className="accent-pink-600 h-4 w-4"
                                />
                                <Label htmlFor="gestante-nao">Não</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="gestante-nao-informado"
                                  name="gestante"
                                  value="nao-informado"
                                  checked={form.gestante === "nao-informado"}
                                  onChange={() =>
                                    setForm((f) => ({
                                      ...f,
                                      gestante: "nao-informado",
                                      idadeGestacional: "",
                                      ultimoPeriodoMenstrual: "",
                                    }))
                                  }
                                  className="accent-pink-600 h-4 w-4"
                                />
                                <Label htmlFor="gestante-nao-informado">
                                  Não informado
                                </Label>
                              </div>
                            </div>
                          </div>

                          {form.gestante === "sim" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Label htmlFor="idade-gestacional">
                                    Idade gestacional
                                  </Label>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <HelpCircle className="h-4 w-4 text-gray-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Idade gestacional no início do EA</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                                <Input
                                  id="idade-gestacional"
                                  type="number"
                                  placeholder="Ex: 20 semanas"
                                  value={form.idadeGestacional}
                                  onChange={(e) =>
                                    setForm((f) => ({
                                      ...f,
                                      idadeGestacional: e.target.value,
                                    }))
                                  }
                                  className="h-11"
                                  min="0"
                                  max="42"
                                />
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Label htmlFor="ultimo-periodo-menstrual">
                                    Último período menstrual (DPM)
                                  </Label>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <HelpCircle className="h-4 w-4 text-gray-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Data do último período menstrual</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                                <div className="flex gap-2">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className="w-24 justify-between h-11 text-xs"
                                      >
                                        <span>
                                          {form.tipoDataUltimoPeriodoMenstrual ===
                                          "mes-ano"
                                            ? "MM/AAAA"
                                            : "DD/MM/AAAA"}
                                        </span>
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                      <Command>
                                        <CommandGroup>
                                          <CommandItem
                                            value="dia-mes-ano"
                                            onSelect={() =>
                                              setForm((f) => ({
                                                ...f,
                                                tipoDataUltimoPeriodoMenstrual:
                                                  "dia-mes-ano",
                                              }))
                                            }
                                          >
                                            DD/MM/AAAA
                                          </CommandItem>
                                          <CommandItem
                                            value="mes-ano"
                                            onSelect={() =>
                                              setForm((f) => ({
                                                ...f,
                                                tipoDataUltimoPeriodoMenstrual:
                                                  "mes-ano",
                                              }))
                                            }
                                          >
                                            MM/AAAA
                                          </CommandItem>
                                        </CommandGroup>
                                      </Command>
                                    </PopoverContent>
                                  </Popover>
                                  <div className="relative flex-1">
                                    <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      id="ultimo-periodo-menstrual"
                                      type={
                                        form.tipoDataUltimoPeriodoMenstrual ===
                                        "mes-ano"
                                          ? "month"
                                          : "date"
                                      }
                                      value={form.ultimoPeriodoMenstrual}
                                      onChange={(e) =>
                                        setForm((f) => ({
                                          ...f,
                                          ultimoPeriodoMenstrual:
                                            e.target.value,
                                        }))
                                      }
                                      className="pl-8 h-11 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="altura">Altura (cm)</Label>
                          <Input
                            id="altura"
                            type="number"
                            placeholder="Ex: 170"
                            value={form.altura}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, altura: e.target.value }))
                            }
                            className="h-11"
                            min="50"
                            max="250"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="peso">Peso (kg)</Label>
                          <Input
                            id="peso"
                            type="number"
                            placeholder="Ex: 70.5"
                            value={form.peso}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, peso: e.target.value }))
                            }
                            className="h-11"
                            min="1"
                            max="300"
                            step="0.1"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Histórico Médico */}
                <Card>
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex items-center gap-2">
                      <FileText className="h-7 w-7 text-teal-600" />
                      <span className="text-xl font-bold">
                        Histórico Médico
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    {/* Cabeçalho com botão Adicionar Condição */}
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          Condições Médicas
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Adicione informações sobre condições médicas
                          relevantes
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex items-center gap-2 text-teal-600 border-teal-300 hover:bg-teal-50"
                        onClick={adicionarCondicaoMedica}
                      >
                        <Plus className="h-4 w-4" />
                        Adicionar Condição
                      </Button>
                    </div>

                    {/* Lista de Condições Médicas */}
                    <div className="space-y-8">
                      {historicoMedicoItems.map((item, index) => (
                        <div
                          key={item.id}
                          className="border border-gray-200 rounded-lg p-6 bg-gray-50/50"
                        >
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="font-semibold text-gray-900 text-lg">
                              Condição {index + 1}
                            </h4>
                            {historicoMedicoItems.length > 1 && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removerCondicaoMedica(item.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div
                            className={`grid grid-cols-1 gap-8 ${
                              item.emCursoDataInicio
                                ? "lg:grid-cols-2"
                                : "lg:grid-cols-3"
                            }`}
                          >
                            {/* Descrição da Condição */}
                            <div className="space-y-4">
                              <Label className="font-medium text-gray-700 text-base">
                                Descrição da Condição
                              </Label>
                              <Input
                                placeholder="Descreva a condição médica..."
                                value={item.descricaoCondicao || ""}
                                onChange={(e) =>
                                  atualizarHistoricoMedico(
                                    item.id,
                                    "descricaoCondicao",
                                    e.target.value
                                  )
                                }
                                className="h-12 text-base"
                              />
                            </div>

                            {/* Data de Início */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between flex-wrap gap-3">
                                <Label className="font-medium text-gray-700 text-base">
                                  Data de Início
                                </Label>
                                <div className="flex items-center space-x-3">
                                  <input
                                    type="checkbox"
                                    id={`em-curso-inicio-${item.id}`}
                                    checked={item.emCursoDataInicio || false}
                                    onChange={(e) => {
                                      atualizarHistoricoMedico(
                                        item.id,
                                        "emCursoDataInicio",
                                        e.target.checked
                                      );
                                      // Limpar campos de término quando marcar como em curso
                                      if (e.target.checked) {
                                        atualizarHistoricoMedico(
                                          item.id,
                                          "dataTermino",
                                          ""
                                        );
                                      }
                                    }}
                                    className="accent-teal-600 h-4 w-4"
                                  />
                                  <Label
                                    htmlFor={`em-curso-inicio-${item.id}`}
                                    className="text-sm text-gray-600 whitespace-nowrap font-medium"
                                  >
                                    Em curso
                                  </Label>
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className="w-32 justify-between h-12 text-sm border-gray-300"
                                    >
                                      <span>
                                        {item.tipoDataInicio === "mes-ano"
                                          ? "MM/AAAA"
                                          : "DD/MM/AAAA"}
                                      </span>
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                    <Command>
                                      <CommandGroup>
                                        <CommandItem
                                          value="dia-mes-ano"
                                          onSelect={() =>
                                            atualizarHistoricoMedico(
                                              item.id,
                                              "tipoDataInicio",
                                              "dia-mes-ano"
                                            )
                                          }
                                        >
                                          DD/MM/AAAA
                                        </CommandItem>
                                        <CommandItem
                                          value="mes-ano"
                                          onSelect={() =>
                                            atualizarHistoricoMedico(
                                              item.id,
                                              "tipoDataInicio",
                                              "mes-ano"
                                            )
                                          }
                                        >
                                          MM/AAAA
                                        </CommandItem>
                                      </CommandGroup>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                                <div className="relative flex-1 min-w-0">
                                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                  <Input
                                    type={
                                      item.tipoDataInicio === "mes-ano"
                                        ? "month"
                                        : "date"
                                    }
                                    value={item.dataInicio || ""}
                                    onChange={(e) =>
                                      atualizarHistoricoMedico(
                                        item.id,
                                        "dataInicio",
                                        e.target.value
                                      )
                                    }
                                    className="pl-10 h-12 text-base [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Data de Término - Oculto quando em curso */}
                            {!item.emCursoDataInicio && (
                              <div className="space-y-4">
                                <Label className="font-medium text-gray-700 text-base">
                                  Data de Término
                                </Label>
                                <div className="flex gap-3">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className="w-32 justify-between h-12 text-sm border-gray-300"
                                      >
                                        <span>
                                          {item.tipoDataTermino === "mes-ano"
                                            ? "MM/AAAA"
                                            : "DD/MM/AAAA"}
                                        </span>
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                      <Command>
                                        <CommandGroup>
                                          <CommandItem
                                            value="dia-mes-ano"
                                            onSelect={() =>
                                              atualizarHistoricoMedico(
                                                item.id,
                                                "tipoDataTermino",
                                                "dia-mes-ano"
                                              )
                                            }
                                          >
                                            DD/MM/AAAA
                                          </CommandItem>
                                          <CommandItem
                                            value="mes-ano"
                                            onSelect={() =>
                                              atualizarHistoricoMedico(
                                                item.id,
                                                "tipoDataTermino",
                                                "mes-ano"
                                              )
                                            }
                                          >
                                            MM/AAAA
                                          </CommandItem>
                                        </CommandGroup>
                                      </Command>
                                    </PopoverContent>
                                  </Popover>
                                  <div className="relative flex-1 min-w-0">
                                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                    <Input
                                      type={
                                        item.tipoDataTermino === "mes-ano"
                                          ? "month"
                                          : "date"
                                      }
                                      value={item.dataTermino || ""}
                                      onChange={(e) =>
                                        atualizarHistoricoMedico(
                                          item.id,
                                          "dataTermino",
                                          e.target.value
                                        )
                                      }
                                      className="pl-10 h-12 text-base [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Divider com mais espaçamento */}
                    <div className="border-t border-gray-200 my-10"></div>

                    {/* Exames Laboratoriais */}
                    <div className="space-y-6">
                      <div className="mb-6 flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                            <FileText className="h-6 w-6 text-teal-600" />
                            Exames Laboratoriais
                          </h3>
                          <p className="text-sm text-gray-500 mt-2">
                            Adicione informações sobre exames laboratoriais
                            relevantes
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="flex items-center gap-2 text-teal-600 border-teal-300 hover:bg-teal-50"
                          onClick={adicionarExameLaboratorial}
                        >
                          <Plus className="h-4 w-4" />
                          Adicionar Exame
                        </Button>
                      </div>

                      {/* Lista de Exames */}
                      <div className="space-y-8">
                        {examesLaboratoriais.map((exame, index) => (
                          <div
                            key={exame.id}
                            className="border border-gray-200 rounded-lg p-6 bg-gray-50/50"
                          >
                            <div className="flex items-center justify-between mb-6">
                              <h4 className="font-semibold text-gray-900 text-lg">
                                Exame {index + 1}
                              </h4>
                              {examesLaboratoriais.length > 1 && (
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    removerExameLaboratorial(exame.id)
                                  }
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              {/* Nome do Exame */}
                              <div className="space-y-3">
                                <Label className="font-medium text-gray-700">
                                  Nome do Exame
                                </Label>
                                <Input
                                  placeholder="Ex: Hemograma completo"
                                  value={exame.nomeExame}
                                  onChange={(e) =>
                                    atualizarExamesLaboratoriais(
                                      exame.id,
                                      "nomeExame",
                                      e.target.value
                                    )
                                  }
                                  className="h-11"
                                />
                              </div>

                              {/* Resultado */}
                              <div className="space-y-3">
                                <Label className="font-medium text-gray-700">
                                  Resultado
                                </Label>
                                <Input
                                  placeholder="Ex: 4.5"
                                  value={exame.resultado}
                                  onChange={(e) =>
                                    atualizarExamesLaboratoriais(
                                      exame.id,
                                      "resultado",
                                      e.target.value
                                    )
                                  }
                                  className="h-11"
                                />
                              </div>

                              {/* Unidade */}
                              <div className="space-y-3">
                                <Label className="font-medium text-gray-700">
                                  Unidade
                                </Label>
                                <Input
                                  placeholder="Ex: mg/dL"
                                  value={exame.unidade}
                                  onChange={(e) =>
                                    atualizarExamesLaboratoriais(
                                      exame.id,
                                      "unidade",
                                      e.target.value
                                    )
                                  }
                                  className="h-11"
                                />
                              </div>
                            </div>

                            {/* Segunda linha com Faixa de Referência e Data do Exame */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                              {/* Faixa de Referência */}
                              <div className="space-y-3">
                                <Label className="font-medium text-gray-700">
                                  Faixa de Referência
                                </Label>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <Label className="text-xs text-gray-600">
                                      Baixo
                                    </Label>
                                    <Input
                                      placeholder="Ex: 3,5"
                                      value={exame.faixaReferenciaBaixo || ""}
                                      onChange={(e) =>
                                        atualizarExamesLaboratoriais(
                                          exame.id,
                                          "faixaReferenciaBaixo",
                                          e.target.value
                                        )
                                      }
                                      className="h-11 text-sm"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs text-gray-600">
                                      Alto
                                    </Label>
                                    <Input
                                      placeholder="Ex: 5,0"
                                      value={exame.faixaReferenciaAlto || ""}
                                      onChange={(e) =>
                                        atualizarExamesLaboratoriais(
                                          exame.id,
                                          "faixaReferenciaAlto",
                                          e.target.value
                                        )
                                      }
                                      className="h-11 text-sm"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Data do Exame */}
                              <div className="space-y-3">
                                <Label className="font-medium text-gray-700">
                                  Data do Exame
                                </Label>
                                <div className="flex gap-2">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className="w-28 justify-between h-11 text-xs border-gray-300"
                                      >
                                        <span>
                                          {exame.tipoDataExame === "mes-ano"
                                            ? "MM/AAAA"
                                            : "DD/MM/AAAA"}
                                        </span>
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                      <Command>
                                        <CommandGroup>
                                          <CommandItem
                                            value="dia-mes-ano"
                                            onSelect={() =>
                                              atualizarExamesLaboratoriais(
                                                exame.id,
                                                "tipoDataExame",
                                                "dia-mes-ano"
                                              )
                                            }
                                          >
                                            DD/MM/AAAA
                                          </CommandItem>
                                          <CommandItem
                                            value="mes-ano"
                                            onSelect={() =>
                                              atualizarExamesLaboratoriais(
                                                exame.id,
                                                "tipoDataExame",
                                                "mes-ano"
                                              )
                                            }
                                          >
                                            MM/AAAA
                                          </CommandItem>
                                        </CommandGroup>
                                      </Command>
                                    </PopoverContent>
                                  </Popover>
                                  <div className="relative flex-1 min-w-0">
                                    <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      type={
                                        exame.tipoDataExame === "mes-ano"
                                          ? "month"
                                          : "date"
                                      }
                                      value={exame.dataExame}
                                      onChange={(e) =>
                                        atualizarExamesLaboratoriais(
                                          exame.id,
                                          "dataExame",
                                          e.target.value
                                        )
                                      }
                                      className="pl-8 h-11 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Medicamentos Suspeitos */}
                <Card>
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex items-center gap-2">
                      <Pill className="h-7 w-7 text-teal-600" />
                      <span className="text-xl font-bold">
                        Medicamentos Suspeitos
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <TooltipProvider>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="produto-suspeito">Produto</Label>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Nome do medicamento suspeito de causar o
                                  evento
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Input
                            id="produto-suspeito"
                            placeholder="Nome do produto"
                            value={form.produtoSuspeito}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                produtoSuspeito: e.target.value,
                              }))
                            }
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="ean-suspeito">EAN</Label>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Código de barras EAN do produto</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Input
                            id="ean-suspeito"
                            placeholder="Código EAN"
                            value={form.eanSuspeito}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                eanSuspeito: e.target.value,
                              }))
                            }
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="lote-suspeito">Lote</Label>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Número do lote do medicamento</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Input
                            id="lote-suspeito"
                            placeholder="Número do lote"
                            value={form.loteSuspeito}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                loteSuspeito: e.target.value,
                              }))
                            }
                            className="h-11"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="dosagem">Dosagem</Label>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Dose administrada do medicamento (ex: 500mg,
                                  10ml)
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Input
                            id="dosagem"
                            placeholder="Ex: 500mg"
                            value={form.dosagem}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                dosagem: e.target.value,
                              }))
                            }
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="via-administracao">
                              Via de Administração
                            </Label>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Via pela qual o medicamento foi administrado
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between h-11"
                              >
                                <div className="flex items-center gap-2">
                                  <Pill className="h-4 w-4 text-teal-600" />
                                  <span>
                                    {form.viaAdministracao ||
                                      "Selecione a via de administração"}
                                  </span>
                                </div>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                              <Command>
                                <CommandInput placeholder="Buscar via de administração..." />
                                <CommandEmpty>
                                  Nenhuma via encontrada.
                                </CommandEmpty>
                                <CommandGroup>
                                  <CommandItem
                                    value="Oral"
                                    onSelect={() =>
                                      setForm((f) => ({
                                        ...f,
                                        viaAdministracao: "Oral",
                                      }))
                                    }
                                  >
                                    <Pill className="mr-2 h-4 w-4" />
                                    Oral
                                  </CommandItem>
                                  <CommandItem
                                    value="Intravenosa"
                                    onSelect={() =>
                                      setForm((f) => ({
                                        ...f,
                                        viaAdministracao: "Intravenosa",
                                      }))
                                    }
                                  >
                                    <Pill className="mr-2 h-4 w-4" />
                                    Intravenosa
                                  </CommandItem>
                                  <CommandItem
                                    value="Intramuscular"
                                    onSelect={() =>
                                      setForm((f) => ({
                                        ...f,
                                        viaAdministracao: "Intramuscular",
                                      }))
                                    }
                                  >
                                    <Pill className="mr-2 h-4 w-4" />
                                    Intramuscular
                                  </CommandItem>
                                  <CommandItem
                                    value="Subcutânea"
                                    onSelect={() =>
                                      setForm((f) => ({
                                        ...f,
                                        viaAdministracao: "Subcutânea",
                                      }))
                                    }
                                  >
                                    <Pill className="mr-2 h-4 w-4" />
                                    Subcutânea
                                  </CommandItem>
                                  <CommandItem
                                    value="Tópica"
                                    onSelect={() =>
                                      setForm((f) => ({
                                        ...f,
                                        viaAdministracao: "Tópica",
                                      }))
                                    }
                                  >
                                    <Pill className="mr-2 h-4 w-4" />
                                    Tópica
                                  </CommandItem>
                                  <CommandItem
                                    value="Inalatória"
                                    onSelect={() =>
                                      setForm((f) => ({
                                        ...f,
                                        viaAdministracao: "Inalatória",
                                      }))
                                    }
                                  >
                                    <Pill className="mr-2 h-4 w-4" />
                                    Inalatória
                                  </CommandItem>
                                  <CommandItem
                                    value="Retal"
                                    onSelect={() =>
                                      setForm((f) => ({
                                        ...f,
                                        viaAdministracao: "Retal",
                                      }))
                                    }
                                  >
                                    <Pill className="mr-2 h-4 w-4" />
                                    Retal
                                  </CommandItem>
                                  <CommandItem
                                    value="Vaginal"
                                    onSelect={() =>
                                      setForm((f) => ({
                                        ...f,
                                        viaAdministracao: "Vaginal",
                                      }))
                                    }
                                  >
                                    <Pill className="mr-2 h-4 w-4" />
                                    Vaginal
                                  </CommandItem>
                                  <CommandItem
                                    value="Oftálmica"
                                    onSelect={() =>
                                      setForm((f) => ({
                                        ...f,
                                        viaAdministracao: "Oftálmica",
                                      }))
                                    }
                                  >
                                    <Pill className="mr-2 h-4 w-4" />
                                    Oftálmica
                                  </CommandItem>
                                  <CommandItem
                                    value="Otológica"
                                    onSelect={() =>
                                      setForm((f) => ({
                                        ...f,
                                        viaAdministracao: "Otológica",
                                      }))
                                    }
                                  >
                                    <Pill className="mr-2 h-4 w-4" />
                                    Otológica
                                  </CommandItem>
                                  <CommandItem
                                    value="Nasal"
                                    onSelect={() =>
                                      setForm((f) => ({
                                        ...f,
                                        viaAdministracao: "Nasal",
                                      }))
                                    }
                                  >
                                    <Pill className="mr-2 h-4 w-4" />
                                    Nasal
                                  </CommandItem>
                                  <CommandItem
                                    value="Outra"
                                    onSelect={() =>
                                      setForm((f) => ({
                                        ...f,
                                        viaAdministracao: "Outra",
                                      }))
                                    }
                                  >
                                    <Pill className="mr-2 h-4 w-4" />
                                    Outra
                                  </CommandItem>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="indicacao">Indicação</Label>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Indicação terapêutica para qual o medicamento
                                foi prescrito
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Input
                          id="indicacao"
                          placeholder="Indicação terapêutica"
                          value={form.indicacao}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              indicacao: e.target.value,
                            }))
                          }
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <Label>
                            O medicamento foi prescrito por profissional de
                            saúde?
                          </Label>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Indica se o medicamento foi prescrito por um
                                médico
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="flex flex-wrap gap-6 mt-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="prescrito-sim"
                              name="prescritoPeloMedico"
                              value="sim"
                              checked={form.prescritoPeloMedico === "sim"}
                              onChange={() =>
                                setForm((f) => ({
                                  ...f,
                                  prescritoPeloMedico: "sim",
                                }))
                              }
                              className="accent-teal-600 h-4 w-4"
                            />
                            <Label htmlFor="prescrito-sim">Sim</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="prescrito-nao"
                              name="prescritoPeloMedico"
                              value="nao"
                              checked={form.prescritoPeloMedico === "nao"}
                              onChange={() =>
                                setForm((f) => ({
                                  ...f,
                                  prescritoPeloMedico: "nao",
                                }))
                              }
                              className="accent-teal-600 h-4 w-4"
                            />
                            <Label htmlFor="prescrito-nao">Não</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="prescrito-nao-informado"
                              name="prescritoPeloMedico"
                              value="nao-informado"
                              checked={
                                form.prescritoPeloMedico === "nao-informado"
                              }
                              onChange={() =>
                                setForm((f) => ({
                                  ...f,
                                  prescritoPeloMedico: "nao-informado",
                                }))
                              }
                              className="accent-teal-600 h-4 w-4"
                            />
                            <Label htmlFor="prescrito-nao-informado">
                              Não informado
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="inicio-tratamento">
                              Início do Tratamento
                            </Label>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Data em que o tratamento com o medicamento foi
                                  iniciado
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <div className="flex gap-2">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="w-24 justify-between h-11 text-xs"
                                >
                                  <span>
                                    {form.tipoDataInicio === "mes-ano"
                                      ? "MM/AAAA"
                                      : "DD/MM/AAAA"}
                                  </span>
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                <Command>
                                  <CommandGroup>
                                    <CommandItem
                                      value="dia-mes-ano"
                                      onSelect={() =>
                                        setForm((f) => ({
                                          ...f,
                                          tipoDataInicio: "dia-mes-ano",
                                        }))
                                      }
                                    >
                                      DD/MM/AAAA
                                    </CommandItem>
                                    <CommandItem
                                      value="mes-ano"
                                      onSelect={() =>
                                        setForm((f) => ({
                                          ...f,
                                          tipoDataInicio: "mes-ano",
                                        }))
                                      }
                                    >
                                      MM/AAAA
                                    </CommandItem>
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <div className="relative flex-1">
                              <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="inicio-tratamento"
                                type={
                                  form.tipoDataInicio === "mes-ano"
                                    ? "month"
                                    : "date"
                                }
                                value={form.inicioTratamento}
                                onChange={(e) =>
                                  setForm((f) => ({
                                    ...f,
                                    inicioTratamento: e.target.value,
                                  }))
                                }
                                className="pl-8 h-11 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label>Tratamento em Andamento</Label>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Indica se o tratamento ainda está em andamento
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <div className="flex flex-wrap gap-6 mt-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="andamento-sim"
                                name="tratamentoEmAndamento"
                                value="sim"
                                checked={form.tratamentoEmAndamento === "sim"}
                                onChange={() =>
                                  setForm((f) => ({
                                    ...f,
                                    tratamentoEmAndamento: "sim",
                                    terminoTratamento: "",
                                  }))
                                }
                                className="accent-teal-600 h-4 w-4"
                              />
                              <Label
                                htmlFor="andamento-sim"
                                className="text-sm"
                              >
                                Sim
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="andamento-nao"
                                name="tratamentoEmAndamento"
                                value="nao"
                                checked={form.tratamentoEmAndamento === "nao"}
                                onChange={() =>
                                  setForm((f) => ({
                                    ...f,
                                    tratamentoEmAndamento: "nao",
                                  }))
                                }
                                className="accent-teal-600 h-4 w-4"
                              />
                              <Label
                                htmlFor="andamento-nao"
                                className="text-sm"
                              >
                                Não
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="andamento-nao-informado"
                                name="tratamentoEmAndamento"
                                value="nao-informado"
                                checked={
                                  form.tratamentoEmAndamento === "nao-informado"
                                }
                                onChange={() =>
                                  setForm((f) => ({
                                    ...f,
                                    tratamentoEmAndamento: "nao-informado",
                                    terminoTratamento: "",
                                  }))
                                }
                                className="accent-teal-600 h-4 w-4"
                              />
                              <Label
                                htmlFor="andamento-nao-informado"
                                className="text-sm"
                              >
                                Não informado
                              </Label>
                            </div>
                          </div>
                        </div>

                        {form.tratamentoEmAndamento === "nao" && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Label htmlFor="termino-tratamento">
                                Término do Tratamento
                              </Label>
                              <Tooltip>
                                <TooltipTrigger>
                                  <HelpCircle className="h-4 w-4 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Data em que o tratamento com o medicamento
                                    foi finalizado
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <div className="flex gap-2">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-24 justify-between h-11 text-xs"
                                  >
                                    <span>
                                      {form.tipoDataTermino === "mes-ano"
                                        ? "MM/AAAA"
                                        : "DD/MM/AAAA"}
                                    </span>
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                  <Command>
                                    <CommandGroup>
                                      <CommandItem
                                        value="dia-mes-ano"
                                        onSelect={() =>
                                          setForm((f) => ({
                                            ...f,
                                            tipoDataTermino: "dia-mes-ano",
                                          }))
                                        }
                                      >
                                        DD/MM/AAAA
                                      </CommandItem>
                                      <CommandItem
                                        value="mes-ano"
                                        onSelect={() =>
                                          setForm((f) => ({
                                            ...f,
                                            tipoDataTermino: "mes-ano",
                                          }))
                                        }
                                      >
                                        MM/AAAA
                                      </CommandItem>
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                              <div className="relative flex-1">
                                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  id="termino-tratamento"
                                  type={
                                    form.tipoDataTermino === "mes-ano"
                                      ? "month"
                                      : "date"
                                  }
                                  value={form.terminoTratamento}
                                  onChange={(e) =>
                                    setForm((f) => ({
                                      ...f,
                                      terminoTratamento: e.target.value,
                                    }))
                                  }
                                  className="pl-8 h-11 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </TooltipProvider>
                  </CardContent>
                </Card>

                {/* Dados do médico prescritor - Apenas se prescrito por profissional de saúde */}
                {form.prescritoPeloMedico === "sim" && (
                  <Card>
                    <CardHeader className="bg-gray-50 border-b">
                      <div className="flex items-center gap-2">
                        <User className="h-7 w-7 text-teal-600" />
                        <span className="text-xl font-bold">
                          Dados do médico prescritor
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome-medico" className="font-medium">
                            Nome completo{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="nome-medico"
                            placeholder="Nome do médico prescritor"
                            value={form.medicoPrescritor.nome}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                medicoPrescritor: {
                                  ...f.medicoPrescritor,
                                  nome: e.target.value,
                                },
                              }))
                            }
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="crm-medico" className="font-medium">
                            CRM <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="crm-medico"
                            placeholder="Número do CRM"
                            value={form.medicoPrescritor.crm}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                medicoPrescritor: {
                                  ...f.medicoPrescritor,
                                  crm: e.target.value,
                                },
                              }))
                            }
                            className="h-11"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="especialidade-medico"
                          className="font-medium"
                        >
                          Especialidade
                        </Label>
                        <Input
                          id="especialidade-medico"
                          placeholder="Especialidade médica"
                          value={form.medicoPrescritor.especialidade}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              medicoPrescritor: {
                                ...f.medicoPrescritor,
                                especialidade: e.target.value,
                              },
                            }))
                          }
                          className="h-11"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="telefone-medico"
                            className="font-medium"
                          >
                            Telefone
                          </Label>
                          <Input
                            id="telefone-medico"
                            placeholder="(11) 99999-9999"
                            value={form.medicoPrescritor.telefone}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                medicoPrescritor: {
                                  ...f.medicoPrescritor,
                                  telefone: e.target.value,
                                },
                              }))
                            }
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email-medico" className="font-medium">
                            Email
                          </Label>
                          <Input
                            id="email-medico"
                            type="email"
                            placeholder="email@exemplo.com"
                            value={form.medicoPrescritor.email}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                medicoPrescritor: {
                                  ...f.medicoPrescritor,
                                  email: e.target.value,
                                },
                              }))
                            }
                            className="h-11"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Evento Adverso */}
                <Card>
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex items-center gap-2">
                      <Info className="h-7 w-7 text-teal-600" />
                      <span className="text-xl font-bold">Evento Adverso</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    {/* Cabeçalho com botão Adicionar Evento */}
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          Eventos Adversos
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Adicione informações sobre eventos adversos
                          relacionados ao medicamento
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex items-center gap-2 text-teal-600 border-teal-300 hover:bg-teal-50"
                        onClick={adicionarEventoAdverso}
                      >
                        <Plus className="h-4 w-4" />
                        Adicionar Evento
                      </Button>
                    </div>

                    {/* Lista de Eventos Adversos */}
                    <div className="space-y-8">
                      {eventosAdversos.map((evento, index) => (
                        <div
                          key={evento.id}
                          className="border border-gray-200 rounded-lg p-6 bg-gray-50/50"
                        >
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="font-semibold text-gray-900 text-lg">
                              Evento {index + 1}
                            </h4>
                            {eventosAdversos.length > 1 && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removerEventoAdverso(evento.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          {/* Campos básicos do evento em grid */}
                          <div
                            className={`grid grid-cols-1 gap-6 mb-6 ${
                              evento.resultadoEvento === "Recuperado"
                                ? "lg:grid-cols-3"
                                : "lg:grid-cols-2"
                            }`}
                          >
                            {/* Evento adverso */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <Label className="font-medium text-gray-700 text-base">
                                  Evento adverso
                                </Label>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Selecione o evento adverso apresentado
                                      pelo paciente
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between h-12 text-base"
                                  >
                                    <span className="truncate">
                                      {evento.eventoAdverso || "Selecione"}
                                    </span>
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                  <Command>
                                    <CommandInput placeholder="Buscar evento..." />
                                    <CommandEmpty>
                                      Nenhum evento encontrado.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      <CommandItem
                                        value="Náusea"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "eventoAdverso",
                                            "Náusea"
                                          )
                                        }
                                      >
                                        Náusea
                                      </CommandItem>
                                      <CommandItem
                                        value="Vômito"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "eventoAdverso",
                                            "Vômito"
                                          )
                                        }
                                      >
                                        Vômito
                                      </CommandItem>
                                      <CommandItem
                                        value="Dor de cabeça"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "eventoAdverso",
                                            "Dor de cabeça"
                                          )
                                        }
                                      >
                                        Dor de cabeça
                                      </CommandItem>
                                      <CommandItem
                                        value="Erupção cutânea"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "eventoAdverso",
                                            "Erupção cutânea"
                                          )
                                        }
                                      >
                                        Erupção cutânea
                                      </CommandItem>
                                      <CommandItem
                                        value="Outro"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "eventoAdverso",
                                            "Outro"
                                          )
                                        }
                                      >
                                        Outro
                                      </CommandItem>
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </div>

                            {/* Data inicial */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <Label className="font-medium text-gray-700 text-base">
                                  Data inicial
                                </Label>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Data de início do evento adverso</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <div className="flex gap-3">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className="w-32 justify-between h-12 text-sm border-gray-300"
                                    >
                                      <span>
                                        {evento.tipoDataInicialEvento ===
                                        "mes-ano"
                                          ? "MM/AAAA"
                                          : "DD/MM/AAAA"}
                                      </span>
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                    <Command>
                                      <CommandGroup>
                                        <CommandItem
                                          value="dia-mes-ano"
                                          onSelect={() =>
                                            atualizarEventoAdverso(
                                              evento.id,
                                              "tipoDataInicialEvento",
                                              "dia-mes-ano"
                                            )
                                          }
                                        >
                                          DD/MM/AAAA
                                        </CommandItem>
                                        <CommandItem
                                          value="mes-ano"
                                          onSelect={() =>
                                            atualizarEventoAdverso(
                                              evento.id,
                                              "tipoDataInicialEvento",
                                              "mes-ano"
                                            )
                                          }
                                        >
                                          MM/AAAA
                                        </CommandItem>
                                      </CommandGroup>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                                <div className="relative flex-1 min-w-0">
                                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                  <Input
                                    type={
                                      evento.tipoDataInicialEvento === "mes-ano"
                                        ? "month"
                                        : "date"
                                    }
                                    value={evento.dataInicialEvento || ""}
                                    onChange={(e) =>
                                      atualizarEventoAdverso(
                                        evento.id,
                                        "dataInicialEvento",
                                        e.target.value
                                      )
                                    }
                                    className="pl-10 h-12 text-base [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Data final */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <Label className="font-medium text-gray-700 text-base">
                                  Data final
                                </Label>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Data de término do evento adverso</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <div className="flex gap-3">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className="w-32 justify-between h-12 text-sm border-gray-300"
                                    >
                                      <span>
                                        {evento.tipoDataFinalEvento ===
                                        "mes-ano"
                                          ? "MM/AAAA"
                                          : "DD/MM/AAAA"}
                                      </span>
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                    <Command>
                                      <CommandGroup>
                                        <CommandItem
                                          value="dia-mes-ano"
                                          onSelect={() =>
                                            atualizarEventoAdverso(
                                              evento.id,
                                              "tipoDataFinalEvento",
                                              "dia-mes-ano"
                                            )
                                          }
                                        >
                                          DD/MM/AAAA
                                        </CommandItem>
                                        <CommandItem
                                          value="mes-ano"
                                          onSelect={() =>
                                            atualizarEventoAdverso(
                                              evento.id,
                                              "tipoDataFinalEvento",
                                              "mes-ano"
                                            )
                                          }
                                        >
                                          MM/AAAA
                                        </CommandItem>
                                      </CommandGroup>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                                <div className="relative flex-1 min-w-0">
                                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                  <Input
                                    type={
                                      evento.tipoDataFinalEvento === "mes-ano"
                                        ? "month"
                                        : "date"
                                    }
                                    value={evento.dataFinalEvento || ""}
                                    onChange={(e) =>
                                      atualizarEventoAdverso(
                                        evento.id,
                                        "dataFinalEvento",
                                        e.target.value
                                      )
                                    }
                                    className="pl-10 h-12 text-base [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Segunda linha de campos */}
                          <div
                            className={`grid grid-cols-1 gap-6 mb-6 ${
                              evento.resultadoEvento === "Recuperado"
                                ? "lg:grid-cols-3"
                                : "lg:grid-cols-2"
                            }`}
                          >
                            {/* Resultado */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <Label className="font-medium text-gray-700 text-base">
                                  Resultado
                                </Label>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Resultado do evento adverso</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between h-12 text-base"
                                  >
                                    <span className="truncate">
                                      {evento.resultadoEvento || "Selecione"}
                                    </span>
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                  <Command>
                                    <CommandGroup>
                                      <CommandItem
                                        value="Recuperado"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "resultadoEvento",
                                            "Recuperado"
                                          )
                                        }
                                      >
                                        Recuperado
                                      </CommandItem>
                                      <CommandItem
                                        value="Não recuperado"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "resultadoEvento",
                                            "Não recuperado"
                                          )
                                        }
                                      >
                                        Não recuperado
                                      </CommandItem>
                                      <CommandItem
                                        value="Não informado"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "resultadoEvento",
                                            "Não informado"
                                          )
                                        }
                                      >
                                        Não informado
                                      </CommandItem>
                                      <CommandItem
                                        value="Não se aplica"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "resultadoEvento",
                                            "Não se aplica"
                                          )
                                        }
                                      >
                                        Não se aplica
                                      </CommandItem>
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </div>

                            {/* Relação do medicamento */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <Label className="font-medium text-gray-700 text-base">
                                  Relação do medicamento com o EA
                                </Label>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Selecione a relação entre o evento adverso
                                      e o medicamento suspeito
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between h-12 text-base"
                                  >
                                    <span className="truncate">
                                      {evento.relacaoEventoMedicamento ||
                                        "Selecione"}
                                    </span>
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                  <Command>
                                    <CommandGroup>
                                      <CommandItem
                                        value="Muito provável"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "relacaoEventoMedicamento",
                                            "Muito provável"
                                          )
                                        }
                                      >
                                        Muito provável
                                      </CommandItem>
                                      <CommandItem
                                        value="Provável"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "relacaoEventoMedicamento",
                                            "Provável"
                                          )
                                        }
                                      >
                                        Provável
                                      </CommandItem>
                                      <CommandItem
                                        value="Duvidosa"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "relacaoEventoMedicamento",
                                            "Duvidosa"
                                          )
                                        }
                                      >
                                        Duvidosa
                                      </CommandItem>
                                      <CommandItem
                                        value="Não se aplica"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "relacaoEventoMedicamento",
                                            "Não se aplica"
                                          )
                                        }
                                      >
                                        Não se aplica
                                      </CommandItem>
                                      <CommandItem
                                        value="Não informado"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "relacaoEventoMedicamento",
                                            "Não informado"
                                          )
                                        }
                                      >
                                        Não informado
                                      </CommandItem>
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </div>

                            {/* Sequelas (condicional) */}
                            {evento.resultadoEvento === "Recuperado" && (
                              <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <Label className="font-medium text-gray-700 text-base">
                                    Sequelas
                                  </Label>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <HelpCircle className="h-4 w-4 text-gray-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        O paciente apresentou sequelas após
                                        recuperação?
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className="w-full justify-between h-12 text-base"
                                    >
                                      <span className="truncate">
                                        {evento.sequelas || "Selecione"}
                                      </span>
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                    <Command>
                                      <CommandGroup>
                                        <CommandItem
                                          value="Sim"
                                          onSelect={() =>
                                            atualizarEventoAdverso(
                                              evento.id,
                                              "sequelas",
                                              "Sim"
                                            )
                                          }
                                        >
                                          Sim
                                        </CommandItem>
                                        <CommandItem
                                          value="Não"
                                          onSelect={() =>
                                            atualizarEventoAdverso(
                                              evento.id,
                                              "sequelas",
                                              "Não"
                                            )
                                          }
                                        >
                                          Não
                                        </CommandItem>
                                        <CommandItem
                                          value="Não informado"
                                          onSelect={() =>
                                            atualizarEventoAdverso(
                                              evento.id,
                                              "sequelas",
                                              "Não informado"
                                            )
                                          }
                                        >
                                          Não informado
                                        </CommandItem>
                                      </CommandGroup>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            )}
                          </div>

                          {/* Campos adicionais */}
                          <div className="space-y-6">
                            {/* Informou o médico */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <Label className="font-medium text-gray-700 text-base">
                                  O paciente comunicou o evento adverso ao
                                  profissional prescritor?
                                </Label>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      O paciente informou o médico sobre o
                                      evento adverso?
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between h-12 text-base"
                                  >
                                    <span>
                                      {evento.informouMedico || "Selecione"}
                                    </span>
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                  <Command>
                                    <CommandGroup>
                                      <CommandItem
                                        value="Sim"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "informouMedico",
                                            "Sim"
                                          )
                                        }
                                      >
                                        Sim
                                      </CommandItem>
                                      <CommandItem
                                        value="Não"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "informouMedico",
                                            "Não"
                                          )
                                        }
                                      >
                                        Não
                                      </CommandItem>
                                      <CommandItem
                                        value="Não informado"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "informouMedico",
                                            "Não informado"
                                          )
                                        }
                                      >
                                        Não informado
                                      </CommandItem>
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                              {evento.informouMedico === "Sim" && (
                                <div className="mt-4">
                                  <Label className="font-medium text-gray-700 text-base">
                                    Orientação médica
                                  </Label>
                                  <Input
                                    placeholder="Descreva a orientação médica recebida"
                                    value={evento.orientacaoMedica}
                                    onChange={(e) =>
                                      atualizarEventoAdverso(
                                        evento.id,
                                        "orientacaoMedica",
                                        e.target.value
                                      )
                                    }
                                    className="h-12 text-base mt-2"
                                  />
                                </div>
                              )}
                            </div>

                            {/* Ação tomada */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <Label className="font-medium text-gray-700 text-base">
                                  Conduta adotada em relação ao uso do
                                  medicamento após o evento adverso:
                                </Label>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Selecione a ação tomada em relação ao
                                      medicamento
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between h-12 text-base"
                                  >
                                    <span>
                                      {evento.acaoTomada || "Selecione"}
                                    </span>
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                  <Command>
                                    <CommandGroup>
                                      <CommandItem
                                        value="Dose mantida"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "acaoTomada",
                                            "Dose mantida"
                                          )
                                        }
                                      >
                                        Dose mantida
                                      </CommandItem>
                                      <CommandItem
                                        value="Dose aumentada"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "acaoTomada",
                                            "Dose aumentada"
                                          )
                                        }
                                      >
                                        Dose aumentada
                                      </CommandItem>
                                      <CommandItem
                                        value="Interrupção do tratamento"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "acaoTomada",
                                            "Interrupção do tratamento"
                                          )
                                        }
                                      >
                                        Interrupção do tratamento
                                      </CommandItem>
                                      <CommandItem
                                        value="Não informado"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "acaoTomada",
                                            "Não informado"
                                          )
                                        }
                                      >
                                        Não informado
                                      </CommandItem>
                                      <CommandItem
                                        value="Não se aplica"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "acaoTomada",
                                            "Não se aplica"
                                          )
                                        }
                                      >
                                        Não se aplica
                                      </CommandItem>
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                              {evento.acaoTomada ===
                                "Interrupção do tratamento" && (
                                <div className="mt-4">
                                  <div className="flex items-center gap-2">
                                    <Label className="font-medium text-gray-700 text-base">
                                      O evento adverso melhorou após a
                                      descontinuação do medicamento?
                                    </Label>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <HelpCircle className="h-4 w-4 text-gray-400" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          Selecione se houve melhora após a
                                          retirada do medicamento
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className="w-full justify-between h-12 text-base mt-2"
                                      >
                                        <span>
                                          {evento.melhorouAposRetirada ||
                                            "Selecione"}
                                        </span>
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                      <Command>
                                        <CommandGroup>
                                          <CommandItem
                                            value="Sim"
                                            onSelect={() =>
                                              atualizarEventoAdverso(
                                                evento.id,
                                                "melhorouAposRetirada",
                                                "Sim"
                                              )
                                            }
                                          >
                                            Sim
                                          </CommandItem>
                                          <CommandItem
                                            value="Não"
                                            onSelect={() =>
                                              atualizarEventoAdverso(
                                                evento.id,
                                                "melhorouAposRetirada",
                                                "Não"
                                              )
                                            }
                                          >
                                            Não
                                          </CommandItem>
                                          <CommandItem
                                            value="Não informado"
                                            onSelect={() =>
                                              atualizarEventoAdverso(
                                                evento.id,
                                                "melhorouAposRetirada",
                                                "Não informado"
                                              )
                                            }
                                          >
                                            Não informado
                                          </CommandItem>
                                          <CommandItem
                                            value="Não se aplica"
                                            onSelect={() =>
                                              atualizarEventoAdverso(
                                                evento.id,
                                                "melhorouAposRetirada",
                                                "Não se aplica"
                                              )
                                            }
                                          >
                                            Não se aplica
                                          </CommandItem>
                                        </CommandGroup>
                                      </Command>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              )}
                            </div>

                            {/* Voltou após retorno */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <Label className="font-medium text-gray-700 text-base">
                                  O evento adverso retornou após a reintrodução
                                  do medicamento?
                                </Label>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Selecione se o evento adverso voltou após
                                      o retorno do tratamento
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between h-12 text-base"
                                  >
                                    <span>
                                      {evento.voltouAposRetorno || "Selecione"}
                                    </span>
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                  <Command>
                                    <CommandGroup>
                                      <CommandItem
                                        value="Sim"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "voltouAposRetorno",
                                            "Sim"
                                          )
                                        }
                                      >
                                        Sim
                                      </CommandItem>
                                      <CommandItem
                                        value="Não"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "voltouAposRetorno",
                                            "Não"
                                          )
                                        }
                                      >
                                        Não
                                      </CommandItem>
                                      <CommandItem
                                        value="Não informado"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "voltouAposRetorno",
                                            "Não informado"
                                          )
                                        }
                                      >
                                        Não informado
                                      </CommandItem>
                                      <CommandItem
                                        value="Não se aplica"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "voltouAposRetorno",
                                            "Não se aplica"
                                          )
                                        }
                                      >
                                        Não se aplica
                                      </CommandItem>
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </div>

                            {/* Medicamento para tratamento */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <Label className="font-medium text-gray-700 text-base">
                                  Foi utilizado medicamento para o tratamento do
                                  Evento Adverso?
                                </Label>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Selecione se foi utilizado algum
                                      medicamento para tratar o evento adverso
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between h-12 text-base"
                                  >
                                    <span>
                                      {evento.usouMedicamentoTratamento ||
                                        "Selecione"}
                                    </span>
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                  <Command>
                                    <CommandGroup>
                                      <CommandItem
                                        value="Sim"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "usouMedicamentoTratamento",
                                            "Sim"
                                          )
                                        }
                                      >
                                        Sim
                                      </CommandItem>
                                      <CommandItem
                                        value="Não"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "usouMedicamentoTratamento",
                                            "Não"
                                          )
                                        }
                                      >
                                        Não
                                      </CommandItem>
                                      <CommandItem
                                        value="Não informado"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "usouMedicamentoTratamento",
                                            "Não informado"
                                          )
                                        }
                                      >
                                        Não informado
                                      </CommandItem>
                                      <CommandItem
                                        value="Não se aplica"
                                        onSelect={() =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "usouMedicamentoTratamento",
                                            "Não se aplica"
                                          )
                                        }
                                      >
                                        Não se aplica
                                      </CommandItem>
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>

                              {/* Campos de medicamento para tratamento (condicionais) */}
                              {evento.usouMedicamentoTratamento === "Sim" && (
                                <div className="mt-6 p-4 bg-blue-50/60 border border-blue-100 rounded-lg">
                                  <div className="flex items-center gap-2 mb-4">
                                    <Pill className="h-5 w-5 text-blue-600" />
                                    <Label className="text-base font-semibold text-blue-900">
                                      Medicamento Utilizado para Tratamento
                                    </Label>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Label className="text-sm font-medium text-gray-700">
                                          Produto
                                        </Label>
                                        <Tooltip>
                                          <TooltipTrigger>
                                            <HelpCircle className="h-4 w-4 text-gray-400" />
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>
                                              Nome do medicamento utilizado para
                                              tratar o evento adverso
                                            </p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </div>
                                      <Input
                                        placeholder="Nome do produto"
                                        value={
                                          evento.medicamentoTratamento.produto
                                        }
                                        onChange={(e) =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "medicamentoTratamento",
                                            e.target.value,
                                            "produto"
                                          )
                                        }
                                        className="h-11"
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Label className="text-sm font-medium text-gray-700">
                                          EAN
                                        </Label>
                                        <Tooltip>
                                          <TooltipTrigger>
                                            <HelpCircle className="h-4 w-4 text-gray-400" />
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>
                                              Código de barras EAN do produto
                                            </p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </div>
                                      <Input
                                        placeholder="Código EAN"
                                        value={evento.medicamentoTratamento.ean}
                                        onChange={(e) =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "medicamentoTratamento",
                                            e.target.value,
                                            "ean"
                                          )
                                        }
                                        className="h-11"
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Label className="text-sm font-medium text-gray-700">
                                          Lote
                                        </Label>
                                        <Tooltip>
                                          <TooltipTrigger>
                                            <HelpCircle className="h-4 w-4 text-gray-400" />
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Número do lote do medicamento</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </div>
                                      <Input
                                        placeholder="Número do lote"
                                        value={
                                          evento.medicamentoTratamento.lote
                                        }
                                        onChange={(e) =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "medicamentoTratamento",
                                            e.target.value,
                                            "lote"
                                          )
                                        }
                                        className="h-11"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Label className="text-sm font-medium text-gray-700">
                                          Dosagem
                                        </Label>
                                        <Tooltip>
                                          <TooltipTrigger>
                                            <HelpCircle className="h-4 w-4 text-gray-400" />
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>
                                              Dose administrada do medicamento
                                              (ex: 500mg, 10ml)
                                            </p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </div>
                                      <Input
                                        placeholder="Ex: 500mg"
                                        value={
                                          evento.medicamentoTratamento.dosagem
                                        }
                                        onChange={(e) =>
                                          atualizarEventoAdverso(
                                            evento.id,
                                            "medicamentoTratamento",
                                            e.target.value,
                                            "dosagem"
                                          )
                                        }
                                        className="h-11"
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Label className="text-sm font-medium text-gray-700">
                                          Via de Administração
                                        </Label>
                                        <Tooltip>
                                          <TooltipTrigger>
                                            <HelpCircle className="h-4 w-4 text-gray-400" />
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>
                                              Via pela qual o medicamento foi
                                              administrado
                                            </p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </div>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between h-11"
                                          >
                                            <div className="flex items-center gap-2">
                                              <Pill className="h-4 w-4 text-teal-600" />
                                              <span>
                                                {evento.medicamentoTratamento
                                                  .viaAdministracao ||
                                                  "Selecione a via de administração"}
                                              </span>
                                            </div>
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                          <Command>
                                            <CommandInput placeholder="Buscar via de administração..." />
                                            <CommandEmpty>
                                              Nenhuma via encontrada.
                                            </CommandEmpty>
                                            <CommandGroup>
                                              <CommandItem
                                                value="Oral"
                                                onSelect={() =>
                                                  atualizarEventoAdverso(
                                                    evento.id,
                                                    "medicamentoTratamento",
                                                    "Oral",
                                                    "viaAdministracao"
                                                  )
                                                }
                                              >
                                                <Pill className="mr-2 h-4 w-4" />
                                                Oral
                                              </CommandItem>
                                              <CommandItem
                                                value="Intravenosa"
                                                onSelect={() =>
                                                  atualizarEventoAdverso(
                                                    evento.id,
                                                    "medicamentoTratamento",
                                                    "Intravenosa",
                                                    "viaAdministracao"
                                                  )
                                                }
                                              >
                                                <Pill className="mr-2 h-4 w-4" />
                                                Intravenosa
                                              </CommandItem>
                                              <CommandItem
                                                value="Intramuscular"
                                                onSelect={() =>
                                                  atualizarEventoAdverso(
                                                    evento.id,
                                                    "medicamentoTratamento",
                                                    "Intramuscular",
                                                    "viaAdministracao"
                                                  )
                                                }
                                              >
                                                <Pill className="mr-2 h-4 w-4" />
                                                Intramuscular
                                              </CommandItem>
                                              <CommandItem
                                                value="Subcutânea"
                                                onSelect={() =>
                                                  atualizarEventoAdverso(
                                                    evento.id,
                                                    "medicamentoTratamento",
                                                    "Subcutânea",
                                                    "viaAdministracao"
                                                  )
                                                }
                                              >
                                                <Pill className="mr-2 h-4 w-4" />
                                                Subcutânea
                                              </CommandItem>
                                              <CommandItem
                                                value="Tópica"
                                                onSelect={() =>
                                                  atualizarEventoAdverso(
                                                    evento.id,
                                                    "medicamentoTratamento",
                                                    "Tópica",
                                                    "viaAdministracao"
                                                  )
                                                }
                                              >
                                                <Pill className="mr-2 h-4 w-4" />
                                                Tópica
                                              </CommandItem>
                                              <CommandItem
                                                value="Inalatória"
                                                onSelect={() =>
                                                  atualizarEventoAdverso(
                                                    evento.id,
                                                    "medicamentoTratamento",
                                                    "Inalatória",
                                                    "viaAdministracao"
                                                  )
                                                }
                                              >
                                                <Pill className="mr-2 h-4 w-4" />
                                                Inalatória
                                              </CommandItem>
                                              <CommandItem
                                                value="Retal"
                                                onSelect={() =>
                                                  atualizarEventoAdverso(
                                                    evento.id,
                                                    "medicamentoTratamento",
                                                    "Retal",
                                                    "viaAdministracao"
                                                  )
                                                }
                                              >
                                                <Pill className="mr-2 h-4 w-4" />
                                                Retal
                                              </CommandItem>
                                              <CommandItem
                                                value="Vaginal"
                                                onSelect={() =>
                                                  atualizarEventoAdverso(
                                                    evento.id,
                                                    "medicamentoTratamento",
                                                    "Vaginal",
                                                    "viaAdministracao"
                                                  )
                                                }
                                              >
                                                <Pill className="mr-2 h-4 w-4" />
                                                Vaginal
                                              </CommandItem>
                                              <CommandItem
                                                value="Oftálmica"
                                                onSelect={() =>
                                                  atualizarEventoAdverso(
                                                    evento.id,
                                                    "medicamentoTratamento",
                                                    "Oftálmica",
                                                    "viaAdministracao"
                                                  )
                                                }
                                              >
                                                <Pill className="mr-2 h-4 w-4" />
                                                Oftálmica
                                              </CommandItem>
                                              <CommandItem
                                                value="Otológica"
                                                onSelect={() =>
                                                  atualizarEventoAdverso(
                                                    evento.id,
                                                    "medicamentoTratamento",
                                                    "Otológica",
                                                    "viaAdministracao"
                                                  )
                                                }
                                              >
                                                <Pill className="mr-2 h-4 w-4" />
                                                Otológica
                                              </CommandItem>
                                              <CommandItem
                                                value="Nasal"
                                                onSelect={() =>
                                                  atualizarEventoAdverso(
                                                    evento.id,
                                                    "medicamentoTratamento",
                                                    "Nasal",
                                                    "viaAdministracao"
                                                  )
                                                }
                                              >
                                                <Pill className="mr-2 h-4 w-4" />
                                                Nasal
                                              </CommandItem>
                                              <CommandItem
                                                value="Outra"
                                                onSelect={() =>
                                                  atualizarEventoAdverso(
                                                    evento.id,
                                                    "medicamentoTratamento",
                                                    "Outra",
                                                    "viaAdministracao"
                                                  )
                                                }
                                              >
                                                <Pill className="mr-2 h-4 w-4" />
                                                Outra
                                              </CommandItem>
                                            </CommandGroup>
                                          </Command>
                                        </PopoverContent>
                                      </Popover>
                                    </div>
                                  </div>

                                  <div className="space-y-2 mt-4">
                                    <div className="flex items-center gap-2">
                                      <Label className="text-sm font-medium text-gray-700">
                                        Indicação
                                      </Label>
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <HelpCircle className="h-4 w-4 text-gray-400" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>
                                            Indicação terapêutica para qual o
                                            medicamento foi utilizado
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>
                                    <Input
                                      placeholder="Indicação terapêutica"
                                      value={
                                        evento.medicamentoTratamento.indicacao
                                      }
                                      onChange={(e) =>
                                        atualizarEventoAdverso(
                                          evento.id,
                                          "medicamentoTratamento",
                                          e.target.value,
                                          "indicacao"
                                        )
                                      }
                                      className="h-11"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Medicamento Concomitante */}
                <Card>
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex items-center gap-2">
                      <Pill className="h-7 w-7 text-teal-600" />
                      <span className="text-xl font-bold">
                        Medicamentos Concomitantes
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    {/* Cabeçalho com botão Adicionar Medicamento */}
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          Medicamentos Concomitantes
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Adicione medicamentos utilizados concomitantemente
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex items-center gap-2 text-teal-600 border-teal-300 hover:bg-teal-50"
                        onClick={adicionarMedicamentoConcomitante}
                      >
                        <Plus className="h-4 w-4" />
                        Adicionar Medicamento
                      </Button>
                    </div>

                    {/* Lista de Medicamentos Concomitantes */}
                    <div className="space-y-8">
                      {medicamentosConcomitantes.map((medicamento, index) => (
                        <div
                          key={medicamento.id}
                          className="border border-gray-200 rounded-lg p-6 bg-gray-50/50"
                        >
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="font-semibold text-gray-900 text-lg">
                              Medicamento {index + 1}
                            </h4>
                            {medicamentosConcomitantes.length > 1 && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  removerMedicamentoConcomitante(medicamento.id)
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Label
                                  htmlFor={`produto-concomitante-${medicamento.id}`}
                                >
                                  Produto
                                </Label>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Nome do medicamento concomitante</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <Input
                                id={`produto-concomitante-${medicamento.id}`}
                                placeholder="Nome do produto"
                                value={medicamento.produto}
                                onChange={(e) =>
                                  atualizarMedicamentoConcomitante(
                                    medicamento.id,
                                    "produto",
                                    e.target.value
                                  )
                                }
                                className="h-11"
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Label
                                  htmlFor={`ean-concomitante-${medicamento.id}`}
                                >
                                  EAN
                                </Label>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Código de barras EAN do produto</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <Input
                                id={`ean-concomitante-${medicamento.id}`}
                                placeholder="Código EAN"
                                value={medicamento.ean}
                                onChange={(e) =>
                                  atualizarMedicamentoConcomitante(
                                    medicamento.id,
                                    "ean",
                                    e.target.value
                                  )
                                }
                                className="h-11"
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Label
                                  htmlFor={`lote-concomitante-${medicamento.id}`}
                                >
                                  Lote
                                </Label>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Número do lote do medicamento</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <Input
                                id={`lote-concomitante-${medicamento.id}`}
                                placeholder="Número do lote"
                                value={medicamento.lote}
                                onChange={(e) =>
                                  atualizarMedicamentoConcomitante(
                                    medicamento.id,
                                    "lote",
                                    e.target.value
                                  )
                                }
                                className="h-11"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Label
                                  htmlFor={`dosagem-concomitante-${medicamento.id}`}
                                >
                                  Dosagem
                                </Label>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Dose administrada do medicamento (ex:
                                      500mg, 10ml)
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <Input
                                id={`dosagem-concomitante-${medicamento.id}`}
                                placeholder="Ex: 500mg"
                                value={medicamento.dosagem}
                                onChange={(e) =>
                                  atualizarMedicamentoConcomitante(
                                    medicamento.id,
                                    "dosagem",
                                    e.target.value
                                  )
                                }
                                className="h-11"
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Label
                                  htmlFor={`via-administracao-concomitante-${medicamento.id}`}
                                >
                                  Via de Administração
                                </Label>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Via pela qual o medicamento foi
                                      administrado
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between h-11"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Pill className="h-4 w-4 text-teal-600" />
                                      <span>
                                        {medicamento.viaAdministracao ||
                                          "Selecione a via de administração"}
                                      </span>
                                    </div>
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                  <Command>
                                    <CommandInput placeholder="Buscar via de administração..." />
                                    <CommandEmpty>
                                      Nenhuma via encontrada.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      <CommandItem
                                        value="Oral"
                                        onSelect={() =>
                                          atualizarMedicamentoConcomitante(
                                            medicamento.id,
                                            "viaAdministracao",
                                            "Oral"
                                          )
                                        }
                                      >
                                        <Pill className="mr-2 h-4 w-4" />
                                        Oral
                                      </CommandItem>
                                      <CommandItem
                                        value="Intravenosa"
                                        onSelect={() =>
                                          atualizarMedicamentoConcomitante(
                                            medicamento.id,
                                            "viaAdministracao",
                                            "Intravenosa"
                                          )
                                        }
                                      >
                                        <Pill className="mr-2 h-4 w-4" />
                                        Intravenosa
                                      </CommandItem>
                                      <CommandItem
                                        value="Intramuscular"
                                        onSelect={() =>
                                          atualizarMedicamentoConcomitante(
                                            medicamento.id,
                                            "viaAdministracao",
                                            "Intramuscular"
                                          )
                                        }
                                      >
                                        <Pill className="mr-2 h-4 w-4" />
                                        Intramuscular
                                      </CommandItem>
                                      <CommandItem
                                        value="Subcutânea"
                                        onSelect={() =>
                                          atualizarMedicamentoConcomitante(
                                            medicamento.id,
                                            "viaAdministracao",
                                            "Subcutânea"
                                          )
                                        }
                                      >
                                        <Pill className="mr-2 h-4 w-4" />
                                        Subcutânea
                                      </CommandItem>
                                      <CommandItem
                                        value="Tópica"
                                        onSelect={() =>
                                          atualizarMedicamentoConcomitante(
                                            medicamento.id,
                                            "viaAdministracao",
                                            "Tópica"
                                          )
                                        }
                                      >
                                        <Pill className="mr-2 h-4 w-4" />
                                        Tópica
                                      </CommandItem>
                                      <CommandItem
                                        value="Inalatória"
                                        onSelect={() =>
                                          atualizarMedicamentoConcomitante(
                                            medicamento.id,
                                            "viaAdministracao",
                                            "Inalatória"
                                          )
                                        }
                                      >
                                        <Pill className="mr-2 h-4 w-4" />
                                        Inalatória
                                      </CommandItem>
                                      <CommandItem
                                        value="Retal"
                                        onSelect={() =>
                                          atualizarMedicamentoConcomitante(
                                            medicamento.id,
                                            "viaAdministracao",
                                            "Retal"
                                          )
                                        }
                                      >
                                        <Pill className="mr-2 h-4 w-4" />
                                        Retal
                                      </CommandItem>
                                      <CommandItem
                                        value="Vaginal"
                                        onSelect={() =>
                                          atualizarMedicamentoConcomitante(
                                            medicamento.id,
                                            "viaAdministracao",
                                            "Vaginal"
                                          )
                                        }
                                      >
                                        <Pill className="mr-2 h-4 w-4" />
                                        Vaginal
                                      </CommandItem>
                                      <CommandItem
                                        value="Oftálmica"
                                        onSelect={() =>
                                          atualizarMedicamentoConcomitante(
                                            medicamento.id,
                                            "viaAdministracao",
                                            "Oftálmica"
                                          )
                                        }
                                      >
                                        <Pill className="mr-2 h-4 w-4" />
                                        Oftálmica
                                      </CommandItem>
                                      <CommandItem
                                        value="Otológica"
                                        onSelect={() =>
                                          atualizarMedicamentoConcomitante(
                                            medicamento.id,
                                            "viaAdministracao",
                                            "Otológica"
                                          )
                                        }
                                      >
                                        <Pill className="mr-2 h-4 w-4" />
                                        Otológica
                                      </CommandItem>
                                      <CommandItem
                                        value="Nasal"
                                        onSelect={() =>
                                          atualizarMedicamentoConcomitante(
                                            medicamento.id,
                                            "viaAdministracao",
                                            "Nasal"
                                          )
                                        }
                                      >
                                        <Pill className="mr-2 h-4 w-4" />
                                        Nasal
                                      </CommandItem>
                                      <CommandItem
                                        value="Outra"
                                        onSelect={() =>
                                          atualizarMedicamentoConcomitante(
                                            medicamento.id,
                                            "viaAdministracao",
                                            "Outra"
                                          )
                                        }
                                      >
                                        <Pill className="mr-2 h-4 w-4" />
                                        Outra
                                      </CommandItem>
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>

                          <div className="space-y-2 mt-4">
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor={`indicacao-concomitante-${medicamento.id}`}
                              >
                                Indicação
                              </Label>
                              <Tooltip>
                                <TooltipTrigger>
                                  <HelpCircle className="h-4 w-4 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Indicação terapêutica para qual o
                                    medicamento foi utilizado
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <Input
                              id={`indicacao-concomitante-${medicamento.id}`}
                              placeholder="Indicação terapêutica"
                              value={medicamento.indicacao}
                              onChange={(e) =>
                                atualizarMedicamentoConcomitante(
                                  medicamento.id,
                                  "indicacao",
                                  e.target.value
                                )
                              }
                              className="h-11"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Campos de farmacovigilância abaixo (mantidos) */}
                <Card>
                  <CardHeader>
                    <CardTitle>Dados de Farmacovigilância</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Data do recebimento */}
                    <div className="space-y-2">
                      <Label htmlFor="data-recebimento" className="font-medium">
                        Data do recebimento
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="data-recebimento"
                          type="date"
                          value={form.dataRecebimento}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              dataRecebimento: e.target.value,
                            }))
                          }
                          className="pl-8 h-11 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                        />
                      </div>
                    </div>
                    {/* Narrativa */}
                    <div className="space-y-2">
                      <Label className="font-medium">Narrativa</Label>
                      <Textarea
                        placeholder="Descreva detalhadamente a situação, fatos e contexto..."
                        value={form.narrativa}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, narrativa: e.target.value }))
                        }
                        className="min-h-[120px]"
                      />
                    </div>
                    {/* Anexos */}
                    <div className="space-y-2">
                      <Label className="font-medium">Anexos</Label>
                      <input
                        type="file"
                        multiple
                        className="block"
                        onChange={handleFileChange}
                        accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {form.anexos.map((file, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-teal-50 border border-teal-200 rounded text-xs text-teal-900"
                          >
                            {file.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    {renderActionButtons()}
                  </CardContent>
                </Card>
              </form>
            </TabsContent>

            <TabsContent value="fup-001" className="mt-6">
              <form className="space-y-6">
                {/* Informações do Cliente - Follow Up-001 */}
                <Card>
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex items-center gap-2">
                      <User className="h-7 w-7 text-teal-600" />
                      <span className="text-xl font-bold">
                        Informações do Relator
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <Label htmlFor="cliente-fup">
                        Cliente <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="cliente-fup"
                          type="search"
                          placeholder="Buscar por nome ou documento"
                          className="pl-8 h-11"
                          value={clienteSearch}
                          onChange={(e) => {
                            setClienteSearch(e.target.value);
                            setShowResults(true);
                          }}
                          autoComplete="off"
                        />
                        {showResults && filteredClientes.length > 0 && (
                          <div className="absolute z-50 w-full left-0 mt-1 bg-white border rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
                            {filteredClientes.map((cliente) => (
                              <button
                                key={cliente.id}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b last:border-b-0"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setForm((f) => ({
                                    ...f,
                                    cliente,
                                    protocolo: null,
                                  }));
                                  setClienteSearch("");
                                  setShowResults(false);
                                }}
                              >
                                <div className="font-medium text-gray-900">
                                  {cliente.nome}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {cliente.documento} • {cliente.telefone}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {form.cliente && (
                        <div className="mt-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between border border-teal-200 bg-[#F8FEFC] rounded-lg px-6 py-4 mb-2">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#E6FAF7] text-[#26B99D] font-bold text-xl">
                                {form.cliente.nome
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="font-bold text-lg text-gray-900">
                                  {form.cliente.nome}
                                </span>
                                <div className="flex items-center gap-2 text-gray-700 text-sm">
                                  <svg
                                    width="18"
                                    height="18"
                                    fill="none"
                                    stroke="#26B99D"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                  >
                                    <rect
                                      width="20"
                                      height="16"
                                      x="2"
                                      y="4"
                                      rx="2"
                                    />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                  </svg>
                                  <span>{form.cliente.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 text-sm">
                                  <svg
                                    width="18"
                                    height="18"
                                    fill="none"
                                    stroke="#26B99D"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                    <circle cx="12" cy="10" r="3" />
                                  </svg>
                                  <span>{form.cliente.documento}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 text-sm">
                                  <svg
                                    width="18"
                                    height="18"
                                    fill="none"
                                    stroke="#26B99D"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                    <circle cx="12" cy="12" r="5" />
                                  </svg>
                                  <span>
                                    Tipo:{" "}
                                    <b>
                                      {form.cliente.documento &&
                                      form.cliente.documento.length > 14
                                        ? "Pessoa Jurídica"
                                        : "Pessoa Física"}
                                    </b>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 items-end mt-4 md:mt-0">
                              <div className="flex items-center gap-2 text-gray-700 text-sm">
                                <svg
                                  width="18"
                                  height="18"
                                  fill="none"
                                  stroke="#26B99D"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                <span>{form.cliente.telefone}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700 text-sm">
                                <svg
                                  width="18"
                                  height="18"
                                  fill="none"
                                  stroke="#26B99D"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                  <circle cx="12" cy="12" r="5" />
                                </svg>
                                <span>{form.cliente.endereco}</span>
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="mt-2"
                                onClick={() =>
                                  setForm((f) => ({
                                    ...f,
                                    cliente: null,
                                    protocolo: null,
                                  }))
                                }
                              >
                                Remover
                              </Button>
                            </div>
                          </div>
                          {/* Protocolos do cliente */}
                          {protocolos.length > 0 && (
                            <div className="mt-6">
                              <div className="font-semibold mb-2 text-gray-800 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-[#26B99D]" />
                                Protocolos
                                <span className="text-xs text-gray-500 font-normal ml-2">
                                  Protocolos em andamento do cliente
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-3">
                                {protocolos.map((protocolo: ProtocoloMock) => (
                                  <div
                                    key={protocolo.id}
                                    className={`relative px-4 py-2 rounded-md border flex flex-col items-start min-w-[260px] shadow-sm transition-colors min-h-[80px] ${
                                      form.protocolo &&
                                      form.protocolo.id === protocolo.id
                                        ? "border-[#26B99D] bg-[#e6faf7]"
                                        : "border-gray-200 bg-white hover:border-[#26B99D]"
                                    }`}
                                  >
                                    <span className="font-bold text-base text-[#26B99D] tracking-wide mb-1">
                                      {protocolo.id}
                                    </span>
                                    <span className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                      <svg
                                        width="16"
                                        height="16"
                                        fill="none"
                                        stroke="#26B99D"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                      >
                                        <rect
                                          x="3"
                                          y="4"
                                          width="18"
                                          height="18"
                                          rx="2"
                                        />
                                        <path d="M16 2v4M8 2v4M3 10h18" />
                                      </svg>{" "}
                                      Aberto em {protocolo.data}
                                    </span>
                                    <span className="text-sm text-gray-900 mb-0.5 flex items-center gap-1">
                                      <FileText className="h-4 w-4 text-[#26B99D]" />
                                      Motivo: <b>{protocolo.motivo}</b>
                                    </span>
                                    <span className="text-sm text-gray-900 mb-0.5 flex items-center gap-1">
                                      <Pill className="h-4 w-4 text-[#26B99D]" />
                                      Produto: <b>{protocolo.produto}</b>
                                    </span>
                                    <span className="text-sm text-gray-900 mb-0.5 flex items-center gap-1">
                                      <svg
                                        width="16"
                                        height="16"
                                        fill="none"
                                        stroke="#26B99D"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                      </svg>
                                      Autoriza retorno:{" "}
                                      <b>
                                        {protocolo.autorizaRetorno
                                          ? "Sim"
                                          : "Não"}
                                      </b>
                                    </span>
                                    {form.protocolo &&
                                    form.protocolo.id === protocolo.id ? (
                                      <>
                                        <button
                                          type="button"
                                          className="absolute top-2 right-2 p-1 rounded hover:bg-red-100 text-red-700"
                                          onClick={() =>
                                            setForm((f) => ({
                                              ...f,
                                              protocolo: null,
                                            }))
                                          }
                                          aria-label="Desvincular protocolo"
                                        >
                                          <X size={16} />
                                        </button>
                                        {protocolo.queixaTecnica && (
                                          <QueixaTecnicaCard
                                            queixa={protocolo.queixaTecnica}
                                          />
                                        )}
                                      </>
                                    ) : (
                                      <Button
                                        type="button"
                                        className="mt-2 px-3 py-1 rounded bg-[#26B99D] text-white text-xs font-semibold hover:bg-[#15937E] transition"
                                        onClick={() =>
                                          setForm((f) => ({ ...f, protocolo }))
                                        }
                                      >
                                        Vincular
                                      </Button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Dados do Relator - Follow Up-001 */}
                <Card>
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-7 w-7 text-teal-600" />
                      <span className="text-xl font-bold">
                        Dados do Paciente
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <Label className="font-medium">
                        Relator é o paciente?
                      </Label>
                      <div className="flex gap-6 mt-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="relator-sim-fup"
                            name="relatorEhPacienteFup"
                            value="sim"
                            checked={form.relatorEhPaciente === "sim"}
                            onChange={() =>
                              setForm((f) => ({
                                ...f,
                                relatorEhPaciente: "sim",
                                relatorNome: "",
                              }))
                            }
                            className="accent-teal-600 h-4 w-4"
                          />
                          <Label htmlFor="relator-sim-fup">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="relator-nao-fup"
                            name="relatorEhPacienteFup"
                            value="nao"
                            checked={form.relatorEhPaciente === "nao"}
                            onChange={() =>
                              setForm((f) => ({
                                ...f,
                                relatorEhPaciente: "nao",
                              }))
                            }
                            className="accent-teal-600 h-4 w-4"
                          />
                          <Label htmlFor="relator-nao-fup">Não</Label>
                        </div>
                      </div>
                    </div>
                    {form.relatorEhPaciente === "nao" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-teal-50/60 border border-teal-100 rounded-lg p-5">
                        <div className="space-y-2">
                          <Label htmlFor="relator-nome-fup">
                            Nome completo do Paciente{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="relator-nome-fup"
                            placeholder="Digite o nome do paciente"
                            value={form.relatorNome || ""}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                relatorNome: e.target.value,
                              }))
                            }
                            required
                            className="h-11"
                          />
                        </div>
                      </div>
                    )}

                    {/* Dados do Paciente */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="data-nascimento-fup">
                            Data de Nascimento
                          </Label>
                          <div className="relative">
                            <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="data-nascimento-fup"
                              type="date"
                              value={form.dataNascimento}
                              onChange={(e) =>
                                setForm((f) => ({
                                  ...f,
                                  dataNascimento: e.target.value,
                                }))
                              }
                              className="pl-8 h-11 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                            />
                          </div>
                          {idade !== null && (
                            <div className="text-sm text-teal-600 font-medium">
                              Idade: {idade} anos
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="sexo-fup">Sexo</Label>
                          <div className="flex gap-6 mt-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="sexo-masculino-fup"
                                name="sexoFup"
                                value="masculino"
                                checked={form.sexo === "masculino"}
                                onChange={() =>
                                  setForm((f) => ({
                                    ...f,
                                    sexo: "masculino",
                                    gestante: "",
                                    idadeGestacional: "",
                                    ultimoPeriodoMenstrual: "",
                                  }))
                                }
                                className="accent-teal-600 h-4 w-4"
                              />
                              <Label htmlFor="sexo-masculino-fup">
                                Masculino
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="sexo-feminino-fup"
                                name="sexoFup"
                                value="feminino"
                                checked={form.sexo === "feminino"}
                                onChange={() =>
                                  setForm((f) => ({ ...f, sexo: "feminino" }))
                                }
                                className="accent-teal-600 h-4 w-4"
                              />
                              <Label htmlFor="sexo-feminino-fup">
                                Feminino
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="sexo-nao-informado-fup"
                                name="sexoFup"
                                value="nao-informado"
                                checked={form.sexo === "nao-informado"}
                                onChange={() =>
                                  setForm((f) => ({
                                    ...f,
                                    sexo: "nao-informado",
                                    gestante: "",
                                    idadeGestacional: "",
                                    ultimoPeriodoMenstrual: "",
                                  }))
                                }
                                className="accent-teal-600 h-4 w-4"
                              />
                              <Label htmlFor="sexo-nao-informado-fup">
                                Não informado
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {form.sexo === "feminino" && (
                        <div className="space-y-4 bg-pink-50/60 border border-pink-100 rounded-lg p-4">
                          <div className="space-y-2">
                            <Label className="font-medium">Gestante</Label>
                            <div className="flex gap-6 mt-2">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="gestante-sim-fup"
                                  name="gestanteFup"
                                  value="sim"
                                  checked={form.gestante === "sim"}
                                  onChange={() =>
                                    setForm((f) => ({ ...f, gestante: "sim" }))
                                  }
                                  className="accent-pink-600 h-4 w-4"
                                />
                                <Label htmlFor="gestante-sim-fup">Sim</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="gestante-nao-fup"
                                  name="gestanteFup"
                                  value="nao"
                                  checked={form.gestante === "nao"}
                                  onChange={() =>
                                    setForm((f) => ({
                                      ...f,
                                      gestante: "nao",
                                      idadeGestacional: "",
                                      ultimoPeriodoMenstrual: "",
                                    }))
                                  }
                                  className="accent-pink-600 h-4 w-4"
                                />
                                <Label htmlFor="gestante-nao-fup">Não</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="gestante-nao-informado-fup"
                                  name="gestanteFup"
                                  value="nao-informado"
                                  checked={form.gestante === "nao-informado"}
                                  onChange={() =>
                                    setForm((f) => ({
                                      ...f,
                                      gestante: "nao-informado",
                                      idadeGestacional: "",
                                      ultimoPeriodoMenstrual: "",
                                    }))
                                  }
                                  className="accent-pink-600 h-4 w-4"
                                />
                                <Label htmlFor="gestante-nao-informado-fup">
                                  Não informado
                                </Label>
                              </div>
                            </div>
                          </div>

                          {form.gestante === "sim" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Label htmlFor="idade-gestacional-fup">
                                    Idade gestacional
                                  </Label>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <HelpCircle className="h-4 w-4 text-gray-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Idade gestacional no início do EA</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                                <Input
                                  id="idade-gestacional-fup"
                                  type="number"
                                  placeholder="Ex: 20 semanas"
                                  value={form.idadeGestacional}
                                  onChange={(e) =>
                                    setForm((f) => ({
                                      ...f,
                                      idadeGestacional: e.target.value,
                                    }))
                                  }
                                  className="h-11"
                                  min="0"
                                  max="42"
                                />
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Label htmlFor="ultimo-periodo-menstrual-fup">
                                    Último período menstrual (DPM)
                                  </Label>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <HelpCircle className="h-4 w-4 text-gray-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Data do último período menstrual</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                                <div className="flex gap-2">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className="w-24 justify-between h-11 text-xs"
                                      >
                                        <span>
                                          {form.tipoDataUltimoPeriodoMenstrual ===
                                          "mes-ano"
                                            ? "MM/AAAA"
                                            : "DD/MM/AAAA"}
                                        </span>
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                      <Command>
                                        <CommandGroup>
                                          <CommandItem
                                            value="dia-mes-ano"
                                            onSelect={() =>
                                              setForm((f) => ({
                                                ...f,
                                                tipoDataUltimoPeriodoMenstrual:
                                                  "dia-mes-ano",
                                              }))
                                            }
                                          >
                                            DD/MM/AAAA
                                          </CommandItem>
                                          <CommandItem
                                            value="mes-ano"
                                            onSelect={() =>
                                              setForm((f) => ({
                                                ...f,
                                                tipoDataUltimoPeriodoMenstrual:
                                                  "mes-ano",
                                              }))
                                            }
                                          >
                                            MM/AAAA
                                          </CommandItem>
                                        </CommandGroup>
                                      </Command>
                                    </PopoverContent>
                                  </Popover>
                                  <div className="relative flex-1">
                                    <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      id="ultimo-periodo-menstrual-fup"
                                      type={
                                        form.tipoDataUltimoPeriodoMenstrual ===
                                        "mes-ano"
                                          ? "month"
                                          : "date"
                                      }
                                      value={form.ultimoPeriodoMenstrual}
                                      onChange={(e) =>
                                        setForm((f) => ({
                                          ...f,
                                          ultimoPeriodoMenstrual:
                                            e.target.value,
                                        }))
                                      }
                                      className="pl-8 h-11 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="altura-fup">Altura (cm)</Label>
                          <Input
                            id="altura-fup"
                            type="number"
                            placeholder="Ex: 170"
                            value={form.altura}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, altura: e.target.value }))
                            }
                            className="h-11"
                            min="50"
                            max="250"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="peso-fup">Peso (kg)</Label>
                          <Input
                            id="peso-fup"
                            type="number"
                            placeholder="Ex: 70.5"
                            value={form.peso}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, peso: e.target.value }))
                            }
                            className="h-11"
                            min="1"
                            max="300"
                            step="0.1"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Histórico Médico */}
                <Card>
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex items-center gap-2">
                      <FileText className="h-7 w-7 text-teal-600" />
                      <span className="text-xl font-bold">
                        Histórico Médico
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    {/* Cabeçalho com botão Adicionar Condição */}
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          Condições Médicas
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Adicione informações sobre condições médicas
                          relevantes
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex items-center gap-2 text-teal-600 border-teal-300 hover:bg-teal-50"
                        onClick={adicionarCondicaoMedica}
                      >
                        <Plus className="h-4 w-4" />
                        Adicionar Condição
                      </Button>
                    </div>

                    {/* Lista de Condições Médicas */}
                    <div className="space-y-8">
                      {historicoMedicoItems.map((item, index) => (
                        <div
                          key={item.id}
                          className="border border-gray-200 rounded-lg p-6 bg-gray-50/50"
                        >
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="font-semibold text-gray-900 text-lg">
                              Condição {index + 1}
                            </h4>
                            {historicoMedicoItems.length > 1 && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removerCondicaoMedica(item.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div
                            className={`grid grid-cols-1 gap-8 ${
                              item.emCursoDataInicio
                                ? "lg:grid-cols-2"
                                : "lg:grid-cols-3"
                            }`}
                          >
                            {/* Descrição da Condição */}
                            <div className="space-y-4">
                              <Label className="font-medium text-gray-700 text-base">
                                Descrição da Condição
                              </Label>
                              <Input
                                placeholder="Descreva a condição médica..."
                                value={item.descricaoCondicao || ""}
                                onChange={(e) =>
                                  atualizarHistoricoMedico(
                                    item.id,
                                    "descricaoCondicao",
                                    e.target.value
                                  )
                                }
                                className="h-12 text-base"
                              />
                            </div>

                            {/* Data de Início */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between flex-wrap gap-3">
                                <Label className="font-medium text-gray-700 text-base">
                                  Data de Início
                                </Label>
                                <div className="flex items-center space-x-3">
                                  <input
                                    type="checkbox"
                                    id={`em-curso-inicio-${item.id}`}
                                    checked={item.emCursoDataInicio || false}
                                    onChange={(e) => {
                                      atualizarHistoricoMedico(
                                        item.id,
                                        "emCursoDataInicio",
                                        e.target.checked
                                      );
                                      // Limpar campos de término quando marcar como em curso
                                      if (e.target.checked) {
                                        atualizarHistoricoMedico(
                                          item.id,
                                          "dataTermino",
                                          ""
                                        );
                                      }
                                    }}
                                    className="accent-teal-600 h-4 w-4"
                                  />
                                  <Label
                                    htmlFor={`em-curso-inicio-${item.id}`}
                                    className="text-sm text-gray-600 whitespace-nowrap font-medium"
                                  >
                                    Em curso
                                  </Label>
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className="w-32 justify-between h-12 text-sm border-gray-300"
                                    >
                                      <span>
                                        {item.tipoDataInicio === "mes-ano"
                                          ? "MM/AAAA"
                                          : "DD/MM/AAAA"}
                                      </span>
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                    <Command>
                                      <CommandGroup>
                                        <CommandItem
                                          value="dia-mes-ano"
                                          onSelect={() =>
                                            atualizarHistoricoMedico(
                                              item.id,
                                              "tipoDataInicio",
                                              "dia-mes-ano"
                                            )
                                          }
                                        >
                                          DD/MM/AAAA
                                        </CommandItem>
                                        <CommandItem
                                          value="mes-ano"
                                          onSelect={() =>
                                            atualizarHistoricoMedico(
                                              item.id,
                                              "tipoDataInicio",
                                              "mes-ano"
                                            )
                                          }
                                        >
                                          MM/AAAA
                                        </CommandItem>
                                      </CommandGroup>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                                <div className="relative flex-1 min-w-0">
                                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                  <Input
                                    type={
                                      item.tipoDataInicio === "mes-ano"
                                        ? "month"
                                        : "date"
                                    }
                                    value={item.dataInicio || ""}
                                    onChange={(e) =>
                                      atualizarHistoricoMedico(
                                        item.id,
                                        "dataInicio",
                                        e.target.value
                                      )
                                    }
                                    className="pl-10 h-12 text-base [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Data de Término - Oculto quando em curso */}
                            {!item.emCursoDataInicio && (
                              <div className="space-y-4">
                                <Label className="font-medium text-gray-700 text-base">
                                  Data de Término
                                </Label>
                                <div className="flex gap-3">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className="w-32 justify-between h-12 text-sm border-gray-300"
                                      >
                                        <span>
                                          {item.tipoDataTermino === "mes-ano"
                                            ? "MM/AAAA"
                                            : "DD/MM/AAAA"}
                                        </span>
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                      <Command>
                                        <CommandGroup>
                                          <CommandItem
                                            value="dia-mes-ano"
                                            onSelect={() =>
                                              atualizarHistoricoMedico(
                                                item.id,
                                                "tipoDataTermino",
                                                "dia-mes-ano"
                                              )
                                            }
                                          >
                                            DD/MM/AAAA
                                          </CommandItem>
                                          <CommandItem
                                            value="mes-ano"
                                            onSelect={() =>
                                              atualizarHistoricoMedico(
                                                item.id,
                                                "tipoDataTermino",
                                                "mes-ano"
                                              )
                                            }
                                          >
                                            MM/AAAA
                                          </CommandItem>
                                        </CommandGroup>
                                      </Command>
                                    </PopoverContent>
                                  </Popover>
                                  <div className="relative flex-1 min-w-0">
                                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                    <Input
                                      type={
                                        item.tipoDataTermino === "mes-ano"
                                          ? "month"
                                          : "date"
                                      }
                                      value={item.dataTermino || ""}
                                      onChange={(e) =>
                                        atualizarHistoricoMedico(
                                          item.id,
                                          "dataTermino",
                                          e.target.value
                                        )
                                      }
                                      className="pl-10 h-12 text-base [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Divider com mais espaçamento */}
                    <div className="border-t border-gray-200 my-10"></div>

                    {/* Exames Laboratoriais */}
                    <div className="space-y-6">
                      <div className="mb-6 flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                            <FileText className="h-6 w-6 text-teal-600" />
                            Exames Laboratoriais
                          </h3>
                          <p className="text-sm text-gray-500 mt-2">
                            Adicione informações sobre exames laboratoriais
                            relevantes
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="flex items-center gap-2 text-teal-600 border-teal-300 hover:bg-teal-50"
                          onClick={adicionarExameLaboratorial}
                        >
                          <Plus className="h-4 w-4" />
                          Adicionar Exame
                        </Button>
                      </div>

                      {/* Lista de Exames */}
                      <div className="space-y-8">
                        {examesLaboratoriais.map((exame, index) => (
                          <div
                            key={exame.id}
                            className="border border-gray-200 rounded-lg p-6 bg-gray-50/50"
                          >
                            <div className="flex items-center justify-between mb-6">
                              <h4 className="font-semibold text-gray-900 text-lg">
                                Exame {index + 1}
                              </h4>
                              {examesLaboratoriais.length > 1 && (
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    removerExameLaboratorial(exame.id)
                                  }
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              {/* Nome do Exame */}
                              <div className="space-y-3">
                                <Label className="font-medium text-gray-700">
                                  Nome do Exame
                                </Label>
                                <Input
                                  placeholder="Ex: Hemograma completo"
                                  value={exame.nomeExame}
                                  onChange={(e) =>
                                    atualizarExamesLaboratoriais(
                                      exame.id,
                                      "nomeExame",
                                      e.target.value
                                    )
                                  }
                                  className="h-11"
                                />
                              </div>

                              {/* Resultado */}
                              <div className="space-y-3">
                                <Label className="font-medium text-gray-700">
                                  Resultado
                                </Label>
                                <Input
                                  placeholder="Ex: 4.5"
                                  value={exame.resultado}
                                  onChange={(e) =>
                                    atualizarExamesLaboratoriais(
                                      exame.id,
                                      "resultado",
                                      e.target.value
                                    )
                                  }
                                  className="h-11"
                                />
                              </div>

                              {/* Unidade */}
                              <div className="space-y-3">
                                <Label className="font-medium text-gray-700">
                                  Unidade
                                </Label>
                                <Input
                                  placeholder="Ex: mg/dL"
                                  value={exame.unidade}
                                  onChange={(e) =>
                                    atualizarExamesLaboratoriais(
                                      exame.id,
                                      "unidade",
                                      e.target.value
                                    )
                                  }
                                  className="h-11"
                                />
                              </div>
                            </div>

                            {/* Segunda linha com Faixa de Referência e Data do Exame */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                              {/* Faixa de Referência */}
                              <div className="space-y-3">
                                <Label className="font-medium text-gray-700">
                                  Faixa de Referência
                                </Label>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <Label className="text-xs text-gray-600">
                                      Baixo
                                    </Label>
                                    <Input
                                      placeholder="Ex: 3,5"
                                      value={exame.faixaReferenciaBaixo || ""}
                                      onChange={(e) =>
                                        atualizarExamesLaboratoriais(
                                          exame.id,
                                          "faixaReferenciaBaixo",
                                          e.target.value
                                        )
                                      }
                                      className="h-11 text-sm"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs text-gray-600">
                                      Alto
                                    </Label>
                                    <Input
                                      placeholder="Ex: 5,0"
                                      value={exame.faixaReferenciaAlto || ""}
                                      onChange={(e) =>
                                        atualizarExamesLaboratoriais(
                                          exame.id,
                                          "faixaReferenciaAlto",
                                          e.target.value
                                        )
                                      }
                                      className="h-11 text-sm"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Data do Exame */}
                              <div className="space-y-3">
                                <Label className="font-medium text-gray-700">
                                  Data do Exame
                                </Label>
                                <div className="flex gap-2">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className="w-28 justify-between h-11 text-xs border-gray-300"
                                      >
                                        <span>
                                          {exame.tipoDataExame === "mes-ano"
                                            ? "MM/AAAA"
                                            : "DD/MM/AAAA"}
                                        </span>
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                      <Command>
                                        <CommandGroup>
                                          <CommandItem
                                            value="dia-mes-ano"
                                            onSelect={() =>
                                              atualizarExamesLaboratoriais(
                                                exame.id,
                                                "tipoDataExame",
                                                "dia-mes-ano"
                                              )
                                            }
                                          >
                                            DD/MM/AAAA
                                          </CommandItem>
                                          <CommandItem
                                            value="mes-ano"
                                            onSelect={() =>
                                              atualizarExamesLaboratoriais(
                                                exame.id,
                                                "tipoDataExame",
                                                "mes-ano"
                                              )
                                            }
                                          >
                                            MM/AAAA
                                          </CommandItem>
                                        </CommandGroup>
                                      </Command>
                                    </PopoverContent>
                                  </Popover>
                                  <div className="relative flex-1 min-w-0">
                                    <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      type={
                                        exame.tipoDataExame === "mes-ano"
                                          ? "month"
                                          : "date"
                                      }
                                      value={exame.dataExame}
                                      onChange={(e) =>
                                        atualizarExamesLaboratoriais(
                                          exame.id,
                                          "dataExame",
                                          e.target.value
                                        )
                                      }
                                      className="pl-8 h-11 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Medicamentos Suspeitos */}
                <Card>
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex items-center gap-2">
                      <Pill className="h-7 w-7 text-teal-600" />
                      <span className="text-xl font-bold">
                        Medicamentos Suspeitos
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <TooltipProvider>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="produto-suspeito">Produto</Label>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Nome do medicamento suspeito de causar o
                                  evento
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Input
                            id="produto-suspeito"
                            placeholder="Nome do produto"
                            value={form.produtoSuspeito}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                produtoSuspeito: e.target.value,
                              }))
                            }
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="ean-suspeito">EAN</Label>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Código de barras EAN do produto</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Input
                            placeholder="Código EAN"
                            value={form.eanSuspeito}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                eanSuspeito: e.target.value,
                              }))
                            }
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="lote-suspeito">Lote</Label>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Número do lote do medicamento</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Input
                            id="lote-suspeito"
                            placeholder="Número do lote"
                            value={form.loteSuspeito}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                loteSuspeito: e.target.value,
                              }))
                            }
                            className="h-11"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="dosagem">Dosagem</Label>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Dose administrada do medicamento (ex: 500mg,
                                  10ml)
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Input
                            id="dosagem"
                            placeholder="Ex: 500mg"
                            value={form.dosagem}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                dosagem: e.target.value,
                              }))
                            }
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="via-administracao">
                              Via de Administração
                            </Label>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Via pela qual o medicamento foi administrado
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between h-11"
                              >
                                <div className="flex items-center gap-2">
                                  <Pill className="h-4 w-4 text-teal-600" />
                                  <span>
                                    {form.viaAdministracao ||
                                      "Selecione a via de administração"}
                                  </span>
                                </div>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                              <Command>
                                <CommandInput placeholder="Buscar via de administração..." />
                                <CommandEmpty>
                                  Nenhuma via encontrada.
                                </CommandEmpty>
                                <CommandGroup>
                                  <CommandItem
                                    value="Oral"
                                    onSelect={() =>
                                      setForm((f) => ({
                                        ...f,
                                        viaAdministracao: "Oral",
                                      }))
                                    }
                                  >
                                    <Pill className="mr-2 h-4 w-4" />
                                    Oral
                                  </CommandItem>
                                  <CommandItem
                                    value="Intravenosa"
                                    onSelect={() =>
                                      setForm((f) => ({
                                        ...f,
                                        viaAdministracao: "Intravenosa",
                                      }))
                                    }
                                  >
                                    <Pill className="mr-2 h-4 w-4" />
                                    Intravenosa
                                  </CommandItem>
                                  <CommandItem
                                    value="Intramuscular"
                                    onSelect={() =>
                                      setForm((f) => ({
                                        ...f,
                                        viaAdministracao: "Intramuscular",
                                      }))
                                    }
                                  >
                                    <Pill className="mr-2 h-4 w-4" />
                                    Intramuscular
                                  </CommandItem>
                                  <CommandItem
                                    value="Subcutânea"
                                    onSelect={() =>
                                      setForm((f) => ({
                                        ...f,
                                        viaAdministracao: "Subcutânea",
                                      }))
                                    }
                                  >
                                    <Pill className="mr-2 h-4 w-4" />
                                    Subcutânea
                                  </CommandItem>
                                  <CommandItem
                                    value="Tópica"
                                    onSelect={() =>
                                      setForm((f) => ({
                                        ...f,
                                        viaAdministracao: "Tópica",
                                      }))
                                    }
                                  >
                                    <Pill className="mr-2 h-4 w-4" />
                                    Tópica
                                  </CommandItem>
                                  <CommandItem
                                    value="Inalatória"
                                    onSelect={() =>
                                      setForm((f) => ({
                                        ...f,
                                        viaAdministracao: "Inalatória",
                                      }))
                                    }
                                  >
                                    <Pill className="mr-2 h-4 w-4" />
                                    Inalatória
                                  </CommandItem>
                                  <CommandItem
                                    value="Retal"
                                    onSelect={() =>
                                      setForm((f) => ({
                                        ...f,
                                        viaAdministracao: "Retal",
                                      }))
                                    }
                                  >
                                    <Pill className="mr-2 h-4 w-4" />
                                    Retal
                                  </CommandItem>
                                  <CommandItem
                                    value="Vaginal"
                                    onSelect={() =>
                                      setForm((f) => ({
                                        ...f,
                                        viaAdministracao: "Vaginal",
                                      }))
                                    }
                                  >
                                    <Pill className="mr-2 h-4 w-4" />
                                    Vaginal
                                  </CommandItem>
                                  <CommandItem
                                    value="Oftálmica"
                                    onSelect={() =>
                                      setForm((f) => ({
                                        ...f,
                                        viaAdministracao: "Oftálmica",
                                      }))
                                    }
                                  >
                                    <Pill className="mr-2 h-4 w-4" />
                                    Oftálmica
                                  </CommandItem>
                                  <CommandItem
                                    value="Otológica"
                                    onSelect={() =>
                                      setForm((f) => ({
                                        ...f,
                                        viaAdministracao: "Otológica",
                                      }))
                                    }
                                  >
                                    <Pill className="mr-2 h-4 w-4" />
                                    Otológica
                                  </CommandItem>
                                  <CommandItem
                                    value="Nasal"
                                    onSelect={() =>
                                      setForm((f) => ({
                                        ...f,
                                        viaAdministracao: "Nasal",
                                      }))
                                    }
                                  >
                                    <Pill className="mr-2 h-4 w-4" />
                                    Nasal
                                  </CommandItem>
                                  <CommandItem
                                    value="Outra"
                                    onSelect={() =>
                                      setForm((f) => ({
                                        ...f,
                                        viaAdministracao: "Outra",
                                      }))
                                    }
                                  >
                                    <Pill className="mr-2 h-4 w-4" />
                                    Outra
                                  </CommandItem>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="frequencia">Frequência</Label>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Frequência de administração do medicamento
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Input
                            id="frequencia"
                            placeholder="Ex: 2x ao dia, 8/8h"
                            value={form.frequencia}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                frequencia: e.target.value,
                              }))
                            }
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="indicacao">Indicação</Label>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Indicação terapêutica para qual o medicamento
                                  foi utilizado
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Input
                            id="indicacao"
                            placeholder="Indicação terapêutica"
                            value={form.indicacao}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                indicacao: e.target.value,
                              }))
                            }
                            className="h-11"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <Label>
                            O medicamento foi prescrito por profissional de
                            saúde?
                          </Label>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Indica se o medicamento foi prescrito por um
                                médico
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="flex flex-wrap gap-6 mt-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="prescrito-sim"
                              name="prescritoPeloMedico"
                              value="sim"
                              checked={form.prescritoPeloMedico === "sim"}
                              onChange={() =>
                                setForm((f) => ({
                                  ...f,
                                  prescritoPeloMedico: "sim",
                                }))
                              }
                              className="accent-teal-600 h-4 w-4"
                            />
                            <Label htmlFor="prescrito-sim" className="text-sm">
                              Sim
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="prescrito-nao"
                              name="prescritoPeloMedico"
                              value="nao"
                              checked={form.prescritoPeloMedico === "nao"}
                              onChange={() =>
                                setForm((f) => ({
                                  ...f,
                                  prescritoPeloMedico: "nao",
                                }))
                              }
                              className="accent-teal-600 h-4 w-4"
                            />
                            <Label htmlFor="prescrito-nao" className="text-sm">
                              Não
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="prescrito-nao-informado"
                              name="prescritoPeloMedico"
                              value="nao-informado"
                              checked={
                                form.prescritoPeloMedico === "nao-informado"
                              }
                              onChange={() =>
                                setForm((f) => ({
                                  ...f,
                                  prescritoPeloMedico: "nao-informado",
                                }))
                              }
                              className="accent-teal-600 h-4 w-4"
                            />
                            <Label
                              htmlFor="prescrito-nao-informado"
                              className="text-sm"
                            >
                              Não informado
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="inicio-tratamento">
                              Início do Tratamento
                            </Label>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Data em que o tratamento com o medicamento foi
                                  iniciado
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <div className="flex gap-2">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="w-28 justify-between h-11 text-xs border-gray-300"
                                >
                                  <span>
                                    {form.tipoDataInicio === "mes-ano"
                                      ? "MM/AAAA"
                                      : "DD/MM/AAAA"}
                                  </span>
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                <Command>
                                  <CommandGroup>
                                    <CommandItem
                                      value="dia-mes-ano"
                                      onSelect={() =>
                                        setForm((f) => ({
                                          ...f,
                                          tipoDataInicio: "dia-mes-ano",
                                        }))
                                      }
                                    >
                                      DD/MM/AAAA
                                    </CommandItem>
                                    <CommandItem
                                      value="mes-ano"
                                      onSelect={() =>
                                        setForm((f) => ({
                                          ...f,
                                          tipoDataInicio: "mes-ano",
                                        }))
                                      }
                                    >
                                      MM/AAAA
                                    </CommandItem>
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <div className="relative flex-1 min-w-0">
                              <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                              <Input
                                type={
                                  form.tipoDataInicio === "mes-ano"
                                    ? "month"
                                    : "date"
                                }
                                value={form.inicioTratamento}
                                onChange={(e) =>
                                  setForm((f) => ({
                                    ...f,
                                    inicioTratamento: e.target.value,
                                  }))
                                }
                                className="pl-10 h-12 text-base [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label>Tratamento em Andamento</Label>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>O paciente ainda está usando o medicamento?</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="flex flex-wrap gap-6 mt-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="andamento-sim"
                              name="tratamentoEmAndamento"
                              value="sim"
                              checked={form.tratamentoEmAndamento === "sim"}
                              onChange={() =>
                                setForm((f) => ({
                                  ...f,
                                  tratamentoEmAndamento: "sim",
                                  terminoTratamento: "",
                                }))
                              }
                              className="accent-teal-600 h-4 w-4"
                            />
                            <Label htmlFor="andamento-sim" className="text-sm">
                              Sim
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="andamento-nao"
                              name="tratamentoEmAndamento"
                              value="nao"
                              checked={form.tratamentoEmAndamento === "nao"}
                              onChange={() =>
                                setForm((f) => ({
                                  ...f,
                                  tratamentoEmAndamento: "nao",
                                }))
                              }
                              className="accent-teal-600 h-4 w-4"
                            />
                            <Label htmlFor="andamento-nao" className="text-sm">
                              Não
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="andamento-nao-informado"
                              name="tratamentoEmAndamento"
                              value="nao-informado"
                              checked={
                                form.tratamentoEmAndamento === "nao-informado"
                              }
                              onChange={() =>
                                setForm((f) => ({
                                  ...f,
                                  tratamentoEmAndamento: "nao-informado",
                                  terminoTratamento: "",
                                }))
                              }
                              className="accent-teal-600 h-4 w-4"
                            />
                            <Label
                              htmlFor="andamento-nao-informado"
                              className="text-sm"
                            >
                              Não informado
                            </Label>
                          </div>
                        </div>
                      </div>

                      {form.tratamentoEmAndamento === "nao" && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="termino-tratamento">
                              Término do Tratamento
                            </Label>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Data em que o tratamento com o medicamento foi
                                  finalizado
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <div className="flex gap-2">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="w-28 justify-between h-11 text-xs border-gray-300"
                                >
                                  <span>
                                    {form.tipoDataTermino === "mes-ano"
                                      ? "MM/AAAA"
                                      : "DD/MM/AAAA"}
                                  </span>
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                <Command>
                                  <CommandGroup>
                                    <CommandItem
                                      value="dia-mes-ano"
                                      onSelect={() =>
                                        setForm((f) => ({
                                          ...f,
                                          tipoDataTermino: "dia-mes-ano",
                                        }))
                                      }
                                    >
                                      DD/MM/AAAA
                                    </CommandItem>
                                    <CommandItem
                                      value="mes-ano"
                                      onSelect={() =>
                                        setForm((f) => ({
                                          ...f,
                                          tipoDataTermino: "mes-ano",
                                        }))
                                      }
                                    >
                                      MM/AAAA
                                    </CommandItem>
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <div className="relative flex-1 min-w-0">
                              <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                              <Input
                                type={
                                  form.tipoDataTermino === "mes-ano"
                                    ? "month"
                                    : "date"
                                }
                                value={form.terminoTratamento}
                                onChange={(e) =>
                                  setForm((f) => ({
                                    ...f,
                                    terminoTratamento: e.target.value,
                                  }))
                                }
                                className="pl-10 h-12 text-base [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </TooltipProvider>
                  </CardContent>
                </Card>

                {/* Dados do médico prescritor - Apenas se prescrito por profissional de saúde */}
                {form.prescritoPeloMedico === "sim" && (
                  <Card>
                    <CardHeader className="bg-gray-50 border-b">
                      <div className="flex items-center gap-2">
                        <User className="h-7 w-7 text-teal-600" />
                        <span className="text-xl font-bold">
                          Dados do médico prescritor
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="nome-medico-fup"
                            className="font-medium"
                          >
                            Nome completo{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="nome-medico-fup"
                            placeholder="Nome do médico prescritor"
                            value={form.nomeMedico}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                nomeMedico: e.target.value,
                              }))
                            }
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="crm-medico-fup"
                            className="font-medium"
                          >
                            CRM <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="crm-medico-fup"
                            placeholder="Número do CRM"
                            value={form.crmMedico}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                crmMedico: e.target.value,
                              }))
                            }
                            className="h-11"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="especialidade-medico-fup"
                          className="font-medium"
                        >
                          Especialidade
                        </Label>
                        <Input
                          id="especialidade-medico-fup"
                          placeholder="Especialidade médica"
                          value={form.especialidadeMedico}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              especialidadeMedico: e.target.value,
                            }))
                          }
                          className="h-11"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="telefone-medico-fup"
                            className="font-medium"
                          >
                            Telefone
                          </Label>
                          <Input
                            id="telefone-medico-fup"
                            placeholder="Telefone do médico"
                            value={form.telefoneMedico}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                telefoneMedico: e.target.value,
                              }))
                            }
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="email-medico-fup"
                            className="font-medium"
                          >
                            E-mail
                          </Label>
                          <Input
                            id="email-medico-fup"
                            type="email"
                            placeholder="E-mail do médico"
                            value={form.emailMedico}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                emailMedico: e.target.value,
                              }))
                            }
                            className="h-11"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
}

// Card de Queixa Técnica vinculada ao protocolo
function QueixaTecnicaCard({ queixa }: { queixa: QueixaTecnicaMock }) {
  return (
    <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-lg">
      <div className="font-bold text-blue-900 mb-2 flex items-center gap-2">
        <FileText className="h-5 w-5 text-blue-700" /> Queixa Técnica
        Relacionada
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="font-semibold text-gray-700">Número:</span>{" "}
          <span className="text-blue-900 font-bold">{queixa.numero}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Motivo:</span>{" "}
          <span className="text-blue-900 font-bold">{queixa.motivo}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Subcategoria:</span>{" "}
          <span className="text-blue-900 font-bold">{queixa.subcategoria}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Detalhe:</span>{" "}
          <span className="text-blue-900 font-bold">{queixa.detalhe}</span>
        </div>
      </div>
    </div>
  );
}

export function NovaGestacaoForm({
  onSubmit,
  onBack,
}: NovaGestacaoFormProps) {
  return (
    <NovaFarmacovigilanciaForm 
      onSubmit={onSubmit} 
      onBack={onBack}
    />
  );
}
