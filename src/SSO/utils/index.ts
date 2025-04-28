import { SpinalNode } from "spinal-model-graph";
import { USER_TYPE } from "../../constant";
import { IUserType } from "../../routes/authUser/user.model";
import { IPlatform } from "../../routes/platform/platform.model";
import { PlatformService } from "../../routes/platform/platformServices";
import { TokensService } from "../../routes/tokens/tokenService";
import { ISSOUser } from "../interfaces/ISSOUser";



export async function convertSSOData(userData: ISSOUser, platform: IPlatform) {
    const profileId = Array.isArray(userData.groups) ? userData.groups[0] : userData.groups;

    const userProfile = await PlatformService.getInstance().getUserProfile(platform.id, profileId, true);

    if (!userProfile) throw new Error(`No profil found for ${profileId}`);

    const tokenData = _getTokenData(platform.id, userData, userProfile);

    const tokenNode = await TokensService.getInstance().createSamlToken(tokenData, platform);

    return {
        name: tokenNode.getName().get(),
        token: tokenNode.info.token.get(),
        createdToken: tokenNode.info.createdToken.get(),
        expieredToken: tokenNode.info.expieredToken.get(),
        userId: tokenNode.info.userId?.get(),
        platformList: tokenNode.info.platformList?.get() || [],
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