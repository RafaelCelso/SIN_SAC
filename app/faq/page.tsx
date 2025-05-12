"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Plus, ExternalLink, BookOpen, Save, X, Edit, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Dados iniciais de FAQ
const INITIAL_FAQS = [
  {
    id: "1",
    pergunta: "Como registrar uma queixa técnica?",
    resposta:
      "Para registrar uma queixa técnica, acesse o menu 'Atendimentos' > 'Queixas Técnicas' e clique no botão 'Nova Queixa Técnica'. Preencha o formulário com as informações necessárias e clique em 'Salvar'.",
    tags: ["registro", "queixa técnica"],
  },
  {
    id: "2",
    pergunta: "Qual a diferença entre queixa técnica e evento adverso?",
    resposta:
      "Uma queixa técnica está relacionada a problemas com o produto em si, como embalagem, rotulagem ou funcionamento inadequado. Já um evento adverso refere-se a reações indesejadas ou danos à saúde que podem estar relacionados ao uso do produto.",
    tags: ["diferença", "queixa técnica", "evento adverso"],
  },
  {
    id: "3",
    pergunta: "Como consultar a bula de um medicamento?",
    resposta:
      "Você pode consultar a bula de um medicamento diretamente no site da Anvisa, através do Bulário Eletrônico. Acesse o link disponível na página de FAQ ou utilize o campo de busca para encontrar o medicamento desejado.",
    tags: ["consulta", "bula", "medicamento"],
  },
  {
    id: "4",
    pergunta: "Quais informações são necessárias para registrar uma farmacovigilância?",
    resposta:
      "Para registrar uma farmacovigilância, você precisará informar dados do paciente (nome, idade, gênero), dados do medicamento (nome, lote, fabricante), descrição detalhada da reação adversa, data de início e término dos sintomas, e outras informações relevantes sobre o caso.",
    tags: ["registro", "farmacovigilância"],
  },
  {
    id: "5",
    pergunta: "Como acompanhar o status de uma solicitação?",
    resposta:
      "Para acompanhar o status de uma solicitação, acesse o menu correspondente ao tipo de solicitação (Queixas Técnicas, Informações Médicas ou Farmacovigilância) e utilize os filtros para localizar a solicitação desejada. O status atual será exibido na coluna 'Status'.",
    tags: ["acompanhamento", "status", "solicitação"],
  },
]

// Dados iniciais de links úteis
const INITIAL_LINKS = [
  {
    id: "1",
    titulo: "Bulário Eletrônico Anvisa",
    descricao: "Consulte bulas de medicamentos",
    url: "https://consultas.anvisa.gov.br/#/bulario/",
    icone: "blue",
  },
  {
    id: "2",
    titulo: "Notificações Anvisa",
    descricao: "Sistema de notificações",
    url: "https://www.gov.br/anvisa/pt-br/assuntos/fiscalizacao-e-monitoramento/notificacoes",
    icone: "green",
  },
  {
    id: "3",
    titulo: "Publicações Anvisa",
    descricao: "Documentos e publicações",
    url: "https://www.gov.br/anvisa/pt-br/centraisdeconteudo/publicacoes/fiscalizacao-e-monitoramento",
    icone: "purple",
  },
]

export default function FAQPage() {
  const [faqs, setFaqs] = useState<{ id: string; pergunta: string; resposta: string; tags: string[] }[]>(INITIAL_FAQS)
  const [links, setLinks] = useState(INITIAL_LINKS)
  const [searchQuery, setSearchQuery] = useState("")
  const [tagQuery, setTagQuery] = useState("")
  const [newFaq, setNewFaq] = useState<{ pergunta: string; resposta: string; tags: string[] }>({ pergunta: "", resposta: "", tags: [] })
  const [newTag, setNewTag] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState<{ id: string; pergunta: string; resposta: string; tags: string[] } | null>(null)
  const [editingLink, setEditingLink] = useState<{
    id: string
    titulo: string
    descricao: string
    url: string
    icone: string
  } | null>(null)
  const [isNewLinkDialogOpen, setIsNewLinkDialogOpen] = useState(false)
  const [newLink, setNewLink] = useState({
    titulo: "",
    descricao: "",
    url: "",
    icone: "blue",
  })

  // Filtrar FAQs com base na busca
  const filteredFaqs = faqs.filter(
    (faq) =>
      (faq.pergunta.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.resposta.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (tagQuery.trim() === "" || faq.tags.some(tag => tag.toLowerCase().includes(tagQuery.toLowerCase())))
  )

  const handleAddFaq = () => {
    if (!newFaq.pergunta.trim() || !newFaq.resposta.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      })
      return
    }

    const newId = (faqs.length + 1).toString()
    setFaqs([...faqs, { id: newId, ...newFaq }])
    setNewFaq({ pergunta: "", resposta: "", tags: [] })
    setIsDialogOpen(false)

    toast({
      title: "Sucesso",
      description: "FAQ adicionado com sucesso",
    })
  }

  const handleEditFaq = () => {
    if (!editingFaq || !editingFaq.pergunta.trim() || !editingFaq.resposta.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      })
      return
    }

    setFaqs(faqs.map((faq) => (faq.id === editingFaq.id ? editingFaq : faq)))
    setEditingFaq(null)

    toast({
      title: "Sucesso",
      description: "FAQ atualizado com sucesso",
    })
  }

  const handleDeleteFaq = (id: string) => {
    setFaqs(faqs.filter((faq) => faq.id !== id))

    toast({
      title: "Sucesso",
      description: "FAQ removido com sucesso",
    })
  }

  const handleAddLink = () => {
    if (!newLink.titulo.trim() || !newLink.url.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    const newId = (links.length + 1).toString()
    setLinks([...links, { id: newId, ...newLink }])
    setNewLink({
      titulo: "",
      descricao: "",
      url: "",
      icone: "blue",
    })
    setIsNewLinkDialogOpen(false)

    toast({
      title: "Sucesso",
      description: "Link adicionado com sucesso",
    })
  }

  const handleEditLink = () => {
    if (!editingLink || !editingLink.titulo.trim() || !editingLink.url.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    setLinks(links.map((link) => (link.id === editingLink.id ? editingLink : link)))
    setEditingLink(null)

    toast({
      title: "Sucesso",
      description: "Link atualizado com sucesso",
    })
  }

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id))

    toast({
      title: "Sucesso",
      description: "Link removido com sucesso",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="p-4 rounded-lg flex-1">
            <h1 className="text-2xl font-bold text-gray-900">FAQ</h1>
            <p className="text-sm text-gray-600 mt-1">Perguntas frequentes e respostas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {/* Barra de busca movida para cima da seção de perguntas */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar perguntas..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative w-full sm:w-auto">
                <Input
                  type="search"
                  placeholder="Buscar por tag..."
                  className="w-full sm:w-[220px]"
                  value={tagQuery}
                  onChange={e => setTagQuery(e.target.value)}
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto bg-[#26B99D] hover:bg-[#1E9A82]">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Pergunta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Pergunta</DialogTitle>
                    <DialogDescription>
                      Preencha os campos abaixo para adicionar uma nova pergunta ao FAQ.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="pergunta">Pergunta</Label>
                      <Input
                        id="pergunta"
                        placeholder="Digite a pergunta"
                        value={newFaq.pergunta}
                        onChange={(e) => setNewFaq({ ...newFaq, pergunta: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resposta">Resposta</Label>
                      <Textarea
                        id="resposta"
                        placeholder="Digite a resposta"
                        rows={5}
                        value={newFaq.resposta}
                        onChange={(e) => setNewFaq({ ...newFaq, resposta: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <div className="flex gap-2">
                        <Input
                          id="tags"
                          placeholder="Digite uma tag e pressione Enter"
                          value={newTag}
                          onChange={e => setNewTag(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && newTag.trim()) {
                              e.preventDefault();
                              if (!newFaq.tags.includes(newTag.trim())) {
                                setNewFaq({ ...newFaq, tags: [...newFaq.tags, newTag.trim()] });
                              }
                              setNewTag("");
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            if (newTag.trim() && !newFaq.tags.includes(newTag.trim())) {
                              setNewFaq({ ...newFaq, tags: [...newFaq.tags, newTag.trim()] });
                              setNewTag("");
                            }
                          }}
                        >Adicionar</Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newFaq.tags.map((tag, idx) => (
                          <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                            {tag}
                            <button
                              type="button"
                              className="ml-1 text-blue-700 hover:text-red-500"
                              onClick={() => setNewFaq({ ...newFaq, tags: newFaq.tags.filter((t) => t !== tag) })}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="destructive" onClick={() => setIsDialogOpen(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button onClick={handleAddFaq}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Perguntas Frequentes</CardTitle>
                <CardDescription>Encontre respostas para as dúvidas mais comuns</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredFaqs.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaqs.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-left">{faq.pergunta}</AccordionTrigger>
                        <AccordionContent>
                          <div className="relative">
                            <p className="text-muted-foreground pr-16">{faq.resposta}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {faq.tags && faq.tags.map(tag => (
                                <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{tag}</span>
                              ))}
                            </div>
                            <div className="absolute top-0 right-0 flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setEditingFaq(faq)}
                              >
                                <Edit className="h-4 w-4 text-muted-foreground" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleDeleteFaq(faq.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-10">
                    <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-lg font-medium">Nenhuma pergunta encontrada</p>
                    <p className="text-muted-foreground mt-1">
                      {searchQuery ? "Tente uma busca diferente" : "Adicione perguntas ao FAQ"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Links Úteis</CardTitle>
                    <CardDescription>Acesse recursos externos importantes</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsNewLinkDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 rounded-md border hover:bg-muted transition-colors group cursor-pointer no-underline"
                      style={{ position: 'relative' }}
                      tabIndex={0}
                    >
                      <div className={`h-10 w-10 rounded-full bg-${link.icone}-100 flex items-center justify-center`}>
                        <ExternalLink className={`h-5 w-5 text-${link.icone}-600`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{link.titulo}</p>
                        <p className="text-xs text-muted-foreground">{link.descricao}</p>
                      </div>
                      <div
                        className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={e => e.stopPropagation()}
                        onMouseDown={e => e.stopPropagation()}
                        style={{ zIndex: 2 }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={ev => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            setEditingLink(link);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={ev => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            handleDeleteLink(link.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog para adicionar novo link */}
      <Dialog open={isNewLinkDialogOpen} onOpenChange={setIsNewLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Link</DialogTitle>
            <DialogDescription>Preencha os campos abaixo para adicionar um novo link útil.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="link-titulo">Título</Label>
              <Input
                id="link-titulo"
                placeholder="Digite o título do link"
                value={newLink.titulo}
                onChange={(e) => setNewLink({ ...newLink, titulo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-descricao">Descrição</Label>
              <Input
                id="link-descricao"
                placeholder="Digite uma breve descrição"
                value={newLink.descricao}
                onChange={(e) => setNewLink({ ...newLink, descricao: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                placeholder="Digite a URL do link"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-icone">Cor do Ícone</Label>
              <Select
                value={newLink.icone}
                onValueChange={(value) => setNewLink({ ...newLink, icone: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a cor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Azul</SelectItem>
                  <SelectItem value="green">Verde</SelectItem>
                  <SelectItem value="purple">Roxo</SelectItem>
                  <SelectItem value="red">Vermelho</SelectItem>
                  <SelectItem value="amber">Âmbar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={() => setIsNewLinkDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleAddLink}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para edição de link */}
      {editingLink && (
        <Dialog open={!!editingLink} onOpenChange={(open) => !open && setEditingLink(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Link</DialogTitle>
              <DialogDescription>Edite os campos abaixo para atualizar o link.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-link-titulo">Título</Label>
                <Input
                  id="edit-link-titulo"
                  placeholder="Digite o título do link"
                  value={editingLink.titulo}
                  onChange={(e) => setEditingLink({ ...editingLink, titulo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-link-descricao">Descrição</Label>
                <Input
                  id="edit-link-descricao"
                  placeholder="Digite uma breve descrição"
                  value={editingLink.descricao}
                  onChange={(e) => setEditingLink({ ...editingLink, descricao: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-link-url">URL</Label>
                <Input
                  id="edit-link-url"
                  placeholder="Digite a URL do link"
                  value={editingLink.url}
                  onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-link-icone">Cor do Ícone</Label>
                <Select
                  value={editingLink.icone}
                  onValueChange={(value) => setEditingLink({ ...editingLink, icone: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a cor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Azul</SelectItem>
                    <SelectItem value="green">Verde</SelectItem>
                    <SelectItem value="purple">Roxo</SelectItem>
                    <SelectItem value="red">Vermelho</SelectItem>
                    <SelectItem value="amber">Âmbar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingLink(null)}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleEditLink}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog para edição de FAQ */}
      {editingFaq && (
        <Dialog open={!!editingFaq} onOpenChange={(open) => !open && setEditingFaq(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Pergunta</DialogTitle>
              <DialogDescription>Edite os campos abaixo para atualizar a pergunta.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-pergunta">Pergunta</Label>
                <Input
                  id="edit-pergunta"
                  placeholder="Digite a pergunta"
                  value={editingFaq.pergunta}
                  onChange={(e) => setEditingFaq({ ...editingFaq, pergunta: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-resposta">Resposta</Label>
                <Textarea
                  id="edit-resposta"
                  placeholder="Digite a resposta"
                  rows={5}
                  value={editingFaq.resposta}
                  onChange={(e) => setEditingFaq({ ...editingFaq, resposta: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingFaq(null)}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleEditFaq}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  )
}

