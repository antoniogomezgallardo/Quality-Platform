import { tokenManager } from '../auth/token';
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  Product,
  ProductsResponse,
  ProductsQuery,
  Cart,
  CartSummary,
  AddCartItemRequest,
  UpdateCartItemRequest,
  Order,
  OrdersResponse,
  CreateOrderRequest,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const token = tokenManager.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authentication header if token exists
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          statusCode: response.status,
          message: response.statusText,
          error: 'Unknown Error',
        }));
        throw new Error(JSON.stringify(errorData));
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        try {
          const parsedError = JSON.parse(error.message);
          throw parsedError;
        } catch {
          throw error;
        }
      }
      throw error;
    }
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // Product endpoints
  async getProducts(query: ProductsQuery = {}): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const endpoint = `/products${searchParams.toString() ? `?${searchParams}` : ''}`;
    return this.request<ProductsResponse>(endpoint);
  }

  async getProduct(id: number): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  async getCategories(): Promise<string[]> {
    const response = await this.request<{ categories: string[] }>('/products/categories');
    return response.categories;
  }

  async searchProducts(term: string): Promise<ProductsResponse> {
    return this.request<ProductsResponse>(`/products/search/${encodeURIComponent(term)}`);
  }

  async getProductsByCategory(category: string): Promise<ProductsResponse> {
    return this.request<ProductsResponse>(`/products/category/${encodeURIComponent(category)}`);
  }

  // Cart endpoints
  async getCart(sessionId?: string): Promise<Cart> {
    const headers: HeadersInit = {};
    if (sessionId && !tokenManager.hasToken()) {
      headers['x-session-id'] = sessionId;
    }

    return this.request<Cart>('/cart', { headers });
  }

  async getCartSummary(sessionId?: string): Promise<CartSummary> {
    const headers: HeadersInit = {};
    if (sessionId && !tokenManager.hasToken()) {
      headers['x-session-id'] = sessionId;
    }

    return this.request<CartSummary>('/cart/summary', { headers });
  }

  async addToCart(item: AddCartItemRequest, sessionId?: string): Promise<Cart> {
    const headers: HeadersInit = {};
    if (sessionId && !tokenManager.hasToken()) {
      headers['x-session-id'] = sessionId;
    }

    return this.request<Cart>('/cart/items', {
      method: 'POST',
      body: JSON.stringify(item),
      headers,
    });
  }

  async updateCartItem(itemId: number, update: UpdateCartItemRequest, sessionId?: string): Promise<Cart> {
    const headers: HeadersInit = {};
    if (sessionId && !tokenManager.hasToken()) {
      headers['x-session-id'] = sessionId;
    }

    return this.request<Cart>(`/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(update),
      headers,
    });
  }

  async removeCartItem(itemId: number, sessionId?: string): Promise<Cart> {
    const headers: HeadersInit = {};
    if (sessionId && !tokenManager.hasToken()) {
      headers['x-session-id'] = sessionId;
    }

    return this.request<Cart>(`/cart/items/${itemId}`, {
      method: 'DELETE',
      headers,
    });
  }

  async clearCart(sessionId?: string): Promise<{ message: string }> {
    const headers: HeadersInit = {};
    if (sessionId && !tokenManager.hasToken()) {
      headers['x-session-id'] = sessionId;
    }

    return this.request<{ message: string }>('/cart', {
      method: 'DELETE',
      headers,
    });
  }

  async validateCart(sessionId?: string): Promise<{ isValid: boolean; issues: string[] }> {
    const headers: HeadersInit = {};
    if (sessionId && !tokenManager.hasToken()) {
      headers['x-session-id'] = sessionId;
    }

    return this.request<{ isValid: boolean; issues: string[] }>('/cart/validate', {
      method: 'POST',
      headers,
    });
  }

  async mergeGuestCart(sessionId: string): Promise<Cart> {
    return this.request<Cart>('/cart/merge', {
      method: 'POST',
      headers: {
        'x-session-id': sessionId,
      },
    });
  }

  async checkoutCart(): Promise<{ orderId: number; message: string }> {
    return this.request<{ orderId: number; message: string }>('/cart/checkout', {
      method: 'POST',
    });
  }

  // Order endpoints
  async getOrders(page = 1, limit = 10): Promise<OrdersResponse> {
    return this.request<OrdersResponse>(`/orders/my-orders?page=${page}&limit=${limit}`);
  }

  async getOrder(id: number): Promise<Order> {
    return this.request<Order>(`/orders/${id}`);
  }

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async cancelOrder(id: number): Promise<Order> {
    return this.request<Order>(`/orders/${id}/cancel`, {
      method: 'POST',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);