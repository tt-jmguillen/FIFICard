import { updateDoc } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Translation } from '../models/translation';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  db: AngularFirestore;

  constructor(
    private _db: AngularFirestore
  ) { 
    this.db = _db;
  }

  getTranslation(id: string, type: string): Promise<Translation>{
    return new Promise((resolve, rejects) => {
      this.db.collection('translations').doc(id).get().subscribe(doc => {
        if (doc.exists){
          let data: any = doc.data();
          resolve(data['translated'][type] as Translation);
        }
        else{
          rejects('not found');
        }
      });
    });
  }

  addTranslation(id: string, type: string, value: string): Promise<void>{
    return this.db.collection('translations').doc(id).set({
      'input': {
        'description': value
      }
    });
  }
}
