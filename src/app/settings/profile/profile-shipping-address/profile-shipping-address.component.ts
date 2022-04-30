import { AddressService } from './../../../services/address.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from 'src/app/models/address';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-shipping-address',
  templateUrl: './profile-shipping-address.component.html',
  styleUrls: ['./profile-shipping-address.component.scss']
})
export class ProfileShippingAddressComponent implements OnInit {
  uid: string;
  user: User;
  address: Address;
  userService: UserService;
  addressService: AddressService;
  fb: FormBuilder;
  form: FormGroup;
  isSaving: boolean = false;

  constructor(
    private _userService: UserService,
    private _adddressService: AddressService,
    private _fb: FormBuilder
  ) { 
    this.userService = _userService;
    this.addressService = _adddressService;
    this.fb = _fb;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      address: ['', [Validators.required]],
      address2: ['', [Validators.required]],
      city: ['', [Validators.required]],
      province: ['', [Validators.required]],
      country: ['Philippines', [Validators.required]],
      postcode: ['', [Validators.required]]
    });

    const userDetails = JSON.parse(localStorage.getItem('user')!); 
    this.uid = userDetails?.uid;
    this.loadUser();
  }

  loadUser(){
    this.userService.getUser(this.uid).then(user => {
      this.user = user;
      if (this.user.address){
        this.loadAddress(this.user.address);
      }
    })
  }

  loadAddress(id: string)
  {
    this.addressService.getAddress(id).then(address => {
      let country = address.country? address.country: 'Philippines';
      this.address = address;
      this.form.patchValue({
        name: this.address.name,
        firstname: this.address.firstname,
        lastname: this.address.lastname,
        address: this.address.address,
        address2: this.address.address2,
        city: this.address.city,
        province: this.address.province,
        country: country,
        postcode: this.address.postcode
      });
    });
  }

  saveAddress()
  {
    if (this.form.valid)
    {
      this.isSaving = true;
      let address: Address = this.form.value as Address;
      this.address = address;
      this.address.id = this.user.address;
      this.address.userId = this.user.id;
      if (this.user.address){
        this.addressService.updateAddress(this.address);  
        this.isSaving = false;
      }
      else
      {
        this.addressService.createAddress(this.address).then(id => {
          this.address.id = id;
          this.userService.updateAddress(this.user.id, this.address.id);
          this.isSaving = false;
        })
      }
    }
  }
}
