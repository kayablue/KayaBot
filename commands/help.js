const KayaEmbed = require('../structures/kayaEmbed')
const Command = require('../structures/command')

module.exports = new Command('help', 'Shows what the command do or list of all commands', '', (message, args) => {
    if (!args.length) {
        //Code if no command specified
        let commandsInfo = [];
        message.client.commands.array().forEach(command => {
            if (command.name != 'help') commandsInfo.push({ name: "`" + command.name + "`", value: command.description, inline: true });
        });
        let helpEmbed = new KayaEmbed({
            title: 'Available Commands',
            description: 'Type k!help <command> to get more information',
            fields: commandsInfo
        })
        message.channel.send(helpEmbed);
    }
    else {
        //Code if there's something like 'k!help guild'
        let command = message.client.commands.get(args[0])
        let helpEmbed = new KayaEmbed({
            title: `Command ${command.name}`,
            color: "#FFC0CB",
            fields: [
                { name: "Description", value: command.description },
                { name: "Example usage", value: command.example }
            ]
        })
        message.channel.send(helpEmbed);
    }
})