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
    <div id="widget"></div>
</template>

<script>
    export default {
        name: "system",

        data() {
            return {
                node: "",
                instances: {},
                version: "",
                latest: "",
                loading: true,
                system: {},
            };
        },

        async mounted() {
            const status = await this.hoobs.status();

            this.node = status.node_version;
            this.instances = status.instances;
            this.version = await this.hoobs.version();
            this.latest = await this.hoobs.latest();
            this.system = await this.hoobs.system();

            this.loading = false;
        },
    };
</script>

<style lang="scss" scoped>
    #widget {
        width: 100%;
        height: 100%;
        cursor: default;
    }
</style>
