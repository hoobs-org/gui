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

import Showdown, { Converter } from "showdown";
import Highlight from "showdown-highlight";
import Emoji from "./emoji";

class Markdown {
    declare converter: Converter;

    constructor() {
        Showdown.setFlavor("github");

        this.converter = new Showdown.Converter({
            extensions: [
                Emoji,
                Highlight,
            ],
            tables: true,
            simplifiedAutoLink: true,
            excludeTrailingPunctuationFromURLs: true,
        });
    }

    mixin() {
        return {
            methods: {
                $markdown: (value: string): string => this.converter.makeHtml((value || "").replace(/```[a-zA-Z ]*\n/gi, (match) => `${match.trim().toLowerCase()}\n`)),
            },
        };
    }
}

export default function markdown(): Markdown {
    return new Markdown();
}
