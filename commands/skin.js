const KayaEmbed = require('../modules/kayaEmbed')
const Command = require('../modules/command')
const axios = require('axios')

module.exports = new Command('skin', 'Get Minecraft skin of a player', 'Kawaiinex', 'minecraft', async (message, args) => {
    try {
        let skinType = args[args.length - 1] == '-file' ? 'skin' : 'full';
        args = args[args.length - 1] == '-file' ? args.slice(0, args.length - 1) : args;

        let player = await axios.get('https://api.mojang.com/users/profiles/minecraft/' + args.join(' '))

        message.channel.send(new KayaEmbed({
            title: `${player.data.name} | Minecraft Skin`,
            image: {
                url: 'https://visage.surgeplay.com/' + skinType + '/'+ player.data.id
            }
        }))
    } catch(err) { message.channel.send('An Error Occured: ' + err) }
})