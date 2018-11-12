import { PixiService } from "../pixi.service";
import { GridService } from "../grid.service";
import { IPoint } from "../../interfaces/point.interface";

export class BombManager {
  private bombs = [];

  constructor(private pixi: PixiService, private grid: GridService) {
    this.bombs = [];
  }

  public initBombs(goalPosition: IPoint): void {

    // How many bombs to create on grid? (15%)
    const numOfBombs = Math.ceil(
      this.grid.grid.length * this.grid.grid.length * 0.25
    );

    const getCoords = () => {
      const x = Math.floor(
        (Math.random() * 1000) % (this.grid.grid.length - 1)
      );
      const y = Math.floor(
        (Math.random() * 1000) % (this.grid.grid.length - 1)
      );

      if (x === playerPosition.x && y === playerPosition.y) {
        return getCoords();
      }

      if (x === goalPosition.x && y === goalPosition.y) {
        return getCoords();
      }

      if (this.detectCollision({ x: x, y: y })) {
        return getCoords();
      }

      return {
        x: x,
        y: y
      };
    };

    const playerPosition = this.grid.getCenter();

    for (var i = 0; i <= numOfBombs; i++) {
      let coords = getCoords();
      let gridCoords = this.grid.getGridPosition(coords.x, coords.y);
      const rect = this.pixi.drawRectangle(this.grid.itemLength, 0xff0000);
      rect.position = gridCoords;

      const obj = {
        x: coords.x,
        y: coords.y,
        pixi: gridCoords,
        rect: rect
      };

      this.bombs.push(obj);

      rect.alpha = .1;

      this.pixi.addToNpcLayer(rect);
    }
  }

  // Optimize this
  public detectCollision(point: IPoint) {
    let bool = false;

    if (this.bombs) {
      this.bombs.forEach(bomb => {
        if (point.x === bomb.x && point.y === bomb.y) {
          bool = true;
        }
      });
    }

    return bool;
  }
}
