import { Injectable } from "@angular/core";
import { IPoint } from "../interfaces/point.interface";

declare var PIXI: any;

@Injectable({
  providedIn: "root"
})
export class PixiService {
  public app;
  public scene;

  private effectsLayer;
  private npcLayer;
  private playerLayer;
  private menuLayer;

  constructor() {}

  public startTicker(game: any): void {
    requestAnimationFrame(this.startTicker.bind(this));
  }

  public initApp(elm: any): void {
    this.app = new PIXI.Application({
      width: 800,
      height: 800
    });
    this.app.renderer.backgroundColor = 0x0c142b;
    elm.nativeElement.appendChild(this.app.view);
    this.initContainers();
  }

  private initContainers() {
    // Create the scene and add the correct layers
    this.scene = new PIXI.Container();
    this.effectsLayer = new PIXI.Container();
    this.npcLayer = new PIXI.Container();
    this.playerLayer = new PIXI.Container();
    this.menuLayer = new PIXI.Container();

    this.scene.addChild(this.effectsLayer);
    this.scene.addChild(this.npcLayer);
    this.scene.addChild(this.playerLayer);
    this.scene.addChild(this.menuLayer);

    this.app.stage.addChild(this.scene);
  }

  public clearStage(): void {
    while (this.app.stage.children[0]) {
      this.app.stage.removeChild(this.app.stage.children[0]);
    }
    this.initContainers();
  }

  /**
   * Use PIXI to draw a rectangle to the board
   * @param width Width in px
   * @param color Color in Hex (0xFFFFFF)
   */
  public drawRectangle(width, color): any {
    const rect = new PIXI.Graphics();
    rect.beginFill(color, 1);
    rect.drawRect(0, 0, width, width);
    return rect;
  }

  public writeText(text, fontSize, fill) {
    return new PIXI.Text(text, {
      fontFamily: "Arial",
      fontSize: fontSize,
      align: "center",
      fill: fill
    });
  }

  public addToEffectsLayer(item): void {
    this.effectsLayer.addChild(item);
  }

  public addToNpcLayer(item): void {
    this.npcLayer.addChild(item);
  }

  public addToPlayerLayer(item): void {
    this.playerLayer.addChild(item);
  }

  public addToMenuLayer(item): void {
    this.menuLayer.addChild(item);
  }

  public animate(
    sprite: any,
    fromPoint: IPoint,
    toPoint: IPoint,
    speed: number,
    elm?: any
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const animateFunc = (): Promise<any> => {
        return new Promise(res => {
          const diffPoint = {
            x: toPoint.pixi.x - fromPoint.pixi.x,
            y: toPoint.pixi.y - fromPoint.pixi.y
          };
          let currentPoint = fromPoint;
          let i = 0;
          const interval = setInterval(() => {
            currentPoint.pixi.x += diffPoint.x / speed;
            currentPoint.pixi.y += diffPoint.y / speed;

            sprite.position = currentPoint.pixi;

            ++i;
            if (i === speed) {
              clearInterval(interval);
              res();
            }
          }, 16);
        });
      };

      if (elm) {
        elm.move$.next({ from: fromPoint, to: toPoint });
        if (!elm.isAnimating && elm.canAnimate) {
          elm.isAnimating = true;
          animateFunc().then(() => {
            elm.isAnimating = false;
            resolve();
          });
        } else {
          reject();
        }
      } else {
        animateFunc().then(() => {
          resolve();
        });
      }
    });
  }
}
