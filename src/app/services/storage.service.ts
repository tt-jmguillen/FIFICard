import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  saveItems(items: any[]) {
    localStorage.setItem('FIBEIGREETINGS_ITEMS', JSON.stringify(items));
  }

  getItems(): any[]{
    if (localStorage.getItem('FIBEIGREETINGS_ITEMS') !== null) return JSON.parse(localStorage.getItem('FIBEIGREETINGS_ITEMS')!);
    else return [];
  }

  clearItems() {
    localStorage.removeItem('FIBEIGREETINGS_ITEMS');
  }
}
