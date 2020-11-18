import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarRatingComponent implements OnInit {
  /**
   * Holds the number of restaurant's average rating
   * @type {number}
   * @memberof StarRatingComponent
   */
  @Input() public rating!: number;

  /**
   *
   * Holds the number of total stars full/half/empty
   * @type {number}
   * @memberof StarRatingComponent
   */
  @Input() public starCount!: number;

  /**
   * Holds the color of the stars matches angular material button color property
   * @type {string}
   * @memberof StarRatingComponent
   */
  @Input() public color!: string;

  /**
   * Holds a boolean to decide whether to make stars for presentation only (no events emitted on click)
   * @type {boolean}
   * @memberof StarRatingComponent
   */
  @Input() public presentOnly!: boolean;

  /**
   * Emits a rating updated value with the number of full stars filled
   * @type {EventEmitter<number>}
   * @memberof StarRatingComponent
   */
  @Output() public ratingUpdated: EventEmitter<number>;

  /**
   * Holds the amount of time the snack bar will appear on the screen in milliseconds
   * @private
   * @type {number}
   * @memberof StarRatingComponent
   */
  private _snackBarDuration!: number;

  public starsArr: number[];

  constructor(private snackBar: MatSnackBar) {
    // set snackbar duration to 1500 milliseconds
    this._snackBarDuration = 1500;

    this.ratingUpdated = new EventEmitter();

    this.starsArr = [];
  }

  /**
   * Initializes the stars array
   * @memberof StarRatingComponent
   */
  public ngOnInit() {
    for (let index = 0; index < this.starCount; index += 1) {
      this.starsArr.push(index);
    }
  }

  /**
   * Returns the order of the star in the array depending on its index
   * @param {number} index
   * @returns {string}
   * @memberof StarRatingComponent
   */
  public getStarNumber(index: number): string {
    return `${index + 1}`;
  }

  /**
   * When a user click on a star
   * - Opens a snackbar to inform the user of the rating they gave
   * - Emits the rating updated value with the number of full stars filled
   * @param {number} rating
   * @returns
   * @memberof StarRatingComponent
   */
  public onClick(rating: number): false {
    this.snackBar.open(`You rated ${rating}/${this.starCount}`, '', {
      duration: this._snackBarDuration,
    });

    this.ratingUpdated.emit(rating);

    return false;
  }

  /**
   * Returns the star icon name in one of three forms (filled/half/empty) depending on the rating and
   * the number of total stars
   * @param {number} index
   * @returns
   * @memberof StarRatingComponent
   */
  public showStarIcon(index: number): 'star' | 'star_half' | 'star_border' {
    const decimalPart = this.rating % 1;

    if (
      Math.floor(this.rating) >= index + 1 ||
      (this.rating + 1 >= index + 1 && decimalPart >= 0.75)
    ) {
      return 'star';
    }

    if (this.rating + 1 >= index + 1 && decimalPart >= 0.25 && decimalPart < 0.75) {
      return 'star_half';
    }

    return 'star_border';
  }
}
