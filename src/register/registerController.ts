/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Query,
  Route,
  Security,
  SuccessResponse,
} from 'tsoa';
import {
  IPlatform,
  IPlateformCreationParams,
  IPlatformUpdateParams,
} from '../platform/platform.model';
import { PlatformService } from '../platform/platformServices';

interface IRegisterParams {
  platformCreationParms: IPlateformCreationParams;
  registerKey: string;
}
interface IUpdateParams {
  platformUpdateParams;
}
@Route('register')
export class RegisterController extends Controller {
  @SuccessResponse('201', 'Created') // Custom success response
  @Post()
  public async registerPlatform(@Body() object: IRegisterParams): Promise<any> {
    let platform = new PlatformService().registerNewPlatform(object);
    this.setStatus(201); // set return status 201rt
    return platform;
  }

  @SuccessResponse('201', 'Updated') // Custom success response
  @Put()
  public async updatePlatform(@Body() object): Promise<any> {
    let platform = new PlatformService().updateNewPlatform(object);
    this.setStatus(201); // set return status 201rt
    return platform;
  }
}

// {
//   "URLBos":"https://api-dev-test-bos-etage26.spinalcom.com",//mon url bos pour verifier
//   "TokenBosAdmin": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF0Zm9ybU5hbWUiOiJib3MgMiB0ZXN0IGhnamhnamhoIiwiaWF0IjoxNjUyMzU2NjkyLCJleHAiOjE2NTI0NDMwOTJ9.KcP1fNxhZgc-8F1TdO_-jr0wn8PqAtv5Fvsuc7vhnX0",
//   "TokenAdminBos": "admin to bos communication token provided by BOS CONFIG",
//   "platformId": "SpinalNode-99483992-372a-c952-2ee4-9d2d8935696a-180b811be52",
//   "idPlatformOfAdmin":"the id of a registered platform provided by the BIOS CONFIG",
//   "jsonData": {
//   "userProfileList": [
//     { "userProfileId": "12368645", "label": "profile11111" },
//     { "userProfileId": "00765001", "label": "profile22222" },
//     { "userProfileId": "86468855", "label": "profile33333" }
//   ],
//   "appProfileList": [
//     { "appProfileId": "4776565588", "label": "appProfile11111" },
//     { "appProfileId": "087JHGJG55", "label": "appProfile22222" },
//     { "appProfileId": "1234JJJJ57", "label": "appProfile33333" }
//   ],
//   "organList": [
//     { "label": "dump manager", "type": "utilities" },
//     { "label": "Forge connector", "type": "connector" },
//     { "label": "bacnetIP connector", "type": "connector" },
//     { "label": "Analytics", "type": "analytics" },
//     { "label": "Export analytics", "type": "analytics" },
//     { "label": "Mission", "type": "connector" },
//     { "label": "API & APP serveur", "type": "graph api" }
//   ]
//   }
// }
