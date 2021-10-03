const vec2 = require(`vec2`);
const type = require(`./type`);

function bowCharge(ticks) {
    if (ticks > 20) return new vec2(3, 0);
    return new vec2(((ticks / 20) ** 2 + (ticks / 20) * 2), 0); // convert ticks to seconds, v=t^2+2t
}

module.exports = {
    bow: new type(new vec2(3, 0), -0.05, bowCharge),
    crossbow: new type(new vec2(3.15, 0), -0.05),
    throwable: new type(new vec2(1.5, 0), -0.03), // snowball, egg, enderpearl
    potion: new type(new vec2(0.5, 0), -0.05), // lingering + splash potions
    expbottle: new type(new vec2(0.7, 0), -0.07),
    trident: new type(new vec2(2.5, 0), -0.05), // + 0.5 velocity for each level of riptide
    firework: new type(new vec2(1.6, 0)), // firework shot from a crossbow (no gravity)
}