import { Field, FieldDescription, FieldLabel } from '#/components/ui/field.tsx'
import { Input } from '#/components/ui/input.tsx'
import { getFirstError } from '#/lib/form'

/**
 * Minimal structural view of a TanStack Form field — only the members this
 * component touches, so callers aren't coupled to the full FieldApi generics.
 */
type TextFieldApi = {
  name: string
  state: { value: string; meta: { errors: Array<unknown> } }
  handleBlur: () => void
  handleChange: (value: string) => void
}

type FormTextFieldProps = {
  field: TextFieldApi
  label: string
  /** Shown when there is no validation error. */
  helpText: string
  type?: React.ComponentProps<typeof Input>['type']
  placeholder?: string
}

export function FormTextField({
  field,
  label,
  helpText,
  type = 'text',
  placeholder,
}: FormTextFieldProps) {
  const error = getFirstError(field.state.meta.errors)

  return (
    <Field>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        type={type}
        placeholder={placeholder}
        value={field.state.value}
        aria-invalid={Boolean(error)}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
      />
      <FieldDescription className={error ? 'text-red-400' : undefined}>
        {error ?? helpText}
      </FieldDescription>
    </Field>
  )
}
