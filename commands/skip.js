const { SlashCommandBuilder} = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song."),
    
    run: async ({client, interaction}) => {

        const queue = client.player.getQueue(interaction.guild);

        if(!queue){
            await interaction.reply("There is no song playing.");
            return;
        }

        const currentSong = queue.current;

        queue.skip();

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Skipped **${currentSong.title}**`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}