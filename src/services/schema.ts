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

export function prune(input: any): any {
    if (typeof (input) === "object") {
        if (input instanceof Date) {
            return input.toISOString().slice(0, 10);
        }

        if (!Array.isArray(input)) {
            const output: any = {};
            const members = Object.keys(input);

            for (let i = 0; i < members.length; i += 1) {
                const value = prune(input[members[i]]);

                if (value !== undefined) output[members[i]] = value;
            }

            if (Object.keys(output).length > 0) return output;
        } else {
            const output: any = [];
            const members = Object.keys(input);

            for (let i = 0; i < members.length; i += 1) {
                const value = prune(members[i]);

                if (value !== undefined) output.push(value);
            }

            if (output.length > 0) return output;
        }
    } else if (input !== undefined && input !== "") {
        return input;
    }

    return undefined;
}

export function scaffold(input: any, callback: any): any {
    if (input.type === "object") {
        const output: any = {};
        const keys = Object.keys(input.properties);

        for (let i = 0; i < keys.length; i += 1) {
            output[keys[i]] = scaffold(input.properties[keys[i]], callback);
        }

        return output;
    }

    if (input.type === "array") {
        return [scaffold(input.items, callback)];
    }

    return callback === undefined ? callback : callback(input);
}

export function merge(first: any, second: any) {
    if (typeof (first) === "object" && typeof (second) === "object") {
        if (!Array.isArray(first)) {
            const output: any = {};
            const members = Object.keys(first);

            for (let i = 0; i < members.length; i += 1) {
                output[members[i]] = merge(first[members[i]], second[members[i]]);
            }

            return output;
        }

        return Array.isArray(second) && second.length > 0 && prune(second[0]) !== undefined ? second : first;
    }

    return (second !== undefined) ? second : first;
}

export const draft = {
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: "http://json-schema.org/draft-07/schema#",
    title: "Core schema meta-schema",
    definitions: {
        schemaArray: {
            type: "array",
            minItems: 1,
            items: { $ref: "#" },
        },
        nonNegativeInteger: { type: "integer", minimum: 0 },
        nonNegativeIntegerDefault0: {
            allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }],
        },
        simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] },
        stringArray: {
            type: "array",
            items: { type: "string" },
            uniqueItems: true,
            default: [],
        },
    },
    type: ["object", "boolean"],
    properties: {
        $id: { type: "string", format: "uri-reference" },
        $schema: { type: "string", format: "uri" },
        $ref: { type: "string", format: "uri-reference" },
        $comment: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        default: true,
        readOnly: { type: "boolean", default: false },
        examples: { type: "array", items: true },
        multipleOf: { type: "number", exclusiveMinimum: 0 },
        maximum: { type: "number" },
        exclusiveMaximum: { type: "number" },
        minimum: { type: "number" },
        exclusiveMinimum: { type: "number" },
        maxLength: { $ref: "#/definitions/nonNegativeInteger" },
        minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        pattern: { type: "string", format: "regex" },
        additionalItems: { $ref: "#" },
        items: {
            anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }],
            default: true,
        },
        maxItems: { $ref: "#/definitions/nonNegativeInteger" },
        minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        uniqueItems: { type: "boolean", default: false },
        contains: { $ref: "#" },
        maxProperties: { $ref: "#/definitions/nonNegativeInteger" },
        minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        required: { $ref: "#/definitions/stringArray" },
        additionalProperties: { $ref: "#" },
        definitions: {
            type: "object",
            additionalProperties: { $ref: "#" },
            default: {},
        },
        properties: {
            type: "object",
            additionalProperties: { $ref: "#" },
            default: {},
        },
        patternProperties: {
            type: "object",
            additionalProperties: { $ref: "#" },
            propertyNames: { format: "regex" },
            default: {},
        },
        dependencies: {
            type: "object",
            additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] },
        },
        propertyNames: { $ref: "#" },
        const: true,
        enum: {
            type: "array",
            items: true,
            minItems: 1,
            uniqueItems: true,
        },
        type: {
            anyOf: [
                { $ref: "#/definitions/simpleTypes" },
                {
                    type: "array",
                    items: { $ref: "#/definitions/simpleTypes" },
                    minItems: 1,
                    uniqueItems: true,
                },
            ],
        },
        format: { type: "string" },
        contentMediaType: { type: "string" },
        contentEncoding: { type: "string" },
        if: { $ref: "#" },
        then: { $ref: "#" },
        else: { $ref: "#" },
        allOf: { $ref: "#/definitions/schemaArray" },
        anyOf: { $ref: "#/definitions/schemaArray" },
        oneOf: { $ref: "#/definitions/schemaArray" },
        not: { $ref: "#" },
    },
    default: true,
};
