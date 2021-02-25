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
import { initial } from "./widgets";
import { units, timespan } from "./formatters";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        log: [],
        bridges: [],
        config: {},
        dashboard: {
            items: [...initial],
        },
        cpu: {
            used: null,
            history: [
                [0, 0], [1, 0], [2, 0], [3, 0],
                [4, 0], [5, 0], [6, 0], [7, 0],
                [8, 0], [9, 0], [10, 0], [11, 0],
                [12, 0], [13, 0], [14, 0], [15, 0],
                [16, 0], [17, 0], [18, 0], [19, 0],
            ],
        },
        memory: {
            load: null,
            total: null,
            used: null,
            history: [
                [0, 0], [1, 0], [2, 0], [3, 0],
                [4, 0], [5, 0], [6, 0], [7, 0],
                [8, 0], [9, 0], [10, 0], [11, 0],
                [12, 0], [13, 0], [14, 0], [15, 0],
                [16, 0], [17, 0], [18, 0], [19, 0],
            ],
        },
        temp: null,
        session: "",
        user: {
            permissions: {},
        },
        auth: false,
        notifications: [],
        navigation: false,
        accessory: null,
        room: null,
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
            state.log = state.log.slice(1).slice(-5000);
        },

        "IO:MONITOR": (state: { [key: string]: any }, payload: any) => {
            const keys = Object.keys(payload.data.bridges);
            const bridges = [];

            for (let i = 0; i < keys.length; i += 1) {
                const { ...bridge } = payload.data.bridges[keys[i]];

                bridges.push({
                    id: keys[i],
                    display: bridge.display,
                    version: bridge.version,
                    running: bridge.running,
                    uptime: timespan(bridge.uptime),
                });
            }

            state.bridges = bridges;
            state.temp = (payload.data.temp.main || -1) > -1 ? payload.data.temp.main : null;

            state.cpu.used = 100 - Math.round(payload.data.cpu.currentLoadIdle || 100);
            state.cpu.available = Math.round(payload.data.cpu.currentLoadIdle || 100);

            state.memory.load = Math.round((payload.data.memory.total || 0) > 0 ? ((payload.data.memory.active || 0) * 100) / (payload.data.memory.total || 0) : 0);
            state.memory.total = units(payload.data.memory.total || 0);
            state.memory.used = units(payload.data.memory.active || 0);

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
                bridge: payload.bridge,
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

        "IO:ROOM:CHANGE": (state: { [key: string]: any }, payload: any) => {
            state.room = payload.data;
        },

        "SESSION:SET": (state: { [key: string]: any }, token: string) => {
            state.session = token;

            if (token && token !== "") {
                const user = JSON.parse(atob(token));

                state.user = {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    permissions: user.permissions || {},
                };
            } else {
                state.user = {
                    permissions: {},
                };
            }
        },

        "LOG:HISTORY": (state: { [key: string]: any }, messages: string) => {
            state.log = messages;
            state.log = state.log.slice(1).slice(-5000);
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
    },

    plugins: [new Persistence({
        key: "hoobs:state",
        storage: window.localStorage,
        reducer: (state: { [key: string]: any }) => ({
            bridges: state.bridges,
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
