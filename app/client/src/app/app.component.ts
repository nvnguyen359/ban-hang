import { Component } from '@angular/core';
import { IpcService } from 'src/ipc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  
})
export class AppComponent {
  title = 'client';
  showFiller = false;
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  constructor(private readonly _ipc: IpcService) {
    this._ipc.on('upData', (event: Electron.IpcMessageEvent) => {
      console.log('pong');
    });

    this._ipc.send('ping');
  }
  openOrClose(){
    this.showFiller = !this.showFiller
  }
}
