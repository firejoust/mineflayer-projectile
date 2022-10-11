<div align="center">
  <h1>Mineflayer-projectile</h1>
  <p>Determine the trajectory & angle of projectiles in mineflayer using Newtonian mechanics</p>
  <img src="https://img.shields.io/npm/v/mineflayer-projectile?style=flat-square">
  <img src="https://img.shields.io/github/license/firejoust/mineflayer-projectile?style=flat-square">
  <img src="https://img.shields.io/github/issues/firejoust/mineflayer-projectile?style=flat-square">
  <img src="https://img.shields.io/github/issues-pr/firejoust/mineflayer-projectile?style=flat-square">
  <img src="preview.gif">
</div>

### Features
- Determine the optimal angle for a projectile with a high level physical basis
- Predict the movement of a target given their velocity/acceleration
- Get a projectile's intersection coordinates with blocks

### Installation
- Execute the following in your node project directory:
```bash
npm install mineflayer-projectile
```

### API
#### Loading the Plugin
```js
const projectile = require("mineflayer-projectile")

const bot = mineflayer.createBot( ... )

bot.loadPlugin(projectile.plugin)
```
#### Return Types
```js
 // (https://www.npmjs.com/package/vec3)
class Vec3;

// yaw and pitch needed to hit a target with a projectile
Angle = {
  yaw: number,
  pitch: number
}
```
#### Predefined Types & Constants
```js
const { Projectile, Constants } = require("mineflayer-projectile")

/*
A pre-defined type used for calculating projectile physics
- "type" can be "bow", "crossbow", "potion", "expbottle", "trident", "throwable" (eggs, snowballs, pearls) or "firework" (fireworks shot from a crossbow)
*/
type = Constants["type"]

/*
Initialises a new projectile type used for calculating projectile physics
- velocity (Number, optional) - The initial velocity, will assume 0 if unspecified (instantaneous)
- gravity (Number, optional) - The gravity, will assume 0 if unspecified (linear)
- chargeFunc (Void, optional) - A function returning the velocity after a set number of ticks (See below)
- Returns: Projectile
*/
type = new Projectile(velocity, gravity, chargeFunc)

/*
A function returning a projectile's velocity after a number of ticks
- ticks (Number) How long the projectile has been charging for (example: drawing a bow)
*/
chargeFunc = function(ticks) {
  return velocity
}
```
#### Methods
```js
/*
Predicts the target's position offset after a period of time
- destination (Vec3) - Where the projectile is being fired
- ticks (Number) - How long the target will move for (in ticks)
- velocity (Vec3, optional) - How fast the target is moving
- acceleration (Vec3, optional) - How fast the target's velocity is increasing
- Returns: Vec3
*/
bot.projectile.getOffset(destination, ticks, velocity, acceleration)

/*
Gets the yaw and pitch required to hit a target
- type (Projectile) - Projectile used for calculation
- position (Vec3) - Where the projectile is being fired
- destination (Vec3) - Where the projectile is landing
- chargeTicks (Number, optional) - How long the projectile has been charging for (in ticks)
- Returns: Angle
*/
bot.projectile.getAngle(type, position, destination, chargeTicks)

/*
Determines where the projectile will intersect with a block
- type (Projectile) - Projectile used for calculation
- position (Vec3) - Where the projectile is being fired
- destination (Vec3) - Where the projectile is landing
- chargeTicks (Number, optional) How long the projectile has been charging for (in ticks)
- Returns: Vec3
*/
bot.projectile.getCollision(type, position, destination, chargeTicks)
```
#### Example
```js
const mineflayer = require(`mineflayer`)
const projectile = require(`mineflayer-projectile`)
const bot = mineflayer.createBot()
bot.loadPlugin(projectile.plugin)

let attack = false
let occupied = false

async function shoot(target) {
  // draw bow
  bot.activateItem()
  await new Promise(resolve => setTimeout(resolve, 1000))

  // lock on
  let angle = bot.projectile.getAngle(bot.projectile.types.bow, bot.entity.position, target.position)
  if (angle === null) return // too far away
  await bot.look(angle.yaw, angle.pitch, true)

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
    let target = bot.nearestEntity(entity => entity.type === "player")
    occupied = true

    if (target) {
      await shoot(target)
    }

    occupied = false
  }
});
```
