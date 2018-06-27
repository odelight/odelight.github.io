export class EnemyType {
    constructor(type, speed, maxHealth) {
        this.id = type;
        this.speed = speed;
        this.maxHealth = maxHealth;
    }
}
var enemy0 = new EnemyType(0, 0.75, 10000);
var enemy1 = new EnemyType(1, 0.5, 40000);
var enemy2 = new EnemyType(2, 1.0, 100000);
export var EnemyTypes = [enemy0, enemy1, enemy2];
