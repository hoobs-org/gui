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
    <div id="location" class="form">
        <div class="row section">{{ $t("weather") }}</div>
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
                <div v-if="show.searching" class="loading">
                    <spinner />
                </div>
                <div v-else class="results">
                    <div
                        v-for="(location, index) in locations"
                        :key="index"
                        class="item"
                        v-on:click="select(locations[index])"
                    >
                        <span class="icon">my_location</span>
                        <span
                            class="title"
                        >{{ location.name }}, {{ (countries.find((country) => country.value === location.country) || {}).text || location.country }}</span>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import Countries from "../../lang/country-codes.json";

    export default {
        name: "location",

        props: {
            select: {
                type: Function,
                default: () => { /* null */ },
            },
        },

        data() {
            return {
                show: {
                    searching: false,
                },
                query: "",
                locations: [],
                countries: Countries,
            };
        },

        methods: {
            async search() {
                if (!this.query || this.query === "") {
                    this.locations = [];

                    return;
                }

                this.show.searching = true;

                this.locations = (await this.hoobs.location(this.query, 9)).map((item) => ({
                    id: item.id,
                    name: item.name,
                    country: item.country,
                }));

                this.show.searching = false;
            },
        },
    };
</script>

<style lang="scss" scoped>
    #location {
        .locations {
            margin: 0;

            .search {
                width: 100%;
                display: flex;
                flex-direction: column;
            }

            .results {
                display: flex;
                flex-direction: column;

                &.loading {
                    flex-direction: row;
                    justify-content: flex-start;
                }

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
                        text-shadow: 1px 1px 1px #52525250;
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
    }
</style>
