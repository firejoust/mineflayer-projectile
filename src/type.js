const vec2 = require(`vec2`);

class type {
    /**
     * @constructor
     * @param {vec2} velocity - A two-dimensional vector for the initial velocity of a projectile in a certain direction
     * @param {number} gravity - A value determining the vertical acceleration of a projectile
     * @param {void} chargeFunc - A function determining the initial velocity after a certain number of ticks.
     */
    constructor(velocity, gravity, chargeFunc) {
        this.velocity = velocity || null;
        this.gravity = gravity || 0;
        this.chargeFunc = chargeFunc || function() { return this.velocity };
    }

    initialAngle() {
        return Math.atan2(this.velocity.y, this.velocity.x);
    }

    launchAngle(position, destination, chargeTicks) {
        if (!this.velocity) return 0;
        let velocity = chargeTicks ? this.chargeFunc(chargeTicks).lengthSquared() : this.velocity.lengthSquared();
        return Math.asin(-(position.distanceTo(destination) * this.gravity)/(2 * velocity));
    }

    time(position, destination, chargeTicks) {
        if (!this.velocity) return 0;
        let velocity = chargeTicks ? this.chargeFunc(chargeTicks).length : this.velocity.length;
        return position.distanceTo(destination)/velocity;
    }
}

module.exports = type;