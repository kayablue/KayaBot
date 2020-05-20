const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Shows what the command do or list of all commands',
    execute(message, args) {
        if (!args.length) {
            //Code if no command specified
            let commandsInfo = [];
            message.client.commands.array().forEach(command => {
                if (command.name != 'help') commandsInfo.push({ name: command.name, value: command.description });
            });
            let helpEmbed = new Discord.MessageEmbed()
                .setTitle("Available Commands")
                .setDescription('Type gp help <command> to get more information')
                .setColor("PURPLE")
                .addFields(commandsInfo)
            message.channel.send(helpEmbed);
        }
        else {
            //Code if there's something like 'gp help guild'
            console.log(message.client.commands);
            let command = message.client.commands.get(args[0])
            let helpEmbed = new Discord.MessageEmbed()
                .setTitle(`Command ${command.name}`)
                .addFields(
                    { name: "Description", value: command.description },
                    { name: "Example usage", value: command.example },
                )
                .setColor("#FFC0CB")
            message.channel.send(helpEmbed);
        }
        
    }
}