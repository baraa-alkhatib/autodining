import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginFormComponent } from '../login-form/login-form.component';

@Component({
  selector: 'app-login-window',
  templateUrl: './login-window.component.html',
  styleUrls: ['./login-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginWindowComponent {
  constructor(private _dialog: MatDialog) {}

  /**
   * Opens login form component in a mat dialog window
   * @memberof LoginWindowComponent
   */
  public open(): void {
    this._dialog.open(LoginFormComponent);
  }
}
