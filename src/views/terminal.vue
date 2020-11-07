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
    <div id="terminal">
        <context>
            <div v-on:click="refresh()" class="icon">refresh</div>
        </context>
        <div class="measure" ref="measure">
            abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
        </div>
        <div v-if="!loading" class="flow" ref="flow">
            <div class="container" ref="container" style="display: block;">
                <div ref="terminal" class="shell"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import { Terminal } from "xterm";
    import { FitAddon } from "xterm-addon-fit";
    import { WebLinksAddon } from "xterm-addon-web-links";
    import { chunk } from "../plugins/hoobs";
    import Socket from "../plugins/socket";

    export default {
        name: "terminal",

        props: {
            route: String,
        },

        data() {
            return {
                loading: false,
                term: null,
                socket: null,
                version: null,
                screen: null,
                initilize: true,
                opening: true,
                text: {
                    width: 0,
                    height: 0,
                },
            };
        },

        created() {
            this.$store.subscribe((mutation) => {
                if (mutation.type === "THEME:SET") {
                    this.loading = true;
                    this.disconnect();

                    window.location.reload();
                }
            });

            window.addEventListener("resize", this.resize, true);
        },

        beforeRouteLeave(_to, _from, next) {
            this.disconnect();

            window.removeEventListener("resize", this.resize, true);

            next();
        },

        async mounted() {
            window.addEventListener("resize", this.resize, true);

            this.opening = true;
            this.version = await this.$hoobs.version();
            this.socket = Socket();

            this.text = {
                width: Math.floor((this.$refs.measure.clientWidth + 1) / 52),
                height: Math.floor(this.$refs.measure.clientHeight + 1),
            };

            const theme = await this.$theme.get();

            this.term = new Terminal({
                cursorStyle: "bar",
                cursorBlink: true,
                fontSize: 14,
                theme: {
                    background: theme.application.background,
                    foreground: theme.application.text.default,
                    cursor: theme.application.text.default,
                },
            });

            this.screen = new FitAddon();

            this.term.loadAddon(this.screen);
            this.term.loadAddon(new WebLinksAddon());

            this.term.open(this.$refs.terminal);

            this.connect();
        },

        methods: {
            refresh() {
                this.term.clear();
                this.term.focus();
            },

            connect() {
                this.socket.emit("shell_connect");

                this.term.onData((data) => { this.socket.emit("shell_input", data); });
                this.socket.on("shell_output", (data) => { this.term.write(data); });

                if (this.opening) {
                    this.motd();
                    this.resize();

                    this.opening = false;
                }
            },

            disconnect() {
                this.socket.emit("shell_disconnect");
            },

            motd() {
                if (this.term) {
                    this.term.clear();

                    if (this.initilize) {
                        this.term.write("    __  ______  ____  ____ _____\r\n");
                        this.term.write("   / / / / __ \\/ __ \\/ __ ) ___/\r\n");
                        this.term.write("  / /_/ / / / / / / / __  \\__ \\ \r\n");
                        this.term.write(" / __  / /_/ / /_/ / /_/ /__/ / \r\n");
                        this.term.write("/_/ /_/\\____/\\____/_____/____/\r\n");
                        this.term.write("\r\n");
                        this.term.write(`HOOBS ${this.version}\r\n`);
                        this.term.write("\r\n");
                        this.term.write(`${chunk(this.$t("motd"), 40).join("\r\n")}\r\n`);
                        this.term.write("\r\n");

                        this.socket.emit("shell_input", "");
                    } else {
                        this.socket.emit("shell_clear");
                    }
                }

                this.initilize = false;
            },

            resize() {
                if (this.$refs.container) this.$refs.container.style.display = "none";

                setTimeout(() => {
                    if (this.term && this.$refs.flow) {
                        const cols = Math.floor((this.$refs.flow.clientWidth + 1) / this.text.width) - 1;
                        const rows = Math.floor((this.$refs.flow.clientHeight + 1) / this.text.height) + 3;

                        if (this.$refs.container) this.$refs.container.style.display = "block";
                        if (this.screen) this.screen.fit();

                        this.term.resize(cols, rows);
                        this.socket.emit("shell_resize", `${cols}:${rows}`);
                        this.term.focus();
                    }
                }, 10);
            },
        },
    };
</script>

<style lang="scss" scoped>
    #terminal {
        flex: 1;
        display: flex;
        background: var(--application-background);
        flex-direction: column;
        position: relative;

        .measure {
            position: absolute;
            top: 0;
            left: 0;
            visibility: hidden;
            font-family: courier-new, courier, monospace;
            font-size: 14px;
            height: auto;
            width: auto;
            white-space: nowrap;
        }

        .flow {
            flex: 1;
            display: flex;
            flex-direction: column;
            margin: 0 -5px 20px 20px;

            .container {
                width: 100%;
                height: 100%;
            }
        }
    }
</style>

<style lang="scss">
    .shell {
        width: 100%;
        height: 100%;
    }

    .xterm {
        font-feature-settings: "liga" 0;
        position: relative;
        user-select: none;
        -ms-user-select: none;
        -webkit-user-select: none;
        cursor: text;

        &:focus {
            outline: none;
        }

        .xterm-helpers {
            position: absolute;
            top: 0;
            z-index: 10;
        }

        .xterm-helper-textarea {
            position: absolute;
            opacity: 0;
            left: -9999em;
            top: 0;
            width: 0;
            height: 0;
            z-index: -10;
            white-space: nowrap;
            overflow: hidden;
            resize: none;
        }

        .composition-view {
            background: var(--application-background) !important;
            color: #fff;
            display: none;
            position: absolute;
            white-space: nowrap;
            z-index: 1;
        }

        .composition-view.active {
            display: block;
        }

        .xterm-viewport {
            background-color: var(--application-background) !important;
            position: absolute;
            right: 0;
            left: 0;
            top: 0;
            bottom: 0;
            overflow-y: auto;
            -ms-overflow-style: none;
            scrollbar-width: none;
            cursor: default;

            &::-webkit-scrollbar {
                display: none;
            }
        }

        .xterm-screen {
            position: relative;

            canvas {
                position: absolute;
                left: 0;
                top: 0;
            }
        }

        .xterm-scroll-area {
            visibility: hidden;
        }

        .xterm-accessibility {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            z-index: 100;
            color: transparent;
        }

        .xterm-message {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            z-index: 100;
            color: transparent;
        }

        .live-region {
            position: absolute;
            left: -9999px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        }
    }

    .xterm.focus {
        outline: none;
    }

    .xterm-char-measure-element {
        display: inline-block;
        visibility: hidden;
        position: absolute;
        top: 0;
        left: -9999em;
        line-height: normal;
    }

    .xterm.enable-mouse-events {
        cursor: default;
    }

    .xterm.xterm-cursor-pointer {
        cursor: pointer;
    }

    .xterm.column-select.focus {
        cursor: crosshair;
    }

    .xterm-dim {
        opacity: 0.5;
    }

    .xterm-underline {
        text-decoration: underline;
    }
</style>
