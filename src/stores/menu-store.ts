import { create } from 'zustand';
import { MenuItem, Category } from '@/types';
import { MOCK_MENU } from '@/constants/mock-menu';
import { MOCK_CATEGORIES } from '@/constants/mock-categories';

interface MenuState {
  items: MenuItem[];
  categories: Category[];
  searchQuery: string;
  selectedCategoryId: string | null;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  getFilteredItems: () => MenuItem[];
  addMenuItem: (item: Omit<MenuItem, "id">) => void;
  updateMenuItem: (id: string, data: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
}

export const useMenuStore = create<MenuState>((set, get) => ({
  items: MOCK_MENU,
  categories: MOCK_CATEGORIES,
  searchQuery: '',
  selectedCategoryId: null,

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSelectedCategory: (categoryId: string | null) => set({ selectedCategoryId: categoryId }),

  getFilteredItems: () => {
    const { items, searchQuery, selectedCategoryId } = get();
    
    return items.filter((item) => {
      // Filter by availability (public view)
      if (!item.isAvailable) return false;

      // Filter by category
      if (selectedCategoryId && item.categoryId !== selectedCategoryId) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchEn = item.nameEn.toLowerCase().includes(query) || item.descriptionEn.toLowerCase().includes(query);
        const matchAr = item.nameAr.includes(query) || item.descriptionAr.includes(query);
        if (!matchEn && !matchAr) {
          return false;
        }
      }

      return true;
    });
  },

  addMenuItem: (item) => set((state) => {
    const newItem: MenuItem = {
      ...item,
      id: `m${Date.now()}`
    };
    return { items: [...state.items, newItem] };
  }),

  updateMenuItem: (id, data) => set((state) => ({
    items: state.items.map((item) => 
      item.id === id ? { ...item, ...data } : item
    )
  })),

  deleteMenuItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id)
  }))
}));
