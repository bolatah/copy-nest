import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

export type AuthMode = 'signIn' | 'signUp' | 'forgotPassword';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  authMode: AuthMode = 'signIn';
  loginForm!: FormGroup;
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private router: Router
  ) {
    
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: [''],
    });
  }

  switchMode(mode: AuthMode) {
    this.authMode = mode;
    this.loginError = null;

    const password = this.loginForm.get('password');
    const confirmPassword = this.loginForm.get('confirm-password');

  
    if (mode === 'signUp') {
      password?.setValidators([Validators.required]);
      confirmPassword?.setValidators([Validators.required]);
    } else if (mode === 'signIn') {
      password?.setValidators([Validators.required]);
      confirmPassword?.clearValidators();
    } else {
      password?.clearValidators();
      confirmPassword?.clearValidators();
    }

    password?.updateValueAndValidity();
    confirmPassword?.updateValueAndValidity();
  }

  async submitForm() {
    if (this.loginForm.invalid) return;
    const { email, password, confirmPassword } = this.loginForm.value;
    try {
      switch (this.authMode) {
        case 'signIn':
          await this.afAuth.signInWithEmailAndPassword(email, password);
          this.router.navigate(['/dashboard']);
          break;

        case 'signUp':
          if (password !== confirmPassword) {
            this.loginError = 'Passwords do not match';
            return;
          }
          await this.afAuth.createUserWithEmailAndPassword(email, password);
          this.router.navigate(['/dashboard']);
          break;

        case 'forgotPassword':
          await this.afAuth.sendPasswordResetEmail(email);
          this.loginError = 'Password reset email sent. Check your inbox.';
          break;
      }
    } catch (error: any) {
      this.loginError = error.message;
    }
  }

  async loginWithGoogle() {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.loginError = error.message;
    }
  }
}