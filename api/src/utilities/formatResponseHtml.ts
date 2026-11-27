import { createCipheriv, createHash, randomBytes } from "crypto";
import { IPlatform } from "../routes/platform/platform.model";

const ENCRYPTION_VERSION = "v1";
const ENCRYPTION_ALGORITHM = "aes-256-gcm";

function encodeBase64Url(value: Buffer): string {
	return value
		.toString("base64")
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");
}

function escapeHtmlAttribute(value: string): string {
	return value.replace(/&/g, "&amp;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function encryptClientPayload(data: { [key: string]: any }, clientId: string): string {
	if (typeof clientId !== "string" || clientId.trim().length === 0) throw new Error("INVALID_CLIENT_ID");

	const key = createHash("sha256").update(clientId, "utf8").digest();
	const iv = randomBytes(12);
	const cipher = createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
	const ciphertext = Buffer.concat([cipher.update(JSON.stringify(data), "utf8"), cipher.final()]);
	const authenticationTag = cipher.getAuthTag();

	return [ENCRYPTION_VERSION, encodeBase64Url(iv), encodeBase64Url(authenticationTag), encodeBase64Url(ciphertext)].join(".");
}

export function sendResponseToClientUrl(res: any, platform: IPlatform, apiUrl: string, data: { [key: string]: any }) {
	const copy = { ...data, vueClientUrl: platform.vueClientUrl };
	const encryptedData = encryptClientPayload(copy, platform.clientId);
	return res.send(formatResponseHtml(platform.redirectUrl, encryptedData));
}

export function formatResponseHtml(urlCallback: string, data: { [key: string]: any } | string) {
	const serializedData = typeof data === "string" ? data : JSON.stringify(data);
	return `
        <html>
            <body>
                <form id="redirectForm" method="post" action='${escapeHtmlAttribute(urlCallback)}'>
                    <input type="hidden" name="data" value='${escapeHtmlAttribute(serializedData)}' />
                </form>

                <script>
                    document.getElementById('redirectForm').submit();
                </script>
            </body>
        </html>
    `;
}
