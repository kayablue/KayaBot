const Command = require('../modules/command')

module.exports = new Command('unpause', 'unpauses the music', '', 'music', (message) => {
    if (message.member.voice.channel) {
        message.client.musicQueue.unpause()
    } else message.channel.send('You\'re not even in voice channel to unpause')
})