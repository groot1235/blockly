"use client";

import * as Blockly from "blockly";
import "./traitBlocks";

const ANIMAL_HUE = 120;
const PICTURE_HUE = 30;

Blockly.defineBlocksWithJsonArray([
    {
        "type": "puzzle_animal",
        "message0": "Animal: %1 %2 Picture: %3 %4 Legs: %5 %6 Traits: %7",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "ANIMAL",
                "options": [
                    ["Duck", "DUCK"],
                    ["Cat", "CAT"],
                    ["Bee", "BEE"],
                    ["Snail", "SNAIL"]
                ]
            },
            { "type": "input_dummy" },
            {
                "type": "input_value",
                "name": "PIC",
                "align": "RIGHT"
            },
            { "type": "input_dummy" },
            {
                "type": "field_dropdown",
                "name": "LEGS",
                "options": [
                    ["choose...", ""],
                    ["0", "0"],
                    ["2", "2"],
                    ["4", "4"],
                    ["6", "6"]
                ]
            },
            { "type": "input_dummy" },
            {
                "type": "input_statement",
                "name": "TRAITS"
            }
        ],
        "colour": ANIMAL_HUE,
    },
    {
        "type": "puzzle_picture",
        "message0": "Picture %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "PIC_SEL",
                "options": [
                    ["Cat Image", "CAT"],
                    ["Duck Image", "DUCK"],
                    ["Bee Image", "BEE"],
                    ["Snail Image", "SNAIL"]
                ]
            }
        ],
        "output": null,
        "colour": PICTURE_HUE,
    },
]);
