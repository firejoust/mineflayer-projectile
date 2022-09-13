class Projectile {
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
        let velocity = chargeTicks ? this.chargeFunc(chargeTicks).length() : this.velocity.length();
        return position.distanceTo(destination)/velocity;
    }
}

module.exports = Projectile;