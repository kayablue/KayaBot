const { ReactionCollector } = require('discord.js');
const KayaEmbed = require('../structures/kayaEmbed');
const Command = require('../structures/command')
const axios = require('axios');

module.exports = new Command('gtop', 'Get the top of the guild', '<guildname> -level/lvl/ap/exp', (requestMessage, args) => {
    let sortBy = args.pop().toLowerCase();

    args = args.join(" ");
    console.log(args);
    let getMembers = (uuid) => {
        axios.get("https://api.slothpixel.me/api/guilds/" + uuid + "?populatePlayers=true")
        .then(res => {
            //Variables
            let members = res.data.members;
            let sortedMembers = members.sort((a, b) => b.profile.level - a.profile.level);
            let i, j, page, chunk = 10;
            let pages = [];
            //Option check
            if (sortBy == '-level' || sortBy == '-lvl') {
                for (i=0,j=sortedMembers.length; i<j; i+=chunk) {
                    page = sortedMembers.slice(i,i+chunk).map(member => `${sortedMembers.findIndex((mem) => mem == member) + 1}. ${member.profile.username}: **${member.profile.level}**`);
                    pages.push(page);
                }
            } else if (sortBy == '-ap') {
                sortedMembers = members.sort((a, b) => b.profile.achievement_points - a.profile.achievement_points);
                for (i=0,j=sortedMembers.length; i<j; i+=chunk) {
                    page = sortedMembers.slice(i,i+chunk).map(member => `${sortedMembers.findIndex((mem) => mem == member) + 1}. ${member.profile.username}: **${member.profile.achievement_points}**`);
                    pages.push(page);
                }
            } else if (sortBy == '-exp') {
                members.forEach(member => {
                    member.exp = Object.values(member.exp_history).reduce((a, b) => a + b);
                })
                sortedMembers = members.sort((a, b) => b.exp - a.exp);
                for (i=0,j=sortedMembers.length; i<j; i+=chunk) {
                    page = sortedMembers.slice(i,i+chunk).map(member => `${sortedMembers.findIndex((mem) => mem == member) + 1}. ${member.profile.username}: **${member.exp}**`);
                    pages.push(page);
                }
            }
            //Gotta set this to zero so the first page will be open
            i = 0;

            //Making Embed
            function makeEmbed(sortCriteria) {
                try {
                    return new KayaEmbed({
                        title: `${res.data.name} Top | Guild Info`,
                        fields: [{
                            name: 'Guild Top By ' + sortCriteria,
                            value: pages[i].join("\n")
                        }],
                        footer: {
                            text: `Made by kayablue#2395 | Page ${i + 1}/${pages.length}`
                        }
                    })
                } catch (error) { /* Nothing here....... */ }
               
            }
            let levelEmbed = makeEmbed(sortBy.slice(1, sortBy.length));

            //That Pagination Thing
            requestMessage.channel.send(levelEmbed)
            .then(embedMessage => {
                async function pagesInit (embedMessage, requestMessage) {
                //I like async (no)
                await embedMessage.react("⏪")
                await embedMessage.react("⬅")
                await embedMessage.react("➡")
                await embedMessage.react("⏩")


                //Initializing The Pagination Using ReactionCollector
                let pagination = new ReactionCollector(embedMessage, (args) => {
                    emoji = args._emoji.name;
                    if (emoji.search(/[➡⬅⏩⏪]/i) != -1) return true;    
                    }, {
                        time: 60000,
                        dispose: true
                    })
                //Telling what clicking each reaction does
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
                    //Events
                    pagination.on('collect', (reaction, user) => paginationCheck(reaction, user));
                    pagination.on('remove', (reaction, user) => paginationCheck(reaction, user));

                    pagination.on('end', () => embedMessage.edit('Session Ended'))
                }
                pagesInit(embedMessage, requestMessage);
            });
        })
    }
    
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
    .catch((error) => requestMessage.channel.send("Guild not Found " + error)) 
})