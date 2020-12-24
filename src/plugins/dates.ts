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

export default function dates(): { [key: string]: any } {
    return {
        computed: {
            $dates: () => ({
                display(value: string): string {
                    if (!value || value === "") return "";

                    const date = new Date(value);

                    if (new Date().getFullYear() === date.getFullYear()) {
                        return `${this.month(date.getMonth())} ${this.ordinal(date.getDate())}`;
                    }

                    return `${this.month(date.getMonth())} ${this.ordinal(date.getDate())}, ${date.getFullYear()}`;
                },

                ordinal(value: number): string {
                    const result = parseInt(`${value}`, 10);

                    if (Number.isNaN(result) || result <= 0) return `${result}`;
                    if (result % 10 === 1 && result % 100 !== 11) return `${result}st`;
                    if (result % 10 === 2 && result % 100 !== 12) return `${result}nd`;
                    if (result % 10 === 3 && result % 100 !== 13) return `${result}rd`;

                    return `${result}th`;
                },

                month(value: number): string {
                    switch (value % 12) {
                        case 1:
                            return "February";

                        case 2:
                            return "March";

                        case 3:
                            return "April";

                        case 4:
                            return "May";

                        case 5:
                            return "June";

                        case 6:
                            return "July";

                        case 7:
                            return "August";

                        case 8:
                            return "September";

                        case 9:
                            return "October";

                        case 10:
                            return "November";

                        case 11:
                            return "December";

                        default:
                            return "January";
                    }
                },

                age(value: string): string {
                    if (!value || value === "") return "";

                    const date = new Date(value);
                    const age = new Date().getTime() - date.getTime();
                    const future = age < 0;

                    if (Math.abs(age) < 2000) return "Now";
                    if (Math.abs(age) < 60000) return "A few seconds ago";
                    if (Math.abs(age) < 3600000 && Math.abs(age) >= 120000) return `${future ? "In " : ""}${Math.floor(Math.abs(age) / 60000)} minutes${future ? "" : " ago"}`;
                    if (Math.abs(age) < 3600000) return `${future ? "In " : ""}${Math.floor(Math.abs(age) / 60000)} minute${future ? "" : " ago"}`;
                    if (Math.abs(age) < 86400000 && Math.abs(age) >= 7200000) return `${future ? "In " : ""}${Math.floor(Math.abs(age) / 3600000)} hours${future ? "" : " ago"}`;
                    if (Math.abs(age) < 86400000) return `${future ? "In " : ""}${Math.floor(Math.abs(age) / 3600000)} hour${future ? "" : " ago"}`;
                    if (age > 0 && age < 604800000 && age >= 172800000) return `${Math.floor(Math.abs(age) / 86400000)} days ago`;
                    if (age > 0 && age < 604800000) return `${Math.floor(Math.abs(age) / 86400000)} day ago`;
                    if (new Date().getFullYear() === date.getFullYear()) return `${this.month(date.getMonth())} ${this.ordinal(date.getDate())}`;

                    return `${this.month(date.getMonth())} ${this.ordinal(date.getDate())}, ${date.getFullYear()}`;
                },
            }),
        },
    };
}
