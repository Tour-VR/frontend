import { ErrorState } from '../../components/feedback/ErrorState';
import { LoadingState } from '../../components/feedback/LoadingState';
import { PageHeader } from '../../components/ui/PageHeader';
import { ROLE_CHANGE_NOTICE } from '../../constants/users';
import { useAuth } from '../../contexts/AuthContext';
import { useUsers } from '../../hooks/useUsers';
import { Pagination } from './Pagination';
import { UserCreateForm } from './UserCreateForm';
import { UsersTable } from './UsersTable';

export function UsersPage() {
  const { user } = useAuth();
  const state = useUsers();

  function renderBody() {
    if (state.loading) return <LoadingState />;
    if (state.error) return <ErrorState message={state.error} onRetry={state.reload} />;
    return (
      <UsersTable
        users={state.users}
        currentEmail={user?.email}
        onToggleActive={(target) => void state.toggleActive(target)}
        onChangeRole={(target, role) => void state.changeRole(target, role)}
      />
    );
  }

  return (
    <>
      <PageHeader title="Usuários" description={`Quem acessa o painel. ${ROLE_CHANGE_NOTICE}`} />
      <UserCreateForm onCreated={state.showNewest} />
      {state.actionError ? (
        <p role="alert" className="mb-4 text-sm text-red-600">
          {state.actionError}
        </p>
      ) : null}
      {renderBody()}
      <Pagination page={state.page} totalPages={state.totalPages} onChange={state.setPage} />
    </>
  );
}
