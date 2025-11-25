import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { SpinalContext, SpinalGraph } from "spinal-model-graph";
import { TokensService } from "../routes/tokens/tokenService";
import { AUTH_ADMIN_NAME, AUTH_SERVICE_INFO_ADMIN_RELATION_NAME, AUTH_SERVICE_LOG_CATEGORY_RELATION_NAME, AUTH_SERVICE_TOKEN_CATEGORY_RELATION_NAME, AUTH_SERVICE_USER_RELATION_NAME, INFO_ADMIN, LOG_LIST, LOGIN_SERVER_CONTEXT_NAME, TOKEN_LIST, USER_LIST } from "../constant";
import { LogsService } from "../routes/logs/logService";
import { UserService } from "../routes/authUser/userService";
import { PlatformService } from "../routes/platform/platformServices";
import { RefreshTokenService } from "../routes/tokens/refreshTokenService";
import { AuthorizationCodeService } from "../routes/tokens/AuthorizationCodeService";
import loginService from "../routes/loginServer/loginServerService";
import SpinalUniqueCodeService from "../routes/uniqueCode/codeService";

export async function initAllServices(contexts: SpinalContext[]) {
	const promises = [
		AuthorizationCodeService.getInstance().init(),
		RefreshTokenService.getInstance().init(),
		SpinalUniqueCodeService.getInstance().init(),
		initLogsService(contexts),
		initTokenService(contexts),
		initUserService(contexts),
		initPlatformService(),
		initLoginServer(contexts),
	]
	return Promise.all(promises);
}

export async function initTokenService(contexts: SpinalContext[]) {
	const context = contexts.find((context) => context.getName().get() === TOKEN_LIST);
	if (context) {
		SpinalGraphService._addNode(context);
		const childsContext = await context.getChildren(AUTH_SERVICE_TOKEN_CATEGORY_RELATION_NAME);
		return TokensService.getInstance().createTokenTree();

		// if (childsContext.length !== 3) { // 2 is the number of token category (appCategory, userCategory)
		// 	return TokensService.getInstance().createTokenTree(childsContext);
		// }
	}
}

export async function initLogsService(contexts: SpinalContext[]) {
	const context = contexts.find((context) => context.getName().get() === LOG_LIST);
	if (context) {
		const logsService = LogsService.getInstance();

		const childsContext = await context.getChildren(AUTH_SERVICE_LOG_CATEGORY_RELATION_NAME);
		if (childsContext.length === 0) {
			await logsService.createLogTree();
			// await logsService.createSubGraph(context);
			// return logsService.createEventTypeGraph(context);
		}
	}
}

export async function initUserService(contexts: SpinalContext[]) {
	const context = contexts.find((context) => context.getName().get() === USER_LIST);
	if (context) {
		SpinalGraphService._addNode(context);
		const childsContext = await context.getChildren(AUTH_SERVICE_USER_RELATION_NAME);
		const findAdmin = childsContext.find((child) => child.info.userName.get() === AUTH_ADMIN_NAME);

		if (!findAdmin) {
			const userService = UserService.getInstance();
			let res = await userService.createAuthAdmin();
			if (res) {
				console.log("Auth Admin created ...");
				return res;
			}
		}
	}
}

export async function initPlatformService() {
	// var plateformsService = PlatformService.getInstance();
	// var plateforms = await plateformsService.getPlateforms();
	// if (plateforms.length === 0) {
	// 	let res = await plateformsService.createAuthPlateform();
	// 	if (res) {
	// 		console.log("Auth Plateform created ...");
	// 		return res;
	// 	}
	// }
	return;
}

export async function createOrGetRegisterKey(contexts: SpinalContext[]) {
	const context = contexts.find((context) => context.getName().get() === INFO_ADMIN);
	if (context) {
		let nodes = await context.getChildren(AUTH_SERVICE_INFO_ADMIN_RELATION_NAME);
		if (nodes.length === 0) {
			let res = await PlatformService.getInstance().createRegisterKeyNode();

			if (res) {
				console.log("register key created ...", res);
				return res;
			}
		}
	}
}


export async function initLoginServer(contexts: SpinalContext[]) {
	const context = contexts.find((context) => context.getName().get() === LOGIN_SERVER_CONTEXT_NAME);
	if (context) loginService.init(context);
}
