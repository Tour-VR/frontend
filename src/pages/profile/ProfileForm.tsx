import { FormField } from '../../components/points/FormField';
import { useProfileForm } from '../../hooks/useProfileForm';
import { FormCard } from '../../components/ui/FormCard';

const NAME_MAX = 120;
const USERNAME_MAX = 30;

/** Dados pessoais: e-mail (somente leitura), nome completo e username. */
export function ProfileForm() {
  const form = useProfileForm();

  return (
    <FormCard
      title="Dados pessoais"
      submitLabel="Salvar"
      submitting={form.submitting}
      error={form.error}
      success={form.success}
      onSubmit={() => void form.submit()}
    >
      <FormField
        label="E-mail"
        type="email"
        value={form.email}
        onChange={() => undefined}
        hint="O e-mail não pode ser alterado."
        disabled
      />
      <FormField
        label="Nome completo"
        value={form.fullName}
        onChange={form.setFullName}
        maxLength={NAME_MAX}
      />
      <FormField
        label="Username"
        value={form.username}
        onChange={form.setUsername}
        maxLength={USERNAME_MAX}
        hint="Letras minúsculas, números, ponto, underscore ou hífen."
      />
    </FormCard>
  );
}
