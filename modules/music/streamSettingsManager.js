class StreamSettingsManager {
    constructor() {
        this.volumeData = {};
    }
    getVolume(guildId) {
        console.log(this.volumeData[guildId])
        return this.volumeData[guildId] == undefined ? 0.1 : this.volumeData[guildId]
    }
    setVolume(volume, guildId) {
        this.volumeData[guildId] = volume;
    }
} 

module.exports = StreamSettingsManager;
