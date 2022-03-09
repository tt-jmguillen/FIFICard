import { Injectable } from '@angular/core';
import { collection, collectionData, Firestore, orderBy } from '@angular/fire/firestore';
import { query } from '@firebase/firestore';
import { Observable } from 'rxjs';


import { Event } from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  store: Firestore;

  constructor(
    private _store: Firestore
  ) { 
    this.store = _store;
  }

  getEvents(): Promise<Event[]>{
    return new Promise((resolve, rejects) => {
      let data = collection(this.store, 'events');
      let qry = query(data, orderBy('name', 'asc'));
      (collectionData(qry, { idField: 'id' }) as Observable<Event[]>).subscribe(
        events => resolve(events),
        err => rejects(err)
      );
    });
  }

  getEventNonGift(): Promise<Event[]>{
    return new Promise((resolve, rejects) => {
      let nonGifts: Event[] = [];
      this.getEvents().then(events => {
        events.forEach(event => {
          if (!event.isGift){
            nonGifts.push(event);
          }
        })
        resolve(nonGifts);
      })
    })
  }

  getEventGift(): Promise<Event[]>{
    return new Promise((resolve, rejects) => {
      let gifts: Event[] = [];
      this.getEvents().then(events => {
        events.forEach(event => {
          if (event.isGift){
            gifts.push(event);
          }
        })
        resolve(gifts);
      })
    })
  }
}
