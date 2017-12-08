const mongoose = require("mongoose")

const mongoURI = process.env.MONGODB_URI || "mongodb://localhost/scraper"
mongoose.Promise = global.Promise
mongoose.connect(mongoURI, {useMongoClient: true})

let Article = mongoose.model("Article", require("./article")(mongoose))
let Comment = mongoose.model("Comment", require("./comment")(mongoose))

function _getArticles(limit, offset) {
  limit = Math.max(1, Math.min(limit || 10, 50)) // should be in the range [1, 50]
  return Article.find({})
    .limit(limit + offset)
    .sort({
      dateCollected: -1,
      title: 1
    })
}

module.exports = {
  mongoose: mongoose,
  Article: Article,
  Comment: Comment,
  getArticle: function(articleId) {
    return Article.findById(articleId).populate("comments")
  },
  getArticles: function(limit, offset, withComments) {
    offset = Math.max(0, offset || 0) // should not be negative
    let query = _getArticles(limit, offset)
    withComments = withComments || false
    if (withComments) { query.populate("Comment") }

    return query.exec((err, results) => {
      return new Promise((resolve, reject) => {
        if (err != undefined) return reject(err)
        resolve(results)
      })
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
  },
  addComment: function(articleId, comment) {
    return Comment.create(comment)
      .then(dbComment => {
        return Article.findById(articleId)
          .update({$push: {comments: dbComment._id}})
      })
  },
  removeComment: function(commentId) {
    return Comment.remove({_id: commentId})
      .then(dbComment => {
        return Article.update({comments: commentId}, {$pullAll: {comments: [commentId]}})
      })
  }
}
