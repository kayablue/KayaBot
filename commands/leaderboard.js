const Discord = require('discord.js');
const axios = require('axios');
require('dotenv').config()

module.exports = {
    name: 'guild',
    description: 'Get the info of the guild by member',
    example: "```kb guild Kawaiinex```",
    execute(message, args) {
        let getMembers = (uuid) => {
            axios.get("https://api.slothpixel.me/api/guilds/" + uuid + "?populatePlayers=true")
            .then(res => {
                
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
            getMembers(response.data.members[0].uuid)
        })
        .catch(() => message.channel.send("Guild not Found")) 
    }
}