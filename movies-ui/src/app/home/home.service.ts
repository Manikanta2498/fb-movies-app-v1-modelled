import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/internal/operators/tap';
import { throwError, Observable } from 'rxjs';
import {GlobalConstants} from '../global-constants';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }
  base_url: string = GlobalConstants.backend_url;
  getUserID(): Observable<any> {
    let url = this.base_url +'getuserid/';
    return this.http.get<any[]>(url).pipe(
      tap(response => {}));
  }
  getDynamics(): Observable<any> {
    let url = this.base_url +'getdynamics/';
    return this.http.get<any[]>(url).pipe(
      tap(response => {}));
  }
  public getIPAddress()  
  {  
    return this.http.get("http://api.ipify.org/?format=json");  
  }  
  postIP(data: any): Observable<any> {
    let url = this.base_url +'postip/';
    const headers = { 'Content-Type': 'text/plain' };
    return this.http.post<any[]>(url, data ,{ headers }).pipe(
      tap(response => {}));
  }
}
