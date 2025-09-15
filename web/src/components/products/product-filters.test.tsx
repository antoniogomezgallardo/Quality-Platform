import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductFilters } from './product-filters';

describe('ProductFilters Component', () => {
  const mockProps = {
    categories: ['Electronics', 'Books', 'Clothing'],
    selectedCategory: '',
    onCategoryChange: jest.fn(),
    priceRange: { min: 0, max: 1000 },
    onPriceRangeChange: jest.fn(),
    inStockOnly: false,
    onInStockChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render filters title', () => {
      render(<ProductFilters {...mockProps} />);

      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('should render category section', () => {
      render(<ProductFilters {...mockProps} />);

      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('All Categories')).toBeInTheDocument();
      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('Books')).toBeInTheDocument();
      expect(screen.getByText('Clothing')).toBeInTheDocument();
    });

    it('should render price range section', () => {
      render(<ProductFilters {...mockProps} />);

      expect(screen.getByText('Price Range')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Min')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Max')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /apply/i })).toBeInTheDocument();
    });

    it('should render availability section', () => {
      render(<ProductFilters {...mockProps} />);

      expect(screen.getByText('Availability')).toBeInTheDocument();
      expect(screen.getByText('In Stock Only')).toBeInTheDocument();
    });

    it('should render clear filters button', () => {
      render(<ProductFilters {...mockProps} />);

      expect(screen.getByRole('button', { name: /clear all filters/i })).toBeInTheDocument();
    });
  });

  describe('Category Selection', () => {
    it('should have All Categories selected by default', () => {
      render(<ProductFilters {...mockProps} />);

      const allCategoriesRadio = screen.getByRole('radio', { name: /all categories/i });
      expect(allCategoriesRadio).toBeChecked();
    });

    it('should have specific category selected when provided', () => {
      render(<ProductFilters {...mockProps} selectedCategory="Electronics" />);

      const electronicsRadio = screen.getByRole('radio', { name: /electronics/i });
      const allCategoriesRadio = screen.getByRole('radio', { name: /all categories/i });

      expect(electronicsRadio).toBeChecked();
      expect(allCategoriesRadio).not.toBeChecked();
    });

    it('should call onCategoryChange when category is selected', async () => {
      const user = userEvent.setup();
      render(<ProductFilters {...mockProps} />);

      const booksRadio = screen.getByRole('radio', { name: /books/i });
      await user.click(booksRadio);

      expect(mockProps.onCategoryChange).toHaveBeenCalledWith('Books');
    });

    it('should call onCategoryChange when All Categories is selected', async () => {
      const user = userEvent.setup();
      render(<ProductFilters {...mockProps} selectedCategory="Electronics" />);

      const allCategoriesRadio = screen.getByRole('radio', { name: /all categories/i });
      await user.click(allCategoriesRadio);

      expect(mockProps.onCategoryChange).toHaveBeenCalledWith('');
    });

    it('should render categories dynamically', () => {
      const customCategories = ['Sports', 'Toys', 'Home'];
      render(<ProductFilters {...mockProps} categories={customCategories} />);

      expect(screen.getByText('Sports')).toBeInTheDocument();
      expect(screen.getByText('Toys')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.queryByText('Electronics')).not.toBeInTheDocument();
    });

    it('should handle empty categories array', () => {
      render(<ProductFilters {...mockProps} categories={[]} />);

      expect(screen.getByText('All Categories')).toBeInTheDocument();
      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(1); // Only "All Categories"
    });
  });

  describe('Price Range Functionality', () => {
    it('should display initial price range values', () => {
      render(<ProductFilters {...mockProps} priceRange={{ min: 10, max: 500 }} />);

      const minInput = screen.getByPlaceholderText('Min');
      const maxInput = screen.getByPlaceholderText('Max');

      expect(minInput).toHaveValue(10);
      expect(maxInput).toHaveValue(500);
    });

    it('should update min price input value', async () => {
      const user = userEvent.setup();
      render(<ProductFilters {...mockProps} />);

      const minInput = screen.getByPlaceholderText('Min');
      await user.clear(minInput);
      await user.type(minInput, '50');

      expect(minInput).toHaveValue(50);
    });

    it('should update max price input value', async () => {
      const user = userEvent.setup();
      render(<ProductFilters {...mockProps} />);

      const maxInput = screen.getByPlaceholderText('Max');
      await user.clear(maxInput);
      await user.type(maxInput, '200');

      expect(maxInput).toHaveValue(200);
    });

    it('should call onPriceRangeChange when form is submitted', async () => {
      const user = userEvent.setup();
      render(<ProductFilters {...mockProps} />);

      const minInput = screen.getByPlaceholderText('Min');
      const maxInput = screen.getByPlaceholderText('Max');
      const applyButton = screen.getByRole('button', { name: /apply/i });

      await user.clear(minInput);
      await user.type(minInput, '100');
      await user.clear(maxInput);
      await user.type(maxInput, '500');
      await user.click(applyButton);

      expect(mockProps.onPriceRangeChange).toHaveBeenCalledWith({
        min: 100,
        max: 500,
      });
    });

    it('should handle invalid price inputs', async () => {
      const user = userEvent.setup();
      render(<ProductFilters {...mockProps} />);

      const minInput = screen.getByPlaceholderText('Min');
      const maxInput = screen.getByPlaceholderText('Max');
      const applyButton = screen.getByRole('button', { name: /apply/i });

      await user.clear(minInput);
      await user.type(minInput, 'invalid');
      await user.clear(maxInput);
      await user.type(maxInput, 'also-invalid');
      await user.click(applyButton);

      expect(mockProps.onPriceRangeChange).toHaveBeenCalledWith({
        min: 0,
        max: 999999,
      });
    });

    it('should handle empty price inputs', async () => {
      const user = userEvent.setup();
      render(<ProductFilters {...mockProps} />);

      const minInput = screen.getByPlaceholderText('Min');
      const maxInput = screen.getByPlaceholderText('Max');
      const applyButton = screen.getByRole('button', { name: /apply/i });

      await user.clear(minInput);
      await user.clear(maxInput);
      await user.click(applyButton);

      expect(mockProps.onPriceRangeChange).toHaveBeenCalledWith({
        min: 0,
        max: 999999,
      });
    });

    it('should prevent default form submission', () => {
      render(<ProductFilters {...mockProps} />);

      const minInput = screen.getByPlaceholderText('Min');
      const form = minInput.closest('form');
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault');

      fireEvent(form!, submitEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Stock Availability', () => {
    it('should have checkbox unchecked by default', () => {
      render(<ProductFilters {...mockProps} />);

      const stockCheckbox = screen.getByRole('checkbox', { name: /in stock only/i });
      expect(stockCheckbox).not.toBeChecked();
    });

    it('should have checkbox checked when inStockOnly is true', () => {
      render(<ProductFilters {...mockProps} inStockOnly={true} />);

      const stockCheckbox = screen.getByRole('checkbox', { name: /in stock only/i });
      expect(stockCheckbox).toBeChecked();
    });

    it('should call onInStockChange when checkbox is clicked', async () => {
      const user = userEvent.setup();
      render(<ProductFilters {...mockProps} />);

      const stockCheckbox = screen.getByRole('checkbox', { name: /in stock only/i });
      await user.click(stockCheckbox);

      expect(mockProps.onInStockChange).toHaveBeenCalledWith(true);
    });

    it('should call onInStockChange when checkbox is unchecked', async () => {
      const user = userEvent.setup();
      render(<ProductFilters {...mockProps} inStockOnly={true} />);

      const stockCheckbox = screen.getByRole('checkbox', { name: /in stock only/i });
      await user.click(stockCheckbox);

      expect(mockProps.onInStockChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Clear All Filters', () => {
    it('should call all reset functions when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<ProductFilters {...mockProps} />);

      const clearButton = screen.getByRole('button', { name: /clear all filters/i });
      await user.click(clearButton);

      expect(mockProps.onCategoryChange).toHaveBeenCalledWith('');
      expect(mockProps.onPriceRangeChange).toHaveBeenCalledWith({ min: 0, max: 999999 });
      expect(mockProps.onInStockChange).toHaveBeenCalledWith(false);
    });

    it('should reset price input fields when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<ProductFilters {...mockProps} priceRange={{ min: 100, max: 500 }} />);

      const minInput = screen.getByPlaceholderText('Min');
      const maxInput = screen.getByPlaceholderText('Max');
      const clearButton = screen.getByRole('button', { name: /clear all filters/i });

      // Verify initial values
      expect(minInput).toHaveValue(100);
      expect(maxInput).toHaveValue(500);

      await user.click(clearButton);

      expect(minInput).toHaveValue(null);
      expect(maxInput).toHaveValue(null);
    });
  });

  describe('Form Input Types', () => {
    it('should have correct input types', () => {
      render(<ProductFilters {...mockProps} />);

      const radios = screen.getAllByRole('radio');
      const minInput = screen.getByPlaceholderText('Min');
      const maxInput = screen.getByPlaceholderText('Max');
      const checkbox = screen.getByRole('checkbox');

      expect(radios.length).toBeGreaterThan(0);
      expect(minInput).toHaveAttribute('type', 'number');
      expect(maxInput).toHaveAttribute('type', 'number');
      expect(checkbox).toHaveAttribute('type', 'checkbox');
    });

    it('should have proper name attributes for radio buttons', () => {
      render(<ProductFilters {...mockProps} />);

      const radios = screen.getAllByRole('radio');
      radios.forEach(radio => {
        expect(radio).toHaveAttribute('name', 'category');
      });
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should apply container styles', () => {
      render(<ProductFilters {...mockProps} />);

      const container = screen.getByText('Filters').closest('div');
      expect(container).toHaveClass('bg-white', 'rounded-lg', 'shadow', 'p-6');
    });

    it('should apply correct button styles', () => {
      render(<ProductFilters {...mockProps} />);

      const applyButton = screen.getByRole('button', { name: /apply/i });
      const clearButton = screen.getByRole('button', { name: /clear all filters/i });

      expect(applyButton).toHaveClass('bg-blue-600', 'text-white');
      expect(clearButton).toHaveClass('border', 'border-gray-300', 'text-gray-700');
    });

    it('should apply correct input styles', () => {
      render(<ProductFilters {...mockProps} />);

      const minInput = screen.getByPlaceholderText('Min');
      const maxInput = screen.getByPlaceholderText('Max');

      expect(minInput).toHaveClass('border', 'border-gray-300', 'rounded-md');
      expect(maxInput).toHaveClass('border', 'border-gray-300', 'rounded-md');
    });
  });

  describe('Accessibility', () => {
    it('should have proper label associations', () => {
      render(<ProductFilters {...mockProps} />);

      const allCategoriesRadio = screen.getByRole('radio', { name: /all categories/i });
      const electronicsRadio = screen.getByRole('radio', { name: /electronics/i });
      const stockCheckbox = screen.getByRole('checkbox', { name: /in stock only/i });

      expect(allCategoriesRadio).toBeInTheDocument();
      expect(electronicsRadio).toBeInTheDocument();
      expect(stockCheckbox).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      render(<ProductFilters {...mockProps} />);

      const mainHeading = screen.getByText('Filters');
      const categoryHeading = screen.getByText('Category');
      const priceHeading = screen.getByText('Price Range');
      const availabilityHeading = screen.getByText('Availability');

      expect(mainHeading.tagName).toBe('H3');
      expect(categoryHeading.tagName).toBe('H4');
      expect(priceHeading.tagName).toBe('H4');
      expect(availabilityHeading.tagName).toBe('H4');
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<ProductFilters {...mockProps} />);

      const firstRadio = screen.getByRole('radio', { name: /all categories/i });

      // Focus on the first radio button directly
      firstRadio.focus();
      expect(firstRadio).toHaveFocus();

      // Arrow key navigation within radio group
      await user.keyboard('[ArrowDown]');
      const secondRadio = screen.getByRole('radio', { name: /electronics/i });
      expect(secondRadio).toHaveFocus();
    });

    it('should handle focus on form elements', () => {
      render(<ProductFilters {...mockProps} />);

      const minInput = screen.getByPlaceholderText('Min');
      const maxInput = screen.getByPlaceholderText('Max');
      const applyButton = screen.getByRole('button', { name: /apply/i });

      minInput.focus();
      expect(minInput).toHaveFocus();

      maxInput.focus();
      expect(maxInput).toHaveFocus();

      applyButton.focus();
      expect(applyButton).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('should handle category with special characters', () => {
      const specialCategories = ['Books & Media', 'Health/Beauty', 'Toys & Games'];
      render(<ProductFilters {...mockProps} categories={specialCategories} />);

      expect(screen.getByText('Books & Media')).toBeInTheDocument();
      expect(screen.getByText('Health/Beauty')).toBeInTheDocument();
      expect(screen.getByText('Toys & Games')).toBeInTheDocument();
    });

    it('should handle large category names', () => {
      const longCategories = ['Very Long Category Name That Might Wrap'];
      render(<ProductFilters {...mockProps} categories={longCategories} />);

      expect(screen.getByText('Very Long Category Name That Might Wrap')).toBeInTheDocument();
    });

    it('should handle negative price inputs', async () => {
      const user = userEvent.setup();
      render(<ProductFilters {...mockProps} />);

      const minInput = screen.getByPlaceholderText('Min');
      const maxInput = screen.getByPlaceholderText('Max');
      const applyButton = screen.getByRole('button', { name: /apply/i });

      await user.clear(minInput);
      await user.type(minInput, '-50');
      // Clear max input to avoid using the initial value from props
      await user.clear(maxInput);
      await user.click(applyButton);

      expect(mockProps.onPriceRangeChange).toHaveBeenCalledWith({
        min: -50,
        max: 999999,
      });
    });

    it('should handle very large price inputs', async () => {
      const user = userEvent.setup();
      render(<ProductFilters {...mockProps} />);

      const maxInput = screen.getByPlaceholderText('Max');
      const applyButton = screen.getByRole('button', { name: /apply/i });

      await user.clear(maxInput);
      await user.type(maxInput, '999999999');
      await user.click(applyButton);

      expect(mockProps.onPriceRangeChange).toHaveBeenCalledWith({
        min: 0,
        max: 999999999,
      });
    });

    it('should handle rapid consecutive interactions', async () => {
      const user = userEvent.setup();
      render(<ProductFilters {...mockProps} />);

      const clearButton = screen.getByRole('button', { name: /clear all filters/i });

      // Rapid clicks
      await user.click(clearButton);
      await user.click(clearButton);
      await user.click(clearButton);

      expect(mockProps.onCategoryChange).toHaveBeenCalledTimes(3);
    });
  });
});