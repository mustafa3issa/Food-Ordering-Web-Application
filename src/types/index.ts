export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address: string;
  createdAt: string; // ISO date string
}

export interface Category {
  id: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  icon: string; // Lucide icon name
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number; // Integer, smallest currency unit (e.g. cents)
  image: string; // URL
  isAvailable: boolean;
  isFeatured: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cash' | 'card' | 'wallet';

export interface OrderItem {
  menuItemId: string;
  nameEn: string;
  nameAr: string;
  quantity: number;
  unitPrice: number; // Snapshot at time of order
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress: string;
  deliveryFee: number;
  notes: string;
  paymentMethod: PaymentMethod;
  createdAt: string; // ISO date string
  estimatedDeliveryMinutes: number;
}
