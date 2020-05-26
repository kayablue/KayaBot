const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const osusetModel = require('./additional/osu-models.js')
require('dotenv').config();

module.exports = {
    name: 'osu',
    description: 'Shows stats of the osu! player',
    example: "```k!osu <nickname>```",
    async execute(message, args) {
        async function checkDB(discordId) {
            if (args.length == 0) {
                return new Promise((resolve, reject) => {
                    osusetModel.find({discord_id: discordId}, (err, res) => {
                       args = res.length != 0 ? [ res[0].osu_username ] : args;
                       resolve(args);
                    })
                })
            }
        }
        
        await checkDB(message.author.id)
        axios.get('https://osu.ppy.sh/api/get_user', {
            params: {
                k: process.env.OSU_API_KEY,
                u: args.join(" "),
                m: 0,
                type: "string"
            }
        }).then(res => {
            let user = res.data[0];
            let osuEmbed = new MessageEmbed()
                .setAuthor(`${user.username} | Player Info`, 'https://osu.ppy.sh/images/flags/'+ user.country +'.png', 'https://osu.ppy.sh/users/' + user.user_id)
                .setThumbnail(`https://a.ppy.sh/${user.user_id}`)
                .setDescription(
                    `‣ **Official Rank**: #${user.pp_rank} (#${user.pp_country_rank + " " + user.country})
‣ **Performance Points**: ${user.pp_raw}pp
‣ **Level**: ${Number.parseInt(user.level)} (${(Number.parseFloat(user.level) % 1 * 100).toFixed(2)}%)
‣ **Overall Accuracy**: ${Number.parseFloat(user.accuracy).toFixed(2)}% 
‣ **Playcount**: ${user.playcount}
                    `
                )
                .setColor('PURPLE')
                .setFooter('Made by kayablue#2395 | osu! best gaem')

            message.channel.send(osuEmbed);
        }).catch(error => message.channel.send("Error: " + error + " a.k.a Player Not Found"));
    }
}