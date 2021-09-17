const vec2 = require(`vec2`);
const vec3 = require(`vec3`);

/**
 * @typedef {object} targetOptions
 * @property {vec3?} targetVelocity - The velocity (movement per tick) for a moving target
 * @property {vec3?} targetAcceleration - The acceleration (change in movement per tick) for a moving target
 * @property {number?} Duration - A supplement defining how much extra time should be added to the projectile's total travel time (in ticks)
 * @property {number?} chargeDuration - Specify how long the projectile has been charging for (in ticks)
 */

/**
 * @typedef {object} angleOptions
 * @property {vec3?} targetVelocity - The velocity (movement per tick) for a moving target
 * @property {vec3?} targetAcceleration - The acceleration (change in movement per tick) for a moving target
 * @property {boolean?} verticalAim - If vertical aim opposed to horizontal aim should be accounted for
 * @property {boolean?} dynamicAim - Whether or not to account for projectile travel time whilst aiming
 * @property {number?} travelDuration - A supplement defining how much extra time should be added to the projectile's total travel time (in ticks)
 * @property {number?} chargeDuration - Specify how long the projectile has been charging for (in ticks)
 */

/**
 * @typedef {object} trajectoryOptions
 * @property {boolean?} blockCollision - If the projectile can collide with blocks
 * @property {boolean?} entityCollision - If the projectile can collide with entities
 * @property {string?} evaluationType - Which algorithm to use in order to find collisions. Can be either "area", "linear", or "hybrid".
 * @property {number?} maximumDuration - How long (in ticks) that the projectile is airborne for
 */

 class type {
    /**
     * @constructor
     * @param {vec2} velocity - A two-dimensional vector for the initial velocity of a projectile in a certain direction
     * @param {vec2} acceleration - A two-dimensional vector for the acceleration of a projectile in a certain direction
     * @param {void} chargeFunc - Determines the initial velocity after a certain number of ticks.
     */
    constructor(velocity, acceleration, chargeFunc) {
        this.velocity = velocity || null;
        this.acceleration = acceleration || null;
        this.chargeFunc = chargeFunc || function() { return this.velocity };
    }

    displacementX(position, destination) {
        let difference = destination.minus(position);
        return Math.sqrt(difference.x ** 2 + difference.z ** 2);
    }

    displacementY(position, destination) {
        return destination.minus(position).y;
    }

    timeX(position, destination, chargeDuration) {
        let Sx = this.displacementX(position, destination);
        let initial = chargeDuration ? this.chargeFunc(chargeDuration) : this.velocity;

        if (this.acceleration && this.acceleration.x > 0) {
            return (Math.sqrt(initial.x ** 2 + 2 * this.acceleration.x * Sx) - initial.x) / this.acceleration.x;
        }

        return Sx/initial.x;
    }

    timeY(position, destination, chargeDuration) {
        let Sy = this.displacementY(position, destination);
        let initial = chargeDuration ? this.chargeFunc(chargeDuration) : this.velocity;

        if (this.acceleration && this.acceleration.y > 0) {
            let aSy = -(initial.y ** 2)/(2 * this.acceleration.y);
            let ascensionTime = -initial.y / this.acceleration.y;
            let descensionTime = Math.sqrt((2 * (Sy + aSy)) / this.acceleration.y);
            return ascensionTime + descensionTime;
        }

        return Sy/initial.y;
    }
}

class projectile {

    constructor(bot) {
        this.bot = bot;
    }

    getTarget(type, position, destination, options) {
        if (!options.targetVelocity) return destination;
        let velocity = options.targetVelocity
    }

    getAngle(type, position, destination, options) {

    }

    getCollision(type, position, direction, options) {

    }
}

function inject(bot) {
    bot.projectile = new projectile(bot);
    bot.projectile.type = type;
}

module.exports = () => { return inject }