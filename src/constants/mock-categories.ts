import { Category } from '@/types';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    nameEn: 'Burgers',
    nameAr: 'برجر',
    slug: 'burgers',
    icon: 'beef',
    sortOrder: 1,
  },
  {
    id: 'cat-2',
    nameEn: 'Pizza',
    nameAr: 'بيتزا',
    slug: 'pizza',
    icon: 'pizza',
    sortOrder: 2,
  },
  {
    id: 'cat-3',
    nameEn: 'Middle Eastern',
    nameAr: 'شرقي',
    slug: 'middle-eastern',
    icon: 'flame',
    sortOrder: 3,
  },
  {
    id: 'cat-4',
    nameEn: 'Desserts',
    nameAr: 'حلى',
    slug: 'desserts',
    icon: 'cake-slice',
    sortOrder: 4,
  },
  {
    id: 'cat-5',
    nameEn: 'Drinks',
    nameAr: 'مشروبات',
    slug: 'drinks',
    icon: 'cup-soda',
    sortOrder: 5,
  },
];
