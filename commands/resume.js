const { SlashCommandBuilder} = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the current song."),
    
    run: async ({client, interaction}) => {

        const queue = client.player.getQueue(interaction.guild);

        if(!queue){
            await interaction.reply("There is no song playing.");
            return;
        }

        const currentSong = queue.current;

        queue.setPaused(false);

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Resumed **${currentSong.title}**`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}