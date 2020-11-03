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
    <modal width="490px" height="220px">
        <div class="content message">
            {{ message }}
        </div>
        <div class="actions modal">
            <div class="button" v-on:click="close()">{{ cancel || $t("cancel") }}</div>
            <div class="button primary" v-on:click="confirm()">{{ ok || $t("ok") }}</div>
        </div>
    </modal>
</template>

<script>
    export default {
        name: "confirm",

        props: {
            message: String,
            ok: String,
            cancel: String,
            confirm: {
                type: Function,
                default: () => { /* null */ },
            },
            close: {
                type: Function,
                default: () => { /* null */ },
            },
        },
    };
</script>
