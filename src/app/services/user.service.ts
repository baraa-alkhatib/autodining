import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { API } from '../../environments/environment';
import { IUser } from '../models/user.model';
import toFormData from '../utils/form-data.utils';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _authServ: AuthService, private _http: HttpClient) {}

  /**
   * Returns list of users
   * @param {({
   *     page: number;
   *     sortBy: 'name' | 'createdAt' | 'type' | 'restaurantsCount';
   *     order: 'asc' | 'desc';
   *     search?: string;
   *   })} filter - pages in filter are 0 based
   * @returns {Observable<{users: IUser[], total: number}>}
   * @memberof UserService
   */
  public getUsers(filter: {
    page: number;
    sortBy: 'name' | 'createdAt' | 'type' | 'restaurantsCount';
    order: 'asc' | 'desc';
    search?: string;
  }): Observable<{ users: IUser[]; total: number }> {
    const url = API.getUsers;

    const queryParams: { [param: string]: string } = {
      page: `${filter.page}`,
      sortBy: `${filter.sortBy}`,
      order: `${filter.order}`,
    };

    if (filter?.search) {
      queryParams.status = filter.search;
    }

    return this._http.get<{ users: IUser[]; total: number }>(url, { params: queryParams });
  }

  public getUser(userId: string): Observable<IUser> {
    const url = API.getUser.replace(':userId', userId);

    return this._http.get<{ user: IUser }>(url).pipe(
      map((data) => {
        return data.user;
      })
    );
  }

  public updateUser(userForm: NgForm, userId: string): Observable<IUser> {
    const url = API.updateUser.replace(':userId', userId);

    return this._http.put<{ user: IUser }>(url, toFormData(userForm)).pipe(
      map((data) => {
        return data.user;
      })
    );
  }

  public deleteUser(userId: string): Observable<void> {
    const url = API.deleteUser.replace(':userId', userId);

    return this._http.delete<void>(url).pipe(
      tap(() => {
        if (userId === this._authServ.user._id) {
          this._authServ.logout();
        }
      })
    );
  }
}
