import { MainCategoryType } from '../enums/main-category-type';

export interface Category {
  id: number;
  name: string;
  mainCategoryType: MainCategoryType;
  isRequireMember: boolean;
  sandooqId: number;
}

export interface CreateCategoryRequest {
  name: string;
  mainCategoryType: MainCategoryType;
  isRequireMember: boolean;
  sandooqId: number;
}

export interface UpdateCategoryRequest {
  id: number;
  name: string;
  mainCategoryType: MainCategoryType;
  isRequireMember: boolean;
}
