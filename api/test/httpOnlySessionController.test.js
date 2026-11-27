const assert = require("assert").strict;
const { UsersController } = require("../src/routes/authUser/userController");
const { UserService } = require("../src/routes/authUser/userService");
const { TokensController } = require("../src/routes/tokens/tokenController");
const { TokensService } = require("../src/routes/tokens/tokenService");
const { AUTH_COOKIE_NAME } = require("../src/security/authCookie");

describe("HttpOnly session controllers", () => {
    const userService = UserService.getInstance();
    const tokenService = TokensService.getInstance();
    let originalLoginAuthAdmin;
    let originalLogin;
    let originalCheckPlatformToken;
    let originalRemoveToken;
    let originalCookieSecure;

    before(() => {
        originalLoginAuthAdmin = userService.loginAuthAdmin;
        originalLogin = userService.login;
        originalCheckPlatformToken = tokenService.checkIfItsPlatformToken;
        originalRemoveToken = tokenService.removeToken;
        originalCookieSecure = process.env.AUTH_COOKIE_SECURE;
        process.env.AUTH_COOKIE_SECURE = "false";
    });

    after(() => {
        userService.loginAuthAdmin = originalLoginAuthAdmin;
        userService.login = originalLogin;
        tokenService.checkIfItsPlatformToken = originalCheckPlatformToken;
        tokenService.removeToken = originalRemoveToken;
        if (originalCookieSecure === undefined) delete process.env.AUTH_COOKIE_SECURE;
        else process.env.AUTH_COOKIE_SECURE = originalCookieSecure;
    });

    it("sets an HttpOnly cookie without exposing the token in the login response", async () => {
        userService.loginAuthAdmin = async () => ({
            name: "token_authAdmin",
            token: "secret-jwt",
            expieredToken: Math.floor(Date.now() / 1000) + 3600,
            userId: "admin-id",
            userType: "authAdmin",
        });
        const cookieCalls = [];
        const request = {
            res: { cookie: (...args) => cookieCalls.push(args) },
        };

        const result = await new UsersController().loginAuthAdmin(
            { userName: "authAdmin", password: "Correct#Password1" },
            request,
        );

        assert.equal(result.token, undefined);
        assert.equal(result.userId, "admin-id");
        assert.equal(cookieCalls[0][0], AUTH_COOKIE_NAME);
        assert.equal(cookieCalls[0][1], "secret-jwt");
        assert.equal(cookieCalls[0][2].httpOnly, true);
    });

    it("returns the token only to an authenticated BOS platform", async () => {
        let selectedPlatformId;
        userService.login = async (_credentials, platformId) => {
            selectedPlatformId = platformId;
            return {
                name: "token_user",
                token: "user-secret-jwt",
                expieredToken: Math.floor(Date.now() / 1000) + 3600,
                userId: "user-id",
            };
        };
        tokenService.checkIfItsPlatformToken = async (token) => {
            assert.equal(token, "bos-platform-token");
            return { getId: () => ({ get: () => "platform-id" }) };
        };
        const cookieCalls = [];
        const request = {
            headers: { "x-access-token": "bos-platform-token" },
            res: { cookie: (...args) => cookieCalls.push(args) },
        };

        const result = await new UsersController().login(
            { userName: "alice", password: "Correct#Password1" },
            request,
        );

        assert.equal(selectedPlatformId, "platform-id");
        assert.equal(result.token, "user-secret-jwt");
        assert.deepEqual(cookieCalls, []);
    });

    it("revokes the cookie token and clears the cookie on logout", async () => {
        let revokedToken;
        tokenService.removeToken = async (token) => {
            revokedToken = token;
        };
        const clearCalls = [];
        const request = {
            headers: { cookie: `${AUTH_COOKIE_NAME}=secret-jwt` },
            res: { clearCookie: (...args) => clearCalls.push(args) },
        };

        const result = await new TokensController().logout(request);

        assert.equal(revokedToken, "secret-jwt");
        assert.deepEqual(result, { message: "Logged out" });
        assert.equal(clearCalls[0][0], AUTH_COOKIE_NAME);
        assert.equal(clearCalls[0][1].httpOnly, true);
    });
});
