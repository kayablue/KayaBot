const { MessageCollector } = require('discord.js');
const KayaEmbed = require('../modules/kayaEmbed');
const Command = require('../modules/command');

module.exports = new Command('calc', 'Just Hypixel Level Calculator', '', 'hypixel', async (message, args) => {
    let currentLevel, goalLevel, dailyXp, xpLeft;
    let calcData = [];

    // FUNCTIONS START
    function awaitMessage() {
        let collector = new MessageCollector(message.channel, response => 
            !response.author.bot && 
            message.author.username == response.author.username &&
            typeof parseInt(response.content) == 'number',{
           max: 1, time: 30000
        })

        collector.on('collect', message => {
            calcData.push(message.content);
        })
        //I mastered promises yaay
        return new Promise((resolve, reject) => {
            collector.on("end", () => {
                resolve('yes')
            } );
        })
        
    }

    function makeEmbed(text) {
        return new KayaEmbed({
            title: text, footer: { text: '' }
        })
    }

    //This code has been copied from kayastats so the variable names are fucked up
    function calculateExp(currentLevel, goalLevel, dailyXp, xpLeft) {
        let level_exp, sum_c, sum_c_plus_1, sum_g;
        if (currentLevel != goalLevel) {
            level_exp = sum_c = 10000;
            console.log(level_exp)
            for (var i = 1; i < currentLevel; i++) {
                level_exp += 2500;
                sum_c += level_exp;
            };
            level_exp = sum_c_plus_1 = 10000;
            for (var i = 1; i <= currentLevel; i++) {
                level_exp += 2500;
                sum_c_plus_1 += level_exp;
            };
            level_exp = sum_g = 10000;
            for (var i = 1; i < goalLevel; i++) {
                level_exp += 2500;
                sum_g += level_exp;
            };
            xpNeeded = sum_g - sum_c - (sum_c_plus_1 - sum_c - xpLeft) - ((goalLevel - currentLevel - 1) * 2500);
            daysNeeded = Math.round(xpNeeded / dailyXp);
        }
        else {
            xpNeeded = 0;
            daysNeeded = 0;
        }
        
        return {
            xpNeeded: xpNeeded.toLocaleString('ru-RU'),
            daysNeeded: daysNeeded
        }
    }
    //FUNCTIONS END

    //(day 2) OWO IT WORKS
    message.channel.send(makeEmbed("Type Your Current Level"))

    await awaitMessage()
    message.channel.send(makeEmbed("Type the level you want"))    

    await awaitMessage()
    message.channel.send(makeEmbed("How many xp per day do you get?"))

    await awaitMessage()
    message.channel.send(makeEmbed("How many exp left till next level?"))

    await awaitMessage();
    
    //parseInt() so you can type 300lvl instead of 300 etc.
    currentLevel = parseInt(calcData[0]);
    goalLevel = parseInt(calcData[1]);
    dailyXp = parseInt(calcData[2]);
    xpLeft = parseInt(calcData[3]);

    let result = calculateExp(currentLevel, goalLevel, dailyXp, xpLeft)
    message.channel.send(makeEmbed(`Total xp needed to the next level: ${result.xpNeeded}
Days needed: ${result.daysNeeded}`));
    
})