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

import hoobs from "@hoobs/sdk";

import Vue from "vue";
import App from "./app.vue";

import graphing from "./plugins/graphing";
import themes from "./plugins/themes";
import mobile from "./plugins/mobile";
import drag from "./plugins/drag";

import actions from "./services/actions";
import dialogs from "./services/dialogs";
import router from "./services/router";
import menus from "./services/menus";
import store from "./services/store";
import tasks from "./services/tasks";
import lang from "./lang";

const io = hoobs.sdk.io();

hoobs.sdk.config.token.get(() => store.state.session);
hoobs.sdk.config.token.set((token: string) => { store.commit("SESSION:SET", token); });

actions.on("io", "log", (data) => store.commit("IO:LOG", data));
actions.on("io", "monitor", (data) => store.commit("IO:MONITOR", data));
actions.on("io", "notification", (data) => store.commit("IO:NOTIFICATION", data));
actions.on("io", "accessory_change", (data) => store.commit("IO:ACCESSORY:CHANGE", data));
actions.on("io", "room_change", (data) => store.commit("IO:ROOM:CHANGE", data));

actions.on("log", "history", () => hoobs.sdk.log().then((messages: any) => { store.commit("LOG:HISTORY", messages); }));
actions.on("window", "open", (url) => window.open(url));

router.beforeEach((to, _from, next) => {
    hoobs.sdk.auth.status().then((status) => {
        if (status === "disabled") store.commit("SESSION:DISABLE");

        if (["/login", "/setup"].indexOf(to.path) === -1 && status === "uninitialized") {
            router.push({ path: "/setup" });
        } else {
            hoobs.sdk.auth.validate().then((valid) => {
                if (["/login", "/setup"].indexOf(to.path) === -1 && !valid) router.push({ path: "/login", query: { url: to.path } });
            });
        }
    });

    next();
});

Vue.config.productionTip = false;

Vue.use(io);
Vue.use(drag);
Vue.use(hoobs);
Vue.use(menus);
Vue.use(mobile);
Vue.use(dialogs);
Vue.use(actions);
Vue.use(graphing);

Vue.use(themes, { hoobs, store });

Vue.component("icon", () => import(/* webpackChunkName: "common" */ "./components/elements/icon.vue"));
Vue.component("modal", () => import(/* webpackChunkName: "common" */ "./components/elements/modal.vue"));
Vue.component("radio", () => import(/* webpackChunkName: "common" */ "./components/fields/radio.vue"));
Vue.component("context", () => import(/* webpackChunkName: "common" */ "./components/elements/context.vue"));
Vue.component("checkbox", () => import(/* webpackChunkName: "common" */ "./components/fields/checkbox.vue"));
Vue.component("text-field", () => import(/* webpackChunkName: "common" */ "./components/fields/text.vue"));
Vue.component("textarea-field", () => import(/* webpackChunkName: "common" */ "./components/fields/textarea.vue"));
Vue.component("password-field", () => import(/* webpackChunkName: "common" */ "./components/fields/password.vue"));
Vue.component("number-field", () => import(/* webpackChunkName: "common" */ "./components/fields/number.vue"));
Vue.component("integer-field", () => import(/* webpackChunkName: "common" */ "./components/fields/integer.vue"));
Vue.component("search-field", () => import(/* webpackChunkName: "common" */ "./components/fields/search.vue"));
Vue.component("select-field", () => import(/* webpackChunkName: "common" */ "./components/fields/select.vue"));
Vue.component("label-field", () => import(/* webpackChunkName: "common" */ "./components/fields/label.vue"));
Vue.component("port-field", () => import(/* webpackChunkName: "common" */ "./components/fields/port.vue"));
Vue.component("spinner", () => import(/* webpackChunkName: "common" */ "./components/elements/spinner.vue"));

tasks(store);

new Vue({
    router,
    store,
    i18n: lang,
    render: (h) => h(App),
}).$mount("#app");
