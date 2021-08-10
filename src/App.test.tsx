import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

it('renders application header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Wordsearch/i);
  expect(headerElement).toBeInTheDocument();
});
