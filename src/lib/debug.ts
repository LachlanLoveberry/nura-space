export function isAuthDebugEnabled() {
	if (typeof window !== "undefined") {
		const params = new URLSearchParams(window.location.search);
		return (
			params.has("debugAuth") ||
			window.localStorage.getItem("debugAuth") === "1"
		);
	}

	return process.env.AUTH_DEBUG === "1";
}

export function createDebugLogger(scope: string) {
	return function debug(label: string, details: Record<string, unknown>) {
		if (!isAuthDebugEnabled()) {
			return;
		}

		console.debug(`[${scope}] ${label}`, details);
	};
}
