import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API } from '../../environments/environment';
import IRestaurantItem from '../models/restaurant-item.model';
import IRestaurant from '../models/restaurant.model';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  constructor(private _http: HttpClient) {}

  /**
   * TODO: format response
   * Returns list of restaurants
   * @returns {Observable<{ restaurants: IRestaurantItem[] }>}
   * @memberof RestaurantService
   */
  public getRestaurants(filter: {
    orderAlphabetically: 1;
    smallestNumberOfStars: 1 | 2 | 3 | 4 | 5 | undefined;
    status: 'open' | 'closed' | undefined;
  }): Observable<{ restaurants: IRestaurantItem[] }> {
    const url = API.getRestaurants;

    const queryParams: any = {};

    if (filter?.orderAlphabetically) {
      queryParams.orderAlphabetically = filter.orderAlphabetically;
    }

    if (filter?.smallestNumberOfStars) {
      queryParams.smallestNumberOfStars = filter.smallestNumberOfStars;
    }

    if (filter?.status) {
      queryParams.status = filter.status;
    }

    return this._http.get<{ restaurants: IRestaurantItem[] }>(url, { params: queryParams });
  }

  public getRestaurant(restaurantId: string): Observable<IRestaurant> {
    const url = API.getRestaurant.replace(':restaurantId', restaurantId);

    return this._http.get<{ restaurant: IRestaurant }>(url).pipe(
      map((data) => {
        return data.restaurant;
      })
    );
  }

  public createRestaurant(restaurantForm: NgForm): Observable<IRestaurant> {
    const url = API.createRestaurant;

    return this._http.post<{ restaurant: IRestaurant }>(url, restaurantForm).pipe(
      map((data) => {
        return data.restaurant;
      })
    );
  }

  public updateRestaurant(restaurantForm: NgForm, restaurantId: string): Observable<IRestaurant> {
    const url = API.updateRestaurant.replace(':restaurantId', restaurantId);

    return this._http.put<{ restaurant: IRestaurant }>(url, restaurantForm).pipe(
      map((data) => {
        return data.restaurant;
      })
    );
  }

  public deleteRestaurant(restaurantId: string): Observable<void> {
    const url = API.deleteRestaurant.replace(':restaurantId', restaurantId);

    return this._http.delete<void>(url);
  }
}
