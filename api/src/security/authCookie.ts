import * as express from "express";

export const AUTH_COOKIE_NAME = "token";

type SupportedSameSite = "lax" | "strict" | "none";

function getBoolean(value: string | undefined, fallback: boolean): boolean {
	if (!value) return fallback;
	return value.toLowerCase() === "true";
}

function getSameSite(value: string | undefined): SupportedSameSite {
	const normalizedValue = value?.toLowerCase();
	if (normalizedValue === "strict" || normalizedValue === "none") return normalizedValue;
	return "lax";
}

export function getAuthCookieOptions(expirationInSeconds?: number): express.CookieOptions {
	const secure = getBoolean(process.env.AUTH_COOKIE_SECURE, process.env.SERVER_PROTOCOL === "https");
	const sameSite = getSameSite(process.env.AUTH_COOKIE_SAME_SITE);

	if (sameSite === "none" && !secure) {
		throw new Error("AUTH_COOKIE_SAME_SITE_NONE_REQUIRES_SECURE");
	}

	const expirationInMilliseconds = expirationInSeconds && expirationInSeconds > 10_000_000_000 ? expirationInSeconds : expirationInSeconds && expirationInSeconds * 1000;
	const maxAge = expirationInMilliseconds ? Math.max(0, expirationInMilliseconds - Date.now()) : undefined;
	return {
		httpOnly: true,
		secure,
		sameSite,
		path: "/",
		...(maxAge !== undefined && { maxAge }),
	};
}

export function setAuthCookie(response: express.Response, token: string, expirationInSeconds?: number): void {
	response.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions(expirationInSeconds));
}

export function clearAuthCookie(response: express.Response): void {
	const { maxAge, ...options } = getAuthCookieOptions();
	response.clearCookie(AUTH_COOKIE_NAME, options);
}

export function getAuthCookie(cookieHeader?: string): string | undefined {
	if (!cookieHeader) return undefined;
	const cookie = cookieHeader.split(";").find((entry) => entry.trim().startsWith(`${AUTH_COOKIE_NAME}=`));
	if (!cookie) return undefined;
	return decodeURIComponent(cookie.slice(cookie.indexOf("=") + 1).trim());
}
