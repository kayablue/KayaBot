const Command = require('../modules/command')

module.exports = new Command('add', 'Adds the song to queue', '<url>', 'music', async (message, args) => {
    if (message.member.voice.channel) message.client.musicQueue.addQueue(args[0], message)
    else message.reply('please, join voice channel')
})