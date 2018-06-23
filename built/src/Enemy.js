export class Enemy {
    constructor(type, pathingObject) {
        this.type = type;
        this.pathing = pathingObject;
        this.maxHp = type.maxHealth;
        this.hp = type.maxHealth;
        this.currentSpeed = this.type.speed;
        this.slowingTimer = 0;
    }
    slow(slowing, slowTime) {
        var tentativeNewSpeed = this.type.speed * slowing;
        if (tentativeNewSpeed < this.currentSpeed) {
            this.currentSpeed = tentativeNewSpeed;
            this.slowingTimer = slowTime;
        }
    }
    updateEffectTimers() {
        if (this.slowingTimer <= 0) {
            return;
        }
        else if (this.slowingTimer == 1) {
            this.slowingTimer = 0;
            this.currentSpeed = this.type.speed;
            return;
        }
        else {
            this.slowingTimer--;
        }
    }
}
