import { Util } from "./Util.js";
export class Controller {
    constructor(document) {
        var canvas = Util.checkType(document.getElementById("gameCanvas"), HTMLCanvasElement);
        canvas.addEventListener('mousemove', Controller.staticOnMouseMove);
        canvas.addEventListener('click', Controller.staticOnMouseClick);
        document.addEventListener('keydown', Controller.staticOnKeyPress);
        Controller.instance = this;
    }
    setLevel(level) {
        this.level = level;
    }
    static staticOnMouseMove(event) {
        Controller.instance.onMouseMove(event);
    }
    static staticOnMouseClick(event) {
        Controller.instance.onMouseClick(event);
    }
    static staticOnKeyPress(event) {
        Controller.instance.onKeyPress(event);
    }
    onMouseMove(event) {
        if (this.waitingForClick) {
            return;
        }
        this.rawMouseX = event.clientX;
        this.rawMouseY = event.clientY;
        this.level.updateGhostTetrad(this.rawMouseX, this.rawMouseY);
    }
    onMouseClick(event) {
        if (this.waitingForClick) {
            this.waitingForClick = false;
            return;
        }
        this.level.clearAndDrawStatic();
        this.level.tryPlaceTetrad(event.clientX, event.clientY);
    }
    onKeyPress(event) {
        if (this.waitingForClick) {
            return;
        }
        if (event.keyCode == Controller.SPACE_BAR_CODE) {
            this.level.tryRotateTetrad(this.rawMouseX, this.rawMouseY);
            event.preventDefault();
        }
    }
    setWaitForClick() {
        this.waitingForClick = true;
    }
    isWaitingForClick() {
        return this.waitingForClick;
    }
}
Controller.SPACE_BAR_CODE = 32;
