import { Order } from 'src/app/models/order';
import { OrderService } from './../../services/order.service';
import { SignAndSendDetails } from './../../models/sign-and-send-details';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardService } from 'src/app/services/card.service';
import { sign } from 'crypto';
import { FilterService } from 'src/app/services/filter.service';
import { left } from '@popperjs/core';

class Item {
  public image: string;
  public code: number;
  public top: number;
  public left: number;
  public width: number;
  public height: number;
  public limit: number;
  public style: string;
  public text: string = '';
  public size: number = 20;
  public alignment: string = "left";

  public intialize (_image: string, _code: number, _top: number, _left: number, _width: number, _height: number, _limit: number, _style: string){
    this.image = _image;
    this.code = _code;
    this.top = _top;
    this.left = _left;
    this.width = _width;
    this.height = _height;
    this.limit = _limit;
    this.style = _style;
  }

  public updateText (_text: string, _size: number, _style: string, _alignment: string){
    this.text = _text;
    this.size = _size;
    this.style = _style;
    this.alignment = _alignment;
  }
}

class URL{
  public image: string;
  public url: string;
}

@Component({
  selector: 'app-sign-and-send',
  templateUrl: './sign-and-send.component.html',
  styleUrls: ['./sign-and-send.component.scss']
})
export class SignAndSendComponent implements OnInit {
  id?: string;
  activateRoute: ActivatedRoute;
  service: CardService;
  orderService: OrderService;
  router: Router;
  filerService: FilterService;

  uid: string;
  fonts: string[] = ['Smooch', 'Zen Loop', 'Satisfy', 'Courgette'];
  items: Item[] = [];
  images: string[] = [];
  urls: URL[] = [];

  focusURL: URL;
  focusItems: Item[] = [];
  selected: Item = new Item();
  
  constructor(
    private _activateRoute: ActivatedRoute,
    private _service: CardService,
    private _orderService: OrderService,
    private _router: Router,
    private _filerService: FilterService
  ) { 
    this.activateRoute = _activateRoute;
    this.service = _service;
    this.orderService = _orderService;
    this.router = _router;
    this.filerService = _filerService;
  }

  ngOnInit(): void {
    const userDetails = JSON.parse(localStorage.getItem('user')!); 
    this.uid = userDetails?.uid;

    this.activateRoute.params.subscribe(params => {
      this.id = params['id'];
      this.loadSignAndSend();
    });
  }

  loadSignAndSend(){
    this.service.getSignAndSend(this.id!).then(data => {
      this.items = [];
      this.images = [];
      this.urls = [];

      data.forEach(sign => {
        let item = new Item();
        item.intialize(sign.image, sign.code, sign.top, sign.left, sign.width, sign.height, sign.limit, this.fonts[0]);
        this.items.push(item);
      });

      this.orderService.getSignAndSendData(this.uid, this.id!).then(signs => {
        signs.forEach(sign => {
          this.items.forEach(item => {
            if(item.code == sign.code){
              item.updateText(sign.text, sign.size, sign.style, sign.alignment);
            }
          })
        });
      });

      this.items.forEach(item => {
        if (this.images.indexOf(item.image) < 0){
          this.images.push(item.image);
        }
      });

      this.images.forEach(image => {
        this.service.getImageURL(image).then(imageURL => {
          let url : URL = new URL();
          url.image = image;
          url.url = imageURL;
          this.urls.push(url);

          if (!this.focusURL){
            this.updateFocusImage(url);
          }
        })
      });

      
    });
  }

  imageClick(url: URL){
    if (url.image != this.focusURL.image){
      this.updateDetail(this.focusURL.image);
      this.updateFocusImage(url);
    }
  }

  updateFocusImage(url: URL){
    this.focusURL = url;
    this.focusItems = [];
    this.selected = new Item();
    this.items.forEach(sign => {
      if (sign.image == this.focusURL.image){
        let item = new Item();
        item.intialize(sign.image, sign.code, sign.top, sign.left, sign.width, sign.height, sign.limit, this.fonts[0]);
        item.updateText(sign.text, sign.size, sign.style, sign.alignment);
        this.focusItems.push(item);
      }
    })
  }

  textareaClick(code: number){
    this.focusItems.forEach(item => {
      if (item.code == code){
        this.selected = item;
      }
    });
  }

  textareaKeyup(event: any){
    this.focusItems.forEach(item => {
      if (item.code == this.selected.code){
        item.text = event.target.value;
      }
    });
  }

  fontChange(event: any){
    this.focusItems.forEach(item => {
      if (item.code == this.selected.code){
        item.style = event.target.value;
      }
    });
  }

  sizeChange(event: any){
    this.focusItems.forEach(item => {
      if (item.code == this.selected.code){
        item.size = Number(event.target.value);
      }
    });
  }

  alignmentClick(alignment: string){
    this.focusItems.forEach(item => {
      if (item.code == this.selected.code){
        item.alignment = alignment;
      }
    });
  }

  updateDetail(image: string){
    this.focusItems.forEach(focus => {
      this.items.forEach(item => {
        if ((item.image == image) && (focus.image == image)){
          if (item.code == focus.code){
            item.updateText(focus.text, focus.size, focus.style, focus.alignment);
          }
        }
      });
    });
  }

  clickCancel(){
    this.router.navigate(['/order/' + this.id!])
  }

  clickSave(){
    this.images.forEach(image => {
      this.updateDetail(image);
    })

    let signDetails: SignAndSendDetails[] = [];
    this.items.forEach(item => {
      let detail: SignAndSendDetails = new SignAndSendDetails();
      detail.image = item.image;
      detail.code = item.code;
      detail.top = item.top;
      detail.left = item.left;
      detail.width = item.width;
      detail.height = item.height;
      detail.limit = item.limit;
      detail.style = item.style;
      detail.text =  item.text;
      detail.size =  item.size;
      detail.alignment = item.alignment;
      signDetails.push(detail);
    });

    this.orderService.getSignAndSendData(this.uid, this.id!).then(signs => {
      if (signs.length == 0){
        signDetails.forEach(element => {
          this.orderService.addSignAndSendData(this.uid, this.id!, element)
        });
      }
      else{
        signs.forEach(sign => {
          this.orderService.deleteSignAndSendData(this.uid, this.id!, sign.id);
        });
        signDetails.forEach(element => {
          this.orderService.addSignAndSendData(this.uid, this.id!, element)
        });
      }
    });
  }

}
