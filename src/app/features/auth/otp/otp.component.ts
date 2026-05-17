import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../../core/services/auth.service';
import { interval, Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
  imports: [ToastModule, MatDialogModule, CommonModule, DialogModule, ButtonModule ],
  providers: [MessageService]
})
export class OtpDialogComponent {

  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  public dialogRef = inject(MatDialogRef<OtpDialogComponent>);
  public data: { email: string } = inject(MAT_DIALOG_DATA);

  otpArray = ['', '', '', '', '', ''];
  loading = false;
  countdown = 60;
  resendDisabled = true;
  resendLoading = false;
  timerSub?: Subscription;

  constructor() {
    this.startTimer();
  }

  startTimer() {
    this.resendDisabled = true;
    this.countdown = 60;
    this.timerSub?.unsubscribe();
    this.timerSub = interval(1000).subscribe(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.timerSub?.unsubscribe();
        this.resendDisabled = false;
      }
    });
  }

  trackByIndex(index: number) {
    return index;
  }

  onInput(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(-1);
    this.otpArray[index] = value;
    input.value = value;
    if (value) {
      const next = input.nextElementSibling as HTMLElement;
      if (next) next.focus();
    }
  }

  handleBackspace(event: any, index: number) {
    if (event.key === 'Backspace') {
      if (this.otpArray[index]) {
        this.otpArray[index] = '';
        return;
      }
      if (index > 0) {
        const prev = event.target.previousElementSibling;
        if (prev) prev.focus();
      }
    }
  }

  handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    const digits = event.clipboardData?.getData('text')
      .replace(/\D/g, '').slice(0, 6) || '';
    const newOtp = Array(6).fill('');
    digits.split('').forEach((digit, i) => newOtp[i] = digit);
    this.otpArray = newOtp;
    setTimeout(() => {
      const inputs = document.getElementsByClassName('otp-box') as HTMLCollectionOf<HTMLElement>;
      inputs[Math.min(digits.length, 5)]?.focus();
    }, 0);
  }

  verifyOtp() {
    const otp = this.otpArray.join('').trim();
    if (otp.length !== 6) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter complete OTP'
      });
      return;
    }

    this.loading = true;
    this.authService.verifyOtp(this.data.email, otp).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'OTP verified! Please login to continue'
        });
        this.dialogRef.close(true);
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid OTP'
        });
      }
    });
  }

  resendOtp() {
    if (this.resendDisabled || this.resendLoading) return;
    this.resendLoading = true;
    this.authService.resendOtp(this.data.email).subscribe({
      next: (res: any) => {
        this.resendLoading = false;
        if (res?.code === 'SESSION_EXPIRED') {
          this.messageService.add({
            severity: 'warn',
            summary: 'Session Expired',
            detail: 'Please register again'
          });
          this.dialogRef.close(false);
          return;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'OTP Sent',
          detail: 'New OTP sent to your email'
        });
        this.startTimer();
      },
      error: (err: any) => {
        this.resendLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.message || 'Server error'
        });
      }
    });
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}