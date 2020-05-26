const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
require('dotenv').config()
//Get our models
const osusetModel = require('./additional/osu-models.js')

module.exports = {
    name: 'osuset',
    description: 'Set your osu! username to not to mention it everytime you white osu! related commands',
    example: "```k!osuset kayablue```",
    execute(message, args) {
        //Database is already connected in osu-models.js
        var db = mongoose.connection;
        console.log(mongoose.connection)
        db.on('error', err => message.channel.send('Failed to connect to the database: ' + err));
        db.once('open', function() {
            console.log('Connected to db')
            var osuset = new osusetModel({
                _id: new mongoose.Types.ObjectId(),
                osu_username: args.join(" ").trim(),
                discord_id: message.author.id
            })
            //Check if user already set his username
            osusetModel.find({discord_id: message.author.id}, (err, res) => {
                
                let alreadySet = res.length != 0;
                if (alreadySet) { 
                    osusetModel.findOneAndUpdate({ discord_id: message.author.id }, { osu_username: args.join(" ").trim() }, { useFindAndModify: false }, (err, res) => {
                        message.channel.send('Your osu! username is set to ' + res[0].osu_username)
                    });
                }
                else osuset.save(err => message.channel.send('Your osu! username is set to ' + res[0].osu_username))
            })
        });
    }
}