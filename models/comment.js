module.exports = function(mongoose) {
  return new mongoose.Schema({
    user: String,
    body: String,
    date: {type: Date, default: Date.now}
  })
}
