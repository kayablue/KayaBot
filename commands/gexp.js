const Discord = require('discord.js');
const { format } = require('date-fns');
const axios = require('axios');
require('dotenv').config()

module.exports = {
    name: 'gexp',
    description: 'Gets gexp stats of player',
    example: "```k!gexp Kawaiinex```",
    execute(message, args) {
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
            let gexpMessage = new Discord.MessageEmbed()
            .setTitle(`${requestedUser.profile.username} | Member Information`)
            .setColor("PURPLE")
            .addFields(
                { name: `**Gexp Stats By Day**`, value: expByDay },
                { name: "\u2800", value: `\u2b50 Total Weekly XP: **${requestedUser.totalExp.toLocaleString('ru-RU')}**` }
            )
            .setFooter(`Made by kayablue#2395`)

            message.channel.send(gexpMessage);
        })
        .catch(error => message.channel.send("Player or guild not found :c" + error))        
    }
}