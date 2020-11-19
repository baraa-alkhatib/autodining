import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationMenuComponent {
  /**
   * Emits a side navigation menu close event
   * @type {EventEmitter<any>}
   * @memberof NavigationMenuComponent
   */
  @Output() public sidenavClose: EventEmitter<any>;

  constructor() {
    // Initialize sidenavClose
    this.sidenavClose = new EventEmitter();
  }

  /**
   * Emits a value to close side navigation menu
   * @memberof NavigationMenuComponent
   */
  public onSidenavClose = () => {
    this.sidenavClose.emit();
  };
}
