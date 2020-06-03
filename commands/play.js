const Command = require('../modules/command')

module.exports = new Command(
    'play', 
    'plays the music you request immediately replacing current playing song in queue \n If you want to add the song to queue, use `addqueue` instead',
    '<url/search query>', 'music', async (message, args) => {
    if (message.member.voice.channel) {
        try {
            //It automatically adds song to the queue and starts it
            message.client.musicQueue.start(args[0], message.member.voice.channel)
        } catch (error) { console.log(error) }
        
	} else message.reply('please, join voice channel')
})