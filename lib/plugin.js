const Vec3 = require("vec3")
const Line3 = require("line3")
const Iterator = require("./iterator")

class Plugin {
    constructor(bot) {
        this.bot = bot
    }

    getOffset(destination, ticks, velocity, acceleration) {
        let U = velocity || new Vec3(0, 0, 0)
        let A = acceleration || new Vec3(0, 0, 0)
        let T = ticks || 0

        // s=ut+(1/2)at^2
        let Sx = (U.x * T) + (A.x * T ** 2) / 2
        let Sy = (U.y * T) + (A.y * T ** 2) / 2
        let Sz = (U.z * T) + (A.z * T ** 2) / 2

        return destination.offset(Sx, Sy, Sz)
    }

    getAngle(type, position, destination, chargeTicks) { 
        let yaw = Math.atan2(
            position.x - destination.x,
            position.z - destination.z
        )
        let pitch = Math.atan2(
            destination.y - position.y,
            Math.sqrt((destination.x - position.x) ** 2 + (destination.z - position.z) ** 2)
        )
        let offset = type.launchAngle(
            position,
            destination,
            chargeTicks
        )
        
        if (isNaN(yaw) || isNaN(pitch) || isNaN(offset)) return null
 
        return {
            yaw,
            pitch: pitch + offset
        }
    }

    getCollision(type, position, destination, chargeTicks) {
        let intercept = null
        let time = type.time(position, destination, chargeTicks)
        let angle = this.getAngle(type, position, destination, chargeTicks)

        // initial velocity
        let U = chargeTicks ? type.chargeFunc(chargeTicks) : type.velocity
        let Ux = U * Math.sin(angle.yaw + Math.PI)
        let Uy = U * Math.sin(angle.pitch)
        let Uz = U * Math.cos(angle.yaw + Math.PI)

        // s=ut+(1/2)at^2
        for (let tick = 1, max = Math.ceil(time); tick <= max; tick++) {

            // the start of the line
            let p0 = new Vec3(
                (Ux * (tick - 1)),
                (Uy * (tick - 1) + (1/2) * type.gravity * (tick - 1) ** 2), 
                (Uz * (tick - 1))
            )
            // the end of the line
            let p1 = new Vec3(
                (Ux * tick),
                (Uy * tick + (1/2) * type.gravity * tick ** 2),
                (Uz * tick)
            )

            // initialise line object
            let path = Line3.fromVec3(p0, p1)
            path.setPlus(position.x, position.y, position.z)

            // find where the trajectory will intercept
            Iterator.iterBlocks(path, (x, y, z) => {
                let pos = new Vec3(x, y, z)
                let block = this.bot.blockAt(pos)
                if (block && block.boundingBox === "block") {
                    let rect = [
                        [x, y, z],
                        [x + 1, y + 1, z + 1]
                    ]
                    let entrance = path.rectIntercept(rect, path.rectFace(false))
                    let exit     = path.rectIntercept(rect, path.rectFace(true))
                    // use at least one
                    intercept = entrance ?? exit

                    return Boolean(intercept)
                }
            })
        }

        return intercept
    }
}

module.exports = Plugin;