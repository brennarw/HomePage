import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GithubApiService {

  private userURL = 'https://api.github.com/users/brennarw'
  private repoURL = 'https://api.github.com/repos/brennarw'

  constructor(private http: HttpClient) { }

  getRepo(repository: string): Observable<any> {
    return this.http.get(`${this.repoURL}/${repository}`);
  }

  getAvatar(): Observable<any> {
    return this.http.get(`${this.userURL}`);
  }

  getAllRepos(): Observable<any> {
    return this.http.get(`https://api.github.com/users/brennarw/repos`);
  }

  
getReadme(repoName: string): Observable<string> {
  const url = `${this.repoURL}/${repoName}/readme`;
  return this.http.get<any>(url).pipe(
    map(response => {
      const decoded = atob(response.content);
      return decoded;
    })
  );
}


}
