import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-communication',
  templateUrl: './profile-communication.component.html',
  styleUrls: ['./profile-communication.component.scss']
})
export class ProfileCommunicationComponent implements OnInit {
  uid: string;
  user: User;
  userService: UserService;
  fb: UntypedFormBuilder;
  form: UntypedFormGroup;
  modalService: NgbModal;
  modal: NgbModalRef;

  constructor(
    private _userService: UserService,
    private _fb: UntypedFormBuilder,
    private _modalService: NgbModal
  ) { 
    this.userService = _userService;
    this.fb = _fb;
    this.modalService = _modalService;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      newemail: ['', [Validators.required]]
    });
    
    const userDetails = JSON.parse(localStorage.getItem('user')!); 
    this.uid = userDetails?.uid;
    this.loadUser();
  }

  loadUser(){
    this.userService.subscribeUser(this.uid).subscribe(user => {
      this.user = user;
    })
  }

  notificationChange(notif: boolean){
    this.user.notification = !notif;
    this.userService.updateNotification(this.user.id, this.user.notification);
  }

  open(content: any) {
    this.modal = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  close(){
    this.modal.close("Cancel");
  }

  save(){
    if (this.form.valid)
    {
      this._userService.changeEmail(this.form.value.email, this.form.value.password, this.form.value.newemail);
      this._userService.updateEmail(this.uid, this.form.value.newemail);
      this.modal.close("Done");
    }
  }

}
