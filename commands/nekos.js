const KayaEmbed = require('../structures/kayaEmbed')
const Command = require('../structures/command');
const nekoClient = require('nekos.life');
const { nsfw } = new nekoClient();

module.exports = new Command('nekos', 'Get your neko image', '<tags>', (message, args) => {
    if (message.channel.nsfw) {
        nsfw.neko().then(data => { 
            message.channel.send(new KayaEmbed({
                image: {
                    url: data.url
                }
            })) 
        })
    } else message.channel.send('Only available in nsfw channels!')
})