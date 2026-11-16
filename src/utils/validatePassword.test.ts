import { PASSWORD_RULE_MESSAGE, validatePassword } from './validatePassword';

describe('validatePassword', () => {
  it.each([
    ['curta', 'abc123'],
    ['sem numero', 'abcdefgh'],
    ['sem letra', '12345678'],
  ])('recusa senha %s', (_case, password) => {
    expect(validatePassword(password)).toBe(PASSWORD_RULE_MESSAGE);
  });

  it('aceita senha valida', () => {
    expect(validatePassword('senha1234')).toBeNull();
  });
});
