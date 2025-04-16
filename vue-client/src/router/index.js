/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
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

import Vue from "vue";
import Router from "vue-router";
import Dashboard from "@/views/Dashboard";
import Users from "@/views/Users";
import DetailUser from "@/views/DetailUser";
import Platforms from "@/views/Platforms";
import DetailPlatform from "@/views/DetailPlatform";
import Application from "@/views/Application";
import DetailApp from "@/views/DetailApp";
import AddApp from "@/views/AddApp";
import AddUser from "@/views/AddUser";
import EditApp from "@/views/EditApp";
import EditUser from "@/views/EditUser";
import Logs from "@/views/Logs";
import Login from "@/views/Login";
import EditPlatform from "@/views/EditPlatform";
import AddPlatform from "@/views/AddPlatform";
import Authorization from "@/views/Authorization";

import AddServer from "@/views/AddServer";
import ServerDetail from "@/views/ServerDetail";
import ServerList from "@/views/ServerList";


import { isAuthenticate } from "./genToken";
import path from "path";

// const authorizationPath = "/authorize";

Vue.use(Router);

const routes = [
  { path: "/", name: "Dashboard", component: Dashboard },
  { path: "/Users", name: "Users", component: Users },
  { path: "/DetailUser", name: "DetailUser", component: DetailUser },
  { path: "/PlatformsList", name: "Platforms", component: Platforms },
  { path: "/AddPlatform", name: "AddPlatform", component: AddPlatform },
  { path: "/DetailPlatform", name: "DetailPlatform", component: DetailPlatform },
  { path: "/Application", name: "Application", component: Application },
  { path: "/DetailApp", name: "DetailApp", component: DetailApp },
  { path: "/AddUser", name: "AddUser", component: AddUser },
  { path: "/AddApp", name: "AddApp", component: AddApp },
  { path: "/EditApp", name: "EditApp", component: EditApp },
  { path: "/EditUser", name: "EditUser", component: EditUser },
  { path: "/EditPlatform", name: "EditPlatform", component: EditPlatform },
  { path: "/Logs", name: "Logs", component: Logs },
  { path: "/Login", name: "Login", component: Login },
  { path: "/authorize", name: "Authorize", component: Authorization },
  { path: "/Servers", name: "Servers", component: ServerList },
  { path: "/EditServer", name: "EditServer", component: AddServer },
  { path: "/AddServer", name: "AddServer", component: AddServer },
  { path: "/ServerDetail", name: "ServerDetail", component: ServerDetail },
];


const router = new Router({
  routes,
  mode: "history"
});

router.beforeEach(async (to, from, next) => {
  // const isAuth = await isAuthenticate();
  // if (to.name === "Login" && isAuth) return next({ name: "Dashboard" });
  // if (!isAuth && !["Login", "Authorize"].includes(to.name)) {
  //   return next({ name: "Login" });
  // }

  return next();
});

export default router;
export { router };
window.router = router;