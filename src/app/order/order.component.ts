import { UploadResult } from '@angular/fire/storage';
import { OrderService } from './../services/order.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../models/card';
import { Order } from '../models/order';
import { CardService } from '../services/card.service';
import { Cart } from '../models/cart';

export class Validation{
  public sender_name: boolean = true;
  public sender_phone: boolean = true;
  public sender_email: boolean = true;
  public receiver_name: boolean = true;
  public receiver_phone: boolean = true;
  public sendto: boolean = true;
  public message: boolean = true;
  public proof: boolean = true;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit {
  id?: string;
  card?: Card;
  proof: string = '';
  activateRoute: ActivatedRoute;
  service: CardService;
  orderService: OrderService;
  fb: FormBuilder;
  router: Router;
  orderForm: FormGroup;
  validation: Validation = new Validation();
  isUploading: boolean = false;

  constructor(
    private _activateRoute: ActivatedRoute,
    private _service: CardService,
    private _orderService: OrderService,
    private _fb: FormBuilder,
    private _router: Router,
    private titleService: Title) { 
      this.activateRoute = _activateRoute;
      this.service = _service;
      this.orderService = _orderService;
      this.fb = _fb;
      this.router = _router;
    }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.id = params['id'];
      this.loadCard();
    });

    this.orderForm = this.fb.group({
      sender_name: ['', [Validators.required]],
      sender_phone: ['', [Validators.required]],
      sender_email: ['', [Validators.required]],
      receiver_name: ['', [Validators.required]],
      receiver_phone: ['', [Validators.required]],
      receiver_email: ['',],
      anonymously: [Boolean(false)],
      sendto: ['Recipient', [Validators.required]],
      message: ['', [Validators.required]]
    })
  }

  loadCard(){
    this.service.getCard(this.id!).subscribe(data => {
      this.card! = data;
      this.titleService.setTitle(this.card?.name!);
    });
  }

  submitOrder(){
    let order: Order = this.orderForm.value as Order;
    if (this.orderForm.valid){
      let order: Order = this.orderForm.value as Order;
      order.card_id = this.card?.id;
      order.card_name = this.card?.name;
      order.card_price = this.card?.price;
      order.proof = this.proof;
      order.status = "New";
      this.orderService.createOrder(order).then(id => {
        this.orderForm.reset();
        let cart: Cart= new Cart(id, this.card!.name!);
        this.addLocalStorage(cart);
        this.router.navigate(['/status/' + id]);
      })
    }
    else{
      this.validation.sender_name = this.orderForm.controls['sender_name']['status'] == "VALID";
      this.validation.sender_phone = this.orderForm.controls['sender_phone']['status'] == "VALID";
      this.validation.sender_email = this.orderForm.controls['sender_email']['status'] == "VALID";
      this.validation.receiver_name = this.orderForm.controls['receiver_name']['status'] == "VALID";
      this.validation.receiver_phone = this.orderForm.controls['receiver_phone']['status'] == "VALID";
      this.validation.sendto = this.orderForm.controls['sendto']['status'] == "VALID";
      this.validation.message = this.orderForm.controls['message']['status'] == "VALID";
      this.validation.proof = this.proof != '';
    }
  }

  uploadFile(event: any){
    this.isUploading = true;
    const file: File = event.target.files[0];
    this.orderService.uploadFile(file).then(result => {
      this.proof = result.metadata.fullPath;
      this.validation.proof = this.proof != '';
      this.isUploading = false;
    })
  }

  addLocalStorage(cart: Cart){
    let jsonString: string = localStorage.getItem('cart')!;
    if (jsonString != null){
      let carts: Cart[] = JSON.parse(jsonString) as Cart[];
      carts.push(cart);
      localStorage.setItem("cart", JSON.stringify(carts));
    }
    else{
      let carts: Cart[] = [cart];
      localStorage.setItem("cart", JSON.stringify(carts));
    }
  }
}
