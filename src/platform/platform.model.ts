/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
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

import { Model } from "spinal-core-connectorjs_type";
import { IOrgan } from "../organ/organ.model";

export interface IPlatform {
	id: string;
	name: string;
	type: string;
	statusPlatform: statusPlatform;
	url: string;
	address?: string;
	TokenBosAdmin?: string;
	TokenAdminBos?: string;
	idPlatformOfAdmin?: string;
	redirectUrl: string;
	clientId: string;
	// clientSecret: string;
}

export interface IPlateformCreationParams {
	name: string;
	type?: string;
	redirectUrl: string;
	url?: string;
	clientId: string;
	clientSecret: string;
	[key: string]: any;
	statusPlatform?: statusPlatform;
	address?: string;
	// TokenBosAdmin?: string;
	// TokenAdminBos?: string;
	// idPlatformOfAdmin?: string;
}

export interface IPlatformUpdateParams {
	name?: string;
	redirectUrl?: string;
	url?: string;
	address?: string;
}
// export interface IRegisterParams {
// 	platformCreationParms: IPlateformCreationParams;
// 	registerKey: string;
// }

export interface IRegisterParams {
	clientId: string;
	clientSecret: string;
	platformCreationParms: IPlateformCreationParams;
}

export interface IRegisterKeyObject {
	id: string;
	name: string;
	type: string;
	value: string;
}

export enum statusPlatform {
	connected = "connected",
	"not connected" = "not connected",
	// "online" = "online",
	// "fail" = "fail",
	// "stop" = "stop",
	// "not registered" = "not registered",
}

export interface IPlatformLogs {
	id: string;
	name: string;
	type: string;
	date: string;
	message: string;
	actor: {
		actorId: string;
		actorName: string;
	};
}
