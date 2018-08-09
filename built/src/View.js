import { black, grey } from "./Color.js";
import { ViewImageFileManager } from "./ViewImageFileManager.js";
import { AttackView } from "./AttackView.js";
import { PixelPoint } from "./PixelPoint.js";
export class View {
    constructor(ctx, boardWidth, boardHeight, tileWidth, tileHeight, displayRegionWidth) {
        this.attackViews = [];
        this.ctx = ctx;
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.canvasWidth = boardWidth * tileWidth + displayRegionWidth;
        this.canvasHeight = boardHeight * tileHeight;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.displayRegionWidth = displayRegionWidth;
        this.imageFileManager = new ViewImageFileManager();
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawDisplayRegionDivider();
        this.drawGrid();
    }
    drawDisplayRegionDivider() {
        this.ctx.strokeStyle = black.colorString;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(this.boardWidth * this.tileWidth + 0.5, 0);
        this.ctx.lineTo(this.boardWidth * this.tileWidth + 0.5, this.canvasHeight);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    drawGrid() {
        this.ctx.strokeStyle = grey.colorString;
        this.ctx.lineWidth = 1;
        for (var i = 1; i < this.boardWidth; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.tileWidth, 0);
            this.ctx.lineTo(i * this.tileWidth, this.boardHeight * this.tileHeight);
            this.ctx.stroke();
        }
        for (var i = 1; i < this.boardHeight; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.tileHeight);
            this.ctx.lineTo(this.boardWidth * this.tileWidth, i * this.tileHeight);
            this.ctx.stroke();
        }
    }
    drawUpcomingTetrads(comingTetrads) {
        for (var i = 0; i < comingTetrads.length; i++) {
            var xPosition = (this.boardWidth + (i % 2 == 0 ? 1 : 5));
            var yPosition = (4 + 5 * (Math.floor(i / 2)));
            this.drawTetrad(comingTetrads[i], xPosition, yPosition, false, true);
        }
    }
    drawTetrad(tetrad, xPosition, yPosition, isGhost = false, isLegal = true, waitingOnTimer = false) {
        var tile;
        this.ctx.save();
        if (waitingOnTimer) {
            this.ctx.globalAlpha = 0.5;
        }
        if (isGhost) {
            if (isLegal) {
                tile = this.imageFileManager.getGhostTetradImage();
            }
            else {
                tile = this.imageFileManager.getBlockedTetradImage();
            }
        }
        else {
            tile = this.imageFileManager.getTetradImage(tetrad);
        }
        this.drawSquareList(xPosition, yPosition, tile, tetrad.offsetList);
        this.ctx.restore();
    }
    drawSquareList(xPosition, yPosition, tile, offsetList) {
        for (var i = 0; i < offsetList.length; i++) {
            this.drawSquare(xPosition + offsetList[i].x, yPosition + offsetList[i].y, tile);
        }
    }
    drawBlockedSpaces(blackPoints) {
        for (var i = 0; i < blackPoints.length; i++) {
            this.drawBlockedSpace(blackPoints[i].x, blackPoints[i].y);
        }
    }
    drawBlockedSpace(xPosition, yPosition) {
        this.drawSquare(xPosition, yPosition, this.imageFileManager.getBlackTetradImage());
    }
    //xPosition and yPosition are wrt tiles.
    drawSquare(xPosition, yPosition, tile) {
        this.ctx.drawImage(tile, xPosition * this.tileWidth, yPosition * this.tileHeight);
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
        var health_128 = 128 * (enemy.hp / enemy.maxHp);
        var x = enemy.pathing.pixelPosition.x;
        var y = enemy.pathing.pixelPosition.y;
        var image = this.imageFileManager.getEnemyImage(enemy.type, health_128);
        this.ctx.drawImage(image, x - (image.width / 2), y - (image.height / 2));
    }
    drawAttacks(attackList) {
        while (attackList.length > 0) {
            var attack = attackList.pop();
            if (attack == null) {
                throw "attack should not be null / undefined";
            }
            var attackFrom = this.getTetradFirePosition(attack.attackingTetrad);
            var attackImage = this.imageFileManager.getAttackImage(attack.attackingTetrad.type);
            this.attackViews.push(new AttackView(attackFrom, attack.target, attackImage, 20));
        }
        this.attackViews.filter(view => view.renderAndUpdate(this.ctx));
    }
    getTetradFirePosition(attackingTetrad) {
        var tetradFireFromX = (attackingTetrad.position.x + attackingTetrad.type.centerX) * this.tileWidth + (this.tileWidth / 2);
        var tetradFireFromY = (attackingTetrad.position.y + attackingTetrad.type.centerY) * this.tileHeight + (this.tileHeight / 2);
        return new PixelPoint(tetradFireFromX, tetradFireFromY);
    }
    drawPath(path, wayPoints = []) {
        if (path == null) {
            throw "Path is null!";
        }
        this.ctx.strokeStyle = "#ff0000";
        this.ctx.beginPath();
        for (var i = 0; i < path.length - 1; i++) {
            this.ctx.moveTo(path[i].x * this.tileWidth + (this.tileWidth / 2), path[i].y * this.tileHeight + (this.tileHeight / 2));
            this.ctx.lineTo(path[i + 1].x * this.tileWidth + (this.tileWidth / 2), path[i + 1].y * this.tileHeight + (this.tileHeight / 2));
        }
        this.ctx.stroke();
        this.ctx.closePath();
        for (var i = 0; i < wayPoints.length; i++) {
            this.drawWaypoint(wayPoints[i], i + 1);
        }
    }
    drawWaypoint(position, index) {
        this.drawSquare(position.x, position.y, this.imageFileManager.getWaypointImage(index));
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
    drawNonVisibleComingTetradCount(numTetrads, fontSize, xPos, yPos) {
        this.ctx.font = fontSize + "px Arial";
        this.ctx.fillText("(... And " + numTetrads + " more)", xPos, yPos);
    }
    intermediateScreen(displayString) {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx.font = 36 + "px Arial";
        this.ctx.fillText(displayString, 20, this.canvasHeight / 2);
    }
}
