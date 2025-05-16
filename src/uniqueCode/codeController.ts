import { Body, Controller, Delete, Get, Path, Post, Route, Security } from "tsoa";
import SpinalUniqueCodeService from "./codeService";
import { ICodeResponse, IProfile } from "./code.model";
import { HttpStatusCode } from "../utilities/http-status-code";


const spinalUniqueCodeService = SpinalUniqueCodeService.getInstance();

@Route("codes")
export class UniqueCodeController extends Controller {


    @Security("jwt", ["authAdmin"])
    @Get()
    public async getAllCode(): Promise<ICodeResponse[] | { error: string }> {
        try {
            const codes = await spinalUniqueCodeService.getAllCodes();
            this.setStatus(HttpStatusCode.OK);
            return spinalUniqueCodeService.formatCodeNode(codes);
        } catch (error) {
            this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
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

            const code = await spinalUniqueCodeService.generateCode(profiles, count);
            this.setStatus(HttpStatusCode.CREATED);
            return spinalUniqueCodeService.formatCodeNode(code);

        } catch (error) {
            this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
            return { error: error.message };
        }
    }

    @Security("jwt", ["authAdmin"])
    @Get("/getcode/{code}")
    public async getCode(@Path() code): Promise<ICodeResponse | { error: string }> {
        try {
            const codeNode = await spinalUniqueCodeService.getCode(code);
            if (!codeNode) {
                this.setStatus(HttpStatusCode.NOT_FOUND);
                return { error: "Code not found" };
            }

            this.setStatus(HttpStatusCode.OK);
            const codeFormatted = spinalUniqueCodeService.formatCodeNode(codeNode);
            return codeFormatted[0];
        } catch (error) {
            this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
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
            const codeFormatted = spinalUniqueCodeService.formatCodeNode(removed);
            return codeFormatted[0];

        } catch (error) {
            this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
            return { error: error.message };
        }
    }

    @Security("jwt", ["authAdmin"])
    @Delete("/delete")
    public async removeCodes(@Body() data: { codes: string[] }): Promise<ICodeResponse[] | { error: string }> {
        try {
            const removed = await spinalUniqueCodeService.removeSeveralCodes(data.codes);

            const codeFormatted = spinalUniqueCodeService.formatCodeNode(removed);
            this.setStatus(HttpStatusCode.OK);
            return codeFormatted;

        } catch (error) {
            this.setStatus(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
            return { error: error.message };
        }
    }

}