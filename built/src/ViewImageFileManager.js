export class ViewImageFileManager {
    constructor() {
        this.imagePath = "resources/graphics/";
        this.imageFileExtension = ".png";
        this.minHealth = 0;
        this.maxHealth = 128;
        this.enemyImages = [];
        this.tetradTypes = ['I', 'J', 'L', 'O', 'S', 'T', 'Z', 'GHOST', 'BLOCKED', 'BLACK'];
        this.enemyTypes = 3;
        this.tetradImages = [];
        this.attackImages = [];
        this.waypointImages = [];
        this.createEnemies();
        this.createTetradTiles();
        this.createAttackImages();
        this.createWaypointImages();
    }
    createEnemies() {
        for (var enemyTypeIndex = 0; enemyTypeIndex < this.enemyTypes; enemyTypeIndex++) {
            this.enemyImages[enemyTypeIndex] = [];
            var enemyImageArray = this.enemyImages[enemyTypeIndex];
            for (var healthIndex = this.minHealth; healthIndex < this.maxHealth; healthIndex++) {
                var imageName = "enemy" + enemyTypeIndex + "_" + healthIndex + this.imageFileExtension;
                var image = document.createElement('img');
                image.src = this.imagePath + imageName;
                enemyImageArray[healthIndex] = image;
            }
        }
    }
    createTetradTiles() {
        for (var index in this.tetradTypes) {
            var type = this.tetradTypes[index];
            var imageName = type + "_COLOR" + this.imageFileExtension;
            var image = document.createElement('img');
            image.src = this.imagePath + imageName;
            this.tetradImages[index] = image;
        }
    }
    createAttackImages() {
        for (var index in this.tetradTypes) {
            var type = this.tetradTypes[index];
            var imageName = type + "_COLOR_ATTACK" + this.imageFileExtension;
            var image = document.createElement('img');
            image.src = this.imagePath + imageName;
            this.attackImages[index] = image;
        }
    }
    createWaypointImages() {
        for (var i = 1; i < 100; i++) {
            var imageName = "waypoint_" + i + this.imageFileExtension;
            var image = document.createElement('img');
            image.src = this.imagePath + imageName;
            this.waypointImages[i] = image;
        }
    }
    getTetradImage(type) {
        return this.tetradImages[this.getTypeIndex(type.name)];
    }
    getTypeIndex(input) {
        var result = this.tetradTypes.indexOf(input);
        if (result == null) {
            throw "Invalid type index: " + input;
        }
        return result;
    }
    getGhostTetradImage() {
        return this.tetradImages[this.getTypeIndex('GHOST')];
    }
    getBlockedTetradImage() {
        return this.tetradImages[this.getTypeIndex('BLOCKED')];
    }
    getBlackTetradImage() {
        return this.tetradImages[this.getTypeIndex('BLACK')];
    }
    getEnemyImage(type, health) {
        health = Math.floor(health);
        if (health >= 128) {
            health = 127;
        }
        if (health < 0) {
            health = 0;
        }
        return this.enemyImages[type.id][health];
    }
    getAttackImage(attackType) {
        return this.attackImages[this.getTypeIndex(attackType.name)];
    }
    getWaypointImage(index) {
        return this.waypointImages[index];
    }
}
