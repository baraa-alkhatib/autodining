import { Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit, OnDestroy {
  /**
   * An array of all subscription instances on this component;
   * it's mainly used to clean up subscriptions after the component is destroyed
   * @private
   * @type {Subscription[]}
   * @memberof SignupFormComponent
   */
  private readonly _subscriptions$: Subscription[];

  public form!: FormGroup;

  public hidePassword!: boolean;

  public showSpinner!: boolean;

  public errorMessage!: string;

  constructor(
    private _authServ: AuthService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    @Optional() private _matDialogRef: MatDialogRef<LoginFormComponent>
  ) {
    // initailize subscriptions array
    this._subscriptions$ = [];
  }

  /**
   * Closes mat dialog if login form was opened in it
   * @memberof FilterListComponent
   */
  public close(): void {
    if (this._matDialogRef) {
      this._matDialogRef.close();
    }
  }

  /**
   * Closes mat dialog if login form was opened in it
   * @memberof FilterListComponent
   */
  public onClose(): void {
    if (this._matDialogRef) {
      this._matDialogRef.close();
    }
  }

  public async ngOnInit(): Promise<void> {
    // set up error message if found in the param maps
    this.errorMessage = this._activatedRoute.snapshot.paramMap.get('errorMsg') || '';

    // set up form controls with validators
    this.form = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });

    // hide password inititally
    this.hidePassword = true;
  }

  public get email(): AbstractControl | null {
    return this.form.get('email');
  }

  public get password(): AbstractControl | null {
    return this.form.get('password');
  }

  public onLogin(): void {
    this.errorMessage = '';

    this.showSpinner = true;

    if (this.form.valid) {
      this._authServ
        .login(this.form.value)
        .pipe(
          finalize(() => {
            this.showSpinner = false;
          })
        )
        .subscribe(
          () => {
            // close dialog
            this.close();

            this._router.navigateByUrl('/', { replaceUrl: true }).then(() => {
              this._snackBar.open(`Welcome ${this._authServ.userInfo.name} to AutoDining!`, '', {
                duration: 2500,
              });
            });
          },
          (err) => {
            switch (err && err.status) {
              case 400: {
                this.errorMessage = 'The email address or password is incorrect.';
                break;
              }

              case 404: {
                this.errorMessage = 'There is no account registered with this email.';
                break;
              }

              case 401: {
                this.errorMessage = 'You do not have the necessary permissions!';
                break;
              }

              case 500: {
                this.errorMessage = 'Something went wrong. Please try again later!';
                break;
              }

              default: {
                this.errorMessage = 'Something went wrong!';
              }
            }
          }
        );
    }
  }

  /**
   * Clean up subscriptions when component is destroyed
   * @memberof SignupFormComponent
   */
  public ngOnDestroy(): void {
    this._subscriptions$.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
