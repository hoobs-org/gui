/**************************************************************************************************
 * hoobs-gui                                                                                      *
 * Copyright (C) 2020 HOOBS                                                                       *
 *                                                                                                *
 * This program is free software: you can redistribute it and/or modify                           *
 * it under the terms of the GNU General Public License as published by                           *
 * the Free Software Foundation, either version 3 of the License, or                              *
 * (at your option) any later version.                                                            *
 *                                                                                                *
 * This program is distributed in the hope that it will be useful,                                *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of                                 *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the                                  *
 * GNU General Public License for more details.                                                   *
 *                                                                                                *
 * You should have received a copy of the GNU General Public License                              *
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.                          *
 **************************************************************************************************/

import Dialogs from "../plugins/dialogs";

export default new Dialogs([
    { name: "alert", component: () => import(/* webpackChunkName: "common" */ "@/components/dialogs/alert.vue") },
    { name: "confirm", component: () => import(/* webpackChunkName: "common" */ "@/components/dialogs/confirm.vue") },
    { name: "about", component: () => import(/* webpackChunkName: "common" */ "@/components/dialogs/about.vue") },
    { name: "updates", component: () => import(/* webpackChunkName: "common" */ "@/components/dialogs/updates.vue") },
    { name: "settings", component: () => import(/* webpackChunkName: "config" */ "@/components/dialogs/settings.vue") },
    { name: "network", component: () => import(/* webpackChunkName: "config" */ "@/components/dialogs/network.vue") },
    { name: "personalize", component: () => import(/* webpackChunkName: "layout" */ "@/components/dialogs/personalize.vue") },
    { name: "dashboard", component: () => import(/* webpackChunkName: "common" */ "@/components/dialogs/dashboard.vue") },
    { name: "bridges", component: () => import(/* webpackChunkName: "plugins" */ "@/components/dialogs/bridges.vue") },
    { name: "plugin", component: () => import(/* webpackChunkName: "plugins" */ "@/components/dialogs/plugin.vue") },
    { name: "accessory", component: () => import(/* webpackChunkName: "common" */ "@/components/dialogs/accessory.vue") },
    { name: "hidden", component: () => import(/* webpackChunkName: "common" */ "@/components/dialogs/hidden.vue") },
    { name: "cache", component: () => import(/* webpackChunkName: "common" */ "@/components/dialogs/cache.vue") },
]);
