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

import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: "/",
        name: "dashboard",
        meta: {
            layout: "authenticated",
        },
        component: () => import(/* webpackChunkName: "dashboard" */ "../views/dashboard.vue"),
    },
    {
        path: "/setup",
        name: "setup",
        meta: {
            layout: "public",
        },
        component: () => import(/* webpackChunkName: "setup" */ "../views/setup.vue"),
    },
    {
        path: "/login",
        name: "login",
        meta: {
            layout: "public",
        },
        component: () => import(/* webpackChunkName: "login" */ "../views/login.vue"),
    },
    {
        path: "/accessories",
        name: "accessories",
        meta: {
            layout: "authenticated",
        },
        component: () => import(/* webpackChunkName: "accessories" */ "../views/accessories.vue"),
    },
    {
        path: "/log",
        name: "log",
        meta: {
            layout: "authenticated",
        },
        component: () => import(/* webpackChunkName: "log" */ "../views/log.vue"),
    },
    {
        path: "/users",
        name: "users",
        meta: {
            layout: "authenticated",
        },
        component: () => import(/* webpackChunkName: "users" */ "../views/users.vue"),
    },
    {
        path: "/instances",
        name: "instances",
        meta: {
            layout: "authenticated",
        },
        component: () => import(/* webpackChunkName: "instances" */ "../views/instances.vue"),
    },
    {
        path: "/plugins",
        name: "plugins",
        meta: {
            layout: "authenticated",
        },
        component: () => import(/* webpackChunkName: "plugins" */ "../views/plugins.vue"),
    },
    {
        path: "/config",
        name: "config",
        meta: {
            layout: "authenticated",
        },
        component: () => import(/* webpackChunkName: "config" */ "../views/config.vue"),
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
