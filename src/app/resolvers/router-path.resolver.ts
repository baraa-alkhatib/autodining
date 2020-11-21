import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ROUTER_MAIN_PATHS } from '../../environments/environment';
import levenshtein from '../utils/levenshtein.utils';

@Injectable({
  providedIn: 'root',
})
export class RouterPathResolver implements Resolve<string | null> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string | null {
    // get the typo path
    const typoPath = state.url.replace('/', '');

    // get Levenshtein distance threshold
    const threshold = this.getThreshold(typoPath);

    // filter out the unlikely paths based on threshold
    const dictionary = Object.values(ROUTER_MAIN_PATHS).filter(
      (path) => Math.abs(path.length - typoPath.length) < threshold
    );

    // if no paths are close enough return null
    if (!dictionary.length) return null;

    // sort close paths by Levenshtein distance
    this.sortByDistances(typoPath, dictionary);

    // return closest path to the typo path
    return `/${dictionary[0]}`;
  }

  /**
   * Get the Levenshtein distance threshold to help identify the closest real paths to the typo path
   * @private
   * @param {string} path
   * @returns {number}
   * @memberof RouterPathResolver
   */
  private getThreshold(path: string): number {
    if (path.length < 5) return 3;

    return 5;
  }

  /**
   * Sort by Levenshtein distance
   * @private
   * @param {string} typoPath
   * @param {string[]} dictionary
   * @memberof RouterPathResolver
   */
  private sortByDistances(typoPath: string, dictionary: string[]): void {
    const pathsDistance = {} as { [name: string]: number };

    dictionary.sort((a, b) => {
      if (!(a in pathsDistance)) {
        pathsDistance[a] = levenshtein(a, typoPath);
      }
      if (!(b in pathsDistance)) {
        pathsDistance[b] = levenshtein(b, typoPath);
      }

      return pathsDistance[a] - pathsDistance[b];
    });
  }
}
