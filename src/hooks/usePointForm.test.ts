import { act, renderHook } from '@testing-library/react';
import type { SubmitEvent } from 'react';
import { createElement, type ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { createPoint, updatePoint } from '../services/points';
import { buildPoint } from '../test/factories';
import { buildUpdatePayload, usePointForm } from './usePointForm';

vi.mock('../services/points');

const event = { preventDefault: vi.fn() } as unknown as SubmitEvent<HTMLFormElement>;
const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(MemoryRouter, null, children);

describe('usePointForm', () => {
  it('cria quando nao ha ponto', async () => {
    vi.mocked(createPoint).mockResolvedValue(buildPoint());
    const { result } = renderHook(() => usePointForm({ point: null, onSaved: vi.fn() }), {
      wrapper,
    });

    act(() => {
      result.current.setField('name', 'Biblioteca Central');
      result.current.setField('summary', 'Resumo');
      result.current.setField('history', 'Historia');
    });
    await act(() => result.current.submit(event));

    expect(createPoint).toHaveBeenCalledOnce();
    expect(updatePoint).not.toHaveBeenCalled();
  });

  it('atualiza quando ha ponto e repassa o resultado', async () => {
    const saved = buildPoint({ name: 'Novo nome' });
    vi.mocked(updatePoint).mockResolvedValue(saved);
    const onSaved = vi.fn();
    const point = buildPoint({ media: [{ id: 'm1', kind: 'photo', url: 'u' }] as never });
    const { result } = renderHook(() => usePointForm({ point, onSaved }), { wrapper });

    await act(() => result.current.submit(event));

    expect(createPoint).not.toHaveBeenCalled();
    expect(onSaved).toHaveBeenCalledWith(saved);
    const payload = vi.mocked(updatePoint).mock.calls[0][1];
    expect(payload).not.toHaveProperty('media');
  });
});

describe('buildUpdatePayload', () => {
  const values = { name: 'N', slug: 's', summary: 'R', history: 'H' };

  it('inclui o slug em rascunho e omite em publicado', () => {
    expect(buildUpdatePayload(buildPoint(), values)).toEqual(values);
    expect(buildUpdatePayload(buildPoint({ status: 'published' }), values)).not.toHaveProperty(
      'slug',
    );
  });
});
