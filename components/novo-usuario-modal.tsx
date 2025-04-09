"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Lock } from "lucide-react";

interface NovoUsuarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (usuario: {
    nome: string;
    email: string;
    perfil: string;
    senha: string;
  }) => void;
}

export function NovoUsuarioModal({ open, onOpenChange, onSave }: NovoUsuarioModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    perfil: "",
    senha: "",
    confirmarSenha: "",
  });

  const perfis = ["Administrador", "Analista", "Supervisor", "Usuário"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      nome: "",
      email: "",
      perfil: "",
      senha: "",
      confirmarSenha: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-lg shadow-xl">
        <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg">
          <DialogTitle className="text-xl font-bold">Novo Usuário</DialogTitle>
          <DialogDescription className="text-teal-100">
            Preencha as informações para criar um novo usuário
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informações Básicas */}
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-teal-600" />
                <h3 className="font-medium text-lg text-gray-800">Informações Básicas</h3>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">
                    Nome Completo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Digite o nome completo"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    E-mail <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Digite o e-mail"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="perfil">
                    Perfil <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.perfil}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, perfil: value }))}
                  >
                    <SelectTrigger id="perfil" className="h-11">
                      <SelectValue placeholder="Selecione o perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="atendente">Atendente</SelectItem>
                      <SelectItem value="gerente">Gerente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Senha */}
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="h-5 w-5 text-teal-600" />
                <h3 className="font-medium text-lg text-gray-800">Senha</h3>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="senha">
                    Senha <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="senha"
                    name="senha"
                    type="password"
                    value={formData.senha}
                    onChange={handleInputChange}
                    placeholder="Digite a senha"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">
                    Confirmar Senha <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="confirmarSenha"
                    name="confirmarSenha"
                    type="password"
                    value={formData.confirmarSenha}
                    onChange={handleInputChange}
                    placeholder="Confirme a senha"
                    required
                    className="h-11"
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
  );
} 