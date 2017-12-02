const mongoose = require("mongoose")

const mongoURI = process.env.MONGODB_URI || "mongodb://localhost/scraper"
mongoose.connect(mongoURI, {useMongoClient: true})
mongoose.promise = global.Promise

module.exports = {
  mongoose: mongoose,
  article: require("./article")(mongoose),
  comment: require("./comment")(mongoose),
}
