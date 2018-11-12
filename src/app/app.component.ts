import { Component, OnInit, ViewChild } from '@angular/core';
import { PixiService } from './services/pixi.service';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'on death';

  @ViewChild("pixi") pixiContainer;

  constructor(private pixi: PixiService, private game: GameService) {}

  public ngOnInit() {
    this.pixi.initApp(this.pixiContainer);
    this.game.newGame();
    this.pixi.startTicker(this.game);
  }
}
