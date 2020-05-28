const KayaEmbed = require('../structures/kayaEmbed')
const Command = require('../structures/command')
const axios = require('axios');

module.exports = new Command('sw', "Get Player's Hypixel SkyWars Stats", '<playername>', 'hypixel', async (message, args) => {
    let res = await axios.get('https://api.hypixel.net/player', {
        params: {
            key: process.env.HYPIXEL_API_KEY,
            name: args.join(' ')
        }
    })
    let sw = res.data.player.stats.SkyWars;

    function calculateLevel(xp) {
        let xps = [0, 20, 70, 150, 250, 500, 1000, 2000, 3500, 6000, 10000, 15000];
        if (xp >= 15000) return (xp - 15000) / 10000. + 12
        else {
            for(i = 0; i < xps.length; i++) {
                if (xp < xps[i]) return 1 + i + (xp - xps[i-1]) / (xps[i] - xps[i-1])
            }
        }
    }



    message.channel.send(new KayaEmbed({
        author: {
           name: `${res.data.player.displayname} | SkyWars Info`,
           icon_url: 'https://visage.surgeplay.com/face/' + res.data.player.uuid
        }, 
        fields: [
            {
                name: '**General Stats**',
                value: `• Wins: **${sw.wins}**
                • Losses: **${sw.losses}**
                • W/L: **${Math.round((sw.wins / sw.losses + Number.EPSILON) * 100) / 100}**
                • Level: **${Math.round(calculateLevel(sw.skywars_experience) * 100) / 100}**
                • Kills: **${sw.kills}**
                • Deaths: **${sw.deaths}**
                • K/D: **${Math.round((sw.kills / sw.deaths + Number.EPSILON) * 100) / 100}**
                • Winstreak: **${sw.win_streak}**
                • Games Played: **${sw.games_played_skywars}**
                • Quits: **${sw.quits}**
                `
            }
        ]
    }))
})