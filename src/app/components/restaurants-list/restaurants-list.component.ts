import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import IRestaurantItem from '../../models/restaurant-item';

@Component({
  selector: 'app-restaurants-list',
  templateUrl: './restaurants-list.component.html',
  styleUrls: ['./restaurants-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantsListComponent implements OnInit {
  /**
   * Holds a list of non-detailed restaurants view data
   * @type {IRestaurantItem[]}
   * @memberof RestaurantsListComponent
   */
  public restaurants: IRestaurantItem[];

  constructor() {
    this.restaurants = [];
  }

  public ngOnInit(): void {
    this.restaurants.push({
      _id: '1fdsaef324',
      name: 'First Restaurant',
      rating: 3.2,
      reviewsNumber: 30,
      status: 'open',
      address: 'This is the address of my restaurant',
      imageUrl: '',
    });
    this.restaurants.push({
      _id: '1fdsaefr325',
      name: 'Second Restaurant',
      rating: 4.5,
      reviewsNumber: 135,
      status: 'closed',
      address: 'Famous Street - Newyork - America ',
      imageUrl: '',
    });
  }
}
