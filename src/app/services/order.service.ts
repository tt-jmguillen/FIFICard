import { environment } from './../../environments/environment.prod';
import { SignAndSendDetails, SignAndSendPhotoDetails } from './../models/sign-and-send-details';
import { Injectable } from '@angular/core';
import { collection, Firestore, doc, addDoc, docData, updateDoc, serverTimestamp } from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';
import { Order } from '../models/order';
import { Timestamp } from "@angular/fire/firestore";
import { Observable } from 'rxjs';
import { OrderECard } from '../models/order-ecard';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  storage: Storage;
  store: Firestore;

  constructor(
    private _storage: Storage,
    private _store: Firestore
  ) {
    this.storage = _storage;
    this.store = _store;
  }

  async createOrder(order: Order): Promise<string> {
    return new Promise((resolve, rejects) => {
      const data = collection(this.store, 'orders')
      addDoc(data, {
        user_id: order.user_id,
        card_id: order.card_id,
        card_price: order.card_price,
        location: order.location,
        sender_name: order.sender_name,
        sender_phone: order.sender_phone,
        sender_email: order.sender_email,
        receiver_name: order.receiver_name,
        receiver_phone: order.receiver_phone,
        receiver_email: order.receiver_email,
        address: order.address,
        address1: order.address1,
        address2: order.address2,
        province: order.province,
        city: order.city,
        country: order.country,
        postcode: order.postcode,
        anonymously: order.anonymously,
        sendto: order.sendto,
        message: order.message,
        withSignAndSend: order.withSignAndSend,
        isPaid: false,
        count: order.count,
        shipping_fee: order.shipping_fee,
        type: order.type,
        bundle: order.bundle,
        created: Timestamp.now()
      }).then(docRef => {
        resolve(docRef.id);
      }).catch(reason => {
        rejects(reason);
      })
    });
  }

  async createECardOrder(order: OrderECard): Promise<string> {
    return new Promise((resolve, rejects) => {
      const data = collection(this.store, 'ecard-orders');
      addDoc(data, {
        user_id: order.user_id,
        card_id: order.card_id,
        card_price: order.card_price,
        location: order.location,
        sender_name: order.sender_name,
        sender_phone: order.sender_phone,
        sender_email: order.sender_email,
        receiver_name: order.receiver_name,
        receiver_phone: order.receiver_phone,
        receiver_email: order.receiver_email,
        message: order.message,
        created: serverTimestamp()
      }).then(docRef => {
        resolve(docRef.id);
      }).catch(reason => {
        rejects(reason);
      })
    });
  }

  async createAddMore(order: Order): Promise<string> {
    return new Promise((resolve, rejects) => {
      const data = collection(this.store, 'orders')
      addDoc(data, {
        parentOrder: order.parentOrder,
        user_id: order.user_id,
        card_id: order.card_id,
        card_price: order.card_price,
        isPaid: false,
        count: order.count,
        shipping_fee: order.shipping_fee,
        created: Timestamp.now()
      }).then(docRef => {
        resolve(docRef.id);
      }).catch(reason => {
        rejects(reason);
      })
    });
  }

  async getOrder(id: string): Promise<Order> {
    return new Promise((resolve) => {
      const data = doc(this.store, 'orders/' + id);
      (docData(data, { idField: 'id' }) as Observable<Order>).subscribe(order => {
        resolve(order);
      });
    });
  }

  async getECardOrder(id: string): Promise<OrderECard> {
    return new Promise((resolve) => {
      const data = doc(this.store, 'ecard-orders/' + id);
      (docData(data, { idField: 'id' }) as Observable<OrderECard>).subscribe(order => {
        resolve(order);
      });
    });
  }

  subscribeOrder(id: string): Observable<Order> {
    const data = doc(this.store, 'orders/' + id);
    return docData(data, { idField: 'id' }) as Observable<Order>;
  }

  updatePaidOrder(id: string, paymentId: string) {
    const data = doc(this.store, 'orders/' + id);
    updateDoc(data, {
      isPaid: true,
      paymentId: paymentId
    });
  }

  updatePaidOrders(ids: string[], paymentId: string) {
    ids.forEach(id => {
      const data = doc(this.store, 'orders/' + id);
      updateDoc(data, {
        isPaid: true,
        paymentId: paymentId
      });
    });
  }

  updatePaidECardOrder(id: string, paymentId: string) {
    const data = doc(this.store, 'ecard-orders/' + id);
    updateDoc(data, {
      isPaid: true,
      paymentId: paymentId
    });
  }

  addSignAndSend(orderId: string, sign: SignAndSendDetails) {
    return new Promise((resolve, rejects) => {
      const data = collection(this.store, 'orders/' + orderId + '/signandsend')
      addDoc(data, {
        image: sign.image,
        code: sign.code,
        top: sign.top,
        left: sign.left,
        width: sign.width,
        height: sign.height,
        limit: sign.limit,
        style: sign.style,
        text: sign.text,
        size: sign.size,
        alignment: sign.alignment,
        color: sign.color
      }).then(docRef => {
        const data = docData(docRef, { idField: 'id' }) as Observable<SignAndSendDetails>;
        data.subscribe(doc => {
          resolve(doc);
        });
      }).catch(reason => {
        rejects(reason);
      })
    });
  }

  addSignAndSendPhoto(orderId: string, photo: SignAndSendPhotoDetails) {
    return new Promise((resolve, rejects) => {
      const data = collection(this.store, 'orders/' + orderId + '/signandsendphoto')
      addDoc(data, {
        image: photo.image,
        code: photo.code,
        top: photo.top,
        left: photo.left,
        width: photo.width,
        height: photo.height,
        url: photo.url,
        scale: photo.scale,
        imagetop: photo.imagetop,
        imageleft: photo.imageleft
      }).then(docRef => {
        const data = docData(docRef, { idField: 'id' }) as Observable<SignAndSendPhotoDetails>;
        data.subscribe(doc => {
          resolve(doc);
        });
      }).catch(reason => {
        rejects(reason);
      })
    });
  }

  updateECardSent(id: string, sentid: string) {
    const data = doc(this.store, 'ecard-orders/' + id);
    updateDoc(data, {
      sentid: sentid
    });
  }

  updateECardConfirm(id: string, confirmid: string) {
    const data = doc(this.store, 'ecard-orders/' + id);
    updateDoc(data, {
      confirmid: confirmid
    });
  }

  updateExpiry(id: string): Promise<void> {
    const data = doc(this.store, 'ecard-orders/' + id);
    const started = Timestamp.now().toDate();
    started.setDate(started.getDate() + environment.ecardexpiry)
    return updateDoc(data, {
      start: serverTimestamp(),
      expire: Timestamp.fromDate(started)
    });
  }

  updateECardOpened(id: string, openedid: string) {
    const data = doc(this.store, 'ecard-orders/' + id);
    updateDoc(data, {
      openedid: openedid
    });
  }
}
