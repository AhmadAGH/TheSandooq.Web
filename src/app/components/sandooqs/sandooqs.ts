import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncPipe, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SandooqSummary, CreateSandooqRequest } from '../../models/sandooq';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth-service';
import { SandooqService } from '../../services/sandooq/sandooq-service';

@Component({
  selector: 'app-sandooqs',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  templateUrl: './sandooqs.html',
  styleUrl: './sandooqs.scss',
})
export class SandooqsComponent implements OnInit {
  private sandooqService = inject(SandooqService);
  private authService = inject(AuthService);
  private router = inject(Router);

  sandooqs$: Observable<SandooqSummary[]> = of([]);
  user$ = this.authService.user$;

  isLoading = false;
  isCreating = false;
  showCreateForm = false;
  errorMessage = '';

  // Create form data
  newSandooq: CreateSandooqRequest = {
    name: '',
    description: '',
    monthlyPayment: 0,
    maxInvestmentPercentage: 10,
  };

  ngOnInit() {
    this.loadSandooqs();

    // Redirect to login if not authenticated
    this.user$.subscribe((user) => {
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  loadSandooqs() {
    this.isLoading = true;
    this.errorMessage = '';

    this.sandooqs$ = this.sandooqService.getSandooqsSummary().pipe(
      catchError((error) => {
        console.error('Failed to load sandooqs:', error);
        this.errorMessage = 'فشل في تحميل الصناديق. يرجى المحاولة مرة أخرى.';
        return of([]);
      })
    );

    // Subscribe to handle loading state
    this.sandooqs$.subscribe({
      next: () => (this.isLoading = false),
      error: () => (this.isLoading = false),
    });
  }

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.resetCreateForm();
    }
  }

  async createSandooq() {
    if (!this.newSandooq.name.trim()) {
      alert('يرجى إدخال اسم الصندوق');
      return;
    }

    if (this.newSandooq.monthlyPayment <= 0) {
      alert('يرجى إدخال قيمة دفعة شهرية صحيحة');
      return;
    }

    if (
      this.newSandooq.maxInvestmentPercentage <= 0 ||
      this.newSandooq.maxInvestmentPercentage > 100
    ) {
      alert('يرجى إدخال نسبة استثمار صحيحة (1-100%)');
      return;
    }

    this.isCreating = true;
    this.errorMessage = '';

    try {
      await this.sandooqService.createSandooq(this.newSandooq).toPromise();
      this.resetCreateForm();
      this.showCreateForm = false;
      this.loadSandooqs(); // Refresh the list
      alert('تم إنشاء الصندوق بنجاح!');
    } catch (error: any) {
      console.error('Failed to create sandooq:', error);
      this.errorMessage = error.message || 'فشل في إنشاء الصندوق';
    } finally {
      this.isCreating = false;
    }
  }

  resetCreateForm() {
    this.newSandooq = {
      name: '',
      description: '',
      monthlyPayment: 0,
      maxInvestmentPercentage: 10,
    };
  }

  viewSandooq(sandooqId: number) {
    // Navigate to sandooq details (we'll create this route later)
    this.router.navigate(['/sandooqs', sandooqId]);
  }

  async deleteSandooq(sandooq: SandooqSummary, event: Event) {
    event.stopPropagation(); // Prevent triggering viewSandooq

    if (!sandooq.isOwner) {
      alert('فقط مالك الصندوق يمكنه حذفه');
      return;
    }

    const confirmation = confirm(
      `هل أنت متأكد من حذف "${sandooq.name}"؟\n\n` +
        'سيتم حذف نهائياً:\n' +
        '• جميع المعاملات\n' +
        '• جميع الأعضاء\n' +
        '• جميع الفئات\n\n' +
        'لا يمكن التراجع عن هذا الإجراء!'
    );

    if (confirmation) {
      try {
        this.isLoading = true;
        await this.sandooqService.deleteSandooq(sandooq.id).toPromise();
        this.loadSandooqs(); // Refresh the list
        alert('تم حذف الصندوق بنجاح');
      } catch (error: any) {
        console.error('Failed to delete sandooq:', error);
        alert('فشل في حذف الصندوق: ' + error.message);
      } finally {
        this.isLoading = false;
      }
    }
  }

  getBalanceColor(balance: number): string {
    if (balance > 0) return 'positive';
    if (balance < 0) return 'negative';
    return 'neutral';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ar', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  }

  getLastActivityText(lastActivity: string): string {
    const date = new Date(lastActivity);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'أمس';
    if (diffDays < 7) return `منذ ${diffDays} أيام`;
    if (diffDays < 30) return `منذ ${Math.ceil(diffDays / 7)} أسابيع`;
    return date.toLocaleDateString('ar-SA');
  }
}
