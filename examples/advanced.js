/*
**  This example builds upon intermediate.js, using a custom defined projectile as a basis for the trajectory angle.
*/

const mineflayer = require(`mineflayer`);
const projectile = require(`mineflayer-projectile`);
const vec3 = require(`vec3`);
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
    let velocity, acceleration, previous;
    let time = bot.projectile.types.bow.time(bot.entity.position, target.position); // calculate how long the projectile takes to travel
    bot.activateItem();

    // allow enough time to charge the bow whilst predicting the target's new velocity every tick
    for (let i = 0; i < 20; i++) {
        await delay(50); // exactly one tick in milliseconds

        // initial tick, undefined velocity. Set the initial position so we can get it the next tick
        if (i === 0) {
            previous = target.position;
            continue;
        }

        // the difference between the two positions is the velocity
        velocity = target.position.minus(previous);
        previous = target.position;
    }

    if (!target.onGround) acceleration = new vec3(0, -0.08, 0); // target is falling
    let destination = bot.projectile.getTarget(target.position, velocity, acceleration, time); // determine where the target will move during projectile travel time
    let angle = bot.projectile.getAngle(bot.projectile.types.bow, bot.entity.position, destination);
    await bot.look(angle.x, angle.y);
    bot.deactivateItem();
}