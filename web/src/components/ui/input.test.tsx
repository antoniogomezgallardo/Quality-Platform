import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './input';

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render input with default props', () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should render input with placeholder', () => {
      render(<Input placeholder="Enter text" />);

      const input = screen.getByPlaceholderText('Enter text');
      expect(input).toBeInTheDocument();
    });

    it('should render input with value', () => {
      render(<Input value="test value" readOnly />);

      const input = screen.getByDisplayValue('test value');
      expect(input).toBeInTheDocument();
    });

    it('should render input with label', () => {
      render(<Input label="Username" />);

      const label = screen.getByText('Username');
      const input = screen.getByRole('textbox');

      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe('LABEL');
      expect(input).toBeInTheDocument();
    });

    it('should not render label when not provided', () => {
      render(<Input />);

      expect(screen.queryByRole('textbox')).toBeInTheDocument();
      expect(screen.queryByText(/label/i)).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should render error message when error prop is provided', () => {
      render(<Input error="This field is required" />);

      const errorMessage = screen.getByText('This field is required');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass('text-red-600');
    });

    it('should apply error styling when error is present', () => {
      render(<Input error="Error message" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass(
        'border-red-300',
        'text-red-900',
        'placeholder-red-300',
        'focus:ring-red-500',
        'focus:border-red-500'
      );
    });

    it('should not apply error styling when no error', () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      expect(input).not.toHaveClass(
        'border-red-300',
        'text-red-900',
        'placeholder-red-300',
        'focus:ring-red-500',
        'focus:border-red-500'
      );
    });

    it('should not render error message when error prop is not provided', () => {
      render(<Input />);

      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });

    it('should render both label and error message', () => {
      render(<Input label="Email" error="Invalid email format" />);

      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle text input', async () => {
      const user = userEvent.setup();
      render(<Input />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Hello World');

      expect(input).toHaveValue('Hello World');
    });

    it('should handle onChange event', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({
        target: expect.objectContaining({
          value: 'test'
        })
      }));
    });

    it('should handle onFocus event', () => {
      const handleFocus = jest.fn();
      render(<Input onFocus={handleFocus} />);

      const input = screen.getByRole('textbox');
      fireEvent.focus(input);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('should handle onBlur event', () => {
      const handleBlur = jest.fn();
      render(<Input onBlur={handleBlur} />);

      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      fireEvent.blur(input);

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard events', () => {
      const handleKeyDown = jest.fn();
      render(<Input onKeyDown={handleKeyDown} />);

      const input = screen.getByRole('textbox');
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });
  });

  describe('Input Types', () => {
    it('should render as password input', () => {
      render(<Input type="password" />);

      const input = screen.getByDisplayValue('');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('should render as email input', () => {
      render(<Input type="email" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should render as number input', () => {
      render(<Input type="number" />);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('should render as search input', () => {
      render(<Input type="search" />);

      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('type', 'search');
    });
  });

  describe('Input States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />);

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('should be enabled when disabled prop is false', () => {
      render(<Input disabled={false} />);

      const input = screen.getByRole('textbox');
      expect(input).not.toBeDisabled();
    });

    it('should be readonly when readOnly prop is true', () => {
      render(<Input readOnly />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readOnly');
    });

    it('should be required when required prop is true', () => {
      render(<Input required />);

      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });
  });

  describe('Custom Props', () => {
    it('should accept and apply custom className', () => {
      render(<Input className="custom-class" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });

    it('should forward HTML input attributes', () => {
      render(
        <Input
          id="test-input"
          name="testName"
          maxLength={10}
          min={1}
          max={100}
          data-testid="input-test"
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'test-input');
      expect(input).toHaveAttribute('name', 'testName');
      expect(input).toHaveAttribute('maxLength', '10');
      expect(input).toHaveAttribute('data-testid', 'input-test');
    });

    it('should handle autoComplete attribute', () => {
      render(<Input autoComplete="email" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('autoComplete', 'email');
    });

    it('should handle autoFocus attribute', () => {
      render(<Input autoFocus />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveFocus();
    });
  });

  describe('CSS Classes', () => {
    it('should always include base classes', () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass(
        'block',
        'w-full',
        'px-3',
        'py-2',
        'border',
        'border-gray-300',
        'rounded-md',
        'shadow-sm',
        'placeholder-gray-400',
        'focus:outline-none',
        'focus:ring-blue-500',
        'focus:border-blue-500'
      );
    });

    it('should combine base, error, and custom classes correctly', () => {
      render(
        <Input
          error="Error message"
          className="my-custom-class"
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('my-custom-class');
      expect(input).toHaveClass('border-red-300'); // error class
      expect(input).toHaveClass('block', 'w-full'); // base classes
    });
  });

  describe('Accessibility', () => {
    it('should have proper focus styles', () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus:outline-none', 'focus:ring-blue-500', 'focus:border-blue-500');
    });

    it('should be focusable when not disabled', () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      input.focus();
      expect(input).toHaveFocus();
    });

    it('should not be focusable when disabled', () => {
      render(<Input disabled />);

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('should support ARIA attributes', () => {
      render(
        <Input
          aria-label="Search input"
          aria-describedby="search-help"
          aria-invalid="true"
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Search input');
      expect(input).toHaveAttribute('aria-describedby', 'search-help');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should associate label with input using implicit labeling', () => {
      render(<Input label="Username" />);

      const input = screen.getByLabelText('Username');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty label', () => {
      render(<Input label="" />);

      expect(screen.queryByRole('textbox')).toBeInTheDocument();
      expect(screen.queryByText('', { selector: 'label' })).not.toBeInTheDocument();
    });

    it('should handle empty error', () => {
      render(<Input error="" />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(screen.queryByText('', { selector: 'p' })).not.toBeInTheDocument();
    });

    it('should handle null/undefined values gracefully', () => {
      render(<Input label={undefined} error={undefined} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should handle very long error messages', () => {
      const longError = 'This is a very long error message that might wrap to multiple lines and should still be displayed correctly without breaking the layout';
      render(<Input error={longError} />);

      const errorMessage = screen.getByText(longError);
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass('text-sm', 'text-red-600');
    });

    it('should handle special characters in input', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      const specialText = '!@#$%^&*()_+-=';
      fireEvent.change(input, { target: { value: specialText } });

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: specialText
          })
        })
      );
    });
  });
});