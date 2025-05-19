import { IApplicationToken, IAppPlatformProfile, IUserPlatformProfile, IUserToken } from "../tokens/token.model";

export interface IUserProfileBase {
    userProfileId: string;
    platformId: string;
}

export interface IAppProfileBase {
    appProfileId: string;
    platformId: string;
}

export type IProfile = IUserProfileBase | IAppProfileBase;

export type ICodeBase = {
    code: string;
    used: boolean;
    createdAt: number;
    usedAt: number;
}


export type ICodeResponse = ICodeBase & {
    id: string;
    profiles: (IAppPlatformProfile | IUserPlatformProfile)[];
}


export function isIUserProfileBase(profile: IProfile): profile is IUserProfileBase {
    return (profile as IUserProfileBase).userProfileId !== undefined;
}

export function isIAppProfileBase(profile: IProfile): profile is IAppProfileBase {
    return (profile as IAppProfileBase).appProfileId !== undefined;
}

