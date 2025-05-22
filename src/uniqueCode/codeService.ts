import { SpinalContext, SpinalGraph, SpinalNode } from "spinal-model-graph";
import { ICodeResponse, IProfile, isIUserProfileBase } from "./code.model";
import { APPLICATION_LOG_CATEGORY_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST, AUTH_SERVICE_UNIQUE_CODE_RELATION_NAME, EVENTS_NAMES, EVENTS_REQUEST_NAMES, UNIQUE_CODE_CONTEXT_TYPE, UNIQUE_CODE_LIST, UNIQUE_CODE_TYPE } from "../constant";
import { Model, Pbr, Ptr } from "spinal-core-connectorjs";
import { ProfileServices } from "../platform/profileServices";
import { AuthError } from "../security/AuthError";
import { HttpStatusCode } from "../utilities/http-status-code";
import { IApplicationToken, ICodeToken, IToken } from "../tokens/token.model";
import { TokensService } from "../tokens/tokenService";
import { LogsService } from "../logs/logService";

const generateUniqueId = require("generate-unique-id");

export default class SpinalUniqueCodeService {
    private static _instance: SpinalUniqueCodeService;
    private context: SpinalContext;

    private constructor() { }

    static getInstance(): SpinalUniqueCodeService {
        if (!this._instance) {
            this._instance = new SpinalUniqueCodeService();
        }
        return this._instance;
    }

    async init(graph: SpinalGraph): Promise<SpinalContext> {
        let context = await graph.getContext(UNIQUE_CODE_LIST);

        if (!context) {
            context = await graph.addContext(new SpinalContext(UNIQUE_CODE_LIST, UNIQUE_CODE_CONTEXT_TYPE));
        }

        this.context = context;
        return context;
    }


    async consumeCode(code: string): Promise<ICodeToken> {
        const codeNode = await this.getCode(code, true);
        if (!codeNode) throw new AuthError(HttpStatusCode.NOT_FOUND, `Code not found`);
        if (codeNode.info.used.get()) throw new AuthError(HttpStatusCode.BAD_REQUEST, `Code already used`);


        const codeFormatted = this.formatCodeNode(codeNode);
        const platformList = codeFormatted.profiles;
        const info = {
            code: codeFormatted.code,
            id: codeFormatted.id,
        }


        const tokenNode = await TokensService.getInstance().createToken(codeNode, info, platformList, "code");
        await LogsService.getInstance().createLog(codeNode, APPLICATION_LOG_CATEGORY_NAME, EVENTS_NAMES.CONNECTION, EVENTS_REQUEST_NAMES.LOGIN_VALID, EVENTS_REQUEST_NAMES.LOGIN_VALID);

        codeNode.info.mod_attr("used", true);
        codeNode.info.mod_attr("usedAt", Date.now());

        return {
            name: tokenNode.getName().get(),
            type: tokenNode.getType().get(),
            token: tokenNode.info.token?.get(),
            createdToken: tokenNode.info.createdToken?.get(),
            expieredToken: tokenNode.info.expieredToken?.get(),
            applicationId: codeNode.getId().get(),
            userId: codeNode.getId().get(),
            platformList,
        };
    }


    async generateCode(profiles: IProfile | IProfile[], count: number = 1) {
        if (!count || count < 0) count = 1;
        profiles = Array.isArray(profiles) ? profiles : [profiles];
        if (profiles.length === 0) throw new Error("No profiles provided");

        const { invalids, valids } = await this._checkIfProfilesAreValid(profiles);

        if (invalids.length > 0) {
            throw new AuthError(HttpStatusCode.BAD_REQUEST, `Invalid profiles: ${JSON.stringify(invalids)}`);
        }

        const codesAlreadyGenerated = await this._getCodesGeneratedFromContextInfo(true);
        const codes = await this._generateUniqueCode(codesAlreadyGenerated, count);

        const promises = codes.map((code) => this.createCodeNode(code, valids, codesAlreadyGenerated));

        return Promise.all(promises);
    }

    async getAllCodes(): Promise<SpinalNode[]> {
        return this.context.getChildren(AUTH_SERVICE_UNIQUE_CODE_RELATION_NAME);
    }

    async getCode(code: string, onlyByCode: boolean = false): Promise<SpinalNode> {
        const codes = await this.getAllCodes();
        return codes.find((codeNode) => {
            const info = codeNode.info.get();
            if (onlyByCode) return info.code == code;

            return info.code == code || info.id == code || info.name == code;
        });
    }

    async removeCode(code: string): Promise<SpinalNode> {
        const codeNode = await this.getCode(code);
        if (!codeNode) return;


        await this.context.removeChild(codeNode, AUTH_SERVICE_UNIQUE_CODE_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST);
        await this._removeCodesGeneratedFromContextInfo(codeNode.info.code.get());
        return codeNode;
    }

    async removeSeveralCodes(codes: string[]): Promise<SpinalNode[]> {
        const codeNodes = codes.map(code => this.removeCode(code));
        return Promise.all(codeNodes);
    }

    formatCodeNode(node: SpinalNode): ICodeResponse {
        return {
            id: node.getId().get(),
            code: node.info.code.get(),
            used: node.info.used.get(),
            createdAt: node.info.createdAt.get(),
            usedAt: node.info.usedAt.get(),
            profiles: node.info.profiles.get()
        }
    }



    //////////////////////////////// PRIVATE METHODS ////////////////////////////////

    private async _getCodesGeneratedFromContextInfo(createIt: boolean = false): Promise<spinal.Model> {
        return new Promise((resolve) => {

            if (this.context.info.codes) {
                this.context.info.codes.load((codes) => resolve(codes));
                return;
            }

            if (!createIt) return resolve(null);

            // If no codes exist, create a new model
            const codes = new Model({});
            this.context.info.add_attr({ codes: new Ptr(codes) });

            return resolve(codes);
        });
    }

    private async _removeCodesGeneratedFromContextInfo(code: string): Promise<boolean> {
        const codes = await this._getCodesGeneratedFromContextInfo();
        if (codes) {
            codes.rem_attr(code);
            return true;
        }

        return false;

    }

    private async createCodeNode(code: string, profiles: any[], codesAlreadyGenerated: spinal.Model): Promise<SpinalNode> {
        const node = new SpinalNode(code, UNIQUE_CODE_TYPE);
        node.info.add_attr({
            code,
            used: false,
            createdAt: Date.now(),
            usedAt: -1,
            profiles
        });

        await this.context.addChildInContext(node, AUTH_SERVICE_UNIQUE_CODE_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST, this.context);
        codesAlreadyGenerated.add_attr({ [code]: new Pbr(node) });
        return node;
    }

    private async _generateUniqueCode(codesAlreadyGenerated: { [key: string]: any }, count: number = 1): Promise<string[]> {
        const newCodes = {};
        let generatedCount = 0;

        while (generatedCount < count) {
            const code = generateUniqueId({ length: 10, useLetters: true, useNumbers: true });

            if (!codesAlreadyGenerated[code] && !newCodes[code]) {
                newCodes[code] = true;
                generatedCount++;
            }
        }

        return Object.keys(newCodes);
    }

    private async _checkIfProfilesAreValid(profiles: IProfile | IProfile[]): Promise<{ valids: (ICodeResponse["profiles"])[], invalids: IProfile[] }> {
        profiles = Array.isArray(profiles) ? profiles : [profiles];
        const result = { valids: [], invalids: [] };

        for (const element of profiles) {
            const profileId = isIUserProfileBase(element) ? element.userProfileId : element.appProfileId;

            const found = await ProfileServices.getInstance().findProfile(element.platformId, profileId);
            if (found) result.valids.push(found);
            else result.invalids.push(element);
        }

        return result;
    }

}