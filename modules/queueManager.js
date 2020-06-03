const ytdl = require('ytdl-core-discord');
const StreamSettingsManager = require('./music/streamSettingsManager')
const { EventEmitter } = require('events')


class QueueManager extends EventEmitter {
    constructor() {
        super()

        this.queue = new Map();
        this.settings = new StreamSettingsManager()
    }

    async start(songUrl, voiceChannel) {
        this.connection = await voiceChannel.join();


        this.connectionOptions =  { type: 'opus', bitrate: 192000, quality: 'highestaudio', volume: this.settings.getVolume(voiceChannel.guild.id) }
        this.dispatcher = this.connection.play(await ytdl(songUrl), this.connectionOptions);
        //Setup emitter events
        this._startLogging(this.dispatcher, voiceChannel);
        this._setupQueue(voiceChannel);
        
       
        // Sets the value depending on if the queue exists or not
        let currentQueue = this.queue.get(voiceChannel.guild.id)
        if (currentQueue == undefined) currentQueue = [ songUrl ]
        else currentQueue[0] = songUrl
        this.queue.set(voiceChannel.guild.id, currentQueue)  
    }
    //Private Methods Here
    _startLogging(dispatcher, voiceChannel) {
        dispatcher.on('start', () => {
            console.log('Playing!');
        });
        dispatcher.on('speaking', value => {
            if (!value) {
                let currentQueue = this.queue.get(voiceChannel.guild.id)
                if (currentQueue.length != 1) {
                    this.queue.set(voiceChannel.guild.id, currentQueue.slice(1))
                    this.emit('next')
                } else this.stopPlaying(voiceChannel)
            }
        })

        dispatcher.on('debug', info => console.log(info))
        dispatcher.on('error', error => console.log(error));
    }
    _setupQueue(voiceChannel) {
        this.on('next', async () => {
            let stream = await ytdl(this.queue.get(voiceChannel.guild.id)[0])
            

            this.dispatcher.play(stream, { volume: this.settings.getVolume(voiceChannel.guild.id)});
        })
    }

    //Public Methods Here
    addQueue(songUrl, message) {
        console.log(this.dispatcher.streams.broadcast)
        this.queue.set(message.guild.id, [ ...this.queue.get(message.guild.id), songUrl ])
    }
    skipSong(message) {
        let currentQueue = this.queue.get(message.guild.id)
        if (currentQueue.length != 1) {
            this.queue.set(message.guild.id, currentQueue.slice(1))
            this.emit('next')
        } else this.stopPlaying(message)
    }
    pause() {
        this.dispatcher.pause(true);
    }
    unpause() {
        this.dispatcher.resume();
    }
    stopPlaying(message) { //This can be not only message but voiceChannel too
        this.queue.delete(message.guild.id)
        this.connection.disconnect();
    }
}

module.exports = QueueManager;