import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import IReview from '../../models/review.model';
import { IUser } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { ReviewService } from '../../services/review.service';
import { DeleteFormComponent } from '../delete-form/delete-form.component';
import { ReviewFormComponent } from '../review-form/review-form.component';

@Component({
  selector: 'app-review-item',
  templateUrl: './review-item.component.html',
  styleUrls: ['./review-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewItemComponent {
  @Input() public review!: IReview;

  @Input() public isReply!: boolean;

  @Input() public showOnlyComment!: boolean;

  @Input() public owner!: IUser;

  @Output() public reviewChanged!: EventEmitter<IReview>;

  /**
   * An array of all subscription instances on this component;
   * it's mainly used to clean up subscriptions after the component is destroyed
   * @private
   * @type {Subscription[]}
   * @memberof ReviewItemComponent
   */
  private readonly _subscriptions$!: Subscription[];

  public deleteLoading!: boolean;

  public user$!: Observable<IUser>;

  constructor(
    private _authServ: AuthService,
    private _reviewServ: ReviewService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    // initailize subscriptions array
    this._subscriptions$ = [];

    // initiate
    this.reviewChanged = new EventEmitter();

    this.user$ = this._authServ.user$;
  }

  /**
   * Opens review edit dialog in a pop window
   * @memberof ReviewItemComponent
   */
  public onOpenEditDialog(isReply: boolean, mode: 'create' | 'edit'): void {
    const dialog = this._dialog.open(ReviewFormComponent, {
      width: '800px',
      panelClass: 'dialog-no-padding',
      data: {
        isReply,
        mode,
        review: this.review,
        owner: this.owner,
      },
    });

    dialog.beforeClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.reviewChanged.emit(this.review);
        if (mode === 'edit') {
          // show info message
          this._snackBar.open(
            `You have updated ${
              this.isReply ? "owner's reply" : "customer's review"
            } successfully!`,
            '',
            {
              duration: 2500,
            }
          );
        }
      }
    });
  }

  /**
   * Opens review delete form in a popup window
   * @memberof ReviewItemComponent
   */
  public onOpenDeleteDialog(): void {
    const deleteDialog = this._dialog.open(DeleteFormComponent, {
      data: { target: this.isReply ? 'reply' : 'review' },
      width: '500px',
    });

    this._subscriptions$.push(
      deleteDialog.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          // set delete to loading
          this.deleteLoading = true;

          this._reviewServ.deleteReview(this.review._id, this.isReply ? 1 : undefined).subscribe(
            () => {
              // emit deletion event
              this.reviewChanged.emit(this.review);

              // show info message
              this._snackBar.open(
                `You have deleted ${
                  this.isReply ? "owner's reply" : "customer's review"
                } successfully!`,
                '',
                {
                  duration: 2500,
                }
              );
            },
            () => {
              this.deleteLoading = false;

              this._snackBar.open(`Something went wrong!`, '', {
                duration: 2500,
              });
            }
          );
        }
      })
    );
  }
}
