const mongoose = require("mongoose")

const mongoURI = process.env.MONGODB_URI || "mongodb://localhost/scraper"
mongoose.Promise = global.Promise
mongoose.connect(mongoURI, {useMongoClient: true})

let Article = mongoose.model("Article", require("./article")(mongoose))
let Comment = mongoose.model("Comment", require("./comment")(mongoose))

module.exports = {
  mongoose: mongoose,
  Article: Article,
  Comment: Comment,
  getArticles: function(limit, offset) {
    limit = Math.max(1, Math.min(limit || 10, 50))
    offset = Math.max(0, offset || 0)
    return Article.find({})
      .populate("Comment")
      .limit(limit + offset)
      .sort({
        dateCollected: -1,
        title: 1
      })
      .exec((err, results) => {
        if (err != undefined) throw err
        return results
      })
  },
  addArticle: function(articleData) {
    let article = new Article(articleData)
    return Article.findOne({originalURL: articleData.originalURL})
      .then((err, found) => {
        if (found == undefined) {
          // Only save new articles
          console.log(`Saving new article at ${article.originalURL}`)
          return article.save()
        }
        return Promise.resolve()
      })
      .catch(err => {
        if (err.code === 11000) {
          // Ignore non-unique key error
          // - that's the point of searching for the URL
          return Promise.resolve()
        }
        throw err
      })
  }
}
