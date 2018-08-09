import { Util } from "./Util.js";
import { AudioService } from "./AudioService.js";
import { TouchRecord } from "./TouchRecord.js";
export class Controller {
    constructor(document) {
        this.waitingForClickListeners = [];
        this.oldTouchRecord = null;
        this.isTouchScreen = false;
        var canvas = Util.checkType(document.getElementById("gameCanvas"), HTMLCanvasElement);
        canvas.addEventListener('mousemove', Controller.staticOnMouseMove);
        canvas.addEventListener('click', Controller.staticOnMouseClick);
        canvas.addEventListener('touchstart', Controller.staticOnScreenTouch);
        canvas.addEventListener('touchmove', Controller.staticOnTouchMove);
        document.addEventListener('keydown', Controller.staticOnKeyPress);
        this.registerHtmlFormElements(document);
        Controller.instance = this;
    }
    registerHtmlFormElements(document) {
        var soundOnRadio = Util.checkType(document.getElementById('soundOn'), HTMLInputElement);
        var soundOffRadio = Util.checkType(document.getElementById('soundOff'), HTMLInputElement);
        var musicOnRadio = Util.checkType(document.getElementById('musicOn'), HTMLInputElement);
        var musicOffRadio = Util.checkType(document.getElementById('musicOff'), HTMLInputElement);
        soundOnRadio.onclick = (() => AudioService.setSoundEffectsOn(true));
        soundOffRadio.onclick = (() => AudioService.setSoundEffectsOn(false));
        musicOnRadio.onclick = (() => AudioService.setMusicOn(true));
        musicOffRadio.onclick = (() => AudioService.setMusicOn(false));
        var radios = [soundOnRadio, soundOffRadio, musicOnRadio, musicOffRadio];
        for (var radio of radios) {
            if (radio.checked) {
                if (radio.onclick != null)
                    radio.onclick(new MouseEvent("null"));
            }
        }
        var rotateButton = Util.checkType(document.getElementById('rotate-button'), HTMLButtonElement);
        var undoButton = Util.checkType(document.getElementById('undo-button'), HTMLButtonElement);
        rotateButton.onclick = (() => this.level.tryRotateTetrad(this.ghostX, this.ghostY));
        undoButton.onclick = (() => this.level.undo());
    }
    static turnSoundOn(a, b) {
        return null;
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
    static staticOnScreenTouch(event) {
        Controller.instance.onScreenTouch(event);
    }
    static staticOnTouchMove(event) {
        Controller.instance.onTouchMove(event);
    }
    static staticOnKeyPress(event) {
        Controller.instance.onKeyPress(event);
    }
    onMouseMove(event) {
        if (this.waitingForClick || this.isTouchScreen) {
            return;
        }
        this.updateGhostPosition(event.clientX, event.clientY);
    }
    updateGhostPosition(x, y) {
        this.ghostX = x;
        this.ghostY = y;
        this.level.updateGhostTetrad(this.ghostX, this.ghostY);
    }
    onScreenTouch(event) {
        this.isTouchScreen = true;
        event.stopPropagation();
        if (this.waitingForClick) {
            this.stopWaitingForClick();
            return;
        }
        if (event.touches.length >= 3) {
            this.level.tryRotateTetrad(this.ghostX, this.ghostY);
            return;
        }
        if (event.changedTouches.length != 1) {
            return;
        }
        var touch = event.changedTouches.item(0);
        if (touch == null) {
            return;
        }
        var touchRecord = new TouchRecord(touch.clientX, touch.clientY);
        if (touchRecord.isInRangeOf(this.ghostX, this.ghostY)) {
            this.placeTetrad(this.ghostX, this.ghostY);
            this.oldTouchRecord = null;
            return;
        }
        this.updateGhostPosition(touch.clientX, touch.clientY);
    }
    onTouchMove(event) {
        if (event.changedTouches.length != 1) {
            return;
        }
        var touch = event.changedTouches.item(0);
        if (touch == null) {
            return;
        }
        this.updateGhostPosition(touch.clientX, touch.clientY);
    }
    onMouseClick(event) {
        if (this.isTouchScreen) {
            return;
        }
        if (this.waitingForClick) {
            this.stopWaitingForClick();
            return;
        }
        this.placeTetrad(event.clientX, event.clientY);
    }
    placeTetrad(x, y) {
        this.level.clearAndDrawStatic();
        this.level.tryPlaceTetrad(x, y);
    }
    onKeyPress(event) {
        if (this.waitingForClick) {
            return;
        }
        if (event.keyCode == Controller.SPACE_BAR_CODE) {
            this.level.tryRotateTetrad(this.ghostX, this.ghostY);
            event.preventDefault();
        }
        if (event.keyCode == Controller.Z_CODE) {
            this.level.undo();
            event.preventDefault();
        }
    }
    registerWaitingForClickListener(listener) {
        this.waitingForClickListeners.push(listener);
    }
    setWaitForClick() {
        this.waitingForClick = true;
    }
    isWaitingForClick() {
        return this.waitingForClick;
    }
    stopWaitingForClick() {
        for (var listener of this.waitingForClickListeners) {
            listener();
        }
        this.waitingForClick = false;
    }
}
Controller.Z_CODE = 90;
Controller.SPACE_BAR_CODE = 32;
