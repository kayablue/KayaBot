const Command = require('../modules/command');
const { welcomeModel } = require('../db/models');

module.exports = new Command(
    'joinrole', 
    'Set role that automatically adds when the member joins \nRequirements: admin permissions and predefined role',
    '<@role>', 'moderation', async (message, args) => {
        if (!message.guild) return;

        if (message.member.hasPermission('ADMINISTRATOR')) {
            args[0] = args[0].replace(/[^0-9]/g, '')

            var defaultRole = new welcomeModel({
                _id: message.guild.id,
                message: null,
                channel: null,
                default_role: args[0]
            })
    
            welcomeModel.find({_id: message.guild.id}, (err, res) => {
                if (res.length == 0) { 
                    message.reply(`Successfully set join role to <@&${args[0]}>`)
                    return defaultRole.save() 
                }
                welcomeModel.findOneAndUpdate({_id: message.guild.id}, {message: res[0].message, default_role: args[0]}, {useFindAndModify: false, new: true}, (err, res) => {
                    message.reply(`Successfully set join role to <@&${res.default_role}>`)
                })
            })

        } else message.reply('seems like you have not enough permissions for that')
    })
