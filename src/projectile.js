const vec2 = require(`vec2`);
const vec3 = require(`vec3`);
const type = require(`./type`);

class projectile {

    constructor(bot) {
        this.bot = bot;
    }

    /**
     * Determines a position's translation after a certain number of ticks
     * @param {vec3} position - The current position of the target
     * @param {vec3?} velocity - How fast the target is moving (blocks per tick)
     * @param {vec3?} acceleration - How fast the target's velocity is increasing (blocks per tick squared)
     * @param {number?} latency - How long the target has been moving for (in ticks)
     * @returns {vec3} The updated position
     */
    getTarget(position, velocity, acceleration, latency) {
        let U = velocity || new vec3(0, 0, 0);
        let A = acceleration || new vec3(0, 0, 0);
        let T = latency || 0;

        // s=ut+(1/2)at^2
        let Sx = (U.x * T) + (A.x * T ** 2) / 2;
        let Sy = (U.y * T) + (A.y * T ** 2) / 2;
        let Sz = (U.z * T) + (A.z * T ** 2) / 2;

        return position.offset(Sx, Sy, Sz);
    }

    /**
     * Determines the suitable yaw & pitch to hit a target with a projectile
     * @param {type} type - Which projectile is being used
     * @param {vec3} position - Where the projectile is being fired
     * @param {vec3} destination - Where the projectile needs to hit
     * @param {number?} chargeTicks - (Optional) how long the projectile has been charging for (in ticks)
     * @returns {vec2} - The x property is the required yaw, and the y property is the required pitch
     */
    getAngle(type, position, destination, chargeTicks) {
        // find the initial angle(s) required to land without variable modification
        let initial = type.initialAngle();
        let offset = type.launchAngle(position, destination, chargeTicks);

        // find the required angles to actually hit the target
        let yaw = Math.atan2(target.x - position.x, target.z - position.z);
        let pitch = Math.atan2(destination.y - position.y, Math.sqrt((destination.x - position.x) ** 2 + (destination.z - position.z) ** 2));

        // maybe yaw can simply be reverse by using position - target instead of target - position.
        return new vec2(yaw + Math.PI, (pitch + offset) - initial);
    }
}

module.exports = projectile;