import { StatusComponent } from './status/status.component';
import { OrderComponent } from './order/order.component';
import { DetailComponent } from './detail/detail.component';
import { CardsComponent } from './cards/cards.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', component: CardsComponent
  },
  {
    path: 'events/:event', component: CardsComponent
  },
  {
    path: 'search/:search', component: CardsComponent
  },
  {
    path: 'card/:id', component: DetailComponent
  },
  {
    path: 'order/:id', component: OrderComponent
  },
  {
    path: 'status/:id', component: StatusComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
