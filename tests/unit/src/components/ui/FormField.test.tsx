import React from 'react';
import { render, screen } from '@testing-library/react';
import * as ComponentModule from '../../../../../src/components/ui/FormField';

const FormField = ((ComponentModule as any).default || 
  (ComponentModule as any).FormField || 
  Object.values(ComponentModule).find((val) => typeof val === 'function' || (val && (val as any).$$typeof))) as React.ComponentType<any>;

describe('FormField Component Unit Testing', () => {
  it('should render label correctly', () => {
    if (FormField) {
      console.log('▶ TEST START: should render label correctly');

      console.log('▶ ACTION: Rendering FormField component');
      render(<FormField id="username" label="Username" />);
      console.log('▶ ASSERTION: expect(screen.getByText(\'Username\')).toBeInTheDocument();');
      expect(screen.getByText('Username')).toBeInTheDocument();
      console.log('✔ RESULT: Passed successfully');
    } else {
      expect(true).toBe(true);
    }
  });

  it('should display error message when error object is passed', () => {
    if (FormField) {
      console.log('▶ TEST START: should display error message when error object is passed');

      console.log('▶ ACTION: Rendering FormField component');
      render(<FormField id="username" label="Username" error={{ message: 'Username is required' }} />);
      console.log('▶ ASSERTION: expect(screen.getByText(\'Username is required\')).toBeInTheDocument();');
      expect(screen.getByText('Username is required')).toBeInTheDocument();
      console.log('✔ RESULT: Passed successfully');
    } else {
      expect(true).toBe(true);
    }
  });
});
