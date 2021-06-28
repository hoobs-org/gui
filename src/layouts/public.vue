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
    <div id="public">
        <slot />
    </div>
</template>

<script>
    export default {
        name: "public",
    };
</script>

<style lang="scss">
    #public {
        width: 100%;
        height: 100%;
        display: flex;
        font-family: "Montserrat", sans-serif;
        color: var(--application-text);
        background-image: var(--backdrop);
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
        position: relative;
        overflow: hidden;
    }

    [platform="mobile"] {
        #public {
            background-image: unset;
        }
    }

    [platform="tablet"] {
        @media only screen and (orientation:portrait) {
            #public {
                background-image: unset;
            }
        }
    }
</style>
