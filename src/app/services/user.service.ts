import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { IUser } from '../../../server/models/user.model';
import { API } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _http: HttpClient) {}

  /**
   * Returns list of users
   * @returns {Observable<{ users: IUser[] }>}
   * @memberof UserService
   */
  public getUsers(): Observable<{ users: IUser[] }> {
    const url = API.getUsers;

    return this._http.get<{ users: IUser[] }>(url);
  }

  public getUser(userId: string): Observable<{ user: IUser }> {
    const url = API.getUser.replace(':userId', userId);

    return this._http.get<{ user: IUser }>(url);
  }

  public updateUser(userForm: NgForm, userId: string): Observable<{ user: IUser }> {
    const url = API.updateUser.replace(':userId', userId);

    return this._http.put<{ user: IUser }>(url, userForm);
  }

  public deleteUser(userId: string): Observable<void> {
    const url = API.deleteUser.replace(':userId', userId);

    return this._http.delete<void>(url);
  }
}
