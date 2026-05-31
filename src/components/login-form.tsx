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
import { loginFormSchema, type LoginFormValues } from '#/lib/auth-schemas'
import { useLoginMutation } from '#/lib/state/auth'
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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const loginMutation = useLoginMutation()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    } satisfies LoginFormValues,
    validators: {
      onChange: loginFormSchema,
      onBlur: loginFormSchema,
      onSubmit: loginFormSchema,
    },
    onSubmit: async ({ value }) => {
      await loginMutation.mutateAsync(value)
    },
  })

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email and password to continue.
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
                      <FieldDescription
                        className={error ? 'text-red-400' : undefined}
                      >
                        {error ?? 'We will use this to identify your account.'}
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
                      <div className="flex items-center">
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <span className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                          Forgot your password?
                        </span>
                      </div>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        value={field.state.value}
                        aria-invalid={Boolean(error)}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.value)}
                      />
                      <FieldDescription
                        className={error ? 'text-red-400' : undefined}
                      >
                      {error ?? 'Enter the password you used to sign up.'}
                      </FieldDescription>
                    </Field>
                  )
                }}
              </form.Field>

              <Field>
                <Button
                  type="submit"
                  disabled={!form.state.canSubmit || form.state.isSubmitting || loginMutation.isPending}
                >
                  {form.state.isSubmitting || loginMutation.isPending
                    ? 'Logging in...'
                    : 'Login'}
                </Button>
                <Button variant="outline" type="button">
                  Login with Google
                </Button>
                <FieldDescription className="space-y-1 text-center">
                  {loginMutation.isError ? (
                    <span className="block text-red-400">
                      {(loginMutation.error as Error).message}
                    </span>
                  ) : null}
                  {form.state.errorMap.onSubmit ? (
                    <span className="block text-red-400">
                      {typeof form.state.errorMap.onSubmit === 'string'
                        ? form.state.errorMap.onSubmit
                        : 'Please fix the highlighted fields.'}
                    </span>
                  ) : null}
                  Don&apos;t have an account? Sign up from the signup page.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
