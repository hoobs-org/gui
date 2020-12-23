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

export function units(value: number): { [key: string]: number | string } {
    const results = {
        value: Math.round((value / 1073741824) * 100) / 100,
        units: "GB",
    };

    while (results.value < 1 && results.units !== "KB") {
        results.value = Math.round((results.value * 1024) * 100) / 100;

        switch (results.units) {
            case "GB":
                results.units = "MB";
                break;

            case "MB":
                results.units = "KB";
                break;

            default:
                results.units = "GB";
                break;
        }
    }

    return results;
}

export function timespan(value: number): { [key: string]: number } {
    const results = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    };

    let timestamp = value;

    results.days = Math.floor(timestamp / (1000 * 60 * 60 * 24));
    timestamp -= results.days * (1000 * 60 * 60 * 24);
    results.hours = Math.floor(timestamp / (1000 * 60 * 60));
    timestamp -= results.hours * (1000 * 60 * 60);
    results.minutes = Math.floor(timestamp / (1000 * 60));
    timestamp -= results.minutes * (1000 * 60);
    results.seconds = Math.floor(timestamp / (1000));

    return results;
}

export function decamel(value: string): string {
    if (!value || value === "") return "";

    let result = value;

    result = result.replace("homebridge-", "");
    result = result.replace(/[-_]/gi, " ");
    result = result.replace(/([A-Z])/g, (item) => ` ${item.charAt(0).toLowerCase()}${item.slice(1)}`);
    result = result.trim();
    result = result.replace(/\w\S*/g, (item) => `${item.charAt(0).toUpperCase()}${item.slice(1)}`);
    result = result.trim();

    return result;
}

export function brands(value: string): string {
    if (!value || value === "") return "";

    let results = value;

    results = results.replace(/myq/gi, "myQ");
    results = results.replace(/smartthings/gi, "SmartThings");
    results = results.replace(/smart things/gi, "SmartThings");
    results = results.replace(/smartapp/gi, "SmartApp");
    results = results.replace(/smart app/gi, "SmartApp");
    results = results.replace(/webos/gi, "WebOS");
    results = results.replace(/web os/gi, "WebOS");
    results = results.replace(/web o s/gi, "WebOS");
    results = results.replace(/macos/gi, "macOS");
    results = results.replace(/mac os/gi, "macOS");
    results = results.replace(/mac o s/gi, "macOS");

    return results;
}
