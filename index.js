const Plugin = require("./lib/plugin")
const Projectile = require("./lib/projectile")
const Constants = require("./lib/constants")

function plugin(bot) {
    bot.projectile = new Plugin(bot)
}

module.exports = {
    plugin,
    Projectile,
    Constants
};