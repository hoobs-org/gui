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
        <div v-if="files.length > 0" class="row section">{{ $t("restore") }}</div>
        <div v-if="files.length > 0" class="row title">{{ $t("available_backups") }}</div>
        <div v-for="(file, index) in files" :key="`file:${index}`" class="row">
            <radio :id="`file_${index}`" name="filename" :title="format(file.date)" v-model="filename" :value="file.filename" />
        </div>
        <div v-if="files.length > 0" class="row" style="margin-top: 7px;">
            <div v-on:click="restore()" class="button">{{ $t("restore") }}</div>
        </div>
        <div class="row section" style="margin-bottom: 7px;">{{ $t("backup_file") }}</div>
        <div class="row">
            <input type="file" ref="backup" v-on:change="upload()" accept=".backup" hidden />
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
            this.loading = true;

            this.files = await this.$hoobs.backup.catalog(5);

            this.loading = false;
        },

        methods: {
            format(value) {
                const date = new Date(value);

                return date.toLocaleString();
            },

            async restore() {
                if (this.filename !== "") {
                    this.loading = true;

                    await this.$hoobs.restore.file(this.filename);

                    this.$action.emit("window", "reboot", 30 * 1000);
                }
            },

            async upload() {
                if (this.$refs.backup && this.$refs.backup.files[0]) {
                    this.loading = true;

                    await this.$hoobs.restore.upload(this.$refs.backup.files[0]);

                    this.$action.emit("window", "reboot", 30 * 1000);
                }
            },
        },
    };
</script>
