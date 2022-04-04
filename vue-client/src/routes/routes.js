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

import DashboardLayout from '@/pages/Dashboard/Layout/DashboardLayout.vue';
import AuthLayout from '@/pages/Dashboard/Pages/AuthLayout.vue';

// Dashboard pages
import Dashboard from '@/pages/Dashboard/Dashboard.vue';

// Pages
import User from '@/pages/Dashboard/Pages/UserProfile.vue';
import Pricing from '@/pages/Dashboard/Pages/Pricing.vue';
import TimeLine from '@/pages/Dashboard/Pages/TimeLinePage.vue';
import RtlSupport from '@/pages/Dashboard/Pages/RtlSupport.vue';
import Login from '@/pages/Dashboard/Pages/Login.vue';
import Register from '@/pages/Dashboard/Pages/Register.vue';
import Lock from '@/pages/Dashboard/Pages/Lock.vue';

// Components pages
import Buttons from '@/pages/Dashboard/Components/Buttons.vue';
import GridSystem from '@/pages/Dashboard/Components/GridSystem.vue';
import Panels from '@/pages/Dashboard/Components/Panels.vue';
import SweetAlert from '@/pages/Dashboard/Components/SweetAlert.vue';
import Notifications from '@/pages/Dashboard/Components/Notifications.vue';
import Icons from '@/pages/Dashboard/Components/Icons.vue';
import Typography from '@/pages/Dashboard/Components/Typography.vue';

// Forms pages
import RegularForms from '@/pages/Dashboard/Forms/RegularForms.vue';
import ExtendedForms from '@/pages/Dashboard/Forms/ExtendedForms.vue';
import ValidationForms from '@/pages/Dashboard/Forms/ValidationForms.vue';
import Wizard from '@/pages/Dashboard/Forms/Wizard.vue';

// TableList pages
import RegularTables from '@/pages/Dashboard/Tables/RegularTables.vue';
import ExtendedTables from '@/pages/Dashboard/Tables/ExtendedTables.vue';
import PaginatedTables from '@/pages/Dashboard/Tables/PaginatedTables.vue';

// Maps pages
import GoogleMaps from '@/pages/Dashboard/Maps/GoogleMaps.vue';
import FullScreenMap from '@/pages/Dashboard/Maps/FullScreenMap.vue';
import VectorMaps from '@/pages/Dashboard/Maps/VectorMaps.vue';

import Platforms from '@/pages/Dashboard/Pages/Platforms.vue';
import Alarmes from '@/pages/Dashboard/Pages/Alarmes.vue';
// import Sparkline from "@/pages/Dashboard/Pages/Sparklines.vue";

import Servers from '@/pages/Dashboard/Pages/Servers.vue';
import Users from '@/pages/Dashboard/Pages/Users.vue';
import Application from '@/pages/Dashboard/Pages/Application.vue';
import AddOrgan from '@/pages/Dashboard/Pages/AddOrgan.vue';
// Calendar
import Calendar from '@/pages/Dashboard/Calendar.vue';
// Charts
import Charts from '@/pages/Dashboard/Charts.vue';
import Widgets from '@/pages/Dashboard/Widgets.vue';

// let componentsMenu = {
//   path: '/components',
//   component: DashboardLayout,
//   redirect: '/components/buttons',
//   name: 'Components',
//   children: [
//     {
//       path: 'buttons',
//       name: 'Buttons',
//       components: { default: Buttons },
//     },
//     {
//       path: 'grid-system',
//       name: 'Grid System',
//       components: { default: GridSystem },
//     },
//     {
//       path: 'panels',
//       name: 'Panels',
//       components: { default: Panels },
//     },
//     {
//       path: 'sweet-alert',
//       name: 'Sweet Alert',
//       components: { default: SweetAlert },
//     },
//     {
//       path: 'notifications',
//       name: 'Notifications',
//       components: { default: Notifications },
//     },
//     {
//       path: 'icons',
//       name: 'Icons',
//       components: { default: Icons },
//     },
//     {
//       path: 'typography',
//       name: 'Typography',
//       components: { default: Typography },
//     },
//   ],
// };
// let formsMenu = {
//   path: '/forms',
//   component: DashboardLayout,
//   redirect: '/forms/regular',
//   name: 'Forms',
//   children: [
//     {
//       path: 'regular',
//       name: 'Regular Forms',
//       components: { default: RegularForms },
//     },
//     {
//       path: 'extended',
//       name: 'Extended Forms',
//       components: { default: ExtendedForms },
//     },
//     {
//       path: 'validation',
//       name: 'Validation Forms',
//       components: { default: ValidationForms },
//     },
//     {
//       path: 'wizard',
//       name: 'Wizard',
//       components: { default: Wizard },
//     },
//   ],
// };

// let tablesMenu = {
//   path: '/table-list',
//   component: DashboardLayout,
//   redirect: '/table-list/regular',
//   name: 'Tables',
//   children: [
//     {
//       path: 'regular',
//       name: 'Regular Tables',
//       components: { default: RegularTables },
//     },
//     {
//       path: 'extended',
//       name: 'Extended Tables',
//       components: { default: ExtendedTables },
//     },
//     {
//       path: 'paginated',
//       name: 'Pagianted Tables',
//       components: { default: PaginatedTables },
//     },
//   ],
// };

// let mapsMenu = {
//   path: '/maps',
//   component: DashboardLayout,
//   name: 'Maps',
//   redirect: '/maps/google',
//   children: [
//     {
//       path: 'google',
//       name: 'Google Maps',
//       components: { default: GoogleMaps },
//     },
//     {
//       path: 'full-screen',
//       name: 'Full Screen Map',
//       meta: {
//         hideContent: true,
//         hideFooter: true,
//         navbarAbsolute: true,
//       },
//       components: { default: FullScreenMap },
//     },
//     {
//       path: 'vector-map',
//       name: 'Vector Map',
//       components: { default: VectorMaps },
//     },
//   ],
// };

// let pagesMenu = {
//   path: '/pages',
//   component: DashboardLayout,
//   name: 'Pages',
//   redirect: '/pages/user',
//   children: [
//     {
//       path: 'user',
//       name: 'User Page',
//       components: { default: User },
//     },
//     {
//       path: 'timeline',
//       name: 'Timeline Page',
//       components: { default: TimeLine },
//     },
//     {
//       path: 'rtl',
//       name: 'وحة القيادة',
//       meta: {
//         rtlActive: true,
//       },
//       components: { default: RtlSupport },
//     },
//   ],
// };

let authPages = {
  path: '/',
  component: AuthLayout,
  name: 'Authentication',
  children: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/pricing',
      name: 'Pricing',
      component: Pricing,
    },
    {
      path: '/lock',
      name: 'Lock',
      component: Lock,
    },
  ],
};

const routes = [
  {
    path: '/',
    redirect: '/login',
    name: 'Home',
  },
  // componentsMenu,
  // formsMenu,
  // tablesMenu,
  // mapsMenu,
  // pagesMenu,
  authPages,
  {
    path: '/',
    component: DashboardLayout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        components: { default: Dashboard },
      },
      {
        path: 'alarmes',
        name: 'Alarmes',
        components: { default: Alarmes },
      },
      {
        path: 'platforms',
        name: 'Platforms',
        components: { default: Platforms },
      },
      {
        path: 'servers',
        name: 'Servers',
        components: { default: Servers },
      },
      {
        path: 'users',
        name: 'Users',
        components: { default: Users },
      },
      {
        path: 'AddOrgan',
        name: 'AddOrgan',
        components: { default: AddOrgan },
      },
      {
        path: 'User',
        name: 'User Page',
        components: { default: User },
      },
      {
        path: 'Application',
        name: 'App Page',
        components: { default: Application },
      },
    ],
  },
];
Application;
export default routes;
