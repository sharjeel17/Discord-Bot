// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();
const { token, ROLE_CHANNEL } = process.env;

// Create a new client instance
const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent
] });

const roles = [
    {
        id: '604936181767208970',
        label: 'Male'
    },
    {
        id: '604936337535008789',
        label: 'Female'
    },
    {
        id: '710312618048356434',
        label: '10/10'
    },
    {
        id: '701921703604781157',
        label: '3/10'
    },
]

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, async c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);

    try {

        //which channel is to be used
        const channel = await client.channels.cache.get(ROLE_CHANNEL);

        //if channel does not exist (false -> true)
        if(!channel) return;

        //row variable which will be used 
        const row = new ActionRowBuilder();

        roles.forEach((role) => {

            //create row with buttons
            row.components.push(
                new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
            );
        });

        //send role message
        await channel.send({
            content : 'Claim or remove a role',
            components: [row], 
        });

        process.exit();

    } catch (error) {
        console.log(error);
    }
});

// Log in to Discord with your client's token
client.login(token);