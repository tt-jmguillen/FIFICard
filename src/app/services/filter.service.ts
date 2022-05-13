import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private searchInfo: BehaviorSubject<string>;
  private budgetInfo: BehaviorSubject<string>;
  private sortInfo: BehaviorSubject<string>;

  constructor() { 
    this.searchInfo = new BehaviorSubject<string>('');
    this.budgetInfo = new BehaviorSubject<string>('');
    this.sortInfo = new BehaviorSubject<string>('');
  }

  getSearch(): Observable<string> {
    return this.searchInfo.asObservable();
  }

  setSearch(newValue: string): void {
    this.searchInfo.next(newValue);
  }

  getBudget(): Observable<string> {
    return this.budgetInfo.asObservable();
  }

  setBudget(newValue: string): void {
    this.budgetInfo.next(newValue);
  }

  getSort(): Observable<string> {
    return this.sortInfo.asObservable();
  }

  setSort(newValue: string): void {
    this.sortInfo.next(newValue);
  }
}
