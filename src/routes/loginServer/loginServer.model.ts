import { CONNECTION_METHODS } from "../../constant";


export interface ISAMLAuthenticationInfo {
    issuer: string;
    entryPoint: string;
    cert: string;
    callbackUrl: string;
    logoutUrl?: string;
    serverEntityId?: string;
}

export interface IOpenIdAuthenticationInfo {
    issuer: string;
    authorizationUrl: string;
    tokenUrl: string;
    userInfoUrl: string;
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
    scopes: string | string[];
    logoutUrl?: string;
}

export interface IOAuthAuthenticationInfo {
    clientId: string;
    clientSecret: string;
    callbackUrl?: string;
    grant_type?: string;
    endpoint?: string;
    logoutUrl?: string;
    scopes?: string;
    tokenUrl: string;
}

export interface ILocalAuthenticationInfo {
    code_challenge: string;
    code_challenge_method: "S256"
}

export enum ServerType {
    INTERNAL = "INTERNAL_SERVER",
    EXTERNAL = "EXTERNAL_SERVER"
}

export interface ILoginServer {
    name?: string;
    type?: ServerType;
    authentication_method?: CONNECTION_METHODS;
    authentication_info?: IOpenIdAuthenticationInfo | ISAMLAuthenticationInfo | IOAuthAuthenticationInfo | ILocalAuthenticationInfo;
}