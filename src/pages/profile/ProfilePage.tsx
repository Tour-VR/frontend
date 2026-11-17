import { PageHeader } from '../../components/ui/PageHeader';
import { PasswordForm } from './PasswordForm';
import { ProfileForm } from './ProfileForm';

export function ProfilePage() {
  return (
    <>
      <PageHeader title="Meu perfil" description="Seus dados de acesso ao painel." />
      <div className="grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
        <ProfileForm />
        <PasswordForm />
      </div>
    </>
  );
}
