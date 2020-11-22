import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DeleteFormComponent } from '../../../components/delete-form/delete-form.component';
import IRestaurant from '../../../models/restaurant.model';
import { AuthService } from '../../../services/auth.service';
import { RestaurantService } from '../../../services/restaurant.service';
import { CustomValidators } from '../../../utils/custom-validators.utils';

@Component({
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss'],
})
export class RestaurantFormComponent implements OnInit, OnDestroy {
  /**
   * An array of all subscription instances on this component;
   * it's mainly used to clean up subscriptions after the component is destroyed
   * @private
   * @type {Subscription[]}
   * @memberof RestaurantFormComponent
   */
  private readonly _subscriptions$: Subscription[];

  public restaurant!: IRestaurant;

  public mode!: 'edit' | 'create';

  public image!: {
    fileName: string;
    fileType: 'image' | 'file input';
  };

  public form!: FormGroup;

  public passwordFormGroup!: FormGroup;

  public showSpinner!: boolean;

  constructor(
    private _restaurantServ: RestaurantService,
    private _authServ: AuthService,
    private _router: Router,
    private _acitvatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    // initailize subscriptions array
    this._subscriptions$ = [];

    // initialize image object
    this.image = {
      fileName: '',
      fileType: 'image',
    };

    // initialize
    this.mode = 'create';
  }

  public async ngOnInit(): Promise<void> {
    // set up form controls with validators
    this.form = this._fb.group({
      image: new FormControl(null, [CustomValidators.requiredFileType('png', 'jpg', 'jpeg')]),
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(70)]],
      description: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(500)]],
      address: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]],
      status: ['', [Validators.required]],
    });

    // get restaurant data from activated route
    this._subscriptions$.push(
      this._acitvatedRoute.data.subscribe((data: Partial<{ restaurant: IRestaurant }>) => {
        if (data?.restaurant) {
          this.mode = 'edit';

          this.restaurant = <IRestaurant>data.restaurant;

          this.form.patchValue({
            name: this.restaurant.name,
            email: this.restaurant.description,
            address: this.restaurant.address,
            description: this.restaurant.description,
            status: this.restaurant.status,
          });

          // update preview image
          this.image = { fileName: this.restaurant.imageUrl, fileType: 'image' };
        }
      })
    );
  }

  public get name(): AbstractControl | null {
    return this.form.get('name');
  }

  public get description(): AbstractControl | null {
    return this.form.get('description');
  }

  public get address(): AbstractControl | null {
    return this.form.get('address');
  }

  public get status(): AbstractControl | null {
    return this.form.get('status');
  }

  public onPreviewImage(file: File | null) {
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      // update preview image
      this.image = { fileName: <string>reader.result, fileType: 'file input' };
    };
  }

  /**
   * - Updates restaurant information.
   * - Extracts the necessary data automatically from the form controls on the component itself.
   * @memberof RestaurantFormComponent
   */
  public onSubmit(): void {
    this.showSpinner = true;

    if (this.mode === 'edit') {
      this.updateRestaurant();
    } else {
      this.createRestaurant();
    }
  }

  public createRestaurant(): void {
    this._restaurantServ
      .createRestaurant(this.form.value)
      .pipe(
        finalize(() => {
          this.showSpinner = false;
        })
      )
      .subscribe(
        (restaurant: IRestaurant) => {
          // update form with new restaurant data
          this.form.patchValue({
            name: restaurant.name,
            email: restaurant.description,
            address: restaurant.address,
            status: restaurant.status,
          });

          // update restaurant locally
          this.restaurant = restaurant;

          // update preview image
          this.image = { fileName: restaurant.imageUrl, fileType: 'image' };

          // navigate to main page
          this._router.navigateByUrl('/', { replaceUrl: true }).then(() => {
            // show info message
            this._snackBar.open(`Your restaurant has been created successfully!`, '', {
              duration: 2500,
            });
          });
        },
        () => {
          this._snackBar.open('Something went wrong', '', {
            duration: 4000,
          });
        }
      );
  }

  public updateRestaurant(): void {
    this._restaurantServ
      .updateRestaurant(this.form.value, this.restaurant._id)
      .pipe(
        finalize(() => {
          this.showSpinner = false;
        })
      )
      .subscribe(
        (restaurant: IRestaurant) => {
          // update form with new restaurant data
          this.form.patchValue({
            name: restaurant.name,
            email: restaurant.description,
            address: restaurant.address,
            status: restaurant.status,
          });

          // update restaurant locally
          this.restaurant = restaurant;

          // update preview image
          this.image = { fileName: restaurant.imageUrl, fileType: 'image' };

          // navigate to main page
          this._router.navigateByUrl('/', { replaceUrl: true }).then(() => {
            // show info message
            this._snackBar.open(`Restaurant updated!`, '', {
              duration: 2500,
            });
          });
        },
        () => {
          this._snackBar.open('Something went wrong', '', {
            duration: 4000,
          });
        }
      );
  }

  /**
   * Opens restaurant delete form in a popup window
   * @memberof RestaurantFormComponent
   */
  public onOpenDeleteDialog(): void {
    const deleteDialog = this._dialog.open(DeleteFormComponent, {
      data: { target: 'restaurant', name: 'your account' },
      width: '500px',
    });

    this._subscriptions$.push(
      deleteDialog.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this._restaurantServ.deleteRestaurant(this.restaurant._id).subscribe(
            () => {
              // redirect to main page
              this._router.navigateByUrl('/', { replaceUrl: true }).then(() => {
                this._snackBar.open(`Bye :(`, '', {
                  duration: 2500,
                });
              });
            },
            () => {
              this._snackBar.open(`Something went wrong!`, '', {
                duration: 2500,
              });
            }
          );
        }
      })
    );
  }

  /**
   * Clean up subscriptions when component is destroyed
   * @memberof RestaurantFormComponent
   */
  public ngOnDestroy(): void {
    this._subscriptions$.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
