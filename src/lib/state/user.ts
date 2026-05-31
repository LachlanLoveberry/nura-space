import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { updateSelectedCity, type CityPayload } from '#/lib/api/user'
import { queryKeys } from '#/lib/query-keys'

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

export function useSelectedCityMutation() {
  const refreshSession = useRefreshSession()

  return useMutation({
    mutationFn: (city: CityPayload) => updateSelectedCity(city),
    onSuccess: refreshSession,
  })
}
