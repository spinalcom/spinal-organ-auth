import { AuthenticateCallback, AuthenticateOptions, Authenticator, DoneCallback } from "passport";
import * as express from "express";
import { Strategy as SamlStrategy, MultiSamlStrategy } from "passport-saml";
import { Profile } from "passport-saml";
import { IPlatform, ISAMLAuthenticationInfo } from "../../routes/platform/platform.model";
import { TokensService } from "../../routes/tokens/tokenService";
import { SpinalNode } from "spinal-model-graph";
import { USER_TYPE } from "../../constant";
import loginService from "../../routes/loginServer/loginServerService";
import { PlatformService } from "../../routes/platform/platformServices";
import { IUserType } from "../../routes/authUser/user.model";
import * as xml2js from "xml2js";

class SpinalPassportSaml extends Authenticator {
	private static _instance: SpinalPassportSaml;
	private samlOptions = {};
	private serverEntityIdToPlatformId = {};

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
		this.use(new MultiSamlStrategy({
			passReqToCallback: true,
			getSamlOptions: this._getSamlOptions.bind(this)
		}, this._verifyWithRequest.bind(this)));
	}


	public auth(strategy: SamlStrategy | string | string[], options: AuthenticateOptions, callback?: AuthenticateCallback) {
		return this.authenticate(strategy, options, callback);
	}

	public async authUser(profile: any, platform: IPlatform) {
		const profileId = Array.isArray(profile.groups) ? profile.groups[0] : profile.groups;

		const userProfile = await PlatformService.getInstance().getUserProfile(platform.id, profileId);

		if (!userProfile) throw new Error(`No profil found for ${profileId}`);

		const tokenData = this._getTokenData(platform.id, profile, userProfile);

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

	private async _getSamlOptions(req: express.Request, done: DoneCallback) {

		const samlResponse = req.body.SAMLResponse;

		if (samlResponse) {
			return this._useSamlResponse(samlResponse, done);
		}

		let serverId: any = req.query.serverId;
		if (!serverId) return done("serverId not found", null);

		const [serverNode] = await loginService.getLoginServer(serverId);
		if (!serverNode) return done("serverId not found", null);

		const server = loginService.formatServerNode(serverNode);
		const serverInfo: ISAMLAuthenticationInfo = server.authentication_info;

		let options = {
			entryPoint: serverInfo.entryPoint,
			issuer: serverInfo.issuer,
			callbackUrl: serverInfo.callbackUrl,
			cert: serverInfo.cert,
			forceAuthn: true,
			disableRequestedAuthnContext: true,
		}

		const serverEntityId = serverInfo.serverEntityId;
		this.samlOptions[serverEntityId] = options;
		this.serverEntityIdToPlatformId[serverEntityId] = req.query.platformId;

		return done(null, options);
	}

	private async _verifyWithRequest(req: express.Request, profile: Profile, done: DoneCallback) {
		const serverEntityId = profile.issuer;
		const platformId = this.serverEntityIdToPlatformId[serverEntityId];

		profile["SAMLResponse"] = req.body.SAMLResponse;

		const platformNode = await PlatformService.getInstance().getPlateformByClientId(platformId);
		const platform = PlatformService.getInstance()._formatPlatform(platformNode);

		const data = { user: this.extractDataFromProfile(profile), platform };

		done(null, data);
	}

	private extractDataFromProfile(profile: Profile) {
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

	private _getTokenData(platformId: string, profile: any, userProfile: SpinalNode) {
		return {
			userId: profile.nameID,
			platformId: platformId,
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
	}

	private async _useSamlResponse(samlResponse: string, done: DoneCallback) {
		try {
			const serverEntityId = await this._getServerEntityIdInResponse(samlResponse);
			let options = this.samlOptions[serverEntityId];

			return done(null, options)
		} catch (error) {
			return done(error, {})
		}
	}

	private _getServerEntityIdInResponse(samlResponse: string): Promise<string> {
		return new Promise((resolve, reject) => {
			const bufferObj = Buffer.from(samlResponse, "base64");
			const xml = bufferObj.toString("utf-8");
			xml2js.parseString(xml, (err, result) => {
				if (err) return reject(err);
				const entityId = result["samlp:Response"].Issuer[0]._;
				resolve(entityId)
			})
		});
	}

	private _extractXmlInfo(data) {
		const entityDescriptor = data.EntityDescriptor || {};
		const entityID = entityDescriptor['$'].entityID;
		const ID = entityDescriptor['$'].ID;

		// Accéder à la signature et au certificat
		const signature = entityDescriptor['Signature'];

		// Accéder à l'élément IDPSSODescriptor
		const idpSSODescriptor = entityDescriptor['IDPSSODescriptor'];
		// Extraire les informations de l'IDPSSODescriptor
		const singleLogoutServices = idpSSODescriptor['SingleLogoutService'];
		const singleSignOnServices = idpSSODescriptor['SingleSignOnService'];

		return {
			entityID,
			ID,
			signature: {
				signatureMethod: signature?.SignedInfo?.SignatureMethod['$']?.Algorithm,
				digestMethod: signature?.SignedInfo?.Reference?.DigestMethod['$']?.Algorithm,
				signatureValue: signature?.SignatureValue,
				x509Certificate: signature['ds:KeyInfo']['ds:X509Data']['ds:X509Certificate']
			},


		}

	}

	private _convertXmlToJSON(xml: string) {
		return new Promise((resolve, reject) => {
			xml2js.parseString(xml, (err, result) => {
				if (err) return reject(err);
				resolve(result);
			})
		});
	}
}

export default SpinalPassportSaml.getInstance();
