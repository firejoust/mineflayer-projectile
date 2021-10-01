const vec2 = require(`vec2`);
const vec3 = require(`vec3`);

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

    displacementX(position, destination) {
        let difference = destination.minus(position);
        return Math.sqrt(difference.x ** 2 + difference.z ** 2);
    }

    displacementY(position, destination) {
        return destination.minus(position).y;
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

class projectile {

    constructor(bot) {
        this.bot = bot;
    }

    /**
     * @typedef {object} targetOptions
     * @property {vec3?} targetVelocity - The velocity (movement per tick) for a moving target
     * @property {vec3?} targetAcceleration - The acceleration (change in movement per tick) for a moving target
     * @property {number?} travelDuration - A supplement defining the projectile's total travel time (in ticks)
     * @property {number?} chargeDuration - Specify how long the projectile has been charging for (in ticks)
     */
    getTarget(destination, targetOptions) {
        let options = targetOptions || {};
        let U = options.targetVelocity || new vec3(0, 0, 0);
        let A = options.targetAcceleration || new vec3(0, 0, 0);
        let T = options.travelDuration || 0;

        // s=ut+(1/2)at^2
        let Sx = (U.x * T) + (A.x * T ** 2) / 2;
        let Sy = (U.y * T) + (A.y * T ** 2) / 2;
        let Sz = (U.z * T) + (A.z * T ** 2) / 2;

        return destination.offset(Sx, Sy, Sz);
    }

    getPitch(type, position, destination, targetOptions) {
        let { targetVelocity, targetAcceleration, travelDuration, chargeDuration } = targetOptions || {};
        travelDuration = travelDuration || 0;

        // find the initial angle(s) required to land without variable modification
        let distance = position.distanceTo(destination);
        let initial = type.initialAngle();
        let aH = type.launchAngle(position, destination, chargeDuration);
        let aV = (Math.PI/2) - aH;

        // determine horizontal + vertical travel time based on starting angle(s)
        let tH, tV;
        tH = tV = type.timeLinear(distance, chargeDuration); // no gravity, linear trajectory
        if (type.gravity !== 0) {
            tH = travelDuration + type.timeParabolic(aH, chargeDuration);
            tV = travelDuration + type.timeParabolic(aV, chargeDuration);
        }

        // horizontal + vertical positions estimated from time taken by two fire angles
        let pH = this.getTarget(destination, { targetVelocity, targetAcceleration, chargeDuration, travelDuration: tH});
        let pV = this.getTarget(destination, { targetVelocity, targetAcceleration, chargeDuration, travelDuration: tV});

        // rework the angles to account for projectile travel time
        aH = type.launchAngle(position, pH, chargeDuration);
        aV = (Math.PI/2) - type.launchAngle(position, pV, chargeDuration);
        if (aH > aV) aV = NaN; // horizontal angle should never surpass the vertical angle; either invalid data or too far away

        // return two possible angles in order to effectively hit the target
        let offset = Math.atan2(destination.y - position.y, Math.sqrt((destination.x - position.x) ** 2 + (destination.z - position.z) ** 2));
        return {
            horizontal: (offset + aH) - initial,
            vertical: (offset + aV) - initial,
        };
    }

    /**
     * @typedef {object} trajectoryOptions
     * @property {boolean?} blockCollision - If the projectile can collide with blocks
     * @property {boolean?} entityCollision - If the projectile can collide with entities
     * @property {string?} evaluationType - Which algorithm to use in order to find collisions. Can be either "area", "linear", or "hybrid".
     * @property {number?} maximumDuration - How long (in ticks) that the projectile is airborne for
     */
    getCollision(type, position, direction, options) {

    }
}

function inject(bot) {
    bot.projectile = new projectile(bot);
    bot.projectile.type = type;
}

module.exports = inject;