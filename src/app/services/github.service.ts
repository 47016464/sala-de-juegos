import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GithubUser } from '../models/github-user';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private apiUrl = 'https://api.github.com/users/47016464';

  constructor(private http: HttpClient) {}

  getUserData(): Observable<GithubUser> {
    return this.http.get<GithubUser>(this.apiUrl);
  }
}
