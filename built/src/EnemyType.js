export class EnemyType {
    constructor(type, speed, maxHealth) {
        this.id = type;
        this.speed = speed;
        this.maxHealth = maxHealth;
    }
}
var enemy0 = new EnemyType(0, 0.5, 1000);
var enemy1 = new EnemyType(1, 0.25, 20000);
var enemy2 = new EnemyType(2, 0.75, 4000);
export var EnemyTypes = [enemy0, enemy1, enemy2];
