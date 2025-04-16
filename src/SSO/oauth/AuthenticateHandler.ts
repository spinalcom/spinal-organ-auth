import { Falsey, User, InvalidArgumentError, Request } from "express-oauth-server";

export class AuthenticateHandler {
	constructor(private options: any) {
		if (!options.model) {
			throw new InvalidArgumentError("Missing parameter: `model`");
		}

		if (!options.model.getUser) {
			throw new InvalidArgumentError("Invalid argument: model does not implement `getUser()`");
		}
	}

	async handle(req: Request): Promise<User | Falsey> {

		// const token = this.options.getTokenFromRequest(req);

		const { username, password } = req.body;
		const usr = await this.options.model.getUser(username, password);
		return usr;
	}
}
