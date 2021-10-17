/*
**  This is a basic example of how someone can make their bot shoot a target with a bow.
*/

const mineflayer = require(`mineflayer`);
const projectile = require(`mineflayer-projectile`);
const bot = mineflayer.createBot(); // etc. (https://github.com/PrismarineJS/mineflayer/blob/master/docs/api.md#mineflayercreatebotoptions)

bot.once(`login`, login);

function login() {
  bot.loadPlugin(projectile);
  setTimeout(scan, 10 * 1000); // within 10 seconds of joining, find a new target to shoot
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scan() {
  let target = bot.nearestEntity(entity => entity.name.toLowerCase() === `player`);
  if (target) {
    bot.chat("Sniping's a good job mate.");
    await shoot(target);
  }
}

async function shoot(target) {
  bot.activateItem();
  
  // allow enough time to charge the bow (10 ticks)
  await delay(1000);
  let angle = bot.projectile.getAngle(bot.projectile.types.bow, bot.entity.position, target.position);
  await bot.look(angle.x, angle.y);
  bot.deactivateItem();
}