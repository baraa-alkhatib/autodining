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
  @Output() public sidenavToggle = new EventEmitter();

  /**
   * Emits a login popup window open event
   * @memberof HeaderComponent
   */
  @Output() public loginPopupOpen = new EventEmitter();

  /**
   * Emits a filter bottom sheet toggle event
   * @memberof HeaderComponent
   */
  @Output() public filterBottomSheeToggle = new EventEmitter();

  /**
   * Toggles side navbar menu
   * @memberof HeaderComponent
   */
  public onToggleSidenav = (): void => {
    this.sidenavToggle.emit();
  };

  /**
   * Opens login popup window
   * @memberof HeaderComponent
   */
  public onOpenLoginPopup = (): void => {
    this.loginPopupOpen.emit();
  };

  /**
   * Toggles filter bottom sheet
   * @memberof HeaderComponent
   */
  public onToggleFilter = (): void => {
    this.filterBottomSheeToggle.emit();
  };
}
