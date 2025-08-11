import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Sandooq,
  CreateSandooqRequest,
  UpdateSandooqRequest,
  AddMemberRequest,
  SandooqSummary,
  SandooqDetails,
} from '../../models/sandooq';
import { ApiResponse } from '../../models/api-response';
import {
  CreateIncomeRequest,
  CreateExpenseRequest,
  UpdateIncomeRequest,
  UpdateExpenseRequest,
  Income,
  Expense,
  SandooqMember,
} from '../../models/transaction';
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../../models/category';
import { AuthService } from '../auth/auth-service';

@Injectable({
  providedIn: 'root',
})
export class SandooqService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = environment.apiUrl;

  // Get authorization headers with Firebase token
  private getAuthHeaders(): Observable<HttpHeaders> {
    return from(this.authService.getIdToken()).pipe(
      switchMap((token) => {
        if (!token) {
          return throwError(
            () => new Error('No authentication token available')
          );
        }
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        });
        return [headers];
      })
    );
  }

  // Handle API errors
  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    let errorMessage = 'An unexpected error occurred';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  }

  // ==================== SANDOOQ OPERATIONS ====================

  // Get all user's sandooqs
  getAllSandooqs(): Observable<Sandooq[]> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<ApiResponse<Sandooq[]>>(`${this.apiUrl}/sandooqs`, {
          headers,
        })
      ),
      map((response) => response.data),
      catchError(this.handleError)
    );
  }

  // Get sandooqs summary for dashboard
  getSandooqsSummary(): Observable<SandooqSummary[]> {
    return this.getAllSandooqs().pipe(
      map((sandooqs) =>
        sandooqs.map((sandooq) => this.createSandooqSummary(sandooq))
      )
    );
  }

  // Get specific sandooq by ID with detailed calculations
  getSandooqDetails(id: number): Observable<SandooqDetails> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<ApiResponse<Sandooq>>(`${this.apiUrl}/sandooqs/${id}`, {
          headers,
        })
      ),
      map((response) => this.createSandooqDetails(response.data)),
      catchError(this.handleError)
    );
  }

  // Create new sandooq
  createSandooq(request: CreateSandooqRequest): Observable<Sandooq> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post<ApiResponse<Sandooq>>(
          `${this.apiUrl}/sandooqs`,
          request,
          { headers }
        )
      ),
      map((response) => response.data),
      catchError(this.handleError)
    );
  }

  // Update sandooq
  updateSandooq(request: UpdateSandooqRequest): Observable<Sandooq> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.put<ApiResponse<Sandooq>>(
          `${this.apiUrl}/sandooqs/${request.id}`,
          request,
          { headers }
        )
      ),
      map((response) => response.data),
      catchError(this.handleError)
    );
  }

  // Delete sandooq
  deleteSandooq(id: number): Observable<boolean> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.delete<ApiResponse<any>>(`${this.apiUrl}/sandooqs/${id}`, {
          headers,
        })
      ),
      map((response) => response.success),
      catchError(this.handleError)
    );
  }

  // ==================== MEMBER OPERATIONS ====================

  // Add member to sandooq
  addMember(request: AddMemberRequest): Observable<SandooqMember> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post<ApiResponse<SandooqMember>>(
          `${this.apiUrl}/sandooqs/${request.sandooqId}/members`,
          request,
          { headers }
        )
      ),
      map((response) => response.data),
      catchError(this.handleError)
    );
  }

  // Remove member from sandooq
  removeMember(sandooqId: number, memberId: number): Observable<boolean> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.delete<ApiResponse<any>>(
          `${this.apiUrl}/sandooqs/${sandooqId}/members/${memberId}`,
          { headers }
        )
      ),
      map((response) => response.success),
      catchError(this.handleError)
    );
  }

  // ==================== TRANSACTION OPERATIONS ====================

  // Add income
  addIncome(request: CreateIncomeRequest): Observable<Income> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post<ApiResponse<Income>>(
          `${this.apiUrl}/transactions/income`,
          request,
          { headers }
        )
      ),
      map((response) => response.data),
      catchError(this.handleError)
    );
  }

  // Add expense
  addExpense(request: CreateExpenseRequest): Observable<Expense> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post<ApiResponse<Expense>>(
          `${this.apiUrl}/transactions/expense`,
          request,
          { headers }
        )
      ),
      map((response) => response.data),
      catchError(this.handleError)
    );
  }

  // Update income
  updateIncome(request: UpdateIncomeRequest): Observable<Income> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.put<ApiResponse<Income>>(
          `${this.apiUrl}/transactions/income/${request.id}`,
          request,
          { headers }
        )
      ),
      map((response) => response.data),
      catchError(this.handleError)
    );
  }

  // Update expense
  updateExpense(request: UpdateExpenseRequest): Observable<Expense> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.put<ApiResponse<Expense>>(
          `${this.apiUrl}/transactions/expense/${request.id}`,
          request,
          { headers }
        )
      ),
      map((response) => response.data),
      catchError(this.handleError)
    );
  }

  // Delete income
  deleteIncome(id: number): Observable<boolean> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.delete<ApiResponse<any>>(
          `${this.apiUrl}/transactions/income/${id}`,
          { headers }
        )
      ),
      map((response) => response.success),
      catchError(this.handleError)
    );
  }

  // Delete expense
  deleteExpense(id: number): Observable<boolean> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.delete<ApiResponse<any>>(
          `${this.apiUrl}/transactions/expense/${id}`,
          { headers }
        )
      ),
      map((response) => response.success),
      catchError(this.handleError)
    );
  }

  // ==================== CATEGORY OPERATIONS ====================

  // Get categories for a sandooq
  getCategories(sandooqId: number): Observable<Category[]> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<ApiResponse<Category[]>>(
          `${this.apiUrl}/sandooqs/${sandooqId}/categories`,
          { headers }
        )
      ),
      map((response) => response.data),
      catchError(this.handleError)
    );
  }

  // Create category
  createCategory(request: CreateCategoryRequest): Observable<Category> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post<ApiResponse<Category>>(
          `${this.apiUrl}/categories`,
          request,
          { headers }
        )
      ),
      map((response) => response.data),
      catchError(this.handleError)
    );
  }

  // Update category
  updateCategory(request: UpdateCategoryRequest): Observable<Category> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.put<ApiResponse<Category>>(
          `${this.apiUrl}/categories/${request.id}`,
          request,
          { headers }
        )
      ),
      map((response) => response.data),
      catchError(this.handleError)
    );
  }

  // Delete category
  deleteCategory(id: number): Observable<boolean> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.delete<ApiResponse<any>>(`${this.apiUrl}/categories/${id}`, {
          headers,
        })
      ),
      map((response) => response.success),
      catchError(this.handleError)
    );
  }

  // ==================== CALCULATION HELPERS ====================

  // Calculate total sandooq balance
  calculateBalance(sandooq: Sandooq): number {
    const totalIncome =
      sandooq.incomes?.reduce((sum, income) => sum + income.amount, 0) || 0;
    const totalExpenses =
      sandooq.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
    return totalIncome - totalExpenses;
  }

  // Calculate total income
  calculateTotalIncome(sandooq: Sandooq): number {
    return (
      sandooq.incomes?.reduce((sum, income) => sum + income.amount, 0) || 0
    );
  }

  // Calculate total expenses
  calculateTotalExpenses(sandooq: Sandooq): number {
    return (
      sandooq.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0
    );
  }

  // Get member's balance
  getMemberBalance(sandooq: Sandooq, memberId: number): number {
    const memberIncomes =
      sandooq.incomes
        ?.filter((i) => i.memberId === memberId)
        .reduce((sum, income) => sum + income.amount, 0) || 0;
    const memberExpenses =
      sandooq.expenses
        ?.filter((e) => e.memberId === memberId)
        .reduce((sum, expense) => sum + expense.amount, 0) || 0;
    return memberIncomes - memberExpenses;
  }

  // Get all member balances
  getAllMemberBalances(sandooq: Sandooq): { [memberId: number]: number } {
    const balances: { [memberId: number]: number } = {};
    sandooq.members?.forEach((member) => {
      balances[member.id] = this.getMemberBalance(sandooq, member.id);
    });
    return balances;
  }

  // Get transaction count
  getTransactionCount(sandooq: Sandooq): number {
    const incomeCount = sandooq.incomes?.length || 0;
    const expenseCount = sandooq.expenses?.length || 0;
    return incomeCount + expenseCount;
  }

  // Get last activity date
  getLastActivity(sandooq: Sandooq): string {
    const allDates: string[] = [];

    sandooq.incomes?.forEach((income) => allDates.push(income.date));
    sandooq.expenses?.forEach((expense) => allDates.push(expense.date));

    if (allDates.length === 0) {
      return sandooq.createdDate;
    }

    return allDates.sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    )[0];
  }

  // Check if current user is owner
  isOwner(sandooq: Sandooq): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.uid === sandooq.creatorId;
  }

  // ==================== HELPER METHODS ====================

  // Create sandooq summary for list view
  private createSandooqSummary(sandooq: Sandooq): SandooqSummary {
    return {
      id: sandooq.id,
      name: sandooq.name,
      description: sandooq.description,
      totalBalance: this.calculateBalance(sandooq),
      totalMembers: sandooq.members?.length || 0,
      totalTransactions: this.getTransactionCount(sandooq),
      lastActivity: this.getLastActivity(sandooq),
      isOwner: this.isOwner(sandooq),
      maxInvestmentPercentage: sandooq.maxInvestmentPercentage,
      monthlyPayment: sandooq.monthlyPayment,
    };
  }

  // Create detailed sandooq view
  private createSandooqDetails(sandooq: Sandooq): SandooqDetails {
    return {
      ...sandooq,
      totalIncome: this.calculateTotalIncome(sandooq),
      totalExpenses: this.calculateTotalExpenses(sandooq),
      balance: this.calculateBalance(sandooq),
      memberBalances: this.getAllMemberBalances(sandooq),
    };
  }
}
