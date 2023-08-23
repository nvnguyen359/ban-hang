import { Component } from '@angular/core';
import { IpcService } from 'src/ipc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client';
  constructor(private readonly _ipc: IpcService) {
    this._ipc.on('upData', (event: Electron.IpcMessageEvent) => {
      alert('ol')
      console.log('pong');
    });

    this._ipc.send('ping');
  }
}
