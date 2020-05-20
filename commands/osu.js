const Discord = require('discord.js');
const axios = require('axios');
require('dotenv').config();

module.exports = {
    name: 'osu',
    description: 'Shows stats of the osu! player',
    example: "```kb osu kayablue```",
    execute(message, args) {
        
        axios.get('https://osu.ppy.sh/api/get_user', {
            params: {
                k: process.env.OSU_API_KEY,
                u: args.join(" "),
                m: 0,
                type: "string"
            }
        }).then(res => {
            let user = res.data[0];
            console.log(user);
            let osuEmbed = new Discord.MessageEmbed()
                .setAuthor(`${user.username} | Player Info`, 'https://osu.ppy.sh/images/flags/'+ user.country +'.png', 'https://osu.ppy.sh/users/' + user.user_id)
                .setThumbnail(`https://a.ppy.sh/${user.user_id}`)
                .setDescription(
                    `‣ **Official Rank**: #${user.pp_rank} (#${user.pp_country_rank + " " + user.country})
                    ‣ **Performance Points**: ${user.pp_raw}pp
                    ‣ **Level**: ${Number.parseInt(user.level)} (${(Number.parseFloat(user.level) % 1 * 100).toFixed(2)}%)
                    ‣ **Overall Accuracy**: ${Number.parseFloat(user.accuracy).toFixed(2)}% 
                    ‣ **Playcount**: ${user.playcount}%
                    `
                )
                .setColor('PURPLE')
                .setFooter('Made by kayablue#2395 | osu! best gaem')

            message.channel.send(osuEmbed);
        }).catch(error => message.channel.send("Error: " + error + " a.k.a Player Not Found"));
    }
}