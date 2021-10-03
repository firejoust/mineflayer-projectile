const vec2 = require(`vec2`);
const vec3 = require(`vec3`);
const type = require(`./type`);

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

    /**
     * @description - Determines where a coordinate will move after a certain number of ticks.
     * @param {vec3} destination - The existing destination coordinate
     * @param {targetOptions} targetOptions
     * @returns {vec3}
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

    /**
     * 
     * @param {type} type - Which projectile is being used
     * @param {*} position - Where the projectile is being fired
     * @param {*} destination - Where the projectile needs to hit
     * @param {*} targetOptions 
     * @returns 
     */
    getAngle(type, position, destination, targetOptions) {
        let { targetVelocity, targetAcceleration, travelDuration, chargeDuration } = targetOptions || {};
        travelDuration = travelDuration || 0;

        // find the initial angle(s) required to land without variable modification
        let distance = position.distanceTo(destination);
        let initial = type.initialAngle();
        let pitchH = type.launchAngle(position, destination, chargeDuration);
        let pitchV = (Math.PI/2) - pitchH;

        // determine horizontal + vertical travel time based on starting angle(s)
        let tH, tV;
        tH = tV = type.timeLinear(distance, chargeDuration); // no gravity, linear trajectory
        if (type.gravity !== 0) {
            tH = travelDuration + type.timeParabolic(pitchH, chargeDuration);
            tV = travelDuration + type.timeParabolic(pitchV, chargeDuration);
        }

        // horizontal + vertical positions estimated from time taken by two fire angles
        let pH = this.getTarget(destination, { targetVelocity, targetAcceleration, chargeDuration, travelDuration: tH});
        let pV = this.getTarget(destination, { targetVelocity, targetAcceleration, chargeDuration, travelDuration: tV});

        // revise the angles to account for projectile travel time
        pitchH = type.launchAngle(position, pH, chargeDuration);
        pitchV = (Math.PI/2) - type.launchAngle(position, pV, chargeDuration);
        if (pitchH > pitchV) pitchV = NaN; // horizontal angle should never surpass the vertical angle; either invalid data or too far away

        let yawH = Math.atan2(pH.x - position.x, pH.z - position.z);
        let yawV = Math.atan2(pV.x - position.x, pV.z - position.z);

        // return two possible angles in order to effectively hit the target
        let pitch = Math.atan2(destination.y - position.y, Math.sqrt((destination.x - position.x) ** 2 + (destination.z - position.z) ** 2));
        return {
            horizontal: new vec2(yawH + Math.PI, (pitch + pitchH) - initial),
            vertical: new vec2(yawV + Math.PI, (pitch + pitchV) - initial), // vertical angle has little reliability due to minecraft's drag coefficient
        };
    }

    // ToDo: implement

    /**
     * @typedef {object} trajectoryOptions
     * @property {boolean?} blockCollision - If the projectile can collide with blocks
     * @property {boolean?} entityCollision - If the projectile can collide with entities
     * @property {string?} evaluationType - Which algorithm to use to determine collisions. Can be either "area", "linear", or "hybrid".
     * @property {number?} maximumDuration - How long (in ticks) that the projectile is airborne for
    */
    #getCollision(type, position, direction, trajectoryOptions) {

    }

}

module.exports = projectile;