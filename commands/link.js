const Command = require('../modules/command')

module.exports = new Command('link', 'Link to add the bot to your server', '', 'bot', (message) => {
    message.channel.send('Here you go: https://discord.com/api/oauth2/authorize?client_id=709786488480727122&permissions=8&scope=bot')
})
