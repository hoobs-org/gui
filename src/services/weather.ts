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
}
