const Command = require('../modules/command')

module.exports = new Command('volume', 'sets the volume', '0.25', 'music', (message, args) => {
    if (message.member.voice.channel) {
        let queue =  message.client.musicQueue.queue.get(message.guild.id)
        if (queue != undefined) { 

            let volume = parseFloat(args[0])
            if (volume < 3) {
                //Setting to settings (lol) and to the current dispatcher
                message.client.musicQueue.settings.setVolume(volume, message.guild.id)
                message.client.musicQueue.dispatcher.setVolume(volume)
            } else message.reply('TOO LOUD')
            
        } else message.reply('Start a song first')
    } else message.reply('you\'re not even in voice channel')
})