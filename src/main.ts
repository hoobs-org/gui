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

import Icon from "./components/elements/icon.vue";
import Modal from "./components/elements/modal.vue";
import Radio from "./components/fields/radio.vue";
import Context from "./components/elements/context.vue";
import Checkbox from "./components/fields/checkbox.vue";
import TextField from "./components/fields/text.vue";
import TextareaField from "./components/fields/textarea.vue";
import PasswordField from "./components/fields/password.vue";
import NumberField from "./components/fields/number.vue";
import IntegerField from "./components/fields/integer.vue";
import SearchField from "./components/fields/search.vue";
import SelectField from "./components/fields/select.vue";
import PortField from "./components/fields/port.vue";
import Spinner from "./components/elements/spinner.vue";

const io = hoobs.sdk.io();
const markdown = converter();

hoobs.sdk.config.token.get(() => store.state.session);
hoobs.sdk.config.token.set((token: string) => { store.commit("SESSION:SET", token); });

io.on("log", (data) => store.commit("IO:LOG", data));
io.on("monitor", (data) => store.commit("IO:MONITOR", data));
io.on("notification", (data) => store.commit("IO:NOTIFICATION", data));
io.on("accessory_change", (data) => store.commit("IO:ACCESSORY:CHANGE", data));
io.on("room_change", (data) => store.commit("IO:ROOM:CHANGE", data));

io.on("reconnect", async () => {
    if ((await hoobs.sdk.auth.status()) === "uninitialized") {
        window.location.href = "/";
    } else if (!(await hoobs.sdk.auth.validate())) {
        await hoobs.sdk.auth.logout();

        window.location.href = "/";
    }
});

actions.on("log", "history", () => {
    hoobs.sdk.log().then((messages: any) => { store.commit("LOG:HISTORY", messages); });
});

router.beforeEach(async (to, _from, next) => {
    if (["/login", "/setup"].indexOf(to.path) === -1 && (await hoobs.sdk.auth.status()) === "uninitialized") {
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

Vue.component("icon", Icon);
Vue.component("modal", Modal);
Vue.component("radio", Radio);
Vue.component("context", Context);
Vue.component("checkbox", Checkbox);
Vue.component("text-field", TextField);
Vue.component("textarea-field", TextareaField);
Vue.component("password-field", PasswordField);
Vue.component("number-field", NumberField);
Vue.component("integer-field", IntegerField);
Vue.component("search-field", SearchField);
Vue.component("select-field", SelectField);
Vue.component("port-field", PortField);
Vue.component("spinner", Spinner);

tasks(store);

actions.emit("log", "history");

new Vue({
    router,
    store,
    i18n: lang,
    render: (h) => h(App),
}).$mount("#app");
