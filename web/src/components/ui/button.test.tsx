import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render button with default props', () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click me');
    });

    it('should render button with custom text', () => {
      render(<Button>Custom Text</Button>);

      expect(screen.getByText('Custom Text')).toBeInTheDocument();
    });

    it('should render button with children elements', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      );

      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should apply primary variant classes by default', () => {
      render(<Button>Primary</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white');
    });

    it('should apply secondary variant classes', () => {
      render(<Button variant="secondary">Secondary</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-600', 'hover:bg-gray-700', 'text-white');
    });

    it('should apply outline variant classes', () => {
      render(<Button variant="outline">Outline</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('border', 'border-gray-300', 'bg-white', 'text-gray-700');
    });
  });

  describe('Sizes', () => {
    it('should apply medium size classes by default', () => {
      render(<Button>Medium</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4', 'py-2', 'text-base');
    });

    it('should apply small size classes', () => {
      render(<Button size="sm">Small</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-3', 'py-2', 'text-sm');
    });

    it('should apply large size classes', () => {
      render(<Button size="lg">Large</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when isLoading is true', () => {
      render(<Button isLoading>Loading</Button>);

      const button = screen.getByRole('button');
      const spinner = button.querySelector('svg');

      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
      expect(button).toBeDisabled();
    });

    it('should not show loading spinner when isLoading is false', () => {
      render(<Button isLoading={false}>Not Loading</Button>);

      const button = screen.getByRole('button');
      const spinner = button.querySelector('svg');

      expect(spinner).not.toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });

    it('should disable button when loading', () => {
      render(<Button isLoading>Loading Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Disabled State', () => {
    it('should disable button when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:pointer-events-none');
    });

    it('should not disable button when disabled prop is false', () => {
      render(<Button disabled={false}>Enabled</Button>);

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });

    it('should disable button when both disabled and isLoading are true', () => {
      render(<Button disabled isLoading>Disabled Loading</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Event Handling', () => {
    it('should call onClick handler when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Clickable</Button>);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick} disabled>Disabled Button</Button>);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick} isLoading>Loading Button</Button>);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should handle keyboard events', () => {
      const handleKeyDown = jest.fn();
      render(<Button onKeyDown={handleKeyDown}>Keyboard Button</Button>);

      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Enter' });

      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });
  });

  describe('Custom Props', () => {
    it('should accept and apply custom className', () => {
      render(<Button className="custom-class">Custom</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should forward HTML button attributes', () => {
      render(
        <Button
          id="test-button"
          aria-label="Test button"
          data-testid="button-test"
        >
          Button
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'test-button');
      expect(button).toHaveAttribute('aria-label', 'Test button');
      expect(button).toHaveAttribute('data-testid', 'button-test');
    });

    it('should handle button type attribute', () => {
      render(<Button type="submit">Submit</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });
  });

  describe('CSS Classes', () => {
    it('should always include base classes', () => {
      render(<Button>Base Classes</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center',
        'font-medium',
        'rounded-md',
        'transition-colors',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-offset-2'
      );
    });

    it('should combine variant, size, and custom classes correctly', () => {
      render(
        <Button
          variant="outline"
          size="lg"
          className="my-custom-class"
        >
          Combined Classes
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('my-custom-class');
      expect(button).toHaveClass('border', 'border-gray-300'); // outline variant
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg'); // large size
    });
  });

  describe('Accessibility', () => {
    it('should have proper focus styles', () => {
      render(<Button>Focus Test</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2');
    });

    it('should be focusable when not disabled', () => {
      render(<Button>Focusable</Button>);

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('should not be focusable when disabled', () => {
      render(<Button disabled>Not Focusable</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('disabled:pointer-events-none');
    });

    it('should support ARIA attributes', () => {
      render(
        <Button
          aria-pressed="true"
          aria-describedby="description"
        >
          ARIA Button
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(button).toHaveAttribute('aria-describedby', 'description');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      render(<Button></Button>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toBeEmptyDOMElement();
    });

    it('should handle null children', () => {
      render(<Button>{null}</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should handle multiple class combinations', () => {
      render(
        <Button
          variant="primary"
          size="sm"
          isLoading
          className="extra-class"
        >
          Complex Button
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-600'); // primary variant
      expect(button).toHaveClass('px-3', 'py-2'); // small size
      expect(button).toHaveClass('extra-class'); // custom class
      expect(button).toBeDisabled(); // loading state
    });
  });
});