/**************************************************************************************************
 * hoobs-gui                                                                                      *
 * Copyright (C) 2020 HOOBS                                                                       *
 *                                                                                                *
 * This program is free software: you can redistribute it and/or modify                           *
 * it under the terms of the GNU General Public License as published by                           *
 * the Free Software Foundation, either version 3 of the License, or                              *
 * (at your option) any later version.                                                            *
 *                                                                                                *
 * This program is distributed in the hope that it will be useful,                                *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of                                 *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the                                  *
 * GNU General Public License for more details.                                                   *
 *                                                                                                *
 * You should have received a copy of the GNU General Public License                              *
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.                          *
 **************************************************************************************************/

import SocketIO from "socket.io-client";

const SOCKET_URL = process.env.VUE_APP_SOCKET || "/";

class Socket {
    declare private io: SocketIOClient.Socket;

    declare private url: string;

    declare private events: { [key: string]: ((args: any) => any) };

    declare private terminal: boolean;

    constructor() {
        this.events = {};
        this.io = SocketIO(SOCKET_URL);
        this.terminal = false;
    }

    on(event: string, callback: (args: any) => any) {
        this.off(event);
        this.events[event] = callback;
        this.io.on(event, this.events[event]);
    }

    off(event: string) {
        this.io.off(event, this.events[event]);

        delete this.events[event];
    }

    emit(event: string, ...args: any) {
        if (event === "shell_connect") {
            if (this.terminal) this.emit("shell_disconnect");

            this.terminal = true;
        }

        if (event === "shell_disconnect") {
            if (this.terminal) this.off("shell_output");

            this.terminal = false;
        }

        this.io.emit(event, args);
    }

    mixin() {
        return { data: () => ({ io: this }) };
    }
}

export default function socket() {
    return new Socket();
}
