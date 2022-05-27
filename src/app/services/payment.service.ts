import { Payment } from './../models/payment';
import { collectionData, docData, Firestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { ref, Storage, uploadBytes, UploadResult } from '@angular/fire/storage';
import { addDoc, collection, doc, query, Timestamp, where } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Status } from '../models/status';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  storage: Storage;
  store: Firestore

  constructor(
    _storage: Storage,
    _store: Firestore
  ) { 
    this.storage = _storage;
    this.store = _store;
  }

  private getRandomString(): string {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < 20; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  uploadFile(file: File): Promise<UploadResult>{
    let id = this.getRandomString();
    const reference = ref(this.storage, 'payment/' + id);
    return uploadBytes(reference, file);
  }

  async getInitial(): Promise<string>{
    return new Promise((resolve, rejects) => {
      let data = collection(this.store, 'status');
      let qry = query(data, where('initial', "==", true));
      let colData = collectionData(qry, { idField: 'id' }) as Observable<Status[]>;
      colData.subscribe(statuses => {
        if (statuses.length > 0)
          resolve(statuses[0].name);
        else
          resolve("New");
      });
    });
  }

  async createPayment(payment: Payment): Promise<string>{
    return new Promise((resolve) => {
      const data = collection(this.store, 'payments')
      addDoc(data, {
        user_id: payment.userId,
        gateway: payment.gateway,
        orders: payment.orders,
        total: Number(payment.total),
        proof: payment.proof?payment.proof:"",
        transactionId: payment.transactionId?payment.transactionId:"",
        payerId: payment.payerId?payment.payerId:"",
        payerEmail: payment.payerEmail?payment.payerEmail:"",
        status: payment.status,
        created: Timestamp.now()
      }).then(docRef => {
        resolve(docRef.id);
      });
    })
  }

  getPayment(id: string): Promise<Payment> {
    return new Promise((resolve) => {
      const data = doc(this.store, 'payments/' + id);
      (docData(data, { idField: 'id' }) as Observable<Payment>).subscribe(payment => {
        resolve(payment);
      });
    });
  }
  
}
