import { InjectionToken } from '@angular/core';
import { StorageService } from 'ngx-webstorage-service';

/**
 * @see {https://www.npmjs.com/package/ngx-webstorage-service}
 * "One thing you have to keep in mind while designing your own application or library that makes use of this package,
 * is to think about reusability and maintainability of the classes that are going to depend on the StorageService interface
 * Instead of directly using the SESSION_STORAGE or LOCAL_STORAGE injection tokens it might be wise to introduce your own
 * injection token."
 */
export const STORAGE_PROVIDER_TOKEN = new InjectionToken<StorageService>('STORAGE_PROVIDER_TOKEN');
