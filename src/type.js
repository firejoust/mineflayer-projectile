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
        return Math.asin(-(position.distanceTo(destination) * this.gravity)/(2 * this.chargeFunc(chargeTicks).lengthSquared()));
    }

    timeParabolic(angle, chargeTicks) {
        if (!this.velocity) return 0;
        return -(2 * Math.sin(angle) * this.chargeFunc(chargeTicks).length())/(this.gravity);
    }

    timeLinear(distance, chargeTicks) {
        if (!this.velocity) return 0;
        return distance/this.chargeFunc(chargeTicks).length();
    }
}

module.exports = type;