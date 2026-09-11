const assert = require("assert").strict;
const { updateProfileRelations } = require("../src/routes/platform/profileRelations");
const {
	AUTH_SERVICE_APP_PROFILE_RELATION_NAME,
	AUTH_SERVICE_USER_PROFILE_RELATION_NAME,
	AUTH_SERVICE_PLATFORM_RELATION_NAME,
	AUTH_SERVICE_RELATION_TYPE_PTR_LST,
} = require("../src/constant");

function profile(id) {
	return { getId: () => ({ get: () => id }) };
}

for (const [relationName, profileKey, idKey] of [
	[AUTH_SERVICE_USER_PROFILE_RELATION_NAME, "userProfile", "userProfileAdminId"],
	[AUTH_SERVICE_APP_PROFILE_RELATION_NAME, "appProfile", "appProfileAdminId"],
]) {
	describe(`updateProfileRelations (${relationName})`, () => {
		function setup() {
			const removed = profile("removed");
			const kept = profile("kept");
			const added = profile("added");
			const calls = [];
			const graph = {
				async getChildren(relation) {
					assert.equal(relation, "hasContext");
					return [{
						async getChildren(relation) {
							assert.equal(relation, AUTH_SERVICE_PLATFORM_RELATION_NAME);
							return [
								{ ...profile("other-platform"), getChildren() { throw new Error("Wrong platform queried"); } },
								{
									...profile("platform"),
									async getChildren(relation) {
										assert.equal(relation, relationName);
										return [kept, added];
									},
								},
							];
						},
					}];
				},
			};
			const owner = {
				async removeChild(node, relation, type) { calls.push(["remove", node, relation, type]); },
				async addChild(node, relation, type) { calls.push(["add", node, relation, type]); },
			};
			const update = (current, ids) => updateProfileRelations(
				graph, owner, current,
				ids.map((id) => ({ platformId: "platform", [profileKey]: { [idKey]: id } })),
				relationName, (platform) => platform[profileKey][idKey],
			);
			const call = (action, node) => [action, node, relationName, AUTH_SERVICE_RELATION_TYPE_PTR_LST];
			return { removed, kept, added, calls, graph, owner, update, call };
		}

		it("keeps existing links without loading the graph", async () => {
			const f = setup();
			f.graph.getChildren = () => { throw new Error("Unexpected graph read"); };
			await f.update([f.kept], ["kept"]);
			assert.deepEqual(f.calls, []);
		});

		it("removes obsolete links before adding profiles from the requested platform", async () => {
			const f = setup();
			await f.update([f.removed, f.kept], ["kept", "added"]);
			assert.deepEqual(f.calls, [f.call("remove", f.removed), f.call("add", f.added)]);
		});

		it("removes all links when the requested list is empty", async () => {
			const f = setup();
			await f.update([f.removed, f.kept], []);
			assert.deepEqual(f.calls, [f.call("remove", f.removed), f.call("remove", f.kept)]);
		});

		it("adds links when no profiles are currently attached", async () => {
			const f = setup();
			await f.update([], ["added"]);
			assert.deepEqual(f.calls, [f.call("add", f.added)]);
		});

		it("propagates removal failures and stops before adding links", async () => {
			const f = setup();
			const error = new Error("Removal failed");
			f.owner.removeChild = async () => { throw error; };
			await assert.rejects(f.update([f.removed], ["added"]), (caught) => caught === error);
			assert.deepEqual(f.calls, []);
		});

		it("propagates graph read and link creation failures", async () => {
			for (const failure of ["read", "add"]) {
				const f = setup();
				const error = new Error(`${failure} failed`);
				const fail = async () => { throw error; };
				if (failure === "read") f.graph.getChildren = fail;
				else f.owner.addChild = fail;
				await assert.rejects(f.update([], ["added"]), (caught) => caught === error);
			}
		});
	});
}
