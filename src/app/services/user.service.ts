import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from '../models/user.model';
import { API } from '../../environments/environment';
import toFormData from '../utils/form-data.utils';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _http: HttpClient) {}

  /**
   * Returns list of users
   * @returns {Observable<IUser[]>}
   * @memberof UserService
   */
  public getUsers(): Observable<IUser[]> {
    const url = API.getUsers;

    return this._http.get<{ users: IUser[] }>(url).pipe(
      map((data) => {
        return data.users;
      })
    );
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

    return this._http.delete<void>(url);
  }
}
