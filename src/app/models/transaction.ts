import { Category } from './category';

export interface SandooqMember {
  id: number;
  sandooqId: number;
  userId: string;
  userName: string;
  userEmail: string;
  joinedDate: string;
  isActive: boolean;
}

export interface Income {
  id: number;
  amount: number;
  description?: string;
  date: string;
  categoryId: number;
  category?: Category;
  memberId?: number;
  member?: SandooqMember;
  sandooqId: number;
}

export interface Expense {
  id: number;
  amount: number;
  description?: string;
  date: string;
  categoryId: number;
  category?: Category;
  memberId?: number;
  member?: SandooqMember;
  sandooqId: number;
}

export interface CreateIncomeRequest {
  amount: number;
  description?: string;
  categoryId: number;
  memberId?: number;
  sandooqId: number;
}

export interface CreateExpenseRequest {
  amount: number;
  description?: string;
  categoryId: number;
  memberId?: number;
  sandooqId: number;
}

export interface UpdateIncomeRequest {
  id: number;
  amount: number;
  description?: string;
  categoryId: number;
  memberId?: number;
}

export interface UpdateExpenseRequest {
  id: number;
  amount: number;
  description?: string;
  categoryId: number;
  memberId?: number;
}
