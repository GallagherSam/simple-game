import { PixiService } from "../pixi.service";
import { GridService } from "../grid.service";
import { IPoint } from "../../interfaces/point.interface";
import { Subject } from "rxjs";
import { IMoveEvent } from "../../interfaces/moveEvent.interface";

export class Player {
  public pixiCoords: IPoint;
  public move$: Subject<IMoveEvent> = new Subject();
  public isAnimating: boolean = false;
  public canAnimate: boolean = true;

  private pixiSprite;
  private deathText;
  private deathTextCoords;
  private numOfDeaths: number = 0;

  constructor(private pixi: PixiService, private grid: GridService) {
    this.initSprite();
    this.setupMovement();

    // Subscribe to own movement to update text
    this.move$.subscribe((move: IMoveEvent) => {

      setTimeout(() => {
        if (this.canAnimate) {
          this.pixi.animate(this.deathText, {x: 0, y: 0, pixi: this.deathTextCoords}, {x: 0, y: 0, pixi: this.grid.getCellCenter(move.to.pixi, 58)}, 18);
        }
      })

    })
  }

  public resetPosition(): void {
    ++this.numOfDeaths;
    this.pixiCoords = this.grid.getCenter();
    this.pixiSprite.position = this.pixiCoords.pixi;
    this.deathTextCoords = this.grid.getCellCenter(this.pixiCoords.pixi, 58);
    this.deathText.position = this.deathTextCoords;
    this.deathText.text = this.numOfDeaths;
  }

  private initSprite(): void {
    this.pixiSprite = this.pixi.drawRectangle(this.grid.itemLength, 0xffffff);
    this.pixiCoords = this.grid.getCenter();
    this.pixiSprite.position = this.pixiCoords.pixi;
    this.pixi.addToPlayerLayer(this.pixiSprite);

    // Death total text
    this.deathText = this.pixi.writeText(this.numOfDeaths, 58, 0x000000);
    this.deathTextCoords = this.grid.getCellCenter(this.pixiCoords.pixi, 58);
    this.deathText.position = this.deathTextCoords
    this.pixi.addToPlayerLayer(this.deathText);

  }

  // Movement

  private setupMovement(): void {
    document.addEventListener("keydown", e => {
      switch (e.code) {
        case "KeyW":
          this.moveUp();
          break;

        case "KeyS":
          this.moveDown();
          break;

        case "KeyD":
            this.moveRight();
            break;

        case "KeyA":
            this.moveLeft();
            break;

        default:
          break;
      }
    });
  }

  private moveUp(): void {
    this.pixi
      .animate(
        this.pixiSprite,
        this.pixiCoords,
        this.grid.getPointUp(this.pixiCoords),
        18,
        this
      )
      .then(() => {
        this.pixiCoords = this.grid.getPointUp(this.pixiCoords);
      })
      .catch(() => {});
  }

  private moveDown(): void {
    this.pixi
      .animate(
        this.pixiSprite,
        this.pixiCoords,
        this.grid.getPointDown(this.pixiCoords),
        18,
        this
      )
      .then(() => {
        this.pixiCoords = this.grid.getPointDown(this.pixiCoords);
      })
      .catch(() => {});
  }

  private moveLeft(): void {
    this.pixi
      .animate(
        this.pixiSprite,
        this.pixiCoords,
        this.grid.getPointLeft(this.pixiCoords),
        18,
        this
      )
      .then(() => {
        this.pixiCoords = this.grid.getPointLeft(this.pixiCoords);
      })
      .catch(() => {});
  }

  private moveRight(): void {
    this.pixi
      .animate(
        this.pixiSprite,
        this.pixiCoords,
        this.grid.getPointRight(this.pixiCoords),
        18,
        this
      )
      .then(() => {
        this.pixiCoords = this.grid.getPointRight(this.pixiCoords);
      })
      .catch(() => {});
  }
}
