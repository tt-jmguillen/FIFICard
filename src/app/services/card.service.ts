import { Injectable } from '@angular/core';
import { collection, collectionData, doc, docData, Firestore } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { query, where } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { Card } from '../models/card';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  store: Firestore;
  storage: Storage;

  constructor(private _store: Firestore,
    private _storage: Storage) { 
    this.store = _store;
    this.storage = _storage;
  }

  getCards(): Promise<Card[]>{
    return new Promise((resolve, rejects) => {
      let data = collection(this.store, 'cards');
      let qry = query(data, where('active', "==", true));
      (collectionData(qry, { idField: 'id' }) as Observable<Card[]>).subscribe(
        cards => resolve(cards),
        err => rejects(err)
      );
    });
  }

  getCard(id: string): Observable<Card>{
    const data = doc(this.store, 'cards/' + id);
    return docData(data, {idField: 'id'}) as Observable<Card>;
  }

  async getImageURL(path: string): Promise<string>{
    const fileRef = ref(this.storage, path);
    return getDownloadURL(fileRef)
  }
}
