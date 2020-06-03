const Command = require('../modules/command')
const { get } = require('axios')

module.exports = new Command('queue', 'displays current queue', '', 'music', async (message, args) => {
    if (message.member.voice.channel) {
        let queue =  message.client.musicQueue.queue.get(message.guild.id)
        if (queue != undefined) { 

            let counter = 0;
            let queueFormatted = await Promise.all(queue.map(async url => {
                let res = await get('http://www.youtube.com/oembed', {
                    params: {
                        url: url,
                        format: 'json'
                    }
                })
                counter++;
                console.log(res.data.title)
                console.log(counter);
                return "**" + counter + '.** ' + res.data.title + "\n"
            }));

            console.log(queueFormatted)
            message.channel.send(queueFormatted.join(''))
        } else message.channel.send('Queue is empty')
        
    } else message.reply('join voice channel, please')
    
})