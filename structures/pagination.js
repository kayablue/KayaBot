const KayaEmbed = require('./kayaEmbed');
const { ReactionCollector } = require('discord.js');

class Pagination {
    //The pagination thing needs 4 things: 
    constructor(message, pages, embedOptions, currentPage = 0) {
        this.message = message; //The user's message
        this.pages = pages; //Array of pages
        this.currentPage = currentPage; //The Page with what the pagination will start
        this.embedOptions = embedOptions; //Additional embed options like title, image, description etc... 
        //Don't try to overwrite fields and footer though
    }
    //Reutrns embed that has fields of the page and predefined footer 
    _makeEmbed() {
        return new KayaEmbed({
            ...this.embedOptions,
            fields: this.pages[this.currentPage],
            footer: {
                text: `Made By kayablue#2395 | Page ${this.currentPage + 1}/${this.pages.length}`
            }
        })
    }
    //The function that does the changing of the page
    _paginationCheck(emoji, user, embedMessage) {
        if (user.username == embedMessage.author.username || user.username != this.message.author.username) return;
        emoji = emoji._emoji.name;
        if (emoji == '➡️') { 
            this.currentPage = this.currentPage != this.pages.length - 1 ? this.currentPage + 1: this.currentPage;
            embedMessage.edit(this._makeEmbed());
        } else if (emoji == '⬅️') {
            this.currentPage = this.currentPage != 0 ? this.currentPage - 1: this.currentPage;
            embedMessage.edit(this._makeEmbed());
        } else if (emoji == "⏩") {
            this.currentPage = this.pages.length - 1;
            ;
            embedMessage.edit(this._makeEmbed());
        } else if (emoji == "⏪") {
            this.currentPage = 0;;
            embedMessage.edit(this._makeEmbed());
        }
    }
    //Functon that adds emojis and events 
    async _pagesInit (embedMessage) {
        //I like async (no)
        await embedMessage.react("⏪")
        await embedMessage.react("⬅️")
        await embedMessage.react("➡️")
        await embedMessage.react("⏩")
        

        //Initializing The Pagination Using ReactionCollector
        let pagination = new ReactionCollector(embedMessage, (args) => {
            let emoji = args._emoji.name;
            if (emoji.search(/[➡⬅⏩⏪]/i) != -1) return true;    
        }, {
            time: 60000,
            dispose: true
        })
        
        //Events
        pagination.on('collect', (reaction, user) => this._paginationCheck(reaction, user, embedMessage));
        pagination.on('remove', (reaction, user) => this._paginationCheck(reaction, user, embedMessage));

        pagination.on('end', () => embedMessage.edit('Session Ended'))
    }
    //Function that needs to be called after creating instance of this class
    async init() {
        //Sending Message With First (or the one optioned) Page Opened
        let embedMessage = await this.message.channel.send(this._makeEmbed());
        
        this._pagesInit(embedMessage, this.message);
    }
}
module.exports = Pagination;