const Command = require('../modules/command')

module.exports = new Command('unban', 'Unbans the banned user (you can use id or mention)', '<@user>/<userid>', 'moderation', async (message, args) => {
    if (!message.guild) return;
    
    if (message.member.hasPermission('BAN_MEMBERS')) {
        try {
            let unbannedUser = await message.guild.members.unban(args[0].replace(/[^0-9]/g, ''))
            let unbannedInvite = await message.channel.createInvite({
                reason: "User Unbanned", 
                maxUses: 1 
            })
            unbannedUser.send(`You were unbanned from ${message.guild.name}!\n Come and join: ${unbannedInvite.url}`)
            message.reply(`You succsessfully unbanned ${unbannedUser.username}#${unbannedUser.discriminator}`)
        } catch(error) {
            message.channel.send('An error occured: ' + error.message)
        }
        

    } else message.reply('you don\'t have enough permissions for that')
    
})