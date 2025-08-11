import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth-service';
import { Router } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  user$ = this.authService.user$;

  ngOnInit() {
    // Redirect to login if not authenticated
    this.user$.subscribe((user) => {
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  async logout() {
    try {
      await this.authService.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  async deleteAccount() {
    if (
      confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      try {
        // We'll implement this later
        console.log('Delete account requested');
      } catch (error) {
        console.error('Account deletion failed:', error);
      }
    }
  }
}
