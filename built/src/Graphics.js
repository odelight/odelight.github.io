import { black, red } from "./Color.js";
export class Graphics {
    constructor(ctx, canvasWidth, canvasHeight, tileWidth, tileHeight) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
    drawTetrad(tetrad, xPosition, yPosition, colorOverride) {
        var color = tetrad.color;
        if (!(colorOverride === null || typeof colorOverride === "undefined")) {
            color = colorOverride;
        }
        this.drawSquareList(xPosition, yPosition, color, tetrad.offsetList, null, null);
    }
    drawSquareList(xPosition, yPosition, defaultColor, offsetList, fillColor, boundaryColor) {
        if (boundaryColor === null || typeof boundaryColor === "undefined") {
            boundaryColor = black;
        }
        if (fillColor === null || typeof fillColor === "undefined") {
            fillColor = defaultColor;
        }
        for (var i = 0; i < offsetList.length; i++) {
            this.drawSquare(xPosition + offsetList[i].xOffset, yPosition + offsetList[i].yOffset, fillColor, boundaryColor);
        }
    }
    //xPosition and yPosition are wrt tiles.
    drawSquare(xPosition, yPosition, fillColor, boundaryColor) {
        this.ctx.beginPath();
        if (fillColor != null && typeof fillColor !== "undefined") {
            this.ctx.fillStyle = fillColor.colorString;
            this.ctx.fillRect(xPosition * this.tileWidth, yPosition * this.tileHeight, this.tileWidth, this.tileHeight);
            this.ctx.stroke();
        }
        if (boundaryColor === null || typeof boundaryColor === "undefined") {
            boundaryColor = black;
        }
        this.ctx.strokeStyle = boundaryColor.colorString;
        this.ctx.rect(xPosition * this.tileWidth, yPosition * this.tileHeight, this.tileWidth, this.tileHeight);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    drawEnemies(enemyList) {
        if (enemyList == null) {
            return;
        }
        for (var i = 0; i < enemyList.length; i++) {
            this.drawEnemy(enemyList[i]);
        }
    }
    drawEnemy(enemy) {
        var healthPercent = enemy.hp / enemy.maxHp;
        var x = enemy.pathing.position.x;
        var y = enemy.pathing.position.y;
        this.ctx.strokeStyle = "rgb(" + 255 * (1 - healthPercent) + "," + 255 * healthPercent + ",0)";
        this.ctx.fillStyle = "rgb(" + 255 * (1 - healthPercent) + "," + 255 * healthPercent + ",0)";
        this.ctx.beginPath();
        this.ctx.moveTo(x - 17, y - 7);
        this.ctx.lineTo(x + 17, y - 7);
        this.ctx.lineTo(x, y + 13);
        this.ctx.closePath();
        this.ctx.fill();
    }
    drawAttacks(attackList) {
        while (attackList.length > 0) {
            var attack = attackList.pop();
            if (attack == null) {
                throw "attack should not be null / undefined";
            }
            this.drawAttack(attack.attackingTetrad, attack.target);
        }
    }
    drawAttack(attackingTetrad, enemyPos) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#ff0000";
        var tetradFireFromX = (attackingTetrad.position.x + attackingTetrad.type.centerX) * this.tileWidth + (this.tileWidth / 2);
        var tetradFireFromY = (attackingTetrad.position.y + attackingTetrad.type.centerY) * this.tileHeight + (this.tileHeight / 2);
        this.ctx.moveTo(tetradFireFromX, tetradFireFromY);
        this.ctx.lineTo(enemyPos.x, enemyPos.y);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    drawPath(path) {
        if (path == null) {
            this.drawSquare(0, 0, red, red);
            return;
        }
        this.ctx.strokeStyle = "#ff0000";
        this.ctx.beginPath();
        for (var i = 0; i < path.length - 1; i++) {
            this.ctx.moveTo(path[i].x * this.tileWidth + (this.tileWidth / 2), path[i].y * this.tileHeight + (this.tileHeight / 2));
            this.ctx.lineTo(path[i + 1].x * this.tileWidth + (this.tileWidth / 2), path[i + 1].y * this.tileHeight + (this.tileHeight / 2));
        }
        this.ctx.stroke();
        this.ctx.closePath();
    }
    drawTimer(fractionLeft, centerX, centerY, radius) {
        var percent = 100 * fractionLeft;
        var pi = 3.1415;
        this.ctx.strokeStyle = "#0000ff88";
        this.ctx.fillStyle = "#0000ff88";
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        for (var i = 0; i < percent; i++) {
            var theta = i * (2 * pi) / 100;
            this.ctx.lineTo(centerX + radius * Math.cos(theta), centerY + radius * Math.sin(theta));
        }
        this.ctx.lineTo(centerX, centerY);
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.fill();
    }
    drawLives(numLives, fontSize, xPos, yPos) {
        this.ctx.font = fontSize + "px Arial";
        this.ctx.fillText("lives: " + numLives, xPos, yPos);
    }
}
