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

let prefix = "/api";

if (process.env.NODE_ENV !== "production") {
    prefix = "http://localhost:50826/api";
}

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
    admin: boolean;
    username: string;
    update?: (username: string, password: string, name?: string, admin?: boolean) => Promise<void>;
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
    mobile: string;
    mask: string;
    highlight: string;
    input: string;
    accent: string;
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
    transparency: string;
    application: ApplicationTheme;
    button: ButtonTheme;
    modal: ModalTheme;
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

export function sleep(timeout: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, timeout);
    });
}

export async function wait(saftey?: number): Promise<string> {
    try {
        return (await Request.get(`${prefix}`)).data.version;
    } catch (error) {
        if ((saftey || 0) > 50) {
            throw error;
        }
    }

    await sleep(1000);

    return wait((saftey || 0) + 1);
}

export default function sdk(get: () => string, set: (token: string) => void) {
    return {
        async version(): Promise<string> {
            await wait();

            return (await Request.get(`${prefix}`)).data.version;
        },

        auth: {
            async status(): Promise<string> {
                await wait();

                return (await Request.get(`${prefix}/auth`, {
                    headers: {
                        authorization: get(),
                    },
                })).data.state;
            },

            async validate(): Promise<boolean> {
                await wait();

                return (await Request.get(`${prefix}/auth/validate`, {
                    headers: {
                        authorization: get(),
                    },
                })).data.valid;
            },

            async disable(): Promise<void> {
                await wait();

                await Request.post(`${prefix}/auth/disable`);
            },

            async login(username: string, password: string, remember?: boolean): Promise<boolean> {
                await wait();

                const { token } = (await Request.post(`${prefix}/auth/logon`, {
                    username,
                    password,
                    remember,
                })).data;

                if (token) {
                    set(token);

                    return true;
                }

                return false;
            },

            async logout(): Promise<void> {
                await wait();

                await Request.get(`${prefix}/auth/logout`, {
                    headers: {
                        authorization: get(),
                    },
                });

                set("");
            },
        },

        users: {
            async list(): Promise<UserRecord[]> {
                await wait();

                return (await Request.get(`${prefix}/users`, {
                    headers: {
                        authorization: get(),
                    },
                })).data;
            },

            async add(username: string, password: string, name?: string, admin?: boolean): Promise<UserRecord[]> {
                await wait();

                return (await Request.put(`${prefix}/users`, {
                    name: name || username,
                    username,
                    password,
                    admin,
                }, {
                    headers: {
                        authorization: get(),
                    },
                })).data;
            },
        },

        async user(id: number): Promise<UserRecord> {
            await wait();

            const results: UserRecord = (await Request.get(`${prefix}/users/${id}`, {
                headers: {
                    authorization: get(),
                },
            })).data;

            results.update = async (username: string, password: string, name?: string, admin?: boolean): Promise<void> => {
                await wait();

                (await Request.post(`${prefix}/users/${id}`, {
                    name: name || username,
                    username,
                    password,
                    admin,
                }, {
                    headers: {
                        authorization: get(),
                    },
                }));
            };

            results.remove = async () => {
                await wait();

                (await Request.delete(`${prefix}/users/${id}`, {
                    headers: {
                        authorization: get(),
                    },
                }));
            };

            return results;
        },

        config: {
            get: async (): Promise<{ [key: string]: any }> => {
                await wait();

                return (await Request.get(`${prefix}/config`, {
                    headers: {
                        authorization: get(),
                    },
                })).data;
            },

            update: async (data: { [key: string]: any }): Promise<void> => {
                await wait();

                (await Request.post(`${prefix}/config`, data, {
                    headers: {
                        authorization: get(),
                    },
                }));
            },
        },

        async log(tail?: number): Promise<Message[]> {
            await wait();

            if (tail) {
                return (await Request.get(`${prefix}/log/${tail}`, {
                    headers: {
                        authorization: get(),
                    },
                })).data;
            }

            return (await Request.get(`${prefix}/log`)).data;
        },

        async status(): Promise<{ [key: string]: any }> {
            await wait();

            return (await Request.get(`${prefix}/status`, {
                headers: {
                    authorization: get(),
                },
            })).data;
        },

        async backup(): Promise<{ [key: string]: any }> {
            await wait();

            return (await Request.get(`${prefix}/system/backup`, {
                headers: {
                    authorization: get(),
                },
            })).data;
        },

        async restore(form: FormData): Promise<void> {
            await wait();

            (await Request.post(`${prefix}/system/restore`, form, {
                headers: {
                    authorization: get(),
                },
            }));
        },

        async system(): Promise<{ [key: string]: any }> {
            await wait();

            const results = (await Request.get(`${prefix}/system`, {
                headers: {
                    authorization: get(),
                },
            })).data;

            results.cpu = async (): Promise<{ [key: string]: any }> => {
                await wait();

                return (await Request.get(`${prefix}/system/cpu`, {
                    headers: {
                        authorization: get(),
                    },
                })).data;
            };

            results.memory = async (): Promise<{ [key: string]: any }> => {
                await wait();

                return (await Request.get(`${prefix}/system/memory`, {
                    headers: {
                        authorization: get(),
                    },
                })).data;
            };

            results.network = async (): Promise<{ [key: string]: any }> => {
                await wait();

                return (await Request.get(`${prefix}/system/network`, {
                    headers: {
                        authorization: get(),
                    },
                })).data;
            };

            results.filesystem = async (): Promise<{ [key: string]: any }> => {
                await wait();

                return (await Request.get(`${prefix}/system/filesystem`, {
                    headers: {
                        authorization: get(),
                    },
                })).data;
            };

            results.activity = async (): Promise<{ [key: string]: any }> => {
                await wait();

                return (await Request.get(`${prefix}/system/activity`, {
                    headers: {
                        authorization: get(),
                    },
                })).data;
            };

            results.temp = async (): Promise<{ [key: string]: any } | undefined> => {
                await wait();

                const info = (await Request.get(`${prefix}/system/temp`, {
                    headers: {
                        authorization: get(),
                    },
                })).data;

                if (info.main === -1) {
                    return undefined;
                }

                return info;
            };

            results.upgrade = async (): Promise<void> => {
                await wait();

                (await Request.post(`${prefix}/system/upgrade`, null, {
                    headers: {
                        authorization: get(),
                    },
                }));
            };

            results.reboot = async (): Promise<void> => {
                await wait();

                (await Request.put(`${prefix}/system/reboot`, null, {
                    headers: {
                        authorization: get(),
                    },
                }));
            };

            results.reset = async (): Promise<void> => {
                await wait();

                (await Request.put(`${prefix}/system/reset`, null, {
                    headers: {
                        authorization: get(),
                    },
                }));
            };

            return results;
        },

        async extentions(): Promise<{ [key: string]: any }[]> {
            await wait();

            return (await Request.get(`${prefix}/extentions`, {
                headers: {
                    authorization: get(),
                },
            })).data;
        },

        extention: {
            async add(name: string): Promise<boolean> {
                await wait();

                (await Request.put(`${prefix}/extentions/${name}`, null, {
                    headers: {
                        authorization: get(),
                    },
                }));

                const current = (await Request.get(`${prefix}/extentions`, {
                    headers: {
                        authorization: get(),
                    },
                })).data || [];

                return (current.findIndex((e: { [key: string]: string | boolean}) => e.feature === name && e.enabled) >= 0);
            },

            async remove(name: string): Promise<boolean> {
                await wait();

                (await Request.delete(`${prefix}/extentions/${name}`, {
                    headers: {
                        authorization: get(),
                    },
                }));

                const current = (await Request.get(`${prefix}/extentions`, {
                    headers: {
                        authorization: get(),
                    },
                })).data || [];

                return (current.findIndex((e: { [key: string]: string | boolean}) => e.feature === name && e.enabled) === -1);
            },
        },

        async plugins(): Promise<{ [key: string]: any }[]> {
            await wait();

            return (await Request.get(`${prefix}/plugins`, {
                headers: {
                    authorization: get(),
                },
            })).data;
        },

        instances: {
            async count(): Promise<number> {
                await wait();

                return (await Request.get(`${prefix}/instances/count`)).data.instances;
            },

            async list(): Promise<InstanceRecord[]> {
                await wait();

                return (await Request.get(`${prefix}/instances`, {
                    headers: {
                        authorization: get(),
                    },
                })).data;
            },

            async add(name: string, port: number): Promise<boolean> {
                await wait();

                const current = (await Request.get(`${prefix}/instances`, {
                    headers: {
                        authorization: get(),
                    },
                })).data || [];

                if (!port || Number.isNaN(port)) return false;
                if (port < 1 || port > 65535) return false;
                if (current.findIndex((n: any) => n.port === port) >= 0) return false;
                if (current.findIndex((n: any) => n.id === sanitize(name)) >= 0) return false;

                const results = (await Request.put(`${prefix}/instances`, {
                    name,
                    port,
                }, {
                    headers: {
                        authorization: get(),
                    },
                })).data || [];

                if (results.findIndex((n: any) => n.id === sanitize(name)) >= 0) return true;

                return false;
            },
        },

        async instance(name: string): Promise<InstanceRecord | undefined> {
            await wait();

            const id = sanitize(name);

            if (!name || name === "") return undefined;
            if (id === "api") return undefined;

            const current = (await Request.get(`${prefix}/instances`, {
                headers: {
                    authorization: get(),
                },
            })).data || [];

            const index = current.findIndex((n: any) => n.id === id);

            if (index === -1) return undefined;

            const results = current[index];

            results.status = async (): Promise<{ [key: string]: any }> => (await Request.get(`${prefix}/bridge/${id}`, {
                headers: {
                    authorization: get(),
                },
            })).data;

            results.config = {
                get: async (): Promise<{ [key: string]: any }> => {
                    await wait();

                    return (await Request.get(`${prefix}/config/${id}`, {
                        headers: {
                            authorization: get(),
                        },
                    })).data;
                },

                update: async (data: { [key: string]: any }): Promise<void> => {
                    await wait();

                    (await Request.post(`${prefix}/config/${id}`, data, {
                        headers: {
                            authorization: get(),
                        },
                    }));
                },
            };

            results.plugins = async (): Promise<{ [key: string]: any }[]> => {
                await wait();

                return (await Request.get(`${prefix}/plugins/${id}`, {
                    headers: {
                        authorization: get(),
                    },
                })).data;
            };

            results.plugin = {
                install: async (identifier: string): Promise<void> => {
                    await wait();

                    (await Request.put(`${prefix}/plugins/${id}/${identifier}`, null, {
                        headers: {
                            authorization: get(),
                        },
                    }));
                },

                upgrade: async (identifier: string): Promise<void> => {
                    await wait();

                    (await Request.post(`${prefix}/plugins/${id}/${identifier}`, null, {
                        headers: {
                            authorization: get(),
                        },
                    }));
                },

                uninstall: async (identifier: string): Promise<void> => {
                    await wait();

                    (await Request.delete(`${prefix}/plugins/${id}/${identifier}`, {
                        headers: {
                            authorization: get(),
                        },
                    }));
                },
            };

            results.rename = async (value: string): Promise<void> => {
                await wait();

                (await Request.post(`${prefix}/instance/${id}`, {
                    name: value,
                }, {
                    headers: {
                        authorization: get(),
                    },
                }));
            };

            results.accessories = async (): Promise<{ [key: string]: any }[]> => {
                await wait();

                return (await Request.get(`${prefix}/accessories/${id}`, {
                    headers: {
                        authorization: get(),
                    },
                })).data;
            };

            results.start = async (): Promise<void> => {
                await wait();

                (await Request.get(`${prefix}/bridge/${id}/start`, {
                    headers: {
                        authorization: get(),
                    },
                }));
            };

            results.stop = async (): Promise<void> => {
                await wait();

                (await Request.get(`${prefix}/bridge/${id}/stop`, {
                    headers: {
                        authorization: get(),
                    },
                }));
            };

            results.restart = async (): Promise<void> => {
                await wait();

                (await Request.get(`${prefix}/bridge/${id}/restart`, {
                    headers: {
                        authorization: get(),
                    },
                }));
            };

            results.purge = async (): Promise<void> => {
                await wait();

                (await Request.get(`${prefix}/bridge/${id}/purge`, {
                    headers: {
                        authorization: get(),
                    },
                }));
            };

            results.cache = async (): Promise<{ [key: string]: any }> => {
                await wait();

                return (await Request.get(`${prefix}/cache/${id}`, {
                    headers: {
                        authorization: get(),
                    },
                })).data;
            };

            results.remove = async (): Promise<boolean> => {
                await wait();

                const updated = (await Request.delete(`${prefix}/instance/${id}`, {
                    headers: {
                        authorization: get(),
                    },
                })).data || [];

                if (updated.findIndex((n: any) => n.id === id) >= 0) return false;

                return true;
            };

            return results;
        },

        async accessories(): Promise<{ [key: string]: any }[]> {
            await wait();

            return (await Request.get(`${prefix}/accessories`, {
                headers: {
                    authorization: get(),
                },
            })).data;
        },

        async accessory(instance: string, aid: string): Promise<{ [key: string]: any }> {
            await wait();

            const results = (await Request.get(`${prefix}/accessory/${instance}/${aid}`, {
                headers: {
                    authorization: get(),
                },
            })).data;

            results.control = async (iid: string, data: { [key: string]: any }): Promise<void> => {
                await wait();

                (await Request.put(`${prefix}/accessory/${instance}/${aid}/${iid}`, data, {
                    headers: {
                        authorization: get(),
                    },
                }));
            };

            return results;
        },

        theme: {
            async get(name: string): Promise<Theme> {
                await wait();

                return (await Request.get(`${prefix}/theme/${name}`, {
                    headers: {
                        authorization: get(),
                    },
                })).data;
            },

            async save(name: string, theme: Theme) {
                await wait();

                (await Request.post(`${prefix}/theme/${name}`, theme, {
                    headers: {
                        authorization: get(),
                    },
                }));
            },

            async backdrop(form: FormData): Promise<string> {
                await wait();

                return (await Request.post(`${prefix}/themes/backdrop`, form, {
                    headers: {
                        authorization: get(),
                    },
                })).data.filename;
            },
        },

        remote: {
            async status(): Promise<{ [key: string]: any }> {
                await wait();

                return (await Request.get(`${prefix}/remote`, {
                    headers: {
                        authorization: get(),
                    },
                })).data;
            },

            async connect(): Promise<{ [key: string]: any }> {
                await wait();

                return (await Request.get(`${prefix}/remote/start`, {
                    headers: {
                        authorization: get(),
                    },
                })).data;
            },

            async disconnect(): Promise<void> {
                await wait();

                (await Request.get(`${prefix}/remote/disconnect`, {
                    headers: {
                        authorization: get(),
                    },
                }));
            },
        },
    };
}
