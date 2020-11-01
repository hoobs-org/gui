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
                <div v-if="show.location" class="form">
                    <div class="row title">{{ $t("weather") }}</div>
                    <div class="seperator"></div>
                    <form
                        class="row locations"
                        autocomplete="false"
                        method="post"
                        action="/login"
                        v-on:submit.prevent="search()"
                    >
                        <input type="submit" class="hidden-submit" value="submit" />
                        <div class="search">
                            <search-field
                                :name="$t('location_search')"
                                :description="$t('location_description')"
                                v-model="query"
                                :search="search"
                            />
                            <div class="results">
                                <div
                                    v-for="(location, index) in locations"
                                    :key="index"
                                    class="item"
                                    v-on:click="select(index)"
                                >
                                    <span class="icon">my_location</span>
                                    <span class="title">{{ location.name }}, {{ location.country }}</span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
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
                                    <span class="value">{{ location.country }}</span>
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
    import Maps from "../../services/maps";
    import Weather from "../../services/weather";
    import Countries from "../../lang/country-codes.json";

    export default {
        name: "personalize",

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
                query: "",
                position: {},
                location: {},
                locations: [],
                units: "celsius",
            };
        },

        async mounted() {
            this.units = this.$store.state.units;
            this.location = this.$store.state.location;
            this.loading = false;
        },

        methods: {
            change() {
                this.query = "";
                this.locations = [];
                this.show.location = true;
            },

            save() {
                this.loading = true;

                this.$store.commit("UNITS:SET", this.units.toLowerCase() === "celsius" ? "celsius" : "fahrenheit");
                this.$store.commit("LOCATION:SET", this.location && this.location.id !== "" ? this.location : null);

                this.close();
            },

            back() {
                this.show.location = false;
            },

            select(index) {
                this.location = this.locations[index];
                this.show.location = false;
            },

            async geolocation() {
                this.position = await Maps.geolocation();
                this.locations = (await Weather.search(this.position));
                this.location = (this.locations)[0] || null;
            },

            async search() {
                if (!this.query || this.query === "") {
                    this.locations = [];

                    return;
                }

                this.position = await Maps.geocode(this.query);

                this.locations = (await Weather.search(this.position)).map((item) => ({
                    id: item.id,
                    name: item.name,
                    country: (Countries.find((country) => country.value === item.country) || {}).text || item.country,
                }));
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

        .locations {
            margin: 20px 0 0 0;

            .search {
                width: 60%;
                display: flex;
                flex-direction: column;
            }

            .results {
                display: flex;
                flex-direction: column;

                .item {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    padding: 7px 20px;
                    border-bottom: var(--modal-border) 1px solid;
                    color: var(--modal-text);
                    user-select: none;
                    cursor: pointer;

                    &:last-child {
                        border-bottom: 0 none;
                    }

                    .title {
                        opacity: 0.7;
                    }

                    .icon {
                        margin: 0 7px 0 0;
                        font-size: 20px;
                        color: var(--modal-highlight);
                        opacity: 0.7;
                    }

                    &:hover {
                        .title {
                            opacity: 1;
                        }

                        .icon {
                            opacity: 1;
                        }
                    }
                }
            }
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

                .value {
                    font-weight: bold;
                }
            }
        }
    }
</style>
