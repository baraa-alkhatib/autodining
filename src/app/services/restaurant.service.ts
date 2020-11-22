import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API } from '../../environments/environment';
import IRestaurantItem from '../models/restaurant-item.model';
import IRestaurant from '../models/restaurant.model';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  /**
   * - Holds the most recent restaurants filter object.
   * - Emits the most recent restaurants filter object to a new subscriber.
   * - Emits restaurants filter object to the subscribers whenever it changes.
   * @private
   * @type {(BehaviorSubject<{
   *     orderAlphabetically?: 1;
   *     smallestNumberOfStars?: 0 | 1 | 2 | 3 | 4 | 5;
   *     status?: 'open';
   *   }>)}
   * @memberof RestaurantService
   */
  private readonly _restaurantsFilter$!: BehaviorSubject<{
    orderAlphabetically?: 1;
    smallestNumberOfStars?: 0 | 1 | 2 | 3 | 4 | 5;
    status?: 'open' | undefined;
  }>;

  /**
   * Returns an observable that is going to emit the last restaurants filter object
   * and the subsequent changes
   * @readonly
   * @type {(Observable<{
   *     orderAlphabetically?: 1;
   *     smallestNumberOfStars?: 0 | 1 | 2 | 3 | 4 | 5;
   *     status?: 'open';
   *   }>)}
   * @memberof RestaurantService
   */
  public get restaurantsFilter$(): Observable<{
    orderAlphabetically?: 1;
    smallestNumberOfStars?: 0 | 1 | 2 | 3 | 4 | 5;
    status?: 'open';
  }> {
    return this._restaurantsFilter$.asObservable();
  }

  /**
   * Returns the current restaurants filter object
   * @readonly
   * @type {({
   *     orderAlphabetically?: 1;
   *     smallestNumberOfStars?: 0 | 1 | 2 | 3 | 4 | 5;
   *     status?: 'open';
   *   })}
   * @memberof RestaurantService
   */
  public get restaurantsFilter(): {
    orderAlphabetically?: 1;
    smallestNumberOfStars?: 0 | 1 | 2 | 3 | 4 | 5;
    status?: 'open';
  } {
    return this._restaurantsFilter$.value;
  }

  constructor(private _http: HttpClient) {
    // assign a new BehaviorSubject
    this._restaurantsFilter$ = new BehaviorSubject(<any>{
      orderAlphabetically: undefined,
      smallestNumberOfStars: 1,
      status: undefined,
    });
  }

  /**
   * Emits a new rstaurants filter object
   * @param {({
   *     orderAlphabetically?: 1;
   *     smallestNumberOfStars?: 0 | 1 | 2 | 3 | 4 | 5;
   *     status?: 'open';
   *   })} filter
   * @memberof RestaurantService
   */
  public dispatchRestaurantsFilter(filter: {
    orderAlphabetically?: 1;
    smallestNumberOfStars?: 0 | 1 | 2 | 3 | 4 | 5;
    status?: 'open';
  }) {
    this._restaurantsFilter$.next(filter);
  }

  /**
   * TODO: format response
   * Returns list of restaurants
   * @returns {Observable<{ restaurants: IRestaurantItem[] }>}
   * @memberof RestaurantService
   */
  public getRestaurants(filter: {
    orderAlphabetically?: 1;
    smallestNumberOfStars?: 0 | 1 | 2 | 3 | 4 | 5;
    status?: 'open';
  }): Observable<{ restaurants: IRestaurantItem[] }> {
    const url = API.getRestaurants;

    const queryParams: { [param: string]: string } = {};

    if (filter?.orderAlphabetically) {
      queryParams.orderAlphabetically = `${filter.orderAlphabetically}`;
    }

    if (filter?.smallestNumberOfStars) {
      queryParams.smallestNumberOfStars = `${filter.smallestNumberOfStars}`;
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
