import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DeleteFormComponent } from '../../../components/delete-form/delete-form.component';
import { IUser } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { CustomValidators } from '../../../utils/custom-validators.utils';

@Component({
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit, OnDestroy {
  /**
   * An array of all subscription instances on this component;
   * it's mainly used to clean up subscriptions after the component is destroyed
   * @private
   * @type {Subscription[]}
   * @memberof UserFormComponent
   */
  private readonly _subscriptions$: Subscription[];

  public user!: IUser;

  public editor$!: Observable<IUser>;

  public image!: {
    fileName: string;
    fileType: 'image' | 'file input';
  };

  public form!: FormGroup;

  public passwordFormGroup!: FormGroup;

  public showSpinner!: boolean;

  constructor(
    private _userServ: UserService,
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

    // set the editor user
    this.editor$ = this._authServ.user$;
  }

  public async ngOnInit(): Promise<void> {
    // set up form controls with validators

    this.form = this._fb.group({
      image: new FormControl(null, [CustomValidators.requiredFileType('png', 'jpg', 'jpeg')]),
      name: [
        '',
        [
          Validators.minLength(4),
          Validators.pattern(CustomValidators.USER_REAL_NAME_PATTERN),
          Validators.maxLength(70),
        ],
      ],
      email: ['', [Validators.email, Validators.maxLength(70)]],
      password: [
        '',
        [
          Validators.minLength(6),
          Validators.maxLength(20),
          Validators.pattern(CustomValidators.STRONG_PASSWORD_PATTERN),
        ],
      ],
    });

    // get user data from activated route
    this._subscriptions$.push(
      this._acitvatedRoute.data.subscribe((data: Partial<{ user: IUser }>) => {
        this.user = <IUser>data.user;

        this.form.patchValue({
          name: this.user.name,
          email: this.user.email,
        });

        // update preview image
        this.image = { fileName: this.user.imageUrl, fileType: 'image' };
      })
    );
  }

  public get name(): AbstractControl | null {
    return this.form.get('name');
  }

  public get email(): AbstractControl | null {
    return this.form.get('email');
  }

  public get password(): AbstractControl | null {
    return this.form.get('password');
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
   * - Updates user information.
   * - Extracts the necessary data automatically from the form controls on the component itself.
   * @memberof UserFormComponent
   */
  public onUpdate(): void {
    this.showSpinner = true;

    this._userServ
      .updateUser(this.form.value, this.user._id)
      .pipe(
        finalize(() => {
          this.showSpinner = false;
        })
      )
      .subscribe(
        (user: IUser) => {
          let navigateTo = '/';

          if (this._authServ.user._id === this.user._id) {
            // update user
            this._authServ.patchUser(user);
            // redirect to main page
            navigateTo = '/';
          } else {
            // redirect to users
            navigateTo = '/users';
          }

          // update form with new user data
          this.form.patchValue({
            name: user.name,
            email: user.email,
          });

          // update user locally
          this.user = user;

          // update preview image
          this.image = { fileName: user.imageUrl, fileType: 'image' };

          this._router.navigateByUrl(navigateTo, { replaceUrl: true }).then(() => {
            // show info message
            this._snackBar.open(`User updated!`, '', {
              duration: 2500,
            });
          });
        },
        (err) => {
          let errorMessage = '';
          switch (err && err.status) {
            case 403: {
              if (err?.error?.error === 'this email is already registered with another account.') {
                errorMessage =
                  'The email you entered is already registered with another account, please try another email.';
                break;
              } else {
                errorMessage = 'You do not have the necessary permissions!';
              }
              break;
            }
            default: {
              errorMessage = 'Something went wrong';
            }
          }
          this._snackBar.open(errorMessage, '', {
            duration: 4000,
          });
        }
      );
  }

  /**
   * Opens user delete form in a popup window
   * @memberof UserFormComponent
   */
  public onOpenDeleteDialog(): void {
    const deleteDialog = this._dialog.open(DeleteFormComponent, {
      data: { target: 'user', name: 'your account' },
      width: '500px',
    });

    this._subscriptions$.push(
      deleteDialog.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this._userServ.deleteUser(this.user._id).subscribe(
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
   * @memberof UserFormComponent
   */
  public ngOnDestroy(): void {
    this._subscriptions$.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
