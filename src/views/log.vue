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
    <div :key="version" id="log">
        <context v-if="!loading">
            <div ref="bridges" v-on:click.stop="menu('bridges')" class="button">
                <div class="mdi mdi-layers"></div>
                {{ $t("bridges") }}
            </div>
            <div ref="plugins" v-on:click.stop="menu('plugins')" class="button">
                <div class="mdi mdi-puzzle"></div>
                {{ $t("plugins") }}
            </div>
            <div v-if="debug" v-on:click="mode()" :title="$t('debug_log')" class="mdi mdi-bug-check"></div>
            <div v-else v-on:click="mode()" :title="$t('debug_log')" class="mdi mdi-bug dim"></div>
            <div class="seperator desktop"></div>
            <div v-on:click="download()" :title="$t('download_log')" class="mdi mdi-download desktop"></div>
        </context>
        <context v-else />
        <div v-if="!loading" ref="messages" class="messages">
            <message v-for="(message, index) in messages" :key="`message:${index}`" :value="message" />
        </div>
        <div v-else class="loading">
            <spinner />
        </div>
    </div>
</template>

<script>
    import Message from "@/components/elements/message.vue";

    const SCROLL_DELAY = 10;

    export default {
        name: "log",

        components: {
            "message": Message,
        },

        computed: {
            messages() {
                return this.$store.state.log.filter(this.filter);
            },
        },

        data() {
            return {
                loading: true,
                bottom: true,
                version: 0,
                debug: false,
                bridges: [],
                plugins: [],
            };
        },

        created() {
            this.$action.on("log", "plugins", (plugins) => {
                this.plugins = plugins;
            });

            this.$action.on("log", "bridges", (bridges) => {
                this.bridges = bridges;
            });
        },

        beforeRouteLeave(_to, _from, next) {
            this.$refs.messages.removeEventListener("scroll", this.position);

            next();
        },

        async mounted() {
            const { bridges } = this.$store.state;

            this.bridges.push({
                value: "hub",
                text: "Hub",
                selected: true,
            });

            for (let i = 0; i < bridges.length; i += 1) {
                this.bridges.push({
                    value: bridges[i].id,
                    text: bridges[i].display,
                    selected: true,
                });
            }

            const plugins = await this.$hoobs.plugins();

            this.plugins.push({
                value: "null",
                text: this.$t("non_plugin"),
                selected: true,
            });

            for (let i = 0; i < plugins.length; i += 1) {
                if (this.plugins.findIndex((item) => item.value === plugins[i].identifier) === -1) {
                    this.plugins.push({
                        value: plugins[i].identifier,
                        text: plugins[i].alias || plugins[i].name || plugins[i].identifier,
                        selected: true,
                    });
                }
            }

            setTimeout(() => {
                this.$refs.messages.addEventListener("scroll", this.position);

                if (this.bottom) this.$refs.messages.scrollTo(0, this.$refs.messages.scrollHeight);
            }, SCROLL_DELAY);

            this.$action.emit("log", "history");
            this.loading = false;
        },

        updated() {
            if (this.bottom) this.$refs.messages.scrollTo(0, this.$refs.messages.scrollHeight);
        },

        methods: {
            position() {
                this.bottom = false;

                if ((this.$refs.messages.clientHeight + this.$refs.messages.scrollTop) >= this.$refs.messages.scrollHeight) this.bottom = true;
            },

            mode() {
                this.debug = !this.debug;
            },

            menu(name) {
                this.$menu.open(name, {
                    opener: this.$refs[name],
                    values: this[name],
                });
            },

            filter(message) {
                if (!this.debug && message.level === "debug") {
                    return false;
                }

                if (!((this.bridges.find((item) => item.value === (message.bridge || "hub")) || {}).selected)) {
                    return false;
                }

                if (!((this.plugins.find((item) => item.value === (message.plugin || "null")) || {}).selected)) {
                    return false;
                }

                return true;
            },

            async download() {
                const log = await this.$hoobs.log(5000);

                let content = "";

                for (let i = 0; i < log.length; i += 1) {
                    content += `${new Date(log[i].timestamp).toLocaleString()} `;

                    if (log[i].id !== "" && log[i].id !== "hub") {
                        content += `${log[i].display} `;
                    }

                    if (log[i].plugin && log[i].plugin !== "") {
                        content += `${log[i].prefix} `;
                    }

                    switch (log[i].level) {
                        case "debug":
                            content += `[ DEBUG ] ${log[i].message}`;
                            break;

                        case "error":
                            content += `[ ERROR ] ${log[i].message}`;
                            break;

                        case "warn":
                            content += `[ WARNING ] ${log[i].message}`;
                            break;

                        default:
                            content += log[i].message;
                            break;
                    }

                    content += "\r\n";
                }

                const link = document.createElement("a");

                this.loading = false;

                link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`;
                link.download = "log.txt";
                link.click();
            },
        },
    };
</script>

<style lang="scss" scoped>
    #log {
        flex: 1;
        display: flex;
        background: var(--application-background);
        position: relative;
        overflow: hidden;
        flex-direction: column;

        .dim {
            opacity: 0.3;
        }

        .messages {
            flex: 1;
            padding: 10px 20px 20px 20px;
            -ms-overflow-style: none;
            scrollbar-width: none;
            overflow: auto;

            &::-webkit-scrollbar {
                display: none;
            }
        }
    }
</style>
