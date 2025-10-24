import { SpinalNode } from "spinal-model-graph";
import { USER_TYPE } from "../../constant";
import { IUserType } from "../../routes/authUser/user.model";
import { IPlatform } from "../../routes/platform/platform.model";
import { PlatformService } from "../../routes/platform/platformServices";
import { TokensService } from "../../routes/tokens/tokenService";
import { ISSOUser } from "../interfaces/ISSOUser";
import loginService from "../../routes/loginServer/loginServerService";



export async function convertSSOData(userData: ISSOUser, platform: IPlatform) {
    // const profileId = Array.isArray(userData.groups) ? userData.groups[0] : userData.groups;
    const profileId = _getUserProfile(userData.groups, userData.profileClassifyByPriority);

    const useName = true;
    const userProfile = await PlatformService.getInstance().getUserProfile(platform.id, profileId, useName);

    if (!userProfile) throw new Error(`No profil found for ${profileId}`);

    const tokenData = _getTokenData(platform.id, userData, userProfile);
    const plateformList = await getPlatformLinkedToServer(userData.issuer, profileId); // get from platform service possible platform list for this user profile

    const tokenNode = await TokensService.getInstance().createSSOToken(tokenData, plateformList);

    return {
        name: tokenNode.getName().get(),
        token: tokenNode.info.token.get(),
        createdToken: tokenNode.info.createdToken.get(),
        expieredToken: tokenNode.info.expieredToken.get(),
        userId: tokenNode.info.userId?.get(),
        platformList: tokenNode.info.platformList?.get() || [],
    }
}

function _getUserProfile(responseProfiles: string | string[], profilesClassified: string | string[] = "") {

    if (responseProfiles.length === 0) return;
    if (!Array.isArray(responseProfiles)) return responseProfiles;
    if (responseProfiles.length === 1) return responseProfiles[0];

    if (!profilesClassified || profilesClassified.length === 0) return responseProfiles[0];

    profilesClassified = Array.isArray(profilesClassified) ? profilesClassified : profilesClassified.split(" ");

    for (const profile of profilesClassified) {
        if (responseProfiles.includes(profile)) { // Check if the profile is in the response profiles by order of priority
            return profile;
        }
    }

}



function _getTokenData(platformId: string, profile: any, userProfile: SpinalNode) {
    return {
        userId: profile.nameID,
        platformId: platformId,
        profile: {
            userProfileName: userProfile.getName().get(),
            userProfileBosConfigId: userProfile.info.userProfileId?.get()
        },
        userInfo: {
            id: profile.nameID,
            type: USER_TYPE,
            name: profile.name || profile.nameID,
            userName: profile.nameID,
            // password: profile.info.password.get(),
            email: profile.email || profile.nameID,
            telephone: "",
            info: "",
            userType: IUserType["Simple User"],
        }
    }
}


async function getPlatformLinkedToServer(issuer: string, profileId: string): Promise<(IPlatform & {
    profile: { userProfileName: string, userProfileBosConfigId: string }
})[]> {
    const serverNode = await loginService.getServerByIssuer(issuer);
    if (!serverNode) return [];

    const platforms = await loginService.getPlatformsUsingServer(serverNode);
    const promises = platforms.map(async el => {
        const platform = PlatformService.getInstance()._formatPlatform(el);
        const useName = true;
        const profile = await PlatformService.getInstance().getUserProfile(platform.id, profileId, useName);
        if (!profile) return platform;

        return {
            ...platform,
            profile: {
                userProfileName: profile.getName().get(),
                userProfileBosConfigId: profile.info.userProfileId?.get()
            }
        };
    });
}