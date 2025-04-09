import type { FormSectionData } from "@/components/form-builder/form-builder"
import { FormElement } from "@/components/form-builder/form-element"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FormSectionProps {
  section: FormSectionData
}

export function FormSection({ section }: FormSectionProps) {
  const { title, description, elements } = section

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {elements.map((element) => (
            <FormElement key={element.id} element={element} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

