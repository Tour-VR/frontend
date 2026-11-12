interface StatusPulseProps {
  online: boolean;
}

/** Ponto de status: verde com anel pulsante quando online, cinza parado quando offline. */
export function StatusPulse({ online }: StatusPulseProps) {
  return (
    <span className="relative inline-flex h-2.5 w-2.5">
      {online ? (
        <span
          data-testid="status-pulse-ring"
          className="absolute inset-0 animate-pulse-ring rounded-full bg-green-500"
        />
      ) : null}
      <span
        className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
          online ? 'bg-green-500' : 'bg-gray-400'
        }`}
      />
      <span className="sr-only">{online ? 'online' : 'offline'}</span>
    </span>
  );
}
