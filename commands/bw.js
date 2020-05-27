const { ReactionCollector } = require('discord.js');
const KayaEmbed = require('../structures/kayaEmbed')
const axios = require('axios');
const Command = require('../structures/command.js');



module.exports = new Command('bw', 'Get Player BedWars Stats', '<player>', (requestMessage, args) => {
    axios.get("https://api.slothpixel.me/api/players/" + args.join(" ")).then(res => {
        //Variables
        let bw = res.data.stats.BedWars;
        let gamemodes = [ 
            bw.gamemodes.solo, bw.gamemodes.doubles, bw.gamemodes['3v3v3v3'], bw.gamemodes['4v4v4v4'], 
            bw.gamemodes.rush_solo, bw.gamemodes.rush_doubles, bw.gamemodes.ultimate_solo, 
            bw.gamemodes.ultimate_doubles, bw.gamemodes.castle 
        ]
        let gamemodeNames = ['Solo', 'Doubles', '3v3v3v3', '4v4v4v4', 'Rush Solo', 'Rush Doubles', 'Ultimate Solo', 'Ultimate Doubles', 'Castle']
        let i = 0;
        let gamemodesFormated = [];
        //Making Formatted Second Page
        gamemodes.forEach(gamemode => {
            gamemodesFormated.push({
                name: `**${gamemodeNames[i]}**`,
                value: ` • Wins: **${gamemode.wins}**
• Kills: **${gamemode.kills}**
• Loses: **${gamemode.losses}**
• K/D: **${Math.round((gamemode.kills / gamemode.deaths + Number.EPSILON) * 100) / 100}**
• W/L: **${Math.round((gamemode.wins / gamemode.losses + Number.EPSILON) * 100) / 100}**
• Deaths: **${gamemode.deaths}**
• Curent Winstreak: **${gamemode.winstreak}**
• Final Kills: **${gamemode.final_kills}**
• Final Death: **${gamemode.final_deaths}**
• Games Played: **${gamemode.games_played}**
• Beds Broken: **${gamemode.beds_broken}**
                `.replace(/undefined|NaN/gi, '0'), 
                inline: true
            })
            i++;
        })
        i = 0;
        let pages = [
            [{
                name: '**General Info**',
                value: ` • Wins: **${bw.wins}**
• Kills: **${bw.kills}**
• Loses: **${bw.losses}**
• K/D: **${bw.k_d}**
• W/L: **${bw.w_l}**
• Deaths: **${bw.deaths}**
• Coins: **${bw.coins}**
• Curent Winstreak: **${bw.winstreak}**
• Final Kills: **${bw.final_kills}**
• Final Death: **${bw.final_deaths}**
• Final K/D: **${bw.final_k_d}**
• Total Games Played: **${bw.games_played}**
• Total Beds Broken: **${bw.beds_broken}**
                `
            }],
            gamemodesFormated
        ];

        //Making Embed
        function makeEmbed() {
            try {
                return new KayaEmbed({
                    author: {
                        name: `${res.data.username}  |  The BedWars Stats`,
                        icon_url: 'https://visage.surgeplay.com/face/' + res.data.uuid
                    },
                    color: "PURPLE",
                    fields: pages[i],
                    footer: { 
                        text: `Made by kayablue#2395 | Page ${i + 1}/${pages.length}`
                    }
                }) } catch (error) { /* Nothing here....... */ }
            
        }
        let bwEmbed = makeEmbed();

        //That Pagination Thing
        requestMessage.channel.send(bwEmbed)
        .then(embedMessage => {
            async function pagesInit (embedMessage, requestMessage) {
            //I like async (no)
            await embedMessage.react("⬅")
            await embedMessage.react("➡")


            //Initializing The Pagination Using ReactionCollector
            let pagination = new ReactionCollector(embedMessage, (args) => {
                emoji = args._emoji.name;
                if (emoji.search(/[➡⬅⏩⏪]/i) != -1) return true;    
                }, {
                    time: 60000,
                    dispose: true
                })
            //Telling what clicking each reaction does
            let paginationCheck = (emoji, user) => {
                if (user.username == embedMessage.author.username || user.username != requestMessage.author.username) return;
                    emoji = emoji._emoji.name;
                    if (emoji == '➡') { 
                        i = i != pages.length - 1 ? i + 1: i;
                        bwEmbed = makeEmbed();
                        embedMessage.edit(bwEmbed);
                    } else if (emoji == '⬅') {
                        i = i != 0 ? i - 1: i;
                        bwEmbed = makeEmbed();
                        embedMessage.edit(bwEmbed);
                    }
                }
                //Events
                pagination.on('collect', (reaction, user) => paginationCheck(reaction, user));
                pagination.on('remove', (reaction, user) => paginationCheck(reaction, user));

                pagination.on('end', () => embedMessage.edit('Session Ended'))
            }
            pagesInit(embedMessage, requestMessage);
        });    
    })   
})
