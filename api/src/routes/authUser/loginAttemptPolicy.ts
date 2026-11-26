export const DEFAULT_MAX_LOGIN_ATTEMPTS = 5;
export const DEFAULT_ACCOUNT_LOCK_DURATION_MINUTES = 15;

export type LoginAttemptState = {
	failedLoginAttempts: number;
	lockedUntil: number;
};

export type LoginSecurityConfig = {
	maxAttempts: number;
	lockDurationMs: number;
};

function getPositiveInteger(value: string | undefined, fallback: number): number {
	const parsedValue = Number.parseInt(value || "", 10);
	return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
}

export function getLoginSecurityConfig(environment: NodeJS.ProcessEnv = process.env): LoginSecurityConfig {
	const maxAttempts = getPositiveInteger(environment.MAX_LOGIN_ATTEMPTS, DEFAULT_MAX_LOGIN_ATTEMPTS);
	const lockDurationMinutes = getPositiveInteger(environment.ACCOUNT_LOCK_DURATION_MINUTES, DEFAULT_ACCOUNT_LOCK_DURATION_MINUTES);

	return { maxAttempts, lockDurationMs: lockDurationMinutes * 60 * 1000 };
}

export function normalizeLoginAttemptState(state: Partial<LoginAttemptState>, now: number = Date.now()): LoginAttemptState {
	const failedLoginAttempts = Number.isFinite(state.failedLoginAttempts) ? Math.max(0, Number(state.failedLoginAttempts)) : 0;
	const lockedUntil = Number.isFinite(state.lockedUntil) ? Math.max(0, Number(state.lockedUntil)) : 0;

	if (lockedUntil > 0 && lockedUntil <= now) return { failedLoginAttempts: 0, lockedUntil: 0 };
	return { failedLoginAttempts, lockedUntil };
}

export function registerFailedLogin(state: Partial<LoginAttemptState>, config: LoginSecurityConfig, now: number = Date.now()): LoginAttemptState {
	const normalizedState = normalizeLoginAttemptState(state, now);
	if (normalizedState.lockedUntil > now) return normalizedState;

	const failedLoginAttempts = normalizedState.failedLoginAttempts + 1;
	if (failedLoginAttempts >= config.maxAttempts) {
		return { failedLoginAttempts, lockedUntil: now + config.lockDurationMs };
	}

	return { failedLoginAttempts, lockedUntil: 0 };
}
