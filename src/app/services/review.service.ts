import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { API } from '../../environments/environment';
import IReview from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(private _http: HttpClient) {}

  /**
   * Returns list of reviews
   * @returns {Observable<{ reviews: IReview[] }>}
   * @memberof ReviewService
   */
  public getReviews(
    restaurantId: string,
    pendingCount: 1 | undefined,
    reviewsList: 1 | undefined
  ): Observable<{ reviews: IReview[] }> {
    const url = API.getReviews;

    const queryParams: any = { restaurantId };

    if (pendingCount) {
      queryParams.pendingCount = `${pendingCount}`;
    }
    if (reviewsList) {
      queryParams.reviewsList = `${reviewsList}`;
    }

    return this._http.get<{ reviews: IReview[] }>(url, { params: queryParams });
  }

  public getReview(reviewId: string): Observable<{ review: IReview }> {
    const url = API.getReview.replace(':reviewId', reviewId);

    return this._http.get<{ review: IReview }>(url);
  }

  public createReview(reviewForm: NgForm, restaurantId: string): Observable<{ review: IReview }> {
    const url = API.createReview;

    return this._http.post<{ review: IReview }>(url, reviewForm, { params: { restaurantId } });
  }

  public updateReview(reviewForm: NgForm, reviewId: string): Observable<{ review: IReview }> {
    const url = API.updateReview.replace(':reviewId', reviewId);

    return this._http.put<{ review: IReview }>(url, reviewForm);
  }

  public deleteReview(reviewId: string, deleteReply: 1 | undefined): Observable<any> {
    const url = API.deleteReview.replace(':reviewId', reviewId);

    const queryParams: any = {};

    if (deleteReply) {
      queryParams.deleteReply = `${deleteReply}`;
    }

    return this._http.delete(url, { params: queryParams });
  }
}
