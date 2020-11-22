import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

/**
 * - This is a smart 404 (Not Found) page component.
 * - This component implements Levenshtein distance algorithm to suggest alternatives to typos in url.
 * - @see {https://medium.com/angular-in-depth/angular-smart-404-page-85a45b109fd8}
 * @export
 * @class Page404Component
 * @implements {OnInit}
 */
@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Page404Component implements OnInit {
  /**
   * Holds a suggested alternative path resolved from url
   * @type {string}
   * @memberof Page404Component
   */
  public path!: string;

  constructor(private _activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    // listen to activated route data observable
    this._activatedRoute.data.pipe(take(1)).subscribe((data: Partial<{ path: string }>) => {
      // update the alternative path suggested by the corresponding data resolver
      this.path = <string>data.path;
    });
  }
}
