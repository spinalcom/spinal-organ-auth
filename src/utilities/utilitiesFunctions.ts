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
import { spinalCore, FileSystem, Model, File } from "spinal-core-connectorjs_type";

export function store(fs: FileSystem, model: spinal.Model, path: string, callback_success, callback_error) {
	if (typeof callback_error === "undefined") {
		callback_error = () => {
			console.log("Model could not be stored. You can pass a callback to handle this error.");
		};
	}

	try {
		let lst = path.split("/").filter((x) => !!x);
		let fileName = lst.pop();

		path = lst.join("/");

		WaitModelReady().then((result) => {
			fs.load_or_make_dir(path, (dir) => {
				const file = new File(fileName, model, { model_type: "AuthModel" });
				dir.push(file);
				callback_success();
			});
		});
	} catch (error) {
		callback_error();
	}

	// const home_dir = fs._home_dir;

	// // @ts-ignore
	// fs.load_or_make_dir(home_dir + path, (dir, err) => {
	// 	if (err) callback_error(err);
	// 	else {
	// 		let file = dir.detect((x) => {
	// 			return x.name.get() === fileName;
	// 		});
	// 		if (file) {
	// 			dir.remove(file);
	// 		}
	// 		dir.add_file(fileName, model, { model_type: "AuthModel" }); // CHANGE HERE
	// 		callback_success();
	// 	}
	// });
}

export function regenerateKey(type, ask = true) {
	let r = true;
	if (ask) r = confirm("Are you sure you want to generate a new secret? All clients using this key will stop working.");
	if (r === true) {
		let length = 64,
			charset = "abcdef0123456789",
			retVal = "";
		for (var i = 0, n = charset.length; i < length; ++i) {
			retVal += charset.charAt(Math.floor(Math.random() * n));
		}

		return retVal;
	}
}

export function WaitModelReady(): Promise<any> {
	const WaitModelReadyLoop = (resolve, reject) => {
		if (FileSystem._sig_server === false) {
			setTimeout(() => {
				WaitModelReadyLoop(resolve, reject);
			}, 200);
		} else {
			resolve();
		}
	};

	return new Promise((resolve, reject) => {
		WaitModelReadyLoop(resolve, reject);
	});
}
