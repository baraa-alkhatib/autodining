import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  /**
   * Emits a side navbar toggle event
   * @memberof HeaderComponent
   */
  @Output() public toggleSidenav: EventEmitter<any>;

  /**
   * Emits a login dialog open event
   * @memberof HeaderComponent
   */
  @Output() public openLoginDialog: EventEmitter<any>;

  /**
   * Emits a filter bottom sheet toggle event
   * @memberof HeaderComponent
   */
  @Output() public toggleFilterBottomSheet: EventEmitter<any>;

  constructor() {
    this.toggleSidenav = new EventEmitter();

    this.openLoginDialog = new EventEmitter();

    this.toggleFilterBottomSheet = new EventEmitter();
  }

  /**
   * Emits a value to toggles side navbar menu
   * @memberof HeaderComponent
   */
  public onToggleSidenav = (): void => {
    this.toggleSidenav.emit();
  };

  /**
   * Emits a value to open login popup window
   * @memberof HeaderComponent
   */
  public onOpenLoginDialog = (): void => {
    this.openLoginDialog.emit();
  };

  /**
   * Emits a value to toggles filter bottom sheet
   * @memberof HeaderComponent
   */
  public onToggleFilter = (): void => {
    this.toggleFilterBottomSheet.emit();
  };
}
