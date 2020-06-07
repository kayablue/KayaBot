const Command = require('../modules/command')
const KayaEmbed = require('../modules/kayaEmbed')
const { upperCaseFirst } = require('upper-case-first')
const { format, formatDistance } = require('date-fns')

module.exports = new Command(
    'user', 
    'Get the information about user by id or mentioning him\n Also you can mention/type id\'s of multiple users', 
    '<id/@mention>', 'misc', (message, args) => {
    if (args.length == 0)
        message.channel.send('Please mention user or insert his id')
    else {
        args = args.map(id => id.replace(/[^0-9]/g, '')) //We extract id's if there are mentions

        let presenceEmojis = {
            online: '\:green_circle:',
            offline: '\:black_circle:',
            idle: '\:yellow_circle:',
            dnd: '\:red_circle:'
        }


        let getRoles = (member) => { 
            let rolesArray = member.roles.cache.array()
            if (rolesArray.length != 1) {
                let formattedRoles = rolesArray
                    .filter(role => role.name != '@everyone')
                    .sort((a, b) => b.comparePositionTo(a))
                    .join(', ')
                return 'Roles: ' + formattedRoles;
            } else return 'Roles: None'
            
        }
        let getColor = (member) => {
            let rolesArray = member.roles.cache.array()
            if (rolesArray.length != 1) {
                let hexColor = member.roles.color.color.toString(16); //And convert to HEX, of course
                return `#${hexColor}`
            } else return '**None**'
            
        }
        let getOwnerMessage = (member) => {
            if (member.id == message.guild.ownerID) {
                return '***This is the owner of this server***'
            } else return ''
        }

        //Now go through every element and get the data about each user
        args.forEach(async id => {
            let user;
            try {
                user = await message.client.users.fetch(id);
            } catch (error) { return message.channel.send('User not found :c')}
            
            let userStatusEmoji = presenceEmojis[user.presence.status]
            //Formatting Client Status (Web/Mobile/Desktop)
            let clientStatus = upperCaseFirst(user.presence.status);
            if (clientStatus != 'Offline' && !user.bot) {
                clientStatus = Object.keys(user.presence.clientStatus).map(key => upperCaseFirst(key)).join("/")
            } else if (user.bot) { clientStatus = 'Online (Bot)' }
            //Getting Custom Status
            let activity = user.presence.activities[0]
            let customStatus = activity != undefined && activity.type == 'CUSTOM_STATUS' ? `**${user.presence.activities[0].state}**` : '';
            
            //Now we'll get member stats
            let rolesInfo, memberColor, memberOwnerMessage, memberColorMessage;
            let embedColor = 'PURPLE';
            try { 
                let member = await message.guild.members.fetch(id) 
                rolesInfo = getRoles(member)
                memberColor = getColor(member)
                embedColor = memberColor == 'None' ? embedColor : memberColor; 

                memberOwnerMessage = getOwnerMessage(member)
                memberColorMessage = `Member Color: **${memberColor}**`;
            }
            catch (error) { 
                //Well it's not an error the member is just not in guild

                rolesInfo = 'User isn\'t a member of this server';
                memberColor = memberOwnerMessage = memberColorMessage = '';
            }

            let userEmbed = {
                title: user.tag,
                description: `${userStatusEmoji} — **${clientStatus}**\n${customStatus}`,
                fields: [
                    {
                        name: '**Account Info**',
                        value: `Created At: **${format(user.createdAt, 'do MMM y')}** (${formatDistance(user.createdAt, new Date())} ago)` 
                    },
                    {
                        name: '**Member Info**',
                        value: `${rolesInfo}\n${memberColorMessage}\n${memberOwnerMessage}`
                    }
                ],
                image: {
                    url: user.avatarURL({dynamic: true, size: 1024})
                },
                footer: {
                    text: 'Made by kayablue#2395 | ID: ' + user.id 
                }
            }
            await message.channel.send(new KayaEmbed({...userEmbed}).setColor(embedColor))
        })
    }
})