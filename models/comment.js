module.exports = function(mongoose) {
  return new mongoose.Schema({
    article: {type: mongoose.Schema.Types.ObjectId, ref: "Article"},
    user: String,
    body: String,
    date: Date
  })
}
