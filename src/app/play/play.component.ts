import { CardService } from './../services/card.service';
import { OrderService } from 'src/app/services/order.service';
import { ImageService } from './../services/image.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, AfterViewInit {
  @ViewChild('video') video: ElementRef;

  activateRoute: ActivatedRoute;
  orderService: OrderService;
  cardService: CardService;
  imageService: ImageService;  

  constructor(
    _activateRoute: ActivatedRoute,
    _orderService: OrderService,
    _cardService: CardService,
    _imageService: ImageService
  ) {
    this.activateRoute = _activateRoute;
    this.orderService = _orderService;
    this.cardService = _cardService;
    this.imageService = _imageService;
  }

  orderid: string = '';
  url: string = '';
  controls: string[] = [
    'nodownload',
    'nofullscreen',
    'noremoteplayback'
  ];

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.orderid = params['id'];
    });
  }

  ngAfterViewInit(): void {
    this.loadImage();
  }

  loadImage(){
    this.orderService.getECardOrder(this.orderid).then(order => {
      this.cardService.getACard(order.card_id!).then(card => {
        this.cardService.getECardImages(card.id!).then(images => {
          console.log(images);
          let image = images.find(x => x.title == 'video')!;
          this.imageService.getImageURL(image.url).then(url => {
            this.url = url;
          })
        })
      })
    })
  }

}
