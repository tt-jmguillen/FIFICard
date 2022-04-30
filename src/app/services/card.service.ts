import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, collectionData, doc, docData, Firestore, Timestamp, updateDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { query, where } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { Card } from '../models/card';
import { Rating } from '../models/rating';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  store: Firestore;
  storage: Storage;
  db: AngularFirestore;

  constructor(
    private _store: Firestore,
    private _storage: Storage,
    private _db: AngularFirestore) {
    this.store = _store;
    this.storage = _storage;
    this.db = _db;
  }

  getCards(): Promise<Card[]> {
    return new Promise((resolve, rejects) => {
      let data = collection(this.store, 'cards');
      let qry = query(data, where('active', "==", true));
      (collectionData(qry, { idField: 'id' }) as Observable<Card[]>).subscribe(
        cards => resolve(cards),
        err => rejects(err)
      );
    });
  }

  getCard(id: string): Observable<Card> {
    const data = doc(this.store, 'cards/' + id);
    return docData(data, { idField: 'id' }) as Observable<Card>;
  }

  async getRatings(id: string): Promise<Rating[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('cards').doc(id).collection('ratings', ref => ref.orderBy('created', 'desc')).get().subscribe(data => {
        if (!data.empty) {
          let ratings: Rating[] = [];
          data.forEach(doc => {
            //console.log(doc.data()["date"].toDate());
            let rating: Rating = doc.data() as Rating;
            rating.id = doc.id;
            rating.date = doc.data()["date"].toDate();
            ratings.push(rating);
          });
          resolve(ratings);
        }
        else {
          rejects("No ratings found.");
        }
      });
    });
  }

  async getImageURL(path: string): Promise<string> {
    const fileRef = ref(this.storage, path);
    return getDownloadURL(fileRef)
  }

  async addRating(id: string, rating: Rating): Promise<string> {
    console.log("AddRating id: " + id);
    console.log("AddRating rating: " + JSON.stringify(rating));
    return new Promise(resolve => {
      this.db.collection('cards').doc(id).collection('ratings').add({
        date: Timestamp.now(),
        username: rating.username,
        rate: rating.rate,
        title: rating.title,
        review: rating.review,
        approve: false,
        created: Timestamp.now()
      }).then(data => {
        resolve(data.id);
      })
    });
  }

  updateFavorite(cardId: string, favorites: string[]){
    const data = doc(this.store, 'cards/' + cardId);
    updateDoc(data, {
      'favorites': favorites
    });
  }

}
