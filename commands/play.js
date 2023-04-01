const { SlashCommandBuilder} = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");
//const { Player } = require('discord-player');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("plays song from YouTube")
        .addSubcommand((subcommand)=>
            subcommand
            .setName("song")
            .setDescription("loads single song from a url")
            .addStringOption((option)=> 
                option
                .setName("url")
                .setDescription("The song's url")
                .setRequired(true)
            )
        )

        .addSubcommand((subcommand)=>
            subcommand
            .setName("playlist")
            .setDescription("Loads a playlist of songs from a url")
            .addStringOption((option)=> 
                option
                .setName("url")
                .setDescription("the playlist's url")
                .setRequired(true)
            )
        )

        .addSubcommand((subcommand)=>
        subcommand
        .setName("search")
        .setDescription("Searches for songs based on provided keywords")
        .addStringOption((option)=> 
            option
            .setName("searchterms")
            .setDescription("the search keywords")
            .setRequired(true))
        ),

        run: async ( {client, interaction} ) => {
            if(!interaction.member.voice.channel)
                return interaction.editReply("You need to be in a vc to use this command.");
            
            try {
            //create queue
            //console.log(interaction.guild);
            //const player = new Player(client);
            const queue = await client.player.createQueue(interaction.guild, {
                metadata: {
                    channel: interaction.channel
                }
            });

            //if bot is not connected to the same vc as user then do that
            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } 

            catch {
                queue.destroy();
                return await interaction.reply({ content: "Could not join your voice channel!", ephemeral: true });
            }

            //make embed
            let embed = new EmbedBuilder();

            //if the command was "song"
            if (interaction.options.getSubcommand() === "song") {

                //fetch url 
                let url = interaction.options.getString("url");
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_VIDEO
                });

                console.log(`number of results are ${result.tracks.length}`);
                //if result has 0 results then return No Results
                if(result.tracks.length === 0 ){
                    return interaction.editReply("No results");
                }

                //otherwise play the first song in tracks returned by the url
                const song = result.tracks[0];

                //add to queue and show embed with information about the song
                await queue.addTrack(song);
                embed.setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.setThumbnail)
                .setFooter({ text: `Duration: ${song.duration}`});

            }

            else if (interaction.options.getSubcommand() === "playlist"){

                //fetch url 
                let url = interaction.options.getString("url");
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_PLAYLIST
                });

                console.log(`number of results are ${result.tracks.length}`);
                //if result has 0 results then return No Results
                if(result.tracks.length === 0 ){
                    return interaction.editReply("No results");
                }

                //otherwise play the playlist found
                const playlist = result.playlist;

                //add to queue and show embed with information about the playlist
                await queue.addTracks(playlist);
                embed.setDescription(`**[${playlist.title}](${playlist.url})** has been added to the Queue`)
                .setThumbnail(playlist.setThumbnail)
                .setFooter({ text: `Duration: ${playlist.duration}`});


            }
            else if (interaction.options.getSubcommand() === "search"){
                //fetch url 
                let url = interaction.options.getString("searchterms");
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO
                });

                console.log(`number of results are ${result.tracks.length}`);
                //if result has 0 results then return No Results
                if(result.tracks.length === 0 ){
                    return interaction.editReply("No results found from search");
                }

                //otherwise play the first song in tracks returned by the url
                const song = result.tracks[0];

                //add to queue and show embed with information about the song
                await queue.addTrack(song);
                embed.setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`});

            }

            //console.log(queue.playing);
            if (!queue.playing) await queue.play();
            //console.log(queue.nowPlaying);
            await interaction.editReply({
                embeds: [embed]
            });
                
            } catch (error) {
                console.log(error);
                console.log("error is here");
            }
            
        }

}