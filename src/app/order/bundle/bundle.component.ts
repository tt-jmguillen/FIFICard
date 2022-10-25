import { Bundle } from './../../models/bundle';
import { CardService } from 'src/app/services/card.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card } from 'src/app/models/card';

@Component({
  selector: 'app-bundle',
  templateUrl: './bundle.component.html',
  styleUrls: ['./bundle.component.scss']
})
export class BundleComponent implements OnInit {
  @Input() set card(_card: Card) {
    this.singleprice = _card.price!;
    this.loadBundle(_card.id!);
  }
  @Output() bundle: EventEmitter<Bundle> = new EventEmitter();

  sevice: CardService;

  constructor(
    _sevice: CardService
  ) {
    this.sevice = _sevice;
  }

  bundles: Bundle[];
  singleprice: number = 0;
  selected: string = '';

  ngOnInit(): void {
  }

  loadBundle(_id: string) {
    console.log(_id);
    this.sevice.getBundles(_id).then(bundles => {
      this.bundles = bundles;

      let bundle: Bundle = new Bundle();
      bundle.id = 'single';
      bundle.count = 1;
      bundle.price = this.singleprice;
      this.bundles.unshift(bundle);

      this.selected = bundle.id;
    });
  }

  getlabel(bundle: Bundle): string {
    let label: string = '';
    if (bundle.count > 1)
      label = 'Bundle of ' + bundle.count + 'pcs of Greeting Cards – P' + bundle.price.toFixed(2);
    else
      label = 'Single Greeting Card – P' + bundle.price.toFixed(2);

    return label
  }

  change(event: any) {
    let index = this.bundles.findIndex(x => x.id == event.target.id);
    if (index < 0)
      return;

    let bundle = this.bundles[index];
    this.bundle.emit(bundle);
  }
}
