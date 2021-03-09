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

import { Wait } from "@hoobs/sdk/lib/wait";

import Vue from "vue";
import App from "./app.vue";

import converter from "./plugins/markdown";
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
const markdown = converter();

hoobs.sdk.config.token.get(() => store.state.session);
hoobs.sdk.config.token.set((token: string) => { store.commit("SESSION:SET", token); });

io.on("log", (data) => store.commit("IO:LOG", data));
io.on("monitor", (data) => store.commit("IO:MONITOR", data));
io.on("notification", (data) => store.commit("IO:NOTIFICATION", data));
io.on("accessory_change", (data) => store.commit("IO:ACCESSORY:CHANGE", data));
io.on("room_change", (data) => store.commit("IO:ROOM:CHANGE", data));

io.on("connect", async () => {
    actions.emit("io", "connected");
});

io.on("reconnect", async () => {
    actions.emit("io", "connected");

    if ((await hoobs.sdk.auth.status()) === "uninitialized") {
        window.location.href = "/";
    } else if (!(await hoobs.sdk.auth.validate())) {
        await hoobs.sdk.auth.logout();

        window.location.href = "/";
    }
});

io.on("disconnect", async () => {
    actions.emit("io", "disconnected");
});

actions.on("window", "reboot", () => {
    setTimeout(async () => {
        await Wait();

        window.location.href = "/";
    }, 5000);
});

actions.on("log", "history", () => {
    hoobs.sdk.log().then((messages: any) => { store.commit("LOG:HISTORY", messages); });
});

router.beforeEach(async (to, _from, next) => {
    const status = await hoobs.sdk.auth.status();

    if (status === "disabled") store.commit("SESSION:DISABLE");

    if (["/login", "/setup"].indexOf(to.path) === -1 && status === "uninitialized") {
        router.push({ path: "/setup" });
    } else if (["/login", "/setup"].indexOf(to.path) === -1 && !(await hoobs.sdk.auth.validate())) {
        router.push({ path: "/login", query: { url: to.path } });
    } else {
        next();
    }
});

Vue.config.productionTip = false;

Vue.use(io);
Vue.use(drag);
Vue.use(hoobs);
Vue.use(menus);
Vue.use(mobile);
Vue.use(dialogs);
Vue.use(actions);
Vue.use(markdown);
Vue.use(graphing);

Vue.use(themes, { hoobs, store });

Vue.component("icon", () => import(/* webpackChunkName: "common-icon" */ "./components/elements/icon.vue"));
Vue.component("modal", () => import(/* webpackChunkName: "common-modal" */ "./components/elements/modal.vue"));
Vue.component("radio", () => import(/* webpackChunkName: "common-radio" */ "./components/fields/radio.vue"));
Vue.component("context", () => import(/* webpackChunkName: "common-context" */ "./components/elements/context.vue"));
Vue.component("checkbox", () => import(/* webpackChunkName: "common-checkbox" */ "./components/fields/checkbox.vue"));
Vue.component("text-field", () => import(/* webpackChunkName: "common-text" */ "./components/fields/text.vue"));
Vue.component("textarea-field", () => import(/* webpackChunkName: "common-textarea" */ "./components/fields/textarea.vue"));
Vue.component("password-field", () => import(/* webpackChunkName: "common-password" */ "./components/fields/password.vue"));
Vue.component("number-field", () => import(/* webpackChunkName: "common-number" */ "./components/fields/number.vue"));
Vue.component("integer-field", () => import(/* webpackChunkName: "common-integer" */ "./components/fields/integer.vue"));
Vue.component("search-field", () => import(/* webpackChunkName: "common-search" */ "./components/fields/search.vue"));
Vue.component("select-field", () => import(/* webpackChunkName: "common-select" */ "./components/fields/select.vue"));
Vue.component("port-field", () => import(/* webpackChunkName: "common-port" */ "./components/fields/port.vue"));
Vue.component("spinner", () => import(/* webpackChunkName: "common-spinner" */ "./components/elements/spinner.vue"));

tasks(store);

actions.emit("log", "history");

new Vue({
    router,
    store,
    i18n: lang,
    render: (h) => h(App),
}).$mount("#app");
