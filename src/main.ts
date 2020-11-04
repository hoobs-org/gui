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

import root from "./app.vue";

import socket from "./plugins/socket";
import sdk from "./plugins/hoobs";
import themes from "./plugins/themes";
import drag from "./plugins/drag";

import router from "./services/router";
import store from "./services/store";
import tasks from "./services/tasks";
import lang from "./lang";

import Modal from "./components/elements/modal.vue";
import Radio from "./components/fields/radio.vue";
import Context from "./components/elements/context.vue";
import Checkbox from "./components/fields/checkbox.vue";
import TextField from "./components/fields/text.vue";
import PasswordField from "./components/fields/password.vue";
import NumberField from "./components/fields/number.vue";
import IntegerField from "./components/fields/integer.vue";
import SearchField from "./components/fields/search.vue";
import PortField from "./components/fields/port.vue";
import Spinner from "./components/elements/spinner.vue";

const open = [
    "/login",
    "/setup",
];

const io = socket();
const hoobs = sdk(() => store.state.session, (token) => { store.commit("SESSION:SET", token); });

io.on("log", (data) => store.commit("IO:LOG", data));
io.on("monitor", (data) => store.commit("IO:MONITOR", data));
io.on("notification", (data) => store.commit("IO:NOTIFICATION", data));
io.on("accessory_change", (data) => store.commit("IO:ACCESSORY:CHANGE", data));
io.on("reconnecting", () => { store.commit("IO:RECONNECTING"); });

io.on("reconnect", async () => {
    store.commit("SETTINGS:UPDATED");
    store.commit("IO:RECONNECTED");

    if ((await hoobs.auth.status()) === "uninitialized" || (await hoobs.instances.count()) === 0) {
        window.location.href = "/";
    } else if (!(await hoobs.auth.validate())) {
        await hoobs.auth.logout();

        window.location.href = "/";
    }
});

hoobs.log().then((messages) => { store.commit("LOG:HISTORY", messages); });

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

Vue.mixin(io.mixin());
Vue.mixin(hoobs.mixin());
Vue.mixin(themes.mixin(store));

Vue.use(drag);

Vue.component("context", Context);
Vue.component("modal", Modal);
Vue.component("radio", Radio);
Vue.component("checkbox", Checkbox);
Vue.component("text-field", TextField);
Vue.component("password-field", PasswordField);
Vue.component("number-field", NumberField);
Vue.component("integer-field", IntegerField);
Vue.component("search-field", SearchField);
Vue.component("port-field", PortField);
Vue.component("spinner", Spinner);

tasks(store);

new Vue({
    router,
    store,
    i18n: lang,
    render: (h) => h(root),
}).$mount("#app");
