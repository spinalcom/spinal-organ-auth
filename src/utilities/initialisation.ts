import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { SpinalContext } from "spinal-model-graph";
import { TokensService } from "../tokens/tokenService";
import { AUTH_SERVICE_INFO_ADMIN_RELATION_NAME, AUTH_SERVICE_LOG_CATEGORY_RELATION_NAME, AUTH_SERVICE_TOKEN_CATEGORY_RELATION_NAME, AUTH_SERVICE_USER_RELATION_NAME, INFO_ADMIN, LOG_LIST, TOKEN_LIST, USER_LIST } from "../constant";
import { LogsService } from "../logs/logService";
import { UserService } from "../authUser/userService";
import { PlatformService } from "../platform/platformServices";

export async function initTokenService(contexts: SpinalContext[]) {
    const context = contexts.find(context => context.getName().get() === TOKEN_LIST);
    if(context) {
        SpinalGraphService._addNode(context);
        const childsContext = await context.getChildren(AUTH_SERVICE_TOKEN_CATEGORY_RELATION_NAME);
        if(childsContext.length === 0) {
            return new TokensService().createTokenTree();
        }
    }
}

export async function initLogsService(contexts: SpinalContext[]) {
    const context = contexts.find(context => context.getName().get() === LOG_LIST);
    if(context) {
        const logsService = new LogsService();
        SpinalGraphService._addNode(context);
        const childsContext = await context.getChildren(AUTH_SERVICE_LOG_CATEGORY_RELATION_NAME);
        if(childsContext.length === 0) {
            await logsService.createLogTree();
            await logsService.createSubGraph(context);
            return logsService.createEventTypeGraph(context);
        }
    }
}

export async function initUserService(contexts: SpinalContext[]) {
    const context = contexts.find(context => context.getName().get() === USER_LIST);
    if(context) {
        SpinalGraphService._addNode(context);
        const childsContext = await context.getChildren(AUTH_SERVICE_USER_RELATION_NAME);
        if (childsContext.length === 0) {
            const userService = new UserService();
            let res = await userService.createAuthAdmin();
            if (res) {
              console.log('Auth Admin created ...');
              return res;
            }
          }
    }
}


export async function initPlatformService() {
    var plateformsService = new PlatformService();
    var plateforms = await plateformsService.getPlateforms();
    if (plateforms.length === 0) {
      let res = await plateformsService.createAuthPlateform();
      if (res) {
        console.log('Auth Plateform created ...');
        return res;
      }
    }
}


export async function createOrGetRegisterKey(contexts: SpinalContext[]) {
    const context = contexts.find(context => context.getName().get() === INFO_ADMIN);
    if (context) {
        let nodes = await context.getChildren(AUTH_SERVICE_INFO_ADMIN_RELATION_NAME);
        if (nodes.length === 0) {
            let res = await new PlatformService().createRegisterKeyNode();
            if (res) {
                console.log('register key created ...', res);
                return res;
            }
        }
    }
}  