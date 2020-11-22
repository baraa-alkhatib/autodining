import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API } from '../../environments/environment';
import IReview from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(private _http: HttpClient) {}

  /**
   * Returns list of reviews
   * @param {string} restaurantId
   * @param {1} [pendingCount]
   * @param {1} [reviewsList]
   * @returns {Observable<{
   *     reviews?: IReview[];
   *     maxReview?: IReview;
   *     minReview?: IReview;
   *     awaitingResponseCount?: number;
   *   }>}
   * @memberof ReviewService
   */
  public getReviews(
    restaurantId: string,
    pendingCount?: 1,
    reviewsList?: 1
  ): Observable<{
    reviews?: IReview[];
    maxReview?: IReview;
    minReview?: IReview;
    awaitingResponseCount?: number;
  }> {
    const url = API.getReviews;

    const queryParams: { [param: string]: string } = { restaurantId };

    if (pendingCount) {
      queryParams.pendingCount = `${pendingCount}`;
    }

    if (reviewsList) {
      queryParams.reviewsList = `${reviewsList}`;
    }

    return this._http.get<{
      reviews: IReview[];
      maxReview?: IReview;
      minReview?: IReview;
      awaitingResponseCount?: number;
    }>(url, {
      params: queryParams,
    });
  }

  public getReview(reviewId: string): Observable<IReview> {
    const url = API.getReview.replace(':reviewId', reviewId);

    return this._http.get<{ review: IReview }>(url).pipe(
      map((data) => {
        return data.review;
      })
    );
  }

  public createReview(reviewForm: NgForm, restaurantId: string): Observable<IReview> {
    const url = API.createReview;

    return this._http
      .post<{ review: IReview }>(url, reviewForm, { params: { restaurantId } })
      .pipe(
        map((data) => {
          return data.review;
        })
      );
  }

  public updateReview(reviewForm: NgForm, reviewId: string): Observable<IReview> {
    const url = API.updateReview.replace(':reviewId', reviewId);

    return this._http.put<{ review: IReview }>(url, reviewForm).pipe(
      map((data) => {
        return data.review;
      })
    );
  }

  public deleteReview(reviewId: string, deleteReply?: 1): Observable<any> {
    const url = API.deleteReview.replace(':reviewId', reviewId);

    const queryParams: { [param: string]: string } = {};

    if (deleteReply) {
      queryParams.deleteReply = `${deleteReply}`;
    }

    return this._http.delete(url, { params: queryParams });
  }
}
