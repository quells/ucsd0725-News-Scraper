const express = require("express")
const exphbs = require("express-handlebars")
const bp = require("body-parser")
const hbs = require("./hbs-helpers")(require("handlebars"))

const app = express()
const port = process.env.PORT || 8000

app.use(bp.urlencoded({extended: false}))
app.use(bp.json())

app.engine("handlebars", exphbs({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.use(express.static("public"))
app.use("/api", require("./routes/api"))
app.use("/", require("./routes/web"))

const models = require("./models")

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
