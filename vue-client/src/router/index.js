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
import CodeUnique from "@/views/CodeUnique";
import NotFound from "@/views/NotFound";

import { isAuthenticate } from "./genToken";

// const authorizationPath = "/authorize";

Vue.use(Router);

const MIN_ROUTE_LOADING_MS = 250;
let routeLoadingTimeout = null;

const routeLoadingState = Vue.observable({
  isLoading: false,
  startedAt: 0,
});

function startRouteLoading() {
  if (routeLoadingTimeout) {
    clearTimeout(routeLoadingTimeout);
    routeLoadingTimeout = null;
  }

  routeLoadingState.startedAt = Date.now();
  routeLoadingState.isLoading = true;
}

function stopRouteLoading() {
  const elapsed = Date.now() - routeLoadingState.startedAt;
  const remaining = Math.max(0, MIN_ROUTE_LOADING_MS - elapsed);

  routeLoadingTimeout = setTimeout(() => {
    routeLoadingState.isLoading = false;
    routeLoadingTimeout = null;
  }, remaining);
}

const routes = [
  { path: "/", name: "Dashboard", component: Dashboard },
  { path: "/UsersList", name: "Users", component: Users },
  { path: "/DetailUser", name: "DetailUser", component: DetailUser },
  { path: "/PlatformsList", name: "Platforms", component: Platforms },
  { path: "/AddPlatform", name: "AddPlatform", component: AddPlatform },
  {
    path: "/DetailPlatform",
    name: "DetailPlatform",
    component: DetailPlatform,
  },
  { path: "/Application", name: "Application", component: Application },
  { path: "/DetailApp", name: "DetailApp", component: DetailApp },
  { path: "/AddUser", name: "AddUser", component: AddUser },
  { path: "/AddApp", name: "AddApp", component: AddApp },
  { path: "/EditApp", name: "EditApp", component: EditApp },
  { path: "/EditUser", name: "EditUser", component: EditUser },
  { path: "/EditPlatform", name: "EditPlatform", component: EditPlatform },
  { path: "/LogsList", name: "Logs", component: Logs },
  { path: "/Login", name: "Login", component: Login },
  { path: "/authorize", name: "Authorize", component: Authorization },
  { path: "/Servers", name: "Servers", component: ServerList },
  { path: "/EditServer", name: "EditServer", component: AddServer },
  { path: "/AddServer", name: "AddServer", component: AddServer },
  { path: "/ServerDetail", name: "ServerDetail", component: ServerDetail },
  { path: "/CodeUnique", name: "CodeUnique", component: CodeUnique },
  { path: "*", name: "NotFound", component: NotFound },
];

const router = new Router({
  routes,
  mode: "history",
});

router.beforeEach(async (to, from, next) => {
  startRouteLoading();

  try {
    const isAuth = await isAuthenticate();
    if (to.name === "Login" && isAuth) return next({ name: "Dashboard" });

    if (!isAuth && !["Login", "Authorize"].includes(to.name)) {
      const fromName = String(from && from.name ? from.name : "").toLowerCase();

      // Avoid redirecting to Login when already on Login (back-button case),
      // otherwise the loader can remain visible due to duplicated navigation.
      if (fromName === "login") {
        stopRouteLoading();
        return next(false);
      }

      return next({ name: "Login" });
    }

    return next();
  } catch (error) {
    stopRouteLoading();
    return next({ name: "Login" });
  }
});

router.afterEach(() => {
  stopRouteLoading();
});

router.onError(() => {
  stopRouteLoading();
});

export default router;
export { router, routeLoadingState };
window.router = router;
