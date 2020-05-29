const { Schema, model, Types } = require('mongoose');

let models = {};

const osusetSchema = new Schema({
    _id: Types.ObjectId,
    osu_username: String, discord_id: Number 
}, { _id: false, autoIndex: false });
models.osusetModel = model('osuset', osusetSchema, 'osuset');

const welcomeSchema = new Schema({
    _id: String,
    message: String, 
    channel: String
})
models.welcomeModel = model('welcome', welcomeSchema, 'welcome')

module.exports = models;