const assert = require("assert").strict;
const {
    clearAuthCookie,
    getAuthCookie,
    getAuthCookieOptions,
    setAuthCookie,
} = require("../src/security/authCookie");

describe("authentication cookie", () => {
    const originalProtocol = process.env.SERVER_PROTOCOL;
    const originalSecure = process.env.AUTH_COOKIE_SECURE;
    const originalSameSite = process.env.AUTH_COOKIE_SAME_SITE;

    afterEach(() => {
        if (originalProtocol === undefined) delete process.env.SERVER_PROTOCOL;
        else process.env.SERVER_PROTOCOL = originalProtocol;
        if (originalSecure === undefined) delete process.env.AUTH_COOKIE_SECURE;
        else process.env.AUTH_COOKIE_SECURE = originalSecure;
        if (originalSameSite === undefined) delete process.env.AUTH_COOKIE_SAME_SITE;
        else process.env.AUTH_COOKIE_SAME_SITE = originalSameSite;
    });

    it("uses an HttpOnly, same-site cookie by default", () => {
        process.env.SERVER_PROTOCOL = "http";
        delete process.env.AUTH_COOKIE_SECURE;
        delete process.env.AUTH_COOKIE_SAME_SITE;
        assert.deepEqual(getAuthCookieOptions(), {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
        });
    });

    it("supports secure cross-site cookies only over HTTPS", () => {
        process.env.AUTH_COOKIE_SECURE = "true";
        process.env.AUTH_COOKIE_SAME_SITE = "none";
        const options = getAuthCookieOptions();
        assert.equal(options.httpOnly, true);
        assert.equal(options.secure, true);
        assert.equal(options.sameSite, "none");

        process.env.AUTH_COOKIE_SECURE = "false";
        assert.throws(() => getAuthCookieOptions(), /REQUIRES_SECURE/);
    });

    it("sets, reads and clears the authentication cookie", () => {
        process.env.AUTH_COOKIE_SECURE = "false";
        const calls = [];
        const response = {
            cookie: (...args) => calls.push(["set", ...args]),
            clearCookie: (...args) => calls.push(["clear", ...args]),
        };

        setAuthCookie(response, "header.payload.signature");
        clearAuthCookie(response);

        assert.equal(calls[0][1], "token");
        assert.equal(calls[0][2], "header.payload.signature");
        assert.equal(calls[0][3].httpOnly, true);
        assert.equal(calls[1][1], "token");
        assert.equal(getAuthCookie("theme=dark; token=header.payload.signature"), "header.payload.signature");
    });
});
