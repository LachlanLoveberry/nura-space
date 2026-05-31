import { useMutation } from "@tanstack/react-query";
import { login, logout, signup } from "#/lib/api/auth";
import type { LoginFormValues, SignupFormValues } from "#/lib/auth-schemas";
import { useRefreshSession } from "#/lib/state/use-refresh-session";

export function useLoginMutation() {
	const refreshSession = useRefreshSession();

	return useMutation({
		mutationFn: (values: LoginFormValues) => login(values),
		onSuccess: (data) => {
			refreshSession(data.user);
		},
	});
}

export function useSignupMutation() {
	const refreshSession = useRefreshSession();

	return useMutation({
		mutationFn: (values: SignupFormValues) => signup(values),
		onSuccess: (data) => {
			refreshSession(data.user);
		},
	});
}

export function useLogoutMutation() {
	const refreshSession = useRefreshSession();

	return useMutation({
		mutationFn: () => logout(),
		onSuccess: () => {
			refreshSession(null);
		},
	});
}
