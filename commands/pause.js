const Command = require('../modules/command')

module.exports = new Command('pause', 'pauses the music', '', 'music', (message) => { 
    if (message.member.voice.channel) {
        message.client.musicQueue.pause()
    } else message.channel.send('You\'re not even in voice channel to pause')
})