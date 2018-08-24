export class ViewImageFileManager {
    constructor() {
        this.imagePath = "resources/graphics/";
        this.hintPath = "resources/hintGraphics/";
        this.imageFileExtension = ".png";
        this.minHealth = 0;
        this.maxHealth = 128;
        this.enemyImages = [];
        this.tetradTypes = ['I', 'J', 'L', 'O', 'S', 'T', 'Z', 'GHOST', 'BLOCKED', 'BLACK'];
        this.enemyTypes = 3;
        this.tetradImages = [];
        this.attackImages = [];
        this.waypointImages = [];
        this.hintImages = [];
        this.IMAGE_DIMENSION = '20';
        this.BIG_IMAGE_DIMENSION = '40';
        this.createHintImages();
        this.createTetradTiles();
        this.createWaypointImages();
        this.createEnemies();
        this.createAttackImages();
    }
    createEnemies() {
        for (var enemyTypeIndex = 0; enemyTypeIndex < this.enemyTypes; enemyTypeIndex++) {
            this.enemyImages[enemyTypeIndex] = [];
            var enemyImageArray = this.enemyImages[enemyTypeIndex];
            for (var healthIndex = this.minHealth; healthIndex < this.maxHealth; healthIndex++) {
                var imageName = "enemy" + enemyTypeIndex + "_" + healthIndex + "_" + this.IMAGE_DIMENSION + this.imageFileExtension;
                var image = document.createElement('img');
                image.src = this.imagePath + imageName;
                enemyImageArray[healthIndex] = image;
            }
        }
    }
    createTetradTiles() {
        for (var dimensionIndex = 0; dimensionIndex < 2; dimensionIndex++) {
            var dimension = dimensionIndex == 0 ? this.IMAGE_DIMENSION : this.BIG_IMAGE_DIMENSION;
            this.tetradImages[dimensionIndex] = [];
            for (var index in this.tetradTypes) {
                var type = this.tetradTypes[index];
                var imageName = type + "_COLOR" + "_" + dimension + this.imageFileExtension;
                var image = document.createElement('img');
                image.src = this.imagePath + imageName;
                this.tetradImages[dimensionIndex][index] = image;
            }
        }
    }
    createAttackImages() {
        for (var index in this.tetradTypes) {
            var type = this.tetradTypes[index];
            var imageName = type + "_COLOR_ATTACK" + "_" + this.IMAGE_DIMENSION + this.imageFileExtension;
            var image = document.createElement('img');
            image.src = this.imagePath + imageName;
            this.attackImages[index] = image;
        }
    }
    createWaypointImages() {
        for (var i = 1; i < 99; i++) {
            var imageName = "waypoint_" + i + "_" + this.IMAGE_DIMENSION + this.imageFileExtension;
            var image = document.createElement('img');
            image.src = this.imagePath + imageName;
            this.waypointImages[i] = image;
        }
    }
    createHintImages() {
        for (var i = 0; i < 3; i++) {
            var imageName = "hint" + i + this.imageFileExtension;
            var image = document.createElement('img');
            image.src = this.hintPath + imageName;
            this.hintImages[i] = image;
        }
    }
    getTetradImage(type) {
        return this.tetradImages[type.isBig ? 1 : 0][this.getTypeIndex(type.name)];
    }
    getTypeIndex(input) {
        var result = this.tetradTypes.indexOf(input);
        if (result == null) {
            throw "Invalid type index: " + input;
        }
        return result;
    }
    getGhostTetradImage() {
        return this.tetradImages[0][this.getTypeIndex('GHOST')];
    }
    getBlockedTetradImage() {
        return this.tetradImages[0][this.getTypeIndex('BLOCKED')];
    }
    getBlackTetradImage() {
        return this.tetradImages[0][this.getTypeIndex('BLACK')];
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
    getHintImage(index) {
        return this.hintImages[index];
    }
}
