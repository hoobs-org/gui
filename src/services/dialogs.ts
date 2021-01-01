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
    {
        name: "alert",
        component: () => import(/* webpackChunkName: "dialog:alert" */ "@/components/dialogs/alert.vue"),
    },
    {
        name: "confirm",
        component: () => import(/* webpackChunkName: "dialog:confirm" */ "@/components/dialogs/confirm.vue"),
    },
    {
        name: "about",
        component: () => import(/* webpackChunkName: "dialog:about" */ "@/components/dialogs/about.vue"),
    },
    {
        name: "updates",
        component: () => import(/* webpackChunkName: "dialog:updates" */ "@/components/dialogs/updates.vue"),
    },
    {
        name: "settings",
        component: () => import(/* webpackChunkName: "dialog:settings" */ "@/components/dialogs/settings.vue"),
    },
    {
        name: "personalize",
        component: () => import(/* webpackChunkName: "dialog:personalize" */ "@/components/dialogs/personalize.vue"),
    },
    {
        name: "dashboard",
        component: () => import(/* webpackChunkName: "dialog:dashboard" */ "@/components/dialogs/dashboard.vue"),
    },
    {
        name: "instances",
        component: () => import(/* webpackChunkName: "dialog:instances" */ "@/components/dialogs/instances.vue"),
    },
    {
        name: "plugin",
        component: () => import(/* webpackChunkName: "dialog:instances" */ "@/components/dialogs/plugin.vue"),
    },
]);
