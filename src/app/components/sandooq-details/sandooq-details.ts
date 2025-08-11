import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import * as sandooq from '../../models/sandooq';
import {
  CreateIncomeRequest,
  CreateExpenseRequest,
  SandooqMember,
} from '../../models/transaction';
import { Observable, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth-service';
import { SandooqService } from '../../services/sandooq/sandooq-service';

@Component({
  selector: 'app-sandooq-details',
  standalone: true,
  imports: [AsyncPipe, DatePipe, FormsModule, RouterLink],
  templateUrl: './sandooq-details.html',
  styleUrl: './sandooq-details.scss',
})
export class SandooqDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sandooqService = inject(SandooqService);
  private authService = inject(AuthService);

  sandooq$: Observable<sandooq.SandooqDetails | null> = of(null);
  user$ = this.authService.user$;

  sandooqId: number = 0;
  isLoading = false;
  errorMessage = '';

  // UI State
  showAddMember = false;
  showAddIncome = false;
  showAddExpense = false;
  activeTab = 'overview';

  // Forms
  newMember: sandooq.AddMemberRequest = {
    sandooqId: 0,
    userEmail: '',
  };

  newIncome: CreateIncomeRequest = {
    amount: 0,
    description: '',
    categoryId: 0,
    memberId: undefined,
    sandooqId: 0,
  };

  newExpense: CreateExpenseRequest = {
    amount: 0,
    description: '',
    categoryId: 0,
    memberId: undefined,
    sandooqId: 0,
  };

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.sandooqId = +params['id'];
          this.newMember.sandooqId = this.sandooqId;
          this.newIncome.sandooqId = this.sandooqId;
          this.newExpense.sandooqId = this.sandooqId;
          return this.loadSandooqDetails();
        })
      )
      .subscribe();

    // Redirect to login if not authenticated
    this.user$.subscribe((user) => {
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  loadSandooqDetails(): Observable<sandooq.SandooqDetails | null> {
    this.isLoading = true;
    this.errorMessage = '';

    this.sandooq$ = this.sandooqService.getSandooqDetails(this.sandooqId).pipe(
      catchError((error) => {
        console.error('Failed to load sandooq details:', error);
        this.errorMessage =
          'فشل في تحميل تفاصيل الصندوق. يرجى المحاولة مرة أخرى.';
        this.isLoading = false;
        return of(null);
      })
    );

    this.sandooq$.subscribe({
      next: () => (this.isLoading = false),
      error: () => (this.isLoading = false),
    });

    return this.sandooq$;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  async addMember() {
    if (!this.newMember.userEmail.trim()) {
      alert('يرجى إدخال البريد الإلكتروني للعضو');
      return;
    }

    try {
      await this.sandooqService.addMember(this.newMember).toPromise();
      this.resetMemberForm();
      this.showAddMember = false;
      this.loadSandooqDetails();
      alert('تم إضافة العضو بنجاح!');
    } catch (error: any) {
      console.error('Failed to add member:', error);
      alert('فشل في إضافة العضو: ' + error.message);
    }
  }

  async removeMember(member: SandooqMember) {
    const confirmation = confirm(
      `هل أنت متأكد من إزالة ${member.userName} من الصندوق؟`
    );

    if (confirmation) {
      try {
        await this.sandooqService
          .removeMember(this.sandooqId, member.id)
          .toPromise();
        this.loadSandooqDetails();
        alert('تم إزالة العضو بنجاح');
      } catch (error: any) {
        console.error('Failed to remove member:', error);
        alert('فشل في إزالة العضو: ' + error.message);
      }
    }
  }

  async addIncome() {
    if (this.newIncome.amount <= 0) {
      alert('يرجى إدخال مبلغ صحيح');
      return;
    }

    if (this.newIncome.categoryId === 0) {
      alert('يرجى اختيار فئة');
      return;
    }

    try {
      await this.sandooqService.addIncome(this.newIncome).toPromise();
      this.resetIncomeForm();
      this.showAddIncome = false;
      this.loadSandooqDetails();
      alert('تم إضافة الإيراد بنجاح!');
    } catch (error: any) {
      console.error('Failed to add income:', error);
      alert('فشل في إضافة الإيراد: ' + error.message);
    }
  }

  async addExpense() {
    if (this.newExpense.amount <= 0) {
      alert('يرجى إدخال مبلغ صحيح');
      return;
    }

    if (this.newExpense.categoryId === 0) {
      alert('يرجى اختيار فئة');
      return;
    }

    try {
      await this.sandooqService.addExpense(this.newExpense).toPromise();
      this.resetExpenseForm();
      this.showAddExpense = false;
      this.loadSandooqDetails();
      alert('تم إضافة المصروف بنجاح!');
    } catch (error: any) {
      console.error('Failed to add expense:', error);
      alert('فشل في إضافة المصروف: ' + error.message);
    }
  }

  resetMemberForm() {
    this.newMember = {
      sandooqId: this.sandooqId,
      userEmail: '',
    };
  }

  resetIncomeForm() {
    this.newIncome = {
      amount: 0,
      description: '',
      categoryId: 0,
      memberId: undefined,
      sandooqId: this.sandooqId,
    };
  }

  resetExpenseForm() {
    this.newExpense = {
      amount: 0,
      description: '',
      categoryId: 0,
      memberId: undefined,
      sandooqId: this.sandooqId,
    };
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  }

  getBalanceColor(balance: number): string {
    if (balance > 0) return 'positive';
    if (balance < 0) return 'negative';
    return 'neutral';
  }

  getMemberBalanceColor(balance: number): string {
    return this.getBalanceColor(balance);
  }

  isOwner(sandooq: sandooq.SandooqDetails): boolean {
    return this.sandooqService.isOwner(sandooq);
  }
}
