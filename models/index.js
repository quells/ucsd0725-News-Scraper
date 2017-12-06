const mongoose = require("mongoose")

const mongoURI = process.env.MONGODB_URI || "mongodb://localhost/scraper"
mongoose.connect(mongoURI, {useMongoClient: true})
mongoose.Promise = global.Promise

const articleSchema = require("./article")(mongoose)
const commentSchema = require("./comment")(mongoose)

module.exports = {
  mongoose: mongoose,
  Article: mongoose.model("Article", articleSchema),
  Comment: mongoose.model("Comment", commentSchema),
}
