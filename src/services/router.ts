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

import DashboardView from "@/views/dashboard.vue";
import LoginView from "@/views/login.vue";
import AccessoriesView from "@/views/accessories.vue";
import LogView from "@/views/log.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: "/",
        name: "dashboard",
        meta: { layout: "authenticated" },
        component: DashboardView,
    },
    {
        path: "/setup",
        name: "setup",
        meta: { layout: "public" },
        component: () => import(/* webpackChunkName: "setup" */ "../views/setup.vue"),
    },
    {
        path: "/login",
        name: "login",
        meta: { layout: "public" },
        component: LoginView,
    },
    {
        path: "/accessories/:id?/:room?",
        name: "accessories",
        meta: { layout: "authenticated" },
        component: AccessoriesView,
        props: true,
    },
    {
        path: "/log",
        name: "log",
        meta: { layout: "authenticated" },
        component: LogView,
    },
    {
        path: "/users/:id?",
        name: "users",
        meta: { layout: "authenticated" },
        component: () => import(/* webpackChunkName: "users" */ "../views/users.vue"),
        props: true,
    },
    {
        path: "/bridges/:id?",
        name: "bridges",
        meta: { layout: "authenticated" },
        component: () => import(/* webpackChunkName: "bridges" */ "../views/bridges.vue"),
        props: true,
    },
    {
        path: "/plugins/:id?",
        name: "plugins",
        meta: { layout: "authenticated" },
        component: () => import(/* webpackChunkName: "plugins" */ "../views/plugins.vue"),
        props: true,
    },
    {
        path: "/plugin/:scope/:name?",
        name: "plugin",
        meta: { layout: "authenticated" },
        component: () => import(/* webpackChunkName: "plugins" */ "../views/plugin.vue"),
        props: true,
    },
    {
        path: "/config/:scope?/:name?",
        name: "config",
        meta: { layout: "authenticated" },
        component: () => import(/* webpackChunkName: "config" */ "../views/config.vue"),
        props: true,
    },
    {
        path: "/terminal",
        name: "terminal",
        meta: { layout: "authenticated" },
        component: () => import(/* webpackChunkName: "terminal" */ "../views/terminal.vue"),
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
