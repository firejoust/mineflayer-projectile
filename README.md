<div align="center">
  <h1>Mineflayer-projectile</h1>
  <p>Determine the trajectory & angle of projectiles in mineflayer using Newtonian mechanics</p>
  <img src="https://img.shields.io/npm/v/mineflayer-projectile?style=flat-square">
  <img src="https://img.shields.io/github/license/firejoust/mineflayer-projectile?style=flat-square">
  <img src="https://img.shields.io/github/issues/firejoust/mineflayer-projectile?style=flat-square">
  <img src="https://img.shields.io/github/issues-pr/firejoust/mineflayer-projectile?style=flat-square">
  <img src="preview.gif">
</div>

#### Functionality
- Determine the optimal angle for a projectile with a high level physical basis
- Predict the movement of a target in 3D space using classical mechanics
- Detect parabolic & linear projectile collision with blocks

#### Installation
- Execute the following in your NPM project directory:
```bash
npm install mineflayer-projectile
```

#### API
##### Class definition
```js
class Vec2; // (https://www.npmjs.com/package/vec2)
class Vec3; // (https://www.npmjs.com/package/vec3)
```
##### Methods & Constants
```js
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

#### Simple Example
```js
const mineflayer = require(`mineflayer`)
const projectile = require(`mineflayer-projectile`)
const bot = mineflayer.createBot()
bot.loadPlugin(projectile)

let attack = false
let occupied = false

async function shoot(target) {
  // draw bow
  bot.activateItem()
  await new Promise(resolve => setTimeout(resolve, 1000))
  // lock on
  let angle = bot.projectile.getAngle(bot.projectile.types.bow, bot.entity.position, target.position)
  await bot.look(angle.x, angle.y)
  // release
  bot.deactivateItem()
}

bot.on("message", json => {
  let message = json.toString()
  if (message.includes("$attack")) {
    attack = !attack
    bot.chat(attack ? "Now autonomously firing towards the closest enemy!" : "Ceasing all operation!")
  }
})

bot.on("physicsTick", async () => {
  if (attack && !occupied) {
    let target = bot.nearestEntity(entity => entity.username)
    
    occupied = true
    if (target) {
      await shoot(target)
    }
    occupied = false
  }
});
```
