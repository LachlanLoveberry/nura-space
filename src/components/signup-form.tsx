import { useForm } from '@tanstack/react-form'
import { Button } from '#/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card.tsx'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field.tsx'
import { Input } from '#/components/ui/input.tsx'
import { signupFormSchema, type SignupFormValues } from '#/lib/auth-schemas'
import { useSignupMutation } from '#/lib/state/auth'
import { cn } from '#/lib/utils.ts'

function getFirstError(errors: Array<unknown>) {
  const error = errors[0]
  if (typeof error === 'string') {
    return error
  }

  if (typeof error === 'object' && error && 'message' in error) {
    return String((error as { message?: unknown }).message ?? '')
  }

  return null
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  const signupMutation = useSignupMutation()

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    } satisfies SignupFormValues,
    validators: {
      onChange: signupFormSchema,
      onBlur: signupFormSchema,
      onSubmit: signupFormSchema,
    },
    onSubmit: async ({ value }) => {
      await signupMutation.mutateAsync(value)
    },
  })

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Validate your details, sign up once, and the router will move you to the right step.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            void form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field name="name">
              {(field) => {
                const error = getFirstError(field.state.meta.errors)

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder="John Doe"
                      value={field.state.value}
                      aria-invalid={Boolean(error)}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                    />
                    <FieldDescription className={error ? 'text-red-400' : undefined}>
                      {error ?? 'We will display this on your account profile.'}
                    </FieldDescription>
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="email">
              {(field) => {
                const error = getFirstError(field.state.meta.errors)

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      placeholder="m@example.com"
                      value={field.state.value}
                      aria-invalid={Boolean(error)}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                    />
                    <FieldDescription className={error ? 'text-red-400' : undefined}>
                      {error ?? 'We will use this to contact you.'}
                    </FieldDescription>
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="password">
              {(field) => {
                const error = getFirstError(field.state.meta.errors)

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      aria-invalid={Boolean(error)}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                    />
                    <FieldDescription className={error ? 'text-red-400' : undefined}>
                      {error ?? 'Use at least 8 characters.'}
                    </FieldDescription>
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="confirmPassword">
              {(field) => {
                const error = getFirstError(field.state.meta.errors)

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      aria-invalid={Boolean(error)}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                    />
                    <FieldDescription className={error ? 'text-red-400' : undefined}>
                      {error ?? 'Confirm that both passwords match.'}
                    </FieldDescription>
                  </Field>
                )
              }}
            </form.Field>

            <Field>
              <Button
                type="submit"
                disabled={!form.state.canSubmit || form.state.isSubmitting || signupMutation.isPending}
              >
                {form.state.isSubmitting || signupMutation.isPending
                  ? 'Creating account...'
                  : 'Create Account'}
              </Button>
              <Button variant="outline" type="button">
                Sign up with Google
              </Button>
              <FieldDescription className="space-y-1 px-6 text-center">
                {signupMutation.isError ? (
                  <span className="block text-red-400">
                    {(signupMutation.error as Error).message}
                  </span>
                ) : null}
                {form.state.errorMap.onSubmit ? (
                  <span className="block text-red-400">
                    {typeof form.state.errorMap.onSubmit === 'string'
                      ? form.state.errorMap.onSubmit
                      : 'Please fix the highlighted fields.'}
                  </span>
                ) : null}
                Already have an account? Sign in from the login page.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
