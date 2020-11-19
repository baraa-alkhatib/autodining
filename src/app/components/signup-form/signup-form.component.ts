import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { CustomValidators } from '../../utils/custom-validators';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
})
export class SignupFormComponent implements OnInit, OnDestroy {
  /**
   * An array of all subscription instances on this component;
   * it's mainly used to clean up subscriptions after the component is destroyed
   * @private
   * @type {Subscription[]}
   * @memberof SignupFormComponent
   */
  private readonly _subscriptions$: Subscription[];

  public userType!: 'regular' | 'owner';

  public form!: FormGroup;

  public passwordFormGroup!: FormGroup;

  public showSpinner!: boolean;

  public errorMessage!: string;

  constructor(
    private _authServ: AuthService,
    private _router: Router,
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    // initailize subscriptions array
    this._subscriptions$ = [];

    // set up the initial user type
    this.userType = 'regular';
  }

  public async ngOnInit(): Promise<void> {
    // set up form controls with validators
    this.passwordFormGroup = this._fb.group({
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          Validators.pattern(CustomValidators.STRONG_PASSWORD_PATTERN),
        ],
      ],
      confirmPassword: ['', [CustomValidators.matchField('newPassword')]],
    });

    this.form = this._fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern(CustomValidators.USER_REAL_NAME_PATTERN),
          Validators.maxLength(70),
        ],
      ],
      type: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(70)]],
      password: this.passwordFormGroup,
    });

    // trigger validation of confirm password when new password input value changes
    this._subscriptions$.push(
      (<FormControl>this.newPassword).valueChanges.subscribe(() => {
        this.confirmPassword?.updateValueAndValidity();
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
    return this.passwordFormGroup;
  }

  public get newPassword(): AbstractControl | null | undefined {
    return this.passwordFormGroup?.get('newPassword');
  }

  public get confirmPassword(): AbstractControl | null | undefined {
    return this.passwordFormGroup?.get('confirmPassword');
  }

  public onSignup(): void {
    this._authServ.signup(this.form.value).subscribe(
      () => {
        this._router.navigateByUrl('/login', { replaceUrl: true }).then(() => {
          this._snackBar.open(`You have registered successfully!`, '', {
            duration: 2500,
          });
        });
      },
      (err) => {
        switch (err && err.status) {
          case 403: {
            if (err?.error?.error === 'already exists') {
              this.errorMessage = 'This user already exists!';
            } else {
              this.errorMessage = 'You do not have the necessary permissions!';
            }
            break;
          }

          case 500: {
            this.errorMessage = 'Something went wrong. Please try again!';
            break;
          }

          default: {
            this.errorMessage = 'Something went wrong!';
          }
        }
      }
    );
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
