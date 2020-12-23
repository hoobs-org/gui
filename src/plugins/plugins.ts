/* eslint-disable class-methods-use-this */

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

export default function plugins(): { [key: string]: any } {
    return {
        computed: {
            $plugins: () => ({
                async featured() {
                    const response = (await Request.get("https://plugins.hoobs.org/api/feed/featured")).data || {};

                    return response.results;
                },

                async popular() {
                    const response = (await Request.get("https://plugins.hoobs.org/api/feed/popular")).data || {};

                    return response.results;
                },
            }),
        },
    };
}
