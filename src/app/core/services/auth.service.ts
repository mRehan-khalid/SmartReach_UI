import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private apiService: ApiService) { }

  register(data: {username:string; email:string; password:string}){
    return this.apiService.post('authController/register', data);
  }
  
  login(data: {email:string; password:string}){
    return this.apiService.post('authController/login', data);
  }

  verifyOtp(email:string, otp:string){
    return this.apiService.post('authController/verifyOtp', {email, otp});
  }
  resendOtp(email: string) {
    return this.apiService.post('authController/resendOtp', { email });
  }

}
