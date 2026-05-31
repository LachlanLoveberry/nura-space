import { useMutation } from "@tanstack/react-query";
import { type CityPayload, updateSelectedCity } from "#/lib/api/user";
import { useRefreshSession } from "#/lib/state/use-refresh-session";

export function useSelectedCityMutation() {
	const refreshSession = useRefreshSession();

	return useMutation({
		mutationFn: (city: CityPayload) => updateSelectedCity(city),
		onSuccess: refreshSession,
	});
}
