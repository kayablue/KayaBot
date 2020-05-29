const { welcomeModel } = require('../db/models');

class WelcomeListener {
    listen(member) {
        welcomeModel.find({_id: member.guild.id}, (err, res) => {
            if (res.length == 0) return;
            let welcomeChannel = member.guild.channels.cache.find(value => value == res[0].channel.replace(/[^0-9]/g, ''))
        
            welcomeChannel.send(res[0].message.replace('{member}', `<@${member.id}>`))
        })
    }
}
module.exports = WelcomeListener;