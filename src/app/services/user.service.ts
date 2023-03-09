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
      'birthday': user.birthday,
      'contact': user.contact
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
        console.log(user)
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

  addItemOnECart(userId: string, orderId: string) {
    this.getUser(userId).then(user => {
      if (user.ecarts) {
        user.ecarts.push(orderId);
      }
      else {
        user.ecarts = [orderId];
      }

      const data = doc(this.store, 'users/' + userId);
      updateDoc(data, {
        'ecarts': user.ecarts
      });
    });
  }

  removeItemOnCart(userId: string, orderId: string): Promise<void> {
    return new Promise((resolve) => {
      this.getUser(userId).then(user => {
        let index = user.carts.findIndex(x => x == orderId);
        user.carts.splice(index, 1);
        const data = doc(this.store, 'users/' + userId);
        updateDoc(data, {
          carts: user.carts
        });
        resolve()
      }).catch(err => {
        resolve()
      })
    });
  }

  removeItemOnECart(userId: string, orderId: string): Promise<void> {
    return new Promise((resolve) => {
      this.getUser(userId).then(user => {
        let index = user.ecarts.findIndex(x => x == orderId);
        user.ecarts.splice(index, 1);
        const data = doc(this.store, 'users/' + userId);
        updateDoc(data, {
          ecarts: user.ecarts
        });
        resolve()
      }).catch(err => {
        resolve()
      })
    });
  }

  removeItemsOnCart(userId: string, orderIds: string[]): Promise<string[]> {
    return new Promise((resolve) => {
      this.getUser(userId).then(user => {
        let carts: string[] = [];

        user.carts.forEach(id => {
          let isFound = false;

          orderIds.forEach(orderId => {
            if (orderId == id) {
              isFound = true;
            }
          })

          if (!isFound) {
            carts.push(id);
          }
        });

        let ecarts: string[] = [];
        user.ecarts.forEach(id => {
          let isFound = false;

          orderIds.forEach(orderId => {
            if (orderId == id) {
              isFound = true;
            }
          })

          if (!isFound) {
            ecarts.push(id);
          }
        });

        const data = doc(this.store, 'users/' + userId);
        updateDoc(data, {
          carts: carts,
          ecarts: ecarts
        });

        resolve(carts);
      });
    })
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
