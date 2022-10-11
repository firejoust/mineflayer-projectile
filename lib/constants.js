const Projectile = require("./projectile")

function bowCharge(ticks) {
    return ticks < 20
    ? (ticks / 20) ** 2 + (ticks / 20) * 2 // convert ticks to seconds, v=t^2+2t
    : 3
}

module.exports = {
    bow: new Projectile(3, -0.05, bowCharge),
    crossbow: new Projectile(3.15, -0.05),
    throwable: new Projectile(1.5, -0.03), // snowball, egg, enderpearl
    potion: new Projectile(0.5, -0.05), // lingering + splash potions
    expbottle: new Projectile(0.7, -0.07),
    trident: new Projectile(2.5, -0.05), // + 0.5 velocity for each level of riptide
    firework: new Projectile(1.6, 0), // firework shot from a crossbow (no gravity)
    rod: new Projectile(0.3, -0.03),
}