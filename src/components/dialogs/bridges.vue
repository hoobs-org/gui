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
    <modal :title="title" :draggable="true" width="670px" height="670px">
        <div id="bridges">
            <div class="content">
                <form v-if="options.type === 'install'" class="form">
                    <div class="row section" style="margin: 0;">{{ $t("bridge_add") }}</div>
                    <p>
                        {{ $t("plugin_install_add_bridge") }}
                    </p>
                    <div class="row">
                        <text-field :title="$t('name')" style="flex: 1; padding-right: 5px" v-model="display" />
                        <text-field :title="$t('bridge_pin')" style="flex: 1; padding-right: 0; padding-left: 5px" v-model="pin" />
                    </div>
                    <div class="row">
                        <port-field :title="$t('bridge_port')" style="flex: 1; padding-right: 5px" v-model="port" />
                        <div style="flex: 1; padding-left: 5px"></div>
                    </div>
                    <div v-if="bridges.length > 0" class="row section" style="margin: 0;">{{ $t("bridges") }}</div>
                    <p v-if="bridges.length > 0">
                        {{ $t("plugin_install_bridge") }}
                    </p>
                    <div v-if="bridges.length > 0" class="grid">
                        <div v-for="(bridge, index) in bridges" :key="`bridge:${index}`" v-on:click="install(bridge.id)" class="button full">{{ bridge.display }}</div>
                    </div>
                </form>
                <form v-if="options.type === 'uninstall'" class="form">
                    <div class="row section">{{ $t("remove") }}</div>
                    <div class="row">
                        <checkbox id="remove" :title="$t('bridge_remove_empty')" v-model="remove" />
                    </div>
                    <div class="row section" style="margin: 0;">{{ $t("bridges") }}</div>
                    <p>
                        {{ $t("plugin_uninstall_bridge") }}
                    </p>
                    <div class="grid">
                        <div v-for="(bridge, index) in bridges" :key="`bridge:${index}`" v-on:click="uninstall(bridge.id)" class="button full">{{ bridge.display }}</div>
                    </div>
                </form>
            </div>
            <div class="actions modal">
                <div v-on:click="$dialog.close('bridges')" class="button">{{ $t("cancel") }}</div>
                <div v-if="options.type === 'install'" v-on:click="create()" class="button primary">{{ $t("plugin_install") }}</div>
            </div>
        </div>
    </modal>
</template>

<script>
    import Sanitize from "@hoobs/sdk/lib/sanitize";
    import Validators from "../../services/validators";
    import { mac } from "../../services/formatters";

    export default {
        name: "bridges",

        props: {
            options: Object,
        },

        data() {
            return {
                bridges: [],
                title: "",
                display: "",
                pin: "031-45-154",
                username: "",
                port: 50826,
                remove: true,
            };
        },

        async mounted() {
            this.bridges = this.options.values;

            this.bridges.sort((a, b) => {
                if (a.id < b.id) return -1;
                if (a.id > b.id) return 1;

                return 0;
            });

            let bridges = [];
            let count = 1;

            const template = `${this.$hoobs.repository.title(this.options.plugin.name)} ${this.$t("bridge")}`;

            switch (this.options.type) {
                case "install":
                    this.title = `${this.$t("plugin_install")} ${this.$hoobs.repository.title(this.options.plugin.name)}`;

                    this.generate();
                    this.port = 51826;
                    this.display = template;

                    bridges = await this.$hoobs.bridges.list();

                    while (bridges.findIndex((item) => parseInt(`${item.port}`, 10) === this.port) >= 0) {
                        this.port += 1000;
                    }

                    while (bridges.findIndex((item) => item.id === Sanitize(this.display)) >= 0) {
                        count += 1;

                        this.display = `${template} ${count}`;
                    }

                    break;

                case "uninstall":
                    this.title = `${this.$t("plugin_uninstall")} ${this.$hoobs.repository.title(this.options.plugin.name)}`;
                    break;

                default:
                    this.$dialog.close("bridges");
                    break;
            }
        },

        methods: {
            async create() {
                const validation = Validators.bridge(true, await this.$hoobs.bridges.list(), this.display, this.pin, this.port, this.username);

                if (validation.valid) {
                    this.options.select({
                        id: Sanitize(this.display),
                        display: this.display,
                        port: this.port,
                        pin: this.pin,
                        username: this.username,
                    });
                } else {
                    this.$alert(this.$t(validation.error));
                }
            },

            install(id) {
                this.options.select(id);
            },

            uninstall(id) {
                this.options.select(id, this.remove);
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
                this.username = mac();
            },
        },
    };
</script>

<style lang="scss" scoped>
    #bridges {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin: 0 0 0 10px;

        .full {
            flex: 1;
            margin: 0 10px 10px 0;
            justify-content: space-around;
        }
    }
</style>
