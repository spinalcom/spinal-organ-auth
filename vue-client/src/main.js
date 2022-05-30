/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
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

// =========================================================
// * Vue Material Dashboard PRO - v1.4.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vue-material-dashboard-pro
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
const TOKEN = 'token';

import Vue from 'vue';
import VueRouter from 'vue-router';
import DashboardPlugin from './material-dashboard';

import Sparkline from 'vue-sparklines';
// Plugins
import App from './App.vue';
import Chartist from 'chartist';

// router setup
import routes from './routes/routes';

// plugin setup
Vue.use(VueRouter);
Vue.use(DashboardPlugin);
Vue.use(Sparkline);

// configure router
const router = new VueRouter({
  mode: 'history',
  routes, // short for routes: routes
  scrollBehavior: (to) => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  },
  linkExactActiveClass: 'nav-item active',
});
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem(TOKEN);
  if (to.name !== 'Login' && token === null) next({ name: 'Login' });
  else next();
});
// global library setup
Vue.prototype.$Chartist = Chartist;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: (h) => h(App),
  router,
});
