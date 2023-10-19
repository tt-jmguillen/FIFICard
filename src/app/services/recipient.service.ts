import { Injectable } from '@angular/core';
import { collection, doc, docData, Firestore, getDocsFromServer, onSnapshot, DocumentSnapshot } from '@angular/fire/firestore';
import { query, where } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { Recipient } from '../models/recipient';

@Injectable({
  providedIn: 'root'
})
export class RecipientService {
  store: Firestore;

  constructor(
    _store: Firestore
  ) {
    this.store = _store;
  }

  getRecipients(): Promise<Recipient[]> {
    return new Promise((resolve, rejects) => {
      const col = collection(this.store, 'recipients');
      const q = query(col, where('active', "==", true))
      getDocsFromServer(q).then(docs => {
        let recipients: Recipient[] = [];
        docs.forEach(doc => {
          let recipient: Recipient = doc.data() as Recipient;
          recipient.id = doc.id;
          recipients.push(recipient);
        });
        resolve(recipients.sort(function (a, b) {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        }));
      })
    });
  }

  getRecipient(id: string): Observable<Recipient> {
    return new Observable(subscribe => {
      onSnapshot(doc(this.store, 'recipients/' + id), (snap) => {
        if ((snap as DocumentSnapshot).data()) {
          let recipient = (snap as DocumentSnapshot).data() as Recipient;
          recipient.id = (snap as DocumentSnapshot).id;
          subscribe.next(recipient);
        } else {
          subscribe.next(undefined);
        }
      });
    })
  }

}
