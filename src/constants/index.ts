import { OrderStatus, PaymentMethod } from '@/types';

export const ORDER_STATUSES: { value: OrderStatus; labelEn: string; labelAr: string }[] = [
  { value: 'pending', labelEn: 'Pending', labelAr: 'قيد الانتظار' },
  { value: 'confirmed', labelEn: 'Confirmed', labelAr: 'مؤكد' },
  { value: 'preparing', labelEn: 'Preparing', labelAr: 'قيد التحضير' },
  { value: 'ready', labelEn: 'Ready for Pickup/Delivery', labelAr: 'جاهز للاستلام/التوصيل' },
  { value: 'out_for_delivery', labelEn: 'Out for Delivery', labelAr: 'في الطريق إليك' },
  { value: 'delivered', labelEn: 'Delivered', labelAr: 'تم التوصيل' },
  { value: 'cancelled', labelEn: 'Cancelled', labelAr: 'ملغي' },
];

export const PAYMENT_METHODS: { value: PaymentMethod; labelEn: string; labelAr: string; icon: string }[] = [
  { value: 'card', labelEn: 'Credit / Debit Card', labelAr: 'بطاقة ائتمان / مدى', icon: 'credit-card' },
  { value: 'cash', labelEn: 'Cash on Delivery', labelAr: 'الدفع عند الاستلام', icon: 'banknote' },
  { value: 'wallet', labelEn: 'Digital Wallet (Apple Pay / STC Pay)', labelAr: 'المحفظة الرقمية (Apple Pay / STC Pay)', icon: 'wallet' },
];

export const DELIVERY_FEE = 1500; // e.g., 15.00 SAR in smallest unit (halalas)
