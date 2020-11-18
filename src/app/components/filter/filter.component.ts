import { ChangeDetectionStrategy, Component, Optional } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  constructor(@Optional() private _bottomSheetRef: MatBottomSheetRef<FilterComponent>) {}

  /**
   * Closes mat dialog if filter was opened in it
   * @memberof FilterListComponent
   */
  public close(): void {
    if (this._bottomSheetRef) {
      this._bottomSheetRef.dismiss();
    }
  }
}
