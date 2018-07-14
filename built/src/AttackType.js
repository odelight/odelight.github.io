export class AttackType {
    constructor(damage, attackDelay, range, slowing, slowTime, multiTarget = false) {
        this.damage = damage;
        this.attackDelay = attackDelay;
        this.range = range;
        this.slowing = slowing;
        this.slowTime = slowTime;
        this.multiTarget = multiTarget;
    }
    apply(enemy) {
        enemy.hp = enemy.hp - this.damage;
        enemy.slow(this.slowing, this.slowTime);
    }
    bigify() {
        return new AttackType(this.damage * 3, Math.ceil(this.attackDelay / 3), this.range * 3, this.slowing, this.slowTime * 2, this.multiTarget);
    }
    slows() {
        return this.slowing < 1;
    }
}
