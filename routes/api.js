const express = require("express")
const scraper = require("../scraper")
const models = require("../models")
const Article = models.Article

const router = express.Router()

router.get("/articles", (req, res) => {
  // Can limit number of returned articles, defaulting to 10 if no value provided
  // eg /api/articles?limit=5 returns only the 5 most recent articles
  let limit = 10
  if (req.query.limit != undefined) {
    limit = Math.max(1, Math.min(parseInt(req.query.limit), 50))
  }

  // Can offset number of returned articles, defaulting to 0 if no value provided
  // eg /api/articles?limit=5&offset=5 returns articles 6-10
  let offset = 0
  if (req.query.limit != undefined) {
    offset = Math.max(0, parseInt(req.query.offset))
  }


  // Return N articles sorted newest-first in alphabetical order
  Article.find({})
    .limit(limit + offset)
    .sort({
      dateCollected: -1,
      title: 1
    })
    .exec((err, results) => {
      if (err != undefined) {
        return res.json({
          error: true,
          errorMsg: err.message
        })
      }
      results = results.slice(offset)
      res.json({error: false, results: results})
    })
})

router.get("/articles/new", (req, res) => {
  scraper.getArsTechnicaHeadlines()
    .then(headlines => {
      let saveArticles = []
      headlines.forEach((h) => {
        let a = new Article({
          title: h.title,
          excerpt: h.excerpt || "",
          author: h.author || "",
          originalURL: h.link,
          comments: []
        })
        // Check if article has already been scraped
        Article.findOne({originalURL: h.link}, function(err, found) {
          if (found == undefined) {
            console.log(`Saving new article at ${h.link}`)
            saveArticles.push(a.save())
          }
          // Skip if already scraped
        })
      })
      // Wait for all articles to be saved before responding
      return Promise.all(saveArticles)
        .then(() => {
          res.json({
            error: false
          })
        })
    })
    .catch(err => {
      console.log(err)
      res.json({
        error: true,
        errorMsg: err
      })
    })
})

module.exports = router
