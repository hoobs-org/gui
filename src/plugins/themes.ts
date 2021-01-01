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

import { Store } from "vuex";
import Vue, { VueConstructor } from "vue";
import Sanitize from "@hoobs/sdk/lib/sanitize";

interface Options {
    store: Store<any>;
    hoobs: any;
}

const THEMES_URL = process.env.VUE_APP_THEMES || "/themes";

export function path(theme: string): string {
    switch (theme) {
        case "light":
        case "dark":
            return `/defaults/${theme}/theme.css`;

        default:
            return `${THEMES_URL}/${theme}/theme.css`;
    }
}

export function set(name: string, store?: Store<any>): void {
    const style = document.getElementById("app-theme");

    if (style) style.setAttribute("href", path(Sanitize(name)));
    if (store) store.commit("THEME:SET", Sanitize(name));
}

export default {
    install(vue: VueConstructor<Vue>, options: Options): void {
        vue.mixin({
            computed: {
                $theme() {
                    return {
                        set(name: string) {
                            set(name, options?.store);
                        },

                        async get() {
                            const theme = await options?.hoobs.sdk.theme.get(options?.store?.state.theme);

                            return theme;
                        },
                    };
                },
            },
        });
    },
};
