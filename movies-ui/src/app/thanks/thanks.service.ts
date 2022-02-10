import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/internal/operators/tap';
import { throwError, Observable } from 'rxjs';
import {GlobalConstants} from '../global-constants';

@Injectable({
  providedIn: 'root'
})
export class ThanksService {

  constructor(private http: HttpClient) { }
  base_url: string = GlobalConstants.backend_url;
  getDynamics(): Observable<any> {
    let url = this.base_url +'getdynamics/';
    return this.http.get<any[]>(url).pipe(
      tap(response => {}));
  }
  postMovieLink(data: any): Observable<any> {
    let url = this.base_url +'postmovielink/';
    const headers = { 'Content-Type': 'text/plain' };
    return this.http.post<any[]>(url, data ,{ headers }).pipe(
      tap(response => {}));
  }
}
