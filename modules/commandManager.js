const { Collection } = require('discord.js');
const { readdirSync } = require('fs');

class CommandManager extends Collection {
    constructor(path) {
        super()
        this.commandDirs = readdirSync(path).filter(file => file.endsWith('.js'))
        this.commandDirs.forEach(command => {this.set(command.replace('.js', ''), require(`../${path}/${command}`))})
    }
}

module.exports = CommandManager;