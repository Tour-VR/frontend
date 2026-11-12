interface SessionNoticeProps {
  message: string | null;
}

/** Caixa amarela com o motivo de a sessao ter terminado (ex.: token expirado). */
export function SessionNotice({ message }: SessionNoticeProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="status"
      className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-center text-sm text-yellow-800"
    >
      {message}
    </div>
  );
}
