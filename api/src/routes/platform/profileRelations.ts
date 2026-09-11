import type { SpinalGraph, SpinalNode } from "spinal-env-viewer-graph-service";
import { AUTH_SERVICE_PLATFORM_RELATION_NAME, AUTH_SERVICE_RELATION_TYPE_PTR_LST } from "../../constant";

/** Synchronize profile links, preserving existing profiles and mutation order. */
export async function updateProfileRelations<T extends { platformId: string }>(
	graph: SpinalGraph,
	owner: SpinalNode,
	currentProfiles: SpinalNode[],
	platforms: T[],
	relationName: string,
	getProfileId: (platform: T) => string,
): Promise<void> {
	const profilesToRemove = currentProfiles.filter((profile) => !platforms.some((platform) => getProfileId(platform) === profile.getId().get()));
	const platformsToAdd = platforms.filter((platform) => !currentProfiles.some((profile) => profile.getId().get() === getProfileId(platform)));

	for (const profile of profilesToRemove) {
		await owner.removeChild(profile, relationName, AUTH_SERVICE_RELATION_TYPE_PTR_LST);
	}

	for (const platform of platformsToAdd) {
		const profile = await findPlatformProfile(graph, platform.platformId, getProfileId(platform), relationName);
		await owner.addChild(profile, relationName, AUTH_SERVICE_RELATION_TYPE_PTR_LST);
	}
}

async function findPlatformProfile(graph: SpinalGraph, platformId: string, profileId: string, relationName: string): Promise<SpinalNode> {
	const contexts = await graph.getChildren("hasContext");
	for (const context of contexts) {
		const platforms = await context.getChildren(AUTH_SERVICE_PLATFORM_RELATION_NAME);
		for (const platform of platforms) {
			if (platform.getId().get() !== platformId) continue;

			const profiles = await platform.getChildren(relationName);
			const profile = profiles.find((profile) => profile.getId().get() === profileId);
			if (profile) return profile;
		}
	}
}
