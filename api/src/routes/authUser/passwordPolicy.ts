export const PASSWORD_POLICY = {
	minLength: 12,
	maxBytes: 72,
} as const;

export type PasswordPolicyError =
	| "PASSWORD_INVALID_FORMAT"
	| "PASSWORD_TOO_SHORT"
	| "PASSWORD_TOO_LONG"
	| "PASSWORD_WHITESPACE_FORBIDDEN"
	| "PASSWORD_LOWERCASE_REQUIRED"
	| "PASSWORD_UPPERCASE_REQUIRED"
	| "PASSWORD_NUMBER_REQUIRED"
	| "PASSWORD_SPECIAL_CHARACTER_REQUIRED"
	| "PASSWORD_CONTAINS_USERNAME";

/**
 * Returns the first password-policy violation, or null when the password is valid.
 * The byte limit prevents distinct passwords from becoming equivalent after
 * bcrypt's 72-byte input limit.
 */
export function getPasswordPolicyError(password: unknown, userName?: string): PasswordPolicyError | null {
	if (typeof password !== "string") return "PASSWORD_INVALID_FORMAT";
	if (password.length < PASSWORD_POLICY.minLength) return "PASSWORD_TOO_SHORT";
	if (Buffer.byteLength(password, "utf8") > PASSWORD_POLICY.maxBytes) return "PASSWORD_TOO_LONG";
	if (/\s/.test(password)) return "PASSWORD_WHITESPACE_FORBIDDEN";
	if (!/[a-z]/.test(password)) return "PASSWORD_LOWERCASE_REQUIRED";
	if (!/[A-Z]/.test(password)) return "PASSWORD_UPPERCASE_REQUIRED";
	if (!/[0-9]/.test(password)) return "PASSWORD_NUMBER_REQUIRED";
	if (!/[^A-Za-z0-9\s]/.test(password)) return "PASSWORD_SPECIAL_CHARACTER_REQUIRED";

	const normalizedUserName = userName?.trim().toLocaleLowerCase();
	if (normalizedUserName && normalizedUserName.length >= 3 && password.toLocaleLowerCase().includes(normalizedUserName)) {
		return "PASSWORD_CONTAINS_USERNAME";
	}

	return null;
}
