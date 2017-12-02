const moment = require("moment")

module.exports = function(hbs) {
  hbs.registerHelper("relativeTime", (context, options) => {
    return moment(context).fromNow()
  })

  return hbs
}
