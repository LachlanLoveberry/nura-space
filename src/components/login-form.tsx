import { useForm } from '@tanstack/react-form'
import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card.tsx'
import { Field, FieldDescription, FieldGroup } from '#/components/ui/field.tsx'
import { FormTextField } from '#/components/form-text-field.tsx'
import { loginFormSchema, type LoginFormValues } from '#/lib/auth-schemas'
import { getErrorMessage } from '#/lib/errors'
import { useLoginMutation } from '#/lib/state/auth'
import { cn } from '#/lib/utils.ts'

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
    onSubmit: ({ value }) => {
      loginMutation.reset()
      loginMutation.mutate(value)
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
                {(field) => (
                  <FormTextField
                    field={field}
                    label="Email"
                    type="email"
                    placeholder="m@example.com"
                    helpText="We will use this to identify your account."
                  />
                )}
              </form.Field>

              <form.Field name="password">
                {(field) => (
                  <FormTextField
                    field={field}
                    label="Password"
                    type="password"
                    helpText="Enter the password you used to sign up."
                  />
                )}
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
                <FieldDescription className="space-y-1 text-center">
                {loginMutation.isError ? (
                  <span className="block text-red-400">
                    {getErrorMessage(loginMutation.error)}
                  </span>
                ) : null}
                  {form.state.errorMap.onSubmit ? (
                    <span className="block text-red-400">
                      {typeof form.state.errorMap.onSubmit === 'string'
                        ? form.state.errorMap.onSubmit
                        : 'Please fix the highlighted fields.'}
                    </span>
                  ) : null}
                  Don&apos;t have an account?{' '}
                  <Link className="underline underline-offset-4" to="/signup">
                    Sign up
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
