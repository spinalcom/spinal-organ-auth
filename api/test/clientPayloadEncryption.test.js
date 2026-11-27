const assert = require("assert").strict;
const { createDecipheriv, createHash } = require("crypto");
const { encryptClientPayload, sendResponseToClientUrl } = require("../src/utilities/formatResponseHtml");

function decodeBase64Url(value) {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    return Buffer.from(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="), "base64");
}

function decrypt(payload, clientId) {
    const [version, iv, tag, ciphertext] = payload.split(".");
    assert.equal(version, "v1");
    const key = createHash("sha256").update(clientId, "utf8").digest();
    const decipher = createDecipheriv("aes-256-gcm", key, decodeBase64Url(iv));
    decipher.setAuthTag(decodeBase64Url(tag));
    return JSON.parse(Buffer.concat([decipher.update(decodeBase64Url(ciphertext)), decipher.final()]).toString("utf8"));
}

describe("client callback payload encryption", () => {
    it("encrypts an authenticated payload with a key derived from clientId", () => {
        const encrypted = encryptClientPayload({ token: "secret-token" }, "project-client-id");
        assert.deepEqual(decrypt(encrypted, "project-client-id"), { token: "secret-token" });
        assert.throws(() => decrypt(encrypted, "another-client-id"));
        assert.doesNotMatch(encrypted, /secret-token/);
    });

    it("uses a fresh nonce for every encryption", () => {
        const first = encryptClientPayload({ token: "same-token" }, "project-client-id");
        const second = encryptClientPayload({ token: "same-token" }, "project-client-id");
        assert.notEqual(first, second);
    });

    it("posts the encrypted copy including vueClientUrl to the platform callback", () => {
        let html;
        const response = { send: (value) => { html = value; return response; } };
        const platform = {
            redirectUrl: "https://api.example.com/callback",
            vueClientUrl: "https://wall.example.com",
            clientId: "project-client-id",
        };

        assert.equal(sendResponseToClientUrl(response, platform, "https://api.example.com", { token: "secret-token" }), response);
        const encrypted = html.match(/name="data" value='([^']+)'/)[1];
        assert.deepEqual(decrypt(encrypted, platform.clientId), {
            token: "secret-token",
            vueClientUrl: "https://wall.example.com",
        });
    });

    it("rejects an empty clientId", () => {
        assert.throws(() => encryptClientPayload({ token: "secret-token" }, ""), /INVALID_CLIENT_ID/);
    });
});
