const Discord = require('discord.js');
const axios = require('axios');
require('dotenv').config()

module.exports = {
    name: 'guildtop',
    description: 'Get the top of the guild',
    example: "```kb guildtop RAWR```",
    execute(requestMessage, args) {
        let getMembers = (uuid) => {
            axios.get("https://api.slothpixel.me/api/guilds/" + uuid + "?populatePlayers=true")
            .then(res => {
                let sortBy = args[args.length - 1];
                let sortedMembers = res.data.members.sort((a, b) => b.profile.level - a.profile.level);
                let i, j, page, chunk = 10;
                let pages = [];
                if (sortBy == '-level') {
                    for (i=0,j=sortedMembers.length; i<j; i+=chunk) {
                        page = sortedMembers.slice(i,i+chunk).map(member => `${sortedMembers.findIndex((mem) => mem == member) + 1}. ${member.profile.username}: **${member.profile.level}**`);
                        pages.push(page);
                    }
                } else if (sortBy == '-ap') {
                    let sortedMembers = res.data.members.sort((a, b) => b.profile.achievement_points - a.profile.achievement_points);
                    for (i=0,j=sortedMembers.length; i<j; i+=chunk) {
                        page = sortedMembers.slice(i,i+chunk).map(member => `${sortedMembers.findIndex((mem) => mem == member) + 1}. ${member.profile.username}: **${member.profile.achievement_points}**`);
                        pages.push(page);
                    }
                }
                i = 0;
                function makeEmbed(sortCriteria) {
                    try {
                        return new Discord.MessageEmbed()
                        .setTitle(`${res.data.name} Top | Guild Info`)
                        .setColor("PURPLE")
                        .addField('Guild Top By ' + sortCriteria, pages[i].join("\n"))
                        .setFooter(`Made by kayablue#2395 | Page ${i + 1}/${pages.length}`)
                    } catch (error) { /* Nothing here....... */ }
                   
                }
                let levelEmbed = makeEmbed(sortBy.slice(1, sortBy.length));
                requestMessage.channel.send(levelEmbed)
                .then(embedMessage => {
                    async function pagesInit (embedMessage, requestMessage) {
                        await embedMessage.react("⏪")
                        await embedMessage.react("⬅")
                        await embedMessage.react("➡")
                        await embedMessage.react("⏩")
                        
                        let pagination = new Discord.ReactionCollector(embedMessage, (args, collection) => {
                            emoji = args._emoji.name;
                            if (emoji.search(/[➡⬅⏩⏪]/i) != -1) return true;    
                        }, {
                            time: 60000,
                            dispose: true
                        })
                        let paginationCheck = (emoji, user) => {
                            if (user.username == embedMessage.author.username || user.username != requestMessage.author.username) return;
                            emoji = emoji._emoji.name;
                            if (emoji == '➡') { 
                                i = i != pages.length - 1 ? i + 1: i;
                                levelEmbed = makeEmbed();
                                embedMessage.edit(levelEmbed);
                            } else if (emoji == '⬅') {
                                i = i != 0 ? i - 1: i;
                                levelEmbed = makeEmbed();
                                embedMessage.edit(levelEmbed);
                            } else if (emoji == "⏩") {
                                i = pages.length - 1;
                                levelEmbed = makeEmbed();
                                embedMessage.edit(levelEmbed);
                            } else if (emoji == "⏪") {
                                i = 0;
                                levelEmbed = makeEmbed();
                                embedMessage.edit(levelEmbed);
                            }
                        }
                        pagination.on('collect', (reaction, user) => paginationCheck(reaction, user));
                        pagination.on('remove', (reaction, user) => paginationCheck(reaction, user));
    
                        pagination.on('end', () => requestMessage.reply('Session Ended'))
                    }
                    pagesInit(embedMessage, requestMessage);
                });
            })
        }
        
        //Search by name
        axios.get('https://api.hypixel.net/guild', {
            params: {
                key: process.env.HYPIXEL_API_KEY,
                name: args[0]
            }
        })
        .then((response) => {
            getMembers(response.data.guild.members[0].uuid)
        })
        .catch((error) => requestMessage.channel.send("Guild not Found " + error)) 
    }
}