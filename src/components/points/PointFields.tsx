import { HISTORY_MAX, SUMMARY_MAX } from '../../constants/points';
import type { PointFormState } from '../../hooks/usePointForm';
import { FormField } from './FormField';

interface PointFieldsProps {
  form: PointFormState;
  slugLocked: boolean;
}

/** Campos do ponto: nome, identificador (slug), resumo e historia. */
export function PointFields({ form, slugLocked }: PointFieldsProps) {
  const { values, errors, setField } = form;
  const slugHint = slugLocked
    ? 'Despublique para alterar o identificador.'
    : `Aparece no endereço do QR Code: /p/${values.slug || '<slug>'}`;

  return (
    <div className="space-y-5">
      <FormField
        label="Nome"
        value={values.name}
        error={errors.name}
        onChange={(value) => {
          setField('name', value);
        }}
      />
      <FormField
        label="Identificador"
        value={values.slug}
        error={errors.slug}
        hint={slugHint}
        disabled={slugLocked}
        onChange={(value) => {
          setField('slug', value);
        }}
      />
      <FormField
        label="Resumo"
        value={values.summary}
        error={errors.summary}
        maxLength={SUMMARY_MAX}
        onChange={(value) => {
          setField('summary', value);
        }}
      />
      <FormField
        label="História"
        value={values.history}
        error={errors.history}
        maxLength={HISTORY_MAX}
        multiline
        onChange={(value) => {
          setField('history', value);
        }}
      />
    </div>
  );
}
