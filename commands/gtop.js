const Pagination = require('../structures/pagination')
const Command = require('../structures/command')
const axios = require('axios');

module.exports = new Command('gtop', 'Get the top of the guild', '<guildname> -level/lvl/ap/exp/xp', 'hypixel', (message, args) => {
    let sortBy = args.pop().toLowerCase();
    args = args.join(" ");

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
                    pages.push({ name: 'Guild top by level', value: page });
                }
            } else if (sortBy == '-ap') {
                sortedMembers = members.sort((a, b) => b.profile.achievement_points - a.profile.achievement_points);
                for (i=0,j=sortedMembers.length; i<j; i+=chunk) {
                    page = sortedMembers.slice(i,i+chunk).map(member => `${sortedMembers.findIndex((mem) => mem == member) + 1}. ${member.profile.username}: **${member.profile.achievement_points}**`);
                    pages.push({ name: 'Guild top by AP', value: page });
                }
            } else if (sortBy == '-exp' || sortBy == '-xp') {
                members.forEach(member => {
                    member.exp = Object.values(member.exp_history).reduce((a, b) => a + b);
                })
                sortedMembers = members.sort((a, b) => b.exp - a.exp);
                for (i=0,j=sortedMembers.length; i<j; i+=chunk) {
                    page = sortedMembers.slice(i,i+chunk).map(member => `${sortedMembers.findIndex((mem) => mem == member) + 1}. ${member.profile.username}: **${member.exp.toLocaleString('ru-RU')}**`);
                    pages.push({ name: 'Guild top by GEXP', value: page });
                }
            }
            let pagination = new Pagination(message, pages, {
                title: `${res.data.name} Top | Guild Info`
            })
            pagination.init();
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
    .catch((error) => message.channel.send("Guild not Found " + error)) 
})