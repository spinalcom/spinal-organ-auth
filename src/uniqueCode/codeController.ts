import { Body, Controller, Delete, Get, Path, Post, Route, Security } from "tsoa";
import SpinalUniqueCodeService from "./codeService";
import { ICodeResponse, IProfile } from "./code.model";
import { HttpStatusCode } from "../utilities/http-status-code";
import { ICodeToken } from "../tokens/token.model";


const spinalUniqueCodeService = SpinalUniqueCodeService.getInstance();

@Route("codes")
export class UniqueCodeController extends Controller {


    @Security("all")
    @Post("consume/{code}")
    public async consumeCode(@Path() code: string): Promise<ICodeToken | { error: string }> {
        try {
            const token = await spinalUniqueCodeService.consumeCode(code);
            this.setStatus(HttpStatusCode.OK);
            return token;
        } catch (error) {
            this.setStatus(error.code || HttpStatusCode.INTERNAL_SERVER_ERROR);
            return { error: error.message };
        }
    }


    @Security("jwt", ["authAdmin"])
    @Get()
    public async getAllCode(): Promise<ICodeResponse[] | { error: string }> {
        try {
            const codes = await spinalUniqueCodeService.getAllCodes();
            this.setStatus(HttpStatusCode.OK);
            return codes.map((code) => spinalUniqueCodeService.formatCodeNode(code));
        } catch (error) {
            this.setStatus(error.code || HttpStatusCode.INTERNAL_SERVER_ERROR);
            return { error: error.message };
        }
    }

    @Security("jwt", ["authAdmin"])
    @Post("create")
    public async generateCode(@Body() body: { profiles: IProfile | IProfile[], count?: number }): Promise<ICodeResponse[] | { error: string }> {
        try {
            const { profiles, count } = body;
            if (!profiles) {
                this.setStatus(HttpStatusCode.BAD_REQUEST);
                return { error: "Missing parameters profiles" };
            }

            const codes = await spinalUniqueCodeService.generateCode(profiles, count);
            this.setStatus(HttpStatusCode.CREATED);
            return codes.map(code => spinalUniqueCodeService.formatCodeNode(code));

        } catch (error) {
            this.setStatus(error.code || HttpStatusCode.INTERNAL_SERVER_ERROR);
            return { error: error.message };
        }
    }

    @Security("jwt", ["ownData"])
    @Get("/getcode/{code}")
    public async getCode(@Path() code): Promise<ICodeResponse | { error: string }> {
        try {
            const codeNode = await spinalUniqueCodeService.getCode(code);
            if (!codeNode) {
                this.setStatus(HttpStatusCode.NOT_FOUND);
                return { error: "Code not found" };
            }

            this.setStatus(HttpStatusCode.OK);
            return spinalUniqueCodeService.formatCodeNode(codeNode);
        } catch (error) {
            this.setStatus(error.code || HttpStatusCode.INTERNAL_SERVER_ERROR);
            return { error: error.message };
        }
    }

    @Security("jwt", ["authAdmin"])
    @Delete("/delete/{code}")
    public async removeCode(@Path() code: string): Promise<ICodeResponse | { error: string }> {
        try {
            const removed = await spinalUniqueCodeService.removeCode(code);
            if (!removed) {
                this.setStatus(HttpStatusCode.NOT_FOUND);
                return { error: "Code not found" };
            }

            this.setStatus(HttpStatusCode.OK);
            return spinalUniqueCodeService.formatCodeNode(removed);

        } catch (error) {
            this.setStatus(error.code || HttpStatusCode.INTERNAL_SERVER_ERROR);
            return { error: error.message };
        }
    }

    @Security("jwt", ["authAdmin"])
    @Delete("/delete")
    public async removeCodes(@Body() data: { codes: string[] }): Promise<ICodeResponse[] | { error: string }> {
        try {
            const removed = await spinalUniqueCodeService.removeSeveralCodes(data.codes);

            this.setStatus(HttpStatusCode.OK);
            return removed.map(el => spinalUniqueCodeService.formatCodeNode(el));

        } catch (error) {
            this.setStatus(error.code || HttpStatusCode.INTERNAL_SERVER_ERROR);
            return { error: error.message };
        }
    }

}