import { render, screen } from '@testing-library/react';
import { LOCAL_URL_WARNING, LocalUrlWarning } from './LocalUrlWarning';

describe('LocalUrlWarning', () => {
  it('aparece quando a URL e localhost', () => {
    render(<LocalUrlWarning baseUrl="http://localhost:3001" />);
    expect(screen.getByRole('note')).toHaveTextContent(LOCAL_URL_WARNING);
  });

  it('some quando a URL e um IP da rede', () => {
    render(<LocalUrlWarning baseUrl="https://192.168.0.10:3001" />);
    expect(screen.queryByRole('note')).not.toBeInTheDocument();
  });
});
