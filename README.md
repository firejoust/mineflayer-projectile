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
- Detect parabolic & linear projectile collision with blocks

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
  bot.look(angle.x, angle.y);
  
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
- "type" can be replaced with "bow", "crossbow", "potion", "expbottle", "trident", "throwable" (eggs, snowballs, pearls) or "firework" (fireworks shot from a crossbow).
*/
bot.projectile.types.type

/*
Determines the suitable yaw & pitch to hit a target with a projectile
- type (type) - Which projectile is being used
- position (vec3) - Where the projectile is being fired
- destination (vec3) - Where the projectile needs to hit
- chargeTicks (number, optional) - how long the projectile has been charging for (in ticks)
- Returns a vec2 object. The x property is the required yaw, and the y property is the required pitch
*/
bot.projectile.getAngle(type, position, destination, targetOptions)

/*
Determines a position's translation after a certain number of ticks
- position (vec3) - The current position of the target
- velocity (vec3, optional) - How fast the target is moving (blocks per tick)
- acceleration (vec3, optional) - How fast the target's velocity is increasing (blocks per tick squared)
- latency (number, optional) - How long the target has been moving for (in ticks)
- Returns a vec3 object containing the updated position
*/
bot.projectile.getTarget(position, velocity, acceleration, latency)

/*
Determines a projectile's interception coordinates with blocks
- type (type) - Which projectile is being used
- position (vec3) - Where the projectile is being fired
- destination (vec3) - Where the projectile needs to hit
- chargeTicks (number, optional) how long the projectile has been charging for (in ticks)
Returns an array of 3D coordinates
*/
bot.projectile.getCollision(type, position, destination, targetOptions)
```
