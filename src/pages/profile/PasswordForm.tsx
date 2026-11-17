import { FormField } from '../../components/points/FormField';
import { usePasswordForm } from '../../hooks/usePasswordForm';
import { FormCard } from '../../components/ui/FormCard';

/** Troca da propria senha: atual, nova e confirmacao. */
export function PasswordForm() {
  const { fields, setField, errors, submitting, success, submit } = usePasswordForm();

  return (
    <FormCard
      title="Trocar senha"
      submitLabel="Trocar senha"
      submitting={submitting}
      success={success}
      onSubmit={() => void submit()}
    >
      <FormField
        label="Senha atual"
        type="password"
        value={fields.current}
        onChange={(value) => {
          setField('current', value);
        }}
        error={errors.current}
      />
      <FormField
        label="Nova senha"
        type="password"
        value={fields.next}
        onChange={(value) => {
          setField('next', value);
        }}
        error={errors.next}
        hint="Pelo menos 8 caracteres, com letra e número."
      />
      <FormField
        label="Confirmar nova senha"
        type="password"
        value={fields.confirm}
        onChange={(value) => {
          setField('confirm', value);
        }}
        error={errors.confirm}
      />
    </FormCard>
  );
}
