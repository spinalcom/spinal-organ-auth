const assert = require("assert").strict;
const { normalizePlatformUrl, validatePlatformCreationPayload, validatePlatformUpdatePayload } = require("../src/routes/platform/platformPayloadValidation");

describe("platform creation and update payload validation", () => {
    const validCreation = {
        name: " My platform ",
        url: " api.example.com/// ",
        redirectUrl: "https://api.example.com/callback/",
        updateUrl: "https://api.example.com/api/v1/update_data///",
        vueClientUrl: "https://portal.example.com/",
        clientId: " client-id ",
        clientSecret: " client-secret ",
        grant_types: ["client_credentials", "refresh_token"],
        loginServerIds: ["server-id"],
    };

    it("normalizes creation values and removes trailing URL slashes", () => {
        const result = validatePlatformCreationPayload(validCreation);
        assert.equal(result.name, "My platform");
        assert.equal(result.url, "https://api.example.com");
        assert.equal(result.redirectUrl, "https://api.example.com/callback");
        assert.equal(result.updateUrl, "https://api.example.com/api/v1/update_data");
        assert.equal(result.vueClientUrl, "https://portal.example.com");
        assert.equal(result.clientId, "client-id");
    });

    it("normalizes root URLs even when they have a query or hash", () => {
        assert.equal(normalizePlatformUrl("example.com/?a=1", "url"), "https://example.com?a=1");
        assert.equal(normalizePlatformUrl("https://example.com/path/#section", "url"), "https://example.com/path#section");
    });

    for (const [name, patch, error] of [
        ["short name", { name: "ab" }, "INVALID_PLATFORM_NAME"],
        ["invalid URL protocol", { url: "ftp://example.com" }, "INVALID_PLATFORM_URL:url"],
        ["URL credentials", { url: "https://user:pass@example.com" }, "INVALID_PLATFORM_URL:url"],
        ["missing client secret", { clientSecret: undefined }, "INVALID_CLIENT_SECRET"],
        ["unknown grant", { grant_types: ["implicit"] }, "INVALID_GRANT_TYPES"],
        ["duplicate login server", { loginServerIds: ["one", "one"] }, "INVALID_LOGIN_SERVER_IDS"],
        ["unknown field", { administrator: true }, "UNKNOWN_PLATFORM_FIELD:administrator"],
    ]) {
        it(`rejects ${name} on creation`, () => {
            assert.throws(() => validatePlatformCreationPayload({ ...validCreation, ...patch }), new RegExp(error));
        });
    }

    it("normalizes URLs on update and accepts clearing optional text", () => {
        assert.deepEqual(validatePlatformUpdatePayload({ url: "https://api.example.com///", address: " " }), {
            url: "https://api.example.com",
            address: "",
        });
    });

    it("rejects empty, unknown and invalid updates", () => {
        assert.throws(() => validatePlatformUpdatePayload({}), /EMPTY_PLATFORM_UPDATE/);
        assert.throws(() => validatePlatformUpdatePayload({ clientId: "new-id" }), /UNKNOWN_PLATFORM_FIELD:clientId/);
        assert.throws(() => validatePlatformUpdatePayload({ vueClientUrl: "javascript:alert(1)" }), /INVALID_PLATFORM_URL:vueClientUrl/);
        assert.throws(() => validatePlatformUpdatePayload({ grant_types: [] }), /INVALID_GRANT_TYPES/);
    });

});
