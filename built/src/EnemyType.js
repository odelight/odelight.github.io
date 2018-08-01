export class EnemyType {
    constructor(type, speed, maxHealth) {
        this.id = type;
        this.speed = speed;
        this.maxHealth = maxHealth;
    }
}
var enemy0 = new EnemyType(0, 4, 5000);
var enemy1 = new EnemyType(1, 2, 20000);
var enemy2 = new EnemyType(2, 3, 50000);
export var EnemyTypes = [enemy0, enemy1, enemy2];
