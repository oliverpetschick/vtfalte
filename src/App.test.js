import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the public navigation', () => {
  render(<App />);
  expect(screen.getByText('Info')).toBeInTheDocument();
  expect(screen.getByText('Atlas')).toBeInTheDocument();
  expect(screen.getByText('Galerie')).toBeInTheDocument();
});
