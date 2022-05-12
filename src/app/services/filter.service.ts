import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private budgetInfo: BehaviorSubject<string>;
  private sortInfo: BehaviorSubject<string>;

  constructor() { 
    this.budgetInfo = new BehaviorSubject<string>('');
    this.sortInfo = new BehaviorSubject<string>('');
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
