import { Component } from '@angular/core';
import { IpcService } from 'src/ipc.service';
import { ApiService } from './services/api.service';
import { PrinterModel } from './Models/printer';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  
})
export class AppComponent {
  title = 'client';
  showFiller = false;
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  printers!: any;
  pageSizes: string[] =['A4','A5','A6','A7'];
  constructor(
    private readonly apiService: ApiService
  ) {
   
  }
}
