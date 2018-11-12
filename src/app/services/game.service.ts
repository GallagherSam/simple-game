import { Injectable } from "@angular/core";
import { PixiService } from "./pixi.service";
import { GridService } from "./grid.service";
import { IPoint } from "../interfaces/point.interface";
import { IBomb } from "../interfaces/bomb.interface";
import { Player } from "./game/player.class";
import { IMoveEvent } from "../interfaces/moveEvent.interface";
import { Goal } from "./game/goal.class";
import { BombManager } from "./game/bomManager.class";
import { PastMoves } from "./game/pastMoves.class";
import { Menu } from "./game/menu.class";

@Injectable({
  providedIn: "root"
})
export class GameService {
  
  private player;
  private pastMoves;
  private goal;
  private bombManager;
  private menu;

  private gridSize: number = 13;
  private firstRun: boolean = true;

  constructor(private pixi: PixiService, private grid: GridService) {
    this.menu = new Menu(this.pixi, this.grid);
  }

  /**
   * Start a new game
   */
  public newGame(): void {

    this.grid.newGrid(this.gridSize);

    // this.grid.createTempGrid();

    this.player = new Player(this.pixi, this.grid);

    this.pastMoves = new PastMoves(this.pixi, this.grid);

    this.goal = new Goal(this.pixi, this.grid);
    this.goal.initSprite(this.player.pixiCoords);

    this.bombManager = new BombManager(this.pixi, this.grid);
    this.bombManager.initBombs(this.goal.pixiCoords);

    if (this.firstRun) {
      this.setupEvents();
    }
    this.firstRun = false;
  }

  public setupEvents(): void {

    // Player
    this.player.move$.subscribe((data: IMoveEvent) => {
      this.pastMoves.addMove(data.to);
      if (this.bombManager.detectCollision(data.to)) {
        this.player.canAnimate = false;
        // Need to reset the game
        this.player.resetPosition();
        // Draw past moves
        this.pastMoves.draw();
        setTimeout(() => {
          this.player.canAnimate = true;
        });
      } if (this.goal.detectCollision(data.to)) {
        console.log("WIN");
        this.menu.displayWin();
      }
    });

  }
}
