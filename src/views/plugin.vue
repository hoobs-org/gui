<!-------------------------------------------------------------------------------------------------
 | hoobs-gui                                                                                      |
 | Copyright (C) 2020 HOOBS                                                                       |
 |                                                                                                |
 | This program is free software: you can redistribute it and/or modify                           |
 | it under the terms of the GNU General Public License as published by                           |
 | the Free Software Foundation, either version 3 of the License, or                              |
 | (at your option) any later version.                                                            |
 |                                                                                                |
 | This program is distributed in the hope that it will be useful,                                |
 | but WITHOUT ANY WARRANTY; without even the implied warranty of                                 |
 | MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the                                  |
 | GNU General Public License for more details.                                                   |
 |                                                                                                |
 | You should have received a copy of the GNU General Public License                              |
 | along with this program.  If not, see <http://www.gnu.org/licenses/>.                          |
 -------------------------------------------------------------------------------------------------->

<template>
    <div v-if="user.permissions.plugins" id="plugin">
        <context />
        <div class="content">
            <list class="desktop" value="id" display="display" :values="sections" :selected="from" initial="library" controller="plugins" :query="query" />
            <div v-if="!loading" class="screen">
                <div class="nav mobile">
                    <router-link :to="navigate('plugins', from, query)" class="back">
                        <span class="icon">keyboard_arrow_left</span>
                        {{ $t("back") }}
                    </router-link>
                </div>
                <div class="header">
                    <div class="image">
                        <img :src="icon()" />
                    </div>
                    <div class="title">
                        <rating :value="plugin.rating" />
                        <h1>{{ $plugins.title(plugin.name) }}</h1>
                        <div v-if="(plugin.tags && plugin.tags.latest) || plugin.version" class="version">{{ plugin.version || plugin.tags.latest }} • Published {{ $dates.age(plugin.published) }}</div>
                    </div>
                </div>
                <div class="header">
                    <div class="actions">
                        <div v-if="installed.length > 0" v-on:click="uninstall()" class="button">{{ $t("plugin_uninstall") }}</div>
                        <div v-if="!updated" v-on:click="update()" class="button">{{ $t("plugin_update") }}</div>
                        <div v-on:click="install()" :class="installed.length > 0 ? 'button' : 'button primary'">{{ $t("plugin_install") }}</div>
                        <router-link v-if="installed.length > 0" :to="`/config/${identifier}`" class="button primary">{{ $t("configuration") }}</router-link>
                    </div>
                </div>
                <tabs :values="tabs" v-on:change="change" :value="section" />
                <div ref="layout" class="layout">
                    <div v-if="section === 'details'" class="section">
                        <div class="markdown" v-html="readme()"></div>
                    </div>
                    <div v-if="section === 'reviews'" class="section">
                        <reviews :identifier="identifier" />
                    </div>
                    <div v-if="section === 'versions'" class="section">
                        <div class="heading">{{ $t("tags") }}</div>
                        <div v-for="(tag, index) in releases.tags" :key="`tag:${index}`" class="version">
                            <div v-on:click="install(tag.tag, true)" class="icon" :title="$t('plugin_install')">cloud_download</div>
                            <div v-on:click="install(tag.tag, true)" class="value">{{ tag.version }}</div>
                            <div class="fill"></div>
                            <div class="value">{{ tag.tag }}</div>
                        </div>
                        <div class="heading">{{ $t("releases") }}</div>
                        <div v-for="(release, index) in releases.versions" :key="`version:${index}`" class="version">
                            <div v-on:click="install(release.version, true)" class="icon" :title="$t('plugin_install')">cloud_download</div>
                            <div v-on:click="install(release.version, true)" class="value" :title="$t('plugin_install')">{{ release.version }}</div>
                            <div class="fill"></div>
                            <div class="value">{{ $dates.age(release.published) }}</div>
                        </div>
                    </div>
                    <detail :plugin="plugin" :installed="installed" />
                </div>
            </div>
            <div v-else class="loading">
                <spinner />
            </div>
        </div>
        <instances v-if="select.show" :type="select.type" :plugin="plugin" :values="select.values" :select="select.select" :close="() => { select.show = false; }" />
    </div>
</template>

<script>
    import { Wait } from "@hoobs/sdk/lib/wait";
    import Semver from "compare-versions";
    import crypto from "crypto";
    import identicon from "identicon.js";
    import Tabs from "../components/elements/tabs.vue";
    import List from "../components/elements/list.vue";
    import Detail from "../components/elements/detail.vue";
    import Rating from "../components/elements/rating.vue";
    import Reviews from "../components/elements/reviews.vue";
    import Instances from "../components/dialogs/instances.vue";

    export default {
        name: "plugin",

        components: {
            "tabs": Tabs,
            "list": List,
            "detail": Detail,
            "rating": Rating,
            "reviews": Reviews,
            "instances": Instances,
        },

        props: {
            name: String,
            scope: String,
        },

        computed: {
            user() {
                return this.$store.state.user;
            },

            updated() {
                return this.installed.filter((item) => !item.updated).length === 0;
            },
        },

        watch: {
            section() {
                this.top();
            },
        },

        data() {
            return {
                loading: true,
                tabs: [
                    {
                        value: "details",
                        display: this.$t("details"),
                    },
                    {
                        value: "reviews",
                        display: this.$t("reviews"),
                    },
                    {
                        value: "versions",
                        display: this.$t("versions"),
                    },
                ],
                select: {
                    show: false,
                    type: "",
                    title: "",
                    values: [],
                    select: () => { /* null */ },
                },
                section: "details",
                sections: [],
                instances: [],
                identifier: "",
                installed: [],
                available: [],
                plugin: {},
                releases: {},
                query: "",
                from: "",
            };
        },

        beforeRouteEnter(to, from, next) {
            next((view) => {
                const incoming = view;
                const action = (from.path || "").split("/").pop();

                incoming.query = Object.keys(from.query).map((item) => `${item}=${from.query[item]}`).join("&");

                if (from.path === "/plugins") incoming.from = "library";
                if (action !== "" && action !== "plugins") incoming.from = action;
            });
        },

        async mounted() {
            this.identifier = this.name && this.name !== "" ? `${this.scope}/${this.name}` : this.scope;
            this.load(this.identifier);
        },

        methods: {
            async load(identifier) {
                this.loading = true;

                this.installed = [];
                this.available = [];
                this.plugin = {};
                this.active = null;
                this.current = null;
                this.homepage = null;
                this.repository = null;
                this.downloads = {};
                this.releases = {};

                this.instances = await this.$hoobs.instances.list();

                this.sections = [{
                    id: "library",
                    display: this.$t("library"),
                }, ...this.instances];

                if (identifier && identifier !== "") {
                    this.plugin = await this.$plugins.details(identifier);

                    if (this.plugin) {
                        this.releases = this.versions(this.plugin);

                        const waits = [];

                        for (let i = 0; i < this.instances.length; i += 1) {
                            waits.push(new Promise((resolve) => {
                                this.$hoobs.instance(this.instances[i].id).then((instance) => {
                                    if (instance) {
                                        instance.plugins.list().then((results) => {
                                            const plugin = results.find((item) => item.identifier === identifier);

                                            if (plugin) {
                                                this.installed.push({
                                                    id: this.instances[i].id,
                                                    display: this.instances[i].display,
                                                    version: plugin.version,
                                                    updated: Semver.compare(plugin.version, plugin.latest, ">="),
                                                });
                                            }

                                            resolve();
                                        });
                                    } else {
                                        resolve();
                                    }
                                });
                            }));
                        }

                        Promise.all(waits).then(() => {
                            this.intersect();
                            this.loading = false;
                        });
                    } else {
                        this.loading = false;
                    }
                } else {
                    this.loading = false;
                }
            },

            install(tag, all) {
                this.select.type = "install";

                if (all) {
                    this.select.values = [...this.available, ...this.installed];
                } else {
                    this.select.values = this.available;
                }

                this.select.select = (data) => {
                    this.select.show = false;
                    this.loading = true;

                    const waits = [];

                    if (typeof data === "string") {
                        waits.push(new Promise((resolve) => {
                            this.$hoobs.instance(data).then((instance) => {
                                if (instance) {
                                    instance.plugins.install(`${this.identifier}@${tag || "latest"}`).then(() => {
                                        resolve();
                                    });
                                } else {
                                    resolve();
                                }
                            });
                        }));
                    } else {
                        waits.push(new Promise((resolve) => {
                            this.$hoobs.instances.add(data.display, data.port, data.pin, data.username).then(() => {
                                setTimeout(() => {
                                    Wait().then(() => {
                                        this.$hoobs.instance(data.id).then((instance) => {
                                            if (instance) {
                                                instance.plugins.install(`${this.identifier}@${tag || "latest"}`).then(() => {
                                                    this.$store.commit("SETTINGS:UPDATE");

                                                    resolve();
                                                });
                                            } else {
                                                resolve();
                                            }
                                        });
                                    });
                                }, 3000);
                            });
                        }));
                    }

                    Promise.all(waits).then(() => {
                        setTimeout(() => {
                            Wait().then(() => {
                                this.load(this.identifier);
                            });
                        }, 500);
                    });
                };

                this.select.show = true;
            },

            uninstall() {
                this.select.type = "uninstall";
                this.select.values = this.installed;

                this.select.select = (id, remove) => {
                    this.select.show = false;
                    this.loading = true;

                    this.$hoobs.instance(id).then((instance) => {
                        const waits = [];

                        if (instance) {
                            waits.push(new Promise((resolve) => {
                                instance.plugins.uninstall(this.identifier).then(() => {
                                    setTimeout(() => {
                                        if (remove) {
                                            instance.plugins.list().then((plugins) => {
                                                if (plugins.length === 0) {
                                                    instance.remove().then(() => {
                                                        setTimeout(() => {
                                                            this.$store.commit("SETTINGS:UPDATE");

                                                            resolve();
                                                        }, 3000);
                                                    });
                                                } else {
                                                    resolve();
                                                }
                                            });
                                        } else {
                                            resolve();
                                        }
                                    }, 500);
                                });
                            }));
                        }

                        Promise.all(waits).then(() => {
                            setTimeout(() => {
                                Wait().then(() => {
                                    this.load(this.identifier);
                                });
                            }, 500);
                        });
                    });
                };

                this.select.show = true;
            },

            update() {
                this.loading = true;

                const waits = [];

                for (let i = 0; i < this.installed.length; i += 1) {
                    waits.push(new Promise((resolve) => {
                        this.$hoobs.instance(this.installed[i].id).then((instance) => {
                            instance.plugins.upgrade(`${this.identifier}@latest`).then(() => {
                                resolve();
                            });
                        });
                    }));
                }

                Promise.all(waits).then(() => {
                    setTimeout(() => {
                        Wait().then(() => {
                            this.load(this.identifier);
                        });
                    }, 500);
                });
            },

            locate(ref) {
                let element = null;

                if (this.$refs[ref].constructor.name === "HTMLDivElement") {
                    element = this.$refs[ref];
                } else if (this.$refs[ref].constructor.name === "Array" && this.$refs[ref][0].constructor.name === "HTMLDivElement") {
                    element = this.$refs[ref][0]; // eslint-disable-line prefer-destructuring
                }

                if (element) {
                    try {
                        return {
                            element,
                            position: element.getBoundingClientRect(),
                        };
                    } catch (_error) {
                        return null;
                    }
                }

                return null;
            },

            versions(plugin) {
                const tags = Object.keys(plugin.tags || {}).filter((tag) => plugin.times[plugin.tags[tag]]).map((tag) => ({
                    tag,
                    version: plugin.tags[tag],
                    published: plugin.times[plugin.tags[tag]],
                }));

                const versions = Object.keys(plugin.versions).reverse().filter((key) => plugin.times[key]).map((key) => ({
                    version: key,
                    published: plugin.times[key],
                }));

                return {
                    tags,
                    versions,
                };
            },

            intersect() {
                const instances = this.instances.map((item) => item.id);
                const installed = this.installed.map((item) => item.id);
                const available = instances.filter((item) => item !== "library" && installed.indexOf(item) === -1);

                this.available = [];

                for (let i = 0; i < available.length; i += 1) {
                    const instance = this.instances.find((item) => item.id === available[i]);

                    if (instance) {
                        this.available.push({
                            id: instance.id,
                            display: instance.display,
                        });
                    }
                }
            },

            change(value) {
                this.section = value;
            },

            readme() {
                if (this.plugin.curated) return this.$markdown(this.plugin.curated);
                if (this.plugin.readme) return this.$markdown(this.plugin.readme);
                if (this.plugin.details) return this.$markdown(this.plugin.details);

                const keys = Object.keys(this.plugin.versions);

                for (let i = 0; i < keys.length; i += 1) {
                    const { ...version } = this.plugin.versions[keys[i]];

                    if (version.readme) return this.$markdown(version.readme);
                }

                return this.$markdown(this.plugin.description);
            },

            navigate(controller, action, query) {
                let path = `/${controller}`;

                if (action && action !== "") path = `${path}/${action}`;
                if (query && query !== "") path = `${path}?${query}`;

                return path;
            },

            icon() {
                if (this.plugin.icon) {
                    return this.plugin.icon;
                }

                const hash = crypto.createHash("md5").update(this.plugin.name).digest("hex");

                return `data:image/png;base64,${new identicon(hash, { background: [0, 0, 0, 0], size: 128 }).toString()}`; // eslint-disable-line new-cap
            },

            top() {
                this.$refs.layout.scrollTo(0, 0);
            },
        },
    };
</script>

<style lang="scss" scoped>
    #plugin {
        position: relative;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .content {
            flex: 1;
            display: flex;
            overflow: hidden;

            .screen {
                flex: 1;
                display: flex;
                margin: 0 20px 20px 20px;
                color: var(--widget-text);
                background: var(--widget-background);
                backdrop-filter: var(--transparency);
                overflow: hidden;

                .header {
                    max-width: 950px;
                    display: flex;
                    flex-direction: row;
                    align-items: flex-end;
                    margin: 20px 10px 20px 20px;
                    user-select: none;

                    .image {
                        margin: 0 10px 0 0;
                        border: 1px var(--application-border) solid;
                        border-radius: 3px;

                        img {
                            width: 63px;
                            height: 63px;
                        }
                    }

                    .title {
                        flex: 1;

                        h1 {
                            margin: 0;
                            padding: 0;
                            line-height: normal;
                            font-size: 30px;
                            color: var(--application-highlight);
                        }

                        .version {
                            font-size: 14px;
                        }
                    }

                    .actions {
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                    }
                }

                .layout {
                    flex: 1;
                    padding: 0 20px 0 0;
                    display: flex;
                    flex-direction: row;
                    overflow: hidden;

                    .section {
                        flex: 1;
                        padding: 20px;
                        max-width: 950px;
                        overflow-wrap: break-word;
                        -ms-overflow-style: none;
                        overflow: auto;

                        &::-webkit-scrollbar {
                            display: none;
                        }

                        .heading {
                            display: flex;
                            flex-direction: row;
                            padding: 20px 0 10px 0;
                            border-bottom: 1px var(--application-border) solid;
                            color: var(--application-highlight);
                            margin: 0 10px 20px 7px;
                            user-select: none;

                            &:first-child {
                                padding: 0 0 10px 0;
                            }
                        }

                        .version {
                            display: flex;
                            flex-direction: row;
                            margin: 0 10px 0 7px;
                            font-size: 14px;
                            user-select: none;

                            .value {
                                white-space: nowrap;
                                cursor: pointer;

                                &:last-child {
                                    cursor: default;
                                }
                            }

                            .icon {
                                font-size: 17px;
                                padding: 0 7px 0 0;
                                cursor: pointer;
                                opacity: 0.7;

                                &:hover {
                                    opacity: 1;
                                }
                            }

                            &:hover {
                                .value {
                                    font-weight: bold;
                                }
                            }

                            .fill {
                                flex: 1;
                                margin: 0 7px;
                                height: 8px;
                                border-bottom: 1px var(--application-border) dashed;
                            }
                        }
                    }
                }

                .nav {
                    display: flex;
                    flex-direction: row;
                    padding: 20px 0 10px 0;
                    border-bottom: 1px var(--application-border) solid;
                    margin: 0 0 0 7px;
                    user-select: none;

                    &:first-child {
                        padding: 0 0 10px 0;
                    }
                }
            }
        }
    }

    @media (min-width: 300px) and (max-width: 815px) {
        #plugin {
            .content {
                .screen {
                    max-width: unset;
                    background: transparent;
                    backdrop-filter: unset;
                    padding: 0 20px 10px 20px;
                    margin: 0;

                    .layout {
                        flex-direction: column;
                        overflow: auto;

                        .section {
                            flex: unset;
                            padding: 0;
                            max-width: unset;
                            overflow: visible;
                            overflow-wrap: break-word;
                        }

                        .details {
                            width: unset;
                            overflow: visible;
                        }
                    }
                }
            }
        }
    }
</style>

<style lang="scss">
    .chart {
        flex: 1;
        height: 40px;
        overflow: hidden;

        svg {
            margin: 0;
        }

        .stroke {
            stroke: var(--application-highlight);
        }

        .fill {
            fill: var(--application-highlight);
            opacity: 0.3;
        }

        .active-line {
            stroke: var(--application-border);
        }

        .point {
            display: none;
        }

        .point.is-active {
            &.is-active {
                display: block;
            }
        }
    }
</style>
