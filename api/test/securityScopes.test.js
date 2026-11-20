const assert = require("assert").strict;
const { expressAuthentication, getToken } = require("../src/security");
const { AuthServerModel } = require("../src/SSO/oauth/AuthServerModel");
const { TokensService } = require("../src/routes/tokens/tokenService");
const { SCOPES } = require("../src/constant");

function createRequest(token) {
    return {
        headers: { authorization: `Bearer ${token}` },
        body: {},
        query: {},
    };
}

describe("expressAuthentication scope checks", () => {
    let originalGetAccessToken;
    let originalVerifyScope;
    let originalCheckIfItsPlatformToken;

    before(() => {
        originalGetAccessToken = AuthServerModel.instance.getAccessToken;
        originalVerifyScope = AuthServerModel.instance.verifyScope;
        originalCheckIfItsPlatformToken = TokensService.getInstance().checkIfItsPlatformToken;
    });

    describe("getToken cookie authentication", () => {
        const originalCorsOrigins = process.env.CORS_ORIGINS;

        after(() => {
            if (originalCorsOrigins === undefined) delete process.env.CORS_ORIGINS;
            else process.env.CORS_ORIGINS = originalCorsOrigins;
        });

        it("reads the HttpOnly token cookie for a configured client origin", () => {
            process.env.CORS_ORIGINS = "https://client.example.com";

            assert.equal(
                getToken({
                    headers: {
                        origin: "https://client.example.com",
                        cookie: "theme=dark; token=jwt-token",
                    },
                    body: {},
                    query: {},
                }),
                "jwt-token"
            );
        });

        it("does not use a token cookie for an unconfigured origin", () => {
            process.env.CORS_ORIGINS = "https://client.example.com";

            assert.equal(
                getToken({
                    headers: {
                        origin: "https://untrusted.example.com",
                        cookie: "token=jwt-token",
                    },
                    body: {},
                    query: {},
                }),
                undefined
            );
        });
    });

    afterEach(() => {
        AuthServerModel.instance.getAccessToken = originalGetAccessToken;
        AuthServerModel.instance.verifyScope = originalVerifyScope;
        TokensService.getInstance().checkIfItsPlatformToken = originalCheckIfItsPlatformToken;
    });

    it("allows superAdmin regardless of required scope", async () => {
        const tokenInfo = {
            accessToken: "admin-token",
            accessTokenExpiresAt: new Date(Date.now() + 60_000),
            scope: [SCOPES.authAdmin],
            client: {},
            user: {},
        };

        AuthServerModel.instance.getAccessToken = async () => tokenInfo;
        TokensService.getInstance().checkIfItsPlatformToken = async () => null;

        const result = await expressAuthentication(createRequest("admin-token"), "jwt", [SCOPES.usersDelete]);
        assert.equal(result, tokenInfo);
    });

    it("allows normal user when one required scope is granted", async () => {
        const tokenInfo = {
            accessToken: "user-token",
            accessTokenExpiresAt: new Date(Date.now() + 60_000),
            scope: [SCOPES.selfRead],
            client: {},
            user: {},
        };

        AuthServerModel.instance.getAccessToken = async () => tokenInfo;
        TokensService.getInstance().checkIfItsPlatformToken = async () => null;

        const result = await expressAuthentication(createRequest("user-token"), "jwt", [SCOPES.selfRead, SCOPES.usersRead]);
        assert.equal(result, tokenInfo);
    });

    it("rejects normal user when required scope is missing", async () => {
        const tokenInfo = {
            accessToken: "user-token",
            accessTokenExpiresAt: new Date(Date.now() + 60_000),
            scope: [SCOPES.selfRead],
            client: {},
            user: {},
        };

        AuthServerModel.instance.getAccessToken = async () => tokenInfo;
        AuthServerModel.instance.verifyScope = async () => false;
        TokensService.getInstance().checkIfItsPlatformToken = async () => null;

        await assert.rejects(
            () => expressAuthentication(createRequest("user-token"), "jwt", [SCOPES.usersDelete]),
            (error) => {
                assert.equal(error.code, 401);
                assert.match(error.message, /Insufficient scope/i);
                return true;
            },
        );
    });

    it("allows application token with space-delimited scope string", async () => {
        const tokenInfo = {
            accessToken: "app-token",
            accessTokenExpiresAt: new Date(Date.now() + 60_000),
            scope: `${SCOPES.applicationsRead} ${SCOPES.tokensRead}`,
            client: { id: "app-1" },
            user: { id: "app-1" },
        };

        AuthServerModel.instance.getAccessToken = async () => tokenInfo;
        TokensService.getInstance().checkIfItsPlatformToken = async () => null;

        const result = await expressAuthentication(createRequest("app-token"), "jwt", [SCOPES.tokensRead]);
        assert.equal(result, tokenInfo);
    });

    it("rejects expired token even when scope is valid", async () => {
        const tokenInfo = {
            accessToken: "expired-user-token",
            accessTokenExpiresAt: new Date(Date.now() - 1_000),
            scope: [SCOPES.selfRead],
            client: {},
            user: {},
        };

        AuthServerModel.instance.getAccessToken = async () => tokenInfo;
        TokensService.getInstance().checkIfItsPlatformToken = async () => null;

        await assert.rejects(
            () => expressAuthentication(createRequest("expired-user-token"), "jwt", [SCOPES.selfRead]),
            (error) => {
                assert.equal(error.code, 401);
                assert.match(error.message, /expired/i);
                return true;
            },
        );
    });
});
