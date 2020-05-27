//This is my first time using classes
const Discord = require("discord.js");
require('./db/db');
require('dotenv').config();

//Setting Up Commands Dir
const { readdirSync } = require('fs');

class Commands extends Discord.Collection {
    constructor(options) {
        super()
        this.commandsPath = options.commandsPath;
        this.commandDirs = readdirSync(this.commandsPath).filter(file => file.endsWith('.js'))
        this.commandDirs.forEach(command => {this.set(command.replace('.js', ''), require(`${this.commandsPath}/${command}`))})
    }
}

//Main Class
class KayaBot extends Discord.Client {
    constructor(options) {
        super(options);
        this.prefix = options.prefix;
        this.commands = new Commands({commandsPath: options.commandsPath})
    }

    login(token) {
        this._setupClient()
        return super.login(token);
    }

    _setupClient() {
        this.on('message', async message => {
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

new KayaBot({
    presence: {
        activity: {
            name: "k!help"
        }	
    }, 
    prefix: process.env.BOT_PREFIX,
    commandsPath: './commands'
}).login(process.env.BOT_TOKEN)