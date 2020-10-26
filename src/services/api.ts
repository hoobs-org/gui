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

export function sanitize(value: string, prevent?: string): string {
    if (!value || value === "") return "default";
    if (prevent && prevent !== "" && prevent.toLowerCase() === value.toLowerCase()) return "default";

    return Sanitize(value).toLowerCase().replace(/ /gi, "-");
}

const api = (store: any) => ({
    data: () => ({
        api: {
            auth: {
                async status(): Promise<string> {
                    return (await Request.get(`${prefix}/auth`, {
                        headers: {
                            authorization: store.state.session,
                        },
                    })).data.state;
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
                async list() {
                    return (await Request.get(`${prefix}/users`, {
                        headers: {
                            authorization: store.state.session,
                        },
                    })).data;
                },

                async add(username: string, password: string, name?: string, admin?: boolean) {
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

            async user(id: number) {
                const results = (await Request.get(`${prefix}/users/${id}`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;

                results.update = async (username: string, password: string, name?: string, admin?: boolean) => {
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
            },

            config: {
                get: async () => (await Request.get(`${prefix}/config`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data,

                update: async (data: { [key: string]: any }) => {
                    (await Request.post(`${prefix}/config`, data, {
                        headers: {
                            authorization: store.state.session,
                        },
                    }));
                },
            },

            async log(tail?: number) {
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

            async status() {
                return (await Request.get(`${prefix}/status`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;
            },

            async backup() {
                return (await Request.get(`${prefix}/system/backup`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;
            },

            async restore(form: FormData) {
                (await Request.post(`${prefix}/system/restore`, form, {
                    headers: {
                        authorization: store.state.session,
                    },
                }));
            },

            async system() {
                const results = (await Request.get(`${prefix}/system`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;

                results.cpu = async () => (await Request.get(`${prefix}/system/cpu`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;

                results.memory = async () => (await Request.get(`${prefix}/system/memory`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;

                results.network = async () => (await Request.get(`${prefix}/system/network`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;

                results.filesystem = async () => (await Request.get(`${prefix}/system/filesystem`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;

                results.activity = async () => (await Request.get(`${prefix}/system/activity`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;

                results.temp = async () => {
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

                results.upgrade = async () => {
                    (await Request.post(`${prefix}/system/upgrade`, null, {
                        headers: {
                            authorization: store.state.session,
                        },
                    }));
                };

                results.reboot = async () => {
                    (await Request.put(`${prefix}/system/reboot`, null, {
                        headers: {
                            authorization: store.state.session,
                        },
                    }));
                };

                results.reset = async () => {
                    (await Request.put(`${prefix}/system/reset`, null, {
                        headers: {
                            authorization: store.state.session,
                        },
                    }));
                };
            },

            async extentions() {
                return (await Request.get(`${prefix}/extentions`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;
            },

            extention: {
                async add(name: string) {
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

                async remove(name: string) {
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

            async plugins() {
                return (await Request.get(`${prefix}/plugins`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;
            },

            instances: {
                async list() {
                    return (await Request.get(`${prefix}/instances`, {
                        headers: {
                            authorization: store.state.session,
                        },
                    })).data;
                },

                async add(name: string, port: number) {
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

            async instance(name: string) {
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

                results.status = async () => (await Request.get(`${prefix}/bridge/${id}`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;

                results.config = {
                    get: async () => (await Request.get(`${prefix}/config/${id}`, {
                        headers: {
                            authorization: store.state.session,
                        },
                    })).data,

                    update: async (data: { [key: string]: any }) => {
                        (await Request.post(`${prefix}/config/${id}`, data, {
                            headers: {
                                authorization: store.state.session,
                            },
                        }));
                    },
                };

                results.plugins = async () => (await Request.get(`${prefix}/plugins/${id}`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;

                results.plugin = {
                    install: async (identifier: string) => {
                        (await Request.put(`${prefix}/plugins/${id}/${identifier}`, null, {
                            headers: {
                                authorization: store.state.session,
                            },
                        }));
                    },

                    upgrade: async (identifier: string) => {
                        (await Request.post(`${prefix}/plugins/${id}/${identifier}`, null, {
                            headers: {
                                authorization: store.state.session,
                            },
                        }));
                    },

                    uninstall: async (identifier: string) => {
                        (await Request.delete(`${prefix}/plugins/${id}/${identifier}`, {
                            headers: {
                                authorization: store.state.session,
                            },
                        }));
                    },
                };

                results.rename = async (value: string) => {
                    (await Request.post(`${prefix}/instances/${id}`, {
                        name: value,
                    }, {
                        headers: {
                            authorization: store.state.session,
                        },
                    }));
                };

                results.accessories = async () => (await Request.get(`${prefix}/accessories/${id}`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;

                results.start = async () => {
                    (await Request.get(`${prefix}/bridge/${id}/start`, {
                        headers: {
                            authorization: store.state.session,
                        },
                    }));
                };

                results.stop = async () => {
                    (await Request.get(`${prefix}/bridge/${id}/stop`, {
                        headers: {
                            authorization: store.state.session,
                        },
                    }));
                };

                results.restart = async () => {
                    (await Request.get(`${prefix}/bridge/${id}/restart`, {
                        headers: {
                            authorization: store.state.session,
                        },
                    }));
                };

                results.purge = async () => {
                    (await Request.get(`${prefix}/bridge/${id}/purge`, {
                        headers: {
                            authorization: store.state.session,
                        },
                    }));
                };

                results.cache = async () => (await Request.get(`${prefix}/cache/${id}`, {
                    headers: {
                        authorization: store.state.session,
                    },
                })).data;

                results.remove = async () => {
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

            async accessories() {
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

                results.control = async (iid: string, data: { [key: string]: any }) => {
                    (await Request.put(`${prefix}/accessory/${instance}/${aid}/${iid}`, data, {
                        headers: {
                            authorization: store.state.session,
                        },
                    }));
                };

                return results;
            },

            remote: {
                async status() {
                    return (await Request.get(`${prefix}/remote`, {
                        headers: {
                            authorization: store.state.session,
                        },
                    })).data;
                },

                async connect() {
                    return (await Request.get(`${prefix}/remote/start`, {
                        headers: {
                            authorization: store.state.session,
                        },
                    })).data;
                },

                async disconnect() {
                    (await Request.get(`${prefix}/remote/disconnect`, {
                        headers: {
                            authorization: store.state.session,
                        },
                    }));
                },
            },
        },
    }),
});

export default api;
