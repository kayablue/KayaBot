const KayaEmbed = require('../structures/kayaEmbed')
const Command = require('../structures/command')
const { format } = require('date-fns');
const axios = require('axios');

module.exports = new Command('guild', 'Get the info of the guild', 'RAWR', (message, args) => {
    let getMembers = (uuid) => {
        axios.get("https://api.slothpixel.me/api/guilds/" + uuid + "?populatePlayers=true")
        .then(res => {
            //Ranks Formatting
            let ranks = res.data.ranks.sort((a, b) => b.priority - a.priority);
            let ranksSorted = ``;
            for (let i = 0; i < ranks.length; i++) {
                let tagFormatted = ranks[i].tag != null ? `[${ranks[i].tag}]` : "";
                if (!i) {
                    ranksSorted += `• ${ranks[i].name} ${tagFormatted}`
                }
                else if (i + 1 == ranks.length) {
                    ranksSorted += `
                    • ${ranks[i].name} ${tagFormatted}`
                }
                else {
                    ranksSorted += `
                    • ${ranks[i].name} ${tagFormatted}`
                }
            };

            //Calculating avg level and ap
            let avgMembersData = {
                level: 0,
                achievementPoints: 0
            };
            res.data.members.forEach(member => {
                avgMembersData.level += member.profile.level;
                avgMembersData.achievementPoints += member.profile.achievement_points;
            })
            avgMembersData.level = Math.round(avgMembersData.level / res.data.members.length);
            avgMembersData.achievementPoints = Math.round(avgMembersData.achievementPoints / res.data.members.length);

            //Weekly EXP Calculation
            let weeklyExp = Object.values(res.data.exp_history).reduce((a, b) => a + b, 0);

            res.data.members.forEach((member) => {
                member.exp_history = Object.values(member.exp_history).reduce((a, b) => a + b, 0);
            });
            let weeklyTop = res.data.members.sort((a, b) => b.exp_history - a.exp_history)[0];
            let guildMessage = new KayaEmbed({
                title: `${res.data.name} | Guild Information`,
                fields: [
                    {
                        name: "**General Info**", 
                        value: 
                        `‣ Name: **${res.data.name}**
‣ Tag: **${res.data.tag}**
‣ Level: **${res.data.level}**
‣ Avg Members Level : **${avgMembersData.level}**
⁣‣ Avg Members AP : **${avgMembersData.achievementPoints}**
‣ Members : **${res.data.members.length}/125**
‣ Created At: **${format(new Date(res.data.created), 'dd/MM/yyyy')}**
‣ Description: **${res.data.description}**
                        `
                    },
                    { name: '**Ranks**', value: ranksSorted, inline: true },
                    { 
                        name: '**Experience**', 
                        value: 
                        `• Weekly Exp: **${weeklyExp.toLocaleString('ru-RU')}** 
• Total Exp: **${res.data.exp.toLocaleString('ru-RU')}** 
• Top Player By Weekly Exp: **${weeklyTop.profile.username}** 
• Top Player's Weekly Exp: **${weeklyTop.exp_history}** 
                        `,
                        inline: true
                    }
                ],
                thumbnail: {
                    url: 'https://hypixel.net/data/guild_banners/100x200/' + res.data.id + ".png"
                }
            })

            message.channel.send(guildMessage);
        })
        .catch((error) => message.channel.send("Player or guild not found :c " + error))
    }

    if (args[args.length - 1] == '-nick') {
        getMembers(args.join(" ").replace(' -nick', ""));
    }
    else {
        args = args.join(" ");
        //Search by name
        axios.get('https://api.hypixel.net/guild', {
            params: {
                key: process.env.HYPIXEL_API_KEY,
                name: args
            }
        })
        .then((response) => {
            getMembers(response.data.guild.members[0].uuid)
        })
        .catch((error) => message.channel.send("Guild not Found: " + error)) 
    }
})