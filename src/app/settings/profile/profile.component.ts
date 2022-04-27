import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Output() onSignOut: EventEmitter<void> = new EventEmitter();
  activateRoute: ActivatedRoute;
  id: string;

  constructor(
    public auth: AngularFireAuth,
    private _activateRoute: ActivatedRoute
  ) { 
    this.activateRoute = _activateRoute
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.id = params['id'];
    });
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
