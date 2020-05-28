//This is my first time using classes
const { Client } = require("discord.js");
const CommandManager = require('./structures/commandManager');
require('./db/db');
require('dotenv').config();

//Main Class
class KayaBot extends Client {
    constructor(options) {
        super(options);
        this.prefix = options.prefix;
        this.commands = new CommandManager(options.commandsPath)
    }

    login(token) {
        this._setupClient()
        return super.login(token);
    }

    _setupClient() {
        this.on('message', message => {
            if (message.author.bot || !message.content.startsWith(this.prefix)) return;
            
            const args = message.content.slice(this.prefix.length).split(/ +/);
            const command = args.shift().toLowerCase();
            try {
                if (command != '') {
                    this.commands.get(command).execute(message, args);
                }
                else {
                    this.commands.get('help').execute(message, args);
                }
            } catch (error) {
                console.error(error);
                message.channel.send("No such command :c");
            }
        });
        this.on('ready', () => console.log('Ready'))
    }
}

//Starting The Bot
new KayaBot({
    presence: {
        activity: {
            name: "k!help"
        }	
    }, 
    prefix: process.env.BOT_PREFIX,
    commandsPath: './commands'
}).login(process.env.BOT_TOKEN)