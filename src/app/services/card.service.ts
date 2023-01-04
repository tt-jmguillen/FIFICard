import { environment } from 'src/environments/environment';
import { CardImage } from './../models/card-image';
import { SignAndSend } from './../models/sign-and-send';
import { Injectable, Query } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, collectionData, doc, docData, Firestore, orderBy, QueryConstraint, Timestamp, updateDoc, where } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { query } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { Card } from '../models/card';
import { Rating } from '../models/rating';
import { Bundle } from '../models/bundle';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  store: Firestore;
  storage: Storage;
  db: AngularFirestore;
  temp: any;

  constructor(
    private _store: Firestore,
    private _storage: Storage,
    private _db: AngularFirestore) {
    this.store = _store;
    this.storage = _storage;
    this.db = _db;
  }

  getBestsellerCards(): Promise<Card[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('cards', ref => ref
        .where('active', "==", true)
        .where('bestseller', "==", true)
      ).get().subscribe(data => {
        if (!data.empty) {
          let cards: Card[] = [];
          data.forEach(doc => {
            let card: Card = doc.data() as Card;
            card.id = doc.id;
            cards.push(card);

          });
          cards = cards.sort(() => Math.random() - 0.5).slice(0, 8);
          resolve(cards);
        }
        else {
          rejects("No cards found.");
        }
      });
    });
  }

  getFeaturedCards(_event: string, limit: number): Promise<Card[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('cards', ref => ref
        .where('active', "==", true)
        .where('featured', "==", true)
        .where('events', "array-contains", _event.trim())
        .limit(limit)
      ).get().subscribe(data => {
        if (!data.empty) {
          let cards: Card[] = [];
          data.forEach(doc => {
            let card: Card = doc.data() as Card;
            card.id = doc.id;
            cards.push(card);
          });
          //cards = cards.sort(() => Math.random() - 0.5).slice(0, limit);
          resolve(cards);
        }
        else {
          rejects("No cards found.");
        }
      });
    });
  }

  getSuggestions(_event: string, limit: number): Promise<Card[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('cards', ref => ref
        .where('active', "==", true)
        .where('events', "array-contains", _event)
        .limit(limit)
      ).get().subscribe(data => {
        if (!data.empty) {
          let cards: Card[] = [];
          data.forEach(doc => {
            let card: Card = doc.data() as Card;
            card.id = doc.id;
            cards.push(card);
          });
          resolve(cards);
        }
        else {
          rejects("No cards found.");
        }
      });
    });
  }

  getSignAndSendSuggestions(_event: string, limit: number): Promise<Card[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('cards', ref => ref
        .where('active', "==", true)
        .where('events', "array-contains", _event)
        .where('signAndSend', "==", true)
        .limit(limit)
      ).get().subscribe(data => {
        if (!data.empty) {
          let cards: Card[] = [];
          data.forEach(doc => {
            let card: Card = doc.data() as Card;
            card.id = doc.id;
            cards.push(card);
          });
          resolve(cards);
        }
        else {
          rejects("No cards found.");
        }
      });
    });
  }

  getCardsByEvent(_event: string): Promise<Card[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('cards', ref => ref
        .where('active', "==", true)
        .where('events', "array-contains", _event)).get().subscribe(data => {
          if (!data.empty) {
            let cards: Card[] = [];
            data.forEach(doc => {
              let card: Card = doc.data() as Card;
              card.id = doc.id;
              cards.push(card);
            });
            resolve(cards);
          }
          else {
            rejects("No cards found.");
          }
        });
    });
  }

  getCardsByType(_type: 'card' | 'gift' | 'sticker'): Promise<Card[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('cards', ref => ref
        .where('active', "==", true)
        .where('type', "==", _type)).get().subscribe(data => {
          if (!data.empty) {
            let cards: Card[] = [];
            data.forEach(doc => {
              let card: Card = doc.data() as Card;
              card.id = doc.id;
              cards.push(card);
            });
            resolve(cards);
          }
          else {
            rejects("No cards found.");
          }
        });
    });
  }

  getPoetryCardsByEvent(_event: string): Promise<Card[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('cards', ref => ref
        .where('active', "==", true)
        .where('messagetype', "==", 'poetry')
        .where('events', "array-contains", _event.trim())).get().subscribe(data => {
          if (!data.empty) {
            let cards: Card[] = [];
            data.forEach(doc => {
              let card: Card = doc.data() as Card;
              card.id = doc.id;
              cards.push(card);
            });
            resolve(cards);
          }
          else {
            rejects("No cards found.");
          }
        });
    });
  }

  getSignAndSendByEvent(_event: string): Promise<Card[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('cards', ref => ref
        .where('active', "==", true)
        .where('signAndSend', "==", true)
        .where('events', "array-contains", _event.trim())).get().subscribe(data => {
          if (!data.empty) {
            let cards: Card[] = [];
            data.forEach(doc => {
              let card: Card = doc.data() as Card;
              card.id = doc.id;
              cards.push(card);
            });
            resolve(cards);
          }
          else {
            rejects("No cards found.");
          }
        });
    });
  }

  getCardsByRecipient(_recipient: string): Promise<Card[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('cards', ref => ref
        .where('active', "==", true)
        .where('recipients', "array-contains", _recipient.trim())).get().subscribe(data => {
          if (!data.empty) {
            let cards: Card[] = [];
            data.forEach(doc => {
              let card: Card = doc.data() as Card;
              card.id = doc.id;
              cards.push(card);
            });
            resolve(cards);
          }
          else {
            rejects("No cards found.");
          }
        });
    });
  }

  getSearchCards(field: string, search: string): Promise<Card[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('cards', ref => ref
        .orderBy(field)
        .startAt(search)
        .endAt(search + "\uf8ff")
      ).get().subscribe(data => {
        if (!data.empty) {
          let cards: Card[] = [];
          data.forEach(doc => {
            let card: Card = doc.data() as Card;
            if (card.active) {
              card.id = doc.id;
              cards.push(card);
            }
          });
          if (cards.length > 0)
            resolve(cards);
          else
            rejects("No cards found.");
        }
        else {
          rejects("No cards found.");
        }
      });
    });
  }

  getSignAndSendCards(): Promise<Card[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('cards', ref => ref
        .where('active', "==", true)
        .where('signAndSend', "==", true)
      ).get().subscribe(data => {
        if (!data.empty) {
          let cards: Card[] = [];
          data.forEach(doc => {
            let card: Card = doc.data() as Card;
            card.id = doc.id;
            cards.push(card);
          });
          resolve(cards);
        }
        else {
          rejects("No cards found.");
        }
      });
    });
  }

  getSignAndSendFeaturedCards(): Promise<Card[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('cards', ref => ref
        .where('active', "==", true)
        .where('featured', "==", true)
        .where('signAndSend', "==", true)
        .where('events', "array-contains", 'Christmas')
      ).get().subscribe(data => {
        if (!data.empty) {
          let cards: Card[] = [];
          data.forEach(doc => {
            let card: Card = doc.data() as Card;
            card.id = doc.id;
            cards.push(card);
          });
          resolve(cards);
        }
        else {
          rejects("No cards found.");
        }
      });
    });
  }

  getCards(): Promise<Card[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('cards', ref => ref
        .where('active', "==", true)
      ).get().subscribe(data => {
        if (!data.empty) {
          let cards: Card[] = [];
          data.forEach(doc => {
            let card: Card = doc.data() as Card;
            card.id = doc.id;
            cards.push(card);
          });
          resolve(cards);
        }
        else {
          rejects("No cards found.");
        }
      });

      let data = collection(this.store, 'cards');
      let qry = query(data, where('active', "==", true));

      (collectionData(qry, { idField: 'id' }) as Observable<Card[]>).subscribe(
        cards => {
          resolve(cards);
        },
        err => rejects(err)
      );
    });
  }

  getCard(id: string): Observable<Card> {
    const data = doc(this.store, 'cards/' + id);
    return docData(data, { idField: 'id' }) as Observable<Card>;
  }

  getACard(id: string): Promise<Card> {
    return new Promise((resolve) => {
      const data = doc(this.store, 'cards/' + id);
      (docData(data, { idField: 'id' }) as Observable<Card>).subscribe(card => {
        resolve(card);
      });
    });
  }

  async getRatings(id: string): Promise<Rating[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('cards').doc(id).collection('ratings', ref => ref.orderBy('created', 'desc')).get().subscribe(data => {
        if (!data.empty) {
          let ratings: Rating[] = [];
          data.forEach(doc => {
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
    //console.log("AddRating id: " + id);
    //console.log("AddRating rating: " + JSON.stringify(rating));
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

  updateFavorite(cardId: string, favorites: string[]) {
    const data = doc(this.store, 'cards/' + cardId);
    updateDoc(data, {
      'favorites': favorites
    });
  }

  async getSignAndSend(id: string): Promise<SignAndSend[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('cards').doc(id).collection('signandsend').get().subscribe(data => {
        if (!data.empty) {
          let signAndSends: SignAndSend[] = [];
          data.forEach(doc => {
            let sign: SignAndSend = doc.data() as SignAndSend;
            sign.id = doc.id;
            signAndSends.push(sign);
          });
          resolve(signAndSends);
        }
        else {
          rejects("No sign and send found.");
        }
      });
    });
  }

  updateCardOrder(id: string, orderId: string) {
    this.getACard(id).then(card => {
      let orders: string[] = card.orders;
      if (orders == undefined)
        orders = [];

      if (orders.find(x => x == orderId) == undefined) {
        orders.push(orderId);
        const data = doc(this.store, 'cards/' + id);
        updateDoc(data, {
          'orders': orders
        });
      }
    })
  }

  getCardImages(id: string): Promise<CardImage[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('cards').doc(id).collection('cardimages', ref =>
        ref.where('active', '==', true)).get().subscribe(data => {
          if (!data.empty) {
            let cardimages: CardImage[] = [];
            data.forEach(doc => {
              let cardimage: CardImage = doc.data() as CardImage;
              cardimage.id = doc.id;
              cardimages.push(cardimage);
            });
            resolve(cardimages);
          }
          else {
            rejects("No card images found.");
          }
        });
    });
  }

  getImages(id: string): Promise<CardImage[]> {
    return new Promise((resolve, rejects) => {
      let cardimages: CardImage[] = [];
      this.getCardImages(id).then(images => {
        environment.imagetitles.forEach(title => {
          images.forEach(image => {
            if (image.title == title) {
              cardimages.push(image);
            }
          });
        });
        resolve(cardimages);
      }).catch(err => {
        this.getACard(id).then(card => {
          if (card.primary) {
            let primary: CardImage = new CardImage();
            primary.title = environment.imagetitles[0];
            primary.active = true;
            primary.url = card.primary!;
            cardimages.push(primary);
          }

          if (card.images) {
            card.images.forEach(img => {
              if (img != card.primary!) {
                let image: CardImage = new CardImage();
                image.title = 'Other';
                image.active = true;
                image.url = img;
                cardimages.push(image);
              }
            })
          }
          resolve(cardimages);
        })
      });
    });
  }

  getPrimaryImage(id: string): Promise<string> {
    return new Promise((resolve, rejects) => {
      this.getCardImages(id).then(images => {
        let index = images.findIndex(x => x.title == environment.imagetitles[0]);
        if (index >= 0) {
          resolve(images[index].url);
        }
        else {
          resolve(images[0].url);
        }
      }).catch(err => {
        this.getACard(id).then(card => {
          if (card.primary) {
            resolve(card.primary);
          }
          else if (card.images) {
            resolve(card.images[0]);
          }
        });
      })
    });
  }

  getBundles(id: string): Promise<Bundle[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('cards').doc(id).collection('bundles',
        ref => ref.where('active', "==", true).orderBy('count', 'asc')).get().subscribe(data => {
          if (!data.empty) {
            let bundles: Bundle[] = [];
            data.forEach(doc => {
              let bundle: Bundle = doc.data() as Bundle;
              bundle.id = doc.id;
              bundles.push(bundle);
            });
            resolve(bundles);
          }
          else {
            rejects("No bundles found.");
          }
        });
    });
  }
}
