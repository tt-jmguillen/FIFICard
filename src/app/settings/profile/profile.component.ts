import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Output() onSignOut: EventEmitter<void> = new EventEmitter();
  constructor(
    public auth: AngularFireAuth) { }

  ngOnInit(): void {
  }

  signOut(): void {
    console.log("Sign Out");
    localStorage.removeItem("user");
    this.auth
      .signOut()
      .then(() =>this.onSignOut.emit())
      .catch((e) => console.error("An error happened while signing out!", e));
      window.location.href = "";   
  }

}
