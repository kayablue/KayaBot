const Command = require('../modules/command')
const { welcomeModel } = require('../db/models')

module.exports = new Command(
    'welcome', 
    "Set welcome message for your server \nUse '{member}' when specifying your message to refer to a new member", 
    '<channel> <message>', 'bot', (message, args) => {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            let welcomeChannel = args.shift()
            var welcome = new welcomeModel({
                _id: message.guild.id,
                channel: welcomeChannel,
                message: args.join(" "),
                default_role: null
            })

            welcomeModel.find({_id: message.guild.id}, (err, res) => {
                if (res.length == 0) { 
                    message.channel.send(`Now your welcome channel is ${welcomeChannel}`)
                    return welcome.save() 
                }
                replaceMessage = args.length == 0 ? res[0].message : args.join(' ') 
                welcomeModel.findOneAndUpdate({_id: message.guild.id}, {message: replaceMessage, channel: welcomeChannel}, {useFindAndModify: false, new: true}, (err, res) => {
                    console.log(res);
                    message.channel.send(`Now your welcome channel is ${res.channel}`)
                });
            })

        } else message.channel.send("You don't have enough permissions for this")

    })