import { Injectable } from "@angular/core";
import { IPoint } from "../interfaces/point.interface";
import { PixiService } from "./pixi.service";

@Injectable({
  providedIn: "root"
})
export class GridService {
  // 2d array of point coords
  public grid: IPoint[][] = [];
  public itemLength: number;

  // The length of a single cell
  private distance: number;

  constructor(private pixi: PixiService) {}

  /**
   * Create a new grid system STARTS AT ZERO
   * @param rows Number of rows and columns for the grid (starts at zero)
   */
  public newGrid(rows): void {
    // The game is a 800 x 800 square, create a 2d array of point objects from 0 to rows
    const dist = 800 / rows;
    this.distance = dist;
    this.itemLength = dist - 4;

    for (let i = 0; i <= rows; i++) {
      this.grid[i] = [];

      for (let j = 0; j <= rows; j++) {
        const obj: IPoint = {
          x: i * dist,
          y: j * dist
        };

        this.grid[i][j] = obj;

        if (i === 5 && j === 5) {
        }
      }
    }
  }

  public getGridPosition(x, y): IPoint {
    if (x < 0) {
      x = 0;
    }
    if (y < 0) {
      y = 0;
    }
    if (x >= this.grid.length - 1) {
      x = this.grid.length - 2;
      console.log('yes');
    }
    if (y >= this.grid.length - 1) {
      y = this.grid.length - 2;
      console.log('yes');
    }
    return Object.assign({}, this.grid[x][y]);
  }

  public getCellCenter(point: IPoint, width: number) {
    return {
      x: point.x + ((this.distance / 2) - (width / 2)),
      y: point.y + ((this.distance / 2) - (width / 2))
    }
  }

  /**
   * Get the center of the grid
   */
  public getCenter(): IPoint {
    const obj: IPoint = {
      x: Math.floor((this.grid.length - 1) / 2),
      y: Math.floor((this.grid.length - 1) / 2)
    };
    obj.pixi = this.getGridPosition(obj.x, obj.y);
    return obj;
  }

  public getPointUp(fromPoint): IPoint {
    const toPoint = {
      x: fromPoint.x,
      y: fromPoint.y - 1,
      pixi: this.getGridPosition(fromPoint.x, fromPoint.y - 1)
    };
    return toPoint;
  }

  public getPointDown(fromPoint): IPoint {
    const toPoint = {
      x: fromPoint.x,
      y: fromPoint.y + 1,
      pixi: this.getGridPosition(fromPoint.x, fromPoint.y + 1)
    };
    return toPoint;
  }

  public getPointRight(fromPoint): IPoint {
    const toPoint = {
      x: fromPoint.x + 1,
      y: fromPoint.y,
      pixi: this.getGridPosition(fromPoint.x + 1, fromPoint.y)
    };
    return toPoint;
  }

  public getPointLeft(fromPoint): IPoint {
    const toPoint = {
      x: fromPoint.x - 1,
      y: fromPoint.y,
      pixi: this.getGridPosition(fromPoint.x - 1, fromPoint.y)
    };
    return toPoint;
  }

  public createTempGrid(): void {
    this.grid.forEach(gridArray => {
      gridArray.forEach(cell => {
        const rect = this.pixi.drawRectangle(24, 0x00ffff);
        rect.position = this.getCellCenter(cell, 24);
        this.pixi.addToEffectsLayer(rect);
      })
    })
  }
}
