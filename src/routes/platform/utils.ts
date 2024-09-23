import { ILocalAuthenticationInfo, IOAuthAuthenticationInfo, ISAMLAuthenticationInfo } from "./platform.model";

export function isSAMLAuthenticationInfo(data: any): data is ISAMLAuthenticationInfo {
    return data && data.issuer && data.entryPoint && data.callbackUrl;
}

export function isOAuthAuthenticationInfo(data: any): data is IOAuthAuthenticationInfo {
    return data && data.clientId && data.clientSecret && data.grant_type && data.endpoint
}

export function isLocalAuthenticationInfo(data: any): data is ILocalAuthenticationInfo {
    return data && data.code_challenge && data.code_challenge_method;
}