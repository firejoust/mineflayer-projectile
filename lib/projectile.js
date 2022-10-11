class Projectile {
    constructor(velocity, gravity, chargeFunc) {
        this.velocity = velocity || 0
        this.gravity = gravity || 0
        this.chargeFunc = chargeFunc || function() { return this.velocity }
    }

    launchAngle(position, destination, chargeTicks) {
        if (this.velocity === 0) return 0
    
        let velocity = chargeTicks === undefined
        ? this.velocity
        : this.chargeFunc(chargeTicks)

        return Math.asin(-position.distanceTo(destination) * this.gravity / (2 * (velocity ** 2)))
    }

    time(position, destination, chargeTicks) {
        if (this.velocity === 0) return 0
        // projectile charge function will influence travel time
        let velocity = chargeTicks === undefined
        ? this.velocity
        : this.chargeFunc(chargeTicks)

        // v=d/t, t=d/v
        return position.distanceTo(destination) / velocity
    }
}

module.exports = Projectile;