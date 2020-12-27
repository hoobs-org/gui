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

import Menus from "../plugins/menus";

export default new Menus([
    {
        name: "application",
        component: () => import(/* webpackChunkName: "menu:application" */ "@/components/menus/application.vue"),
    },
    {
        name: "notifications",
        component: () => import(/* webpackChunkName: "menu:notifications" */ "@/components/notifications.vue"),
    },
    {
        name: "instances",
        component: () => import(/* webpackChunkName: "menu:instances" */ "@/components/menus/instances.vue"),
    },
    {
        name: "plugins",
        component: () => import(/* webpackChunkName: "menu:plugins" */ "@/components/menus/plugins.vue"),
    },
]);
