/*
**  A simple example of how a mineflayer bot can act as a turret (assuming a bow is actively being held)
**  - Utilises the bot.projectile.getAngle function to determine an angle required to hit a target
**  - References bot.projectile.types.bow to specify that the trajectory should be calculated for an arrow
*/

const mineflayer = require(`mineflayer`);
const projectile = require(`mineflayer-projectile`);
const bot = mineflayer.createBot({}); // etc.
bot.loadPlugin(projectile);

// global variables
let attack = false;
let occupied = false;

// global functions
const delay = async ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const shoot = async target => {
  bot.activateItem();
  // wait 10 ticks to charge a bow (1 tick is 50 milliseconds)
  await delay(1000);
  // lock onto the target's position
  let angle = bot.projectile.getAngle(bot.projectile.types.bow, bot.entity.position, target.position);
  await bot.look(angle.x, angle.y);
  // release bow
  bot.deactivateItem();
}

// listeners
bot.on("message", json => {
  let message = json.toString();
  // the message "$attack" has been sent in the chat
  if (message.includes("$attack")) {
    attack = !attack;
    bot.chat(attack ? "Now autonomously firing towards the closest enemy!" : "Ceasing all operation!");
  }
});

bot.on("physicsTick", async () => {
  // wait for existing operations to finish
  if (attack && !occupied) {
    occupied = true;
    // determine an enemy to target (players only)
    let target = bot.nearestEntity(entity => entity.username);
    if (target) {
      await shoot(target);
    }
    occupied = false;
  }
});