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
    <div id="list" :class="selected && selected !== '' ? 'list open' : 'list'">
        <router-link
            v-for="(item, index) in values"
            :key="`entry:${index}`"
            :class="`${item[value]}` === (selected || initial) ? 'item open' : 'item'"
            :to="navigate(controller, item[value], query)"
        >{{ item[display] }}</router-link>
    </div>
</template>

<script>
    export default {
        name: "list",

        props: {
            values: Array,
            value: String,
            display: String,
            selected: String,
            controller: String,
            initial: String,
            query: String,
        },

        methods: {
            navigate(controller, action, query) {
                let path = `/${controller}`;

                if (action && action !== "") path = `${path}/${action}`;
                if (query && query !== "") path = `${path}?${query}`;

                return path;
            },
        },
    };
</script>

<style lang="scss" scoped>
    #list {
        min-width: 200px;
        margin: 0 0 20px 10px;
        padding: 10px 20px;
        color: var(--widget-text);
        background: var(--widget-background);
        backdrop-filter: var(--transparency);
        user-select: none;
        -ms-overflow-style: none;
        overflow: auto;

        &::-webkit-scrollbar {
            display: none;
        }

        .item {
            color: var(--application-text) !important;
            border-top: 1px var(--application-border) solid;
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 10px 0;
            width: 100%;

            &:first-child {
                border-top: 0 none;
            }

            &.open {
                color: var(--application-highlight) !important;

                &:hover {
                    color: var(--application-highlight) !important;
                }
            }

            &:hover {
                color: var(--application-highlight-text) !important;
                text-decoration: none !important;
            }
        }
    }

    @media (min-width: 300px) and (max-width: 815px) {
        #list {
            flex: 1;
            min-width: unset;
            background: unset;
            backdrop-filter: unset;

            &.open {
                display: none;
            }

            .item {
                &.open {
                    color: var(--application-text) !important;

                    &:hover {
                        color: var(--application-highlight-text) !important;
                    }
                }
            }
        }
    }
</style>
