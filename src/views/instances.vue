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
    <div v-if="user.permissions.instances" id="instances">
        <context>
            <router-link v-if="id !== 'add'" to="/instances/add" class="button">
                <div class="icon">add</div>
                {{ $t("add") }}
            </router-link>
        </context>
        <div v-if="!loading" class="content">
            <list value="id" display="display" :values="instances" :selected="id" controller="instances" />
            <form v-if="id === 'add'" class="screen form">
                <div class="wrapper">
                    <div class="row section">{{ $t("import") }}</div>
                    <div class="row">
                        <input type="file" ref="file" v-on:change="upload()" accept=".instance" hidden />
                        <div v-on:click="$refs.file.click()" class="button">{{ $t("upload_file") }}</div>
                        <div v-if="file" class="filename">{{ filename }}</div>
                    </div>
                    <div class="row section">{{ $t("details") }}</div>
                    <div class="row">
                        <text-field :name="$t('name')" style="flex: 1; padding-right: 5px" v-model="display" />
                        <text-field :name="$t('instance_pin')" style="flex: 1; padding-right: 0; padding-left: 5px" v-model="pin" />
                    </div>
                    <div class="row">
                        <port-field :name="$t('instance_port')" style="flex: 1; padding-right: 5px" v-model="port" />
                        <div style="flex: 1; padding-left: 5px"></div>
                    </div>
                    <div class="row actions">
                        <div v-if="!loading" v-on:click="save(true)" class="button primary">{{ $t("save") }}</div>
                        <router-link to="/instances" class="button">{{ $t("cancel") }}</router-link>
                    </div>
                </div>
            </form>
            <form v-else-if="status" class="screen form">
                <div class="wrapper">
                    <div class="row title">{{ display }}</div>
                    <div class="row section">{{ $t("pairing") }}</div>
                    <div class="row">
                        <p style="margin-top: 0">{{ $t("pairing_description") }}</p>
                    </div>
                    <div class="row qrcode">
                        <qrcode v-if="!loading" :value="status.setup_id" :options="{ width: 200, color: { dark: theme.widget.text.default, light: '#00000000' }}" />
                    </div>
                    <div class="row actions">
                        <div v-if="status.running" v-on:click="control('restart')" class="button">{{ $t("restart") }}</div>
                        <div v-if="!status.running" v-on:click="control('start')" class="button">{{ $t("start") }}</div>
                        <div v-if="status.running" v-on:click="control('stop')" class="button">{{ $t("stop") }}</div>
                    </div>
                    <div class="row section">{{ $t("export") }}</div>
                    <div class="row">
                        <div v-on:click="backup()" class="button">{{ $t("export_instance") }}</div>
                    </div>
                    <div class="row section">{{ $t("details") }}</div>
                    <div class="row">
                        <text-field :name="$t('name')" style="flex: 1; padding-right: 5px" v-model="display" />
                        <text-field :name="$t('instance_pin')" style="flex: 1; padding-right: 0; padding-left: 5px" v-model="pin" />
                    </div>
                    <div class="row">
                        <div v-on:click="generate()" class="button">{{ $t("instance_generate_new_id") }}</div>
                    </div>
                    <div class="row section">{{ $t("service") }}</div>
                    <div class="row">
                        <integer-field :name="$t('instance_autostart')" :description="$t('instance_autostart_description')" :min="-1" :max="300" v-model="autostart" />
                    </div>
                    <div class="row section" style="margin-bottom: 10px">{{ $t("instance_port_pool") }}</div>
                    <p style="margin-top: 0">{{ $t("instance_port_pool_description") }}</p>
                    <div class="row">
                        <port-field :name="$t('instance_port_pool_start')" style="flex: 1; padding-right: 5px" v-model="start" />
                        <port-field :name="$t('instance_port_pool_end')" style="flex: 1; padding-right: 0; padding-left: 5px" v-model="end" />
                    </div>
                    <div class="row actions">
                        <div v-if="!loading" v-on:click="save()" class="button primary">{{ $t("save") }}</div>
                        <div v-on:click="remove()" class="button">{{ $t("remove") }}</div>
                        <router-link to="/instances" class="button">{{ $t("cancel") }}</router-link>
                    </div>
                </div>
            </form>
            <div v-else class="initial desktop">
                <div class="message">
                    {{ $t("instance_select_add") }}
                    <router-link to="/users/add">{{ $t("instance_add") }}</router-link>
                </div>
            </div>
        </div>
        <div v-else class="loading">
            <spinner />
        </div>
    </div>
</template>

<script>
    import QRCode from "@chenfengyuan/vue-qrcode";
    import Sanitize from "@hoobs/sdk/lib/sanitize";
    import { Wait } from "@hoobs/sdk/lib/wait";

    import List from "@/components/elements/list.vue";

    import Validators from "../services/validators";
    import { mac } from "../services/formatters";

    export default {
        name: "instances",

        props: {
            id: String,
        },

        components: {
            "qrcode": QRCode,
            "list": List,
        },

        computed: {
            user() {
                return this.$store.state.user;
            },
        },

        data() {
            return {
                loading: true,
                theme: null,
                instances: [],
                subject: null,
                status: null,
                file: null,
                filename: null,
                display: "",
                pin: "031-45-154",
                username: "",
                port: 51826,
                autostart: 0,
                start: null,
                end: null,
            };
        },

        watch: {
            id(value) {
                this.load(value);
            },
        },

        created() {
            this.$store.subscribe((mutation) => {
                if (mutation.type === "THEME:SET") this.load(this.id);
            });
        },

        async mounted() {
            this.load(this.id);
        },

        methods: {
            async load(id) {
                this.loading = true;
                this.theme = await this.$hoobs.theme.get(this.$store.state.theme);
                this.instances = await this.$hoobs.instances.list();

                this.subject = null;
                this.status = null;
                this.file = null;
                this.filename = null;
                this.display = "";
                this.pin = "031-45-154";
                this.username = "";
                this.port = 51826;
                this.autostart = 0;
                this.start = null;
                this.end = null;

                if (id && id !== "add" && id !== "api" && id !== "") {
                    this.subject = await this.$hoobs.instance(this.id);

                    if (this.subject) {
                        this.status = await this.subject.status();
                        this.display = this.subject.display;
                        this.pin = this.subject.pin;
                        this.username = this.subject.username;
                        this.autostart = parseInt(this.subject.autostart, 10) || 0;

                        if (this.subject.ports) {
                            this.start = this.subject.ports.start;
                            this.end = this.subject.ports.end;
                        }
                    }
                } else {
                    this.generate();
                    this.port = this.port || 50826;

                    const instances = await this.$hoobs.instances.list();

                    while (instances.findIndex((item) => parseInt(`${item.port}`, 10) === this.port) >= 0) {
                        this.port += 1000;
                    }
                }

                this.loading = false;
            },

            async control(action) {
                this.loading = true;

                switch (action) {
                    case "start":
                        await this.subject.start();
                        break;

                    case "stop":
                        await this.subject.stop();
                        break;

                    case "restart":
                        await this.subject.restart();
                        break;

                    default:
                        break;
                }

                setTimeout(() => {
                    this.load(this.id);
                }, 500);
            },

            async save(create) {
                const validation = Validators.instance(create, await this.$hoobs.instances.list(), this.display, this.pin, this.port, this.username, this.autostart, this.start, this.end);

                if (validation.valid) {
                    if (create) {
                        this.loading = true;

                        if (this.file) {
                            await this.$hoobs.instances.import(this.file, this.display, this.port, this.pin, this.username);
                        } else {
                            await this.$hoobs.instances.add(this.display, this.port, this.pin, this.username);
                        }

                        setTimeout(async () => {
                            await Wait();

                            this.instances = await this.$hoobs.instances.list();
                            this.$router.push({ path: `/instances/${this.instances.find((item) => item.id === Sanitize(this.display)).id}` });
                        }, 500);
                    } else if (this.subject) {
                        this.loading = true;

                        await this.subject.update(this.display, this.autostart, this.pin, this.username);

                        if (this.start && this.end) {
                            await this.subject.ports(this.start, this.end);
                        }

                        setTimeout(async () => {
                            await Wait();

                            this.load(this.id);
                        }, 500);
                    }
                } else {
                    this.$alert(this.$t(validation.error));
                }
            },

            generate() {
                this.username = mac();
            },

            remove() {
                if (this.subject) {
                    this.$confirm(this.$t("remove"), this.$t("remove_instance_warning"), async () => {
                        this.loading = true;

                        await this.subject.remove();

                        setTimeout(async () => {
                            await Wait();

                            this.$router.push({ path: "/instances" });
                        }, 500);
                    });
                }
            },

            async backup() {
                if (this.subject) {
                    this.loading = true;

                    const url = await this.subject.export();
                    const link = document.createElement("a");

                    this.loading = false;

                    link.href = url;
                    link.id = `instance_${(new Date()).getTime()}`;
                    link.download = `${this.subject.id}.instance`;
                    link.click();
                }
            },

            async upload() {
                if (this.$refs.file && this.$refs.file.files[0]) {
                    [this.file] = this.$refs.file.files;
                    this.filename = this.file.name;
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    #instances {
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
                -ms-overflow-style: none;
                overflow: auto;

                &::-webkit-scrollbar {
                    display: none;
                }

                .title {
                    font-size: 17px;
                }

                .wrapper {
                    max-width: 800px;
                }

                .field {
                    flex: 1;
                    padding-right: 0;
                    padding-left: 5px;

                    &:first-child {
                        padding-right: 5px;
                    }
                }
            }

            .qrcode {
                margin: -10px;
            }

            .initial {
                flex: 1;
                display: flex;
                flex-direction: row;
                padding: 0 20px 20% 20px;
                align-items: center;
                overflow: hidden;

                .message {
                    margin: 0 auto;
                }
            }
        }
    }

    @media (min-width: 300px) and (max-width: 815px) {
        #instances {
            .content {
                .screen {
                    max-width: unset;
                    background: transparent;
                    backdrop-filter: unset;
                    padding: 0 20px 10px 20px;
                    margin: 0;

                    .row {
                        flex-direction: column;
                    }

                    .actions {
                        flex-direction: row;
                    }

                    .field {
                        padding-right: 0;
                        padding-left: 0;

                        &:first-child {
                            padding-right: 0;
                        }
                    }
                }
            }
        }
    }
</style>
