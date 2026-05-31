import { ApiError } from '#/lib/errors'

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

type ApiErrorPayload = {
	message?: string;
	error?: string;
};

async function getServerCookieHeader() {
	if (typeof window !== "undefined") {
		return undefined;
	}

	const { getRequestHeader } = await import("@tanstack/react-start/server");
	return getRequestHeader("cookie") ?? undefined;
}

function getApiOrigin() {
	if (typeof window !== "undefined" && window.location?.origin) {
		return window.location.origin;
	}

	if (typeof process !== "undefined" && process.env.APP_ORIGIN) {
		return process.env.APP_ORIGIN;
	}

	return "http://localhost:3000";
}

export async function apiGetJson<T>(path: string): Promise<T> {
	const cookieHeader = await getServerCookieHeader();
	const response = await fetch(new URL(path, getApiOrigin()), {
		credentials: "include",
		headers: cookieHeader ? { cookie: cookieHeader } : undefined,
	});

	if (!response.ok) {
		throw await toApiError(response);
	}

	return readJsonResponse<T>(response, path);
}

export async function apiSendJson<TResponse, TBody extends JsonValue>(
	path: string,
	method: "POST" | "PUT" | "PATCH" | "DELETE",
	body?: TBody,
): Promise<TResponse> {
	const cookieHeader = await getServerCookieHeader();
	const response = await fetch(new URL(path, getApiOrigin()), {
		method,
		credentials: "include",
		headers: {
			...(body ? { "content-type": "application/json" } : {}),
			...(cookieHeader ? { cookie: cookieHeader } : {}),
		},
		body: body ? JSON.stringify(body) : undefined,
	});

	if (!response.ok) {
		throw await toApiError(response);
	}

	return readJsonResponse<TResponse>(response, path);
}

async function toApiError(response: Response) {
	let payload: ApiErrorPayload | null = null;

	try {
		payload = (await response.json()) as ApiErrorPayload;
	} catch {
		payload = null;
	}

	return new ApiError(payload?.message ?? payload?.error ?? response.statusText, {
		path: response.url,
		status: response.status,
		statusText: response.statusText,
		payload,
	});
}

async function readJsonResponse<T>(
	response: Response,
	path: string,
): Promise<T> {
	const contentType = response.headers.get("content-type") ?? "";
	if (!contentType.includes("application/json")) {
		const body = await response.text();
		throw new Error(
			`Expected JSON from ${path}, but received ${contentType || "an unknown content type"}${body ? `: ${body.slice(0, 120)}` : ""}`,
		);
	}

	return response.json() as Promise<T>;
}
