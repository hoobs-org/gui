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
    <div id="login"></div>
</template>

<script>
    export default {
        data() {
            return {
                url: "/",
            };
        },

        async mounted() {
            this.url = this.$route.query.url || "/";

            if (this.url.startsWith("/login") || this.url.startsWith("/setup")) this.url = "/";
            if ((await this.hoobs.auth.status()) === "uninitialized" || (await this.hoobs.instances.list()).length === 0) this.$router.push({ path: "/setup" });
        },
    };
</script>

<style lang="scss" scoped>
    #login {
        background: var(--splash-background);
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
    }
</style>
