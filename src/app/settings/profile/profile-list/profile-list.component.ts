import { CardService } from 'src/app/services/card.service';
import { Component, OnInit } from '@angular/core';
import { Card } from 'src/app/models/card';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

export class UserFavorite {
  public id: string;
  public card: Card;
  public image: string;
}

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss']
})
export class ProfileListComponent implements OnInit {
  uid: string;
  user: User;
  userService: UserService;
  cardService: CardService;
  router: Router;
  userFavorites: UserFavorite[] = [];

  constructor(
    private _userService: UserService,
    private _cardService: CardService,
    private _router: Router
  ) {
    this.userService = _userService;
    this.cardService = _cardService;
    this.router = _router;
  }

  ngOnInit(): void {
    const userDetails = JSON.parse(localStorage.getItem('user')!);
    this.uid = userDetails?.uid;
    this.loadUser();
  }

  loadUser() {
    this.userService.getUser(this.uid).then(user => {
      this.user = user;
      if (user.favorites) {
        user.favorites.forEach(favorite => {
          let userFavorite = new UserFavorite();
          userFavorite.id = favorite;
          this.userFavorites.push(userFavorite);
          this.getCard(favorite);
        });
      }
    })
  }

  getCard(cardId: string) {
    this.cardService.getACard(cardId).then(card => {
      this.userFavorites.forEach(userFavorite => {
        if (userFavorite.id == card.id) {
          userFavorite.card = card;
          this.updateImage(userFavorite);
        }
      })
    });
  }

  updateImage(userFavorite: UserFavorite) {
    this.cardService.getPrimaryImage(userFavorite.card.id!).then(image => {
      this.cardService.getImageURL(image).then(value => {
        this.userFavorites.forEach(userFav => {
          if (userFav.id == userFavorite.id) {
            userFav.image = value;
          }
        })
      });
    });
  }
}
