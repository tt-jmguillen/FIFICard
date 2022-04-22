import { ConvertPropertyBindingResult } from '@angular/compiler/src/compiler_util/expression_converter';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { AuthProcessService } from 'ngx-auth-firebaseui';
import { map, take } from 'rxjs';
import firebase from "firebase/compat/app";
import {UserComponent} from 'ngx-auth-firebaseui';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FibieGreetings';
  isAuthenticated: boolean;
  user: any;
  userDetails: any;
  isLogIn = true;
  @Output() onSignOut: EventEmitter<void> = new EventEmitter();

  constructor(
    public dialog: MatDialog,
    public auth: AngularFireAuth,
    public authProcess: AuthProcessService
    //public component: UserComponent
    ) { }

  ngOnInit(): void {
   
    const userDetails = JSON.parse(localStorage.getItem('user')!);
    this.userDetails = userDetails;
    //console.log("userDetails ->",  userDetails);
    this.isLogIn = userDetails == null || userDetails.length < 0 ? true : false;
    //console.log("isLogIn ->",   String(this.isLogIn));
  }

  openLoginDialog(id: any): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      panelClass: 'full-width-dialog'
      //width: '250px'
      // data: { name: this.name, animal: this.city }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed', result);
  
     const _users = this.authProcess.user$.pipe(
        take(1),
        map((currentUser: firebase.User | null) => {
          return currentUser;
        })
      );

      _users.subscribe(userDetails => {
        this.userDetails = userDetails;
        //console.log("displayName ->",  userDetails?.displayName);
        //console.log("emailVerified ->",  userDetails?.emailVerified);
        //console.log("IdToken ->",  userDetails?.getIdToken());

        this.isLogIn = userDetails == null  ? true : false;
        //console.log("isLogIn ->",  String(this.isLogIn));

        if(!this.isLogIn){
        localStorage.setItem("user", JSON.stringify(userDetails));
        if(id != null) window.location.href = "/order/" + id;
        }

      });
       
    });
  }

  signOut(): void {
    //console.log("Sign Out");
    this.isLogIn = true;
    localStorage.removeItem("user");
    this.auth
      .signOut()
      .then(() =>this.onSignOut.emit())
      .catch((e) => console.error("An error happened while signing out!", e));
    window.location.href = "";   
  }
}
