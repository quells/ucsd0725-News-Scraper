$(document).ready(function() {
  var articlesBox = $("#articles")
  getAndRenderArticles()

  function getAndRenderArticles() {
    getArticles()
    .then(function(articles) {
      articles.forEach(function(a) {
        renderArticle(a)
      })
    })
  }

  function renderArticle(a) {
    console.log(a)
    var article = $("<article class='row'>").data("id", a._id)

    var content = $("<div class='col col-8 col-sm-9 col-md-10'>").appendTo(article)
    $("<h3>").append($("<a>").text(a.title).attr("href", a.originalURL)).appendTo(content)
    if (a.excerpt.length > 0) $("<p>").text(`${a.excerpt} - ${a.author}`).appendTo(content)

    var comments = $("<div class='col col-4 col-sm-3 col-md-2 text-right'>").appendTo(article)
    $(`<a href='#' class='btn btn-secondary commentBtn'><i class='material-icons'>comment</i> <span>${a.comments.length}</span></a>`).appendTo(comments)

    articlesBox.append(article)
  }

  function getArticles() {
    return new Promise(function(resolve, reject) {
      $.get("/api/articles")
      .done(function(response) {
        if (response.error) {
          console.log(response)
          reject(response.errorMsg)
        }
        resolve(response.articles)
      })
      .fail(function(err) {
        reject(err)
      })
    })
  }
})
