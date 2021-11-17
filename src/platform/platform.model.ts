
import { Model } from 'spinal-core-connectorjs_type';

interface IAppProfile {
  name: string;
  id: string;
}

export interface IApps{
  id:string;
  name: string;
  type: EAppsType
  clientId: string;
  secretId:string;
  appProfiles: IAppProfile[];
}
export enum EAppsType {
  "ApiServer","SpinalTwin"
}

