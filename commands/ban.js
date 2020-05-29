const Command = require('../modules/command')

module.exports = new Command(
    'ban', 
    'Bans a member if you have permission to \n <reason> and <days> are optional', 
    '<@member> <reason> <days>', 'moderation', async (message, args) => {
    //Ifs chain incoming...
    if (message.member.hasPermission('BAN_MEMBERS')) {
        const mentionedUser = message.mentions.users.first();
        //Gotta check if somebody is mentioned
        if (mentionedUser) {
            //Gotta check if the message isn't from guild
            if (!message.guild) return;
            const mentionedMember = message.guild.member(mentionedUser)
            //Now time to check if this guy is in guild
            if (mentionedMember) {
                args = args.length == 1 ? none : args;
                let days = !isNaN(args[args.length - 1]) ? args.pop() : 0;
                //And finally... Ban him
                await mentionedMember.ban({ days: 7, reason: args.slice(1).join(' ') } )
                message.channel.send(`You banned <@${mentionedMember.id}>`)

            } else message.reply('there is no user with such a name in this guild...')
        } else message.reply('so you want to ban nobody?\n...or you didn\'t mention the user') 
    } else message.reply('you don\'t have enough permissions for this')
})