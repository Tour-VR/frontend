import type { SubmitEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { POINT_MESSAGES } from '../constants/points';
import { createPoint, updatePoint } from '../services/points';
import type { Point, PointUpdate } from '../types';
import { apiErrorMessage, apiErrorStatus } from '../utils/apiError';
import { slugify } from '../utils/slugify';
import type { PointFormErrors, PointFormValues } from '../utils/validatePoint';
import { validatePoint } from '../utils/validatePoint';

const HTTP_CONFLICT = 409;

function initialValues(point: Point | null): PointFormValues {
  return {
    name: point?.name ?? '',
    slug: point?.slug ?? '',
    summary: point?.summary ?? '',
    history: point?.history ?? '',
  };
}

/** Payload do PUT: so os campos do formulario (nunca `media`); slug fica fora se publicado. */
export function buildUpdatePayload(point: Point, values: PointFormValues): PointUpdate {
  const { slug, ...rest } = values;
  return point.status === 'published' ? rest : { ...rest, slug };
}

interface UsePointFormOptions {
  point: Point | null;
  onSaved: (point: Point) => void;
  initialNotice?: string | null;
}

/** Estado, validacao e envio do formulario de ponto (criacao e edicao). */
export function usePointForm({ point, onSaved, initialNotice = null }: UsePointFormOptions) {
  const [values, setValues] = useState(() => initialValues(point));
  const [errors, setErrors] = useState<PointFormErrors>({});
  const [slugTouched, setSlugTouched] = useState(point !== null);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(initialNotice);
  const navigate = useNavigate();

  function setField(field: keyof PointFormValues, value: string) {
    if (field === 'slug') setSlugTouched(true);
    setValues((current) => {
      const next = { ...current, [field]: value };
      if (field === 'name' && !slugTouched) next.slug = slugify(value);
      return next;
    });
  }

  async function save() {
    if (point === null) {
      const created = await createPoint(values);
      void navigate(`/pontos/${created.id}`, { state: { notice: POINT_MESSAGES.created } });
      return;
    }
    onSaved(await updatePoint(point.id, buildUpdatePayload(point, values)));
    setNotice(POINT_MESSAGES.saved);
  }

  function handleError(err: unknown) {
    if (apiErrorStatus(err) === HTTP_CONFLICT) {
      setErrors({ slug: POINT_MESSAGES.slugTaken });
    } else {
      setApiError(apiErrorMessage(err));
    }
  }

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);
    setApiError(null);
    const found = validatePoint(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setSubmitting(true);
    try {
      await save();
    } catch (err) {
      handleError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return { values, errors, setField, submitting, apiError, notice, submit };
}

export type PointFormState = ReturnType<typeof usePointForm>;
