const request = require("request")
const cheerio = require("cheerio")

function getHTML(url) {
  return new Promise((resolve, reject) => {
    request(url, (err, res, html) => {
      if (err != undefined) return reject(err)
      if (res.statusCode != 200) return reject(res.statusMessage)
      resolve(html)
    })
  })
}

module.exports = {
  getArsTechnicaHeadlines: function() {
    return getHTML("https://arstechnica.com")
      .then(html => {
        let $ = cheerio.load(html)
        let headlines = $("article > header")
          .map((i, el) => {
            return {
              title: $(el).find("h2").text(),
              link: $(el).find("h2").find("a").attr("href"),
              excerpt: $(el).find(".excerpt").text(),
              author: $(el).find(".byline > a > span").text()
            }
          })
          .get()
        return headlines
      })
  }
}
