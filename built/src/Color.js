export class Color {
    constructor(colorString) {
        this.colorString = colorString;
    }
}
export var black = new Color("#000000");
export var red = new Color("#ff0000");
export var grey = new Color("rgba(128, 128, 128, 0.25)");
export var redGhostColor = new Color("rgba(128, 0, 0, 1)");
