$(document).ready(function() {
  switch (page) {
    case "index":
      var articlesBox = $("#articles")
      getAndRenderArticles()
      handleScrapeMore()
      break
    case "article":
      handleNewCommentForm()
      handleDeleteButtons()
      break
    default:
      console.log("global variable `page` not defined")
  }

  function handleDeleteButtons() {
    $(".comment > div > a").click(function() {
      var commentId = $(this).data("id")
      $.ajax({
        method: "DELETE",
        url: "/api/comment/" + commentId
      })
      .done(function() {
        window.location = "/" + _articleId
      })
      .fail(function(err) {
        console.log(err)
      })
    })
  }

  function handleNewCommentForm() {
    $("form > div > button[type=submit]").click(function(e) {
      e.preventDefault()
      $("#commentBody").removeClass("is-invalid")
      var username = $("#username").val().trim() || "Anonymous"
      var comment = $("#commentBody").val().trim()
      if (comment.length < 1) return $("#commentBody").addClass("is-invalid")
      $.ajax({
        method: "POST",
        url: "/api/comment/" + _articleId,
        data: {
          user: username,
          body: comment
        }
      })
      .done(function() {
        window.location = "/" + _articleId
      })
      .fail(function(err) {
        console.log(err)
      })
    })
  }

  function handleScrapeMore() {
    $("#scrapeMore").click(function() {
      $.get("/api/articles/new")
      .done(function(response) {
        if (response.error) {
          console.log(response)
        } else {
          setTimeout(function() {
            window.location = "/"
          }, 100)
        }
      })
      .fail(function(err) {
        console.log(err)
      })
    })
  }

  function getAndRenderArticles() {
    getArticles()
    .then(function(articles) {
      articles.forEach(function(a) {
        renderArticle(a)
      })
    })
  }

  function renderArticle(a) {
    var article = $("<article class='row'>")

    var content = $("<div class='col col-8 col-sm-9 col-md-10'>").appendTo(article)
    $("<h4>").append($("<a class='ars-link'>").text(a.title).attr("href", a.originalURL)).appendTo(content)
    if (a.excerpt.length > 0) $("<p>").html(`${a.excerpt} &mdash; ${a.author}`).appendTo(content)

    var comments = $("<div class='col col-4 col-sm-3 col-md-2 text-right'>").appendTo(article)
    $(`<a href='/${a._id}' class='btn btn-secondary commentBtn'><i class='material-icons'>comment</i> <span>${a.comments.length}</span></a>`).appendTo(comments)

    articlesBox.append(article)
  }

  function getArticles(limit, offset) {
    var endpointURL = "/api/articles"
    // if (limit != undefined || offset != undefined) {
    //   endpointURL += "?"
    // }
    return new Promise(function(resolve, reject) {
      $.get(endpointURL)
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
