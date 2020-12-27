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
    <div id="log">
        <context>
            <div ref="instances" v-on:click.stop="menu('instances')" class="button">
                <div class="icon">layers</div>
                {{ $t("instances") }}
            </div>
            <div ref="plugins" v-on:click.stop="menu('plugins')" class="button">
                <div class="icon">extension</div>
                {{ $t("plugins") }}
            </div>
            <div v-if="debug" v-on:click="mode()" class="icon">bug_report</div>
            <div v-else v-on:click="mode()" class="icon dim">bug_report</div>
            <div class="seperator desktop"></div>
            <div v-on:click="download()" class="icon desktop">cloud_download</div>
        </context>
        <div ref="messages" class="messages">
            <message v-for="(message, index) in messages" :key="`message:${index}`" :value="message" />
        </div>
    </div>
</template>

<script>
    import Message from "@/components/elements/message.vue";

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
                debug: false,
                instances: [],
                plugins: [],
            };
        },

        created() {
            this.$action.on("log", "plugins", (plugins) => {
                this.plugins = plugins;
            });

            this.$action.on("log", "instances", (instances) => {
                this.instances = instances;
            });
        },

        async mounted() {
            const { instances } = this.$store.state;

            this.instances.push({
                value: "api",
                text: "API",
                selected: true,
            });

            for (let i = 0; i < instances.length; i += 1) {
                this.instances.push({
                    value: instances[i].id,
                    text: instances[i].display,
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
                this.$refs.messages.scrollTo(0, this.$refs.messages.scrollHeight);
            }, 10);

            this.$action.emit("log", "history");
        },

        updated() {
            this.$refs.messages.scrollTo(0, this.$refs.messages.scrollHeight);
        },

        methods: {
            mode() {
                this.debug = !this.debug;
            },

            menu(name) {
                this.$menu.show(name, {
                    opener: this.$refs[name],
                    values: this[name],
                });
            },

            filter(message) {
                if (!this.debug && message.level === "debug") {
                    return false;
                }

                if (!((this.instances.find((item) => item.value === (message.instance || "api")) || {}).selected)) {
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

                    if (log[i].id !== "" && log[i].id !== "api") {
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
