import { AddressConfig } from './../../../models/address-config';
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
  address: Address = new Address();
  userService: UserService;
  addressService: AddressService;
  isSaving: boolean = false;

  addressConfig: AddressConfig[] = [];
  cities: string[] = [];

  isValid: boolean = false;

  constructor(
    private _userService: UserService,
    private _adddressService: AddressService,
    private _fb: FormBuilder
  ) {
    this.userService = _userService;
    this.addressService = _adddressService;
  }

  ngOnInit(): void {
    this.getAddressConfig();

    const userDetails = JSON.parse(localStorage.getItem('user')!);
    this.uid = userDetails?.uid;
    this.loadUser();
  }

  getAddressConfig() {
    this.addressService.getAddressConfig().then(addressConfig => {
      this.addressConfig = addressConfig;
    })
    this.validate();
  }

  changeData(type: string, event: any) {
    if (type == 'name') this.address.name = event.target.value;
    if (type == 'firstname') this.address.firstname = event.target.value;
    if (type == 'lastname') this.address.lastname = event.target.value;
    if (type == 'address') this.address.address = event.target.value;
    if (type == 'address2') this.address.address2 = event.target.value;
    if (type == 'province') {
      this.address.province = event.target.value;
      this.updateCities(this.address.province);
      this.address.city = '';
    }
    if (type == 'city') this.address.city = event.target.value;
    if (type == 'postcode') this.address.postcode = event.target.value;
    this.validate();
  }

  updateCities(province: string) {
    let addConfig: AddressConfig = this.addressConfig.find(x => x.name == province)!;
    this.cities = addConfig.city;
  }

  loadUser() {
    this.userService.getUser(this.uid).then(user => {
      this.user = user;
      if (this.user.address) {
        this.loadAddress(this.user.address);
      }
      else {
        this.address.country = "Philippines";
        this.address.userId = this.user.id;
      }
      this.validate();
    })
  }

  loadAddress(id: string) {
    this.addressService.getAddress(id).then(address => {
      this.updateCities(address.province);
      this.address = address;
      this.address.city = address.city;
      this.validate();
    });
  }

  validate() {
    this.isValid = (this.address.firstname != undefined) && (this.address.firstname != '') &&
      (this.address.lastname != undefined) && (this.address.lastname != '') &&
      (this.address.address != undefined) && (this.address.address != '') &&
      (this.address.address != undefined) && (this.address.address != '') &&
      (this.address.province != undefined) && (this.address.province != '') &&
      (this.address.city != undefined) && (this.address.city != '') &&
      (this.address.country != undefined) && (this.address.country != '') &&
      (this.address.postcode != undefined) && (this.address.postcode != '');
  }

  saveAddress() {
    this.isSaving = true;
    this.address.id = this.user.address;
    this.address.userId = this.user.id;
    if (this.user.address) {
      this.addressService.updateAddress(this.address);
      this.isSaving = false;
    }
    else {
      this.addressService.createAddress(this.address).then(id => {
        this.address.id = id;
        this.userService.updateAddress(this.user.id, this.address.id);
        this.isSaving = false;
      })
    }
  }
}
