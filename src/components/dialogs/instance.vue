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
    <modal v-if="title" :title="$t(title)" :draggable="true" width="760px" :height="`${height}px`">
        <div id="instance">
            <div v-if="!loading" class="content">
                <div class="form">
                    <div class="row section">{{ $t("details") }}</div>
                    <div class="row">
                        <text-field
                            :name="$t('name')"
                            style="flex: 1; padding-right: 5px;"
                            v-model="display"
                        />
                        <text-field
                            :name="$t('instance_pin')"
                            style="flex: 1; padding-right: 0; padding-left: 5px;"
                            v-model="pin"
                        />
                    </div>
                    <div v-if="create" class="row">
                        <port-field
                            :name="$t('instance_port')"
                            style="flex: 1; padding-right: 5px;"
                            v-model="port"
                        />
                        <div style="flex: 1; padding-left: 5px;"></div>
                    </div>
                    <div v-if="!this.create" class="row">
                        <div v-on:click="generate()" class="button">{{ $t("instance_generate_new_id") }}</div>
                    </div>
                    <div v-if="!this.create" class="row section">{{ $t("service") }}</div>
                    <div v-if="!this.create" class="row">
                        <integer-field
                            :name="$t('instance_autostart')"
                            :description="$t('instance_autostart_description')"
                            :min="-1"
                            :max="300"
                            v-model="autostart"
                        />
                    </div>
                    <div v-if="!this.create" class="row section">{{ $t("export") }}</div>
                    <div v-if="!this.create" class="row">
                        <div v-on:click="backup()" class="button">{{ $t("export_instance") }}</div>
                    </div>
                    <div v-if="!this.create" class="row section" style="margin-bottom: 10px;">{{ $t("instance_port_pool") }}</div>
                    <p v-if="!this.create" style="margin-top: 0;">
                        {{ $t("instance_port_pool_description") }}
                    </p>
                    <div v-if="!this.create" class="row">
                        <port-field
                            :name="$t('instance_port_pool_start')"
                            style="flex: 1; padding-right: 5px;"
                            v-model="start"
                        />
                        <port-field
                            :name="$t('instance_port_pool_end')"
                            style="flex: 1; padding-right: 0; padding-left: 5px;"
                            v-model="end"
                        />
                    </div>
                    <div v-if="this.create" class="row section">{{ $t("import") }}</div>
                    <div v-if="this.create" class="row">
                        <input type="file" ref="file" v-on:change="upload()" accept=".instance" hidden />
                        <div v-on:click="$refs.file.click();" class="button">{{ $t("upload_file") }}</div>
                        <div v-if="file" class="filename">{{ filename }}</div>
                    </div>
                </div>
            </div>
            <div v-else class="loading">
                <spinner />
            </div>
            <div class="actions modal">
                <div v-if="!loading && !create" v-on:click="remove()" class="button">{{ $t("remove") }}</div>
                <div class="fill"></div>
                <div v-on:click="close()" class="button">{{ $t("cancel") }}</div>
                <div v-if="!loading" v-on:click="save()" class="button primary">{{ $t("apply") }}</div>
            </div>
        </div>
    </modal>
</template>

<script>
    import { Wait } from "@hoobs/sdk/lib/wait";
    import Sanitize from "@hoobs/sdk/lib/sanitize";

    export default {
        name: "instance",

        props: {
            id: String,
            create: Boolean,
            close: {
                type: Function,
                default: () => { /* null */ },
            },
        },

        data() {
            return {
                loading: true,
                height: 740,
                title: null,
                subject: {},
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

        async mounted() {
            this.title = "instance_add";
            this.height = 450;

            if (!this.create) {
                this.title = "instance_edit";
                this.height = 740;
                this.subject = await this.$hoobs.instance(this.id);
                this.display = this.subject.display;
                this.pin = this.subject.pin;
                this.username = this.subject.username;
                this.autostart = this.subject.autostart;

                if (this.subject.ports) {
                    this.start = this.subject.ports.start;
                    this.end = this.subject.ports.end;
                }
            } else {
                this.generate();

                this.port = this.port || 50826;

                const instances = await this.$hoobs.instances.list();

                while (instances.findIndex((item) => parseInt(`${item.port}`, 10) === this.port) >= 0) this.port += 1000;
            }

            this.loading = false;
        },

        methods: {
            async save() {
                let valid = true;

                const instances = await this.$hoobs.instances.list();

                if (this.create) {
                    if (valid && (!this.display || this.display === "")) {
                        this.$alert(this.$t("instance_name_required"));
                        valid = false;
                    }

                    if (valid && instances.findIndex((item) => item.id === Sanitize(this.display)) >= 0) {
                        this.$alert(this.$t("instance_name_taken"));
                        valid = false;
                    }

                    if (valid && !this.port) {
                        this.$alert(this.$t("instance_port_required"));
                        valid = false;
                    }

                    if (valid && instances.findIndex((item) => item.port === parseInt(this.port, 10)) >= 0) {
                        this.$alert(this.$t("instance_port_taken"));
                        valid = false;
                    }

                    if (valid && this.pin && this.pin !== "" && !this.validate(this.pin)) {
                        this.$alert(this.$t("instance_pin_invalid"));
                        valid = false;
                    }

                    if (valid) {
                        this.loading = true;

                        if (this.file) {
                            await this.$hoobs.instances.import(this.file, this.display, this.port, this.pin, this.username);
                        } else {
                            await this.$hoobs.instances.add(this.display, this.port, this.pin, this.username);
                        }
                    }
                } else {
                    if (valid && (!this.display || this.display === "")) {
                        this.$alert(this.$t("instance_name_required"));
                        valid = false;
                    }

                    if (valid && this.pin && this.pin !== "" && !this.validate(this.pin)) {
                        this.$alert(this.$t("instance_pin_invalid"));
                        valid = false;
                    }

                    if (valid && (!this.username || this.username === "")) {
                        this.$alert(this.$t("instance_username_invalid"));
                        valid = false;
                    }

                    if (valid && (this.autostart < -1 || this.autostart > 300)) {
                        this.$alert(this.$t("instance_autostart_invalid"));
                        valid = false;
                    }

                    if (valid && (this.start || this.end)) {
                        if (valid && (!this.start || !this.end)) {
                            this.$alert(this.$t("instance_port_pool_required"));
                            valid = false;
                        }

                        if (valid && this.end < this.start) {
                            this.$alert(this.$t("instance_port_pool_invalid"));
                            valid = false;
                        }

                        if (valid) {
                            for (let i = this.start; i <= this.end; i += 1) {
                                if (valid && instances.findIndex((item) => item.port === i) >= 0) {
                                    this.$alert(this.$t("instance_port_pool_collision"));
                                    valid = false;
                                }
                            }

                            valid = false;
                        }
                    }

                    if (valid) {
                        this.loading = true;

                        await this.subject.update(this.display, this.autostart, this.pin, this.username);

                        if (this.start && this.end) {
                            await this.subject.ports(this.start, this.end);
                        }
                    }
                }

                if (valid) {
                    await Wait();

                    this.close();
                }
            },

            validate(pin) {
                const parts = pin.split("-");

                if (parts.length !== 3) return false;

                for (let i = 0; i < parts.length; i += 1) {
                    if (Number.isNaN(parseInt(parts[i], 10))) return false;
                }

                return true;
            },

            generate() {
                let value = "";

                for (let i = 0; i < 6; i += 1) {
                    if (value !== "") value += ":";

                    const hex = `00${Math.floor(Math.random() * 255).toString(16).toUpperCase()}`;

                    value += hex.substring(hex.length - 2, hex.length);
                }

                this.username = value;
            },

            remove() {
                this.$confirm(this.$t("remove"), this.$t("remove_instance_warning"), async () => {
                    this.loading = true;

                    await this.subject.remove();
                    await Wait();

                    this.close();
                });
            },

            async backup() {
                this.loading = true;

                const url = await this.subject.export();
                const link = document.createElement("a");

                this.loading = false;

                link.href = url;
                link.id = `instance_${(new Date()).getTime()}`;
                link.download = `${this.subject.id}.instance`;
                link.click();
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
    #instance {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin: 0 0 0 10px;

        .fill {
            flex: 1;
        }

        .filename {
            padding: 0 14px;
            align-self: center;
        }
    }
</style>
