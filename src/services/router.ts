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
        meta: { layout: "authenticated" },
        component: () => import(/* webpackChunkName: "view-dashboard" */ "../views/dashboard.vue"),
    },
    {
        path: "/setup",
        name: "setup",
        meta: { layout: "public" },
        component: () => import(/* webpackChunkName: "view-setup" */ "../views/setup.vue"),
    },
    {
        path: "/login",
        name: "login",
        meta: { layout: "public" },
        component: () => import(/* webpackChunkName: "view-login" */ "../views/login.vue"),
    },
    {
        path: "/accessories/:id?/:room?",
        name: "accessories",
        meta: { layout: "authenticated" },
        component: () => import(/* webpackChunkName: "view-accessories" */ "../views/accessories.vue"),
        props: true,
    },
    {
        path: "/log",
        name: "log",
        meta: { layout: "authenticated" },
        component: () => import(/* webpackChunkName: "view-log" */ "../views/log.vue"),
    },
    {
        path: "/users/:id?",
        name: "users",
        meta: { layout: "authenticated" },
        component: () => import(/* webpackChunkName: "view-users" */ "../views/users.vue"),
        props: true,
    },
    {
        path: "/bridges/:id?",
        name: "bridges",
        meta: { layout: "authenticated" },
        component: () => import(/* webpackChunkName: "view-bridges" */ "../views/bridges.vue"),
        props: true,
    },
    {
        path: "/plugins/:id?",
        name: "plugins",
        meta: { layout: "authenticated" },
        component: () => import(/* webpackChunkName: "view-plugins" */ "../views/plugins.vue"),
        props: true,
    },
    {
        path: "/plugin/:scope/:name?",
        name: "plugin",
        meta: { layout: "authenticated" },
        component: () => import(/* webpackChunkName: "view-plugin" */ "../views/plugin.vue"),
        props: true,
    },
    {
        path: "/config/:scope?/:name?",
        name: "config",
        meta: { layout: "authenticated" },
        component: () => import(/* webpackChunkName: "view-config" */ "../views/config.vue"),
        props: true,
    },
    {
        path: "/terminal",
        name: "terminal",
        meta: { layout: "authenticated" },
        component: () => import(/* webpackChunkName: "view-terminal" */ "../views/terminal.vue"),
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
