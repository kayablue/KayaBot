const Command = require('../modules/command')

module.exports = new Command('unpause', 'Unpauses current playing track\nIs an alias for resume', '', 'music', (message) => { 
    message.client.commands.get('resume').execute(message)
})