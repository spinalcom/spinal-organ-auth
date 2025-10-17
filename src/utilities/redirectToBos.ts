import { v4 as uuidv4 } from 'uuid';
import * as globalCache from "global-cache";
import { PlatformService } from '../routes/platform/platformServices';
import { TokensService } from '../routes/tokens/tokenService';
import { IPlatform } from '../routes/platform/platform.model';


export function createRedirectToBosUrl(data: { bosurl: string; bosApiUrl: string; token: string; }): string {
    const id = uuidv4();
    globalCache.set(id, data, 30 * 1000); // store for 30 seconds

    return id;
}


export async function getSessionData(id: string): Promise<{ callbackUrl: string; tokenInfo: any; } | undefined> {
    const data = globalCache.get(id) as { bosurl: string; bosApiUrl: string; token: string; } | undefined;

    if (!data) throw new Error("Session not found or expired");

    const plateformNode = await PlatformService.getInstance().getPlateformByApiUrl(data.bosApiUrl);
    if (!plateformNode) throw new Error(`No Bos Platform found for this API URL ${data.bosApiUrl}`);

    const plateform: IPlatform = plateformNode.info.get();
    const tokenInfo = await TokensService.getInstance().verifyToken(data.token, plateform.clientId, "user");
    globalCache.delete(id); // remove after retrieval
    return {
        callbackUrl: plateform.redirectUrl,
        tokenInfo: {
            name: tokenInfo.token,
            token: tokenInfo.token,
            createdToken: tokenInfo.createdToken,
            expieredToken: tokenInfo.expieredToken,
            userId: tokenInfo.userId,
            platformList: tokenInfo.userInfo.platformList || [],
        }
    };

}