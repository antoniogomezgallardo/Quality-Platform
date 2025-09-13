// User types
export interface User {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// Product types
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  data: Product[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ProductsQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'category' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

// Cart types
export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  addedAt: string;
  product: Product;
}

export interface Cart {
  id: string;
  userId?: number;
  sessionId?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  cartItems: CartItem[];
}

export interface AddCartItemRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartSummary {
  totalItems: number;
  totalAmount: number;
  itemCount: number;
  isEmpty: boolean;
}

// Order types
export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: number;
  userId: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  orderItems: OrderItem[];
}

export interface CreateOrderRequest {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  notes?: string;
}

export interface OrdersResponse {
  data: Order[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Common API response types
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}