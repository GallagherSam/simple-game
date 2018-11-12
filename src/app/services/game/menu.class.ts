import { PixiService } from "../pixi.service";
import { GridService } from "../grid.service";

export class Menu {
    constructor(private pixi: PixiService, private grid: GridService) { }

    public displayWin(): void {
        const text = this.pixi.writeText("You Win!", 80, 0xffffff);
        text.position = {x: 400, y: 400};
        this.pixi.addToMenuLayer(text);
    }
}