import { AuthenticateCallback, AuthenticateOptions, Authenticator, DoneCallback } from "passport";
import * as express from "express";
import { Strategy as SamlStrategy, MultiSamlStrategy } from "passport-saml";
import { Profile } from "passport-saml";
import { SamlOptions } from "passport-saml/lib/node-saml/types";
import { IPlatform, ISAMLAuthenticationInfo } from "../../routes/platform/platform.model";
import { TokensService } from "../../routes/tokens/tokenService";
import { SpinalNode } from "spinal-model-graph";
import { AUTH_SERVICE_USER_PROFILE_RELATION_NAME, AUTH_SERVICE_USER_RELATION_NAME, CONNECTION_METHODS, TOKEN_TYPE, USER_PROFILE_TYPE, USER_TYPE } from "../../constant";
import jwt_decode from "jwt-decode";
import loginService from "../../routes/loginServer/loginServerService";
import { PlatformService } from "../../routes/platform/platformServices";
import { name } from "ejs";
import { IUserType } from "../../routes/authUser/user.model";

class SpinalPassportSaml extends Authenticator {
	private static _instance: SpinalPassportSaml;
	private samlOptions = {};
	private sessionIdToPlatformId = {};

	private constructor() {
		super();
		this.serializeUser((user, done) => done(null, user));
		this.deserializeUser((user, done) => done(null, user));
		this.useMultiSamlStrategy();
	}

	static getInstance(): SpinalPassportSaml {
		if (!this._instance) this._instance = new SpinalPassportSaml();
		return this._instance;
	}

	public useMultiSamlStrategy() {
		this.use(new MultiSamlStrategy({ passReqToCallback: true, getSamlOptions: this.getSamlOptions.bind(this) }, this.verifyWithRequest.bind(this)));
	}

	public async getSamlOptions(req: express.Request, done: DoneCallback) {
		let serverId: any = req.query.serverId;

		let options = this.samlOptions[(<any>req).sessionID];

		if (!options) {
			const [serverNode] = await loginService.getLoginServer(serverId);
			if (serverNode) {
				const sessionID = (<any>req).sessionID;

				const server = loginService.formatServerNode(serverNode);
				const serverInfo: ISAMLAuthenticationInfo = server.authentication_info;

				options = {
					entryPoint: serverInfo.entryPoint,
					issuer: serverInfo.issuer,
					callbackUrl: serverInfo.callbackUrl,
					cert: serverInfo.cert
				}
				// console.log("options.cert", options.cert)

				this.samlOptions[sessionID] = options;

				this.sessionIdToPlatformId[sessionID] = req.query.platformId;
			}
		};


		let err = options ? null : "server not found";
		return done(err, options);
	}

	public async verifyWithRequest(req: express.Request, profile: Profile, done: DoneCallback) {
		const sessionID = (<any>req).sessionID;
		const platformId = this.sessionIdToPlatformId[sessionID];

		profile["SAMLResponse"] = req.body.SAMLResponse;

		const platformNode = await PlatformService.getInstance().getPlateformByClientId(platformId);
		const platform = PlatformService.getInstance()._formatPlatform(platformNode);

		const data = { user: this.extractDataFromProfile(profile), platform };

		done(null, data);
	}

	public auth(strategy: SamlStrategy | string | string[], options: AuthenticateOptions, callback?: AuthenticateCallback) {
		return this.authenticate(strategy, options, callback)
	}

	public async authUser(profile: any, platform: IPlatform) {
		const userProfile = await PlatformService.getInstance().getUserProfile(platform.id, profile.groups);
		const tokenData = {
			userId: profile.nameID,
			platformId: platform.id,
			profile: {
				userProfileName: userProfile.getName().get(),
				userProfileBosConfigId: userProfile.info.userProfileId?.get()
			},
			userInfo: {
				id: profile.nameID,
				type: USER_TYPE,
				name: profile.name || profile.nameID,
				userName: profile.nameID,
				// password: profile.info.password.get(),
				email: profile.nameID,
				telephone: "",
				info: "",
				userType: IUserType["Simple User"],
			}
		}

		const tokenNode = await TokensService.getInstance().createSamlToken(tokenData, platform);

		return {
			name: tokenNode.getName().get(),
			token: tokenNode.info.token.get(),
			createdToken: tokenNode.info.createdToken.get(),
			expieredToken: tokenNode.info.expieredToken.get(),
			userId: tokenNode.info.userId?.get(),
			platformList: tokenNode.info.platformList?.get() || [],
		}
	}

	private extractDataFromProfile(profile: Profile) {
		// return profile

		const data = {
			nameID: profile.nameID,
			issuer: profile.issuer,
			SAMLResponse: profile.SAMLResponse
		};

		for (const key in ((profile as any)?.attributes || {})) {
			if (Object.prototype.hasOwnProperty.call(((profile as any)?.attributes || {}), key)) {
				const value = ((profile as any)?.attributes || {})[key];
				const keySplitted = key.split("/")
				const dataKey = keySplitted[keySplitted.length - 1];
				data[dataKey] = value;
			}
		}

		return data;
	}



	// 	useSamlStrategy(req: express.Request, res: express.Response, next: express.NextFunction): void {
	// 		const options = {
	// 			entryPoint: "https://login.microsoftonline.com/a9d85645-f091-44b2-839b-e1df301686f4/saml2",
	// 			issuer: "spinalcom-lodh-sandbox",
	// 			callbackUrl: "http://localhost/",
	// 			cert: `-----BEGIN CERTIFICATE-----
	// MIIC8DCCAdigAwIBAgIQF9cCi/5cXqFEiaqEMcKZSzANBgkqhkiG9w0BAQsFADA0MTIwMAYDVQQD
	// EylNaWNyb3NvZnQgQXp1cmUgRmVkZXJhdGVkIFNTTyBDZXJ0aWZpY2F0ZTAeFw0yNDA3MDQwODQx
	// NTdaFw0yNzA3MDQwODQxNTZaMDQxMjAwBgNVBAMTKU1pY3Jvc29mdCBBenVyZSBGZWRlcmF0ZWQg
	// U1NPIENlcnRpZmljYXRlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0s7ClCnDu+5q
	// VUGyTkxsInzqTSfHpCSzfoNbfjcD4sh81Rx2MfgVY8OXclb/gp+hx3LkEsw+AZG4coYbzP8TIsIC
	// YiqrjMR1Sm0FNIFj/fvui3tFekEPrxQKn0ibTfjP8QBw7XbMPbKcdDEduGxSfIWgD11jW/WGmNK2
	// i35SyprWveVlVWpUzpXxh9asu02B9z1knwoBv2Rt4xU4t2mz0QUH3hnJew5lkVCfU09LsbZfpEYV
	// ujgFqLa6sTdzIuqX5k9GLg9w74/2yMNSDMNKVdXv7LcuOToWTtm+mBanwEDTsrfsawk1w6AQyyJI
	// cCxMalkUog5hNqSueULRPsztuQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQAhZMq2GzeTRORPeqEQ
	// tRa3wRNJsORHzCZBqOn1lmMDSz2sTM33fzEJXH+k0sTy99ReVwbKBn+rCEpZemUSYFLfh/3+gqed
	// T/i4JAysiNvvvlBYuLDlZUxTrIHN7/Ckfyxfd5L+JYXRxBzGqeoaIsdEVtpriXKAB1ve6+3Uk7vq
	// MawUeTKazP/5e3R3SKQr0m+QDbtU1B6X2Whk1V1s+rwXfYMlORfQuaovOD8DHyXyLtDBNn8kyXQo
	// 5Iz5TVpqPOBQCLB4a4/2XA5h85OSYxXdUyGvWWjCglnCH91XE1WqbbpyybmzxZ+fMCYClzVuRRgb
	// sswDQNy5USfALacrMt+A
	// -----END CERTIFICATE-----`,
	// 		};

	// 		// @ts-ignore
	// 		this.use(
	// 			new SamlStrategy(options, (profile, done) => {
	// 				console.log("profile", profile);
	// 				// @ts-ignore
	// 				return done(null, profile);
	// 			})
	// 		);

	// 		next();
	// 	}
}

export default SpinalPassportSaml.getInstance();
