import { PixiService } from "../pixi.service";
import { GridService } from "../grid.service";
import { IPoint } from "../../interfaces/point.interface";

export class Goal {
  private pixiSprite;
  public pixiCoords;

  constructor(private pixi: PixiService, private grid: GridService) {}

  public initSprite(playerPoint: IPoint): void {
    this.pixiSprite = this.pixi.drawRectangle(this.grid.itemLength, 0x84e296);

    const getCoords = () => {
      const x = Math.floor(
        (Math.random() * 1000) % (this.grid.grid.length - 1)
      );
      const y = Math.floor(
        (Math.random() * 1000) % (this.grid.grid.length - 1)
      );

      if (
        x === playerPoint.x ||
        x === playerPoint.x - 1 ||
        x === playerPoint.x + 1
      ) {
        return getCoords();
      }

      if (
        y === playerPoint.y ||
        y === playerPoint.y - 1 ||
        y === playerPoint.y + 1
      ) {
        return getCoords();
      }

      return {
        x: x,
        y: y
      };
    };

    this.pixiCoords = getCoords();
    this.pixiCoords.pixi = this.grid.getGridPosition(
      this.pixiCoords.x,
      this.pixiCoords.y
    );
    this.pixiSprite.position = this.pixiCoords.pixi;

    this.pixi.addToNpcLayer(this.pixiSprite);
  }

  public detectCollision(point: IPoint) {
    if (point.x === this.pixiCoords.x && point.y === this.pixiCoords.y) {
      return true;
    } else {
      return false;
    }
  }
}
