import { HttpStatusCode } from "../../utilities/http-status-code";
import { OperationError } from "../../utilities/operation-error";
import { IPlatformList, IUserCreationParams, IUserType, IUserUpdateParams } from "./user.model";

const USERNAME_MAX_LENGTH = 128;
const EMAIL_MAX_LENGTH = 254;
const INFO_MAX_LENGTH = 2000;
const PLATFORM_LIST_MAX_LENGTH = 100;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+()\-.\s]{6,32}$/;
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;
const USER_TYPES = new Set<IUserType>([IUserType["Super User"], IUserType["Simple User"]]);

function invalid(message: string): never {
	throw new OperationError(message, HttpStatusCode.BAD_REQUEST);
}

function normalizeUserName(value: unknown): string {
	if (typeof value !== "string") invalid("INVALID_USERNAME");
	const normalized = value.trim();
	if (!normalized || normalized.length > USERNAME_MAX_LENGTH || CONTROL_CHARACTERS.test(normalized)) invalid("INVALID_USERNAME");
	if (normalized === "authAdmin") invalid("RESERVED_USERNAME");
	return normalized;
}

function normalizeOptionalEmail(value: unknown): string | undefined {
	if (value === undefined) return undefined;
	if (typeof value !== "string") invalid("INVALID_EMAIL");
	const normalized = value.trim();
	if (normalized && (normalized.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(normalized))) invalid("INVALID_EMAIL");
	return normalized;
}

function normalizeOptionalPhone(value: unknown): string | undefined {
	if (value === undefined) return undefined;
	if (typeof value !== "string") invalid("INVALID_TELEPHONE");
	const normalized = value.trim();
	if (normalized && !PHONE_PATTERN.test(normalized)) invalid("INVALID_TELEPHONE");
	return normalized;
}

function normalizeOptionalInfo(value: unknown): string | undefined {
	if (value === undefined) return undefined;
	if (typeof value !== "string" || value.length > INFO_MAX_LENGTH || CONTROL_CHARACTERS.test(value)) invalid("INVALID_INFO");
	return value.trim();
}

function normalizeUserType(value: unknown, fallback?: IUserType): IUserType | undefined {
	if (value === undefined) return fallback;
	if (typeof value !== "string" || !USER_TYPES.has(value as IUserType)) invalid("INVALID_USER_TYPE");
	return value as IUserType;
}

function normalizePlatformList(value: unknown, profileIdKey: "userProfileId" | "userProfileAdminId"): IPlatformList[] | undefined {
	if (value === undefined) return undefined;
	if (!Array.isArray(value) || value.length > PLATFORM_LIST_MAX_LENGTH) invalid("INVALID_PLATFORM_LIST");

	const seen = new Set<string>();
	return value.map((entry) => {
		if (!entry || typeof entry !== "object") invalid("INVALID_PLATFORM_PROFILE");
		const platform = entry as IPlatformList;
		const platformId = typeof platform.platformId === "string" ? platform.platformId.trim() : "";
		const profileId = typeof platform.userProfile?.[profileIdKey] === "string" ? platform.userProfile[profileIdKey]!.trim() : "";
		if (!platformId || !profileId) invalid("INVALID_PLATFORM_PROFILE");

		const key = `${platformId}:${profileId}`;
		if (seen.has(key)) invalid("DUPLICATE_PLATFORM_PROFILE");
		seen.add(key);

		return {
			...platform,
			platformId,
			userProfile: { ...platform.userProfile, [profileIdKey]: profileId },
		};
	});
}

function rejectUnknownFields(value: Record<string, unknown>, allowedFields: Set<string>): void {
	const unknownField = Object.keys(value).find((key) => !allowedFields.has(key));
	if (unknownField) invalid(`UNKNOWN_USER_FIELD:${unknownField}`);
}

export function validateUserCreationPayload(value: IUserCreationParams): IUserCreationParams {
	if (!value || typeof value !== "object" || Array.isArray(value)) invalid("INVALID_USER_PAYLOAD");
	rejectUnknownFields(value as any, new Set(["userName", "password", "email", "telephone", "info", "mustChangePassword", "userType", "platformList"]));
	if (typeof value.password !== "string") invalid("PASSWORD_INVALID_FORMAT");
	if (value.mustChangePassword !== undefined && typeof value.mustChangePassword !== "boolean") invalid("INVALID_MUST_CHANGE_PASSWORD");

	return {
		userName: normalizeUserName(value.userName),
		password: value.password,
		email: normalizeOptionalEmail(value.email),
		telephone: normalizeOptionalPhone(value.telephone),
		info: normalizeOptionalInfo(value.info),
		mustChangePassword: value.mustChangePassword ?? true,
		userType: normalizeUserType(value.userType, IUserType["Simple User"]),
		platformList: normalizePlatformList(value.platformList, "userProfileId") || [],
	};
}

export function validateUserUpdatePayload(value: IUserUpdateParams): IUserUpdateParams {
	if (!value || typeof value !== "object" || Array.isArray(value)) invalid("INVALID_USER_PAYLOAD");
	rejectUnknownFields(value as any, new Set(["userName", "email", "telephone", "info", "mustChangePassword", "userType", "platformList"]));
	if (Object.keys(value).length === 0) invalid("EMPTY_USER_UPDATE");
	if (value.mustChangePassword !== undefined && typeof value.mustChangePassword !== "boolean") invalid("INVALID_MUST_CHANGE_PASSWORD");

	return {
		...(value.userName !== undefined && { userName: normalizeUserName(value.userName) }),
		...(value.email !== undefined && { email: normalizeOptionalEmail(value.email) }),
		...(value.telephone !== undefined && { telephone: normalizeOptionalPhone(value.telephone) }),
		...(value.info !== undefined && { info: normalizeOptionalInfo(value.info) }),
		...(value.mustChangePassword !== undefined && { mustChangePassword: value.mustChangePassword }),
		...(value.userType !== undefined && { userType: normalizeUserType(value.userType) }),
		...(value.platformList !== undefined && { platformList: normalizePlatformList(value.platformList, "userProfileAdminId") }),
	};
}
