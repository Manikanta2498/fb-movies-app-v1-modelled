import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/internal/operators/tap';
import { throwError, Observable } from 'rxjs';
import {GlobalConstants} from '../global-constants';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  constructor(private http: HttpClient) { }
  base_url: string = GlobalConstants.backend_url;

  postSurveyData(data: any): Observable<any> {
    let url = this.base_url +'postsurvey/';
    const headers = { 'Content-Type': 'text/plain' };
    return this.http.post<any[]>(url, data ,{ headers }).pipe(
      tap(response => {}));
  }

  getDynamics(): Observable<any> {
    let url = this.base_url +'getdynamics/';
    return this.http.get<any[]>(url).pipe(
      tap(response => {}));
  }
  getImage(img_index: string): Promise<Blob> {
    let url = this.base_url +"getimage/"+img_index+'/';
    return this.http.get(url, { responseType: 'blob' }).toPromise();
  }
  getMoviesCount(): Observable<any> {
    let url = this.base_url +'getmoviescount/';
    return this.http.get<any[]>(url).pipe(
      tap(response => {}));
  }
  getFnamescount(): Observable<any> {
    let url = this.base_url +'getfnamescount/';
    return this.http.get<any[]>(url).pipe(
      tap(response => {}));
  }
  getMovies(user_id: any): Observable<any> {
    let url = this.base_url +'getmovies/';
    const headers = { 'Content-Type': 'text/plain' };
    return this.http.post<any[]>(url, user_id , {headers}).pipe(
      tap(data => {}));
  }
  getNames(user_id: any): Observable<any> {
    let url = this.base_url +'getnames/';
    const headers = { 'Content-Type': 'text/plain' };
    return this.http.post<any[]>(url, user_id , {headers}).pipe(
      tap(data => {}));
  }
  getFaces(user_id: any): Observable<any> {
    let url = this.base_url +'getfaces/';
    const headers = { 'Content-Type': 'text/plain' };
    return this.http.post<any[]>(url, user_id , {headers}).pipe(
      tap(data => {}));
  }
}
