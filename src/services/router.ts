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

import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Dashboard",
        component: () => import(/* webpackChunkName: "dashboard" */ "../views/dashboard.vue"),
    },
    {
        path: "/accessories",
        name: "Accessories",
        component: () => import(/* webpackChunkName: "accessories" */ "../views/accessories.vue"),
    },
    {
        path: "/log",
        name: "Log",
        component: () => import(/* webpackChunkName: "log" */ "../views/log.vue"),
    },
    {
        path: "/instances",
        name: "Instances",
        component: () => import(/* webpackChunkName: "instances" */ "../views/instances.vue"),
    },
    {
        path: "/plugins",
        name: "Plugins",
        component: () => import(/* webpackChunkName: "plugins" */ "../views/plugins.vue"),
    },
    {
        path: "/config",
        name: "Config",
        component: () => import(/* webpackChunkName: "config" */ "../views/config.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
