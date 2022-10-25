import { Injectable } from '@angular/core';
import { collection, collectionData, doc, docData, Firestore, orderBy } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { query, where } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { Recipient } from '../models/recipient';

@Injectable({
  providedIn: 'root'
})
export class RecipientService {
  store: Firestore;
  storage: Storage;

  constructor(private _store: Firestore,
    private _storage: Storage) {
    this.store = _store;
    this.storage = _storage;
  }

  getRecipients(): Promise<Recipient[]> {
    return new Promise((resolve, rejects) => {
      let data = collection(this.store, 'recipients');
      let qry = query(data, where('active', "==", true));
      (collectionData(qry, { idField: 'id' }) as Observable<Recipient[]>).subscribe(
        recipients => resolve(recipients.sort(function (a, b) {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        })),
        err => rejects(err)
      );
    });
  }

  getRecipient(id: string): Observable<Recipient> {
    const data = doc(this.store, 'recipients/' + id);
    return docData(data, { idField: 'id' }) as Observable<Recipient>;
  }

}
