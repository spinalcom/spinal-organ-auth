const assert = require("assert").strict;
const {
    getLoginSecurityConfig,
    normalizeLoginAttemptState,
    registerFailedLogin,
} = require("../src/routes/authUser/loginAttemptPolicy");

describe("login attempt policy", () => {
    const now = 1_700_000_000_000;
    const config = { maxAttempts: 3, lockDurationMs: 60_000 };

    it("uses safe defaults for missing or invalid configuration", () => {
        assert.deepEqual(getLoginSecurityConfig({}), {
            maxAttempts: 5,
            lockDurationMs: 15 * 60_000,
        });
        assert.deepEqual(getLoginSecurityConfig({ MAX_LOGIN_ATTEMPTS: "0", ACCOUNT_LOCK_DURATION_MINUTES: "invalid" }), {
            maxAttempts: 5,
            lockDurationMs: 15 * 60_000,
        });
    });

    it("reads configuration from the environment", () => {
        assert.deepEqual(getLoginSecurityConfig({ MAX_LOGIN_ATTEMPTS: "4", ACCOUNT_LOCK_DURATION_MINUTES: "30" }), {
            maxAttempts: 4,
            lockDurationMs: 30 * 60_000,
        });
    });

    it("increments failures before the threshold", () => {
        assert.deepEqual(registerFailedLogin({ failedLoginAttempts: 1, lockedUntil: 0 }, config, now), {
            failedLoginAttempts: 2,
            lockedUntil: 0,
        });
    });

    it("locks the account when the threshold is reached", () => {
        assert.deepEqual(registerFailedLogin({ failedLoginAttempts: 2, lockedUntil: 0 }, config, now), {
            failedLoginAttempts: 3,
            lockedUntil: now + 60_000,
        });
    });

    it("does not extend an active lock", () => {
        const lockedState = { failedLoginAttempts: 3, lockedUntil: now + 30_000 };
        assert.deepEqual(registerFailedLogin(lockedState, config, now), lockedState);
    });

    it("resets an expired lock", () => {
        assert.deepEqual(normalizeLoginAttemptState({ failedLoginAttempts: 3, lockedUntil: now - 1 }, now), {
            failedLoginAttempts: 0,
            lockedUntil: 0,
        });
    });
});
