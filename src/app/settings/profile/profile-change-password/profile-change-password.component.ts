import { User } from 'src/app/models/user';
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-change-password',
  templateUrl: './profile-change-password.component.html',
  styleUrls: ['./profile-change-password.component.scss']
})
export class ProfileChangePasswordComponent implements OnInit {
  modalService: NgbModal;
  uid: string;
  userService: UserService;
  user: User;
  fb: FormBuilder;
  form: FormGroup;
  modal: NgbModalRef;

  constructor(
    private _modalService: NgbModal,
    private _userService: UserService,
    private _fb: FormBuilder
  ) { 
    this.modalService = _modalService;
    this.userService = _userService;
    this.fb = _fb;
  }

  open(content: any) {
    this.modal = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  close(){
    this.modal.close("Cancel");
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      password: ['', [Validators.required]],
      newpassword: ['', [Validators.required]],
      confirm: ['', [Validators.required]]
    });

    const userDetails = JSON.parse(localStorage.getItem('user')!); 
    this.uid = userDetails?.uid;
    this.loadUser();
  }

  loadUser(){
    this.userService.getUser(this.uid).then(user => {
      this.user = user;
    })
  }

  save(){
    //g(this.form.value);
    if (this.form.valid)
    {
      if (this.form.value.newpassword == this.form.value.confirm)
      {
        this._userService.changePassword(this.user.email, this.form.value.password, this.form.value.confirm);
        this.modal.close("Done");
      }
    }
  }

}

