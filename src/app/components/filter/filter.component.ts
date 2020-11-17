import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  constructor(private _bottomSheetRef: MatBottomSheetRef<FilterComponent>) {}

  /**
   * Closes mat dialog if filter was opened in it
   * @memberof FilterListComponent
   */
  public close(): void {
    this._bottomSheetRef.dismiss();
  }
}
