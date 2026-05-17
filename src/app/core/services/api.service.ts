import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl= environment.apiUrl;
  constructor( private http: HttpClient) {}

  get(url:string){
    return this.http.get(`${this.baseUrl}/${url}`);
  }

  post(url:string, body:any){
    return this.http.post(`${this.baseUrl}/${url}`, body);
  }
  
  put(url:string, body:any){
    return this.http.put(`${this.baseUrl}/${url}`, body);
  }

  delete(url:string){
    return this.http.delete(`${this.baseUrl}/${url}`);
  }
}
