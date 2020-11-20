import { ChangeDetectionStrategy, Component, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-logout-form',
  templateUrl: './logout-form.component.html',
  styleUrls: ['./logout-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutFormComponent {
  constructor(@Optional() private _matDialogRef: MatDialogRef<LogoutFormComponent>) {}

  /**
   * Closes mat dialog
   * @memberof DeleteFormComponent
   */
  public onClose(): void {
    if (this._matDialogRef) {
      this._matDialogRef.close();
    }
  }

  /**
   * Confirms logout and reports back
   * @type {void}
   * @memberof DeleteFormComponent
   */
  public onConfirm(): void {
    if (this._matDialogRef) {
      this._matDialogRef.close(true);
    }
  }
}
