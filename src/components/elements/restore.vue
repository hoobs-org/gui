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
    <div v-if="!loading" id="restore" class="form">
        <div class="row section">{{ $t("restore") }}</div>
        <div class="row title">{{ $t("available_backups") }}</div>
        <div v-for="(file, index) in files" :key="index" class="row">
            <radio :id="`file_${index}`" name="filename" v-model="filename" :value="file.filename">
                <label :for="`file_${index}`">{{ format(file.date) }}</label>
            </radio>
        </div>
        <div class="row" style="margin-top: 7px;">
            <div v-on:click="restore()" class="button">{{ $t("restore") }}</div>
        </div>
        <div class="row section" style="margin-bottom: 7px;">{{ $t("backup_file") }}</div>
        <div class="row">
            <input type="file" ref="backup" v-on:change="upload()" accept=".hbak" hidden />
            <div v-on:click="$refs.backup.click();" class="button">{{ $t("upload_file") }}</div>
        </div>
    </div>
    <div v-else class="loading">
        <spinner />
    </div>
</template>

<script>
    export default {
        name: "restore",

        data() {
            return {
                loading: false,
                filename: "",
                files: [],
            };
        },

        async mounted() {
            this.files = await this.hoobs.backup.catalog(5);
        },

        methods: {
            format(value) {
                const date = new Date(value);

                return date.toLocaleString();
            },

            async restore() {
                if (this.filename !== "") {
                    this.loading = true;

                    await this.hoobs.restore.file(this.filename);

                    setTimeout(() => {
                        window.location.href = "/";
                    }, 5 * 1000);
                }
            },

            async upload() {
                if (this.$refs.backup && this.$refs.backup.files[0]) {
                    this.loading = true;

                    await this.hoobs.restore.upload(this.$refs.backup.files[0]);

                    setTimeout(() => {
                        window.location.href = "/";
                    }, 5 * 1000);
                }
            },
        },
    };
</script>
