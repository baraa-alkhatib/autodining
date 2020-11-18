import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginFormComponent } from './components/login-form/login-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'AutoDining';

  constructor(private _dialog: MatDialog) {}

  /**
   * Opens login form in a popup window
   * @memberof AppComponent
   */
  public onOpenLoginDialog(): void {
    this._dialog.open(LoginFormComponent);
  }
}
