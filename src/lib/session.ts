import { queryOptions } from "@tanstack/react-query";
import { currentUser } from "#/lib/api/auth";
import { getRequestCookieHeader } from "#/lib/request-cookie.server";
import { queryKeys } from "#/lib/query-keys";
import { createDebugLogger } from "#/lib/debug";
import type { UserPublicType } from "#/lib/contracts";

const debugAuth = createDebugLogger("auth");

export function getHomePath(user: Pick<UserPublicType, "selectedCity">) {
	return user.selectedCity ? "/home" : "/select-city";
}

export function resolveRouteRedirect(
	pathname: string,
	user: UserPublicType | null,
) {
	if (pathname.startsWith("/api/")) {
		return null;
	}

	if (!user) {
		if (pathname === "/signup" || pathname === "/login") {
			return null;
		}

		return "/signup";
	}

	if (pathname === "/signup" || pathname === "/login") {
		return getHomePath(user);
	}

	if (!user.selectedCity && pathname !== "/select-city") {
		return "/select-city";
	}

	if (user.selectedCity && pathname === "/select-city") {
		return getHomePath(user);
	}

	if (pathname === "/") {
		const redirectTo = getHomePath(user);
		debugAuth("redirect-from-root", {
			pathname,
			redirectTo,
			userHasCity: Boolean(user.selectedCity),
		});
		return redirectTo;
	}

	return null;
}

export const currentUserQueryOptions = () =>
	queryOptions({
		queryKey: queryKeys.auth.currentUser,
		queryFn: async () => {
			const cookieHeader = typeof window === "undefined" ? getRequestCookieHeader() : null;
			debugAuth("current-user-request", {
				runtime: typeof window === "undefined" ? "server" : "client",
				hasCookieHeader: Boolean(cookieHeader),
			});
			const user = await currentUser();
			debugAuth("current-user-response", {
				hasUser: Boolean(user),
				hasCity: Boolean(user?.selectedCity),
			});
			return user;
		},
		staleTime: Infinity,
	});

export async function ensureCurrentUser(queryClient: {
	getQueryData: (
		queryKey: ReturnType<typeof currentUserQueryOptions>["queryKey"],
	) => UserPublicType | null | undefined;
	fetchQuery: (
		options: ReturnType<typeof currentUserQueryOptions>,
	) => Promise<UserPublicType | null>;
}) {
	const cachedUser = queryClient.getQueryData(
		currentUserQueryOptions().queryKey,
	);
	if (cachedUser) {
		debugAuth("current-user-cache-hit", {
			hasCity: Boolean(cachedUser.selectedCity),
		});
		return cachedUser;
	}

	debugAuth("current-user-cache-miss", {});
	return queryClient.fetchQuery(currentUserQueryOptions());
}
