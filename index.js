const Plugin = require("./lib/plugin");
const Projectile = require("./lib/projectile");
const Constants = require("./lib/constants");

function inject(bot) {
    bot.projectile = new Plugin(bot);
    bot.projectile.type = Projectile;
    bot.projectile.types = Constants;
}

module.exports = inject;