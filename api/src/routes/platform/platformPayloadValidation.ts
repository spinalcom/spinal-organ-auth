import { HttpStatusCode } from "../../utilities/http-status-code";
import { OperationError } from "../../utilities/operation-error";
import { IPlatformCreateRequest, IPlatformUpdateParams } from "./platform.model";

const NAME_MAX_LENGTH = 128;
const CREDENTIAL_MAX_LENGTH = 512;
const URL_MAX_LENGTH = 2048;
const TEXT_MAX_LENGTH = 2000;
const LIST_MAX_LENGTH = 100;
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;
const GRANT_TYPES = new Set(["client_credentials", "password", "refresh_token", "authorization_code"]);
const CREATE_FIELDS = new Set(["name", "redirectUrl", "url", "vueClientUrl", "updateUrl", "address", "clientId", "clientSecret", "grant_types", "profileClassifyByPriority", "loginServerIds"]);
const UPDATE_FIELDS = new Set(["name", "redirectUrl", "updateUrl", "vueClientUrl", "url", "address", "loginServerIds", "grant_types"]);

function invalid(message: string): never {
	throw new OperationError(message, HttpStatusCode.BAD_REQUEST);
}

function rejectUnknownFields(value: Record<string, unknown>, allowedFields: Set<string>): void {
	const unknownField = Object.keys(value).find((key) => !allowedFields.has(key));
	if (unknownField) invalid(`UNKNOWN_PLATFORM_FIELD:${unknownField}`);
}

function normalizeRequiredText(value: unknown, error: string, minLength: number = 1, maxLength: number = TEXT_MAX_LENGTH): string {
	if (typeof value !== "string") invalid(error);
	const normalized = value.trim();
	if (normalized.length < minLength || normalized.length > maxLength || CONTROL_CHARACTERS.test(normalized)) invalid(error);
	return normalized;
}

function normalizeOptionalText(value: unknown, error: string): string | undefined {
	if (value === undefined) return undefined;
	if (typeof value !== "string") invalid(error);
	const normalized = value.trim();
	if (normalized.length > TEXT_MAX_LENGTH || CONTROL_CHARACTERS.test(normalized)) invalid(error);
	return normalized;
}

/** Mirrors the Vue forms: trim, add https:// when omitted, then remove trailing slashes. */
export function normalizePlatformUrl(value: unknown, fieldName: string): string {
	if (typeof value !== "string") invalid(`INVALID_PLATFORM_URL:${fieldName}`);
	let normalized = value.trim();
	if (!normalized || normalized.length > URL_MAX_LENGTH || CONTROL_CHARACTERS.test(normalized)) invalid(`INVALID_PLATFORM_URL:${fieldName}`);
	if (/^[a-z][a-z0-9+.-]*:/i.test(normalized) && !/^https?:\/\//i.test(normalized)) invalid(`INVALID_PLATFORM_URL:${fieldName}`);
	if (!/^https?:\/\//i.test(normalized)) normalized = `https://${normalized}`;

	try {
		const parsed = new URL(normalized);
		if ((parsed.protocol !== "http:" && parsed.protocol !== "https:") || !parsed.hostname || parsed.username || parsed.password) {
			invalid(`INVALID_PLATFORM_URL:${fieldName}`);
		}
		parsed.pathname = parsed.pathname.replace(/\/+$/, "");
		normalized = parsed.toString().replace(/\/(?=[?#]|$)/, "");
		return normalized;
	} catch (error) {
		if (error instanceof OperationError) throw error;
		invalid(`INVALID_PLATFORM_URL:${fieldName}`);
	}
}

function normalizeOptionalUrl(value: unknown, fieldName: string): string | undefined {
	if (value === undefined) return undefined;
	return normalizePlatformUrl(value, fieldName);
}

function normalizeStringList(value: unknown, error: string, allowed?: Set<string>): string[] {
	const input = typeof value === "string" ? [value] : value;
	if (!Array.isArray(input) || input.length === 0 || input.length > LIST_MAX_LENGTH) invalid(error);
	const result = input.map((entry) => normalizeRequiredText(entry, error, 1, CREDENTIAL_MAX_LENGTH));
	if (new Set(result).size !== result.length || (allowed && result.some((entry) => !allowed.has(entry)))) invalid(error);
	return result;
}

function normalizeOptionalStringList(value: unknown, error: string, allowEmpty: boolean = true): string[] | undefined {
	if (value === undefined) return undefined;
	if (!Array.isArray(value) || value.length > LIST_MAX_LENGTH || (!allowEmpty && value.length === 0)) invalid(error);
	const result = value.map((entry) => normalizeRequiredText(entry, error, 1, CREDENTIAL_MAX_LENGTH));
	if (new Set(result).size !== result.length) invalid(error);
	return result;
}

export function validatePlatformCreationPayload(value: IPlatformCreateRequest): IPlatformCreateRequest {
	if (!value || typeof value !== "object" || Array.isArray(value)) invalid("INVALID_PLATFORM_PAYLOAD");
	rejectUnknownFields(value as any, CREATE_FIELDS);

	return {
		name: normalizeRequiredText(value.name, "INVALID_PLATFORM_NAME", 3, NAME_MAX_LENGTH),
		url: normalizePlatformUrl(value.url, "url"),
		redirectUrl: normalizePlatformUrl(value.redirectUrl, "redirectUrl"),
		...(value.updateUrl !== undefined && { updateUrl: normalizeOptionalUrl(value.updateUrl, "updateUrl") }),
		...(value.vueClientUrl !== undefined && { vueClientUrl: normalizeOptionalUrl(value.vueClientUrl, "vueClientUrl") }),
		...(value.address !== undefined && { address: normalizeOptionalText(value.address, "INVALID_PLATFORM_ADDRESS") }),
		clientId: normalizeRequiredText(value.clientId, "INVALID_CLIENT_ID", 1, CREDENTIAL_MAX_LENGTH),
		clientSecret: normalizeRequiredText(value.clientSecret, "INVALID_CLIENT_SECRET", 1, CREDENTIAL_MAX_LENGTH),
		grant_types: normalizeStringList(value.grant_types, "INVALID_GRANT_TYPES", GRANT_TYPES),
		...(value.profileClassifyByPriority !== undefined && { profileClassifyByPriority: normalizeOptionalStringList(value.profileClassifyByPriority, "INVALID_PROFILE_PRIORITY") }),
		...(value.loginServerIds !== undefined && { loginServerIds: normalizeOptionalStringList(value.loginServerIds, "INVALID_LOGIN_SERVER_IDS") }),
	};
}

export function validatePlatformUpdatePayload(value: IPlatformUpdateParams): IPlatformUpdateParams {
	if (!value || typeof value !== "object" || Array.isArray(value)) invalid("INVALID_PLATFORM_PAYLOAD");
	rejectUnknownFields(value as any, UPDATE_FIELDS);
	if (Object.keys(value).length === 0) invalid("EMPTY_PLATFORM_UPDATE");

	return {
		...(value.name !== undefined && { name: normalizeRequiredText(value.name, "INVALID_PLATFORM_NAME", 3, NAME_MAX_LENGTH) }),
		...(value.url !== undefined && { url: normalizeOptionalUrl(value.url, "url") }),
		...(value.redirectUrl !== undefined && { redirectUrl: normalizeOptionalUrl(value.redirectUrl, "redirectUrl") }),
		...(value.updateUrl !== undefined && { updateUrl: normalizeOptionalUrl(value.updateUrl, "updateUrl") }),
		...(value.vueClientUrl !== undefined && { vueClientUrl: normalizeOptionalUrl(value.vueClientUrl, "vueClientUrl") }),
		...(value.address !== undefined && { address: normalizeOptionalText(value.address, "INVALID_PLATFORM_ADDRESS") }),
		...(value.loginServerIds !== undefined && { loginServerIds: normalizeOptionalStringList(value.loginServerIds, "INVALID_LOGIN_SERVER_IDS") }),
		...(value.grant_types !== undefined && { grant_types: normalizeStringList(value.grant_types, "INVALID_GRANT_TYPES", GRANT_TYPES) }),
	};
}
