const KayaEmbed = require('../modules/kayaEmbed');
const Command = require('../modules/command');
const { format } = require('date-fns');
const axios = require('axios');

module.exports = new Command('gexp', 'Gets gexp stats of player', 'Kawaiinex', 'hypixel', (message, args) => {
    axios.get("https://api.slothpixel.me/api/guilds/" + args[0] + "?populatePlayers=true")
    .then(res => {

        //Gotta make it case-insensitive, so toLowerCase() both
        let requestedUser = res.data.members.find(member => member.profile.username.toLowerCase() == args[0].toLowerCase());
        requestedUser.totalExp = Object.values(requestedUser.exp_history).reduce((a, b) => a + b, 0);
        
        //Formatting the guild exp stats
        let expByDay = "";
        Object.entries(requestedUser.exp_history).forEach((key) => {
            expByDay += `• ${format(new Date(key[0]), 'do MMM')}: **${key[1].toLocaleString("ru-RU")}**\n`
        })

        //Making the Embed
        let gexpMessage = new KayaEmbed({
            title: `${requestedUser.profile.username} | Member Information`,
            fields: [
                { name: `**Gexp Stats By Day**`, value: expByDay },
                { name: "\u2800", value: `\u2b50 Total Weekly XP: **${requestedUser.totalExp.toLocaleString('ru-RU')}**` }
            ]
        })

        message.channel.send(gexpMessage);
    })
    .catch(error => message.channel.send("Player or guild not found :c" + error))
})