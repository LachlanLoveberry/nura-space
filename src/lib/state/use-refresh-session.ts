import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { queryKeys } from "#/lib/query-keys";
import type { UserPublicType } from "#/lib/contracts";

/**
 * Syncs the cached current-user query with the latest session state and
 * invalidates the router so route guards re-run. Pass `null` to clear the
 * session (e.g. on logout).
 */
export function useRefreshSession() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return async function refreshSession(user: UserPublicType | null) {
		if (user) {
			queryClient.setQueryData(queryKeys.auth.currentUser, user);
		} else {
			queryClient.removeQueries({
				queryKey: queryKeys.auth.currentUser,
			});
		}
		router.invalidate();
	};
}
