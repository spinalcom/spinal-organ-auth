import { Client, User } from "@node-oauth/oauth2-server";
import { UserService } from "../../routes/authUser/userService";
import { ApplicationService } from "../../routes/authApplication/applicationService";

export function getTokenFromRequest(request) {
	const headerToken = request.get("Authorization");
	const queryToken = request.query.access_token;
	const bodyToken = request.body.access_token;

	if ((!!headerToken as any) + !!queryToken + !!bodyToken > 1) return null;

	if (headerToken) return getTokenFromRequestHeader(request);

	if (queryToken) return getTokenFromRequestQuery(request);

	if (bodyToken) return getTokenFromRequestBody(request);

	return null;
}

function getTokenFromRequestHeader(request) {
	const token = request.get("Authorization");
	const matches = token.match(/^Bearer ([0-9a-zA-Z-._~+/]+=*)$/);

	if (!matches) {
		return null;
	}

	return matches[1];
}

function getTokenFromRequestQuery(request) {
	if (!this.allowBearerTokensInQueryString) {
		return null;
	}

	return request.query.access_token;
}

function getTokenFromRequestBody(request) {
	if (request.method === "GET") {
		return null;
	}

	if (!request.is("application/x-www-form-urlencoded")) {
		return null;
	}

	return request.body.access_token;
}

export async function getScope(client_type: "user" | "client", user: User, client: Client) {
	const nodes = await (client_type === "user" ? UserService.getInstance().getUserNodes() : ApplicationService.getInstance().getApplicationNodes());
	const id = client_type === "user" ? user.id : client.id;

	const node = nodes.find((node) => node.getId().get() === id);

	return node?.info.scope?.get() || [];
}
