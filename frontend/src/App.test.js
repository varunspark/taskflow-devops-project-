import { render, screen } from '@testing-library/react';
import App from './App';

test('renders TaskFlow app without crashing', () => {
  render(<App />);
  // The app redirects unauthenticated users to the login page,
  // so we just confirm the login heading shows up somewhere.
  const headings = screen.getAllByText(/TaskFlow/i);
  expect(headings.length).toBeGreaterThan(0);
});
