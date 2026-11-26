const assert = require("assert").strict;
const { buildLocalLoginFailureUrl } = require("../src/loginRoute");

describe("local login failure redirect", () => {
    it("preserves and safely encodes the username", () => {
        assert.equal(
            buildLocalLoginFailureUrl("platform/id", "alice+test@example.com"),
            "/login/platform%2Fid?error=true&userName=alice%2Btest%40example.com",
        );
    });

    it("adds the account lock indicator without accepting non-string credentials", () => {
        assert.equal(
            buildLocalLoginFailureUrl("platform", { password: "must-not-leak" }, true),
            "/login/platform?error=true&account_locked=true",
        );
    });
});
