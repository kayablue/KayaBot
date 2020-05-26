const { MessageEmbed } = require('discord.js');
const nekoClient = require('nekos.life');
const { nsfw } = new nekoClient();
require('dotenv').config()

module.exports = {
    name: 'nekos',
    description: 'You know what it does',
    example: "```k!nekos <tags>```",
    execute(message, args) {
        if (message.channel.nsfw) {
            nsfw.neko().then(data => { 
                message.channel.send(new MessageEmbed({
                    image: {
                        url: data.url
                    },
                    color: 'PURPLE'
                })) 
            })
        } else message.channel.send('Only available in nsfw channels!')
    }
}