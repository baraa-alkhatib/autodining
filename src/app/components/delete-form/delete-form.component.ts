import { Component, ChangeDetectionStrategy, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-form',
  templateUrl: './delete-form.component.html',
  styleUrls: ['./delete-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteFormComponent {
  public target!: 'user' | 'review' | 'restaurant' | 'reply';

  constructor(
    @Optional() private _matDialogRef: MatDialogRef<DeleteFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { target: 'user' | 'review' | 'restaurant' | 'reply' }
  ) {
    this.target = data.target;
  }

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
   * Confirms deletion and reports back
   * @type {void}
   * @memberof DeleteFormComponent
   */
  public onConfirm(): void {
    if (this._matDialogRef) {
      this._matDialogRef.close(true);
    }
  }
}
