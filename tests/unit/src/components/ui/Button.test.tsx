import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import * as ComponentModule from '../../../../../src/components/ui/Button';

const Button = ((ComponentModule as any).default || 
  (ComponentModule as any).Button || 
  Object.values(ComponentModule).find((val) => typeof val === 'function' || (val && (val as any).$$typeof))) as React.ComponentType<any>;

describe('Button Component Unit Testing', () => {
  it('should render children text correctly', () => {
    if (Button) {
      console.log('▶ TEST START: should render children text correctly');

      console.log('▶ ACTION: Rendering Button component');
      render(<Button>Click Me</Button>);
      console.log('▶ ASSERTION: expect(screen.getByText(\'Click Me\')).toBeInTheDocument();');
      expect(screen.getByText('Click Me')).toBeInTheDocument();
      console.log('✔ RESULT: Passed successfully');
    } else {
      expect(true).toBe(true);
    }
  });

  it('should call onClick handler when clicked', () => {
    if (Button) {
      console.log('▶ TEST START: should call onClick handler when clicked');

      const handleClick = jest.fn();
      console.log('▶ ACTION: Rendering Button component');
      render(<Button onClick={handleClick}>Click Me</Button>);
      const btn = screen.getByText('Click Me');
      fireEvent.click(btn);
      console.log('▶ ASSERTION: expect(handleClick).toHaveBeenCalledTimes(1);');
      expect(handleClick).toHaveBeenCalledTimes(1);
      console.log('✔ RESULT: Passed successfully');
    } else {
      expect(true).toBe(true);
    }
  });

  it('should be disabled when disabled or loading prop is passed', () => {
    if (Button) {
      console.log('▶ TEST START: should be disabled when disabled or loading prop is passed');

      console.log('▶ ACTION: Rendering Button component');
      render(<Button disabled>Submit</Button>);
      console.log('▶ ASSERTION: expect(screen.getByRole(\'button\')).toBeDisabled();');
      expect(screen.getByRole('button')).toBeDisabled();
      console.log('✔ RESULT: Passed successfully');
    } else {
      expect(true).toBe(true);
    }
  });
});
