import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'assetPathResolve',
})
export class AssetPathResolvePipe implements PipeTransform {
  /**
   *
   * @param {string | undefined} fileName - File name that you would like to resolve
   * @param {('image' | 'file input')} fileType - File type e.g. 'image'
   * @param {'user' | 'restaurant'} placeHolder - Image place holder in case fileName is not found
   * @returns {string} e.g. /static/images/example.jpeg
   * @memberof AssetPathResolvePipe
   */
  transform(
    fileName?: string,
    fileType?: 'image' | 'file input',
    placeHolder?: 'user' | 'restaurant'
  ): string {
    if (fileName) {
      switch (fileType) {
        case 'image': {
          return `/static/images/${fileName}`;
        }
        case 'file input': {
          return fileName;
        }
        default: {
          return '';
        }
      }
    } else {
      switch (placeHolder) {
        case 'user': {
          return '/assets/images/placeholders/user.png';
        }
        case 'restaurant': {
          return '/assets/images/placeholders/restaurant.png';
        }
        default: {
          return '/assets/images/placeholders/general.png';
        }
      }
    }
  }
}
