import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Mail } from 'lucide-react';
import { IconInput } from './IconInput';

describe('IconInput', () => {
  it('chama onChange com o valor digitado', async () => {
    const onChange = vi.fn();
    render(
      <IconInput
        label="Email"
        icon={Mail}
        type="email"
        value=""
        onChange={onChange}
        placeholder="voce@exemplo.com"
      />,
    );

    await userEvent.type(screen.getByLabelText('Email'), 'a');

    expect(onChange).toHaveBeenCalledWith('a');
  });
});
