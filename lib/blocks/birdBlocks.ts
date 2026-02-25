"use client";

import * as Blockly from "blockly";
import { FieldAngle } from "@blockly/field-angle";
import { javascriptGenerator, Order } from "blockly/javascript";

try {
    Blockly.fieldRegistry.register('field_angle', FieldAngle);
} catch (e) {
    // Ignore error if already registered during HMR
}

const VARIABLES_HUE = 330;
const MOVEMENT_HUE = 290;
const LOGIC_HUE = 210;

Blockly.defineBlocksWithJsonArray([
    {
        "type": "bird_noWorm",
        "message0": "does not have worm",
        "output": "Boolean",
        "colour": VARIABLES_HUE,
        "tooltip": "Returns true if the bird has not gotten the worm.",
    },
    {
        "type": "bird_heading",
        "message0": "heading %1",
        "args0": [
            {
                "type": "field_angle",
                "name": "ANGLE",
                "angle": 90,
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": MOVEMENT_HUE,
        "tooltip": "Move bird in a direction.",
    },
    {
        "type": "bird_position",
        "message0": "%1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "XY",
                "options": [["x", "X"], ["y", "Y"]],
            }
        ],
        "output": "Number",
        "colour": VARIABLES_HUE,
        "tooltip": "x or y position of the bird.",
    },
    {
        "type": "bird_compare",
        "message0": "%1 %2 %3",
        "args0": [
            {
                "type": "input_value",
                "name": "A",
                "check": "Number",
            },
            {
                "type": "field_dropdown",
                "name": "OP",
                "options": [['<', 'LT'], ['>', 'GT']],
            },
            {
                "type": "input_value",
                "name": "B",
                "check": "Number",
            },
        ],
        "inputsInline": true,
        "output": "Boolean",
        "colour": LOGIC_HUE,
    },
    {
        "type": "bird_and",
        "message0": "%1 and %2",
        "args0": [
            {
                "type": "input_value",
                "name": "A",
                "check": "Boolean",
            },
            {
                "type": "input_value",
                "name": "B",
                "check": "Boolean",
            },
        ],
        "inputsInline": true,
        "output": "Boolean",
        "colour": LOGIC_HUE,
    }
]);

// Code Generators for Javascript execution

javascriptGenerator.forBlock['bird_noWorm'] = function (block: Blockly.Block) {
    return ['noWorm()', Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['bird_heading'] = function (block: Blockly.Block) {
    const dir = Number(block.getFieldValue('ANGLE'));
    return `heading(${dir});\n`;
};

javascriptGenerator.forBlock['bird_position'] = function (block: Blockly.Block) {
    const xy = block.getFieldValue('XY') === 'X' ? 'getX()' : 'getY()';
    return [xy, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['bird_compare'] = function (block: Blockly.Block) {
    const operator = block.getFieldValue('OP') === 'LT' ? '<' : '>';
    const argument0 = javascriptGenerator.valueToCode(block, 'A', Order.RELATIONAL) || '0';
    const argument1 = javascriptGenerator.valueToCode(block, 'B', Order.RELATIONAL) || '0';
    const code = `${argument0} ${operator} ${argument1}`;
    return [code, Order.RELATIONAL];
};

javascriptGenerator.forBlock['bird_and'] = function (block: Blockly.Block) {
    let argument0 = javascriptGenerator.valueToCode(block, 'A', Order.LOGICAL_AND);
    let argument1 = javascriptGenerator.valueToCode(block, 'B', Order.LOGICAL_AND);

    if (!argument0 && !argument1) {
        argument0 = 'false';
        argument1 = 'false';
    } else {
        if (!argument0) argument0 = 'true';
        if (!argument1) argument1 = 'true';
    }
    const code = `${argument0} && ${argument1}`;
    return [code, Order.LOGICAL_AND];
};
