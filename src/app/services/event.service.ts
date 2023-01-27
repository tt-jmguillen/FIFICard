import { Injectable } from '@angular/core';
import { collection, collectionData, doc, docData, Firestore, orderBy, where } from '@angular/fire/firestore';
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

  getById(id: string): Promise<Event> {
    return new Promise((resolve) => {
      const data = doc(this.store, 'events/' + id);
      (docData(data, { idField: 'id' }) as Observable<Event>).subscribe(event => {
        resolve(event);
      });
    });
  }

  getByName(event: string): Promise<Event[]> {
    return new Promise((resolve, rejects) => {
      let data = collection(this.store, 'events');
      let qry = query(data, where('name', '==', event));
      (collectionData(qry, { idField: 'id' }) as Observable<Event[]>).subscribe(
        events => resolve(events),
        err => rejects(err)
      );
    });
  }

  getEvents(): Promise<Event[]> {
    return new Promise((resolve, rejects) => {
      let data = collection(this.store, 'events');
      let qry = query(data, orderBy('name', 'asc'));
      (collectionData(qry, { idField: 'id' }) as Observable<Event[]>).subscribe(
        events => resolve(events),
        err => rejects(err)
      );
    });
  }

  getEventCard(): Promise<Event[]> {
    return new Promise((resolve, rejects) => {
      this.getEvents().then(events => {
        resolve(events.filter(x => x.active! == true).filter(x => x.isGift! == false).filter(x => x.isSticker! == false).filter(x => x.isSignAndSend! == false).filter(x => (x.isPostcard! ? x.isPostcard : false) == false));
      })
    })
  }

  getEventGift(): Promise<Event[]> {
    return new Promise((resolve, rejects) => {
      let gifts: Event[] = [];
      this.getEvents().then(events => {
        events.forEach(event => {
          if (event.isGift && event.active) {
            gifts.push(event);
          }
        })
        resolve(gifts);
      })
    })
  }

  getEventCreation(): Promise<Event[]> {
    return new Promise((resolve, rejects) => {
      let creations: Event[] = [];
      this.getEvents().then(events => {
        events.forEach(event => {
          if (event.isCreations && event.active) {
            creations.push(event);
          }
        })
        resolve(creations);
      })
    })
  }

  getEventSticker(): Promise<Event[]> {
    return new Promise((resolve, rejects) => {
      let stickers: Event[] = [];
      this.getEvents().then(events => {
        events.forEach(event => {
          if (event.isSticker && event.active) {
            stickers.push(event);
          }
        })
        resolve(stickers);
      })
    })
  }

  getEventSignAndSend(): Promise<Event[]> {
    return new Promise((resolve, rejects) => {
      this.getEvents().then(events => {
        resolve(events.filter(x => x.active! == true).filter(x => x.isSignAndSend! == true));
      })
    })
  }

  getByTag(tag: string): Promise<Event[]> {
    return new Promise((resolve, rejects) => {
      let data = collection(this.store, 'events');
      let qry = query(data, where('tag', '==', tag), where('active', '==', true));
      (collectionData(qry, { idField: 'id' }) as Observable<Event[]>).subscribe(
        events => resolve(events),
        err => rejects(err)
      );
    });
  }
}
