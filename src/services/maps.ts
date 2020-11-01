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

const MAPQUEST_KEY = process.env.VUE_APP_MAPQUEST || "";

export interface Position {
    lat: number;
    lng: number;
}

export default class Maps {
    static geolocation(): Promise<Position> {
        return new Promise((resolve, reject) => {
            if (!("geolocation" in window.navigator)) {
                reject(new Error("geolocation not available"));
            } else {
                window.navigator.geolocation.getCurrentPosition((results) => {
                    resolve({
                        lat: results.coords.latitude,
                        lng: results.coords.longitude,
                    });
                });
            }
        });
    }

    static async geocode(query: string): Promise<Position> {
        const { results } = (await Request.get(`http://open.mapquestapi.com/geocoding/v1/address?key=${MAPQUEST_KEY}&location=${encodeURIComponent(query)}`)).data;

        return results[0].locations[0].latLng;
    }
}
