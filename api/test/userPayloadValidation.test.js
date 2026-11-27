const assert = require("assert").strict;
const { validateUserCreationPayload, validateUserUpdatePayload } = require("../src/routes/authUser/userPayloadValidation");
const { UserService } = require("../src/routes/authUser/userService");

describe("user creation and update payload validation", () => {
    const validCreation = {
        userName: " alice ",
        password: "Correct#Password1",
        email: " alice@example.com ",
        telephone: " +33 1 23 45 67 89 ",
        userType: "Simple User",
        platformList: [{ platformId: "platform-id", userProfile: { userProfileId: "profile-id" } }],
    };

    it("normalizes a valid creation payload and applies secure defaults", () => {
        const result = validateUserCreationPayload(validCreation);
        assert.equal(result.userName, "alice");
        assert.equal(result.email, "alice@example.com");
        assert.equal(result.telephone, "+33 1 23 45 67 89");
        assert.equal(result.mustChangePassword, true);
        assert.equal(result.userType, "Simple User");
    });

    for (const [name, patch, error] of [
        ["empty username", { userName: "  " }, "INVALID_USERNAME"],
        ["reserved username", { userName: "authAdmin" }, "RESERVED_USERNAME"],
        ["invalid email", { email: "not-an-email" }, "INVALID_EMAIL"],
        ["invalid telephone", { telephone: "call-me" }, "INVALID_TELEPHONE"],
        ["invalid role", { userType: "authAdmin" }, "INVALID_USER_TYPE"],
        ["missing profile", { platformList: [{ platformId: "platform-id", userProfile: {} }] }, "INVALID_PLATFORM_PROFILE"],
        ["unknown field", { administrator: true }, "UNKNOWN_USER_FIELD"],
    ]) {
        it(`rejects ${name} on creation`, () => {
            assert.throws(() => validateUserCreationPayload({ ...validCreation, ...patch }), new RegExp(error));
        });
    }

    it("accepts explicit clearing of optional update fields", () => {
        assert.deepEqual(validateUserUpdatePayload({ email: "", telephone: "", info: "" }), { email: "", telephone: "", info: "" });
    });

    it("requires an update to contain at least one supported field", () => {
        assert.throws(() => validateUserUpdatePayload({}), /EMPTY_USER_UPDATE/);
        assert.throws(() => validateUserUpdatePayload({ password: "Ignored#Password1" }), /UNKNOWN_USER_FIELD:password/);
    });

    it("requires the Auth profile id format on update", () => {
        assert.throws(
            () => validateUserUpdatePayload({ platformList: [{ platformId: "platform-id", userProfile: { userProfileId: "bos-id" } }] }),
            /INVALID_PLATFORM_PROFILE/,
        );
        const result = validateUserUpdatePayload({ platformList: [{ platformId: "platform-id", userProfile: { userProfileAdminId: "auth-profile-id" } }] });
        assert.equal(result.platformList[0].userProfile.userProfileAdminId, "auth-profile-id");
    });

    it("finds existing users by the stored userName attribute", async () => {
        const service = UserService.getInstance();
        const originalGetContext = service.getUserListContext;
        const alice = {
            getId: () => ({ get: () => "alice-id" }),
            info: { userName: { get: () => "alice" } },
        };
        service.getUserListContext = async () => ({ getChildren: async () => [alice] });
        try {
            assert.deepEqual(await service.getUserNodes("alice"), [alice]);
        } finally {
            service.getUserListContext = originalGetContext;
        }
    });
});
