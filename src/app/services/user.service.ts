import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { updateDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  store: Firestore;
  auth: AngularFireAuth;

  constructor(
    private _store: Firestore,
    private _auth: AngularFireAuth
  ) {
    this.store = _store;
    this.auth = _auth;
  }

  subscribeUser(uid: string): Observable<User> {
    const data = doc(this.store, 'users/' + uid);
    return docData(data, { idField: 'id' }) as Observable<User>;
  }

  getUser(uid: string): Promise<User> {
    return new Promise((resolve) => {
      const data = doc(this.store, 'users/' + uid);
      (docData(data, { idField: 'id' }) as Observable<User>).subscribe(user => {
        resolve(user);
      });
    });
  }

  updateUser(user: User) {
    const data = doc(this.store, 'users/' + user.id);
    updateDoc(data, {
      'firstname': user.firstname,
      'lastname': user.lastname,
      'displayName': user.displayName,
      'gender': user.gender,
      'birthday': user.birthday
    });
  }

  updateAddress(userId: string, addressId: string) {
    const data = doc(this.store, 'users/' + userId);
    updateDoc(data, {
      'address': addressId
    });
  }

  updateEmail(userId: string, email: string) {
    const data = doc(this.store, 'users/' + userId);
    updateDoc(data, {
      'email': email
    });
  }

  updateNotification(userId: string, notification: boolean) {
    const data = doc(this.store, 'users/' + userId);
    updateDoc(data, {
      'notification': notification
    });
  }

  changeEmail(currentEmail: string, password: string, newEmail: string) {
    this.auth.signInWithEmailAndPassword(currentEmail, password).then(userCredential => {
      userCredential.user?.updateEmail(newEmail);
    })
  }

  changePassword(email: string, password: string, newPassword: string) {
    this.auth.signInWithEmailAndPassword(email, password).then(userCredential => {
      userCredential.user?.updatePassword(newPassword);
    })
  }

  addOrder(userId: string, orderId: string) {
    this.getUser(userId).then(user => {
      if (user.orders) {
        user.orders.push(orderId);
      }
      else {
        user.orders = [orderId];
      }

      const data = doc(this.store, 'users/' + userId);
      updateDoc(data, {
        'orders': user.orders
      });
    })
  }

  addOrders(userId: string, orderIds: string[]) {
    this.getUser(userId).then(user => {
      orderIds.forEach(orderId => {
        if (user.orders) {
          user.orders.push(orderId);
        }
        else {
          user.orders = [orderId];
        }
      });

      const data = doc(this.store, 'users/' + userId);
      updateDoc(data, {
        'orders': user.orders
      });
    })
  }

  updateFavorites(userId: string, favorites: string[]) {
    const data = doc(this.store, 'users/' + userId);
    updateDoc(data, {
      'favorites': favorites
    });
  }

  addItemOnCart(userId: string, orderId: string) {
    this.getUser(userId).then(user => {
      if (user.carts) {
        user.carts.push(orderId);
      }
      else {
        user.carts = [orderId];
      }

      const data = doc(this.store, 'users/' + userId);
      updateDoc(data, {
        'carts': user.carts
      });
    });
  }

  removeItemOnCart(userId: string, orderId: string) {
    this.getUser(userId).then(user => {
      let carts: string[] = [];

      user.carts.forEach(id => {
        if (id != orderId){
          carts.push(id);
        }
      });

      const data = doc(this.store, 'users/' + userId);
      updateDoc(data, {
        carts: carts
      });
    });
  }

  removeItemsOnCart(userId: string, orderIds: string[]) {
    this.getUser(userId).then(user => {
      let carts: string[] = [];

      user.carts.forEach(id => {
        let isFound = false;
        orderIds.forEach(orderId => {
          if (orderId == id){
            isFound == true;
          }
        })
        if (!isFound){
          carts.push(id);
        }
      });

      const data = doc(this.store, 'users/' + userId);
      updateDoc(data, {
        carts: carts
      });
    });
  }

  addPayment(userId: string, paymentId: string) {
    this.getUser(userId).then(user => {
      if (user.payments) {
        user.payments.push(paymentId);
      }
      else {
        user.payments = [paymentId];
      }

      const data = doc(this.store, 'users/' + userId);
      updateDoc(data, {
        'payments': user.payments
      });
    })
  }
}
