const { SlashCommandBuilder} = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("deletes queue and exits vc"),
    
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guild);

        if(!queue){
            await interaction.reply("There is no song playing.");
            return;
        }

        queue.destroy();

        await interaction.editReply("...ok then");
    }
}