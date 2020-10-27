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

export default class Themes {
    static path(theme: string) {
        switch (theme) {
            case "light":
            case "dark":
                return `/defaults/${theme}/theme.css`;

            default:
                if (process.env.NODE_ENV !== "production") {
                    return `http://localhost:50826/themes/${theme}.css`;
                }

                if (window.location.port !== "80" && window.location.port !== "443") {
                    return `:${window.location.port}/themes/${theme}.css`;
                }

                return `/themes/${theme}`;
        }
    }
}
