const { MessageEmbed } = require('discord.js');
const axios = require('axios');
require('dotenv').config()

module.exports = {
    name: 'walls',
    description: 'Get player The Walls stats ',
    example: "```k!walls <player>```",
    execute(message, args) {
        axios.get("https://api.slothpixel.me/api/players/" + args.join(" ")).then(res => {
            let walls = res.data.stats.Walls;

            message.channel.send(new MessageEmbed({
                author: {
                    name: `${res.data.username}  |  The Walls Stats`,
		            icon_url: 'https://visage.surgeplay.com/face/' + res.data.uuid
                },
                color: "PURPLE",
                fields: [
                    {
                        name: '**General Info**',
                        value: ` • Wins: **${walls.wins}**
                         • Kills: **${walls.kills}**
                         • Loses: **${walls.losses}**
                         • K/D: **${walls.kd}**
                         • W/L: **${Math.round((walls.wins / walls.losses + Number.EPSILON) * 100) / 100}**
                         • Coins: **${walls.coins}**
                         • Deaths: **${walls.deaths}**
                        `
                    },
                    {
                        name: '**Monthly/Weekly Info**',
                        value: ` • Monthly Wins: **${walls.monthly_wins}**
                         • Monthly Kills: **${walls.monthly_kills}**
                         • Weekly Wins: **${walls.weekly_wins}**
                         • Weekly Kills: **${walls.weekly_kills}**
                        `
                    }
                ]
            }))
        }).catch(err => message.channel.send("Player Not Found :c"));
            
    }
}