import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DbService {
db: any
  constructor() { }
  getAll(){

  }
}
declare global {
  interface Window {
    api?: any;
  }
}