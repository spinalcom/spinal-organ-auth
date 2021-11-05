import { Model } from 'spinal-core-connectorjs_type';

export interface AuthBuilding {
  id? :string;
  name? :string;
  type? :string;
  apps: string[]
}


export interface AppProfile{
  id: string;
  label:string;

}