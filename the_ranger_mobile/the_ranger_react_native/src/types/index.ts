export type Screen =
  | "splash" | "onboarding" | "login" | "role"
  | "c_home" | "c_marketplace" | "c_catering" | "c_laundry" | "c_kos" | "c_product_detail"
  | "c_checkout" | "c_order_success" | "c_tracking"
  | "c_catering_detail" | "c_catering_payment" | "c_catering_qris"
  | "d_home"
  | "pemilik_catering_home"
  | "pemilik_marketplace_home"
  | "pemilik_laundry_home"
  | "pemilik_kos_home"
  | "admin_home";

export type CateringPaymentOption = "full" | "dp30" | "dp50";

export interface PaymentHistoryEntry {
  label: string;
  amount: number;
  date: string;
  method: string;
  reference?: string;
}

export type Role =
  | "customer"
  | "driver"
  | "pemilik_catering"
  | "pemilik_marketplace"
  | "pemilik_laundry"
  | "pemilik_kos"
  | "admin";

export type Nav = {
  navigate: (s: Screen) => void;
};

export interface Product {
  id: number;
  name: string;
  store: string;
  price: number;
  rating: number;
  sold: number;
  img: string;
  liked: boolean;
  cat: string;
  description?: string;
}

export interface CustomerAddress {
  id: string;
  label: string; // e.g. "Rumah", "Kantor", "Kos"
  receiverName: string;
  phoneNumber: string;
  fullAddress: string;
  notes?: string; // detail patokan
  isMain: boolean;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  store: string;
  img: string;
  // Kustomisasi tambahan
  customizations?: {
    size?: string;
    topping?: string;
    spicyLevel?: string;
    variant?: string;
    notes?: string;
    portions?: number;
    cateringDate?: string;
    cateringTime?: string;
  };
}

export interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  distance: number;
  minOrder: number;
  img: string;
  tags: string[];
  open: boolean;
  priceStarts: number;
}

export interface Laundry {
  id: number;
  name: string;
  address: string;
  price: number;
  rating: number;
  open: boolean;
  distance: string;
  type: string;
  img: string;
}

export interface KosItem {
  id: number;
  name: string;
  address: string;
  price: number;
  type: string;
  facilities: string[];
  available: boolean;
  img: string;
}

export interface OrderItem {
  id: string;
  type: string;
  iconName: string;
  color: string;
  item: string;
  detail: string;
  status: string;
  statusColor: string;
  date: string;
  total: number;
  
  // Data detail tambahan untuk e-commerce flow
  address?: CustomerAddress;
  deliveryMethod?: string;
  deliveryFee?: number;
  serviceFee?: number;
  discount?: number;
  paymentMethod?: string;
  notes?: string;
  cateringDate?: string;
  cateringTime?: string;
  cateringPortions?: number;
  driverName?: string;
  driverPhone?: string;
  driverVehicle?: string;
  driverRating?: number;
  driverPhoto?: string;
  items?: CartItem[];
  cancelReason?: string;
  merchantRating?: number;
  driverRatingVal?: number;
  merchantReview?: string;
  driverReview?: string;
  paymentStatus?: "Lunas" | "Menunggu Pelunasan";
  paymentOption?: CateringPaymentOption;
  paidAmount?: number;
  remainingAmount?: number;
  paymentDueDate?: string;
  paymentReminder?: string;
  paymentReference?: string;
  paymentHistory?: PaymentHistoryEntry[];
}

export interface NotifItem {
  id: number;
  type: string;
  title: string;
  msg: string;
  time: string;
  read: boolean;
}

export interface NewsItem {
  id: number;
  title: string;
  cat: string;
  date: string;
  img: string;
}

export interface DriverOrder {
  id: string;
  type: string;
  from: string;
  to: string;
  dist: string;
  pay: number;
  time: string;
}
