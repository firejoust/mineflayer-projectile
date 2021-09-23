const vec2 = require(`vec2`);
const vec3 = require(`vec3`);

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

        if (this.acceleration && this.acceleration.x !== 0) {
            return (Math.sqrt(Math.abs(initial.x ** 2 + 2 * this.acceleration.x * Sx)) - initial.x) / this.acceleration.x;
        }

        return Sx/initial.x;
    }

    timeY(position, destination, chargeDuration) {
        let Sy = this.displacementY(position, destination);
        let initial = chargeDuration ? this.chargeFunc(chargeDuration) : this.velocity;

        if (this.acceleration && this.acceleration.y !== 0) {
            let ascensionSy = -(initial.y ** 2)/(2 * this.acceleration.y);
            let ascension = -initial.y / this.acceleration.y;
            let descension = Math.sqrt(Math.abs((2 * (Sy + ascensionSy)) / this.acceleration.y));
            return ascension + descension;
        }

        return Sy/initial.y;
    }

    initialAngle() {
        return Math.atan2(this.velocity.y, this.velocity.x);
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
     * @property {number?} travelDuration - A supplement defining how much extra time should be added to the projectile's total travel time (in ticks)
     * @property {number?} chargeDuration - Specify how long the projectile has been charging for (in ticks)
     */
    getTarget(type, position, destination, targetOptions) {
        let options = targetOptions || {};
        let U = options.targetVelocity || new vec3(0, 0, 0);
        let A = options.targetAcceleration || new vec3(0, 0, 0);

        // determine time it takes to travel & optional time supplement
        let Tt = type.timeX(position, destination, options.chargeDuration);
        let Ts = options.travelDuration || 0;
        let T = Math.floor(Tt + Ts);

        // s=ut+(1/2)at^2
        let Sx = (U.x * T) + (A.x * T ** 2) / 2;
        let Sy = (U.y * T) + (A.y * T ** 2) / 2;
        let Sz = (U.z * T) + (A.z * T ** 2) / 2;

        return destination.offset(Sx, Sy, Sz);
    }

    getAngle(type, position, destination, options) {
        let target = this.getTarget(type, position, destination, options);
        let yaw;
        let pitch;

        if (!type.velocity || !type.acceleration) return {}; 

        let Sx = type.displacementX(position, target);
        let Sy = type.displacementY(position, target);
        let Tx = type.timeX(position, target, (options || {}).chargeDuration);
        let Ty = type.timeY(position, target, (options || {}).chargeDuration);

        // these values below are correct.
        let Ux = (Sx - (type.acceleration.x * Ty ** 2) / 2) / Ty;
        let Uy = (Sy - (type.acceleration.y * Tx ** 2) / 2) / Tx;

        console.log(`Sx: ${Sx}`);
        console.log(`Sy: ${Sy}`);
        console.log(`Tx: ${Tx}`);
        console.log(`Ty: ${Ty}`);
        console.log(`Ux: ${Ux} \nUy: ${Uy} \ninitialX: ${type.velocity.x} \ninitialY: ${type.velocity.y}`);


        // these values are influenced by the new initial velocities. They should be equal/below to the original initial velocity in order to be valid
        console.log(`horizontal angle: ${Math.atan2(type.velocity.y, Ux) * 180/Math.PI}`);
        console.log(`vertical angle: ${Math.atan2(Uy, type.velocity.x) * 180/Math.PI}`);

        /*
        let horizonal = new vec2(Ux, type.velocity.y);
        let vertical = new vec2(type.velocity.x, Uy)

        console.log(horizonal);
        console.log(vertical);
        */
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