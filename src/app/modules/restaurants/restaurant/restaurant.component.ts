import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { IUser } from '../../../../../server/models/user.model';
import { ReviewFormComponent } from '../../../components/review-form/review-form.component';
import IRestaurant from '../../../models/restaurant.model';
import IReview from '../../../models/review.model';
import { AuthService } from '../../../services/auth.service';
import { ReviewService } from '../../../services/review.service';

@Component({
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss'],
})
export class RestaurantComponent implements OnInit, OnDestroy {
  /**
   * An array of all subscription instances on this component;
   * it's mainly used to clean up subscriptions after the component is destroyed
   * @private
   * @type {Subscription[]}
   * @memberof RestaurantComponent
   */
  private readonly _subscriptions$: Subscription[];

  public restaurant!: Partial<IRestaurant>;

  public reviews!: IReview[];

  public user$!: Observable<IUser>;

  public image!: {
    fileName: string;
    fileType: 'image' | 'file input';
  };

  constructor(
    private _authServ: AuthService,
    private _reviewServ: ReviewService,
    private _acitvatedRoute: ActivatedRoute,
    private _dialog: MatDialog
  ) {
    // initailize subscriptions array
    this._subscriptions$ = [];

    // initiate
    this.user$ = this._authServ.user$;
  }

  public ngOnInit(): void {
    // get restaurant data from activated route
    this._subscriptions$.push(
      this._acitvatedRoute.data.subscribe((data: Partial<{ restaurant: IRestaurant }>) => {
        this.restaurant = <IRestaurant>data.restaurant;

        // update preview image
        this.image = { fileName: <string>this.restaurant.imageUrl, fileType: 'image' };

        // load reviews/replies
        this._reviewServ
          .getReviews(<string>this.restaurant._id, undefined, 1)
          .subscribe((reviews) => {
            this.reviews = reviews;
          });
      })
    );
  }

  /**
   * Opens review edit dialog in a pop window
   * @memberof RestaurantComponent
   */
  public onOpenEditDialog(): void {
    const dialog = this._dialog.open(ReviewFormComponent, {
      width: '800px',
      panelClass: 'dialog-no-padding',
      data: {
        isReply: false,
        mode: 'create',
        review: this.reviews,
        owner: this.restaurant.user,
        restaurant: this.restaurant,
      },
    });

    this._subscriptions$.push(
      dialog.beforeClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.getReviews();
        }
      })
    );
  }

  public getReviews(): void {
    // refresh the list
    this._reviewServ.getReviews(<string>this.restaurant._id, undefined, 1).subscribe((reviews) => {
      this.reviews = reviews;
    });
  }

  public onReviewChanged(): void {
    this.getReviews();
  }

  /**
   * Clean up subscriptions when component is destroyed
   * @memberof RestaurantComponent
   */
  public ngOnDestroy(): void {
    this._subscriptions$.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
