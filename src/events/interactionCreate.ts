import {
    BaseInteraction, ButtonInteraction,
    ChatInputCommandInteraction,
    Events,
    MessageFlagsBitField, ModalSubmitInteraction, RoleSelectMenuInteraction,
    StringSelectMenuInteraction
} from "discord.js";

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction: BaseInteraction) {
        if (interaction.isChatInputCommand()) await chatInputCommand(interaction)
        else if (interaction.isButton()) await buttonInteraction(interaction)
        else if (interaction.isStringSelectMenu()) await stringSelectMenu(interaction)
        else if ( interaction.isRoleSelectMenu()) await roleSelectMenu(interaction)
        else if (interaction.isModalSubmit()) await modalSubmit(interaction)
    },
};

async function chatInputCommand(interaction: ChatInputCommandInteraction) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlagsBitField.Flags.Ephemeral });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlagsBitField.Flags.Ephemeral });
        }
    }
}

async function stringSelectMenu(interaction: StringSelectMenuInteraction) {

}

async function roleSelectMenu(interaction: RoleSelectMenuInteraction) {

}

async function buttonInteraction(interaction: ButtonInteraction) {

}

async function modalSubmit(interaction: ModalSubmitInteraction) {

}