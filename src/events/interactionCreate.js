"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    name: discord_js_1.Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand())
            await chatInputCommand(interaction);
        else if (interaction.isButton())
            await buttonInteraction(interaction);
        else if (interaction.isStringSelectMenu())
            await stringSelectMenu(interaction);
        else if (interaction.isRoleSelectMenu())
            await roleSelectMenu(interaction);
        else if (interaction.isModalSubmit())
            await modalSubmit(interaction);
    },
};
async function chatInputCommand(interaction) {
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    try {
        await command.execute(interaction);
    }
    catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', flags: discord_js_1.MessageFlagsBitField.Flags.Ephemeral });
        }
        else {
            await interaction.reply({ content: 'There was an error while executing this command!', flags: discord_js_1.MessageFlagsBitField.Flags.Ephemeral });
        }
    }
}
async function stringSelectMenu(interaction) {
}
async function roleSelectMenu(interaction) {
}
async function buttonInteraction(interaction) {
}
async function modalSubmit(interaction) {
}
