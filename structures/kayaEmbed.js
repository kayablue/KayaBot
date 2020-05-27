const { MessageEmbed } = require('discord.js');

class KayaEmbed extends MessageEmbed {
    constructor(options) {
        if (options != undefined) {
            options.color = options.color == undefined ? 'PURPLE' : options.color;
            options.footer = options.footer == undefined ? { text: 'Made by kayablue#2395' }: options.footer;
            super(options)
        } else {
            options = {
                color: 'PURPLE',
                footer: {
                    text: 'Made by kayablue#2395'
                }
            } 
            super(options)
        };
    }
}
module.exports = KayaEmbed;