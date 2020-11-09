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
import Sanitize from "sanitize-filename";

const API_URL = process.env.VUE_APP_API || "/api";
const BACKUPS_URL = process.env.VUE_APP_BACKUPS || "/backups";

export declare const enum LogLevel {
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    DEBUG = "debug",
}

export interface Message {
    level: LogLevel;
    instance?: string;
    display?: string;
    timestamp: number;
    plugin?: string;
    prefix?: string;
    message: string;
}

export interface InstanceRecord {
    id: string;
    type: string;
    display: string;
    port: number;
    host?: string;
    service?: string;
    status?: () => Promise<{ [key: string]: any }>;
    config?: { [key: string]: any };
    plugins?: () => Promise<{ [key: string]: any }[]> | string;
    plugin?: { [key: string]: any };
    rename?: () => Promise<void>;
    accessories?: () => Promise<{ [key: string]: any }[]>;
    start?: () => Promise<void>;
    stop?: () => Promise<void>;
    restart?: () => Promise<void>;
    purge?: () => Promise<void>;
    cache?: () => Promise<{ [key: string]: any }>;
    remove?: () => Promise<boolean>;
}

export interface UserRecord {
    id: number;
    name: string;
    permissions: { [key: string]: boolean };
    username: string;
    update?: (username: string, password: string, name?: string, permissions?: { [key: string]: boolean }) => Promise<void>;
    remove?: () => Promise<void>;
}

export interface InputTheme {
    background: string;
    accent: string;
}

export interface TextTheme {
    default: string;
    highlight?: string;
    active?: string;
    input?: string;
    error?: string;
}

export interface ApplicationTheme {
    text: TextTheme;
    background: string;
    highlight: string;
    accent: string;
    dark: string;
    drawer: string;
    input: InputTheme;
    border: string;
}

export interface ButtonTheme {
    background: string;
    text: string;
    border: string;
    primary?: ButtonTheme;
    light?: ButtonTheme;
}

export interface ModalTheme {
    text: TextTheme;
    background: string;
    dark: string;
    form: string;
    mask: string;
    highlight: string;
    input: string;
    accent: string;
    border: string;
}

export interface WidgetTheme {
    text: TextTheme;
    background: string;
    highlight: string;
    border: string;
}

export interface MenuTheme {
    text: TextTheme;
    background: string;
    highlight: string;
    border: string;
}

export interface NavigationTheme {
    text: TextTheme;
    background: string;
    highlight: string;
    border: string;
}

export interface ElevationTheme {
    default: string;
    button: string;
}

export interface Theme {
    name: string;
    display: string;
    auto?: boolean;
    mode: string;
    transparency: string;
    application: ApplicationTheme;
    button: ButtonTheme;
    modal: ModalTheme;
    widget: WidgetTheme;
    menu: MenuTheme;
    navigation: NavigationTheme;
    splash: string;
    elevation: ElevationTheme;
}

export function sanitize(value: string, prevent?: string): string {
    if (!value || value === "") return "default";
    if (prevent && prevent !== "" && prevent.toLowerCase() === value.toLowerCase()) return "default";

    return Sanitize(value).toLowerCase().replace(/ /gi, "-");
}

export function chunk(value: string, length: number) {
    let current = length;
    let previous = 0;

    const results = [];

    while (value[current]) {
        current += 1;

        if (value[current] === " ") {
            results.push(value.substring(previous, current));

            previous = current;
            current += length;
        }
    }

    results.push(value.substr(previous));

    return results.map((item) => item.trim());
}

export function sleep(timeout: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, timeout);
    });
}

export async function wait(saftey?: number): Promise<string> {
    try {
        return (await Request.get(`${API_URL}`)).data.version;
    } catch (error) {
        if ((saftey || 0) > 50) throw error;
    }

    await sleep(1000);

    return wait((saftey || 0) + 1);
}

export default function sdk(get: () => string, set: (token: string) => void) {
    return {
        async version(): Promise<string> {
            await wait();

            return (await Request.get(`${API_URL}`)).data.version;
        },

        async latest(): Promise<string> {
            return (((await Request.get("https://api.github.com/repos/hoobs-org/HOOBS/releases/latest")).data || {}).tag_name || "").replace(/v/gi, "");
        },

        auth: {
            async status(): Promise<string> {
                await wait();

                return (await Request.get(`${API_URL}/auth`, { headers: { authorization: get() } })).data.state;
            },

            async validate(): Promise<boolean> {
                await wait();

                return (await Request.get(`${API_URL}/auth/validate`, { headers: { authorization: get() } })).data.valid;
            },

            async disable(): Promise<void> {
                await wait();

                await Request.post(`${API_URL}/auth/disable`);
            },

            async login(username: string, password: string, remember?: boolean): Promise<boolean> {
                await wait();

                const { token } = (await Request.post(`${API_URL}/auth/logon`, { username, password, remember })).data;

                if (token) {
                    set(token);

                    return true;
                }

                return false;
            },

            async logout(): Promise<void> {
                await wait();

                await Request.get(`${API_URL}/auth/logout`, { headers: { authorization: get() } });

                set("");
            },
        },

        users: {
            async list(): Promise<UserRecord[]> {
                await wait();

                return (await Request.get(`${API_URL}/users`, { headers: { authorization: get() } })).data;
            },

            async add(username: string, password: string, name?: string, permissions?: { [key: string]: boolean }): Promise<UserRecord[]> {
                await wait();

                return (await Request.put(`${API_URL}/users`, {
                    name: name || username,
                    username,
                    password,
                    permissions,
                }, { headers: { authorization: get() } })).data;
            },
        },

        async user(id: number): Promise<UserRecord> {
            await wait();

            const results: UserRecord = (await Request.get(`${API_URL}/users/${id}`, { headers: { authorization: get() } })).data;

            results.update = async (username: string, password: string, name?: string, permissions?: { [key: string]: boolean }): Promise<void> => {
                await wait();

                (await Request.post(`${API_URL}/users/${id}`, {
                    name: name || username,
                    username,
                    password,
                    permissions,
                }, { headers: { authorization: get() } }));
            };

            results.remove = async () => {
                await wait();

                (await Request.delete(`${API_URL}/users/${id}`, { headers: { authorization: get() } }));
            };

            return results;
        },

        config: {
            get: async (): Promise<{ [key: string]: any }> => {
                await wait();

                return (await Request.get(`${API_URL}/config`, { headers: { authorization: get() } })).data;
            },

            update: async (data: { [key: string]: any }): Promise<void> => {
                await wait();

                (await Request.post(`${API_URL}/config`, data, { headers: { authorization: get() } }));
            },
        },

        async log(tail?: number): Promise<Message[]> {
            await wait();

            if (tail) return (await Request.get(`${API_URL}/log/${tail}`, { headers: { authorization: get() } })).data;

            return (await Request.get(`${API_URL}/log`)).data;
        },

        async status(): Promise<{ [key: string]: any }> {
            await wait();

            return (await Request.get(`${API_URL}/status`, { headers: { authorization: get() } })).data;
        },

        backup: {
            async execute(): Promise<string> {
                await wait();

                const { filename } = (await Request.get(`${API_URL}/system/backup`, { headers: { authorization: get() } })).data;

                return `${BACKUPS_URL}/${filename}`;
            },

            async catalog(count?: number): Promise<{ [key: string]: any }> {
                await wait();

                const list = ((await Request.get(`${API_URL}/system/backup/catalog`, { headers: { authorization: get() } })).data || []).reverse();

                if ((count || 5) <= 0) return list;

                return list.slice(0, (count || 5));
            },
        },

        restore: {
            async file(file: string): Promise<void> {
                await wait();
                await Request.get(`${API_URL}/system/restore?filename=${encodeURIComponent(file)}`, { headers: { authorization: get() } });
            },

            async upload(file: Blob): Promise<void> {
                await wait();

                const form = new FormData();

                form.append("file", file);

                (await Request.post(`${API_URL}/system/restore`, form, { headers: { authorization: get() } }));
            },
        },

        async system(): Promise<{ [key: string]: any }> {
            await wait();

            const results = (await Request.get(`${API_URL}/system`, { headers: { authorization: get() } })).data;

            results.cpu = async (): Promise<{ [key: string]: any }> => {
                await wait();

                return (await Request.get(`${API_URL}/system/cpu`, { headers: { authorization: get() } })).data;
            };

            results.memory = async (): Promise<{ [key: string]: any }> => {
                await wait();

                return (await Request.get(`${API_URL}/system/memory`, { headers: { authorization: get() } })).data;
            };

            results.network = async (): Promise<{ [key: string]: any }> => {
                await wait();

                return (await Request.get(`${API_URL}/system/network`, { headers: { authorization: get() } })).data;
            };

            results.filesystem = async (): Promise<{ [key: string]: any }> => {
                await wait();

                return (await Request.get(`${API_URL}/system/filesystem`, { headers: { authorization: get() } })).data;
            };

            results.activity = async (): Promise<{ [key: string]: any }> => {
                await wait();

                return (await Request.get(`${API_URL}/system/activity`, { headers: { authorization: get() } })).data;
            };

            results.temp = async (): Promise<{ [key: string]: any } | undefined> => {
                await wait();

                const info = (await Request.get(`${API_URL}/system/temp`, { headers: { authorization: get() } })).data;

                if (info.main === -1) return undefined;

                return info;
            };

            results.upgrade = async (): Promise<void> => {
                await wait();
                await Request.post(`${API_URL}/system/upgrade`, null, { headers: { authorization: get() } });
            };

            results.reboot = async (): Promise<void> => {
                await wait();
                await Request.put(`${API_URL}/system/reboot`, null, { headers: { authorization: get() } });
            };

            results.reset = async (): Promise<void> => {
                await wait();
                await Request.put(`${API_URL}/system/reset`, null, { headers: { authorization: get() } });
            };

            return results;
        },

        extentions: {
            async list(): Promise<{ [key: string]: any }[]> {
                await wait();

                return (await Request.get(`${API_URL}/extentions`, { headers: { authorization: get() } })).data;
            },

            async add(name: string): Promise<boolean> {
                await wait();

                (await Request.put(`${API_URL}/extentions/${name}`, null, { headers: { authorization: get() } }));

                const current = (await Request.get(`${API_URL}/extentions`, { headers: { authorization: get() } })).data || [];

                return (current.findIndex((e: { [key: string]: string | boolean}) => e.feature === name && e.enabled) >= 0);
            },

            async remove(name: string): Promise<boolean> {
                await wait();

                (await Request.delete(`${API_URL}/extentions/${name}`, { headers: { authorization: get() } }));

                const current = (await Request.get(`${API_URL}/extentions`, { headers: { authorization: get() } })).data || [];

                return (current.findIndex((e: { [key: string]: string | boolean}) => e.feature === name && e.enabled) === -1);
            },
        },

        async plugins(): Promise<{ [key: string]: any }[]> {
            await wait();

            return (await Request.get(`${API_URL}/plugins`, { headers: { authorization: get() } })).data;
        },

        instances: {
            async count(): Promise<number> {
                await wait();

                return (await Request.get(`${API_URL}/instances/count`)).data.instances;
            },

            async list(): Promise<InstanceRecord[]> {
                await wait();

                return (await Request.get(`${API_URL}/instances`, { headers: { authorization: get() } })).data;
            },

            async add(name: string, port: number): Promise<boolean> {
                await wait();

                const current = (await Request.get(`${API_URL}/instances`, { headers: { authorization: get() } })).data || [];

                if (!port || Number.isNaN(port)) return false;
                if (port < 1 || port > 65535) return false;
                if (current.findIndex((n: any) => n.port === port) >= 0) return false;
                if (current.findIndex((n: any) => n.id === sanitize(name)) >= 0) return false;

                const results = (await Request.put(`${API_URL}/instances`, { name, port }, { headers: { authorization: get() } })).data || [];

                if (results.findIndex((n: any) => n.id === sanitize(name)) >= 0) return true;

                return false;
            },
        },

        async instance(name: string): Promise<InstanceRecord | undefined> {
            await wait();

            const id = sanitize(name);

            if (!name || name === "") return undefined;
            if (id === "api") return undefined;

            const current = (await Request.get(`${API_URL}/instances`, { headers: { authorization: get() } })).data || [];
            const index = current.findIndex((n: any) => n.id === id);

            if (index === -1) return undefined;

            const results = current[index];

            results.status = async (): Promise<{ [key: string]: any }> => (await Request.get(`${API_URL}/bridge/${id}`, { headers: { authorization: get() } })).data;

            results.config = {
                get: async (): Promise<{ [key: string]: any }> => {
                    await wait();

                    return (await Request.get(`${API_URL}/config/${id}`, { headers: { authorization: get() } })).data;
                },

                update: async (data: { [key: string]: any }): Promise<void> => {
                    await wait();

                    (await Request.post(`${API_URL}/config/${id}`, data, { headers: { authorization: get() } }));
                },
            };

            results.plugins = {
                list: async (): Promise<{ [key: string]: any }[]> => {
                    await wait();

                    return (await Request.get(`${API_URL}/plugins/${id}`, { headers: { authorization: get() } })).data;
                },

                install: async (identifier: string): Promise<void> => {
                    await wait();

                    (await Request.put(`${API_URL}/plugins/${id}/${identifier}`, null, { headers: { authorization: get() } }));
                },

                upgrade: async (identifier: string): Promise<void> => {
                    await wait();

                    (await Request.post(`${API_URL}/plugins/${id}/${identifier}`, null, { headers: { authorization: get() } }));
                },

                uninstall: async (identifier: string): Promise<void> => {
                    await wait();

                    (await Request.delete(`${API_URL}/plugins/${id}/${identifier}`, { headers: { authorization: get() } }));
                },
            };

            results.rename = async (value: string): Promise<void> => {
                await wait();

                (await Request.post(`${API_URL}/instance/${id}`, { name: value }, { headers: { authorization: get() } }));
            };

            results.accessories = async (): Promise<{ [key: string]: any }[]> => {
                await wait();

                return (await Request.get(`${API_URL}/accessories/${id}`, { headers: { authorization: get() } })).data;
            };

            results.start = async (): Promise<void> => {
                await wait();

                (await Request.get(`${API_URL}/bridge/${id}/start`, { headers: { authorization: get() } }));
            };

            results.stop = async (): Promise<void> => {
                await wait();

                (await Request.get(`${API_URL}/bridge/${id}/stop`, { headers: { authorization: get() } }));
            };

            results.restart = async (): Promise<void> => {
                await wait();

                (await Request.get(`${API_URL}/bridge/${id}/restart`, { headers: { authorization: get() } }));
            };

            results.purge = async (): Promise<void> => {
                await wait();

                (await Request.post(`${API_URL}/bridge/${id}/purge`, null, { headers: { authorization: get() } }));
            };

            results.cache = async (): Promise<{ [key: string]: any }> => {
                await wait();

                return (await Request.get(`${API_URL}/cache/${id}`, { headers: { authorization: get() } })).data;
            };

            results.remove = async (): Promise<boolean> => {
                await wait();

                const updated = (await Request.delete(`${API_URL}/instance/${id}`, { headers: { authorization: get() } })).data || [];

                if (updated.findIndex((n: any) => n.id === id) >= 0) return false;

                return true;
            };

            return results;
        },

        async accessories(): Promise<{ [key: string]: any }[]> {
            await wait();

            return (await Request.get(`${API_URL}/accessories`, { headers: { authorization: get() } })).data;
        },

        async accessory(instance: string, aid: string): Promise<{ [key: string]: any }> {
            await wait();

            const results = (await Request.get(`${API_URL}/accessory/${instance}/${aid}`, { headers: { authorization: get() } })).data;

            results.control = async (iid: string, data: { [key: string]: any }): Promise<void> => {
                await wait();

                (await Request.put(`${API_URL}/accessory/${instance}/${aid}/${iid}`, data, { headers: { authorization: get() } }));
            };

            return results;
        },

        theme: {
            async get(name: string): Promise<Theme> {
                await wait();

                return (await Request.get(`${API_URL}/theme/${name}`, { headers: { authorization: get() } })).data;
            },

            async save(name: string, theme: Theme) {
                await wait();

                (await Request.post(`${API_URL}/theme/${name}`, theme, { headers: { authorization: get() } }));
            },

            async backdrop(image: Blob): Promise<string> {
                await wait();

                const form = new FormData();

                form.append("file", image);

                return (await Request.post(`${API_URL}/themes/backdrop`, form, { headers: { authorization: get() } })).data.filename;
            },
        },

        async location(query: string, count?: number): Promise<{ [key: string]: number | string }> {
            await wait();

            return (await Request.get(`${API_URL}/weather/location?query=${encodeURIComponent(query)}&count=${count || 5}`, { headers: { authorization: get() } })).data;
        },

        weather: {
            async current(): Promise<{ [key: string]: any }> {
                await wait();

                return (await Request.get(`${API_URL}/weather/current`, { headers: { authorization: get() } })).data;
            },

            async forecast(): Promise<{ [key: string]: any }[]> {
                await wait();

                return (await Request.get(`${API_URL}/weather/forecast`, { headers: { authorization: get() } })).data;
            },
        },

        remote: {
            async status(): Promise<{ [key: string]: any }> {
                await wait();

                return (await Request.get(`${API_URL}/remote`, { headers: { authorization: get() } })).data;
            },

            async connect(): Promise<{ [key: string]: any }> {
                await wait();

                return (await Request.get(`${API_URL}/remote/start`, { headers: { authorization: get() } })).data;
            },

            async disconnect(): Promise<void> {
                await wait();

                (await Request.get(`${API_URL}/remote/disconnect`, { headers: { authorization: get() } }));
            },
        },

        mixin() {
            return { computed: { $hoobs: () => this } };
        },
    };
}
