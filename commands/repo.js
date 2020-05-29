const Command = require('../modules/command');

module.exports = new Command('repo', 'Link to the github repo', '', 'bot', message => message.channel.send('Here you go: https://github.com/kayablue/KayaBot'))