const Command = require('../modules/command')

module.exports = new Command('skips', 'skips current song and plays next one in the queue', '', 'music', async (message) => {
    if (message.member.voice.channel) message.client.musicQueue.skipSong(message)
    else message.reply('please, join voice channel')
})