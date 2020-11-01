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

import Request from "axios";
import { Position } from "./maps";

const OPENWEATHER_KEY = process.env.VUE_APP_OPENWEATHER || "";

export default class Weather {
    static async search(position: Position, count?: number) {
        const results = (await Request.get(`https://api.openweathermap.org/data/2.5/find?lat=${position.lat}&lon=${position.lng}&cnt=${count || 5}&appid=${OPENWEATHER_KEY}`)).data || {};

        return (results.list || []).map((item: { [key: string]: any }) => ({
            id: item.id,
            name: item.name,
            country: item.sys.country,
        }));
    }

    static async current(id: number, units: string) {
        const results = (await Request.get(`https://api.openweathermap.org/data/2.5/weather?id=${id}&units=${units === "fahrenheit" ? "imperial" : "metric"}&appid=${OPENWEATHER_KEY}`)).data || {};

        return {
            units,
            weather: results.weather.main,
            description: results.weather.description,
            icon: results.weather.icon,
            temp: results.main.temp,
            min: results.main.temp_min,
            max: results.main.temp_max,
            windchill: results.main.feels_like,
            pressure: results.main.pressure,
            humidity: results.main.humidity / 100,
            visibility: results.visibility,
            wind: {
                speed: results.wind.speed,
                direction: results.wind.deg,
            },
        };
    }

    static async forecast(id: number, units: string) {
        const results: { [key: string]: any } = [];
        const list = ((await Request.get(`https://api.openweathermap.org/data/2.5/forecast?id=${id}&units=${units === "fahrenheit" ? "imperial" : "metric"}&appid=${OPENWEATHER_KEY}`)).data || {}).list || [];

        let day = "";
        let index = -1;
        let count = 0;

        let windchill = 0;
        let pressure = 0;
        let humidity = 0;
        let visibility = 0;
        let wind = 0;

        for (let i = 0; i < list.length; i += 1) {
            const { ...item } = list[i];
            const time = new Date(item.dt * 1000);

            if (`${time.getMonth() + 1}/${time.getDate()}/${time.getFullYear()}` !== day) {
                if (count > 0) {
                    results[index].windchill = windchill / count;
                    results[index].pressure = pressure / count;
                    results[index].humidity = (humidity / count) / 100;
                    results[index].visibility = visibility / count;
                    results[index].wind.speed = wind / count;
                }

                day = `${time.getMonth() + 1}/${time.getDate()}/${time.getFullYear()}`;
                index = results.length;
                count = 0;

                results.push({
                    units,
                    date: new Date(day),
                    weather: item.weather.main,
                    description: item.weather.description,
                    icon: item.weather.icon,
                    windchill: item.main.feels_like,
                    pressure: item.main.pressure,
                    humidity: item.main.humidity / 100,
                    visibility: item.visibility,
                    wind: {
                        speed: item.wind.speed,
                        direction: item.wind.deg,
                    },
                });
            }

            if (!item.main.temp_min || item.main.temp_min < results[index].min) results[index].min = item.main.temp_min;
            if (!item.main.temp_max || item.main.temp_max > results[index].max) results[index].min = item.main.temp_max;

            windchill += item.main.feels_like;
            pressure += item.main.pressure;
            humidity += item.main.humidity;
            visibility += item.main.visibility;
            wind += item.main.wind.speed;

            count += 1;
        }

        if (count > 0) {
            results[index].windchill = windchill / count;
            results[index].pressure = pressure / count;
            results[index].humidity = (humidity / count) / 100;
            results[index].visibility = visibility / count;
            results[index].wind.speed = wind / count;
        }

        return results;
    }
}
