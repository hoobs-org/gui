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
    <modal :title="$t('settings')" :draggable="true" width="760px" height="620px">
        <div id="settings">
            <div v-if="!loading" class="content">
                <location v-if="show.location" :select="select" />
                <div v-else class="form">
                    <div class="row section">{{ $t("weather") }}</div>
                    <div class="row title">{{ $t("temperature_units") }}</div>
                    <div class="row">
                        <radio id="celsius" name="units" v-model="units" value="celsius">
                            <label for="celsius">{{ $t("celsius") }}</label>
                        </radio>
                    </div>
                    <div class="row">
                        <radio id="fahrenheit" name="units" v-model="units" value="fahrenheit">
                            <label for="fahrenheit">{{ $t("fahrenheit") }}</label>
                        </radio>
                    </div>
                    <div class="row title spaced">{{ $t("location") }}</div>
                    <div class="row">
                        <input type="submit" class="hidden-submit" value="submit" />
                        <div v-on:click="change()" class="button light">{{ $t("change") }}</div>
                        <div class="location">
                            <div v-if="location" class="details">
                                <div>
                                    {{ $t("location_city") }}
                                    <span class="value">{{ location.name }}</span>
                                </div>
                                <div>
                                    {{ $t("location_country") }}
                                    <span class="value">{{ (countries.find((country) => country.value === location.country) || {}).text || location.country }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row section">{{ $t("monitor") }}</div>
                    <div class="row">
                        <number-field
                            :name="$t('update_interval')"
                            :description="$t('update_interval_description')"
                            :min="2"
                            :max="300"
                            v-model="interval"
                        />
                    </div>
                    <div class="row section">{{ $t("system") }}</div>
                    <div class="row">
                        <div v-on:click="reboot()" class="button light">{{ $t("reboot_device") }}</div>
                        <div v-on:click="purge()" class="button light">{{ $t("purge_cache") }}</div>
                        <div v-on:click="reset()" class="button light">{{ $t("factory_reset") }}</div>
                    </div>
                </div>
            </div>
            <div v-else class="loading">
                <spinner />
            </div>
            <div v-if="!loading && !show.location" class="actions modal">
                <div v-on:click="close()" class="button light">{{ $t("cancel") }}</div>
                <div v-on:click="save()" class="button primary">{{ $t("apply") }}</div>
            </div>
            <div v-if="!loading && show.location" class="actions modal">
                <div class="button light" v-on:click="back()">{{ $t("cancel") }}</div>
            </div>
        </div>
    </modal>
</template>

<script>
    import Location from "../elements/location.vue";
    import Countries from "../../lang/country-codes.json";
    import { wait } from "../../services/sdk";

    export default {
        name: "personalize",

        components: {
            "location": Location,
        },

        props: {
            close: {
                type: Function,
                default: () => { /* null */ },
            },
        },

        data() {
            return {
                loading: true,
                show: {
                    location: false,
                },
                location: {},
                units: "celsius",
                interval: 5,
                countries: Countries,
            };
        },

        async mounted() {
            const config = await this.hoobs.config.get();

            this.interval = (config.api || {}).polling_seconds || 5;
            this.units = (config.weather || {}).units || "celsius";
            this.location = (config.weather || {}).location;
            this.loading = false;
        },

        watch: {
            interval() {
                if (this.interval < 2) this.interval = 2;
                if (this.interval > 300) this.interval = 300;
            },
        },

        methods: {
            change() {
                this.show.location = true;
            },

            reboot() {
                this.$parent.confirm(this.$t("reboot_warning"), this.$t("reboot"), async () => {
                    const system = await this.hoobs.system();

                    await system.reboot();

                    this.$parent.show.confirmation = false;
                    this.loading = true;

                    setTimeout(() => {
                        window.location.href = "/";
                    }, 5 * 1000);
                });
            },

            purge() {
                this.$parent.confirm(this.$t("purge_warning"), this.$t("purge"), async () => {
                    const instances = await this.hoobs.instances.list();

                    for (let i = 0; i < instances.length; i += 1) this.clear(instances[i].id);

                    this.$parent.show.confirmation = false;
                });
            },

            async clear(id) {
                const instance = await this.hoobs.instance(id);

                await instance.purge();
            },

            reset() {
                this.$parent.confirm(this.$t("reset_warning"), this.$t("reset"), async () => {
                    const system = await this.hoobs.system();

                    await system.reset();

                    this.$parent.show.confirmation = false;
                    this.loading = true;

                    setTimeout(async () => {
                        await wait();

                        window.location.href = "/";
                    }, 5 * 1000);
                });
            },

            async save() {
                this.loading = true;

                const config = await this.hoobs.config.get();
                const weather = {};

                if (this.location && this.location.id && this.location.id > 0) weather.location = this.location;
                if (!config.api) config.api = {};

                weather.units = this.units.toLowerCase() === "celsius" ? "celsius" : "fahrenheit";
                config.weather = weather;
                config.api.polling_seconds = this.interval < 2 ? 2 : this.interval;

                await this.hoobs.config.update(config);

                this.close();
            },

            back() {
                this.show.location = false;
            },

            select(location) {
                this.location = location;
                this.show.location = false;
            },
        },
    };
</script>

<style lang="scss" scoped>
    #settings {
        flex: 1;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        margin: 0 0 0 10px;

        .spaced {
            margin: 20px 0 0 0;
        }

        .location {
            display: flex;
            flex-direction: column;

            .details {
                flex: 1;
                display: flex;
                flex-direction: column;
                margin: 4px 0 0 7px;
                font-size: 13px;
                user-select: none;

                .value {
                    font-weight: bold;
                }
            }
        }
    }
</style>
