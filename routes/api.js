const express = require("express")
const scraper = require("../scraper")
const db = require("../models")

const router = express.Router()

router.get("/articles", (req, res) => {
  // Can limit number of returned articles, defaulting to 10 if no value provided
  // eg /api/articles?limit=5 returns only the 5 most recent articles

  // Can offset number of returned articles, defaulting to 0 if no value provided
  // eg /api/articles?limit=5&offset=5 returns articles 6-10
  let offset = 0
  if (req.query.offset != undefined) {
    offset = Math.max(0, parseInt(req.query.offset))
  }

  // Return N articles sorted newest-first in alphabetical order
  db.getArticles(req.query.limit, req.query.offset)
    .then(articles => {
      articles = articles.slice(offset)
      res.json({
        error: false,
        articles: articles
      })
    })
    .catch(err => {
      console.trace(err)
      res.json({
        error: true,
        errorMsg: err.message
      })
    })
})

router.get("/articles/new", (req, res) => {
  scraper.getArsTechnicaHeadlines()
    .then(headlines => {
      let saveArticles = headlines.map(h => {
        return {
          title: h.title,
          excerpt: h.excerpt || "",
          author: h.author || "",
          originalURL: h.link,
          comments: []
        }
      }).map(db.addArticle)

      // Wait for all articles to be saved before responding
      return Promise.all(saveArticles)
        .then(() => {
          res.json({
            error: false
          })
        })
    })
    .catch(err => {
      console.trace(err)
      res.json({
        error: true,
        errorMsg: err
      })
    })
})

router.post("/comment/:articleId", (req, res) => {
  let comment = req.body
  db.addComment(req.params.articleId, comment)
    .then(response => {
      res.sendStatus(200)
    })
    .catch(err => {
      console.trace(err)
      res.sendStatus(500)
    })
})

router.delete("/comment/:commentId", (req, res) => {
  db.removeComment(req.params.commentId)
    .then(response => {
      res.sendStatus(200)
    })
    .catch(err => {
      console.trace(err)
      res.sendStatus(500)
    })
})

module.exports = router
