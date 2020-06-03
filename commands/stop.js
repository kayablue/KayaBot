const Command = require('../modules/command')

module.exports = new Command('stop', 'stops the music and wipes out the queue', '', 'music', (message) => {
    if (message.member.voice.channel) {
        message.client.musicQueue.stopPlaying(message)
    } else message.channel.send('You\'re not even in voice channel to stop playing')
})