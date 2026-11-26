import { useState } from 'react';
import { ErrorState } from '../../components/feedback/ErrorState';
import { LoadingState } from '../../components/feedback/LoadingState';
import { PageHeader } from '../../components/ui/PageHeader';
import { ROLE_CHANGE_NOTICE, USER_UPDATED_MESSAGE } from '../../constants/users';
import { useAuth } from '../../contexts/AuthContext';
import { useUsers } from '../../hooks/useUsers';
import { Pagination } from './Pagination';
import type { AdminUser } from '../../types';
import { UserCreateForm } from './UserCreateForm';
import { UserEditDialog } from './UserEditDialog';
import { UsersTable } from './UsersTable';

export function UsersPage() {
  const { user, signOut } = useAuth();
  const state = useUsers();
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function handleSaved(before: AdminUser, after: AdminUser) {
    setEditing(null);
    // O token identifica o usuario pelo e-mail: mudar o proprio e-mail exige novo login.
    if (before.email === user?.email && after.email !== before.email) {
      signOut();
      return;
    }
    setNotice(USER_UPDATED_MESSAGE);
    state.reload();
  }

  function renderBody() {
    if (state.loading) return <LoadingState />;
    if (state.error) return <ErrorState message={state.error} onRetry={state.reload} />;
    return (
      <UsersTable
        users={state.users}
        currentEmail={user?.email}
        onToggleActive={(target) => void state.toggleActive(target)}
        onChangeRole={(target, role) => void state.changeRole(target, role)}
        onEdit={(target) => {
          setNotice(null);
          setEditing(target);
        }}
      />
    );
  }

  return (
    <>
      <PageHeader title="Usuários" description={`Quem acessa o painel. ${ROLE_CHANGE_NOTICE}`} />
      <UserCreateForm onCreated={state.showNewest} />
      {notice ? (
        <p role="status" className="mb-4 text-sm text-green-700">
          {notice}
        </p>
      ) : null}
      {state.actionError ? (
        <p role="alert" className="mb-4 text-sm text-red-600">
          {state.actionError}
        </p>
      ) : null}
      {renderBody()}
      <Pagination page={state.page} totalPages={state.totalPages} onChange={state.setPage} />
      {editing ? (
        <UserEditDialog
          user={editing}
          isSelf={editing.email === user?.email}
          onClose={() => {
            setEditing(null);
          }}
          onSaved={handleSaved}
        />
      ) : null}
    </>
  );
}
