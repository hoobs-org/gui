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

import Alert from "@/components/dialogs/alert.vue";
import Confirm from "@/components/dialogs/confirm.vue";
import About from "@/components/dialogs/about.vue";
import Updates from "@/components/dialogs/updates.vue";
import Settings from "@/components/dialogs/settings.vue";
import Personalize from "@/components/dialogs/personalize.vue";
import Dashboard from "@/components/dialogs/dashboard.vue";
import Instances from "../components/dialogs/instances.vue";

class Dialogs {
    declare private open: any[];

    declare private dialogs: any[];

    declare private events: Vue;

    constructor(dialogs: any[]) {
        this.events = new Vue();
        this.dialogs = dialogs;
        this.open = [];
    }

    on(event: string, callback: (value?: any) => void) {
        this.events.$on(event, callback);
    }

    show(name: string, options?: { [key: string]: any }) {
        const source = this.dialogs.findIndex((item) => item.name === name);

        if (source >= 0) {
            this.dialogs[source].options = options;

            this.open.push(this.dialogs[source]);
            this.events.$emit("open", this.dialogs[source]);
            this.events.$emit("state", this.open);
        }
    }

    close(name: string) {
        if (name) {
            const open = this.open.findIndex((item) => item.name === name);
            const source = this.open.findIndex((item) => item.name === name);

            if (open >= 0 && source >= 0) {
                delete this.dialogs[source].options;

                this.open.splice(open, 1);
                this.events.$emit("close", this.dialogs[source]);
                this.events.$emit("state", this.open);
            }
        } else {
            while (this.open.length > 0) {
                const open = this.open.pop();
                const source = this.open.findIndex((item) => item.name === open.name);

                if (source >= 0) {
                    delete this.dialogs[source].options;

                    this.events.$emit("close", this.dialogs[source]);
                }
            }

            this.events.$emit("state", this.open);
        }
    }

    mixin() {
        return {
            computed: {
                $dialog: () => this,
            },

            methods: {
                $alert: (message: string) => {
                    this.show("alert", { message });
                },

                $confirm: (action: string, message: string, callback: () => void) => {
                    this.show("confirm", { message, action, callback });
                },
            },
        };
    }
}

export default new Dialogs([
    Alert,
    Confirm,
    About,
    Updates,
    Settings,
    Personalize,
    Dashboard,
    Instances,
]);
