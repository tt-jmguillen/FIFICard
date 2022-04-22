import { User } from './../../../models/user';
import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit {
  uid: string;
  user: User;
  userService: UserService;
  fb: FormBuilder;
  form: FormGroup;
  currentYear: Number = new Date().getFullYear();
  isEdit: boolean = false;

  constructor(
    private _userService: UserService,
    private _fb: FormBuilder
  ) { 
    this.userService = _userService;
    this.fb = _fb;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      month: ['', [Validators.required]],
      day: [Number(0), [Validators.required, Validators.min(1), Validators.max(31)]],
      year: [Number(0), [Validators.required, Validators.min(1950), Validators.max((new Date).getFullYear())]]
    });

    const userDetails = JSON.parse(localStorage.getItem('user')!); 
    this.uid = userDetails?.uid;
    this.loadUser();
  }

  loadUser(){
    this.userService.getUser(this.uid).then(user => {
      this.user = user;
      this.loadUserDisplay();
    })
  }

  loadUserDisplay()
  {
    let bday: Date = new Date(this.user.birthday);
    this.form.patchValue({
      firstname: this.user.firstname,
      lastname: this.user.lastname,
      email: this.user.email,
      gender: this.user.gender,
      month: bday.getMonth() + 1,
      day: bday.getDate(),
      year: bday.getFullYear()
    });
  }

  updateMode(){
    if(this.isEdit){
      if (this.form.valid)
      {
        let user: User = this.form.value as User;
        this.user.firstname = user.firstname;
        this.user.lastname = user.lastname;
        this.user.displayName = user.firstname + " " + user.lastname;
        this.user.gender = user.gender;
        this.user.birthday = this.form.value.year + "-" + this.form.value.month + "-" + this.form.value.day;
        this.userService.updateUser(this.user);
        this.isEdit = false;
      }
    }
    else{
      this.isEdit = true;
    }
  }

  cancelEdit(){
    this.loadUserDisplay();
    this.isEdit = false;
  }
}
