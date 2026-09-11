const assert = require("assert").strict;
const { expressAuthentication } = require("../src/security");
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
