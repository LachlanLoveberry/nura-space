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
import { signupFormSchema, type SignupFormValues } from '#/lib/auth-schemas'
import { getErrorMessage } from '#/lib/errors'
import { useSignupMutation } from '#/lib/state/auth'
import { cn } from '#/lib/utils.ts'

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
    onSubmit: ({ value }) => {
      signupMutation.reset()
      signupMutation.mutate(value)
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
              {(field) => (
                <FormTextField
                  field={field}
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  helpText="We will display this on your account profile."
                />
              )}
            </form.Field>

            <form.Field name="email">
              {(field) => (
                <FormTextField
                  field={field}
                  label="Email"
                  type="email"
                  placeholder="m@example.com"
                  helpText="We will use this to contact you."
                />
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <FormTextField
                  field={field}
                  label="Password"
                  type="password"
                  helpText="Use at least 8 characters."
                />
              )}
            </form.Field>

            <form.Field name="confirmPassword">
              {(field) => (
                <FormTextField
                  field={field}
                  label="Confirm Password"
                  type="password"
                  helpText="Confirm that both passwords match."
                />
              )}
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
              <FieldDescription className="space-y-1 px-6 text-center">
                {signupMutation.isError ? (
                  <span className="block text-red-400">
                    {getErrorMessage(signupMutation.error)}
                  </span>
                ) : null}
                {form.state.errorMap.onSubmit ? (
                  <span className="block text-red-400">
                    {typeof form.state.errorMap.onSubmit === 'string'
                      ? form.state.errorMap.onSubmit
                      : 'Please fix the highlighted fields.'}
                  </span>
                ) : null}
                Already have an account?{' '}
                <Link className="underline underline-offset-4" to="/login">
                  Log in
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
