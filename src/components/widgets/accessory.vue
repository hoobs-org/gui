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
    <div v-if="accessory" id="widget">
        <div class="device">
            <component v-if="control(accessory)" :is="control(accessory)" :accessory="accessory" />
        </div>
    </div>
</template>

<script>
    import { accessories, types } from "../../services/accessories";

    export default {
        name: "accessory-widget",

        components: {
            ...accessories(),
        },

        props: {
            item: {
                type: Object,
                required: true,
            },
        },

        data() {
            return {
                accessory: null,
            };
        },

        async mounted() {
            this.accessory = await this.$hoobs.accessory(this.item.bridge, this.item.id);
            console.log(this.accessory);
        },

        methods: {
            control(accessory) {
                return types(accessory);
            },
        },
    };
</script>

<style lang="scss" scoped>
    #widget {
        width: 100%;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
        cursor: default;

        .device {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
        }
    }
</style>
