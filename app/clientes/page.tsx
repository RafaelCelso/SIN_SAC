"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, UserPlus, FileText, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

// Dados simulados de clientes (apenas pessoas físicas)
const CLIENTES_MOCK = [
  {
    id: "1",
    nome: "Maria Silva",
    documento: "123.456.789-00",
    telefone: "(11) 98765-4321",
    email: "maria.silva@email.com",
    endereco: "Av. Paulista, 1000 - São Paulo/SP",
    dataCadastro: "10/01/2023",
  },
  {
    id: "2",
    nome: "João Santos",
    documento: "987.654.321-00",
    telefone: "(11) 91234-5678",
    email: "joao.santos@email.com",
    endereco: "Rua Augusta, 500 - São Paulo/SP",
    dataCadastro: "15/02/2023",
  },
  {
    id: "4",
    nome: "Ana Oliveira",
    documento: "456.789.123-00",
    telefone: "(11) 97654-3210",
    email: "ana.oliveira@email.com",
    endereco: "Rua Oscar Freire, 300 - São Paulo/SP",
    dataCadastro: "20/03/2023",
  },
  {
    id: "5",
    nome: "Carlos Mendes",
    documento: "789.123.456-00",
    telefone: "(11) 95678-1234",
    email: "carlos.mendes@email.com",
    endereco: "Av. Brigadeiro Faria Lima, 2000 - São Paulo/SP",
    dataCadastro: "12/04/2023",
  },
  {
    id: "7",
    nome: "Juliana Costa",
    documento: "321.654.987-00",
    telefone: "(11) 94321-8765",
    email: "juliana.costa@email.com",
    endereco: "Rua Haddock Lobo, 400 - São Paulo/SP",
    dataCadastro: "08/05/2023",
  },
  {
    id: "8",
    nome: "Roberto Almeida",
    documento: "654.321.987-00",
    telefone: "(11) 93456-7890",
    email: "roberto.almeida@email.com",
    endereco: "Av. Paulista, 1500 - São Paulo/SP",
    dataCadastro: "15/05/2023",
  },
  {
    id: "9",
    nome: "Fernanda Lima",
    documento: "987.654.321-00",
    telefone: "(11) 92345-6789",
    email: "fernanda.lima@email.com",
    endereco: "Rua Augusta, 700 - São Paulo/SP",
    dataCadastro: "22/05/2023",
  },
  {
    id: "10",
    nome: "Ricardo Souza",
    documento: "123.456.789-00",
    telefone: "(11) 91234-5678",
    email: "ricardo.souza@email.com",
    endereco: "Av. Rebouças, 800 - São Paulo/SP",
    dataCadastro: "01/06/2023",
  },
  {
    id: "11",
    nome: "Patrícia Santos",
    documento: "456.789.123-00",
    telefone: "(11) 90123-4567",
    email: "patricia.santos@email.com",
    endereco: "Rua Oscar Freire, 500 - São Paulo/SP",
    dataCadastro: "10/06/2023",
  },
  {
    id: "12",
    nome: "Marcelo Oliveira",
    documento: "789.123.456-00",
    telefone: "(11) 99012-3456",
    email: "marcelo.oliveira@email.com",
    endereco: "Av. Brigadeiro Faria Lima, 1000 - São Paulo/SP",
    dataCadastro: "15/06/2023",
  },
  {
    id: "13",
    nome: "Camila Rodrigues",
    documento: "321.654.987-00",
    telefone: "(11) 98901-2345",
    email: "camila.rodrigues@email.com",
    endereco: "Rua Haddock Lobo, 600 - São Paulo/SP",
    dataCadastro: "20/06/2023",
  },
  {
    id: "14",
    nome: "Lucas Ferreira",
    documento: "654.321.987-00",
    telefone: "(11) 97890-1234",
    email: "lucas.ferreira@email.com",
    endereco: "Av. Paulista, 2000 - São Paulo/SP",
    dataCadastro: "25/06/2023",
  },
  {
    id: "15",
    nome: "Bianca Martins",
    documento: "111.222.333-44",
    telefone: "(11) 96789-0123",
    email: "bianca.martins@email.com",
    endereco: "Rua Consolação, 1200 - São Paulo/SP",
    dataCadastro: "30/06/2023",
  },
  {
    id: "16",
    nome: "Eduardo Costa",
    documento: "222.333.444-55",
    telefone: "(11) 95678-9012",
    email: "eduardo.costa@email.com",
    endereco: "Av. Paulista, 2500 - São Paulo/SP",
    dataCadastro: "05/07/2023",
  },
  {
    id: "17",
    nome: "Mariana Alves",
    documento: "333.444.555-66",
    telefone: "(11) 94567-8901",
    email: "mariana.alves@email.com",
    endereco: "Rua Augusta, 900 - São Paulo/SP",
    dataCadastro: "10/07/2023",
  },
  {
    id: "18",
    nome: "Rodrigo Pereira",
    documento: "444.555.666-77",
    telefone: "(11) 93456-7890",
    email: "rodrigo.pereira@email.com",
    endereco: "Av. Rebouças, 1500 - São Paulo/SP",
    dataCadastro: "15/07/2023",
  },
  {
    id: "19",
    nome: "Carla Ribeiro",
    documento: "555.666.777-88",
    telefone: "(11) 92345-6789",
    email: "carla.ribeiro@email.com",
    endereco: "Rua Oscar Freire, 700 - São Paulo/SP",
    dataCadastro: "20/07/2023",
  },
  {
    id: "20",
    nome: "Felipe Santos",
    documento: "666.777.888-99",
    telefone: "(11) 91234-5678",
    email: "felipe.santos@email.com",
    endereco: "Av. Brigadeiro Faria Lima, 3000 - São Paulo/SP",
    dataCadastro: "25/07/2023",
  },
  {
    id: "21",
    nome: "Aline Ferreira",
    documento: "777.888.999-00",
    telefone: "(11) 90123-4567",
    email: "aline.ferreira@email.com",
    endereco: "Rua Haddock Lobo, 800 - São Paulo/SP",
    dataCadastro: "30/07/2023",
  },
  {
    id: "22",
    nome: "Bruno Oliveira",
    documento: "888.999.000-11",
    telefone: "(11) 99012-3456",
    email: "bruno.oliveira@email.com",
    endereco: "Av. Paulista, 3000 - São Paulo/SP",
    dataCadastro: "05/08/2023",
  },
]

export default function ClientesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filtrar clientes com base na busca
  const filteredClientes = CLIENTES_MOCK.filter((cliente) => {
    // Filtro de texto (busca)
    return (
      searchQuery === "" ||
      cliente.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cliente.documento.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cliente.telefone.includes(searchQuery)
    )
  })

  // Calcular paginação
  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredClientes.slice(indexOfFirstItem, indexOfLastItem)

  // Função para gerar os botões de paginação
  const generatePaginationButtons = () => {
    const buttons = []
    const maxVisibleButtons = 5 // Número máximo de botões de página visíveis

    // Adicionar botão "Anterior"
    buttons.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-2"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>,
    )

    // Lógica para mostrar os botões de página
    if (totalPages <= maxVisibleButtons) {
      // Se o total de páginas for menor ou igual ao máximo visível, mostrar todas as páginas
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(i)}
            className="min-w-[32px]"
          >
            {i}
          </Button>,
        )
      }
    } else {
      // Se houver muitas páginas, mostrar um subconjunto com elipses

      // Sempre mostrar a primeira página
      buttons.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(1)}
          className="min-w-[32px]"
        >
          1
        </Button>,
      )

      // Calcular o intervalo de páginas a serem mostradas
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      // Ajustar para mostrar sempre 3 páginas no meio (quando possível)
      if (currentPage <= 3) {
        endPage = Math.min(4, totalPages - 1)
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(totalPages - 3, 2)
      }

      // Adicionar elipse se necessário antes das páginas do meio
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="px-2">
            ...
          </span>,
        )
      }

      // Adicionar páginas do meio
      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(i)}
            className="min-w-[32px]"
          >
            {i}
          </Button>,
        )
      }

      // Adicionar elipse se necessário depois das páginas do meio
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="px-2">
            ...
          </span>,
        )
      }

      // Sempre mostrar a última página
      buttons.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(totalPages)}
          className="min-w-[32px]"
        >
          {totalPages}
        </Button>,
      )
    }

    // Adicionar botão "Próximo"
    buttons.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-2"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>,
    )

    return buttons
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Buscar Clientes</h1>
            <p className="text-sm text-gray-600 mt-1">Gerenciamento de clientes e contatos</p>
          </div>
          <Button asChild>
            <Link href="/clientes/novo">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Link>
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Buscar Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar por nome, CPF, telefone ou email"
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button onClick={() => setSearchQuery("")} variant="outline" className="md:w-auto">
                    Limpar
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>CPF</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.length > 0 ? (
                        currentItems.map((cliente) => (
                          <TableRow key={cliente.id}>
                            <TableCell className="font-medium">{cliente.nome}</TableCell>
                            <TableCell>{cliente.documento}</TableCell>
                            <TableCell>{cliente.telefone}</TableCell>
                            <TableCell>{cliente.email}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200"
                                asChild
                              >
                                <Link href={`/clientes/${cliente.id}`}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Ver cadastro
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6">
                            Nenhum cliente encontrado com os critérios de busca.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {filteredClientes.length > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredClientes.length)} de{" "}
                      {filteredClientes.length} clientes
                    </div>
                    <div className="flex items-center gap-1">{generatePaginationButtons()}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

