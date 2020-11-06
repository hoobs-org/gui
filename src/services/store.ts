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
import Vuex from "vuex";
import Persistence from "vuex-persist";
import { units, timespan } from "./formatters";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        log: [],
        instances: [],
        config: {},
        dashboard: {
            items: [{
                x: 0, y: 12, w: 1, h: 3, i: "9", component: "instances",
            }, {
                x: 0, y: 9, w: 1, h: 3, i: "8", component: "memory",
            }, {
                x: 0, y: 6, w: 1, h: 3, i: "7", component: "cpu",
            }, {
                x: 0, y: 0, w: 12, h: 6, i: "1", component: "activity",
            }, {
                x: 1, y: 6, w: 4, h: 9, i: "2", component: "weather",
            }, {
                x: 8, y: 6, w: 4, h: 16, i: "4", component: "system",
            }],
        },
        cpu: {
            used: null,
            history: [
                [0, -1], [1, -1], [2, -1], [3, -1],
                [4, -1], [5, -1], [6, -1], [7, -1],
                [8, -1], [9, -1], [10, -1], [11, -1],
                [12, -1], [13, -1], [14, -1], [15, -1],
                [16, -1], [17, -1], [18, -1], [19, -1],
            ],
        },
        memory: {
            load: null,
            total: null,
            used: null,
            history: [
                [0, -1], [1, -1], [2, -1], [3, -1],
                [4, -1], [5, -1], [6, -1], [7, -1],
                [8, -1], [9, -1], [10, -1], [11, -1],
                [12, -1], [13, -1], [14, -1], [15, -1],
                [16, -1], [17, -1], [18, -1], [19, -1],
            ],
        },
        temp: null,
        session: "",
        user: {},
        auth: false,
        notifications: [],
        navigation: false,
        accessory: null,
        theme: "dark",
    },

    getters: {
        theme(state) {
            return state.theme;
        },
    },

    mutations: {
        "IO:LOG": (state: { [key: string]: any }, payload: any) => {
            state.log.push(payload);

            while (state.log.length > 500) state.log.shift();
        },

        "IO:MONITOR": (state: { [key: string]: any }, payload: any) => {
            const keys = Object.keys(payload.data.instances);
            const instances = [];

            for (let i = 0; i < keys.length; i += 1) {
                const { ...instance } = payload.data.instances[keys[i]];

                instances.push({
                    id: keys[i],
                    display: instance.display,
                    version: instance.version,
                    running: instance.running,
                    uptime: timespan(instance.uptime),
                });
            }

            state.instances = instances;
            state.temp = payload.data.temp.main > -1 ? payload.data.temp.main : null;

            state.cpu.used = 100 - Math.round(payload.data.cpu.currentload_idle);
            state.cpu.available = Math.round(payload.data.cpu.currentload_idle);

            state.memory.load = Math.round(payload.data.memory.total > 0 ? (payload.data.memory.active * 100) / payload.data.memory.total : 0);
            state.memory.total = units(payload.data.memory.total);
            state.memory.used = units(payload.data.memory.active);

            for (let i = 0; i < state.cpu.history.length - 1; i += 1) {
                state.cpu.history[i] = state.cpu.history[i + 1];
                state.cpu.history[i][0] = i;

                state.memory.history[i] = state.memory.history[i + 1];
                state.memory.history[i][0] = `${i}`;
            }

            state.cpu.history[state.cpu.history.length - 1] = [state.cpu.history.length - 1, state.cpu.used];
            state.memory.history[state.memory.history.length - 1] = [state.memory.history.length - 1, state.memory.load];
        },

        "IO:NOTIFICATION": (state: { [key: string]: any }, payload: any) => {
            const now = (new Date()).getTime();

            state.notifications.unshift({
                id: `${now}:${Math.random()}`,
                time: now,
                event: payload.event,
                instance: payload.instance,
                type: payload.data.type,
                title: payload.data.title,
                description: payload.data.description,
                icon: payload.data.icon,
                ttl: now + (1 * 60 * 60 * 1000),
            });
        },

        "IO:ACCESSORY:CHANGE": (state: { [key: string]: any }, payload: any) => {
            state.accessory = payload.data;
        },

        "SESSION:SET": (state: { [key: string]: any }, token: string) => {
            state.session = token;

            if (token && token !== "") {
                const user = JSON.parse(atob(token));

                state.user = {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    admin: user.admin,
                };
            } else {
                state.user = {};
            }
        },

        "LOG:HISTORY": (state: { [key: string]: any }, messages: string) => {
            state.log.unshift(...messages);

            while (state.log.length > 500) state.log.shift();
        },

        "NOTIFICATION:ADD": (state: { [key: string]: any }, payload: any) => {
            const now = (new Date()).getTime();
            const { ...notification } = payload;

            notification.id = `${now}:${Math.random()}`;
            notification.time = now;
            notification.ttl = now + (1 * 60 * 60 * 1000);

            state.notifications.unshift(notification);
        },

        "NOTIFICATION:DISMISS": (state: { [key: string]: any }, id: string) => {
            state.notifications = state.notifications.filter((item: { [key: string]: any }) => (item.id || "") !== "" && (item.id || "") !== id);
        },

        "NOTIFICATION:DISMISS:OLD": (state: { [key: string]: any }) => {
            const now = (new Date()).getTime();

            state.notifications = state.notifications.filter((item: { [key: string]: any }) => (item.ttl || 0) > now);
        },

        "NAVIGATION:STATE": (state: { [key: string]: any }, value: boolean) => {
            state.navigation = value;
        },

        "AUTH:STATE": (state: { [key: string]: any }, value: string) => {
            if (value === "enabled") {
                state.auth = true;
            } else {
                state.auth = false;
            }
        },

        "THEME:SET": (state: { [key: string]: any }, theme: number) => {
            state.theme = theme;
        },

        "DASHBOARD:LAYOUT": (state: { [key: string]: any }, data: { [key: string]: string | number | boolean }) => {
            state.dashboard.items = data;
        },

        "DASHBOARD:ITEMS": (state: { [key: string]: any }, data: { [key: string]: string | number | boolean }) => {
            state.dashboard.items = data;
        },

        "DASHBOARD:BACKDROP": (state: { [key: string]: any }, value: boolean) => {
            state.dashboard.backdrop = value;
        },

        "DIALOG:SHOW": (state: { [key: string]: any }, value: string) => {
            state.dialog = value;
        },

        "ALERT:SHOW": (state: { [key: string]: any }, message: string) => {
            state.alert = {
                message,
            };
        },

        "CONFIRM:SHOW": (state: { [key: string]: any }, data: { [key: string]: any }) => {
            state.confirm = data;
        },
    },

    plugins: [new Persistence({
        key: "hoobs:state",
        storage: window.localStorage,
        reducer: (state: { [key: string]: any }) => ({
            dashboard: state.dashboard,
            cpu: state.cpu,
            memory: state.memory,
            temp: state.temp,
            session: state.session,
            user: state.user,
            notifications: state.notifications,
            navigation: state.navigation,
            theme: state.theme,
        }),
    }).plugin],
});
