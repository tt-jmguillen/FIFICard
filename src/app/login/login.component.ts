import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from "@angular/material/tabs";
import { AnyRecordWithTtl } from 'dns';
import { AuthComponent, AuthProcessService, AuthProvider, AuthProvidersComponent } from 'ngx-auth-firebaseui';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent implements OnInit {  
  isAuthenticated: boolean;
  email: string;
  error: boolean;
  public index: number;
  providers = AuthProvider;

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    public authProcess: AuthProcessService,
    ) {}
    
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }

  onCloseClick(event: any) {
    this.dialogRef.close({
      //isAuthenticated: this.isAuthenticated
    });
  }

  printUser(event: any) {
    //console.log("onSuccess event ->", event);
    this.error = false;
    this.index = 2;
    //this.isAuthenticated = true;
  }

  printError(event: any) {
    //console.error("onError event --> ", event);
    this.error = true;
    //this.isAuthenticated = false;
    // this.snackbar.open(event.message, 'OK', {duration: 5000});
  }
  
  onTabChange(event: MatTabChangeEvent) {
    //console.log("on tab change: ", event);
  }



}
