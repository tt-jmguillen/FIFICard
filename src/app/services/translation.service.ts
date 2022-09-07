import { doc, docData, Firestore, updateDoc } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Translation } from '../models/translation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  store: Firestore;
  db: AngularFirestore;

  constructor(
    private _store: Firestore,
    private _db: AngularFirestore
  ) { 
    this.store = _store;
    this.db = _db;
  }

  subscribeTranslation(id: string): Observable<any> {
    const data = doc(this.store, 'translations/' + id);
    return docData(data, { idField: 'id' }) as Observable<any>;
  }

  getTranslation(id: string): Promise<Translation>{
    return new Promise((resolve, rejects) => {
      this.db.collection('translations').doc(id).get().subscribe(doc => {
        if (doc.exists){
          let data: any = doc.data();
          resolve(data['translated']['description'] as Translation);
        }
        else{
          rejects('not found');
        }
      });
    });
  }

  addTranslation(id: string, value: string): Promise<void>{
    return this.db.collection('translations').doc(id).set({
      'input': {
        'description': value
      }
    });
  }

  updateTranslation(id: string, value: string): Promise<void>{
    return this.db.collection('translations').doc(id).update({
      'input': {
        'description': value
      }
    });
  }
}
