const Discord = require("discord.js");
const client = new Discord.Client({
    presence: {
        activity: {
            name: "k!help"
        }	
    }
});

require('dotenv').config();

//Setting Up Commands Dir
const { readdirSync } = require('fs');
client.commands = new Discord.Collection();
const commandDirs = readdirSync('./commands').filter(file => file.endsWith('.js'));
commandDirs.forEach(command => client.commands.set(command.replace('.js', ''), require(`./commands/${command}`)));

client.on('ready', () => {
    console.log("Ready");
});

client.on('message', message => {
    let prefix = process.env.BOT_PREFIX;
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    try {
        if (command != '') {
            client.commands.get(command).execute(message, args);
        }
        else {
            client.commands.get('help').execute(message, args);
        }
    }
    catch (error) {
        console.error(error);
        message.channel.send("An error occured: \n" + error);
    }
});

client.login(process.env.BOT_TOKEN);