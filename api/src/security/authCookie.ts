import * as express from "express";

const COOKIE_NAME_PATTERN = /^[A-Za-z0-9_-]+$/;

export const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME?.trim() || "auth_token";

if (!COOKIE_NAME_PATTERN.test(AUTH_COOKIE_NAME)) {
	throw new Error("INVALID_AUTH_COOKIE_NAME");
}

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
		...(process.env.AUTH_COOKIE_DOMAIN ? { domain: process.env.AUTH_COOKIE_DOMAIN } : {}),
		...(maxAge !== undefined && { maxAge }),
	};
}

export function setAuthCookie(response: express.Response, token: string, expirationInSeconds?: number, cookieName = AUTH_COOKIE_NAME): void {
	response.cookie(cookieName, token, getAuthCookieOptions(expirationInSeconds));
}

export function clearAuthCookie(response: express.Response, cookieName = AUTH_COOKIE_NAME): void {
	const { maxAge, ...options } = getAuthCookieOptions();
	response.clearCookie(cookieName, options);
}

export function getAuthCookie(cookieHeader?: string, cookieName = AUTH_COOKIE_NAME): string | undefined {
	if (!cookieHeader) return undefined;
	const cookie = cookieHeader.split(";").find((entry) => entry.trim().startsWith(`${cookieName}=`));
	if (!cookie) return undefined;
	return decodeURIComponent(cookie.slice(cookie.indexOf("=") + 1).trim());
}
