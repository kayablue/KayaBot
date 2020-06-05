const Command = require('../modules/command')
const Pagination = require('../modules/pagination')
const { get } = require('axios')

module.exports = new Command('arena', 'Shows player\'s Arena Brawl stats', '<playername>', 'hypixel', async (message, args) => {
    let res = await get("https://api.slothpixel.me/api/players/" + args.join(" "));
    let arena = res.data.stats.Arena;
    let arenaGamemodes = arena.gamemodes;

    //Looks retarded, huh
    let generalStats = `• Wins: **${arenaGamemodes.one_v_one.wins + arenaGamemodes.two_v_two.wins + arenaGamemodes.four_v_four.wins}**
                    • Kills: **${arenaGamemodes.one_v_one.kills + arenaGamemodes.two_v_two.kills + arenaGamemodes.four_v_four.kills}**
                    • Losses: **${arenaGamemodes.one_v_one.losses + arenaGamemodes.two_v_two.losses + arenaGamemodes.four_v_four.losses}**
                    • K/D: **${((arenaGamemodes.one_v_one.kd + arenaGamemodes.two_v_two.kd + arenaGamemodes.four_v_four.kd)/3).toFixed(2)}**
                    • W/L: **${((arenaGamemodes.one_v_one.win_loss + arenaGamemodes.two_v_two.win_loss + arenaGamemodes.four_v_four.win_loss)/3).toFixed(2)}**
                    • Deaths: **${arenaGamemodes.one_v_one.deaths + arenaGamemodes.two_v_two.deaths + arenaGamemodes.four_v_four.deaths}**
                    • Coins: **${arena.coins}**
                    • Total Games Played: **${arenaGamemodes.one_v_one.games + arenaGamemodes.two_v_two.games + arenaGamemodes.four_v_four.games}**`
    
    let byModeStats = []
    let modeNames = ['1v1', '2v2', '4v4']
    let counter = 0;
    Object.values(arenaGamemodes).forEach(mode => {
        byModeStats.push({
            name: `**${modeNames[counter]}**`,
            value: `• Wins: **${mode.wins}**
            • Kills: **${mode.kills}**
            • Losses: **${mode.losses}**
            • K/D: **${mode.kd}**
            • W/L: **${mode.win_loss}**
            • Deaths: **${mode.deaths}**
            • Games Played: **${mode.games}**`,
            inline: true
        })

        counter++;
    })
    //We don't need it now
    delete(counter);

    let playerStats = {
            name: '**Skills/Other**',
            value: `• Offensive: **${arena.skills.offensive}**
            • Utility: **${arena.skills.utility}**
            • Support: **${arena.skills.support}**
            • Ultimate: **${arena.skills.ultimate}**
            • Active Rune: **${arena.active_rune}**`.replace(/_/g, ' ')
        }

    let pages = [
        { name: '**General Stats**', value: generalStats}, byModeStats, playerStats
    ]
   
    let arenaStats = new Pagination(message, pages, {
        author: {
            name: `${res.data.username} | Arena Brawl Stats`,
            icon_url: 'https://visage.surgeplay.com/face/' + res.data.uuid
        }
    })
    arenaStats.init();
})