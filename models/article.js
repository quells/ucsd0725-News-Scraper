module.exports = function(mongoose) {
  return new mongoose.Schema({
    title: String,
    excerpt: String,
    author: String,
    originalURL: {type: String, index: {unique: true}},
    dateCollected: {type: Date, default: Date.now},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}]
  })
}
