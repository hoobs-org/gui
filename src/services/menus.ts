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

class Menus {
    declare private menus: any[];

    declare private events: Vue;

    declare private open: undefined | string;

    constructor(menus: any[]) {
        this.events = new Vue();
        this.menus = menus;
    }

    on(event: string, callback: (value?: any) => void) {
        this.events.$on(event, callback);
    }

    show(name: string, options?: { [key: string]: any }) {
        if (this.open && this.open === name) {
            this.close();
        } else {
            const source = this.menus.findIndex((item) => item.name === name);

            if (source >= 0) {
                this.open = name;
                this.menus[source].options = options;
                this.events.$emit("open", this.menus[source]);
            }
        }
    }

    close() {
        for (let i = 0; i < this.menus.length; i += 1) {
            delete this.menus[i].options;
        }

        this.open = undefined;
        this.events.$emit("close");
    }

    mixin() {
        return {
            computed: {
                $menu: () => this,
            },
        };
    }
}

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
