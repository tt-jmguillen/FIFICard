import { Component, Input, OnInit } from '@angular/core';
import { Payment } from 'src/app/models/payment';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-profile-payment-thumb',
  templateUrl: './profile-payment-thumb.component.html',
  styleUrls: ['./profile-payment-thumb.component.scss']
})
export class ProfilePaymentThumbComponent implements OnInit {
  @Input() id: string;
  paymentService: PaymentService;

  payment: Payment;

  constructor(
    _paymentService: PaymentService
  ) {
    this.paymentService = _paymentService;
  }

  ngOnInit(): void {
    this.getPayment(this.id);
  }

  getPayment(id: string) {
    this.paymentService.getPayment(id).then(payment => {
      this.payment = payment;
      //console.log(this.payment.orders)
    })
  }

}
