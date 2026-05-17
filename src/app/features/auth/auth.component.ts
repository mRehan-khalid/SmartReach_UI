import { Component, inject, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ToastModule, CommonModule, FormsModule, NgClass, DialogModule],
  providers: [MessageService],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  showLogin = true;
  showPassword = false;
  loading = false;
  showOtpDialog = false;

  username = '';
  email = '';
  password = '';

  toggleForm() {
    this.showLogin = !this.showLogin;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onOtpSuccess() {
    this.showOtpDialog = false;
    this.showLogin = true;
    this.email = '';
    this.password = '';
    this.username = '';
  }

  onOtpClose() {
    this.showOtpDialog = false;
  }

  register() {
    if (!this.username || !this.email || !this.password) {
      this.messageService.add({ severity: 'warn', summary: 'Missing Fields', detail: 'Please fill all required fields' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.messageService.add({ severity: 'warn', summary: 'Invalid Email', detail: 'Please enter a valid email address' });
      return;
    }

    if (this.password.length < 6) {
      this.messageService.add({ severity: 'warn', summary: 'Weak Password', detail: 'Password must be at least 6 characters long' });
      return;
    }

    this.loading = true;

    this.authService.register({
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.loading = false;
        this.showOtpDialog = true;
        this.messageService.add({ severity: 'success', summary: 'OTP Sent', detail: 'Please check your email for OTP' });
      },
      error: (err) => {
        this.loading = false;
        const code = err?.error?.code;

        if (code === 'USER_EXISTS') {
          this.messageService.add({ severity: 'warn', summary: 'Account Exists', detail: 'Please login instead' });
          this.showLogin = true;
          return;
        }

        this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Something went wrong' });
      }
    });
  }

  login() {
    if (!this.email) {
      this.messageService.add({ severity: 'warn', summary: 'Email Required', detail: 'Please enter your email' });
      return;
    }

    if (!this.password) {
      this.messageService.add({ severity: 'warn', summary: 'Password Required', detail: 'Please enter your password' });
      return;
    }

    this.loading = true;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        this.loading = false;
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        this.messageService.add({ severity: 'success', summary: 'Login Successful', detail: `Welcome back, ${res.user.username}!` });

        if (res.user.isProfileComplete) {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/profile']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: err?.error?.message || 'Invalid credentials' });
      }
    });
  }
}