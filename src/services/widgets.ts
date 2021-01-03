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

export const available = [{
    name: "activity-widget",
    label: "activity",
    selected: false,
}, {
    name: "current-widget",
    label: "weather",
    selected: false,
}, {
    name: "cpu-widget",
    label: "cpu",
    selected: false,
}, {
    name: "forecast-widget",
    label: "weather_forecast",
    selected: false,
}, {
    name: "memory-widget",
    label: "memory",
    selected: false,
}, {
    name: "weather-widget",
    label: "weather_combined",
    selected: false,
}, {
    name: "bridges-widget",
    label: "bridges",
    selected: false,
}, {
    name: "log-widget",
    label: "log",
    selected: false,
}, {
    name: "system-widget",
    label: "system_info",
    selected: false,
}];

export function defaults(name:string): { [key: string]: any } | undefined {
    switch (name) {
        case "activity-widget":
            return {
                x: 0, y: 0, w: 12, h: 6, i: "1", component: "activity-widget",
            };

        case "cpu-widget":
            return {
                x: 0, y: 0, w: 1, h: 3, i: "7", component: "cpu-widget",
            };

        case "memory-widget":
            return {
                x: 0, y: 0, w: 1, h: 3, i: "8", component: "memory-widget",
            };

        case "bridges-widget":
            return {
                x: 0, y: 0, w: 1, h: 3, i: "9", component: "bridges-widget",
            };

        case "log-widget":
            return {
                x: 0, y: 0, w: 5, h: 7, i: "10", component: "log-widget",
            };

        case "system-widget":
            return {
                x: 0, y: 0, w: 4, h: 16, i: "4", component: "system-widget",
            };

        case "weather-widget":
            return {
                x: 0, y: 0, w: 5, h: 8, i: "2", component: "weather-widget",
            };

        case "forecast-widget":
            return {
                x: 0, y: 0, w: 4, h: 4, i: "5", component: "forecast-widget",
            };

        case "current-widget":
            return {
                x: 0, y: 0, w: 2, h: 5, i: "6", component: "current-widget",
            };

        default:
            return undefined;
    }
}

export function widgets(): { [key: string]: () => any } {
    return {
        "activity-widget": () => import(/* webpackChunkName: "widget:activity" */ "@/components/widgets/activity.vue"),
        "cpu-widget": () => import(/* webpackChunkName: "widget:cpu" */ "@/components/widgets/cpu.vue"),
        "memory-widget": () => import(/* webpackChunkName: "widget:memory" */ "@/components/widgets/memory.vue"),
        "bridges-widget": () => import(/* webpackChunkName: "widget:bridges" */ "@/components/widgets/bridges.vue"),
        "system-widget": () => import(/* webpackChunkName: "widget:system" */ "@/components/widgets/system.vue"),
        "log-widget": () => import(/* webpackChunkName: "widget:log" */ "@/components/widgets/log.vue"),
        "weather-widget": () => import(/* webpackChunkName: "widget:weather" */ "@/components/widgets/weather.vue"),
        "current-widget": () => import(/* webpackChunkName: "widget:current" */ "@/components/widgets/current.vue"),
        "forecast-widget": () => import(/* webpackChunkName: "widget:forecast" */ "@/components/widgets/forecast.vue"),
    };
}
