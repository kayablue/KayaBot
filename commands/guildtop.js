const Discord = require('discord.js');
const axios = require('axios');
require('dotenv').config()

module.exports = {
    name: 'guildtop',
    description: 'Get the top of the guild',
    example: "```kb guildtop RAWR```",
    execute(message, args) {
        let getMembers = (uuid) => {
            axios.get("https://api.slothpixel.me/api/guilds/" + uuid + "?populatePlayers=true")
            .then(res => {
                let sortedMembers = res.data.members.sort((a, b) => b.profile.level - a.profile.level);
                let i, j, page, chunk = 10;
                let pages = [];
                for (i=0,j=sortedMembers.length; i<j; i+=chunk) {
                    page = sortedMembers.slice(i,i+chunk).map(member => `${sortedMembers.findIndex((mem) => mem == member) + 1}. ${member.profile.username}: **${member.profile.level}**`);
                    pages.push(page);
                }
                i = 0;
                function makeEmbed() {
                    return new Discord.MessageEmbed()
                    .setTitle(`${res.data.name} Top | Guild Info`)
                    .setColor("PURPLE")
                    .addField('Guild Top By Level', pages[i].join("\n"))
                    .setFooter(`Made by kayablue#2395 | Page ${i + 1}/${pages.length}`)
                   
                }
                let levelEmbed = makeEmbed();
                message.channel.send(levelEmbed)
                .then(embedMessage => {
                    embedMessage.react("⏪")
                    embedMessage.react("⬅")
                    embedMessage.react("➡")
                    embedMessage.react("⏩")
                    .then(() => {
                        let pagination = new Discord.ReactionCollector(embedMessage, (args, collection) => {
                            emoji = args._emoji.name;
                            if (emoji.search(/[➡⬅⏩⏪]/i) != -1) {
                                return true;
                            }
                            
                        }, {
                            time: 30000,
                            dispose: true
                        })
                        let paginationCheck = (emoji) => {
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
                        pagination.on('collect', reaction => paginationCheck(reaction));
                        pagination.on('remove', reaction => paginationCheck(reaction));

                        pagination.on('end', () => message.reply('Session Ended'))
                    }) 
                });
            })
        }
        
        //Search by name
        axios.get('https://api.hypixel.net/guild', {
            params: {
                key: process.env.HYPIXEL_API_KEY,
                name: args.join(" ")
            }
        })
        .then((response) => {
            getMembers(response.data.guild.members[0].uuid)
        })
        .catch((error) => message.channel.send("Guild not Found " + error)) 
    }
}