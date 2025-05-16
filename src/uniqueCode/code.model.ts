
export interface IUserProfileBase {
    userProfileId: string;
    platformId: string;
}

export interface IAppProfileBase {
    appProfileId: string;
    platformId: string;
}

export type IProfile = IUserProfileBase | IAppProfileBase;

export type ICode = {
    code: string;
    used: boolean;
    createdAt: number;
    usedAt: number;
    profiles: IProfile | IProfile[];
}

export type ICodeResponse = ICode & {
    id: string;
}

