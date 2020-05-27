const KayaEmbed = require('../structures/kayaEmbed')
const Command = require('../structures/command')
const axios = require('axios');
const models = require('../db/models.js')

module.exports = new Command('osu', 'Shows stats of the osu! player', '<nickname>', async (message, args) => {
    async function checkDB(discordId) {
        if (args.length == 0) {
            return new Promise((resolve, reject) => {
                models.osusetModel.find({discord_id: discordId}, (err, res) => {
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
        let osuEmbed = new KayaEmbed({
            author: {
                name: `${user.username} | Player Info`,
                icon_url: 'https://osu.ppy.sh/images/flags/'+ user.country +'.png',
                url:  'https://osu.ppy.sh/users/' + user.user_id
            },
            thumbnail: {
                url: `https://a.ppy.sh/${user.user_id}`
            },
            description: `‣ **Official Rank**: #${user.pp_rank} (#${user.pp_country_rank + " " + user.country})
‣ **Performance Points**: ${user.pp_raw}pp
‣ **Level**: ${Number.parseInt(user.level)} (${(Number.parseFloat(user.level) % 1 * 100).toFixed(2)}%)
‣ **Overall Accuracy**: ${Number.parseFloat(user.accuracy).toFixed(2)}% 
‣ **Playcount**: ${user.playcount}`
        })
        
        message.channel.send(osuEmbed);
    }).catch(error => message.channel.send("Error: " + error + " a.k.a Player Not Found"));
})