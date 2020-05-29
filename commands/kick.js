const Command = require('../modules/command')

module.exports = new Command('kick', 'Kicks the member from guild', '@<username> <reason>', 'moderation', async (message, args) => {
    //Ifs chain incoming...
    if (message.member.hasPermission('KICK_MEMBERS')) {
        const mentionedUser = message.mentions.users.first();
        //Gotta check if somebody is mentioned
        if (mentionedUser) {
            //Gotta check if the message isn't from guild
            if (!message.guild) return;
            const mentionedMember = message.guild.member(mentionedUser)
            //Now time to check if this guy is in guild
            if (mentionedMember) {
                //And finally... Kick him
                await mentionedMember.kick(args.slice(1).join(' '))
                message.channel.send(`You kicked <@${mentionedMember.id}>`)

            } else message.reply('there is no user with such a name in this guild...')
        } else message.reply('so you want to kick nobody?\n...or you didn\'t mention the user') 
    } else message.reply('you don\'t have enough permissions for this')
})