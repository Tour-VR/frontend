import { useCallback, useEffect, useState } from 'react';
import { roleChangeConfirmation, USERS_PAGE_SIZE } from '../constants/users';
import { listUsers, updateUserAdmin } from '../services/users';
import type { AdminUser, UserAdminUpdate, UserList, UserRole } from '../types';
import { apiErrorMessage } from '../utils/apiError';

interface ListResult {
  key: string;
  list: UserList | null;
  error: string | null;
}

/** Busca uma pagina de usuarios. Cada busca tem uma chave; sem resposta dela, esta carregando. */
function useUserPage(page: number) {
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState<ListResult | null>(null);
  const key = `${String(page)}:${String(version)}`;

  useEffect(() => {
    let active = true;
    listUsers(page, USERS_PAGE_SIZE)
      .then((list) => {
        if (active) setResult({ key, list, error: null });
      })
      .catch((err: unknown) => {
        if (active) setResult({ key, list: null, error: apiErrorMessage(err) });
      });
    return () => {
      active = false;
    };
  }, [key, page]);

  const reload = useCallback(() => {
    setVersion((current) => current + 1);
  }, []);

  const loading = result?.key !== key;
  return {
    list: loading ? null : result.list,
    loading,
    error: loading ? null : result.error,
    reload,
  };
}

/** Lista paginada de usuarios e as acoes de ativar/desativar e mudar papel. */
export function useUsers() {
  const [page, setPage] = useState(1);
  const { list, loading, error, reload } = useUserPage(page);
  const [actionError, setActionError] = useState<string | null>(null);

  async function apply(user: AdminUser, payload: UserAdminUpdate) {
    setActionError(null);
    try {
      await updateUserAdmin(user.id, payload);
      reload();
    } catch (err) {
      setActionError(apiErrorMessage(err));
    }
  }

  async function toggleActive(user: AdminUser) {
    await apply(user, { is_active: !user.is_active });
  }

  async function changeRole(user: AdminUser, role: UserRole) {
    if (!window.confirm(roleChangeConfirmation(user.email))) return;
    await apply(user, { role });
  }

  // Usuario recem-criado aparece no topo: volta para a primeira pagina e recarrega.
  function showNewest() {
    setPage(1);
    reload();
  }

  const totalPages = list ? Math.max(1, Math.ceil(list.total / list.page_size)) : 1;
  return {
    users: list?.items ?? [],
    page,
    totalPages,
    setPage,
    loading,
    error,
    reload,
    actionError,
    toggleActive,
    changeRole,
    showNewest,
  };
}
