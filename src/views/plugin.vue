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
            <list class="desktop" value="id" display="display" :values="instances" :selected="from" initial="library" controller="plugins" :query="query" />
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
                        <div v-if="!updated" v-on:click="upgrade()" class="button">{{ $t("plugin_upgrade") }}</div>
                        <div v-if="available.length > 0" v-on:click="install('latest')" class="button primary">{{ $t("plugin_install") }}</div>
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
                            <div v-on:click="install(tag.tag)" class="icon" :title="$t('plugin_install')">cloud_download</div>
                            <div v-on:click="install(tag.tag)" class="value">{{ tag.version }}</div>
                            <div class="fill"></div>
                            <div class="value">{{ tag.tag }}</div>
                        </div>
                        <div class="heading">{{ $t("releases") }}</div>
                        <div v-for="(release, index) in releases.versions" :key="`version:${index}`" class="version">
                            <div v-on:click="install(release.version)" class="icon" :title="$t('plugin_install')">cloud_download</div>
                            <div v-on:click="install(release.version)" class="value">{{ release.version }}</div>
                            <div class="fill"></div>
                            <div class="value">{{ $dates.age(release.published) }}</div>
                        </div>
                    </div>
                    <div class="details">
                        <div v-if="plugin.certified" class="title">
                            <h1>{{ $t("certification") }}</h1>
                        </div>
                        <div v-if="plugin.certified" class="item">
                            <div class="tag">
                                <svg version="1.1" width="17" height="17" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 94.67 95.72">
                                    <path
                                        class="background"
                                        d="M74.54,0H17.13A17.28,17.28,0,0,0,0,17.32V75.4A17.28,17.28,0,0,0,17.13,92.72H74.54A17.28,17.28,0,0,0,91.67,75.4V17.32A17.28,17.28,0,0,0,74.54,0ZM50,67.47H47v8.1a4.06,4.06,0,
                                        0,1-4,4.05h-7.7v-3a5.47,5.47,0,0,0-10.93,0v3h-7.7a4.07,4.07,0,0,1-4.05-4.05V67.88h3a5.47,5.47,0,0,0,0-10.94h-3V49.25a4.07,4.07,0,0,1,4.05-4h8.1v-3a5.07,5.07,0,0,1,10.13,
                                        0v3H43a4.06,4.06,0,0,1,4,4v8.1h3a5.06,5.06,0,1,1,0,10.12ZM81.84,32.35a1.69,1.69,0,0,1-1.44,1.36A1.44,1.44,0,0,1,78.71,33c-.66-1.77-2.12-2.84-3.39-4.05a4.51,4.51,0,0,
                                        1-1.58-3.84c.08-1,0-2,0-3h0c0-1.33,0-2.65,0-4S73,16.71,72,16.73s-2.13-.17-2.2,1.31c0,1.2,0,2.4,0,3.6,0,.4.2,1-.19,1.15s-.67-.36-1-.62c-2.65-2.49-5.31-5-7.92-7.5a1.32,1.32,0,0,
                                        0-2.19,0Q49.91,23.35,41.23,32c-.75.75-.85,1.35,0,2,.19.16.35.35.53.53,1.14,1.11,1.31,1.08,2.52,0,3.78-3.46,7.33-7.16,11-10.74.77-.75,1.58-1.45,2.36-2.19a3.09,3.09,0,0,1,4.63,
                                        0c1.58,1.51,3.1,3.1,4.66,4.63,2.89,2.84,5.81,5.65,8.69,8.5,1.89,1.88,1.86,3.54,0,5.45-3,3-4.1,3-7.07,0-2.59-2.55-5.25-5-7.83-7.6-.81-.81-1.42-.72-2.18,0q-4.14,4.2-8.34,
                                        8.32c-.74.72-.74,1.31,0,2,.27.26.53.52.78.79a1.19,1.19,0,0,0,2,0c1.47-1.46,3-2.86,4.47-4.29a3.22,3.22,0,0,1,4.76-.11c1.66,1.55,3.29,3.14,4.9,4.75a3.14,3.14,0,0,1,0,4.56c-1.1,
                                        1.18-2.28,2.29-3.41,3.43a6.62,6.62,0,0,0-1.79,2.33,1.49,1.49,0,0,1-1.7,1,1.6,1.6,0,0,1-1.48-1.3,1.65,1.65,0,0,1,.87-2c2.37-1.12,3.72-3.35,5.61-5a.86.86,0,0,0,
                                        0-1.4l-4.49-4.45c-.6-.6-1.16-.44-1.72.1-1.48,1.44-3,2.85-4.48,4.29a3.27,3.27,0,0,1-4.76.2c-.41-.34-.78-.73-1.16-1.11-1.92-2-1.92-3.65,0-5.56,2.81-2.81,5.61-5.62,8.43-8.41,
                                        1.79-1.78,3.48-1.8,5.29-.05L70.79,39c1.2,1.17,1.34,1.15,2.78-.29,1.21-1.23,1.23-1.41,0-2.6C69.39,31.92,65.16,27.79,61,23.63c-.71-.71-1.28-.76-2-.06-1.94,1.91-3.9,3.8-5.86,
                                        5.7l-7.73,7.52a3.22,3.22,0,0,1-4.67.11c-3.07-2.77-3.83-4.23-.27-7.64C46,23.94,51.37,18.43,56.81,13c1.95-1.94,3.63-1.94,5.58-.05,1.33,1.29,2.7,2.55,4,3.83.55.53.92.85,1.22-.24a2.74,
                                        2.74,0,0,1,2.4-2,14.71,14.71,0,0,1,1.47-.17c3.45-.09,4.66,1.09,4.66,4.54,0,2.06,0,4.13,0,6.2A2.46,2.46,0,0,0,77,27.14c1.33,1.15,2.31,2.69,4,3.4A1.5,1.5,0,0,1,81.84,32.35Z"
                                    />
                                </svg>
                                <span>{{ $t("certified_hoobs") }}</span>
                            </div>
                        </div>
                        <div v-if="plugin.author && (plugin.author.name || plugin.author.username)" class="title">
                            <h1>{{ $t("author") }}</h1>
                        </div>
                        <div v-if="plugin.author && (plugin.author.name || plugin.author.username)" class="item">
                            <div class="tag">
                                <img class="gravatar" :src="plugin.gravitar" />
                                <span>{{ plugin.author.name || plugin.author.username }}</span>
                            </div>
                        </div>
                        <div v-if="downloads.data" class="title">
                            <h1>{{ $t("average_weekly_downloads") }}</h1>
                        </div>
                        <div v-if="downloads.data" class="item" style="padding: 0;">
                            <div class="count">
                                <div style="flex: 1;">
                                    <span v-if="active && current">{{ current }}</span>
                                    <span v-else>{{ downloads.average }}</span>
                                </div>
                                <div class="leader"></div>
                            </div>
                            <div class="chart">
                                <trend-chart :interactive="true" :datasets="[downloads]" :min="1" v-on:mouse-move="weekly" padding="0" />
                                <div class="leader"></div>
                            </div>
                        </div>
                        <div class="title">
                            <h1>Version</h1>
                            <h1>License</h1>
                        </div>
                        <div class="item">
                            <div class="value">{{ plugin.version || plugin.tags.latest }}</div>
                            <div class="value">{{ plugin.license || "" }}</div>
                        </div>
                        <div class="title">
                            <h1>{{ $t("homepage") }}</h1>
                        </div>
                        <div class="item">
                            <div class="value">
                                <a v-if="homepage" :href="homepage" target="_blank">
                                    <span class="icon">link</span>
                                    {{ domain(homepage) }}
                                </a>
                                <a :href="`https://plugins.hoobs.org/plugin/${identifier}`" target="_blank">
                                    <span class="icon">link</span>
                                    hoobs.org
                                </a>
                            </div>
                        </div>
                        <div v-if="repository" class="title">
                            <h1>{{ $t("repository") }}</h1>
                        </div>
                        <div v-if="repository" class="item">
                            <div class="value">
                                <a :href="repository" target="_blank">
                                    <span class="icon">code</span>
                                    {{ domain(repository) }}
                                </a>
                            </div>
                        </div>
                        <div class="title">
                            <h1>{{ $t("last_publish") }}</h1>
                        </div>
                        <div class="item">
                            <div class="value">{{ $dates.age(plugin.published) }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="loading">
                <spinner />
            </div>
        </div>
    </div>
</template>

<script>
    import Semver from "compare-versions";
    import crypto from "crypto";
    import Chart from "vue-trend-chart";
    import identicon from "identicon.js";
    import Tabs from "../components/elements/tabs.vue";
    import List from "../components/elements/list.vue";
    import Rating from "../components/elements/rating.vue";
    import Reviews from "../components/elements/reviews.vue";

    export default {
        name: "plugin",

        components: {
            "tabs": Tabs,
            "list": List,
            "trend-chart": Chart,
            "rating": Rating,
            "reviews": Reviews,
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
                section: "details",
                instances: [],
                identifier: "",
                installed: [],
                available: [],
                plugin: {},
                active: null,
                current: null,
                homepage: null,
                repository: null,
                downloads: {},
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
            this.instances = await this.$hoobs.instances.list();
            this.identifier = this.name && this.name !== "" ? `${this.scope}/${this.name}` : this.scope;

            this.instances.unshift({
                id: "library",
                display: this.$t("library"),
            });

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

                if (identifier && identifier !== "") {
                    this.plugin = await this.$plugins.details(identifier);

                    if (this.plugin) {
                        this.releases = this.versions(this.plugin);
                        this.downloads = this.stats(this.plugin);
                        this.homepage = this.url(this.plugin.homepage);
                        this.repository = this.url((this.plugin.repository || {}).url);

                        const waits = [];

                        for (let i = 0; i < this.instances.length; i += 1) {
                            waits.push(new Promise((resolve) => {
                                this.$hoobs.instance(this.instances[i].id).then((instance) => {
                                    if (instance) {
                                        instance.plugins.list().then((results) => {
                                            const plugin = results.find((item) => item.identifier === identifier);

                                            if (plugin) {
                                                this.installed.push({
                                                    instance: this.instances[i].id,
                                                    version: plugin.version,
                                                    latest: plugin.latest,
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

            async install(tag) {
                console.log(`hbs plugin add ${this.identifier}@${tag}`);
            },

            async uninstall() {
                console.log(`hbs plugin remove ${this.identifier}`);
            },

            async upgrade() {
                console.log(`hbs plugin upgrade ${this.identifier}`);
            },

            stats(plugin) {
                const points = [];

                let sum = 0;
                let total = 0;
                let count = 0;
                let average = 0;
                let last = null;

                if (plugin.downloads.length > 0) {
                    for (let i = 0; i < plugin.downloads.length; i += 1) {
                        if (plugin.downloads[i].downloads > 0 || sum > 0) {
                            sum += plugin.downloads[i].downloads;
                            total += plugin.downloads[i].downloads;
                            last = new Date(plugin.downloads[i].day);
                            count += 1;

                            if (i % 7 === 0 && count > 0) {
                                points.push({
                                    date: last,
                                    value: parseInt((total / count).toFixed(0), 10),
                                });

                                total = 0;
                                count = 0;
                            }
                        }
                    }

                    if (count > 0) {
                        points.push({
                            date: last,
                            value: parseInt((total / count).toFixed(0), 10),
                        });
                    }

                    average = parseInt((sum / plugin.downloads.length).toFixed(0), 10);
                }

                return {
                    data: points,
                    average,
                    smooth: true,
                    fill: true,
                };
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

            weekly(value) {
                this.active = null;
                this.current = null;

                if (value && value.data[0]) {
                    this.active = value.data[0].date;
                    this.current = value.data[0].value;
                }
            },

            intersect() {
                const instances = this.instances.map((item) => item.id);
                const installed = this.installed.map((item) => item.instance);

                this.available = instances.filter((item) => item !== "library" && installed.indexOf(item) === -1);
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

            instance(id) {
                return (this.instances.find((item) => item.id === id) || {}).display || "";
            },

            icon() {
                if (this.plugin.icon) {
                    return this.plugin.icon;
                }

                const hash = crypto.createHash("md5").update(this.plugin.name).digest("hex");

                return `data:image/png;base64,${new identicon(hash, { background: [0, 0, 0, 0], size: 128 }).toString()}`; // eslint-disable-line new-cap
            },

            domain(value) {
                return value.replace("http://", "").replace("https://", "").split("/")[0];
            },

            url(value) {
                if (!value || value === "") {
                    return null;
                }

                const parts = (value || "").split("//");

                if (parts.length < 2) {
                    return null;
                }

                let ssl = true;

                if (parts[0].endsWith("http:")) {
                    ssl = false;
                }

                if (ssl) {
                    return `https://${parts[1]}`;
                }

                return `http://${parts[1]}`;
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

                    .details {
                        max-width: 320px;
                        user-select: none;
                        -ms-overflow-style: none;
                        overflow: auto;

                        &::-webkit-scrollbar {
                            display: none;
                        }

                        .title {
                            margin: 20px 0 10px 0;
                            display: flex;
                            flex-direction: row;

                            h1 {
                                flex: 1;
                                font-size: 14px;
                                padding: 0;
                                margin: 0;
                                line-height: normal;
                                opacity: 0.7;
                            }
                        }

                        .item {
                            display: flex;
                            padding: 0 0 10px 0;
                            border-bottom: 1px var(--application-border) solid;

                            .count {
                                width: 100px;
                                display: flex;
                                flex-direction: column;
                                font-weight: bold;
                                font-size: 14px;
                            }

                            .value {
                                flex: 1;

                                a {
                                    display: flex;
                                    flex-direction: row;
                                    align-items: center;
                                    text-decoration: none !important;

                                    .icon {
                                        margin: 0 7px -2px 0;
                                    }
                                }
                            }

                            .chart {
                                flex: 1;
                                display: flex;
                                flex-direction: column;
                                overflow: hidden;

                                svg {
                                    height: 40px;
                                    margin: 0;
                                }
                            }

                            .leader {
                                height: 3px;
                                background: var(--application-highlight);
                                opacity: 0.3;
                            }
                        }

                        .tag {
                            flex: 1;
                            display: flex;
                            flex-direction: row;
                            align-content: center;
                            align-items: center;
                            margin: 0;
                            font-size: 14px;

                            svg {
                                margin: 0 4px 0 0;
                            }

                            .background {
                                fill: var(--application-highlight);
                            }

                            .gravatar {
                                width: 22px;
                                height: 22px;
                                margin: 0 4px 0 0;
                                border-radius: 3px;
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
