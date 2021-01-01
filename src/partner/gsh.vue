<!-------------------------------------------------------------------------------------------------
 | hoobs-gui                                                                                      |
 | Copyright (C) 2020 HOOBS                                                                       |
 | Copyright (C) 2019 Oznu                                                                        |
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
    <div id="field">
        <div class="action">
            <div class="button primary" v-on:click="link">{{ $t("link_account") }}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "gsh",

        props: {
            value: [Object, String, Number, Boolean, Array],
        },

        data() {
            return {
                token: "",
                dialog: null,
                interval: null,
            };
        },

        mounted() {
            this.token = this.value;
        },

        methods: {
            link() {
                window.addEventListener("message", this.message, false);

                const left = (window.screen.width / 2) - (760 / 2);
                const top = ((window.screen.height / 2) - (760 / 2)) / 2;

                this.dialog = window.open("https://homebridge-gsh.iot.oz.nu/link-account", "oznu-google-smart-home-auth", `toolbar=no,status=no,menubar=no,resizable=yes,width=760,height=760,top=${top},left=${left}`);
                this.interval = setInterval(() => { this.dialog.postMessage("origin-check", "https://homebridge-gsh.iot.oz.nu"); }, 2000);
            },

            message(event) {
                if (event.origin === "https://homebridge-gsh.iot.oz.nu") {
                    try {
                        const data = JSON.parse(event.data);

                        if (data.token) this.update(data.token);
                    } catch (error) {
                        console.error(error);
                    }
                }
            },

            update(token) {
                if (this.interval) clearInterval(this.interval);
                if (this.dialog) this.dialog.close();

                this.interval = null;
                this.dialog = null;
                this.token = token;

                this.$emit("input", this.token);
                this.$emit("change", this.token);
            },
        },
    };
</script>
