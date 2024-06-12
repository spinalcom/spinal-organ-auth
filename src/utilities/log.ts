import { SpinalNode } from "spinal-model-graph";

export async function logNodeTree(node: SpinalNode) {
	const obj = {
		[node.getId().get()]: { name: node.getName().get(), children: [] },
	};

	const queue = [node];

	while (queue.length > 0) {
		const children = await childRec(queue.shift());
		queue.push(...children);
	}

	async function childRec(node: SpinalNode) {
		const children = await node.getChildren();
		const id = node.getId().get();

		const formatChild = children.map((child) => {
			obj[child.getId().get()] = { name: child.getName().get(), children: [] };
			return obj[child.getId().get()];
		});

		obj[id].children = formatChild;
		return children;
	}

	return obj[node.getId().get()];
}
