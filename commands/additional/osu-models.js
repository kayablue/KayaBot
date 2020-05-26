const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@kayabotdb-avo5r.gcp.mongodb.net/osuset?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});

const osusetSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    osu_username: String, discord_id: Number 
}, { _id: false, autoIndex: false });
const osusetModel = mongoose.model('osuset', osusetSchema, 'osuset');

module.exports = osusetModel