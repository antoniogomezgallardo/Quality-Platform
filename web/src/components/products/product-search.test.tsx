import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductSearch } from './product-search';

describe('ProductSearch Component', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  describe('Rendering', () => {
    it('should render search form with default elements', () => {
      render(<ProductSearch onSearch={mockOnSearch} />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });

    it('should render with custom placeholder', () => {
      render(<ProductSearch onSearch={mockOnSearch} placeholder="Find items..." />);

      expect(screen.getByPlaceholderText('Find items...')).toBeInTheDocument();
    });

    it('should render search icon', () => {
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchInput = screen.getByPlaceholderText('Search products...');
      const form = searchInput.closest('form');
      const searchIcon = form?.querySelector('svg');

      expect(searchIcon).toBeInTheDocument();
    });

    it('should initially hide clear button', () => {
      render(<ProductSearch onSearch={mockOnSearch} />);

      const clearButtons = screen.queryAllByRole('button');
      expect(clearButtons).toHaveLength(1); // Only search button
      expect(clearButtons[0]).toHaveTextContent('Search');
    });
  });

  describe('Search Input Behavior', () => {
    it('should update search term on input change', async () => {
      const user = userEvent.setup();
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchInput = screen.getByPlaceholderText('Search products...');
      await user.type(searchInput, 'laptop');

      expect(searchInput).toHaveValue('laptop');
    });

    it('should handle empty input', () => {
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchInput = screen.getByPlaceholderText('Search products...');
      expect(searchInput).toHaveValue('');
    });

    it('should handle special characters in search', async () => {
      const user = userEvent.setup();
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchInput = screen.getByPlaceholderText('Search products...');
      await user.type(searchInput, 'test@#$%');

      expect(searchInput).toHaveValue('test@#$%');
    });

    it('should handle long search terms', async () => {
      const user = userEvent.setup();
      render(<ProductSearch onSearch={mockOnSearch} />);

      const longSearchTerm = 'this is a very long search term that users might type when looking for specific products';
      const searchInput = screen.getByPlaceholderText('Search products...');
      await user.type(searchInput, longSearchTerm);

      expect(searchInput).toHaveValue(longSearchTerm);
    });
  });

  describe('Clear Button Behavior', () => {
    it('should show clear button when search term is entered', async () => {
      const user = userEvent.setup();
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchInput = screen.getByPlaceholderText('Search products...');
      await user.type(searchInput, 'test');

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2); // Search button + Clear button
      expect(buttons[1]).toHaveTextContent('Search'); // Search button is always last
    });

    it('should clear search term when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchInput = screen.getByPlaceholderText('Search products...');
      await user.type(searchInput, 'test');

      const buttons = screen.getAllByRole('button');
      const clearButton = buttons[0]; // First button is clear button
      await user.click(clearButton);

      expect(searchInput).toHaveValue('');
    });

    it('should call onSearch with empty string when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchInput = screen.getByPlaceholderText('Search products...');
      await user.type(searchInput, 'test');

      const buttons = screen.getAllByRole('button');
      const clearButton = buttons[0]; // First button is clear button
      await user.click(clearButton);

      expect(mockOnSearch).toHaveBeenCalledWith('');
    });

    it('should hide clear button after clearing', async () => {
      const user = userEvent.setup();
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchInput = screen.getByPlaceholderText('Search products...');
      await user.type(searchInput, 'test');

      const buttons = screen.getAllByRole('button');
      const clearButton = buttons[0]; // First button is clear button
      await user.click(clearButton);

      const finalButtons = screen.getAllByRole('button');
      expect(finalButtons).toHaveLength(1); // Only search button remains
    });
  });

  describe('Search Button Behavior', () => {
    it('should call onSearch when search button is clicked', async () => {
      const user = userEvent.setup();
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchInput = screen.getByPlaceholderText('Search products...');
      const searchButton = screen.getByRole('button', { name: /search/i });

      await user.type(searchInput, 'laptop');
      await user.click(searchButton);

      expect(mockOnSearch).toHaveBeenCalledWith('laptop');
    });

    it('should call onSearch with empty string if no search term', async () => {
      const user = userEvent.setup();
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchButton = screen.getByRole('button', { name: /search/i });
      await user.click(searchButton);

      expect(mockOnSearch).toHaveBeenCalledWith('');
    });

    it('should have correct button type', () => {
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchButton = screen.getByRole('button', { name: /search/i });
      expect(searchButton).toHaveAttribute('type', 'submit');
    });
  });

  describe('Form Submission', () => {
    it('should call onSearch when form is submitted', async () => {
      const user = userEvent.setup();
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchInput = screen.getByPlaceholderText('Search products...');
      await user.type(searchInput, 'keyboard');

      const form = searchInput.closest('form');
      expect(form).toBeInTheDocument();
      fireEvent.submit(form!);

      expect(mockOnSearch).toHaveBeenCalledWith('keyboard');
    });

    it('should prevent default form submission', () => {
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchInput = screen.getByPlaceholderText('Search products...');
      const form = searchInput.closest('form');
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault');

      fireEvent(form!, submitEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should handle Enter key press in input', async () => {
      const user = userEvent.setup();
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchInput = screen.getByPlaceholderText('Search products...');
      await user.type(searchInput, 'mouse');
      await user.keyboard('[Enter]');

      expect(mockOnSearch).toHaveBeenCalledWith('mouse');
    });
  });

  describe('Multiple Search Interactions', () => {
    it('should handle multiple searches', async () => {
      const user = userEvent.setup();
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchInput = screen.getByPlaceholderText('Search products...');
      const searchButton = screen.getByRole('button', { name: /search/i });

      // First search
      await user.type(searchInput, 'laptop');
      await user.click(searchButton);

      // Clear and second search
      let buttons = screen.getAllByRole('button');
      const clearButton = buttons[0]; // First button is clear button
      await user.click(clearButton);
      await user.type(searchInput, 'phone');
      await user.click(searchButton);

      expect(mockOnSearch).toHaveBeenNthCalledWith(1, 'laptop');
      expect(mockOnSearch).toHaveBeenNthCalledWith(2, '');
      expect(mockOnSearch).toHaveBeenNthCalledWith(3, 'phone');
    });

    it('should maintain search functionality after multiple interactions', async () => {
      const user = userEvent.setup();
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchInput = screen.getByPlaceholderText('Search products...');

      // Type, clear, type again
      await user.type(searchInput, 'test1');
      const buttons = screen.getAllByRole('button');
      const clearButton = buttons[0]; // First button is clear button
      await user.click(clearButton);
      await user.type(searchInput, 'test2');

      expect(searchInput).toHaveValue('test2');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form element', () => {
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchInput = screen.getByPlaceholderText('Search products...');
      const form = searchInput.closest('form');
      expect(form).toBeInTheDocument();
      expect(form?.tagName).toBe('FORM');
    });

    it('should have focusable search input', () => {
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchInput = screen.getByPlaceholderText('Search products...');
      searchInput.focus();
      expect(searchInput).toHaveFocus();
    });

    it('should have focusable search button', () => {
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchButton = screen.getByRole('button', { name: /search/i });
      searchButton.focus();
      expect(searchButton).toHaveFocus();
    });

    it('should have focusable clear button when visible', async () => {
      const user = userEvent.setup();
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchInput = screen.getByPlaceholderText('Search products...');
      await user.type(searchInput, 'test');

      const buttons = screen.getAllByRole('button');
      const clearButton = buttons[0]; // First button is clear button
      clearButton.focus();
      expect(clearButton).toHaveFocus();
    });

    it('should have proper button types', async () => {
      const user = userEvent.setup();
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchInput = screen.getByPlaceholderText('Search products...');
      await user.type(searchInput, 'test');

      const buttons = screen.getAllByRole('button');
      const clearButton = buttons[0]; // First button is clear button
      const searchButton = buttons[1]; // Second button is search button

      expect(searchButton).toHaveAttribute('type', 'submit');
      expect(clearButton).toHaveAttribute('type', 'button');
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should apply correct CSS classes to form', () => {
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchInput = screen.getByPlaceholderText('Search products...');
      const form = searchInput.closest('form');
      expect(form).toHaveClass('relative');
    });

    it('should apply correct CSS classes to search input', () => {
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchInput = screen.getByPlaceholderText('Search products...');
      expect(searchInput).toHaveClass(
        'block',
        'w-full',
        'pl-10',
        'pr-20',
        'py-2',
        'border',
        'border-gray-300',
        'rounded-md'
      );
    });

    it('should apply correct CSS classes to search button', () => {
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchButton = screen.getByRole('button', { name: /search/i });
      expect(searchButton).toHaveClass(
        'px-4',
        'py-2',
        'text-sm',
        'font-medium',
        'text-white',
        'bg-blue-600',
        'rounded-r-md'
      );
    });

    it('should apply hover classes to clear button', async () => {
      const user = userEvent.setup();
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchInput = screen.getByPlaceholderText('Search products...');
      await user.type(searchInput, 'test');

      const buttons = screen.getAllByRole('button');
      const clearButton = buttons[0]; // First button is clear button
      expect(clearButton).toHaveClass('text-gray-400', 'hover:text-gray-600');
    });
  });

  describe('Edge Cases', () => {
    it('should handle onSearch prop changes', () => {
      const newOnSearch = jest.fn();
      const { rerender } = render(<ProductSearch onSearch={mockOnSearch} />);

      rerender(<ProductSearch onSearch={newOnSearch} />);

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      expect(newOnSearch).toHaveBeenCalledWith('');
      expect(mockOnSearch).not.toHaveBeenCalled();
    });

    it('should handle rapid successive searches', async () => {
      const user = userEvent.setup();
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchButton = screen.getByRole('button', { name: /search/i });

      // Rapid clicks
      await user.click(searchButton);
      await user.click(searchButton);
      await user.click(searchButton);

      expect(mockOnSearch).toHaveBeenCalledTimes(3);
    });

    it('should handle whitespace-only search terms', async () => {
      const user = userEvent.setup();
      render(<ProductSearch onSearch={mockOnSearch} />);

      const searchInput = screen.getByPlaceholderText('Search products...');
      const searchButton = screen.getByRole('button', { name: /search/i });

      await user.type(searchInput, '   ');
      await user.click(searchButton);

      expect(mockOnSearch).toHaveBeenCalledWith('   ');
    });
  });
});