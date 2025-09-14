# @quality-platform/shared

## Overview

Shared libraries for the Quality Platform monorepo, providing common utilities, validation functions, and test helpers that can be used across all applications and services.

## Installation & Setup

This library is automatically available within the Quality Platform monorepo. No additional installation is required.

## Library Structure

```
libs/shared/
├── src/
│   ├── validation/     # Input validation utilities
│   ├── utilities/      # Common helper functions
│   └── test-helpers/   # Test utilities and mocks
```

## Usage

### Import from the main package

```typescript
import { validators, formatters, testHelpers } from '@quality-platform/shared';
```

### Import specific modules

```typescript
import { emailValidator, phoneValidator } from '@quality-platform/shared/validation';
import { formatCurrency, parseDate } from '@quality-platform/shared/utilities';
import { createMockUser, createMockProduct } from '@quality-platform/shared/test-helpers';
```

## API Reference

### Validation Module

Common validators for data validation across the platform.

#### Available Validators

- `emailValidator(email: string): boolean` - Validates email format
- `phoneValidator(phone: string): boolean` - Validates phone number format
- `urlValidator(url: string): boolean` - Validates URL format
- `uuidValidator(uuid: string): boolean` - Validates UUID v4 format
- `creditCardValidator(card: string): boolean` - Validates credit card numbers

### Utilities Module

Helper functions for common operations.

#### Available Utilities

- `formatCurrency(amount: number, currency?: string): string` - Formats currency values
- `parseDate(date: string | Date): Date` - Safely parses dates
- `slugify(text: string): string` - Creates URL-safe slugs
- `debounce<T>(func: T, wait: number): T` - Debounces function calls
- `deepClone<T>(obj: T): T` - Deep clones objects

### Test Helpers Module

Utilities for testing including mocks and fixtures.

#### Available Helpers

- `createMockUser(overrides?: Partial<User>): User` - Creates mock user objects
- `createMockProduct(overrides?: Partial<Product>): Product` - Creates mock products
- `createMockOrder(overrides?: Partial<Order>): Order` - Creates mock orders
- `setupTestDatabase(): Promise<void>` - Sets up test database
- `cleanupTestDatabase(): Promise<void>` - Cleans up test database

## Testing

Run tests for the shared library:

```bash
pnpm nx test shared
```

Run tests with coverage:

```bash
pnpm nx test shared --coverage
```

## Development

### Building the Library

```bash
pnpm nx build shared
```

### Linting

```bash
pnpm nx lint shared
```

### Type Checking

```bash
pnpm nx typecheck shared
```

## Best Practices

1. **Keep it Generic**: Only add utilities that are truly shared across multiple applications
2. **Document Everything**: All exported functions should have JSDoc comments
3. **Test Thoroughly**: Maintain 100% test coverage for shared utilities
4. **Version Carefully**: Breaking changes should be avoided or clearly communicated
5. **Performance Matters**: Shared utilities should be optimized for performance

## Contributing

When adding new utilities:

1. Add the implementation in the appropriate module directory
2. Export it from the module's index.ts
3. Add comprehensive unit tests
4. Update this README with the new utility documentation
5. Consider backward compatibility

## License

MIT