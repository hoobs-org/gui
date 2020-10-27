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
import { Store } from "vuex";

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

export function sanitize(value: string, prevent?: string): string {
    if (!value || value === "") return "default";
    if (prevent && prevent !== "" && prevent.toLowerCase() === value.toLowerCase()) return "default";

    return Sanitize(value).toLowerCase().replace(/ /gi, "-");
}

export default function sdk(store: Store<any>) {
    return {
        auth: {
            async status(): Promise<string> {
                return (await Request.get(`${prefix}/auth`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data.state;
            },

            async validate(): Promise<boolean> {
                return (await Request.get(`${prefix}/auth/validate`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data.valid;
            },

            async disable(): Promise<string> {
                return (await Request.post(`${prefix}/auth`, null, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data.session;
            },

            async login(username: string, password: string): Promise<boolean> {
                const { token } = (await Request.post(`${prefix}/auth/logon`, {
                    username,
                    password,
                }, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;

                if (token) {
                    store.commit("SESSION:SET", token);

                    return true;
                }

                return false;
            },
        },

        users: {
            async list(): Promise<UserRecord[]> {
                return (await Request.get(`${prefix}/users`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;
            },

            async add(username: string, password: string, name?: string, admin?: boolean): Promise<UserRecord[]> {
                return (await Request.put(`${prefix}/users`, {
                    name: name || username,
                    username,
                    password,
                    admin,
                }, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;
            },
        },

        async user(id: number): Promise<UserRecord> {
            const results: UserRecord = (await Request.get(`${prefix}/users/${id}`, {
                headers: {
                    authorization: store.state.session,
                },
            })).data;

            results.update = async (username: string, password: string, name?: string, admin?: boolean): Promise<void> => {
                (await Request.post(`${prefix}/users/${id}`, {
                    name: name || username,
                    username,
                    password,
                    admin,
                }, {
                    headers: {
                        authorization: store.state.session,
                    },
                }));
            };

            results.remove = async () => {
                (await Request.delete(`${prefix}/users/${id}`, {
                    headers: {
                        authorization: store.state.session,
                    },
                }));
            };

            return results;
        },

        config: {
            get: async (): Promise<{ [key: string]: any }> => (await Request.get(`${prefix}/config`, {
                headers: {
                    authorization: store.state.session,
                },
            })).data,

            update: async (data: { [key: string]: any }): Promise<void> => {
                (await Request.post(`${prefix}/config`, data, {
                    headers: {
                        authorization: store.state.session,
                    },
                }));
            },
        },

        async log(tail?: number): Promise<Message[]> {
            if (tail) {
                return (await Request.get(`${prefix}/log/${tail}`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;
            }

            return (await Request.get(`${prefix}/log`, {
                headers: {
                    authorization: store.state.session,
                },
            })).data;
        },

        async status(): Promise<{ [key: string]: any }> {
            return (await Request.get(`${prefix}/status`, {
                headers: {
                    authorization: store.state.session,
                },
            })).data;
        },

        async backup(): Promise<{ [key: string]: any }> {
            return (await Request.get(`${prefix}/system/backup`, {
                headers: {
                    authorization: store.state.session,
                },
            })).data;
        },

        async restore(form: FormData): Promise<void> {
            (await Request.post(`${prefix}/system/restore`, form, {
                headers: {
                    authorization: store.state.session,
                },
            }));
        },

        async system(): Promise<{ [key: string]: any }> {
            const results = (await Request.get(`${prefix}/system`, {
                headers: {
                    authorization: store.state.session,
                },
            })).data;

            results.cpu = async (): Promise<{ [key: string]: any }> => (await Request.get(`${prefix}/system/cpu`, {
                headers: {
                    authorization: store.state.session,
                },
            })).data;

            results.memory = async (): Promise<{ [key: string]: any }> => (await Request.get(`${prefix}/system/memory`, {
                headers: {
                    authorization: store.state.session,
                },
            })).data;

            results.network = async (): Promise<{ [key: string]: any }> => (await Request.get(`${prefix}/system/network`, {
                headers: {
                    authorization: store.state.session,
                },
            })).data;

            results.filesystem = async (): Promise<{ [key: string]: any }> => (await Request.get(`${prefix}/system/filesystem`, {
                headers: {
                    authorization: store.state.session,
                },
            })).data;

            results.activity = async (): Promise<{ [key: string]: any }> => (await Request.get(`${prefix}/system/activity`, {
                headers: {
                    authorization: store.state.session,
                },
            })).data;

            results.temp = async (): Promise<{ [key: string]: any } | undefined> => {
                const info = (await Request.get(`${prefix}/system/temp`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;

                if (info.main === -1) {
                    return undefined;
                }

                return info;
            };

            results.upgrade = async (): Promise<void> => {
                (await Request.post(`${prefix}/system/upgrade`, null, {
                    headers: {
                        authorization: store.state.session,
                    },
                }));
            };

            results.reboot = async (): Promise<void> => {
                (await Request.put(`${prefix}/system/reboot`, null, {
                    headers: {
                        authorization: store.state.session,
                    },
                }));
            };

            results.reset = async (): Promise<void> => {
                (await Request.put(`${prefix}/system/reset`, null, {
                    headers: {
                        authorization: store.state.session,
                    },
                }));
            };

            return results;
        },

        async extentions(): Promise<{ [key: string]: any }[]> {
            return (await Request.get(`${prefix}/extentions`, {
                headers: {
                    authorization: store.state.session,
                },
            })).data;
        },

        extention: {
            async add(name: string): Promise<boolean> {
                (await Request.put(`${prefix}/extentions/${name}`, null, {
                    headers: {
                        authorization: store.state.session,
                    },
                }));

                const current = (await Request.get(`${prefix}/extentions`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;

                return (current.findIndex((e: { [key: string]: string | boolean}) => e.feature === name && e.enabled) >= 0);
            },

            async remove(name: string): Promise<boolean> {
                (await Request.delete(`${prefix}/extentions/${name}`, {
                    headers: {
                        authorization: store.state.session,
                    },
                }));

                const current = (await Request.get(`${prefix}/extentions`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;

                return (current.findIndex((e: { [key: string]: string | boolean}) => e.feature === name && e.enabled) === -1);
            },
        },

        async plugins(): Promise<{ [key: string]: any }[]> {
            return (await Request.get(`${prefix}/plugins`, {
                headers: {
                    authorization: store.state.session,
                },
            })).data;
        },

        instances: {
            async list(): Promise<InstanceRecord[]> {
                return (await Request.get(`${prefix}/instances`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;
            },

            async add(name: string, port: number): Promise<boolean> {
                const current = (await Request.get(`${prefix}/instances`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;

                if (!port || Number.isNaN(port)) return false;
                if (port < 1 || port > 65535) return false;
                if (current.findIndex((n: any) => n.port === port) >= 0) return false;
                if (current.findIndex((n: any) => n.id === sanitize(name)) >= 0) return false;

                const results = (await Request.put(`${prefix}/instances`, {
                    name,
                    port,
                }, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;

                if (results.findIndex((n: any) => n.id === sanitize(name)) >= 0) return true;

                return false;
            },
        },

        async instance(name: string): Promise<InstanceRecord | undefined> {
            const id = sanitize(name);

            if (!name || name === "") return undefined;
            if (id === "api") return undefined;

            const current = (await Request.get(`${prefix}/instances`, {
                headers: {
                    authorization: store.state.session,
                },
            })).data;

            const index = current.findIndex((n: any) => n.id === id);

            if (index === -1) return undefined;

            const results = current[index];

            results.status = async (): Promise<{ [key: string]: any }> => (await Request.get(`${prefix}/bridge/${id}`, {
                headers: {
                    authorization: store.state.session,
                },
            })).data;

            results.config = {
                get: async (): Promise<{ [key: string]: any }> => (await Request.get(`${prefix}/config/${id}`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data,

                update: async (data: { [key: string]: any }): Promise<void> => {
                    (await Request.post(`${prefix}/config/${id}`, data, {
                        headers: {
                            authorization: store.state.session,
                        },
                    }));
                },
            };

            results.plugins = async (): Promise<{ [key: string]: any }[]> => (await Request.get(`${prefix}/plugins/${id}`, {
                headers: {
                    authorization: store.state.session,
                },
            })).data;

            results.plugin = {
                install: async (identifier: string): Promise<void> => {
                    (await Request.put(`${prefix}/plugins/${id}/${identifier}`, null, {
                        headers: {
                            authorization: store.state.session,
                        },
                    }));
                },

                upgrade: async (identifier: string): Promise<void> => {
                    (await Request.post(`${prefix}/plugins/${id}/${identifier}`, null, {
                        headers: {
                            authorization: store.state.session,
                        },
                    }));
                },

                uninstall: async (identifier: string): Promise<void> => {
                    (await Request.delete(`${prefix}/plugins/${id}/${identifier}`, {
                        headers: {
                            authorization: store.state.session,
                        },
                    }));
                },
            };

            results.rename = async (value: string): Promise<void> => {
                (await Request.post(`${prefix}/instances/${id}`, {
                    name: value,
                }, {
                    headers: {
                        authorization: store.state.session,
                    },
                }));
            };

            results.accessories = async (): Promise<{ [key: string]: any }[]> => (await Request.get(`${prefix}/accessories/${id}`, {
                headers: {
                    authorization: store.state.session,
                },
            })).data;

            results.start = async (): Promise<void> => {
                (await Request.get(`${prefix}/bridge/${id}/start`, {
                    headers: {
                        authorization: store.state.session,
                    },
                }));
            };

            results.stop = async (): Promise<void> => {
                (await Request.get(`${prefix}/bridge/${id}/stop`, {
                    headers: {
                        authorization: store.state.session,
                    },
                }));
            };

            results.restart = async (): Promise<void> => {
                (await Request.get(`${prefix}/bridge/${id}/restart`, {
                    headers: {
                        authorization: store.state.session,
                    },
                }));
            };

            results.purge = async (): Promise<void> => {
                (await Request.get(`${prefix}/bridge/${id}/purge`, {
                    headers: {
                        authorization: store.state.session,
                    },
                }));
            };

            results.cache = async (): Promise<{ [key: string]: any }> => (await Request.get(`${prefix}/cache/${id}`, {
                headers: {
                    authorization: store.state.session,
                },
            })).data;

            results.remove = async (): Promise<boolean> => {
                const updated = (await Request.delete(`${prefix}/instances/${id}`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;

                if (updated.findIndex((n: any) => n.id === id) >= 0) return false;

                return true;
            };

            return results;
        },

        async accessories(): Promise<{ [key: string]: any }[]> {
            return (await Request.get(`${prefix}/accessories`, {
                headers: {
                    authorization: store.state.session,
                },
            })).data;
        },

        async accessory(instance: string, aid: string): Promise<{ [key: string]: any }> {
            const results = (await Request.get(`${prefix}/accessory/${instance}/${aid}`, {
                headers: {
                    authorization: store.state.session,
                },
            })).data;

            results.control = async (iid: string, data: { [key: string]: any }): Promise<void> => {
                (await Request.put(`${prefix}/accessory/${instance}/${aid}/${iid}`, data, {
                    headers: {
                        authorization: store.state.session,
                    },
                }));
            };

            return results;
        },

        remote: {
            async status(): Promise<{ [key: string]: any }> {
                return (await Request.get(`${prefix}/remote`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;
            },

            async connect(): Promise<{ [key: string]: any }> {
                return (await Request.get(`${prefix}/remote/start`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;
            },

            async disconnect(): Promise<void> {
                (await Request.get(`${prefix}/remote/disconnect`, {
                    headers: {
                        authorization: store.state.session,
                    },
                }));
            },
        },
    };
}
