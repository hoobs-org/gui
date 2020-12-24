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
                async featured(): Promise<{ [key: string]: any }[]> {
                    const response = (await Request.get("https://plugins.hoobs.org/api/feed/featured")).data || {};

                    return response.results || [];
                },

                async popular(): Promise<{ [key: string]: any }[]> {
                    const response = (await Request.get("https://plugins.hoobs.org/api/feed/popular")).data || {};

                    return response.results || [];
                },

                async search(query: string, skip: number, limit: number): Promise<{ [key: string]: any }> {
                    const response = (await Request.get(`https://plugins.hoobs.org/api/search/${encodeURIComponent(query)}?skip=${skip}&limit=${limit}`)).data || {};

                    return {
                        results: response.results || [],
                        count: response.count || 0,
                    };
                },

                async details(identifier: string): Promise<{ [key: string]: any }> {
                    if (!identifier || identifier === "") return {};

                    const response = (await Request.get(`https://plugins.hoobs.org/api/plugin/${identifier}`)).data || {};

                    return response.results;
                },

                async reviews(identifier: string, skip: number, limit: number): Promise<{ [key: string]: any }> {
                    const response = (await Request.get(`https://plugins.hoobs.org/api/reviews/${identifier}?skip=${skip}&limit=${limit}`)).data || {};

                    return {
                        results: response.results || [],
                        count: response.count || 0,
                    };
                },

                title(value: string): string {
                    let result = (value || "").split("/").pop() || "";

                    if (!result || result === "") return "";

                    result = result.replace("homebridge-", "");
                    result = result.replace(/[-_]/gi, " ");
                    result = result.replace(/([A-Z])/g, (item) => ` ${item.charAt(0).toLowerCase()}${item.slice(1)}`);
                    result = result.trim();
                    result = result.replace(/\w\S*/g, (item) => `${item.charAt(0).toUpperCase()}${item.slice(1)}`);
                    result = result.trim();

                    result = result.replace(/myq/gi, "myQ");
                    result = result.replace(/smartthings/gi, "SmartThings");
                    result = result.replace(/smart things/gi, "SmartThings");
                    result = result.replace(/smartapp/gi, "SmartApp");
                    result = result.replace(/smart app/gi, "SmartApp");
                    result = result.replace(/webos/gi, "WebOS");
                    result = result.replace(/web os/gi, "WebOS");
                    result = result.replace(/web o s/gi, "WebOS");
                    result = result.replace(/macos/gi, "macOS");
                    result = result.replace(/mac os/gi, "macOS");
                    result = result.replace(/mac o s/gi, "macOS");

                    return result;
                },
            }),
        },
    };
}
