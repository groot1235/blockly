"use client";

import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";

const MOVEMENT_HUE = 290;
const LOOPS_HUE = 120;
const LOGIC_HUE = 210;

Blockly.defineBlocksWithJsonArray([
    {
        "type": "maze_moveForward",
        "message0": "move forward",
        "previousStatement": null,
        "nextStatement": null,
        "colour": MOVEMENT_HUE,
    },
    {
        "type": "maze_turn",
        "message0": "turn %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "DIR",
                "options": [
                    ["left \u21BA", "turnLeft"],
                    ["right \u21BB", "turnRight"]
                ],
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": MOVEMENT_HUE,
    },
    {
        "type": "maze_if",
        "message0": "if path %1 do %2",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "DIR",
                "options": [
                    ["ahead", "isPathForward"],
                    ["to the left \u21BA", "isPathLeft"],
                    ["to the right \u21BB", "isPathRight"]
                ],
            },
            {
                "type": "input_statement",
                "name": "DO",
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": LOGIC_HUE,
    },
    {
        "type": "maze_ifElse",
        "message0": "if path %1 do %2 else %3",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "DIR",
                "options": [
                    ["ahead", "isPathForward"],
                    ["to the left \u21BA", "isPathLeft"],
                    ["to the right \u21BB", "isPathRight"]
                ],
            },
            {
                "type": "input_statement",
                "name": "DO",
            },
            {
                "type": "input_statement",
                "name": "ELSE",
            },
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": LOGIC_HUE,
    },
    {
        "type": "maze_forever",
        "message0": "repeat until marker do %1",
        "args0": [
            {
                "type": "input_statement",
                "name": "DO",
            }
        ],
        "previousStatement": null,
        "colour": LOOPS_HUE,
    },
]);

// Code Generators for Javascript execution with Async/Await wrapper
javascriptGenerator.forBlock['maze_moveForward'] = function (_block: Blockly.Block) {
    return 'await moveForward();\n';
};

javascriptGenerator.forBlock['maze_turn'] = function (block: Blockly.Block) {
    const dir = block.getFieldValue('DIR');
    return `await ${dir}();\n`;
};

javascriptGenerator.forBlock['maze_if'] = function (block: Blockly.Block) {
    const dir = block.getFieldValue('DIR');
    const branch = javascriptGenerator.statementToCode(block, 'DO');
    return `if (await ${dir}()) {\n${branch}}\n`;
};

javascriptGenerator.forBlock['maze_ifElse'] = function (block: Blockly.Block) {
    const dir = block.getFieldValue('DIR');
    const branch1 = javascriptGenerator.statementToCode(block, 'DO');
    const branch2 = javascriptGenerator.statementToCode(block, 'ELSE');
    return `if (await ${dir}()) {\n${branch1}} else {\n${branch2}}\n`;
};

javascriptGenerator.forBlock['maze_forever'] = function (block: Blockly.Block) {
    const branch = javascriptGenerator.statementToCode(block, 'DO');
    // We add an anti-infinite loop yield (1000 iteration max handled on evaluator side)
    return `while (!(await isDone())) {\nawait yieldStep();\n${branch}}\n`;
};

