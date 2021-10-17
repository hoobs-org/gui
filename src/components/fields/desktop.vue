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
    <div v-if="platform" id="field" class="field">
        <span class="value">{{ $t("desktop_feature") }}</span>
        <div class="action">
            <div v-if="platform === 'win'" v-on:click="download()" class="button primary">{{ $t("download_win") }}</div>
            <div v-if="platform === 'mac'" v-on:click="download()" class="button primary">{{ $t("download_mac") }}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "desktop-field",

        computed: {
            platform() {
                const platform = (navigator.platform || "").toLowerCase();

                if (platform.startsWith("win")) return "win";
                if (platform.startsWith("mac")) return "mac";

                return undefined;
            },
        },

        methods: {
            download() {
                window.location.href = "https://support.hoobs.org/downloads/desktop";
            },
        },
    };
</script>

<style lang="scss" scoped>
    #field {
        display: flex;
        flex-direction: column;
        padding: 0 10px 20px 0;

        .action {
            padding: 0;
        }

        .value {
            flex: 1;
            max-width: 300px;
            padding: 4px 0 10px 0;
            font-size: 14px;
            color: var(--application-input-text);
        }
    }
</style>
