import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-filter-bottom-sheet',
  templateUrl: './filter-bottom-sheet.component.html',
  styleUrls: ['./filter-bottom-sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBottomSheetComponent {
  constructor(private _bottomSheet: MatBottomSheet) {}

  /**
   * Opens filter component in a mat bottom sheet
   * @memberof FilterBottomSheetComponent
   */
  public open(): void {
    this._bottomSheet.open(FilterComponent);
  }
}
