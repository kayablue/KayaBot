require('dotenv').config()

class Command {
    constructor(name, description, example, category, execute) {
        this.name = name;
        this.description = description;
        this.example = "```" + process.env.BOT_PREFIX + name + " " + example + "```";
        this.category = category;
        this.execute = execute;
    }
}

module.exports = Command;