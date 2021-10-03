<div align="center">
  <h1>Mineflayer-projectile</h1>
  <img src="https://img.shields.io/github/issues/Camezza/mineflayer-projectile?style=for-the-badge">
  <img src="https://img.shields.io/github/stars/Camezza/mineflayer-projectile?style=for-the-badge">
  <img src="https://img.shields.io/github/license/Camezza/mineflayer-projectile?style=for-the-badge">
  <p><i>Effectively determine the trajectory & angle of projectiles in mineflayer with Newtonian mechanics</i></p>
  <img src="preview.gif">
</div>

### Features
- Determine the optimal angle for a projectile with a high level physical basis
- Predict the movement of a target in 3D space using modernised classical mechanics
- (WIP) Detect parabolic & linear projectile collision with entities and blocks

### Installation
- This package can be installed with `npm`:
```bash
npm i mineflayer-projectile
```

### Example
```javascript
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
  return !!target;
}

async function shoot(target) {
  bot.activateItem();
  
  // allow enough time to charge the bow (10 ticks)
  await delay(950);
  let angle = bot.projectile.getAngle(bot.projectile.types.bow, bot.entity.position, target.position);
  bot.look(angle.horizontal.x, angle.horizontal.y);
  
  // server needs a tick to process head rotation
  await delay(50);
  bot.deactivateItem();
}
```

### API
```javascript
// types
vec2 (https://www.npmjs.com/package/vec2)
vec3 (https://www.npmjs.com/package/vec3)

/*
Defines a new projectile type, which can then be used in other functions.
- velocity (vec2, optional) - The initial horizontal & vertical velocity of the projectile (blocks per tick). Can be left out for instantaneous velocity.
- gravity (integer, optional) - A single dimensional vector for the value of gravity (blocks per tick). Can be left out for a linear trajectory.
- chargeFunc (function, optional) - A function accepting how long a projectile has been charged for (ticks), returning a vec2 value defining the subsequent initial velocity.
*/
bot.projectile.type(velocity, gravity, chargeFunc)

/*
References a pre-defined projectile type.
- "type" can be replaced with "bow", "crossbow", "potion", "expbottle", "throwable" (eggs, snowballs, pearls) or "firework" (fireworks shot from a crossbow).
*/
bot.projectile.types.type

/*
Gets the vertical and horizontal angle required to land at the specified destination.
- type (bot.projectile.type) - The projectile which is being fired
- position (vec3) - Where the projectile is being fired
- destination (vec3) - Where the projectile will land
- targetOptions (object, optional) - Settings that should be accounted for whilst determining a target.
*/
bot.projectile.getAngle(type, position, destination, targetOptions)

```
