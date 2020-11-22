import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigatorComponent {
  @Input() link?: string;

  @Input() icon?: string;

  @Input() title?: string;
}
