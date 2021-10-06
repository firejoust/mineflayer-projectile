const vec2 = require(`vec2`);
const vec3 = require(`vec3`);
const line3 = require(`line3`);
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
        let yaw = Math.atan2(position.x - destination.x, position.z - destination.z);
        let pitch = Math.atan2(destination.y - position.y, Math.sqrt((destination.x - position.x) ** 2 + (destination.z - position.z) ** 2));
        return new vec2(yaw, (pitch + offset) - initial);
    }

    /**
     * Determines a projectile's interception coordinates with blocks
     * @param {type} type - Which projectile is being used
     * @param {vec3} position - Where the projectile is being fired
     * @param {vec3} destination - Where the projectile needs to hit
     * @param {number?} chargeTicks - (Optional) how long the projectile has been charging for (in ticks)
     * @returns {vec3[]} - An array of 3D coordinates
     */
    getCollision(type, position, destination, chargeTicks) {
        let collisions = [];
        let time = type.time(position, destination, chargeTicks);
        let angle = this.getAngle(type, position, destination, chargeTicks);

        // initial velocity
        let U = chargeTicks ? type.chargeFunc(chargeTicks).length() : type.velocity.length();
        let Ux = U * Math.sin(angle.x + Math.PI);
        let Uy = U * Math.sin(angle.y);
        let Uz = U * Math.cos(angle.x + Math.PI);

        // find where the projectile intercepts with blocks between ticks
        let verifyCollision = (x, y, z, line) => {
            let offset = position.offset(x, y, z).floored();
            let block = this.bot.blockAt(offset);

            // find which blocks the projectile intercepts with
            if (block.shapes.length > 0) {
                let shapes = [];

                for (let shape of block.shapes) {
                    // find the absolute position of the block vertices
                    shapes.push([shape[0] + offset.x, shape[1] + offset.y, shape[2] + offset.z, shape[3] + offset.x, shape[4] + offset.y, shape[5] + offset.z]);
                }

                if (line.polyIntercept(shapes).length > 0) collisions.push(offset);
            }
        }

        // use the velocity applied every tick to determine where the projectile will travel
        for (let tick = 1, max = Math.ceil(time); tick <= max; tick++) {
            // s=ut+(1/2)at^2
            let p0 = new vec3((Ux * (tick - 1)), (Uy * (tick - 1) + (1/2) * type.gravity * (tick - 1) ** 2), (Uz * (tick - 1)));
            let p1 = new vec3((Ux * tick), (Uy * tick + (1/2) * type.gravity * tick ** 2), (Uz * tick));
            let pd = p1.minus(p0);
            let path = line3.fromVec3(position.plus(p0), position.plus(p1));

            // determine all blocks between start-tick and end-tick coordinates
            // x axis iteration
            for (
                let x = p0.x, sx = pd.x === 0 ? 1 : Math.sign(pd.x); // detemine the start & end of traversed block range
                (sx > 0 && x < p1.x || sx < 0 && x > p1.x); // execute until all points have been fulfilled
                (x += sx) // either increment or decrement based on range difference
            ) 
            // y axis iteration
            for (
                let y = p0.y, sy = pd.y === 0 ? 1 : Math.sign(pd.y);
                (sy > 0 && y < p1.y || sy < 0 && y > p1.y);
                (y += sy)
            ) 
            // z axis iteration
            for (
                let z = p0.z, sz = pd.z === 0 ? 1 : Math.sign(pd.z);
                (sz > 0 && z < p1.z || sz < 0 && z > p1.z);
                (z += sz)
            )
            verifyCollision(x, y, z, path);
        }

        return collisions;
    }
}

module.exports = projectile;