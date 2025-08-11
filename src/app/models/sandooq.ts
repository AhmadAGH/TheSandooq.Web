import { Category } from './category';
import { Income, Expense, SandooqMember } from './transaction';

export interface Sandooq {
  id: number;
  name: string;
  description?: string;
  monthlyPayment: number;
  maxInvestmentPercentage: number;
  createdDate: string;
  creatorId: string;
  members: SandooqMember[];
  categories: Category[];
  incomes: Income[];
  expenses: Expense[];
}

export interface CreateSandooqRequest {
  name: string;
  description?: string;
  monthlyPayment: number;
  maxInvestmentPercentage: number;
}

export interface UpdateSandooqRequest {
  id: number;
  name: string;
  description?: string;
  monthlyPayment: number;
  maxInvestmentPercentage: number;
}

export interface AddMemberRequest {
  sandooqId: number;
  userEmail: string;
}

export interface SandooqSummary {
  id: number;
  name: string;
  description?: string;
  monthlyPayment: number;
  maxInvestmentPercentage: number;
  totalBalance: number;
  totalMembers: number;
  totalTransactions: number;
  lastActivity: string;
  isOwner: boolean;
}

export interface SandooqDetails extends Sandooq {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  memberBalances: { [memberId: number]: number };
}
