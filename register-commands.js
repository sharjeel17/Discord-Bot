require('dotenv').config();
const {REST, Routes, Guild, GuildDefaultMessageNotifications} =  require('discord.js');
const { token , CLIENT_ID, GUILD_ID2 } = process.env;

const commands = [
    {
        name: 'mahin',
        description: 'Kicks mahin out of the server lol',

    },
];

const rest = new REST({ version: '10' }).setToken(process.env.token);
(async () => {
    try {

        
        console.log('Registering commands');

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID2),
            { body: commands }
        );

        console.log(GUILD_ID2);

        console.log('Registered commands');

    } catch (error) {
        console.log(`There was an error ${error}`);
    }
})();
