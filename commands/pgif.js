const { MessageEmbed } = require('discord.js');
const PornHub = require('pornhub.js')
const pornhub = new PornHub();
require('dotenv').config()

module.exports = {
    name: 'pgif',
    description: 'You know what it does',
    example: "```k!pgif <query>(optional)```",
    execute(message, args) {
        //No Comments Lol

        if (message.channel.nsfw) {
            pornhub.search('Gif', args.join(" "), {sexualOrientation: undefined}).then(res => {
                let randomGif = res.data[Math.floor(Math.random() * res.data.length)];
                
                let embed = new MessageEmbed({description: randomGif.title}).attachFiles(randomGif.webm)
                message.channel.send(embed)
            })
        } else message.channel.send('Only available in nsfw channels!')
    }
}