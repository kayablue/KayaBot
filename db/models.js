const { Schema, model, Types } = require('mongoose');

let models = {};

const osusetSchema = new Schema({
    _id: Types.ObjectId,
    osu_username: String, discord_id: Number 
}, { _id: false, autoIndex: false });
models.osusetModel = model('osuset', osusetSchema, 'osuset');

module.exports = models;