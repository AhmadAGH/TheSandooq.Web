import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  user,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);

  // Observable of current user
  user$ = user(this.auth);

  // Sign in with Google
  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      return result.user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  // Get current user's ID token for API calls
  async getIdToken(): Promise<string | null> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      return await currentUser.getIdToken();
    }
    return null;
  }

  // Check if user is authenticated
  get isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
}
