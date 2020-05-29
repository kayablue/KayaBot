const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@kayabotdb-avo5r.gcp.mongodb.net/commands?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;

db.on('error', err => console.log(err))
db.once('open', () => console.log("Connected to DB"))