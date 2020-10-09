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
        instances: {},
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
        session: null,
        notifications: [],
        accessory: null,
        theme: "dark",
    },

    getters: {
        theme(state) {
            return state.theme;
        },
    },

    mutations: {
        "IO:LOG": (state: { [key: string ]: any }, payload: any) => {
            console.log(payload);
            state.log.push(payload);

            while (state.log.length > 500) {
                state.log.shift();
            }
        },

        "IO:MONITOR": (state: { [key: string ]: any }, payload: any) => {
            const instances = Object.keys(payload.data.instances);

            for (let i = 0; i < instances.length; i += 1) {
                const { ...instance } = payload.data.instances[instances[i]];

                state.instances[instances[i]] = {
                    version: instance.version,
                    running: instance.running,
                    uptime: timespan(instance.uptime),
                };
            }

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

        "IO:NOTIFICATION": (state: { [key: string ]: any }, payload: any) => {
            const index = state.notifications.length;

            state.notifications.push({
                event: payload.event,
                instance: payload.instance,
                type: payload.data.type,
                title: payload.data.title,
                description: payload.data.description,
                icon: payload.data.icon,
            });

            setTimeout(() => {
                state.notifications.splice(index, 1);
            }, (3 * 1000));
        },

        "IO:ACCESSORY:CHANGE": (state: { [key: string ]: any }, payload: any) => {
            state.accessory = payload.data;
        },

        "SESSION:SET": (state: { [key: string ]: any }, token: number) => {
            state.session = token;
        },

        "NOTIFICATION:ADD": (state: { [key: string ]: any }, payload: any) => {
            const index = state.notifications.length;

            state.notifications.push(payload);

            setTimeout(() => {
                state.notifications.splice(index, 1);
            }, (3 * 1000));
        },

        "NOTIFICATION:DISMISS": (state: { [key: string ]: any }, index: number) => {
            if (index >= 0 && index < state.notifications.length) {
                state.notifications.splice(index, 1);
            }
        },

        "THEME:SET": (state: { [key: string ]: any }, theme: number) => {
            state.theme = theme;
        },
    },

    plugins: [new Persistence({
        key: "hoobs:state",
        storage: window.localStorage,
        reducer: (state: { [key: string ]: any }) => ({
            cpu: state.cpu,
            memory: state.memory,
            temp: state.temp,
            session: state.session,
            notifications: state.notifications,
            theme: state.theme,
        }),
    }).plugin],
});
