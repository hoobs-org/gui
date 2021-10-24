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

export function types(accessory: { [key: string]: any }): string | undefined {
    let sensors: [string];

    switch ((accessory || {}).type) {
        case "light":
            return "light-accessory";

        case "switch":
        case "outlet":
            return "switch-accessory";

        case "fan":
            return "fan-accessory";

        case "lock":
            return "lock-accessory";

        case "camera":
            return "camera-accessory";

        case "thermostat":
            return "thermostat-accessory";

        case "garage_door_opener":
            return "garage-accessory";

        case "security_system":
            return "security-accessory";

        case "valve":
            return "sprinkler-accessory";

        case "window_covering":
            return "blind-accessory";

        case "television":
            return "television-accessory";

        case "sensor":
            if (!accessory.main_sensor) return "unknown-accessory";

            sensors = accessory.characteristics.map((item: { [key: string]: any }) => item.type);

            if (sensors.indexOf("leak_detected") >= 0) return "sensor-accessory";
            if (sensors.indexOf("current_temperature") >= 0) return "sensor-accessory";
            if (sensors.indexOf("current_relative_humidity") >= 0) return "sensor-accessory";
            if (sensors.indexOf("smoke_detected") >= 0) return "sensor-accessory";
            if (sensors.indexOf("carbon_dioxide_detected") >= 0) return "sensor-accessory";
            if (sensors.indexOf("carbon_monoxide_detected") >= 0) return "sensor-accessory";
            if (sensors.indexOf("contact_sensor_state") >= 0) return "sensor-accessory";
            if (sensors.indexOf("current_door_state") >= 0) return "sensor-accessory";
            if (sensors.indexOf("motion_detected") >= 0) return "sensor-accessory";
            if (sensors.indexOf("obstruction_detected") >= 0) return "sensor-accessory";
            if (sensors.indexOf("occupancy_detected") >= 0) return "sensor-accessory";

            return "unknown-accessory";

        default:
            return "unknown-accessory";
    }
}

export function accessories(): { [key: string]: () => any } {
    return {
        "off-accessory": () => import(/* webpackChunkName: "accessories" */ "@/components/accessories/off.vue"),
        "hue-accessory": () => import(/* webpackChunkName: "accessories" */ "@/components/accessories/hue.vue"),
        "fan-accessory": () => import(/* webpackChunkName: "accessories" */ "@/components/accessories/fan.vue"),
        "lock-accessory": () => import(/* webpackChunkName: "accessories" */ "@/components/accessories/lock.vue"),
        "light-accessory": () => import(/* webpackChunkName: "accessories" */ "@/components/accessories/light.vue"),
        "blind-accessory": () => import(/* webpackChunkName: "accessories" */ "@/components/accessories/blind.vue"),
        "camera-accessory": () => import(/* webpackChunkName: "accessories" */ "@/components/accessories/camera.vue"),
        "sensor-accessory": () => import(/* webpackChunkName: "accessories" */ "@/components/accessories/sensor.vue"),
        "switch-accessory": () => import(/* webpackChunkName: "accessories" */ "@/components/accessories/switch.vue"),
        "garage-accessory": () => import(/* webpackChunkName: "accessories" */ "@/components/accessories/garage.vue"),
        "security-accessory": () => import(/* webpackChunkName: "accessories" */ "@/components/accessories/security.vue"),
        "sprinkler-accessory": () => import(/* webpackChunkName: "accessories" */ "@/components/accessories/sprinkler.vue"),
        "television-accessory": () => import(/* webpackChunkName: "accessories" */ "@/components/accessories/television.vue"),
        "thermostat-accessory": () => import(/* webpackChunkName: "accessories" */ "@/components/accessories/thermostat.vue"),
        "brightness-accessory": () => import(/* webpackChunkName: "accessories" */ "@/components/accessories/brightness.vue"),
        "unavailable-accessory": () => import(/* webpackChunkName: "accessories" */ "@/components/accessories/unavailable.vue"),
        "unknown-accessory": () => import(/* webpackChunkName: "accessories" */ "@/components/accessories/unknown.vue"),
    };
}
