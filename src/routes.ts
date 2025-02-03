/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute, HttpStatusCodeLiteral, TsoaResponse, fetchMiddlewares } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ApplicationsController } from './routes/authApplication/applicationController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UsersController } from './routes/authUser/userController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LoginServerController } from './routes/loginServer/loginServerController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LogsController } from './routes/logs/logController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { NotificationController } from './routes/notification/notificationController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { OrgansController } from './routes/organ/organController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PlatformsController } from './routes/platform/platformController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RegisterKeyController } from './routes/platform/registerKeyController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RegisterController } from './routes/register/registerController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TokensController } from './routes/tokens/tokenController';
import { expressAuthentication } from './security/index';
// @ts-ignore - no great way to install types from subpackage
const promiseAny = require('promise.any');
import type { RequestHandler } from 'express';
import * as express from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "IApplication": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"double"}],"required":true},
            "type": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "appType": {"dataType":"string","required":true},
            "clientId": {"dataType":"string","required":true},
            "clientSecret": {"dataType":"string","required":true},
            "platformList": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"appProfile":{"dataType":"nestedObjectLiteral","nestedProperties":{"appProfileId":{"dataType":"string","required":true},"name":{"dataType":"string","required":true}},"required":true},"platformId":{"dataType":"string","required":true}}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IApplicationCreationParams": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "clientId": {"dataType":"string","required":true},
            "clientSecret": {"dataType":"string","required":true},
            "appType": {"dataType":"string"},
            "redirectUri": {"dataType":"string"},
            "grant_types": {"dataType":"array","array":{"dataType":"string"}},
            "platformList": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"appProfile":{"dataType":"nestedObjectLiteral","nestedProperties":{"appProfileId":{"dataType":"string","required":true},"name":{"dataType":"string","required":true}},"required":true},"platformId":{"dataType":"string","required":true}}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IApplicationUpdateParams": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "clientId": {"dataType":"string"},
            "clientSecret": {"dataType":"string"},
            "appType": {"dataType":"string"},
            "platformList": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"appProfile":{"dataType":"nestedObjectLiteral","nestedProperties":{"appProfileName":{"dataType":"string","required":true},"appProfileBosConfigId":{"dataType":"string","required":true},"appProfileAdminId":{"dataType":"string","required":true}},"required":true},"platformName":{"dataType":"string","required":true},"platformId":{"dataType":"string","required":true}}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IApplicationToken": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "type": {"dataType":"string"},
            "token": {"dataType":"string"},
            "createdToken": {"dataType":"double"},
            "expieredToken": {"dataType":"double"},
            "applicationId": {"dataType":"string"},
            "applicationProfileList": {"dataType":"array","array":{"dataType":"string"}},
            "platformList": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"appProfile":{"dataType":"nestedObjectLiteral","nestedProperties":{"appProfileName":{"dataType":"string","required":true},"appProfileBosConfigId":{"dataType":"string","required":true},"appProfileAdminId":{"dataType":"string","required":true}},"required":true},"idPlatformOfAdmin":{"dataType":"string","required":true},"platformName":{"dataType":"string","required":true},"platformId":{"dataType":"string","required":true}}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IApplicationLoginParams": {
        "dataType": "refObject",
        "properties": {
            "clientId": {"dataType":"string","required":true},
            "clientSecret": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IApplicationLogs": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "date": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "actor": {"dataType":"nestedObjectLiteral","nestedProperties":{"actorName":{"dataType":"string","required":true},"actorId":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserType": {
        "dataType": "refEnum",
        "enums": ["authAdmin","Super User","Simple User"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUser": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"double"}],"required":true},
            "type": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "userName": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
            "email": {"dataType":"string"},
            "telephone": {"dataType":"string"},
            "info": {"dataType":"string"},
            "userType": {"ref":"IUserType","required":true},
            "platformList": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"userProfile":{"dataType":"nestedObjectLiteral","nestedProperties":{"userProfileId":{"dataType":"string","required":true},"name":{"dataType":"string","required":true}},"required":true},"platformId":{"dataType":"string","required":true}}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserCreationParams": {
        "dataType": "refObject",
        "properties": {
            "userName": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
            "email": {"dataType":"string"},
            "telephone": {"dataType":"string"},
            "info": {"dataType":"string"},
            "userType": {"ref":"IUserType","required":true},
            "platformList": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"userProfile":{"dataType":"nestedObjectLiteral","nestedProperties":{"userProfileId":{"dataType":"string","required":true},"name":{"dataType":"string","required":true}},"required":true},"platformId":{"dataType":"string","required":true}}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserUpdateParams": {
        "dataType": "refObject",
        "properties": {
            "userName": {"dataType":"string"},
            "password": {"dataType":"string"},
            "email": {"dataType":"string"},
            "telephone": {"dataType":"string"},
            "info": {"dataType":"string"},
            "userType": {"ref":"IUserType"},
            "platformList": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"userProfile":{"dataType":"nestedObjectLiteral","nestedProperties":{"userProfileName":{"dataType":"string","required":true},"userProfileBosConfigId":{"dataType":"string","required":true},"userProfileAdminId":{"dataType":"string","required":true}},"required":true},"platformName":{"dataType":"string","required":true},"platformId":{"dataType":"string","required":true}}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUpdateUserPassword": {
        "dataType": "refObject",
        "properties": {
            "oldPassword": {"dataType":"string","required":true},
            "newPassword": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IAuthAdminUpdateParams": {
        "dataType": "refObject",
        "properties": {
            "userName": {"dataType":"string","required":true},
            "oldPassword": {"dataType":"string"},
            "newPassword": {"dataType":"string"},
            "email": {"dataType":"string"},
            "telephone": {"dataType":"string"},
            "info": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserToken": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "type": {"dataType":"string"},
            "token": {"dataType":"string"},
            "createdToken": {"dataType":"double"},
            "expieredToken": {"dataType":"double"},
            "userId": {"dataType":"string"},
            "userType": {"dataType":"string"},
            "userProfile": {"dataType":"string"},
            "serverId": {"dataType":"string"},
            "platformList": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"userProfile":{"dataType":"nestedObjectLiteral","nestedProperties":{"userProfileName":{"dataType":"string","required":true},"userProfileBosConfigId":{"dataType":"string","required":true},"userProfileAdminId":{"dataType":"string","required":true}},"required":true},"idPlatformOfAdmin":{"dataType":"string","required":true},"platformName":{"dataType":"string","required":true},"platformId":{"dataType":"string","required":true}}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserLoginParams": {
        "dataType": "refObject",
        "properties": {
            "userName": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserLogs": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "date": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "actor": {"dataType":"nestedObjectLiteral","nestedProperties":{"actorName":{"dataType":"string","required":true},"actorId":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ServerType": {
        "dataType": "refEnum",
        "enums": ["INTERNAL_SERVER","EXTERNAL_SERVER"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CONNECTION_METHODS": {
        "dataType": "refEnum",
        "enums": ["local","saml","oauth2"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ISAMLAuthenticationInfo": {
        "dataType": "refObject",
        "properties": {
            "issuer": {"dataType":"string","required":true},
            "entryPoint": {"dataType":"string","required":true},
            "cert": {"dataType":"string","required":true},
            "callbackUrl": {"dataType":"string","required":true},
            "logoutUrl": {"dataType":"string"},
            "serverEntityId": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IOAuthAuthenticationInfo": {
        "dataType": "refObject",
        "properties": {
            "clientId": {"dataType":"string","required":true},
            "clientSecret": {"dataType":"string","required":true},
            "callbackUrl": {"dataType":"string"},
            "grant_type": {"dataType":"string"},
            "endpoint": {"dataType":"string"},
            "logoutUrl": {"dataType":"string"},
            "scopes": {"dataType":"string"},
            "tokenUrl": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ILocalAuthenticationInfo": {
        "dataType": "refObject",
        "properties": {
            "code_challenge": {"dataType":"string","required":true},
            "code_challenge_method": {"dataType":"enum","enums":["S256"],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ILoginServer": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "type": {"ref":"ServerType"},
            "authentication_method": {"ref":"CONNECTION_METHODS"},
            "authentication_info": {"dataType":"union","subSchemas":[{"ref":"ISAMLAuthenticationInfo"},{"ref":"IOAuthAuthenticationInfo"},{"ref":"ILocalAuthenticationInfo"}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "INotification": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"string"},
            "date": {"dataType":"string","required":true},
            "actor": {"dataType":"nestedObjectLiteral","nestedProperties":{"actorName":{"dataType":"string","required":true},"actorId":{"dataType":"string","required":true}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "INotificationCreationParams": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "date": {"dataType":"string","required":true},
            "actor": {"dataType":"nestedObjectLiteral","nestedProperties":{"actorName":{"dataType":"string","required":true},"actorId":{"dataType":"string","required":true}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "statusOrgan": {
        "dataType": "refEnum",
        "enums": ["online","fail","stop"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IOrgan": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string"},
            "name": {"dataType":"string"},
            "statusOrgan": {"ref":"statusOrgan","required":true},
            "organType": {"dataType":"string","required":true},
            "type": {"dataType":"string"},
            "platformId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IOrganCreationParams": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"string"},
            "organType": {"dataType":"string","required":true},
            "statusOrgan": {"dataType":"string","required":true},
            "platformId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IOrganUpdateParams": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "organType": {"dataType":"string","required":true},
            "statusOrgan": {"ref":"statusOrgan","required":true},
            "platformId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "statusPlatform": {
        "dataType": "refEnum",
        "enums": ["connected","not connected"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPlatform": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string"},
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "statusPlatform": {"ref":"statusPlatform","required":true},
            "lastSyncTime": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}]},
            "url": {"dataType":"string","required":true},
            "address": {"dataType":"string"},
            "TokenBosAdmin": {"dataType":"string"},
            "TokenAdminBos": {"dataType":"string"},
            "idPlatformOfAdmin": {"dataType":"string"},
            "clientId": {"dataType":"string","required":true},
            "clientSecret": {"dataType":"string"},
            "redirectUrl": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPlatformUpdateParams": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "redirectUrl": {"dataType":"string"},
            "url": {"dataType":"string"},
            "address": {"dataType":"string"},
            "loginServerIds": {"dataType":"array","array":{"dataType":"string"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserProfile": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "userProfileId": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "platformId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IAppProfile": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string"},
            "appProfileId": {"dataType":"string","required":true},
            "name": {"dataType":"string"},
            "type": {"dataType":"string"},
            "platformId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPlatformLogs": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "date": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "actor": {"dataType":"nestedObjectLiteral","nestedProperties":{"actorName":{"dataType":"string","required":true},"actorId":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IRegisterKeyObject": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "value": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPlateformCreationParams": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string"},
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "statusPlatform": {"ref":"statusPlatform","required":true},
            "lastSyncTime": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}]},
            "url": {"dataType":"string","required":true},
            "address": {"dataType":"string"},
            "TokenBosAdmin": {"dataType":"string"},
            "TokenAdminBos": {"dataType":"string"},
            "idPlatformOfAdmin": {"dataType":"string"},
            "clientId": {"dataType":"string","required":true},
            "clientSecret": {"dataType":"string"},
            "redirectUrl": {"dataType":"string","required":true},
            "loginServerIds": {"dataType":"array","array":{"dataType":"string"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IRegisterParams": {
        "dataType": "refObject",
        "properties": {
            "clientId": {"dataType":"string","required":true},
            "clientSecret": {"dataType":"string","required":true},
            "platformCreationParms": {"ref":"IPlateformCreationParams"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IToken": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "token": {"dataType":"string","required":true},
            "createdToken": {"dataType":"double"},
            "expieredToken": {"dataType":"double"},
            "userId": {"dataType":"string"},
            "userType": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: express.Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        app.post('/applications',
            authenticateMiddleware([{"jwt":["authAdmin:write"]}]),
            ...(fetchMiddlewares<RequestHandler>(ApplicationsController)),
            ...(fetchMiddlewares<RequestHandler>(ApplicationsController.prototype.createApplication)),

            function ApplicationsController_createApplication(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IApplicationCreationParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ApplicationsController();


              const promise = controller.createApplication.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/applications',
            authenticateMiddleware([{"jwt":["authAdmin:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(ApplicationsController)),
            ...(fetchMiddlewares<RequestHandler>(ApplicationsController.prototype.getApplications)),

            function ApplicationsController_getApplications(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ApplicationsController();


              const promise = controller.getApplications.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/applications/:applicationId',
            authenticateMiddleware([{"jwt":["authAdmin:read","ownData:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(ApplicationsController)),
            ...(fetchMiddlewares<RequestHandler>(ApplicationsController.prototype.getApplication)),

            function ApplicationsController_getApplication(request: any, response: any, next: any) {
            const args = {
                    applicationId: {"in":"path","name":"applicationId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ApplicationsController();


              const promise = controller.getApplication.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/applications/:applicationId',
            authenticateMiddleware([{"jwt":["authAdmin:delete"]}]),
            ...(fetchMiddlewares<RequestHandler>(ApplicationsController)),
            ...(fetchMiddlewares<RequestHandler>(ApplicationsController.prototype.deleteApplication)),

            function ApplicationsController_deleteApplication(request: any, response: any, next: any) {
            const args = {
                    applicationId: {"in":"path","name":"applicationId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ApplicationsController();


              const promise = controller.deleteApplication.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/applications/:applicationId',
            authenticateMiddleware([{"jwt":["authAdmin:write"]}]),
            ...(fetchMiddlewares<RequestHandler>(ApplicationsController)),
            ...(fetchMiddlewares<RequestHandler>(ApplicationsController.prototype.updateApplication)),

            function ApplicationsController_updateApplication(request: any, response: any, next: any) {
            const args = {
                    applicationId: {"in":"path","name":"applicationId","required":true,"dataType":"string"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IApplicationUpdateParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ApplicationsController();


              const promise = controller.updateApplication.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/applications/login',
            ...(fetchMiddlewares<RequestHandler>(ApplicationsController)),
            ...(fetchMiddlewares<RequestHandler>(ApplicationsController.prototype.login)),

            function ApplicationsController_login(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IApplicationLoginParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ApplicationsController();


              const promise = controller.login.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/applications/:applicationId/applicationLogs',
            authenticateMiddleware([{"jwt":["authAdmin:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(ApplicationsController)),
            ...(fetchMiddlewares<RequestHandler>(ApplicationsController.prototype.getApplicationLogs)),

            function ApplicationsController_getApplicationLogs(request: any, response: any, next: any) {
            const args = {
                    applicationId: {"in":"path","name":"applicationId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ApplicationsController();


              const promise = controller.getApplicationLogs.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/users',
            authenticateMiddleware([{"jwt":["authAdmin:write"]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.createUser)),

            function UsersController_createUser(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IUserCreationParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.createUser.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/users',
            authenticateMiddleware([{"jwt":["authAdmin:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getUsers)),

            function UsersController_getUsers(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.getUsers.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/users/:userId',
            authenticateMiddleware([{"jwt":["authAdmin:read","ownData:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getUser)),

            function UsersController_getUser(request: any, response: any, next: any) {
            const args = {
                    userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.getUser.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/users/userInfo',
            authenticateMiddleware([{"jwt":["authAdmin:read","ownData:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getUserInfoByToken)),

            function UsersController_getUserInfoByToken(request: any, response: any, next: any) {
            const args = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"token":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.getUserInfoByToken.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/users/:userId',
            authenticateMiddleware([{"jwt":["authAdmin:delete"]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.deleteUser)),

            function UsersController_deleteUser(request: any, response: any, next: any) {
            const args = {
                    userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.deleteUser.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/users/:userId',
            authenticateMiddleware([{"jwt":["authAdmin:write"]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.updateUser)),

            function UsersController_updateUser(request: any, response: any, next: any) {
            const args = {
                    userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IUserUpdateParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.updateUser.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/users/:userId/updatePassword',
            authenticateMiddleware([{"jwt":["authAdmin:write"]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.updateUserPassword)),

            function UsersController_updateUserPassword(request: any, response: any, next: any) {
            const args = {
                    userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IUpdateUserPassword"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.updateUserPassword.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/users',
            authenticateMiddleware([{"jwt":["authAdmin:write"]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.updateAuthAdmin)),

            function UsersController_updateAuthAdmin(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IAuthAdminUpdateParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.updateAuthAdmin.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/users/getAuthAdmin',
            authenticateMiddleware([{"jwt":["authAdmin:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getAuthAdmin)),

            function UsersController_getAuthAdmin(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.getAuthAdmin.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/users/userProfilesList',
            authenticateMiddleware([{"jwt":["authAdmin:write"]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.userProfilesList)),

            function UsersController_userProfilesList(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.userProfilesList.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/users/login',
            authenticateMiddleware([{"all":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.login)),

            function UsersController_login(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IUserLoginParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.login.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/users/loginAuthAdmin',
            authenticateMiddleware([{"all":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.loginAuthAdmin)),

            function UsersController_loginAuthAdmin(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IUserLoginParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.loginAuthAdmin.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/users/getRoles',
            authenticateMiddleware([{"all":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getRoles)),

            function UsersController_getRoles(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.getRoles.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/users/:userId/userLogs',
            authenticateMiddleware([{"jwt":["authAdmin:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getUserLogs)),

            function UsersController_getUserLogs(request: any, response: any, next: any) {
            const args = {
                    userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.getUserLogs.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/loginserver/create',
            authenticateMiddleware([{"jwt":["authAdmin:write"]}]),
            ...(fetchMiddlewares<RequestHandler>(LoginServerController)),
            ...(fetchMiddlewares<RequestHandler>(LoginServerController.prototype.createLoginServer)),

            function LoginServerController_createLoginServer(request: any, response: any, next: any) {
            const args = {
                    serverInfo: {"in":"body","name":"serverInfo","required":true,"ref":"ILoginServer"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new LoginServerController();


              const promise = controller.createLoginServer.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/loginserver/all_servers',
            authenticateMiddleware([{"jwt":["authAdmin:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(LoginServerController)),
            ...(fetchMiddlewares<RequestHandler>(LoginServerController.prototype.getAllLoginServer)),

            function LoginServerController_getAllLoginServer(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new LoginServerController();


              const promise = controller.getAllLoginServer.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/loginserver/:serverId',
            authenticateMiddleware([{"jwt":["authAdmin:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(LoginServerController)),
            ...(fetchMiddlewares<RequestHandler>(LoginServerController.prototype.getLoginServer)),

            function LoginServerController_getLoginServer(request: any, response: any, next: any) {
            const args = {
                    serverId: {"in":"path","name":"serverId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new LoginServerController();


              const promise = controller.getLoginServer.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/loginserver/update/:serverId',
            authenticateMiddleware([{"jwt":["authAdmin:write"]}]),
            ...(fetchMiddlewares<RequestHandler>(LoginServerController)),
            ...(fetchMiddlewares<RequestHandler>(LoginServerController.prototype.editLoginServer)),

            function LoginServerController_editLoginServer(request: any, response: any, next: any) {
            const args = {
                    serverId: {"in":"path","name":"serverId","required":true,"dataType":"string"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"ILoginServer"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new LoginServerController();


              const promise = controller.editLoginServer.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/loginserver/delete/:serverId',
            authenticateMiddleware([{"jwt":["authAdmin:delete"]}]),
            ...(fetchMiddlewares<RequestHandler>(LoginServerController)),
            ...(fetchMiddlewares<RequestHandler>(LoginServerController.prototype.deleteLoginServer)),

            function LoginServerController_deleteLoginServer(request: any, response: any, next: any) {
            const args = {
                    serverId: {"in":"path","name":"serverId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new LoginServerController();


              const promise = controller.deleteLoginServer.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/logs',
            authenticateMiddleware([{"jwt":["authAdmin:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(LogsController)),
            ...(fetchMiddlewares<RequestHandler>(LogsController.prototype.getLogs)),

            function LogsController_getLogs(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new LogsController();


              const promise = controller.getLogs.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/logs/getPlatformsLogs',
            authenticateMiddleware([{"jwt":["authAdmin:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(LogsController)),
            ...(fetchMiddlewares<RequestHandler>(LogsController.prototype.getPlatformsLogs)),

            function LogsController_getPlatformsLogs(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new LogsController();


              const promise = controller.getPlatformsLogs.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/notification',
            ...(fetchMiddlewares<RequestHandler>(NotificationController)),
            ...(fetchMiddlewares<RequestHandler>(NotificationController.prototype.createNotification)),

            function NotificationController_createNotification(request: any, response: any, next: any) {
            const args = {
                    object: {"in":"body","name":"object","required":true,"ref":"INotificationCreationParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new NotificationController();


              const promise = controller.createNotification.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/organs/:platformId',
            authenticateMiddleware([{"jwt":["authAdmin:write"]}]),
            ...(fetchMiddlewares<RequestHandler>(OrgansController)),
            ...(fetchMiddlewares<RequestHandler>(OrgansController.prototype.createOrgan)),

            function OrgansController_createOrgan(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IOrganCreationParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new OrgansController();


              const promise = controller.createOrgan.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/organs/:platformId',
            authenticateMiddleware([{"jwt":["authAdmin:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(OrgansController)),
            ...(fetchMiddlewares<RequestHandler>(OrgansController.prototype.getOrgans)),

            function OrgansController_getOrgans(request: any, response: any, next: any) {
            const args = {
                    platformId: {"in":"path","name":"platformId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new OrgansController();


              const promise = controller.getOrgans.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/organs/:organId',
            authenticateMiddleware([{"jwt":["authAdmin:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(OrgansController)),
            ...(fetchMiddlewares<RequestHandler>(OrgansController.prototype.updatePlateform)),

            function OrgansController_updatePlateform(request: any, response: any, next: any) {
            const args = {
                    organId: {"in":"path","name":"organId","required":true,"dataType":"string"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IOrganUpdateParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new OrgansController();


              const promise = controller.updatePlateform.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/platforms',
            authenticateMiddleware([{"jwt":["authAdmin:write"]}]),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController)),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController.prototype.createPlateform)),

            function PlatformsController_createPlateform(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PlatformsController();


              const promise = controller.createPlateform.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/platforms',
            authenticateMiddleware([{"jwt":["authAdmin:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController)),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController.prototype.getPlatforms)),

            function PlatformsController_getPlatforms(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PlatformsController();


              const promise = controller.getPlatforms.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/platforms/:platformId',
            authenticateMiddleware([{"jwt":["authAdmin:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController)),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController.prototype.getPlateform)),

            function PlatformsController_getPlateform(request: any, response: any, next: any) {
            const args = {
                    platformId: {"in":"path","name":"platformId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PlatformsController();


              const promise = controller.getPlateform.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/platforms/:platformId/loginServers',
            authenticateMiddleware([{"jwt":["authAdmin:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController)),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController.prototype.getPlateformLoginServers)),

            function PlatformsController_getPlateformLoginServers(request: any, response: any, next: any) {
            const args = {
                    platformId: {"in":"path","name":"platformId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PlatformsController();


              const promise = controller.getPlateformLoginServers.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/platforms/:platformId/loginServers',
            authenticateMiddleware([{"jwt":["authAdmin:delete"]}]),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController)),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController.prototype.removeLoginServersFromPlateform)),

            function PlatformsController_removeLoginServersFromPlateform(request: any, response: any, next: any) {
            const args = {
                    platformId: {"in":"path","name":"platformId","required":true,"dataType":"string"},
                    data: {"in":"body","name":"data","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"ids":{"dataType":"array","array":{"dataType":"string"},"required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PlatformsController();


              const promise = controller.removeLoginServersFromPlateform.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/platforms/:platformId',
            authenticateMiddleware([{"jwt":["authAdmin:delete"]}]),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController)),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController.prototype.deletePlatform)),

            function PlatformsController_deletePlatform(request: any, response: any, next: any) {
            const args = {
                    platformId: {"in":"path","name":"platformId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PlatformsController();


              const promise = controller.deletePlatform.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/platforms/:platformId',
            authenticateMiddleware([{"jwt":["authAdmin:write"]}]),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController)),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController.prototype.updatePlateform)),

            function PlatformsController_updatePlateform(request: any, response: any, next: any) {
            const args = {
                    platformId: {"in":"path","name":"platformId","required":true,"dataType":"string"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IPlatformUpdateParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PlatformsController();


              const promise = controller.updatePlateform.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/platforms/:platformId/getUserProfileList',
            authenticateMiddleware([{"jwt":["authAdmin:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController)),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController.prototype.getUserProfileList)),

            function PlatformsController_getUserProfileList(request: any, response: any, next: any) {
            const args = {
                    platformId: {"in":"path","name":"platformId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PlatformsController();


              const promise = controller.getUserProfileList.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/platforms/:platformId/getAppProfileList',
            authenticateMiddleware([{"jwt":["authAdmin:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController)),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController.prototype.getAppProfileService)),

            function PlatformsController_getAppProfileService(request: any, response: any, next: any) {
            const args = {
                    platformId: {"in":"path","name":"platformId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PlatformsController();


              const promise = controller.getAppProfileService.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/platforms/:platformId/platformLogs',
            authenticateMiddleware([{"jwt":["authAdmin:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController)),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController.prototype.getPlatformLogs)),

            function PlatformsController_getPlatformLogs(request: any, response: any, next: any) {
            const args = {
                    platformId: {"in":"path","name":"platformId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PlatformsController();


              const promise = controller.getPlatformLogs.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/platforms/registerKey',
            authenticateMiddleware([{"jwt":["authAdmin:write"]}]),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController)),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController.prototype.updateRegisterKeyNode)),

            function PlatformsController_updateRegisterKeyNode(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PlatformsController();


              const promise = controller.updateRegisterKeyNode.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/platforms/updatePlatformToken',
            authenticateMiddleware([{"all":["platform:write"]}]),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController)),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController.prototype.updatePlatformToken)),

            function PlatformsController_updatePlatformToken(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"clientSecret":{"dataType":"string","required":true},"clientId":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PlatformsController();


              const promise = controller.updatePlatformToken.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/registerKey',
            authenticateMiddleware([{"jwt":["authAdmin:write"]}]),
            ...(fetchMiddlewares<RequestHandler>(RegisterKeyController)),
            ...(fetchMiddlewares<RequestHandler>(RegisterKeyController.prototype.updateRegisterKeyNode)),

            function RegisterKeyController_updateRegisterKeyNode(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new RegisterKeyController();


              const promise = controller.updateRegisterKeyNode.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/registerKey',
            authenticateMiddleware([{"jwt":["authAdmin:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(RegisterKeyController)),
            ...(fetchMiddlewares<RequestHandler>(RegisterKeyController.prototype.getRegisterKeyNode)),

            function RegisterKeyController_getRegisterKeyNode(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new RegisterKeyController();


              const promise = controller.getRegisterKeyNode.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/register',
            ...(fetchMiddlewares<RequestHandler>(RegisterController)),
            ...(fetchMiddlewares<RequestHandler>(RegisterController.prototype.registerPlatform)),

            function RegisterController_registerPlatform(request: any, response: any, next: any) {
            const args = {
                    object: {"in":"body","name":"object","required":true,"ref":"IRegisterParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new RegisterController();


              const promise = controller.registerPlatform.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/register',
            ...(fetchMiddlewares<RequestHandler>(RegisterController)),
            ...(fetchMiddlewares<RequestHandler>(RegisterController.prototype.updatePlatform)),

            function RegisterController_updatePlatform(request: any, response: any, next: any) {
            const args = {
                    object: {"in":"body","name":"object","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new RegisterController();


              const promise = controller.updatePlatform.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/tokens',
            authenticateMiddleware([{"jwt":["authAdmin:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(TokensController)),
            ...(fetchMiddlewares<RequestHandler>(TokensController.prototype.getTokens)),

            function TokensController_getTokens(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TokensController();


              const promise = controller.getTokens.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/tokens/UserToken',
            authenticateMiddleware([{"jwt":["authAdmin:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(TokensController)),
            ...(fetchMiddlewares<RequestHandler>(TokensController.prototype.getUserTokens)),

            function TokensController_getUserTokens(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TokensController();


              const promise = controller.getUserTokens.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/tokens/ApplicationToken',
            authenticateMiddleware([{"jwt":["authAdmin:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(TokensController)),
            ...(fetchMiddlewares<RequestHandler>(TokensController.prototype.getApplicationTokens)),

            function TokensController_getApplicationTokens(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TokensController();


              const promise = controller.getApplicationTokens.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/tokens/getUserProfileByToken',
            authenticateMiddleware([{"jwt":["ownData:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(TokensController)),
            ...(fetchMiddlewares<RequestHandler>(TokensController.prototype.getUserProfileByToken)),

            function TokensController_getUserProfileByToken(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TokensController();


              const promise = controller.getUserProfileByToken.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/tokens/getAppProfileByToken',
            authenticateMiddleware([{"jwt":["ownData:read"]}]),
            ...(fetchMiddlewares<RequestHandler>(TokensController)),
            ...(fetchMiddlewares<RequestHandler>(TokensController.prototype.getAppProfileByToken)),

            function TokensController_getAppProfileByToken(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TokensController();


              const promise = controller.getAppProfileByToken.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/tokens/verifyToken',
            ...(fetchMiddlewares<RequestHandler>(TokensController)),
            ...(fetchMiddlewares<RequestHandler>(TokensController.prototype.verifyToken)),

            function TokensController_verifyToken(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TokensController();


              const promise = controller.verifyToken.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, _response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthentication(request, name, secMethod[name])
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthentication(request, name, secMethod[name])
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await promiseAny(secMethodOrPromises);
                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, successStatus: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode = successStatus;
                let headers;
                if (isController(controllerObj)) {
                    headers = controllerObj.getHeaders();
                    statusCode = controllerObj.getStatus() || statusCode;
                }

                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                returnHandler(response, statusCode, data, headers)
            })
            .catch((error: any) => next(error));
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function returnHandler(response: any, statusCode?: number, data?: any, headers: any = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name: string) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            data.pipe(response);
        } else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        } else {
            response.status(statusCode || 204).end();
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function responder(response: any): TsoaResponse<HttpStatusCodeLiteral, unknown>  {
        return function(status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function getValidatedArgs(args: any, request: any, response: any): any[] {
        const fieldErrors: FieldErrors  = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    }
                case 'res':
                    return responder(response);
            }
        });

        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
