import { render, screen } from '@testing-library/react';
import {IssuesPage} from "./pages/issue/IssuesPage";

test('renders learn react link', () => {
  render(<IssuesPage />);
  const linkElement = screen.getAllByText(/Home/i);
  expect(linkElement.length).toBeGreaterThan(0);
});
