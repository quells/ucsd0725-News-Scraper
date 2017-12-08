const express = require("express")
const db = require("../models")

const router = express.Router()

router.get("/", (req, res) => {
  res.render("index")
})

router.get("/:articleId", (req, res) => {
  db.getArticle(req.params.articleId)
    .then(article => {
      article.comments.reverse()
      res.render("article", article)
    })
    .catch(err => {
      console.trace(err)
      res.sendStatus(500)
    })
})

module.exports = router
