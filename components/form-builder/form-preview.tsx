import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface FormPreviewProps {
  formTitle: string
  formDescription: string
}

export function FormPreview({ formTitle, formDescription }: FormPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{formTitle}</CardTitle>
        <CardDescription>{formDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Informações Gerais</h3>
              <p className="text-sm text-muted-foreground">Preencha as informações básicas</p>

              <div className="grid gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input id="nome" placeholder="Digite seu nome completo" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Digite seu email" />
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button>Enviar Formulário</Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

