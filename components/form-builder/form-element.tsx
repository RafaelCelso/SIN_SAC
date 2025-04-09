import type { FormElementData } from "@/components/form-builder/form-builder"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/date-picker"
import { Badge } from "@/components/ui/badge"

interface FormElementProps {
  element: FormElementData
}

export function FormElement({ element }: FormElementProps) {
  const { type, label, placeholder, required, options, description } = element

  const renderRequiredBadge = () => {
    if (required) {
      return (
        <Badge variant="outline" className="ml-2 text-xs">
          Obrigatório
        </Badge>
      )
    }
    return null
  }

  const renderDescription = () => {
    if (description) {
      return <p className="text-xs text-muted-foreground mt-1">{description}</p>
    }
    return null
  }

  switch (type) {
    case "text":
      return (
        <div className="space-y-2">
          <Label>
            {label} {renderRequiredBadge()}
          </Label>
          {renderDescription()}
          <Input placeholder={placeholder} />
        </div>
      )

    case "textarea":
      return (
        <div className="space-y-2">
          <Label>
            {label} {renderRequiredBadge()}
          </Label>
          {renderDescription()}
          <Textarea placeholder={placeholder} />
        </div>
      )

    case "number":
      return (
        <div className="space-y-2">
          <Label>
            {label} {renderRequiredBadge()}
          </Label>
          {renderDescription()}
          <Input type="number" placeholder={placeholder} />
        </div>
      )

    case "email":
      return (
        <div className="space-y-2">
          <Label>
            {label} {renderRequiredBadge()}
          </Label>
          {renderDescription()}
          <Input type="email" placeholder={placeholder} />
        </div>
      )

    case "select":
      return (
        <div className="space-y-2">
          <Label>
            {label} {renderRequiredBadge()}
          </Label>
          {renderDescription()}
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={placeholder || "Selecione uma opção"} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              )) || (
                <>
                  <SelectItem value="option1">Opção 1</SelectItem>
                  <SelectItem value="option2">Opção 2</SelectItem>
                  <SelectItem value="option3">Opção 3</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      )

    case "radio":
      return (
        <div className="space-y-2">
          <Label>
            {label} {renderRequiredBadge()}
          </Label>
          {renderDescription()}
          <RadioGroup>
            {options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`radio-${index}`} />
                <Label htmlFor={`radio-${index}`}>{option}</Label>
              </div>
            )) || (
              <>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option1" id="radio-1" />
                  <Label htmlFor="radio-1">Opção 1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option2" id="radio-2" />
                  <Label htmlFor="radio-2">Opção 2</Label>
                </div>
              </>
            )}
          </RadioGroup>
        </div>
      )

    case "checkbox":
      return (
        <div className="space-y-2">
          <Label>
            {label} {renderRequiredBadge()}
          </Label>
          {renderDescription()}
          <div className="space-y-2">
            {options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox id={`checkbox-${index}`} />
                <Label htmlFor={`checkbox-${index}`}>{option}</Label>
              </div>
            )) || (
              <>
                <div className="flex items-center space-x-2">
                  <Checkbox id="checkbox-1" />
                  <Label htmlFor="checkbox-1">Opção 1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="checkbox-2" />
                  <Label htmlFor="checkbox-2">Opção 2</Label>
                </div>
              </>
            )}
          </div>
        </div>
      )

    case "date":
      return (
        <div className="space-y-2">
          <Label>
            {label} {renderRequiredBadge()}
          </Label>
          {renderDescription()}
          <DatePicker />
        </div>
      )

    case "heading":
      return (
        <div className="space-y-1">
          <h3 className="text-lg font-medium">{label}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )

    default:
      return (
        <div className="space-y-2">
          <Label>
            {label} {renderRequiredBadge()}
          </Label>
          {renderDescription()}
          <Input placeholder={placeholder} />
        </div>
      )
  }
}

