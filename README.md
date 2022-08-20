<div align="center">
  <h1>Mineflayer-projectile</h1>
  <img src="https://img.shields.io/npm/v/mineflayer-projectile?style=flat-square">
  <img src="https://img.shields.io/github/license/firejoust/mineflayer-projectile?style=flat-square">
  <img src="https://img.shields.io/github/issues/firejoust/mineflayer-projectile?style=flat-square">
  <img src="https://img.shields.io/github/issues-pr/firejoust/mineflayer-projectile?style=flat-square">
  <p><i>Effectively determine the trajectory & angle of projectiles in mineflayer with Newtonian mechanics</i></p>
  <img src="preview.gif">
</div>

### Features
- Determine the optimal angle for a projectile with a high level physical basis
- Predict the movement of a target in 3D space using classical mechanics
- Detect parabolic & linear projectile collision with blocks

### Installation
- This package can be installed with `npm`:
```bash
npm install mineflayer-projectile
```

### API
```javascript
// types
Vec2 (https://www.npmjs.com/package/vec2)
Vec3 (https://www.npmjs.com/package/vec3)

/*
A pre-defined projectile type that is used in calculation
- "type" can be "bow", "crossbow", "potion", "expbottle", "trident", "throwable" (eggs, snowballs, pearls) or "firework" (fireworks shot from a crossbow)
*/
bot.projectile.types["type"]

/*
Initialises a projectile type that is used in calculation
- velocity (Vec2, optional) - The initial velocity, will assume infinite if unspecified
- gravity (Number, optional) - The gravity, will assume 0 if unspecified
- chargeFunc (Void, optional) - A function with a parameter for ticks (Number) returning initial velocity (Vec2) used for charged projectiles
- Returns: Projectile
*/
bot.projectile.type(velocity, gravity, chargeFunc)

/*
Returns the yaw (x) and pitch (y) required to hit a target
- type (Projectile) - Projectile used for calculation
- position (Vec3) - Where the projectile is being fired
- destination (Vec3) - Where the projectile is landing
- chargeTicks (Number, optional) - How long the projectile has been charging for (in ticks)
- Returns: Vec2
*/
bot.projectile.getAngle(type, position, destination, chargeTicks)

/*
Returns where the projectile will intersect with a block
- type (Projectile) - Projectile used for calculation
- position (Vec3) - Where the projectile is being fired
- destination (Vec3) - Where the projectile is landing
- chargeTicks (Number, optional) How long the projectile has been charging for (in ticks)
- Returns: Vec3[]
*/
bot.projectile.getCollision(type, position, destination, chargeTicks)

/*
Returns a position's translation after a period of time
- position (Vec3) - Where the projectile is being fired (target)
- velocity (Vec3, optional) - How fast the target is moving
- acceleration (Vec3, optional) - How fast the target's movement is changing
- latency (Number, optional) - How long the target will move for (in ticks)
- Returns: Vec3
*/
bot.projectile.getTarget(position, velocity, acceleration, latency)
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
