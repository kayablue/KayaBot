const Command = require('../structures/command')
const { Types } = require('mongoose');
//Get our models
const models = require('../db/models.js')

module.exports = new Command('osuset', 
    'Set your osu! username to not to mention it everytime you white osu! related commands', 
    '<osu!nickname>',
    'osu',
    (message, args) => {
    //Database is already connected in osu-models.js
    var osuset = new models.osusetModel({
        _id: new Types.ObjectId(),
        osu_username: args.join(" ").trim(),
        discord_id: message.author.id
    })
    //Check if user already set his username
    models.osusetModel.find({discord_id: message.author.id}, (err, res) => {
        let alreadySet = res.length != 0;
        if (alreadySet) { 
            models.osusetModel.findOneAndUpdate({ discord_id: message.author.id }, { osu_username: args.join(" ").trim() }, { useFindAndModify: false }, (err, res) => {
                message.channel.send('Your osu! username is set to ' + args.join(" "))
            });
        }
        else osuset.save(err => message.channel.send('Your osu! username is set to ' + args.join(" ")))
    })
})