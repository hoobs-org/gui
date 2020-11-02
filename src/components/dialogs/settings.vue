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
    <modal :title="$t('settings')" width="760px" height="470px">
        <div id="settings">
            <div v-if="!loading" class="content">
                <location v-if="show.location" :select="select" />
                <div v-else class="form">
                    <div class="row title">{{ $t("weather") }}</div>
                    <div class="seperator"></div>
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
                    <div class="row title">{{ $t("location") }}</div>
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
                </div>
            </div>
            <div v-else class="loading">
                <spinner />
            </div>
            <div v-if="!loading && !show.location" class="actions modal">
                <div class="button light" v-on:click="close()">{{ $t("cancel") }}</div>
                <div class="button primary" v-on:click="save()">{{ $t("apply") }}</div>
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
                countries: Countries,
            };
        },

        async mounted() {
            const config = await this.hoobs.config.get();

            this.units = (config.weather || {}).units || "celsius";
            this.location = (config.weather || {}).location;
            this.loading = false;
        },

        methods: {
            change() {
                this.show.location = true;
            },

            async save() {
                this.loading = true;

                const config = await this.hoobs.config.get();
                const weather = {};

                if (this.location && this.location.id && this.location.id > 0) weather.location = this.location;

                weather.units = this.units.toLowerCase() === "celsius" ? "celsius" : "fahrenheit";
                config.weather = weather;

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

        .location {
            display: flex;
            flex-direction: column;

            .details {
                flex: 1;
                display: flex;
                flex-direction: column;
                margin: 4px 0 0 7px;
                font-size: 13px;

                .value {
                    font-weight: bold;
                }
            }
        }
    }
</style>
