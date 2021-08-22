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

import { deflate, inflate } from "pako";

export function parseJson<T>(value: string, replacement: T): T {
    try {
        return <T>JSON.parse(value);
    } catch (_error) {
        return replacement;
    }
}

export function jsonEquals(source: { [key: string]: any }, value: { [key: string]: any }): boolean {
    if (JSON.stringify(source) === JSON.stringify(value)) return true;

    return false;
}

export function cloneJson(object: { [key: string]: any }): any {
    return JSON.parse(JSON.stringify(object));
}

export function formatJson(object: { [key: string]: any }, pretty?: boolean): string {
    if (pretty) return JSON.stringify(object, null, 4);

    return JSON.stringify(object);
}

export function compressJson(value: { [key: string]: any }): Uint8Array {
    const buffer = new TextEncoder().encode(JSON.stringify(value));
    const results = deflate(buffer);

    return results;
}

export function decompressJson(value: Uint8Array): { [key: string]: any } {
    try {
        return JSON.parse((new TextDecoder()).decode(inflate(value)));
    } catch (_error) {
        return {};
    }
}
