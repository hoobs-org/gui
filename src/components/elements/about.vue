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
    <div id="about">
        <div class="content">
            <p>
                {{ $t("version") }}: {{ version }}
            </p>
            <p>
                {{ $t("license_title") }}
            </p>
            <p>
                {{ $t("license_summary") }}
            </p>
            <p>
                <a href="https://support.hoobs.org/docs/5e7649bee87d1e02b6c19d48" target="_blank">{{ $t("terms_conditions") }}</a><br>
                <a href="https://support.hoobs.org/docs/5e8f6c790ab68b0344e872d8" target="_blank">{{ $t("privacy_policy") }}</a><br>
                <a href="https://support.hoobs.org/docs/5e763ca9e87d1e02b6c19d2f" target="_blank">{{ $t("open_source") }}</a><br>
            </p>
        </div>
        <div class="actions modal">
            <div class="copyright">
                HOOBS and the HOOBS logo are registered trademarks of HOOBS, Inc.
                <br />Copyright &copy; {{ (new Date()).getFullYear() }} HOOBS, Inc. All rights reserved.
            </div>
            <div class="button light" v-on:click="donate()">{{ $t("donate") }}</div>
            <div class="button primary" v-on:click="close()">{{ $t("ok") }}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "about",

        props: {
            close: Function,
            donate: Function,
        },

        data() {
            return {
                version: "",
            };
        },

        async mounted() {
            this.version = await this.hoobs.version();
        },
    };
</script>

<style lang="scss" scoped>
    #about {
        flex: 1;
        display: flex;
        flex-direction: column;

        .content {
            flex: 1;
            font-size: 14px;
        }

        .actions {
            margin: 10px -10px 0 0;
            display: flex;
            justify-content: flex-end;

            .copyright {
                flex: 1;
                font-size: 9px;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                opacity: 0.4;
            }
        }
    }

    @media (min-width: 300px) and (max-width: 815px) {
        #about {
            .actions {
                .copyright {
                    display: none;
                }
            }
        }
    }
</style>
