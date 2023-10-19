import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { doc, Firestore, DocumentSnapshot, onSnapshot, updateDoc, getDocFromServer } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { resolve } from 'dns';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  store: Firestore;
  auth: AngularFireAuth;

  constructor(
    _store: Firestore,
    _auth: AngularFireAuth
  ) {
    this.store = _store;
    this.auth = _auth;
  }

  subscribeUser(uid: string): Observable<User> {
    return new Observable(subscribe => {
      onSnapshot(doc(this.store, 'users/' + uid), (snap) => {
        if ((snap as DocumentSnapshot).data()) {
          let user = (snap as DocumentSnapshot).data() as User;
          user.id = (snap as DocumentSnapshot).id;
          subscribe.next(user);
        } else {
          subscribe.next(undefined);
        }
      });
    })
  }

  getUser(uid: string): Promise<User> {
    return new Promise((resolve) => {
      getDocFromServer(doc(this.store, 'users/' + uid)).then(doc => {
        let user: User = doc.data() as User;
        user.id = doc.id;
        resolve(user);
      });
    });
  }

  updateUser(user: User): Promise<void> {
    const data = doc(this.store, 'users/' + user.id);
    return updateDoc(data, {
      'firstname': user.firstname,
      'lastname': user.lastname,
      'displayName': user.displayName,
      'gender': user.gender,
      'birthday': user.birthday,
      'contact': user.contact
    });
  }

  updateAddress(userId: string, addressId: string): Promise<void> {
    const data = doc(this.store, 'users/' + userId);
    return updateDoc(data, {
      'address': addressId
    });
  }

  updateEmail(userId: string, email: string): Promise<void> {
    const data = doc(this.store, 'users/' + userId);
    return updateDoc(data, {
      'email': email
    });
  }

  updateNotification(userId: string, notification: boolean): Promise<void> {
    const data = doc(this.store, 'users/' + userId);
    return updateDoc(data, {
      'notification': notification
    });
  }

  changeEmail(currentEmail: string, password: string, newEmail: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.auth.signInWithEmailAndPassword(currentEmail, password).then(userCredential => {
        if (userCredential) {
          userCredential.user?.updateEmail(newEmail);
        }
        else {
          resolve(false);
        }
      }).catch(err => {
        resolve(false);
      })
    })
  }

  userAuth(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.auth.signInWithEmailAndPassword(email, password).then(user => {
        resolve(user ? true : false);
      }).catch(err => {
        resolve(false);
      })
    })
  }

  changePassword(email: string, password: string, newPassword: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.auth.signInWithEmailAndPassword(email, password).then(userCredential => {
        if (userCredential) {
          userCredential.user?.updatePassword(newPassword).then(() => {
            resolve(true);
          })
        }
        else {
          resolve(false);
        }
      }).catch(err => {
        resolve(false);
      })
    })
  }

  async addOrder(userId: string, orderId: string): Promise<void> {
    let user: User = await this.getUser(userId);
    if (user.orders) user.orders.push(orderId);
    else user.orders = [orderId];
    const data = doc(this.store, 'users/' + userId);
    return updateDoc(data, {
      'orders': user.orders
    });
  }

  async addOrders(userId: string, orderIds: string[]): Promise<void> {
    let user: User = await this.getUser(userId);
    orderIds.forEach(orderId => {
      if (user.orders) user.orders.push(orderId);
      else user.orders = [orderId];
    });

    const data = doc(this.store, 'users/' + userId);
    return updateDoc(data, {
      'orders': user.orders
    });
  }

  updateFavorites(userId: string, favorites: string[]): Promise<void> {
    const data = doc(this.store, 'users/' + userId);
    return updateDoc(data, {
      'favorites': favorites
    });
  }

  async addItemOnCart(userId: string, orderId: string): Promise<void> {
    let user: User = await this.getUser(userId);
    if (user.carts) user.carts.push(orderId);
    else user.carts = [orderId];
    const data = doc(this.store, 'users/' + userId);
    return updateDoc(data, {
      'carts': user.carts
    });
  }

  async addItemOnECart(userId: string, orderId: string): Promise<void> {
    let user: User = await this.getUser(userId);
    if (user.ecarts) user.ecarts.push(orderId);
    else user.ecarts = [orderId];
    const data = doc(this.store, 'users/' + userId);
    return updateDoc(data, {
      'ecarts': user.ecarts
    });
  }

  async removeItemOnCart(userId: string, orderId: string): Promise<void> {
    let user: User = await this.getUser(userId);
    let index = user.carts.findIndex(x => x == orderId);
    user.carts.splice(index, 1);
    const data = doc(this.store, 'users/' + userId);
    return updateDoc(data, {
      carts: user.carts
    });
  }

  async removeItemOnECart(userId: string, orderId: string): Promise<void> {
    let user: User = await this.getUser(userId);
    let index = user.ecarts.findIndex(x => x == orderId);
    user.ecarts.splice(index, 1);
    const data = doc(this.store, 'users/' + userId);
    return updateDoc(data, {
      ecarts: user.ecarts
    });
  }

  removeItemsOnCart(userId: string, orderIds: string[]): Promise<string[]> {
    return new Promise(async resolve => {
      let user: User = await this.getUser(userId);

      let carts: string[] = [];
      user.carts.forEach(id => {
        let isFound = false;
        orderIds.forEach(orderId => {
          if (orderId == id) isFound = true;
        })
        if (!isFound) carts.push(id);
      });

      let ecarts: string[] = [];
      user.ecarts.forEach(id => {
        let isFound = false;
        orderIds.forEach(orderId => {
          if (orderId == id) isFound = true;
        })
        if (!isFound) ecarts.push(id);
      });

      const data = doc(this.store, 'users/' + userId);
      await updateDoc(data, {
        carts: carts,
        ecarts: ecarts
      });

      resolve(carts);
    })
  }

  async addPayment(userId: string, paymentId: string): Promise<void> {
    let user: User = await this.getUser(userId);
    if (user.payments) user.payments.push(paymentId);
    else user.payments = [paymentId];
    const data = doc(this.store, 'users/' + userId);
    return updateDoc(data, {
      'payments': user.payments
    });
  }

  updateCart(userId: string, carts: string[]): Promise<void> {
    const data = doc(this.store, 'users/' + userId);
    return updateDoc(data, {
      carts: carts
    });
  }

  updateECart(userId: string, ecarts: string[]): Promise<void> {
    const data = doc(this.store, 'users/' + userId);
    return updateDoc(data, {
      ecarts: ecarts
    });
  }
}
