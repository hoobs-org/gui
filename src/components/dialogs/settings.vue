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
    <modal :title="$t('settings')" width="760px" height="392px">
        <div id="settings">
            <div v-if="!loading" class="content">
                <div class="form">
                    <div class="row title">
                        {{ $t("weather") }}
                    </div>
                    <div class="seperator"></div>
                    <div class="row title">
                        {{ $t("temperature_units") }}
                    </div>
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
                    <div class="row title"></div>
                    <div class="row">
                        <text-field
                            :name="$t('postal_code')"
                            :description="$t('postal_code_description')"
                            v-model="postalcode"
                        />
                    </div>
                </div>
            </div>
            <div v-else class="loading">
                <spinner />
            </div>
            <div v-if="!loading" class="actions modal">
                <div class="button light" v-on:click="close()">{{ $t("cancel") }}</div>
                <div class="button primary" v-on:click="save()">{{ $t("apply") }}</div>
            </div>
        </div>
    </modal>
</template>

<script>
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
                postalcode: "",
                units: "celsius",
            };
        },

        async mounted() {
            this.units = this.$store.state.units;
            this.postalcode = this.$store.state.postalcode;
            this.loading = false;
        },

        methods: {
            save() {
                this.$store.commit("UNITS:SET", this.units.toLowerCase() === "celsius" ? "celsius" : "fahrenheit");
                this.$store.commit("POSTALCODE:SET", this.postalcode && this.postalcode !== "" ? this.postalcode : null);

                this.close();
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
    }
</style>
