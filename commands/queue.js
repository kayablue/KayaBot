const Command = require('../modules/command')
const KayaEmbed = require('../modules/kayaEmbed')

module.exports = new Command('queue', 'Displays current queue', '', 'music', async (message, args) => {
    const serverQueue = message.client.queue.get(message.guild.id);

    if (!serverQueue) return message.reply("There is nothing playing.").catch(console.error);

    let queueEmbed = new KayaEmbed()
      .setTitle("EvoBot Music Queue")
      .setDescription(serverQueue.songs.map((song, index) => `${index + 1}. ${song.title}`))

    queueEmbed.setTimestamp();
    if (queueEmbed.description.length >= 2048)
        queueEmbed.description =
          queueEmbed.description.substr(0, 2007) + "\nQueue is larger than character limit...";
    return message.channel.send(queueEmbed);
})