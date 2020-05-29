const Command = require('../modules/command')

module.exports = new Command('eval', 'Evaluates the code', 'parseInt("2")', 'private', (message, args) => {
    //This command is only available for me and for me
    if (message.author.id == '377866259867631616' || message.author.id == '564400908272926721' ) eval(args.join(' '))
})