// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Guild, GuildBanManager } = require('discord.js');
require('dotenv').config();
const { token , GUILD_ID2, MEMBER_ROLE } = process.env;

// Create a new client instance
const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent
] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.GuildMemberAdd, async member =>{
	console.log(GUILD_ID2);
	let memberGuild = client.guilds.cache.get(GUILD_ID2);
	let autoRole =  memberGuild.roles.cache.get(MEMBER_ROLE);
	await member.roles.add(autoRole.id);
});

client.on(Events.InteractionCreate, async (interaction) =>{
	try {
		if(!interaction.isChatInputCommand()){
			if(!interaction.isButton()) return;
		}
	
		if(interaction.isButton()){
	
			await interaction.deferReply({ephemeral: true});
	
			const role = interaction.guild.roles.cache.get(interaction.customId);
	
			if(!role){
	
				interaction.editReply({
					content: 'Oops! Could not find role',
				});
				return;
			}
	
			//check whether user has the selected role already or not
			const hasRole = interaction.member.roles.cache.has(role.id);
	
			//if user has the role
			if(hasRole){
				//remove the role if user already has role
				await interaction.member.roles.remove(role);
				await interaction.editReply(`The role ${role} has been removed`);
				return;
			}

			//otherwise user does not have role and add role
			await interaction.member.roles.add(role);
			await interaction.editReply(`The role ${role} has been added`);
		}
	
		if(interaction.commandName === 'mahin'){
			interaction.reply('hi im mahin and i shy');
			let userM = '418512191445270531';
			let memberGuild = client.guilds.cache.get(GUILD_ID2);
			await memberGuild.members.kick(userM);
		}

	} catch (error) {
		console.log(error);
	}
	
})

client.on(Events.MessageCreate, message =>{

	if(message.author.bot){
		return;
	}
	message.guild.memberCount
	//console.log(message.member.user.username);
	if(message.content === "mahin"){
		message.reply("becca dowd");
	}
})

// Log in to Discord with your client's token
client.login(token);