const projectile = require(`./src/projectile`);
const type = require(`./src/type`);
const constants = require(`./src/constants`);

function inject(bot) {
    bot.projectile = new projectile(bot);
    bot.projectile.type = type;
    bot.projectile.types = constants;
}

module.exports = inject;