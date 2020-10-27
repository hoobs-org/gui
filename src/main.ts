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
import lang from "./lang";

const hoobs = sdk(store);

socket.on("log", (data) => store.commit("IO:LOG", data));
socket.on("monitor", (data) => store.commit("IO:MONITOR", data));
socket.on("notification", (data) => store.commit("IO:NOTIFICATION", data));
socket.on("accessory_change", (data) => store.commit("IO:ACCESSORY:CHANGE", data));

hoobs.log().then((messages) => {
    store.commit("LOG:HISTORY", messages);
});

router.beforeEach(async (to, _from, next) => {
    if (to.path !== "/login" && to.path !== "/setup" && ((await hoobs.auth.status()) === "uninitialized" || (await hoobs.instances.list()).length === 0)) {
        router.push({ path: "/setup" });
    } else if (to.path !== "/login" && to.path !== "/setup" && !(await hoobs.auth.validate())) {
        router.push({ path: "/login", query: { url: to.path } });
    } else {
        next();
    }
});

Vue.config.productionTip = false;
Vue.mixin({ data: () => ({ hoobs }) });

new Vue({
    router,
    store,
    i18n: lang,
    render: (h) => h(root),
}).$mount("#app");
