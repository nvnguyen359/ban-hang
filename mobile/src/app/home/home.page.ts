import { Component } from '@angular/core';
import { DbService } from '../service/db.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private service:DbService) {
    service.getAll()
  }

}
