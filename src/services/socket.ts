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

class Socket {
    declare private io: SocketIOClient.Socket;

    declare private url: string;

    declare private events: { [key: string]: ((args: any) => any) };

    constructor() {
        this.events = {};
        this.url = `${window.location.protocol}//${window.location.hostname}`;

        if (process.env.NODE_ENV === "production") {
            if (window.location.port !== "80" && window.location.port !== "443") {
                this.url += `:${window.location.port}`;
            }
        } else {
            this.url = "http://localhost:50826";
        }

        this.io = SocketIO(this.url);
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
        this.io.emit(event, args);
    }
}

const socket = new Socket();

export default socket;
