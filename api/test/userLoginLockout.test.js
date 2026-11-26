const assert = require("assert").strict;
const bcrypt = require("bcrypt");
const { UserService } = require("../src/routes/authUser/userService");

function scalar(value) {
    return {
        get: () => value,
        set: (nextValue) => {
            value = nextValue;
        },
    };
}

function createUser(passwordHash) {
    const info = {
        password: scalar(passwordHash),
        failedLoginAttempts: scalar(0),
        lockedUntil: scalar(0),
    };
    info.add_attr = (key, value) => {
        info[key] = scalar(value);
    };
    return { info };
}

describe("UserService login lockout", () => {
    const service = UserService.getInstance();
    let originalFindUser;
    let originalMaxAttempts;
    let originalLockDuration;
    let user;

    before(async () => {
        originalFindUser = service._findUserByUserName;
        originalMaxAttempts = process.env.MAX_LOGIN_ATTEMPTS;
        originalLockDuration = process.env.ACCOUNT_LOCK_DURATION_MINUTES;
        process.env.MAX_LOGIN_ATTEMPTS = "3";
        process.env.ACCOUNT_LOCK_DURATION_MINUTES = "1";
        user = createUser(await bcrypt.hash("Correct#Password1", 4));
        service._findUserByUserName = async () => user;
    });

    after(() => {
        service._findUserByUserName = originalFindUser;
        if (originalMaxAttempts === undefined) delete process.env.MAX_LOGIN_ATTEMPTS;
        else process.env.MAX_LOGIN_ATTEMPTS = originalMaxAttempts;
        if (originalLockDuration === undefined) delete process.env.ACCOUNT_LOCK_DURATION_MINUTES;
        else process.env.ACCOUNT_LOCK_DURATION_MINUTES = originalLockDuration;
    });

    it("does not count credential checks that are not login attempts", async () => {
        assert.equal(await service.getUserByCredentials("alice", "wrong"), null);
        assert.equal(user.info.failedLoginAttempts.get(), 0);
    });

    it("locks after the configured number of failed logins", async () => {
        for (let attempt = 0; attempt < 3; attempt += 1) {
            assert.equal(await service.getUserByCredentials("alice", "wrong", false, true, true), null);
        }

        assert.equal(user.info.failedLoginAttempts.get(), 3);
        assert.ok(user.info.lockedUntil.get() > Date.now());
    });

    it("reports an active lock only when the submitted password is valid", async () => {
        assert.equal(await service.getUserByCredentials("alice", "wrong", false, true, true), null);
        await assert.rejects(
            () => service.getUserByCredentials("alice", "Correct#Password1", false, true, true),
            (error) => error.message === "ACCOUNT_LOCKED" && error.status === 423,
        );
    });

    it("allows login and resets counters after the lock expires", async () => {
        user.info.lockedUntil.set(Date.now() - 1);
        assert.equal(await service.getUserByCredentials("alice", "Correct#Password1", false, true, true), user);
        assert.equal(user.info.failedLoginAttempts.get(), 0);
        assert.equal(user.info.lockedUntil.get(), 0);
    });
});
