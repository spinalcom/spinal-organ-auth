const assert = require("assert").strict;
const { getPasswordPolicyError, PASSWORD_POLICY } = require("../src/routes/authUser/passwordPolicy");

describe("password policy", () => {
    it("accepts a password satisfying every rule", () => {
        assert.equal(getPasswordPolicyError("Robuste#2026!", "alice"), null);
    });

    const invalidPasswords = [
        ["Court#1Aa", undefined, "PASSWORD_TOO_SHORT"],
        ["SANS-MINUSCULE1!", undefined, "PASSWORD_LOWERCASE_REQUIRED"],
        ["sans-majuscule1!", undefined, "PASSWORD_UPPERCASE_REQUIRED"],
        ["SansAucunChiffre!", undefined, "PASSWORD_NUMBER_REQUIRED"],
        ["SansCaractere1", undefined, "PASSWORD_SPECIAL_CHARACTER_REQUIRED"],
        ["Avec espace1!A", undefined, "PASSWORD_WHITESPACE_FORBIDDEN"],
        ["Alice#2026!Aa", "alice", "PASSWORD_CONTAINS_USERNAME"],
        ["A".repeat(PASSWORD_POLICY.maxBytes) + "a1!", undefined, "PASSWORD_TOO_LONG"],
        [undefined, undefined, "PASSWORD_INVALID_FORMAT"],
    ];

    for (const [password, userName, expectedError] of invalidPasswords) {
        it(`rejects passwords with ${expectedError}`, () => {
            assert.equal(getPasswordPolicyError(password, userName), expectedError);
        });
    }

    it("applies bcrypt's byte limit to multibyte characters", () => {
        assert.equal(getPasswordPolicyError("Aa1!" + "é".repeat(35)), "PASSWORD_TOO_LONG");
    });
});
