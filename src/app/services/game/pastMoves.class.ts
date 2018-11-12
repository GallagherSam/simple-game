import { PixiService } from "../pixi.service";
import { GridService } from "../grid.service";
import { IPoint } from "../../interfaces/point.interface";

export class PastMoves {
  public moves: IPoint[] = [];

  private moveSprites = [];

  constructor(private pixi: PixiService, private grid: GridService) {}

  public addMove(point: IPoint): void {
    this.moves.push(point);
  }

  public draw(): void {
    this.moves.splice(-1, 1);
    this.moves.forEach(move => {
      const rect = this.pixi.drawRectangle(25, 0xf0f0f0);
      rect.position = this.grid.getCellCenter(move.pixi, 25);
      this.pixi.addToNpcLayer(rect);
      this.moveSprites.push(rect);
    });
  }
}
