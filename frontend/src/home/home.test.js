import { render, screen } from '@testing-library/react';
import Home from './home';

test('renders learn react link', () => {
  render(<Home />);
  const linkElement = screen.getByText('hello');
  expect(linkElement).toBeInTheDocument();
});
