const Command = require('../modules/command');
const Pagination = require('../modules/pagination');
const axios = require('axios');


module.exports = new Command('bw', 'Get Player BedWars Stats', '<player>', 'hypixel', async (message, args) => {
    let res = await axios.get("https://api.slothpixel.me/api/players/" + args.join(" "))  
    let additionalData = await axios.get('https://api.hypixel.net/player', {
        params: {
            key: process.env.HYPIXEL_API_KEY,
            name: args.join(' ')
        }
    });
    additionalData = additionalData.data.player.stats.Bedwars;
    //Sloth means that it uses slothpixel API
    let slothBw = res.data.stats.BedWars;
    let slothGamemodes = [ 
        slothBw.gamemodes.solo, slothBw.gamemodes.doubles, slothBw.gamemodes['3v3v3v3'], slothBw.gamemodes['4v4v4v4'], 
        slothBw.gamemodes.rush_solo, slothBw.gamemodes.rush_doubles, slothBw.gamemodes.ultimate_solo, 
        slothBw.gamemodes.ultimate_doubles, slothBw.gamemodes.castle 
    ]
    let gamemodeNames = ['Solo', 'Doubles', '3v3v3v3', '4v4v4v4', 'Rush Solo', 'Rush Doubles', 'Ultimate Solo', 'Ultimate Doubles', 'Castle']
    let i = 0;
    let gamemodesFormated = [];
    //Making Formatted Second Page
    slothGamemodes.forEach(gamemode => {
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
                • Final Deaths: **${gamemode.final_deaths}**
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
            value: ` • Wins: **${slothBw.wins}**
                • Kills: **${slothBw.kills}**
                • Loses: **${slothBw.losses}**
                • K/D: **${slothBw.k_d}**
                • W/L: **${slothBw.w_l}**
                • Deaths: **${slothBw.deaths}**
                • Coins: **${slothBw.coins}**
                • Curent Winstreak: **${slothBw.winstreak}**
                • Final Kills: **${slothBw.final_kills}**
                • Final Deaths: **${slothBw.final_deaths}**
                • Final K/D: **${slothBw.final_k_d}**
                • Total Games Played: **${slothBw.games_played}**
                • Total Beds Broken: **${slothBw.beds_broken}**`
        }],
        [
            ...gamemodesFormated.slice(0, 5),
            {
                name: '**4v4**',
                value: ` • Wins: **${additionalData.two_four_wins_bedwars}**
                • Kills: **${additionalData.two_four_kills_bedwars}**
                • Loses: **${additionalData.two_four_losses_bedwars}**
                • K/D: **${Math.round((additionalData.two_four_kills_bedwars / additionalData.two_four_deaths_bedwars + Number.EPSILON) * 100) / 100}**
                • W/L: **${Math.round((additionalData.two_four_wins_bedwars / additionalData.two_four_losses_bedwars + Number.EPSILON) * 100) / 100}**
                • Deaths: **${additionalData.two_four_deaths_bedwars}**
                • Curent Winstreak: **${additionalData.two_four_winstreak}**
                • Final Kills: **${additionalData.two_four_final_kills_bedwars}**
                • Final Deaths: **${additionalData.two_four_final_deaths_bedwars}**
                • Games Played: **${additionalData.two_four_games_played_bedwars}**
                • Beds Broken: **${additionalData.two_four_beds_broken_bedwars}**
                `.replace(/undefined/gi, '0'),
                inline: true
            }
            
        ],
        gamemodesFormated.slice(5),
        //I gotta add 4v4 manually because Hypixel API is shit

    ];
    
    let pagination = new Pagination(message, pages, {
        author: {
            name: `${res.data.username} | BedWars Stats`,
            icon_url: 'https://visage.surgeplay.com/face/' + res.data.uuid
        }
    })
    pagination.init();
})
