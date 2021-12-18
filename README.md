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

### Example
```javascript
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
```
