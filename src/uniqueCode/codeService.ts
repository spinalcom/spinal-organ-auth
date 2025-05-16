import { SpinalContext, SpinalGraph, SpinalNode } from "spinal-model-graph";
import { ICodeResponse, IProfile } from "./code.model";
import { AUTH_SERVICE_RELATION_TYPE_PTR_LST, AUTH_SERVICE_UNIQUE_CODE_RELATION_NAME, UNIQUE_CODE_CONTEXT_TYPE, UNIQUE_CODE_LIST, UNIQUE_CODE_TYPE } from "../constant";
import { Model, Pbr, Ptr } from "spinal-core-connectorjs";

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

    async generateCode(profiles: IProfile | IProfile[], count: number = 1) {
        if (!count || count < 0) count = 1;
        profiles = Array.isArray(profiles) ? profiles : [profiles];
        if (profiles.length === 0) throw new Error("No profiles provided");

        const codesAlreadyGenerated = await this._getCodesGeneratedFromContextInfo(true);
        const codes = await this._generateUniqueCode(codesAlreadyGenerated, count);

        const promises = codes.map((code) => this.createCodeNode(code, profiles, codesAlreadyGenerated));

        return Promise.all(promises);
    }

    async getAllCodes(): Promise<SpinalNode[]> {
        return this.context.getChildren(AUTH_SERVICE_UNIQUE_CODE_RELATION_NAME);
    }

    async getCode(code: string): Promise<SpinalNode> {
        const codes = await this.getAllCodes();
        return codes.find((codeNode) => {
            const info = codeNode.info.get();
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



    formatCodeNode(codeNode: SpinalNode | SpinalNode[]): ICodeResponse[] {
        codeNode = Array.isArray(codeNode) ? codeNode : [codeNode];
        const info = codeNode.map((node) => ({
            id: node.getId().get(),
            code: node.info.code.get(),
            used: node.info.used.get(),
            createdAt: node.info.createdAt.get(),
            usedAt: node.info.usedAt.get(),
            profiles: node.info.profiles.get()
        }));

        return info;
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

    private async createCodeNode(code: string, profiles: IProfile[], codesAlreadyGenerated: spinal.Model): Promise<SpinalNode> {
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
            const code = generateUniqueId({ length: 10, useLetters: false, useNumbers: true });

            if (!codesAlreadyGenerated[code] && !newCodes[code]) {
                newCodes[code] = true;
                generatedCount++;
            }
        }

        return Object.keys(newCodes);
    }
}