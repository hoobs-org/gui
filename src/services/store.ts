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
import { Buffer } from "buffer/";
import Persistence from "../plugins/persist";
import { units, timespan } from "./formatters";
import { cloneJson } from "./json";

Vue.use(Vuex);

export default new Vuex.Store<{ [key: string]: any }>({
    state: {
        log: [],
        bridges: [],
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
        heap: 0,
        temp: null,
        session: "",
        user: { permissions: {} },
        auth: false,
        version: {
            hoobsd: "0.0.0",
            homebridge: "0.0.0",
            node: "0.0.0",
            updated: true,
        },
        notifications: [],
        snapshots: {},
        streaming: {},
        latest: null,
        navigation: false,
        mdns: false,
        broadcast: "",
        product: "",
        terminal: false,
        platform: null,
        theme: null,
    },

    getters: {
        theme(state) {
            return state.theme;
        },
    },

    mutations: {
        "IO:LOG": (state: { [key: string]: any }, payload: any) => {
            state.log.push(payload);
            state.log = state.log.slice(Math.max(state.log.length - 5000, 0));
        },

        "IO:MONITOR": (state: { [key: string]: any }, payload: any) => {
            const keys = Object.keys(payload.data.bridges);
            const bridges = [];

            for (let i = 0; i < keys.length; i += 1) {
                const bridge = cloneJson(payload.data.bridges[keys[i]]);

                bridges.push({
                    id: keys[i],
                    display: bridge.display,
                    version: bridge.version,
                    running: bridge.running,
                    uptime: timespan(bridge.uptime),
                    heap: bridge.heap,
                });
            }

            state.bridges = bridges;
            state.temp = (payload.data.temp.main || -1) > -1 ? payload.data.temp.main : null;
            state.heap = payload.data.heap;

            const cpu = {
                used: 100 - Math.round(payload.data.cpu.currentLoadIdle || 100),
                available: Math.round(payload.data.cpu.currentLoadIdle || 100),
                history: state.cpu.history,
            };

            for (let i = 0; i < 19; i += 1) {
                cpu.history[i] = cpu.history[i + 1];
                cpu.history[i][0] = i;
            }

            cpu.history[19] = [19, cpu.used];
            state.cpu = cpu;

            const memory = {
                load: Math.round((payload.data.memory.total || 0) > 0 ? ((payload.data.memory.active || 0) * 100) / (payload.data.memory.total || 0) : 0),
                total: units(payload.data.memory.total || 0),
                used: units(payload.data.memory.active || 0),
                history: state.memory.history,
            };

            for (let i = 0; i < 19; i += 1) {
                memory.history[i] = memory.history[i + 1];
                memory.history[i][0] = `${i}`;
            }

            memory.history[19] = [19, memory.load];
            state.memory = memory;
        },

        "IO:NOTIFICATION": (state: { [key: string]: any }, payload: any) => {
            const now = (new Date()).getTime();

            const notification = {
                id: `${now}:${Math.random()}`,
                time: now,
                event: payload.event,
                bridge: payload.bridge,
                type: payload.data.type,
                title: payload.data.title,
                description: payload.data.description,
                icon: payload.data.icon,
                ttl: now + (1 * 60 * 60 * 1000),
            };

            if (state.latest) clearTimeout(state.latest.timer);

            state.latest = { timer: setTimeout(() => { state.latest = null; }, 10 * 1000), notification };

            state.notifications.unshift(notification);
        },

        "IO:SNAPSHOT:UPDATE": (state: { [key: string]: any }, payload: any) => { state.snapshots[payload.id] = payload.data; },

        "SESSION:SET": (state: { [key: string]: any }, token: string) => {
            state.session = token;

            if (token && token !== "") {
                const user = JSON.parse(Buffer.from(token, "base64").toString("utf8"));

                state.user = {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    permissions: user.permissions || {},
                };
            } else {
                state.user = { permissions: {} };
            }
        },

        "SESSION:DISABLE": (state: { [key: string]: any }) => {
            state.session = "";

            state.user = {
                id: 1,
                name: "unavailable",
                username: "unavailable",
                permissions: {
                    accessories: true,
                    bridges: true,
                    config: true,
                    controller: true,
                    plugins: true,
                    reboot: true,
                    terminal: true,
                    users: false,
                },
            };
        },

        "LOG:HISTORY": (state: { [key: string]: any }, messages: string) => {
            state.log = messages;
            state.log = state.log.slice(1).slice(-5000);
        },

        "NOTIFICATION:ADD": (state: { [key: string]: any }, payload: any) => {
            const now = (new Date()).getTime();
            const notification = cloneJson(payload);

            notification.id = `${now}:${Math.random()}`;
            notification.time = now;
            notification.ttl = now + (1 * 60 * 60 * 1000);

            state.notifications.unshift(notification);
        },

        "NOTIFICATION:DISMISS": (state: { [key: string]: any }, id: string) => { state.notifications = state.notifications.filter((item: { [key: string]: any }) => (item.id || "") !== "" && (item.id || "") !== id); },

        "NOTIFICATION:DISMISS:LATEST": (state: { [key: string]: any }) => {
            if (state.latest) clearTimeout(state.latest.timer);

            state.latest = null;
        },

        "NOTIFICATION:DISMISS:ALL": (state: { [key: string]: any }) => { state.notifications = []; },

        "NOTIFICATION:DISMISS:OLD": (state: { [key: string]: any }) => {
            const now = (new Date()).getTime();

            state.notifications = state.notifications.filter((item: { [key: string]: any }) => (item.ttl || 0) > now);
        },

        "NAVIGATION:STATE": (state: { [key: string]: any }, value: boolean) => { state.navigation = value; },
        "AUTH:STATE": (state: { [key: string]: any }, value: string) => { state.auth = value === "enabled"; },

        "VERSION:STATE": (state: { [key: string]: any }, payload: any) => {
            state.version = {
                hoobsd: payload.version,
                homebridge: payload.homebridge_version,
                node: payload.node_version,
                updated: payload.upgraded && payload.cli_upgraded && payload.node_upgraded,
            };
        },

        "MDNS:STATE": (state: { [key: string]: any }, payload: any) => { state.mdns = payload; },
        "BROADCAST:STATE": (state: { [key: string]: any }, payload: any) => { state.broadcast = payload; },
        "PRODUCT:STATE": (state: { [key: string]: any }, payload: any) => { state.product = payload; },
        "TERMINAL:STATE": (state: { [key: string]: any }, payload: any) => { state.terminal = payload; },
        "PLATFORM:STATE": (state: { [key: string]: any }, payload: any) => { state.platform = payload; },
        "THEME:SET": (state: { [key: string]: any }, theme: number) => { state.theme = theme; },
        "ACCESSORY:STREAMING": (state: { [key: string]: any }, payload: any) => { state.streaming[payload.id] = payload.data; },
    },

    plugins: [Persistence("bridges", "cpu", "memory", "temp", "session", "user", "notifications", "snapshots", "streaming", "navigation")],
});
