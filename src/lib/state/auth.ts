import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { login, logout, signup } from '#/lib/api/auth'
import { queryKeys } from '#/lib/query-keys'
import type { LoginFormValues, SignupFormValues } from '#/lib/auth-schemas'

function useRefreshSession() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return async function refreshSession() {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.auth.currentUser,
    })
    router.invalidate()
  }
}

export function useLoginMutation() {
  const refreshSession = useRefreshSession()

  return useMutation({
    mutationFn: (values: LoginFormValues) => login(values),
    onSuccess: refreshSession,
  })
}

export function useSignupMutation() {
  const refreshSession = useRefreshSession()

  return useMutation({
    mutationFn: (values: SignupFormValues) => signup(values),
    onSuccess: refreshSession,
  })
}

export function useLogoutMutation() {
  const refreshSession = useRefreshSession()

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: refreshSession,
  })
}
