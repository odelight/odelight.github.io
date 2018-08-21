export class TetradPlacement {
    constructor(placement, othersInCombo = [], megaTetrad = null) {
        this.placement = placement;
        this.othersInCombo = othersInCombo;
        this.megaTetrad = megaTetrad;
        this.causedCombo = megaTetrad != null;
    }
    undo(level) {
        if (this.causedCombo) {
            if (this.megaTetrad == null) {
                throw "TetradPlacement : undo, claims caused combo but megaTetrad null";
            }
            level.removeTetrad(this.megaTetrad);
            for (var tetrad of this.othersInCombo) {
                level.pushTetrad(tetrad, true);
            }
        }
        else {
            level.removeTetrad(this.placement);
        }
    }
}
