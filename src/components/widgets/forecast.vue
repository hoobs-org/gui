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
    <div v-if="!loading && location.id" id="widget">
        <div class="location">{{ location.name }}, {{ (country.find((country) => country.value === location.country) || {}).text }}</div>
        <div class="forecast">
            <div v-for="(day, index) in forecast" :key="`day:${index}`" class="weather">
                <span class="title">{{ $t(weekday(new Date(day.date))) }}</span>
                <div class="display" :class="`wi wi-day-${icon[day.icon].icon}`"></div>
                <div class="temp">
                    <span class="max">{{ Math.round(day.max) }}°</span>
                    <span class="min">{{ Math.round(day.min) }}°</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "@/assets/weathericons.css";

    import icons from "@/assets/weathericons.json";
    import countries from "@/lang/country-codes.json";
    import dates from "@/services/dates";

    export default {
        name: "forecast",

        data() {
            return {
                loading: true,
                location: {},
                forecast: [],
                icon: icons,
                country: countries,
            };
        },

        async mounted() {
            const config = await this.$hoobs.config.get();

            this.location = (config.weather || {}).location;
            this.forecast = await this.$hoobs.weather.forecast();
            this.loading = false;
        },

        methods: {
            weekday(value) {
                return `${dates.weekday(value)}_abbr`;
            },
        },
    };
</script>

<style lang="scss" scoped>
    #widget {
        display: flex;
        flex-direction: column;
        padding: 20px 6px 20px 20px;
        position: relative;
        cursor: default;

        .location {
            font-size: 14px;
            margin: 0 0 7px 0;
            user-select: none;
        }

        .forecast {
            flex: 1;
            display: flex;
            flex-direction: row;

            .weather {
                flex: 1;
                height: 92px;
                margin: 0 14px 0 0;
                padding: 7px;
                text-align: center;
                display: flex;
                flex-direction: column;
                border: 1px var(--widget-border) solid;
                align-content: center;
                box-sizing: border-box;
                user-select: none;
            }

            .display {
                font-size: 28px;
                line-height: 45px;
                color: var(--widget-highlight);
            }

            .title {
                font-weight: bold;
                font-size: 14px;
            }

            .description {
                font-weight: bold;
                font-size: 12px;
            }

            .temp {
                font-weight: bold;
                font-size: 14px;

                .max {
                    margin: 0 7px 0 0;
                }

                .min {
                    opacity: 0.7;
                }
            }
        }
    }
</style>
