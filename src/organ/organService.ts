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

import { AUTH_SERVICE_ORGAN_RELATION_NAME, ORGAN_TYPE, PLATFORM_LIST, AUTH_SERVICE_RELATION_TYPE_PTR_LST, AUTH_SERVICE_PLATFORM_RELATION_NAME } from "../constant";
import { SpinalGraphService, SpinalGraph, SpinalNode, SpinalContext } from "spinal-env-viewer-graph-service";
import { OperationError } from "../utilities/operation-error";
import { HttpStatusCode } from "../utilities/http-status-code";
import { IOrganCreationParams, IOrganUpdateParams, IOrgan } from "./organ.model";
import SpinalMiddleware from "../spinalMiddleware";
import { PlatformService } from "../platform/platformServices";

export class OrganService {
	public context: SpinalContext<any>;
	static instance: OrganService;

	private constructor() {}

	static getInstance() {
		if (!this.instance) this.instance = new OrganService();
		return this.instance;
	}

	public async createOrgan(organCreationParms: IOrganCreationParams): Promise<IOrgan> {
		const platformService = PlatformService.getInstance();
		const platformContext = await platformService.getContext();
		const [platform] = await platformService.getPlatformsNodes(organCreationParms.platformId);

		const organNode = new SpinalNode(organCreationParms.name, ORGAN_TYPE);

		organNode.info.add_attr({
			organType: organCreationParms.organType,
			statusOrgan: "",
			platformId: organCreationParms.platformId,
		});

		const res = await platform.addChildInContext(organNode, AUTH_SERVICE_ORGAN_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST, platformContext);

		return this._formatOrgan(res);
	}

	public async getOrgans(platformId: string): Promise<IOrgan[]> {
		try {
			const [platform] = await PlatformService.getInstance().getPlatformsNodes(platformId);
			const organs = await platform.getChildren(AUTH_SERVICE_ORGAN_RELATION_NAME);

			return organs.map((organ) => this._formatOrgan(organ));
		} catch (error) {
			return error;
		}
	}

	public async getOrgan(platformId: string, organId: string): Promise<IOrgan> {
		const [platform] = await PlatformService.getInstance().getPlatformsNodes(platformId);
		const organs = await platform.getChildren(AUTH_SERVICE_ORGAN_RELATION_NAME);
		const organ = organs.find((organ) => organ.getId().get() === organId);

		if (!organ) throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
		return this._formatOrgan(organ);
	}

	public async updateOrgan(organId: string, requestBody: IOrganUpdateParams): Promise<IOrgan> {
		const [platform] = await PlatformService.getInstance().getPlatformsNodes(organId);
		const organs = await platform.getChildren(AUTH_SERVICE_ORGAN_RELATION_NAME);
		const organ = organs.find((organ) => organ.getId().get() === organId);

		if (!organ) throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);
		organ.info.name.set(requestBody.name);
		organ.info.organType.set(requestBody.organType);
		organ.info.statusOrgan.set(requestBody.statusOrgan);

		return this._formatOrgan(organ);
	}

	public async deleteOrgan(platformId: string, organId: string): Promise<void> {
		const [platform] = await PlatformService.getInstance().getPlatformsNodes(platformId);
		const organs = await platform.getChildren(AUTH_SERVICE_ORGAN_RELATION_NAME);
		const organ = organs.find((organ) => organ.getId().get() === organId);

		if (!organ) throw new OperationError("NOT_FOUND", HttpStatusCode.NOT_FOUND);

		return organ.removeFromGraph();
	}

	private _formatOrgan(organ: SpinalNode): IOrgan {
		return {
			id: organ.getId().get(),
			name: organ.getName().get(),
			type: organ.getType().get(),
			statusOrgan: organ.info.statusOrgan.get(),
			organType: organ.info.organType.get(),
			platformId: organ.info.platformId.get(),
		};
	}
}
