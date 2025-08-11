import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;

  async signInWithGoogle() {
    this.isLoading = true;
    try {
      await this.authService.signInWithGoogle();
      // Redirect to dashboard after successful login
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Login failed:', error);
      // Handle error (show message to user)
    } finally {
      this.isLoading = false;
    }
  }
}
