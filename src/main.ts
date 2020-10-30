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
import socket from "./services/socket";
import sdk from "./services/sdk";
import root from "./app.vue";
import router from "./services/router";
import store from "./services/store";
import tasks from "./services/tasks";
import lang from "./lang";
import themes from "./services/themes";

import Layout from "./layout.vue";
import Welcome from "./components/elements/welcome.vue";
import Modal from "./components/elements/modal.vue";
import Spinner from "./components/elements/spinner.vue";
import TextField from "./components/fields/text.vue";
import PasswordField from "./components/fields/password.vue";
import PortField from "./components/fields/port.vue";

const open = [
    "/login",
    "/setup",
];

const hoobs = sdk(() => store.state.session, (token) => {
    store.commit("SESSION:SET", token);
});

socket.on("log", (data) => store.commit("IO:LOG", data));
socket.on("monitor", (data) => store.commit("IO:MONITOR", data));
socket.on("notification", (data) => store.commit("IO:NOTIFICATION", data));
socket.on("accessory_change", (data) => store.commit("IO:ACCESSORY:CHANGE", data));

hoobs.log().then((messages) => {
    store.commit("LOG:HISTORY", messages);
});

router.beforeEach(async (to, _from, next) => {
    if (open.indexOf(to.path) === -1 && ((await hoobs.auth.status()) === "uninitialized" || (await hoobs.instances.count()) === 0)) {
        router.push({ path: "/setup" });
    } else if (open.indexOf(to.path) === -1 && !(await hoobs.auth.validate())) {
        router.push({ path: "/login", query: { url: to.path } });
    } else {
        next();
    }
});

Vue.config.productionTip = false;

Vue.mixin({ data: () => ({ hoobs }) });

Vue.mixin({
    methods: {
        $theme(name: string) {
            themes.set(name, store);
        },
    },
});

themes.set(store.state.theme, store);

Vue.component("layout", Layout);
Vue.component("welcome", Welcome);
Vue.component("modal", Modal);
Vue.component("spinner", Spinner);
Vue.component("text-field", TextField);
Vue.component("password-field", PasswordField);
Vue.component("port-field", PortField);

tasks(store);

new Vue({
    router,
    store,
    i18n: lang,
    render: (h) => h(root),
}).$mount("#app");
