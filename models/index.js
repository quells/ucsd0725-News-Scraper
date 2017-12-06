const mongoose = require("mongoose")

const mongoURI = process.env.MONGODB_URI || "mongodb://localhost/scraper"
mongoose.Promise = global.Promise
mongoose.connect(mongoURI, {useMongoClient: true})

const articleSchema = require("./article")(mongoose)
const commentSchema = require("./comment")(mongoose)

module.exports = {
  mongoose: mongoose,
  Article: mongoose.model("Article", articleSchema),
  Comment: mongoose.model("Comment", commentSchema),
}
