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
  bot.look(angle.horizontal.yaw, angle.horizontal.pitch);
  
  // server needs a tick to process head rotation
  await delay(50);
  bot.deactivateItem();
}
```
