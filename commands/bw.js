const Command = require('../structures/command');
const Pagination = require('../structures/pagination');
const axios = require('axios');


module.exports = new Command('bw', 'Get Player BedWars Stats', '<player>', 'hypixel', async (message, args) => {
    let res = await axios.get("https://api.slothpixel.me/api/players/" + args.join(" "))  
    
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
                • Total Beds Broken: **${bw.beds_broken}**`
        }],
        gamemodesFormated
    ];
    
    let pagination = new Pagination(message, pages, {
        author: {
            name: `${res.data.username} | BedWars Stats`,
            icon_url: 'https://visage.surgeplay.com/face/' + res.data.uuid
        }
    })
    pagination.init();
})
