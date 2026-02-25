"use client";

import * as Blockly from "blockly";

// Define the custom puzzle blocks for the games

Blockly.Blocks['trait_whiskers'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Whiskers");
        this.setOutput(true, "String");
        this.setColour(160);
        this.setTooltip("Whiskers trait");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['trait_fur'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Fur");
        this.setOutput(true, "String");
        this.setColour(160);
        this.setTooltip("Fur trait");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['trait_honey'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Honey");
        this.setOutput(true, "String");
        this.setColour(45);
        this.setTooltip("Honey trait");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['trait_stinger'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Stinger");
        this.setOutput(true, "String");
        this.setColour(45);
        this.setTooltip("Stinger trait");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['trait_beak'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Beak");
        this.setOutput(true, "String");
        this.setColour(210);
        this.setTooltip("Beak trait");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['trait_feathers'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Feathers");
        this.setOutput(true, "String");
        this.setColour(210);
        this.setTooltip("Feathers trait");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['trait_slime'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Slime");
        this.setOutput(true, "String");
        this.setColour(290);
        this.setTooltip("Slime trait");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['trait_shell'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Shell");
        this.setOutput(true, "String");
        this.setColour(290);
        this.setTooltip("Shell trait");
        this.setHelpUrl("");
    }
};
