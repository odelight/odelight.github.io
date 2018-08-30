export var availableDifficulties = ['Easy', 'Medium', 'Hard'];
export class Enemy {
    constructor(type, pathingObject, difficultyHealthMultiplier = 1) {
        var difficultyAdjustedMaxHealth = type.maxHealth * difficultyHealthMultiplier;
        this.type = type;
        this.pathing = pathingObject;
        this.maxHp = difficultyAdjustedMaxHealth;
        this.hp = difficultyAdjustedMaxHealth;
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
    isSlowed() {
        return this.currentSpeed < this.type.speed;
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
