import { ChangeDetectionStrategy, Component, Inject, OnInit, Optional } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { IUser } from '../../models/user.model';
import IRestaurant from '../../models/restaurant.model';
import IReview from '../../models/review.model';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewFormComponent implements OnInit {
  public owner!: IUser;

  public review!: IReview;

  public restaurant!: IRestaurant;

  public isReply!: boolean;

  public form!: FormGroup;

  public mode!: 'create' | 'edit';

  public stars!: 1 | 2 | 3 | 4 | 5;

  public showSpinner!: boolean;

  constructor(
    private _fb: FormBuilder,
    private _reviewServ: ReviewService,
    private _snackBar: MatSnackBar,
    @Optional() private _matDialogRef: MatDialogRef<ReviewFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      isReply: boolean;
      mode: 'create' | 'edit';
      review: IReview;
      owner: IUser;
      restaurant: IRestaurant;
    }
  ) {
    // initiate
    this.isReply = data.isReply;

    this.mode = data.mode;

    this.review = data.review;

    this.restaurant = data.restaurant;

    this.owner = data.owner;

    this.stars = 1;

    if (this.mode === 'edit') {
      this.stars = <any>this.review.rating;
    }
  }

  ngOnInit(): void {
    // set up form controls with validators

    if (this.isReply) {
      this.form = this._fb.group({
        reply: [
          this.review.reply || '',
          [Validators.required, Validators.minLength(4), Validators.maxLength(70)],
        ],
      });
    } else {
      this.form = this._fb.group({
        comment: [
          this.review?.comment || '',
          [Validators.required, Validators.minLength(4), Validators.maxLength(70)],
        ],
        rating: [this.review?.rating || 1, [Validators.required]],
      });
    }
  }

  public get reply(): AbstractControl | null {
    return this.form.get('reply');
  }

  public get comment(): AbstractControl | null {
    return this.form.get('comment');
  }

  public get rating(): AbstractControl | null {
    return this.form.get('rating');
  }

  /**
   * - Updates restaurant information.
   * - Extracts the necessary data automatically from the form controls on the component itself.
   * @memberof RestaurantFormComponent
   */
  public onSubmit(): void {
    this.showSpinner = true;

    // create Or update reply
    if (this.isReply) {
      this.updateReview();

      // stop execution
      return;
    }

    // create Or update review
    if (!this.isReply && this.mode === 'edit') {
      this.updateReview();
    } else {
      this.createReview();
    }
  }

  public createReview(): void {
    this._reviewServ
      .createReview(this.form.value, <string>this.restaurant._id)
      .pipe(
        finalize(() => {
          this.showSpinner = false;
        })
      )
      .subscribe(
        () => {
          // show info message
          this.close(this.review);
        },
        () => {
          this._snackBar.open('Something went wrong', '', {
            duration: 4000,
          });
        }
      );
  }

  public updateReview(): void {
    this._reviewServ
      .updateReview(this.form.value, this.review._id)
      .pipe(
        finalize(() => {
          this.showSpinner = false;
        })
      )
      .subscribe(
        () => {
          // show info message
          this._snackBar.open(`Review Updated!`, '', {
            duration: 2500,
          });

          this.close(this.review);
        },
        () => {
          this._snackBar.open('Something went wrong', '', {
            duration: 4000,
          });
        }
      );
  }

  public onRatingUpdated(stars: 1 | 2 | 3 | 4 | 5): void {
    // update number of stars
    this.stars = stars;

    // update form
    this.form.patchValue({ rating: this.stars });
  }

  /**
   * Closes mat dialog if this component was opened in it
   * @memberof ReviewFormComponent
   */
  public close(data: any): void {
    if (this._matDialogRef) {
      this._matDialogRef.close(data);
    }
  }
}
