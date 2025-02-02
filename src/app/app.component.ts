import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { AuthProcessService } from 'ngx-auth-firebaseui';
import { map, take } from 'rxjs';
import firebase from "firebase/compat/app";
import { UserComponent } from 'ngx-auth-firebaseui';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FibeiGreetings';
  isAuthenticated: boolean;
  user: any;
  userDetails: any;
  isLogIn = true;
  @Output() onSignOut: EventEmitter<void> = new EventEmitter();


  constructor(
    private translate: TranslateService,
    public dialog: MatDialog,
    public auth: AngularFireAuth,
    public authProcess: AuthProcessService,
    public route: Router
    //public component: UserComponent
  ) {
    this.setlanguage();
  }

  ngOnInit(): void {

    const userDetails = JSON.parse(localStorage.getItem('user')!);
    this.userDetails = userDetails;
    this.isLogIn = userDetails == null || userDetails.length < 0 ? true : false;
  }

  openLoginDialog(id: any): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      panelClass: 'full-width-dialog'
      //width: '250px'
      // data: { name: this.name, animal: this.city }
    });

    dialogRef.afterClosed().subscribe(result => {

      const _users = this.authProcess.user$.pipe(
        take(1),
        map((currentUser: firebase.User | null) => {
          return currentUser;
        })
      );

      _users.subscribe(userDetails => {
        this.userDetails = userDetails;

        this.isLogIn = userDetails == null ? true : false;

        if (!this.isLogIn) {
          localStorage.setItem("user", JSON.stringify(userDetails));
          if (id != null) window.location.href = "/order/" + id;
        }

      });

    });
  }

  signOut(): void {
    this.isLogIn = true;
    localStorage.removeItem("user");
    this.auth
      .signOut()
      .then(() => this.onSignOut.emit())
      .catch((e) => console.error("An error happened while signing out!", e));
    window.location.href = "";
  }

  setlanguage() {
    this.translate.setDefaultLang('en');
    const lang = localStorage.getItem("language")! ? localStorage.getItem("language")! : 'en';
    this.translate.use(lang);
  }
}
