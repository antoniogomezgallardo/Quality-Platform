# Frontend Component Library

This document provides a comprehensive guide to the reusable components in the Quality Platform frontend application.

## Component Architecture

The component library is organized by feature and follows atomic design principles:

```
components/
├── auth/          # Authentication components
├── cart/          # Shopping cart components  
├── layout/        # Layout and navigation components
├── products/      # Product display components
└── ui/            # Base UI components (atoms)
```

## Base UI Components (`components/ui/`)

### Button Component

A flexible button component with multiple variants and states.

**Location**: `components/ui/button.tsx`

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  disabled, 
  loading, 
  children, 
  ...props 
}: ButtonProps) {
  // Implementation with Tailwind CSS classes
}
```

**Variants**:
- `primary`: Blue background with white text
- `secondary`: Gray background with dark text  
- `danger`: Red background for destructive actions

**Usage**:
```tsx
<Button variant="primary" size="lg" onClick={handleSubmit}>
  Submit Order
</Button>
```

### Input Component

Form input component with validation states and error handling.

**Location**: `components/ui/input.tsx`

```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}
```

**Features**:
- Built-in validation styling
- Error message display
- Accessibility attributes
- Focus and hover states

## Authentication Components (`components/auth/`)

### LoginForm

Complete login form with validation and API integration.

**Location**: `components/auth/login-form.tsx`

```typescript
interface LoginFormProps {
  onSuccess?: (user: User) => void;
  onError?: (error: string) => void;
}
```

**Features**:
- Email and password validation
- Loading states during authentication
- Error handling with user-friendly messages
- Automatic redirect after successful login
- Remember me functionality (future)

**Usage**:
```tsx
<LoginForm 
  onSuccess={(user) => router.push('/products')}
  onError={(error) => showNotification(error)}
/>
```

### RegisterForm

User registration form with comprehensive validation.

**Location**: `components/auth/register-form.tsx`

**Features**:
- Multi-field validation (email, password, confirmPassword)
- Real-time validation feedback
- Password strength indicator
- Terms of service acceptance
- Automatic login after registration

### AuthGuard

Higher-order component for protecting routes that require authentication.

**Location**: `components/auth/auth-guard.tsx`

```typescript
interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
  redirectTo?: string;
}
```

**Usage**:
```tsx
<AuthGuard redirectTo="/login">
  <ProtectedContent />
</AuthGuard>
```

## Layout Components (`components/layout/`)

### Navbar

Main navigation component with authentication integration and cart badge.

**Location**: `components/layout/navbar.tsx`

**Features**:
- Dynamic navigation based on authentication status
- User email display for authenticated users
- Cart icon with item count badge
- Responsive design for mobile and desktop
- Logout functionality

**Navigation Items**:
- Products (always visible)
- My Orders (authenticated users only)
- Admin (admin role only)
- Login/Register (unauthenticated users)
- User email + Logout (authenticated users)

### Layout

Root layout component wrapping all pages.

**Location**: `app/layout.tsx`

**Features**:
- Global providers (Auth, React Query)
- Navigation bar
- Main content area
- Cart drawer integration
- Global CSS imports

## Product Components (`components/products/`)

### ProductCard

Card component for displaying products in grid layouts.

**Location**: `components/products/product-card.tsx`

```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}
```

**Features**:
- Product image placeholder (future: real images)
- Product name, description, and price
- Category and stock status display
- Add to cart button with stock validation
- Hover effects and transitions
- Link to product detail page

**Design**:
- Responsive card layout
- Shadow and hover effects
- Stock status indicators (green/red)
- Disabled state for out-of-stock items

### ProductGrid

Container component for displaying multiple products in a responsive grid.

**Location**: `components/products/product-grid.tsx`

```typescript
interface ProductGridProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
  loading?: boolean;
}
```

**Features**:
- Responsive grid layout (1-4 columns based on screen size)
- Loading skeleton components
- Empty state handling
- Integration with ProductCard components

### ProductFilters

Advanced filtering component for the product catalog.

**Location**: `components/products/product-filters.tsx`

```typescript
interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: { min: number; max: number };
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  inStockOnly: boolean;
  onInStockChange: (inStock: boolean) => void;
}
```

**Filter Types**:
- **Category Filter**: Radio buttons for category selection
- **Price Range**: Min/max price inputs with apply button
- **Stock Status**: Checkbox for in-stock only items
- **Clear Filters**: Reset all filters to default state

### ProductSearch

Search component with real-time search capabilities.

**Location**: `components/products/product-search.tsx`

**Features**:
- Search input with magnifying glass icon
- Clear search button when text is present
- Search button for form submission
- Responsive design

### ProductPagination

Pagination component for navigating through product pages.

**Location**: `components/products/product-pagination.tsx`

```typescript
interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}
```

**Features**:
- Previous/Next navigation buttons
- Page number buttons with current page highlighting
- Ellipsis for large page counts
- Item count display ("Showing X to Y of Z results")
- Mobile-responsive design

## Shopping Cart Components (`components/cart/`)

### CartDrawer

Slide-out cart drawer for quick cart preview and management.

**Location**: `components/cart/cart-drawer.tsx`

**Features**:
- Overlay background with click-to-close
- Slide-in animation from the right
- Cart item list with images and details
- Quantity controls (+/- buttons)
- Remove item functionality
- Order total calculation
- Links to full cart page and checkout
- Empty cart state with "Continue Shopping" link

**Design**:
- Fixed positioning with high z-index
- Smooth animations and transitions
- Scrollable item list
- Sticky footer with totals and actions

### CartItem

Individual cart item component used within cart interfaces.

**Features**:
- Product image (placeholder)
- Product name with link to detail page
- Price per item and total price
- Quantity controls with stock validation
- Remove item button
- Stock status indicators

## Component Patterns and Best Practices

### Props Interface Design

All components use TypeScript interfaces for props:

```typescript
// Good: Explicit interface
interface ComponentProps {
  requiredProp: string;
  optionalProp?: number;
  children?: React.ReactNode;
}

// Avoid: Inline prop types
function Component(props: { title: string; count?: number }) { }
```

### Event Handling Pattern

Components use callback props for event handling:

```typescript
interface ComponentProps {
  onSubmit?: (data: FormData) => void;
  onError?: (error: Error) => void;
  onChange?: (value: string) => void;
}
```

### State Management Integration

Components integrate with global state through custom hooks:

```typescript
// Cart integration
const addItem = useCartStore((state) => state.addItem);
const items = useCartStore((state) => state.items);

// API integration  
const { data: products, isLoading } = useProducts(filters);
```

### Styling Patterns

Components use Tailwind CSS with conditional classes:

```typescript
const buttonClasses = `
  base-classes px-4 py-2 rounded-md
  ${variant === 'primary' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}
  ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
`;
```

### Loading States

Components handle loading states gracefully:

```typescript
if (loading) {
  return <SkeletonComponent />;
}

if (error) {
  return <ErrorMessage error={error} />;
}

return <ActualComponent data={data} />;
```

## Accessibility Features

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Tab order follows logical flow
- Enter and Space keys trigger actions

### Screen Reader Support
- Semantic HTML elements (button, nav, main, etc.)
- ARIA labels and descriptions
- Alt text for images
- Form labels associated with inputs

### Visual Accessibility
- High contrast color schemes
- Focus indicators for keyboard navigation
- Loading states with ARIA live regions
- Error messages with proper announcement

## Testing Strategy

### Component Testing
- Unit tests for component logic
- Props validation and rendering
- Event handler testing
- State changes verification

### Integration Testing
- Component interaction testing
- API integration validation
- User flow testing (auth, cart, etc.)

### Visual Testing
- Screenshot testing for UI consistency
- Responsive design validation
- Cross-browser compatibility

## Future Enhancements

### Advanced Components
- DatePicker for order filtering
- Modal/Dialog system for confirmations
- Toast notifications for user feedback
- Image gallery for product photos

### Accessibility Improvements
- High contrast theme toggle
- Font size adjustment controls
- Reduced motion preferences
- Voice navigation support

### Performance Optimizations
- Lazy loading for large component trees
- Virtual scrolling for large lists
- Image optimization and lazy loading
- Bundle size optimization

This component library provides a solid foundation for building consistent, accessible, and maintainable user interfaces in the Quality Platform application.